// File System Service for Desktop App
// Handles file operations through Electron IPC

export interface FileSystemItem {
  name: string;
  path: string;
  isDirectory: boolean;
  isFile: boolean;
}

export interface FileSystemResult {
  success: boolean;
  error?: string;
  content?: string;
  items?: FileSystemItem[];
}

// Check if we're running in Electron
const isElectron = typeof window !== 'undefined' && window.electronAPI;

class FileSystemService {
  // Read file content
  async readFile(filePath: string): Promise<FileSystemResult> {
    if (!isElectron) {
      return { success: false, error: 'File system only available in desktop app' };
    }

    try {
      return await window.electronAPI.readFile(filePath);
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Write file content
  async writeFile(filePath: string, content: string): Promise<FileSystemResult> {
    if (!isElectron) {
      return { success: false, error: 'File system only available in desktop app' };
    }

    try {
      return await window.electronAPI.writeFile(filePath, content);
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Create new file
  async createFile(filePath: string): Promise<FileSystemResult> {
    if (!isElectron) {
      return { success: false, error: 'File system only available in desktop app' };
    }

    try {
      return await window.electronAPI.createFile(filePath);
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Delete file or directory
  async deleteFile(filePath: string): Promise<FileSystemResult> {
    if (!isElectron) {
      return { success: false, error: 'File system only available in desktop app' };
    }

    try {
      return await window.electronAPI.deleteFile(filePath);
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Rename file or directory
  async renameFile(oldPath: string, newPath: string): Promise<FileSystemResult> {
    if (!isElectron) {
      return { success: false, error: 'File system only available in desktop app' };
    }

    try {
      return await window.electronAPI.renameFile(oldPath, newPath);
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // List directory contents
  async listDirectory(dirPath: string): Promise<FileSystemResult> {
    if (!isElectron) {
      return { success: false, error: 'File system only available in desktop app' };
    }

    try {
      return await window.electronAPI.listDirectory(dirPath);
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Create directory
  async createDirectory(dirPath: string): Promise<FileSystemResult> {
    if (!isElectron) {
      return { success: false, error: 'File system only available in desktop app' };
    }

    try {
      return await window.electronAPI.createDirectory(dirPath);
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Check if running in Electron
  isElectronApp(): boolean {
    return isElectron;
  }

  // Get workspace path
  async getWorkspacePath(): Promise<string> {
    if (!isElectron) {
      return '';
    }

    try {
      return await window.electronAPI.getWorkspacePath();
    } catch (error) {
      return '';
    }
  }

  // Show open file dialog
  async showOpenDialog(): Promise<{ canceled: boolean; filePaths: string[] }> {
    if (!isElectron) {
      return { canceled: true, filePaths: [] };
    }

    try {
      return await window.electronAPI.showOpenDialog({
        properties: ['openFile'],
        filters: [
          { name: 'SUSA Files', extensions: ['susa'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });
    } catch (error) {
      return { canceled: true, filePaths: [] };
    }
  }

  // Show save file dialog
  async showSaveDialog(defaultPath?: string): Promise<{ canceled: boolean; filePath?: string }> {
    if (!isElectron) {
      return { canceled: true };
    }

    try {
      return await window.electronAPI.showSaveDialog({ defaultPath });
    } catch (error) {
      return { canceled: true };
    }
  }
}

// Create singleton instance
export const fileSystemService = new FileSystemService();

export default fileSystemService;

// Type declarations for Electron API
declare global {
  interface Window {
    electronAPI: {
      // App info
      getAppVersion: () => Promise<string>;
      
      // File dialogs
      showSaveDialog: (options: any) => Promise<{ canceled: boolean; filePath?: string }>;
      showOpenDialog: (options: any) => Promise<{ canceled: boolean; filePaths: string[] }>;
      showMessageBox: (options: any) => Promise<any>;
      
      // File system operations
      readFile: (filePath: string) => Promise<FileSystemResult>;
      writeFile: (filePath: string, content: string) => Promise<FileSystemResult>;
      createFile: (filePath: string) => Promise<FileSystemResult>;
      deleteFile: (filePath: string) => Promise<FileSystemResult>;
      renameFile: (oldPath: string, newPath: string) => Promise<FileSystemResult>;
      listDirectory: (dirPath: string) => Promise<FileSystemResult>;
      createDirectory: (dirPath: string) => Promise<FileSystemResult>;
      getWorkspacePath: () => Promise<string>;
      
      // Platform info
      platform: string;
      isElectron: boolean;
    };
    
    susaAPI: {
      // SUSA interpreter methods
      executeCode: (code: string, options?: { timeout?: number }) => Promise<any>;
      validateCode: (code: string) => Promise<any>;
      formatCode: (code: string) => Promise<any>;
      getSyntaxInfo: () => Promise<any>;
      getExamples: () => Promise<any>;
      checkHealth: () => Promise<any>;
      
      // File system methods (duplicated for convenience)
      readFile: (filePath: string) => Promise<FileSystemResult>;
      writeFile: (filePath: string, content: string) => Promise<FileSystemResult>;
      createFile: (filePath: string) => Promise<FileSystemResult>;
      deleteFile: (filePath: string) => Promise<FileSystemResult>;
      renameFile: (oldPath: string, newPath: string) => Promise<FileSystemResult>;
      listDirectory: (dirPath: string) => Promise<FileSystemResult>;
      createDirectory: (dirPath: string) => Promise<FileSystemResult>;
      getWorkspacePath: () => Promise<string>;
      showOpenDialog: () => Promise<{ canceled: boolean; filePaths: string[] }>;
      showSaveDialog: (defaultPath?: string) => Promise<{ canceled: boolean; filePath?: string }>;
      
      // App info
      isDesktopApp: boolean;
      version: string;
      interpreter: string;
    };
  }
}