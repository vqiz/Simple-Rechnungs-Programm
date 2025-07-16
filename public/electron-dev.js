const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Wichtig für sicheren Zugriff
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadURL('http://localhost:3000');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});


// ✅ NEU: Dateioperationen und Dialoge per IPC

ipcMain.handle('read-file', async (_, filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.writeFile(filePath, "{}", 'utf-8');
      return "{}";
    }
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
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('dialog:saveFile', async () => {
  const result = await dialog.showSaveDialog({});
  return result.canceled ? null : result.filePath;
});