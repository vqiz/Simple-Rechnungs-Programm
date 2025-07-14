const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  console.log("Creating window...");

  const indexPath = path.join(__dirname, '../build/index.html');

  if (!fs.existsSync(indexPath)) {
    console.error("❌ build/index.html NOT FOUND at:", indexPath);
    app.quit();
    return;
  }

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
    },
  });

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