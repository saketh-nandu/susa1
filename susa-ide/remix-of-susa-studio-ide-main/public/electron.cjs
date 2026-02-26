const { app, BrowserWindow, Menu, dialog, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
// Check if we're in development mode without external dependency
const isDev = process.env.NODE_ENV === 'development' || (!app.isPackaged && !process.env.NODE_ENV);
const SUSAInterpreter = require('./susa-interpreter.cjs');

let mainWindow;
let susaInterpreter;

function createWindow() {
  // Initialize SUSA interpreter
  try {
    susaInterpreter = new SUSAInterpreter();
    console.log('SUSA Interpreter initialized successfully');
  } catch (error) {
    console.error('Failed to initialize SUSA interpreter:', error);
    dialog.showErrorBox('SUSA Interpreter Error', 
      `Failed to initialize SUSA interpreter: ${error.message}\n\nPlease ensure susa.py is available in the application directory.`);
  }
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.cjs'),
      devTools: false,  // Completely disable DevTools
      webSecurity: true,
      allowRunningInsecureContent: false,
      experimentalFeatures: false
    },
    icon: path.join(__dirname, 'susa-logo.ico'),
    title: 'SUSA IDE - Professional Development Environment',
    titleBarStyle: 'default',
    show: false,
    backgroundColor: '#1a1625',
    autoHideMenuBar: true,  // Hide menu bar for cleaner look
    frame: true,  // Keep window frame
    resizable: true,
    maximizable: true,
    minimizable: true,
    closable: true,
    fullscreenable: true,
    thickFrame: true,  // Enable thick frame for better resize handles
    hasShadow: true
  });

  // Load the app - try multiple possible paths
  let startUrl;
  if (isDev) {
    startUrl = 'http://localhost:5173';
  } else {
    // For production, use the built files in dist folder
    const distPath = path.join(__dirname, '..', 'dist', 'index.html');
    console.log('Looking for built files at:', distPath);
    
    if (fsSync.existsSync(distPath)) {
      startUrl = `file://${distPath}`;
      console.log('Found built index.html at:', distPath);
    } else {
      // Fallback paths
      const possiblePaths = [
        path.join(__dirname, 'index.html'),
        path.join(__dirname, 'dist', 'index.html'),
        path.join(__dirname, '..', 'dist', 'index.html'),
        path.join(process.resourcesPath, 'app', 'dist', 'index.html'),
        path.join(process.resourcesPath, 'dist', 'index.html')
      ];
      
      console.log('Checking fallback paths:');
      for (const testPath of possiblePaths) {
        console.log('Testing:', testPath);
        if (fsSync.existsSync(testPath)) {
          startUrl = `file://${testPath}`;
          console.log('Found index.html at:', testPath);
          break;
        }
      }
      
      if (!startUrl) {
        console.error('Could not find index.html in any expected location');
        startUrl = `file://${path.join(__dirname, 'index.html')}`; // fallback
      }
    }
  }
  
  console.log('Loading URL:', startUrl);
  console.log('__dirname:', __dirname);
  console.log('process.resourcesPath:', process.resourcesPath);
  console.log('isDev:', isDev);
  mainWindow.loadURL(startUrl);

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Disable right-click context menu
    mainWindow.webContents.on('context-menu', (event) => {
      event.preventDefault();
    });
    
    // Disable DevTools keyboard shortcuts
    mainWindow.webContents.on('before-input-event', (event, input) => {
      // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (
        input.key === 'F12' ||
        (input.control && input.shift && input.key === 'I') ||
        (input.control && input.shift && input.key === 'J') ||
        (input.control && input.shift && input.key === 'C')
      ) {
        event.preventDefault();
      }
    });
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Create application menu (set to null to hide menu bar)
  Menu.setApplicationMenu(null);
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New File',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-new-file');
          }
        },
        {
          label: 'Open File',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow, {
              properties: ['openFile'],
              filters: [
                { name: 'SUSA Files', extensions: ['susa'] },
                { name: 'All Files', extensions: ['*'] }
              ]
            });
            
            if (!result.canceled) {
              mainWindow.webContents.send('menu-open-file', result.filePaths[0]);
            }
          }
        },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow.webContents.send('menu-save-file');
          }
        },
        {
          label: 'Save As',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: async () => {
            const result = await dialog.showSaveDialog(mainWindow, {
              filters: [
                { name: 'SUSA Files', extensions: ['susa'] },
                { name: 'All Files', extensions: ['*'] }
              ]
            });
            
            if (!result.canceled) {
              mainWindow.webContents.send('menu-save-as-file', result.filePath);
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectall' },
        { type: 'separator' },
        {
          label: 'Find',
          accelerator: 'CmdOrCtrl+F',
          click: () => {
            mainWindow.webContents.send('menu-find');
          }
        },
        {
          label: 'Replace',
          accelerator: 'CmdOrCtrl+H',
          click: () => {
            mainWindow.webContents.send('menu-replace');
          }
        }
      ]
    },
    {
      label: 'Run',
      submenu: [
        {
          label: 'Run File',
          accelerator: 'F5',
          click: () => {
            mainWindow.webContents.send('menu-run-file');
          }
        },
        {
          label: 'Run Selection',
          accelerator: 'F9',
          click: () => {
            mainWindow.webContents.send('menu-run-selection');
          }
        },
        { type: 'separator' },
        {
          label: 'Format Code',
          accelerator: 'Shift+Alt+F',
          click: () => {
            mainWindow.webContents.send('menu-format-code');
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        { type: 'separator' },
        {
          label: 'Toggle Terminal',
          accelerator: 'Ctrl+`',
          click: () => {
            mainWindow.webContents.send('menu-toggle-terminal');
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'SUSA Documentation',
          click: () => {
            shell.openExternal('https://github.com/susa-lang/susa');
          }
        },
        {
          label: 'Report Issue',
          click: () => {
            shell.openExternal('https://github.com/susa-lang/susa/issues');
          }
        },
        { type: 'separator' },
        {
          label: 'About SUSA IDE',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About SUSA IDE',
              message: 'SUSA IDE v1.0',
              detail: 'Modern React TypeScript IDE for SUSA Programming Language\\n\\nBuilt with Electron, React, TypeScript, and Monaco Editor\\nCopyright (c) 2024 SUSA Development Team\\n\\nFeatures:\\n• SUSA syntax highlighting\\n• Integrated debugger\\n• Multi-language support\\n• Real-time code execution\\n• Professional development environment'
            });
          }
        }
      ]
    }
  ];

  // macOS specific menu adjustments
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// SUSA Interpreter IPC handlers
ipcMain.handle('susa-execute', async (event, code, options) => {
  console.log('SUSA execute request:', { code, options });
  
  if (!susaInterpreter) {
    console.error('SUSA interpreter not initialized');
    return {
      success: false,
      stdout: '',
      stderr: 'SUSA interpreter not initialized',
      exitCode: -1,
      executionTime: '0s'
    };
  }
  
  try {
    console.log('Executing SUSA code...');
    const result = await susaInterpreter.executeCode(code, options);
    console.log('SUSA execution result:', result);
    return result;
  } catch (error) {
    console.error('SUSA execution error:', error);
    return {
      success: false,
      stdout: '',
      stderr: error.stderr || error.message,
      exitCode: error.exitCode || -1,
      executionTime: error.executionTime || '0s'
    };
  }
});

ipcMain.handle('susa-validate', async (event, code) => {
  if (!susaInterpreter) {
    return {
      valid: false,
      errors: [{ message: 'SUSA interpreter not initialized', line: 1, column: 1, severity: 'error' }],
      warnings: [],
      tokens: 0,
      astNodes: 0
    };
  }
  
  try {
    return await susaInterpreter.validateCode(code);
  } catch (error) {
    return error;
  }
});

ipcMain.handle('susa-format', async (event, code) => {
  if (!susaInterpreter) {
    return {
      success: false,
      formattedCode: code,
      changesMade: false,
      error: 'SUSA interpreter not initialized'
    };
  }
  
  return await susaInterpreter.formatCode(code);
});

ipcMain.handle('susa-syntax-info', () => {
  if (!susaInterpreter) {
    return null;
  }
  
  return susaInterpreter.getSyntaxInfo();
});

ipcMain.handle('susa-examples', () => {
  if (!susaInterpreter) {
    return null;
  }
  
  return susaInterpreter.getExamples();
});

ipcMain.handle('susa-health', () => {
  return {
    status: susaInterpreter ? 'ok' : 'error',
    language: 'SUSA',
    version: '1.0',
    interpreter: 'embedded'
  };
});

// File System IPC handlers
ipcMain.handle('fs-read-file', async (event, filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return { success: true, content };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('fs-write-file', async (event, filePath, content) => {
  try {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    
    await fs.writeFile(filePath, content, 'utf8');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('fs-create-file', async (event, filePath) => {
  try {
    // Check if file already exists
    if (fsSync.existsSync(filePath)) {
      return { success: false, error: 'File already exists' };
    }
    
    // Ensure directory exists
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    
    // Create empty file
    await fs.writeFile(filePath, '', 'utf8');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('fs-delete-file', async (event, filePath) => {
  try {
    const stats = await fs.stat(filePath);
    
    if (stats.isDirectory()) {
      await fs.rmdir(filePath, { recursive: true });
    } else {
      await fs.unlink(filePath);
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('fs-rename-file', async (event, oldPath, newPath) => {
  console.log('Rename request received:', { oldPath, newPath });
  
  try {
    // Validate inputs
    if (!oldPath || !newPath) {
      console.error('Invalid paths provided:', { oldPath, newPath });
      return { success: false, error: 'Invalid file paths provided' };
    }

    // Normalize paths to handle different path formats
    const normalizedOldPath = path.resolve(oldPath);
    const normalizedNewPath = path.resolve(newPath);
    
    console.log('Normalized paths:', { normalizedOldPath, normalizedNewPath });
    
    // Security check: prevent operations on critical system directories
    const criticalPaths = [
      'C:\\Windows\\System32',
      'C:\\Windows\\SysWOW64',
      'C:\\Program Files',
      'C:\\Program Files (x86)',
      '/System/Library',
      '/usr/bin',
      '/bin',
      '/sbin',
      '/usr/sbin'
    ];
    
    const oldDir = path.dirname(normalizedOldPath);
    const newDir = path.dirname(normalizedNewPath);
    
    // Check if trying to rename in critical system directories
    const isCriticalOld = criticalPaths.some(criticalPath => 
      normalizedOldPath.toLowerCase().startsWith(criticalPath.toLowerCase())
    );
    const isCriticalNew = criticalPaths.some(criticalPath => 
      normalizedNewPath.toLowerCase().startsWith(criticalPath.toLowerCase())
    );
    
    if (isCriticalOld || isCriticalNew) {
      console.error('Attempted to rename in critical system directory');
      return { success: false, error: 'Cannot rename files in system directories' };
    }
    
    // Check if source file exists
    try {
      await fs.access(normalizedOldPath, fs.constants.F_OK);
      console.log('Source file exists:', normalizedOldPath);
    } catch (error) {
      console.error('Source file does not exist:', normalizedOldPath, error);
      return { success: false, error: `Source file does not exist: ${path.basename(oldPath)}` };
    }

    // Check if target already exists
    try {
      await fs.access(normalizedNewPath, fs.constants.F_OK);
      console.error('Target file already exists:', normalizedNewPath);
      return { success: false, error: `A file with the name "${path.basename(newPath)}" already exists` };
    } catch (error) {
      // Target doesn't exist, which is good for rename
      console.log('Target path is available:', normalizedNewPath);
    }

    // Ensure target directory exists
    const targetDir = path.dirname(normalizedNewPath);
    try {
      await fs.mkdir(targetDir, { recursive: true });
      console.log('Target directory ensured:', targetDir);
    } catch (error) {
      console.error('Failed to create target directory:', targetDir, error);
      return { success: false, error: 'Failed to create target directory' };
    }
    
    // Perform the rename operation
    console.log('Performing rename operation...');
    await fs.rename(normalizedOldPath, normalizedNewPath);
    console.log('Rename operation completed successfully');
    
    return { success: true };
    
  } catch (error) {
    console.error('Rename operation failed:', error);
    
    // Provide specific error messages based on error codes
    let errorMessage = 'Rename operation failed';
    
    switch (error.code) {
      case 'EPERM':
        errorMessage = 'Permission denied. You may not have permission to rename this file.';
        break;
      case 'ENOENT':
        errorMessage = 'File or directory not found.';
        break;
      case 'EEXIST':
        errorMessage = 'A file with this name already exists.';
        break;
      case 'EACCES':
        errorMessage = 'Access denied. The file may be in use or you lack permissions.';
        break;
      case 'EBUSY':
        errorMessage = 'File is busy or in use. Please close any programs using this file.';
        break;
      case 'EMFILE':
      case 'ENFILE':
        errorMessage = 'Too many files are open. Please close some files and try again.';
        break;
      case 'ENOSPC':
        errorMessage = 'Not enough disk space to complete the operation.';
        break;
      case 'EROFS':
        errorMessage = 'File system is read-only.';
        break;
      default:
        errorMessage = `Rename failed: ${error.message}`;
        break;
    }
    
    return { success: false, error: errorMessage };
  }
});

ipcMain.handle('fs-list-directory', async (event, dirPath) => {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const items = entries.map(entry => ({
      name: entry.name,
      path: path.join(dirPath, entry.name),
      isDirectory: entry.isDirectory(),
      isFile: entry.isFile()
    }));
    
    return { success: true, items };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('fs-create-directory', async (event, dirPath) => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('fs-get-workspace-path', () => {
  // Return the user's home directory instead of current working directory
  const os = require('os');
  return os.homedir();
});

ipcMain.handle('fs-show-open-dialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'SUSA Files', extensions: ['susa'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  
  return result;
});

ipcMain.handle('fs-show-save-dialog', async (event, defaultPath) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath,
    filters: [
      { name: 'SUSA Files', extensions: ['susa'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  
  return result;
});

// File System IPC handlers
const pathModule = require('path');

function startLanguageServer() {
  // No longer needed - using embedded interpreter
  console.log('Using embedded SUSA interpreter');
}

function stopLanguageServer() {
  // No longer needed - using embedded interpreter
}

// IPC handlers
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('show-save-dialog', async (event, options) => {
  const result = await dialog.showSaveDialog(mainWindow, options);
  return result;
});

ipcMain.handle('show-open-dialog', async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, options);
  return result;
});

ipcMain.handle('show-message-box', async (event, options) => {
  const result = await dialog.showMessageBox(mainWindow, options);
  return result;
});

// App event handlers
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  // Cleanup if needed
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});

// Handle certificate errors
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  if (isDev) {
    // In development, ignore certificate errors
    event.preventDefault();
    callback(true);
  } else {
    // In production, use default behavior
    callback(false);
  }
});