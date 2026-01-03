const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;


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

    await fsPromises.writeFile(filePath, content, 'utf-8');
    return 'success';
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
