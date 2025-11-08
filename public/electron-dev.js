const { app, BrowserWindow, ipcMain, dialog, Menu, shell } = require('electron');
const path = require('path');
const { pathToFileURL } = require('url');
const fs = require('fs').promises;
const os = require('os');
const { writeFile } = require('fs');
let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1920,
    height: 1080,
    minWidth: 1200,
    minHeight: 800,
    contextIsolation: true, // keeps your renderer safe
    nodeIntegration: false, // should stay false
    icon: path.join(__dirname, "icon.png"),
    title: "Rechnix",
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Wichtig für sicheren Zugriff
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  app.dock.setIcon(path.join(__dirname, "icon.png"));
  win.loadURL('http://localhost:3000');
  win.setTitle("Rechnix");
  win.webContents.openDevTools();


  const menuTemplate = [
    {
      label: "Electron",
      submenu: [{ label: 'Beenden', role: 'quit' }],

    },
    {
      label: 'Datei', // File
      submenu: [
        { label: 'Neu', click: () => console.log('Neu clicked') },
        { label: 'Öffnen', click: () => console.log('Öffnen clicked') },
        { type: 'separator' },
        { label: 'Beenden', role: 'quit' }
      ]
    },
    {
      label: "Sicherung",
      submenu: [
        { type: 'separator' },
        { label: "Gesammtsicherung erstellen", click: () => console.log("soon") }
      ]
    },
    {
      label: "Export",
      submenu: [
        { label: "Letztes Jahr Exportieren", click: () => console.log("soon") },
        { label: "Letztes Quatal Exportieren", click: () => console.log("soon") },
        { label: "Letzten Monat Exportieren", click: () => console.log("soon") },
      ]
    },
    {
      label: 'Hilfe', // View
      submenu: [
        { label: "Neu Laden", role: 'reload' },
        { label: "Entwicklungsoptionen anzeigen", role: 'toggledevtools' },
        { type: 'separator' },
      ]
    }
  ];
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);



}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
ipcMain.handle("list-files", async (_, filePath) => {
  try {
    const files = await fs.readdir(filePath, { withFileTypes: true });
    return files.map(entry => ({
      name: entry.name,
      isDirectory: entry.isDirectory(),
    }));
  } catch (err) {
    console.error(`Error reading directory "${filePath}":`, err);
    return [];
  }
});


ipcMain.handle('read-file', async (_, filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  } catch (err) {
    if (err.code === 'ENOENT') {
      const dir = path.dirname(filePath);


      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (mkdirErr) {
        console.error("Fehler beim Erstellen des Ordners:", mkdirErr);
        return null;
      }


      await fs.writeFile(filePath, "{}", 'utf-8');
      return "{}";
    }

    console.error("Fehler beim Lesen der Datei:", err);
    return null;
  }
});

ipcMain.handle('write-file', async (_, filePath, content) => {
  try {
    await fs.writeFile(filePath, content, { encoding: 'utf-8', flag: 'w', });
    return 'success';
  } catch (err) {
    console.error("Fehler beim Schreiben:", err);
    return 'error';
  }
});

ipcMain.handle('delete-file', async (_, filePath) => {
  try {
    await fs.unlink(filePath);
    return { success: true };
  } catch (err) {
    console.error("Fehler beim Löschen der Datei:", err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('dialog:saveFile', async () => {
  const result = await dialog.showSaveDialog({});
  return result.canceled ? null : result.filePath;
});

ipcMain.handle('save-file-to-path', async (event, { content, filePath }) => {
  try {
    const buffer = Buffer.from(content);
    await fs.writeFile(filePath, buffer); // asynchronous version
    return { success: true, path: filePath };
  } catch (err) {
    console.error('Error saving file:', err);
    return { success: false, error: err.message };
  }
});
//example logo/logo.png
ipcMain.handle("get-path", async (event, relativePath) => {
  const { pathToFileURL } = require('url');
  const { join } = require('path');
  const fullPath = join(__dirname, relativePath); // absolute path
  return pathToFileURL(fullPath).href;          // return file:// URL
});
ipcMain.handle("open-mail", async (_, fileurl, empfänger, sub, b) => {
  // Öffnet den Datei-Explorer mit markierter Datei
  shell.showItemInFolder(fileurl);

  // Öffnet das Standard-Mailprogramm mit Betreff und Empfänger
  const recipient = empfänger;
  const subject = encodeURIComponent(sub);
  const body = encodeURIComponent(b);

  shell.openExternal(`mailto:${recipient}?subject=${subject}&body=${body}`);
});
ipcMain.handle("create-pdf-buffer", async (_, pdfData) => {
  // Hole den PDF-Buffer
  const buffer = Buffer.from(pdfData, 'base64');
  const tmpPath = path.join(os.tmpdir(), 'rechnung.pdf');
  await fs.writeFile(tmpPath, buffer);
  return tmpPath;
});
ipcMain.handle("save-e-rechnung", async (_, xmlContent, defaultName) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'E-Rechnung speichern',
    defaultPath: defaultName,
    filters: [{ name: 'XML-Dateien', extensions: ['xml'] }],
  });

  if (canceled) return;

  await fs.writeFile(filePath, xmlContent, 'utf8');  // ✅ use promises
  console.log(`✅ E-Rechnung saved to ${filePath}`);
});

ipcMain.handle('copy-file-to-path', async (_, destinationPath) => {
  try {
    // 1️⃣ Ask the user to pick an existing file
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: 'Select a file to copy',
      properties: ['openFile'],
      filters: [
        { name: 'Allowed Files', extensions: ['pdf', 'xml'] }
      ]
    });

    if (canceled || filePaths.length === 0) {
      return { success: false, canceled: true };
    }

    const sourcePath = filePaths[0];

    // 2️⃣ Copy the file to the destination path
    await fs.copyFile(sourcePath, destinationPath);

    console.log(`✅ File copied from ${sourcePath} to ${destinationPath}`);
    return { success: true, source: sourcePath, destination: destinationPath };
  } catch (error) {
    console.error('❌ Failed to copy file:', error);
    return { success: false, error: error.message };
  }
});


ipcMain.handle('deleteFile', async (_, path) => {
  try {
    await fs.unlink(path);
    console.log(`${path} wurde gelöscht`);
  } catch (err) {
    console.error(`Fehler beim Löschen von ${path}:`, err);
  }
})
