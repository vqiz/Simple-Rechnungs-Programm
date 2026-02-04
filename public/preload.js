const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  readFile: (path) => ipcRenderer.invoke('read-file', path),
  writeFile: (path, content) => ipcRenderer.invoke('write-file', path, content),
  deleteFile: (path) => ipcRenderer.invoke("deleteFile", path),
  openFileDialog: () => ipcRenderer.invoke('dialog:openFile'),
  saveFileDialog: () => ipcRenderer.invoke('dialog:saveFile'),
  listfiles: (path) => ipcRenderer.invoke("list-files", path),
  saveFileToPath: (content, filePath) =>
    ipcRenderer.invoke('save-file-to-path', { content, filePath }),
  getpath: (path) => ipcRenderer.invoke("get-path", path),
  delFile: (path) => ipcRenderer.invoke("delete-file", path),
  openMail: (path, empfänger, subject, body) => ipcRenderer.invoke("open-mail", path, empfänger, subject, body),
  createPdfBuffer: (path) => ipcRenderer.invoke("create-pdf-buffer", path),
  saveERechnung: (content, name) => ipcRenderer.invoke("save-e-rechnung", content, name),
  copyFile: (path) => ipcRenderer.invoke("copy-file-to-path", path),
  getFullpath: (path) => ipcRenderer.invoke("getFullPath", path),
  saveAttachment: (data) => ipcRenderer.invoke("save-attachment", data),
  readAttachment: (path) => ipcRenderer.invoke("read-attachment", path),
  openExternal: (path) => ipcRenderer.invoke("open-external", path),
});