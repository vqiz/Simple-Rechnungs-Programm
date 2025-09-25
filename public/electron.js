const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;


function createWindow() {
  console.log("Creating window...");

  const indexPath = path.join(__dirname, 'index.html');

  if (!fs.existsSync(indexPath)) {
    console.error("❌ build/index.html NOT FOUND at:", indexPath);
    app.quit();
    return;
  }

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 1200,
    minHeight: 800,
    icon: path.join(__dirname, "icon.png"),
    title: "Rechnix",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'), // ← Wichtig!
    },
  });
  app.dock.setIcon(path.join(__dirname, "icon.png"));
  win.loadFile(indexPath)
    .then(() => console.log("Window loaded"))
    .catch(err => {
      console.error("Failed to load index.html:", err);
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
    await fs.writeFile(filePath, content, 'utf-8');
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