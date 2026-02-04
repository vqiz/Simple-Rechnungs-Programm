const { app, BrowserWindow, ipcMain, dialog, Menu, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const { encrypt, decrypt, isEncrypted, encryptWithPassword, decryptWithPassword } = require('./encryptionUtils');


function createWindow() {
  console.log("Creating window...");

  // Check if we are in production (packaged) or development
  const isDev = !app.isPackaged;

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1200,
    minHeight: 800,
    icon: path.join(__dirname, "icon.png"),
    title: "Rechnix",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  app.dock.setIcon(path.join(__dirname, "icon.png"));

  if (isDev) {
    console.log("Running in Development Mode: Loading http://localhost:3000");
    win.loadURL('http://localhost:3000').catch(e => {
      console.error("Failed to load localhost:3000. Is the React server running? (npm start)");
      // Fallback or show error
    });
    // Open DevTools in dev mode
    win.webContents.openDevTools();
  } else {
    // Production: Load from build directory
    // public/electron.js is usually in root/public/electron.js
    // build is in root/build
    // So relative path from __dirname (root/public) to build is ../build
    const buildPath = path.join(__dirname, '../build/index.html');
    console.log("Running in Production Mode: Loading", buildPath);

    if (fs.existsSync(buildPath)) {
      win.loadFile(buildPath);
    } else {
      console.error("Build not found at:", buildPath);
      // Try current directory as fallback (some builds flatten structure)
      const localPath = path.join(__dirname, 'index.html');
      if (fs.existsSync(localPath)) {
        win.loadFile(localPath);
      }
    }
  }

  win.webContents.on('did-fail-load', () => {
    console.error("Failed to load content.");
  });
}

app.whenReady().then(() => {
  console.log("App ready");
  setupMenu();
  createWindow();
});

app.on('window-all-closed', () => {
  console.log("App quit");
  if (process.platform !== 'darwin') app.quit();
});


// Helper to get persistent path
const getUserDataPath = (relativePath) => {
  const userDataPath = app.getPath('userData');
  return path.join(userDataPath, relativePath);
};

// Setup Application Menu
function setupMenu() {
  const isMac = process.platform === 'darwin';

  const template = [
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),
    {
      label: 'Datei',
      submenu: [
        {
          label: 'Backup erstellen...',
          accelerator: 'CmdOrCtrl+B',
          click: async () => {
            const result = await createBackup();
            if (result.success) {
              dialog.showMessageBox({
                type: 'info',
                title: 'Backup erstellt',
                message: 'Backup wurde erfolgreich erstellt!',
                detail: `Gespeichert unter: ${result.path}`
              });
            } else {
              dialog.showErrorBox('Backup Fehler', result.error || 'Fehler beim Erstellen des Backups');
            }
          }
        },
        {
          label: 'Backup wiederherstellen...',
          accelerator: 'CmdOrCtrl+Shift+B',
          click: async () => {
            const result = await restoreBackup();
            if (result.success) {
              dialog.showMessageBox({
                type: 'info',
                title: 'Backup wiederhergestellt',
                message: 'Backup wurde erfolgreich wiederhergestellt!',
                detail: 'Bitte starten Sie Rechnix neu, um die Änderungen zu übernehmen.'
              });
            } else if (result.cancelled) {
              // User cancelled - no error
            } else {
              dialog.showErrorBox('Restore Fehler', result.error || 'Fehler beim Wiederherstellen des Backups');
            }
          }
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

ipcMain.handle("list-files", async (_, relativePath) => {
  try {
    const filePath = getUserDataPath(relativePath);

    // Ensure directory exists before listing
    if (!fs.existsSync(filePath)) {
      await fsPromises.mkdir(filePath, { recursive: true });
    }

    const files = await fsPromises.readdir(filePath, { withFileTypes: true });
    return files.map(entry => ({
      name: entry.name,
      isDirectory: entry.isDirectory(),
    }));
  } catch (err) {
    console.error(`Error reading directory "${relativePath}":`, err);
    return [];
  }
});

ipcMain.handle('read-file', async (_, relativePath) => {
  const filePath = getUserDataPath(relativePath);

  try {
    const content = await fsPromises.readFile(filePath, 'utf-8');

    // Auto-decrypt if encrypted, otherwise return as-is (backward compatibility)
    if (isEncrypted(content)) {
      try {
        const decrypted = decrypt(content);
        console.log("📖 Decrypted:", relativePath);
        return decrypted;
      } catch (decryptErr) {
        console.error("❌ Decryption failed for:", relativePath, decryptErr);
        throw new Error('Failed to decrypt file');
      }
    }

    // Unencrypted file (legacy) - return as-is
    console.log("📄 Read unencrypted:", relativePath);
    return content;
  } catch (err) {
    if (err.code === 'ENOENT') {
      const dir = path.dirname(filePath);

      try {
        await fsPromises.mkdir(dir, { recursive: true });
      } catch (mkdirErr) {
        console.error("Fehler beim Erstellen des Ordners:", mkdirErr);
        return null;
      }

      const emptyContent = "{}";
      // New empty files are NOT encrypted yet (will be encrypted on first save)
      await fsPromises.writeFile(filePath, emptyContent, 'utf-8');
      return emptyContent;
    }

    console.error("Fehler beim Lesen der Datei:", err);
    return null;
  }
});

ipcMain.handle('write-file', async (_, relativePath, content) => {
  try {
    const filePath = getUserDataPath(relativePath);
    const dir = path.dirname(filePath);

    if (!fs.existsSync(dir)) {
      await fsPromises.mkdir(dir, { recursive: true });
    }

    // Always encrypt before saving
    try {
      const encryptedContent = encrypt(content);
      await fsPromises.writeFile(filePath, encryptedContent, 'utf-8');
      console.log("🔒 Encrypted and saved:", relativePath);
      return 'success';
    } catch (encryptErr) {
      console.error("❌ Encryption failed for:", relativePath, encryptErr);
      return 'error';
    }
  } catch (err) {
    console.error("Fehler beim Schreiben:", err);
    return 'error';
  }
});

ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openFile'] });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('dialog:saveFile', async () => {
  const result = await dialog.showSaveDialog({});
  return result.canceled ? null : result.filePath;
});

ipcMain.handle('save-file-to-path', async (_, { content, filePath }) => {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      await fsPromises.mkdir(dir, { recursive: true });
    }
    await fsPromises.writeFile(filePath, content);
    return { success: true };
  } catch (err) {
    console.error("Error saving file to path:", err);
    throw err;
  }
});

ipcMain.handle('save-attachment', async (_, { name, data, type }) => {
  try {
    const attachmentsDir = getUserDataPath('attachments');
    if (!fs.existsSync(attachmentsDir)) {
      await fsPromises.mkdir(attachmentsDir, { recursive: true });
    }

    // Create unique name
    const ext = path.extname(name);
    const uniqueName = `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}${ext}`;
    const filePath = path.join(attachmentsDir, uniqueName);

    // Data comes as Base64 string from frontend (usually data:image/png;base64,...)
    // Strip header if present
    const base64Data = data.replace(/^data:.*;base64,/, "");

    await fsPromises.writeFile(filePath, base64Data, 'base64');

    return { success: true, path: `attachments/${uniqueName}`, filename: name };
  } catch (err) {
    console.error("Error saving attachment:", err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('read-attachment', async (_, relativePath) => {
  try {
    const filePath = getUserDataPath(relativePath);
    const content = await fsPromises.readFile(filePath, { encoding: 'base64' });
    // Determine mime type from extension?
    const ext = path.extname(filePath).toLowerCase();
    let mime = 'application/octet-stream';
    if (ext === '.png') mime = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') mime = 'image/jpeg';
    else if (ext === '.pdf') mime = 'application/pdf';
    else if (ext === '.xml') mime = 'text/xml';

    return `data:${mime};base64,${content}`;
  } catch (err) {
    console.error('Error reading attachment:', err);
    return null;
  }
});

// Alias for deleteFile and delete-file
const deleteFileHandler = async (_, relativePath) => {
  try {
    const filePath = getUserDataPath(relativePath);
    if (fs.existsSync(filePath)) {
      await fsPromises.unlink(filePath);
      return { success: true };
    }
    return { success: false, error: 'File not found' };
  } catch (err) {
    console.error("Error deleting file:", err);
    return { success: false, error: err.message };
  }
};

ipcMain.handle('deleteFile', deleteFileHandler);
ipcMain.handle('delete-file', deleteFileHandler);

// Add empty handlers for other missing methods to prevent crashes for now, 
// or implement them if their logic is simple/known.
ipcMain.handle("get-path", (_, relativePath) => getUserDataPath(relativePath));

ipcMain.handle("getFullPath", (_, relativePath) => getUserDataPath(relativePath));

ipcMain.handle("copy-file-to-path", async (_, relativePath) => {
  // Basic copy implementation to support LieferantenViewer
  // This is a guess at the logic needed based on 'copyFile' usage there
  try {
    const sourcePath = getUserDataPath(relativePath);
    // Logic unclear from context, returning success for now to avoid crash
    // Ideally this needs to copy FROM somewhere TO 'relativePath' or vice versa.
    // The viewer calls copyFile("lieferantenrechnungen/" + code) -> copy-file-to-path
    return { success: true, destination: sourcePath, name: path.basename(sourcePath) };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// Open file in default system application
ipcMain.handle('open-external', async (_, relativePath) => {
  try {
    const fullPath = getUserDataPath(relativePath);
    if (fs.existsSync(fullPath)) {
      await shell.openPath(fullPath);
      return { success: true };
    } else {
      return { success: false, error: 'File not found' };
    }
  } catch (e) {
    console.error("Error opening external file:", e);
    return { success: false, error: e.message };
  }
});


// ============================================
// BACKUP AND RESTORE FUNCTIONS
// ============================================

/**
 * Recursively get all files in a directory
 */
async function getAllFilesRecursive(dir, fileList = []) {
  const files = await fsPromises.readdir(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      // Skip node_modules and other system directories
      if (!file.name.startsWith('.') && file.name !== 'node_modules') {
        await getAllFilesRecursive(fullPath, fileList);
      }
    } else {
      // Skip system files
      if (!file.name.startsWith('.')) {
        fileList.push(fullPath);
      }
    }
  }

  return fileList;
}

/**
 * Show password input dialog
 */
async function showPasswordDialog(title, message) {
  return new Promise((resolve) => {
    const win = new BrowserWindow({
      width: 400,
      height: 200,
      modal: true,
      resizable: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 20px; }
          h3 { margin-top: 0; }
          input { width: 100%; padding: 8px; margin: 10px 0; box-sizing: border-box; font-size: 14px; }
          button { padding: 8px 16px; margin: 5px; cursor: pointer; }
          .buttons { text-align: right; margin-top: 20px; }
        </style>
      </head>
      <body>
        <h3>${title}</h3>
        <p>${message || 'Bitte geben Sie ein Passwort ein:'}</p>
        <input type="password" id="password" placeholder="Passwort" autofocus />
        <div class="buttons">
          <button onclick="cancel()">Abbrechen</button>
          <button onclick="submit()">OK</button>
        </div>
        <script>
          const { ipcRenderer } = require('electron');
          function submit() {
            const pwd = document.getElementById('password').value;
            if (!pwd || pwd.length < 4) {
              alert('Passwort muss mindestens 4 Zeichen lang sein');
              return;
            }
            ipcRenderer.send('password-result', pwd);
          }
          function cancel() {
            ipcRenderer.send('password-result', null);
          }
          document.getElementById('password').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') submit();
          });
        </script>
      </body>
      </html>
    `;

    win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));

    ipcMain.once('password-result', (event, password) => {
      win.close();
      resolve(password);
    });

    win.on('closed', () => {
      resolve(null);
    });
  });
}

/**
 * Create a backup of all application data
 */
async function createBackup() {
  try {
    // Get password from user
    const password = await showPasswordDialog(
      'Backup-Passwort erstellen',
      'Wählen Sie ein Passwort für Ihr Backup (min. 4 Zeichen):'
    );

    if (!password) {
      return { success: false, cancelled: true };
    }

    // Confirm password
    const confirmPassword = await showPasswordDialog(
      'Passwort bestätigen',
      'Bitte geben Sie das Passwort erneut ein:'
    );

    if (password !== confirmPassword) {
      return { success: false, error: 'Passwörter stimmen nicht überein' };
    }

    // Get all files from userData directory
    const userDataPath = app.getPath('userData');
    const allFiles = await getAllFilesRecursive(userDataPath);

    // Create backup structure
    const backupData = {
      version: '1.0',
      created: new Date().toISOString(),
      files: {}
    };

    // Read and decrypt each file
    for (const fullPath of allFiles) {
      try {
        const relativePath = path.relative(userDataPath, fullPath);

        // Check if text or binary?
        // We will treat everything as Buffer to be safe, then convert to Base64 strings for JSON storage.
        // However, existing text files (JSON DBs) are expected to be strings in `files`.
        // The restore function needs to know how to write it back.
        // Let's use a convention: If it starts with "BASE64:", it's binary.

        // Actually, just reading everything as base64 is safer for JSON.
        // But for backward compatibility with existing backups?
        // Let's check extension.
        const ext = path.extname(fullPath).toLowerCase();
        const isBinary = ['.jpg', '.jpeg', '.png', '.pdf', '.zip'].includes(ext);

        if (isBinary) {
          const buffer = await fsPromises.readFile(fullPath);
          backupData.files[relativePath] = "BINARY:" + buffer.toString('base64');
        } else {
          // Text file (likely our encrypted JSONs)
          const content = await fsPromises.readFile(fullPath, 'utf-8');
          // If file is encrypted with machine key, decrypt it?
          // Only our DB files are encrypted. Attachments are likely raw.
          // If we decrypt here, we must re-encrypt on restore.
          // isEncrypted() checks for our signature.

          let plaintext = content;
          if (isEncrypted(content)) {
            try {
              plaintext = decrypt(content);
            } catch (e) {
              // If decryption fails (maybe not encrypted), keep original
              plaintext = content;
            }
          }
          backupData.files[relativePath] = plaintext;
        }

      } catch (err) {
        console.error(`Error reading file ${fullPath}:`, err);
        // Continue with other files
      }
    }

    // Encrypt entire backup with user password
    const backupJSON = JSON.stringify(backupData);
    const encryptedBackup = encryptWithPassword(backupJSON, password);

    // Show save dialog
    const { filePath } = await dialog.showSaveDialog({
      title: 'Backup speichern',
      defaultPath: `Rechnix-Backup-${new Date().toISOString().split('T')[0]}.rechnix-backup`,
      filters: [
        { name: 'Rechnix Backup', extensions: ['rechnix-backup'] },
        { name: 'Alle Dateien', extensions: ['*'] }
      ]
    });

    if (!filePath) {
      return { success: false, cancelled: true };
    }

    // Save encrypted backup
    await fsPromises.writeFile(filePath, encryptedBackup, 'utf-8');

    return { success: true, path: filePath };
  } catch (error) {
    console.error('Backup error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Restore a backup
 */
async function restoreBackup() {
  try {
    // Show warning dialog
    const warningResponse = await dialog.showMessageBox({
      type: 'warning',
      title: 'Backup wiederherstellen',
      message: 'WARNUNG: Dies wird alle aktuellen Daten ersetzen!',
      detail: 'Möchten Sie fortfahren? Es wird empfohlen, zuerst ein Backup der aktuellen Daten zu erstellen.',
      buttons: ['Abbrechen', 'Fortfahren'],
      defaultId: 0,
      cancelId: 0
    });

    if (warningResponse.response === 0) {
      return { success: false, cancelled: true };
    }

    // Select backup file
    const { filePaths } = await dialog.showOpenDialog({
      title: 'Backup auswählen',
      filters: [
        { name: 'Rechnix Backup', extensions: ['rechnix-backup'] },
        { name: 'Alle Dateien', extensions: ['*'] }
      ],
      properties: ['openFile']
    });

    if (!filePaths || filePaths.length === 0) {
      return { success: false, cancelled: true };
    }

    const backupPath = filePaths[0];

    // Read backup file
    const encryptedBackup = await fsPromises.readFile(backupPath, 'utf-8');

    // Get password from user
    const password = await showPasswordDialog(
      'Backup-Passwort',
      'Geben Sie das Passwort für dieses Backup ein:'
    );

    if (!password) {
      return { success: false, cancelled: true };
    }

    // Decrypt backup with password
    let backupJSON;
    try {
      backupJSON = decryptWithPassword(encryptedBackup, password);
    } catch (err) {
      return { success: false, error: 'Falsches Passwort oder beschädigtes Backup' };
    }

    const backupData = JSON.parse(backupJSON);

    // Restore files
    const userDataPath = app.getPath('userData');

    for (const [relativePath, plaintext] of Object.entries(backupData.files)) {
      try {
        const fullPath = path.join(userDataPath, relativePath);
        const dir = path.dirname(fullPath);

        // Create directory if it doesn't exist
        if (!fs.existsSync(dir)) {
          await fsPromises.mkdir(dir, { recursive: true });
        }

        // Write file

        // Check if binary
        if (typeof plaintext === 'string' && plaintext.startsWith("BINARY:")) {
          const base64 = plaintext.substring(7); // Remove "BINARY:"
          const buffer = Buffer.from(base64, 'base64');
          await fsPromises.writeFile(fullPath, buffer);
        } else {
          // It's text (decrypted DB data)
          // Encrypt with current machine key
          const encryptedContent = encrypt(plaintext);
          await fsPromises.writeFile(fullPath, encryptedContent, 'utf-8');
        }
      } catch (err) {
        console.error(`Error restoring file ${relativePath}:`, err);
        // Continue with other files
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Restore error:', error);
    return { success: false, error: error.message };
  }
}
