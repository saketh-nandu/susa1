const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),

  // File dialogs
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),

  // File system operations
  readFile: (filePath) => ipcRenderer.invoke('fs-read-file', filePath),
  writeFile: (filePath, content) => ipcRenderer.invoke('fs-write-file', filePath, content),
  createFile: (filePath) => ipcRenderer.invoke('fs-create-file', filePath),
  deleteFile: (filePath) => ipcRenderer.invoke('fs-delete-file', filePath),
  renameFile: (oldPath, newPath) => ipcRenderer.invoke('fs-rename-file', oldPath, newPath),
  listDirectory: (dirPath) => ipcRenderer.invoke('fs-list-directory', dirPath),
  createDirectory: (dirPath) => ipcRenderer.invoke('fs-create-directory', dirPath),
  getWorkspacePath: () => ipcRenderer.invoke('fs-get-workspace-path'),

  // Menu events
  onMenuNewFile: (callback) => ipcRenderer.on('menu-new-file', callback),
  onMenuOpenFile: (callback) => ipcRenderer.on('menu-open-file', callback),
  onMenuSaveFile: (callback) => ipcRenderer.on('menu-save-file', callback),
  onMenuSaveAsFile: (callback) => ipcRenderer.on('menu-save-as-file', callback),
  onMenuRunFile: (callback) => ipcRenderer.on('menu-run-file', callback),
  onMenuRunSelection: (callback) => ipcRenderer.on('menu-run-selection', callback),
  onMenuFind: (callback) => ipcRenderer.on('menu-find', callback),
  onMenuReplace: (callback) => ipcRenderer.on('menu-replace', callback),
  onMenuFormatCode: (callback) => ipcRenderer.on('menu-format-code', callback),
  onMenuToggleTerminal: (callback) => ipcRenderer.on('menu-toggle-terminal', callback),

  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),

  // Platform info
  platform: process.platform,
  isElectron: true
});

// Expose a SUSA interpreter API
contextBridge.exposeInMainWorld('susaAPI', {
  // SUSA interpreter methods
  executeCode: (code, options) => ipcRenderer.invoke('susa-execute', code, options),
  validateCode: (code) => ipcRenderer.invoke('susa-validate', code),
  formatCode: (code) => ipcRenderer.invoke('susa-format', code),
  getSyntaxInfo: () => ipcRenderer.invoke('susa-syntax-info'),
  getExamples: () => ipcRenderer.invoke('susa-examples'),
  checkHealth: () => ipcRenderer.invoke('susa-health'),
  
  // File system operations
  readFile: (filePath) => ipcRenderer.invoke('fs-read-file', filePath),
  writeFile: (filePath, content) => ipcRenderer.invoke('fs-write-file', filePath, content),
  createFile: (filePath) => ipcRenderer.invoke('fs-create-file', filePath),
  deleteFile: (filePath) => ipcRenderer.invoke('fs-delete-file', filePath),
  renameFile: (oldPath, newPath) => ipcRenderer.invoke('fs-rename-file', oldPath, newPath),
  listDirectory: (dirPath) => ipcRenderer.invoke('fs-list-directory', dirPath),
  createDirectory: (dirPath) => ipcRenderer.invoke('fs-create-directory', dirPath),
  getWorkspacePath: () => ipcRenderer.invoke('fs-get-workspace-path'),
  showOpenDialog: () => ipcRenderer.invoke('fs-show-open-dialog'),
  showSaveDialog: (defaultPath) => ipcRenderer.invoke('fs-show-save-dialog', defaultPath),
  
  // App info
  isDesktopApp: true,
  version: '1.0.0',
  interpreter: 'embedded'
});