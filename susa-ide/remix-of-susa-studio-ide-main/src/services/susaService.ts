// SUSA Language Service - Embedded Interpreter Version
// Connects the IDE to the embedded SUSA interpreter in Electron

export interface SUSAExecutionResult {
  success: boolean;
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTime: string;
}

export interface SUSAValidationResult {
  valid: boolean;
  errors: Array<{
    message: string;
    line: number;
    column: number;
    severity: 'error' | 'warning';
  }>;
  warnings: Array<{
    message: string;
    line: number;
    column: number;
    severity: 'warning';
  }>;
  tokens: number;
  astNodes: number;
}

export interface SUSAFormatResult {
  success: boolean;
  formattedCode: string;
  changesMade: boolean;
  error?: string;
}

export interface SUSASyntaxInfo {
  language: string;
  version: string;
  keywords: string[];
  fileExtension: string;
  commentSingle: string;
  commentMultiline: [string, string];
  stringInterpolation: string;
  features: {
    multilineComments: boolean;
    stringInterpolation: boolean;
    multiLanguageSupport: boolean;
    errorHandling: boolean;
    classes: boolean;
    functions: boolean;
  };
}

export interface SUSAExample {
  name: string;
  description: string;
  code: string;
}

// Check if we're running in Electron
const isElectron = typeof window !== 'undefined' && window.susaAPI;

class SUSAService {
  private isConnected: boolean = false;

  constructor() {
    this.checkConnection();
  }

  // Check if SUSA interpreter is available
  async checkConnection(): Promise<boolean> {
    if (!isElectron) {
      console.warn('SUSA Service: Not running in Electron environment');
      this.isConnected = false;
      return false;
    }

    try {
      const health = await window.susaAPI.checkHealth();
      this.isConnected = health.status === 'ok' && health.language === 'SUSA';
      return this.isConnected;
    } catch (error) {
      console.warn('SUSA interpreter not available:', error);
      this.isConnected = false;
      return false;
    }
  }

  // Execute SUSA code
  async executeCode(code: string, options?: { timeout?: number }): Promise<SUSAExecutionResult> {
    if (!isElectron) {
      return {
        success: false,
        stdout: '',
        stderr: 'SUSA interpreter only available in desktop app',
        exitCode: -1,
        executionTime: '0s'
      };
    }

    if (!this.isConnected) {
      await this.checkConnection();
    }

    if (!this.isConnected) {
      return {
        success: false,
        stdout: '',
        stderr: 'SUSA interpreter is not available',
        exitCode: -1,
        executionTime: '0s'
      };
    }

    try {
      return await window.susaAPI.executeCode(code, options);
    } catch (error) {
      return {
        success: false,
        stdout: '',
        stderr: `Failed to execute code: ${error instanceof Error ? error.message : 'Unknown error'}`,
        exitCode: -1,
        executionTime: '0s'
      };
    }
  }

  // Validate SUSA code syntax
  async validateCode(code: string): Promise<SUSAValidationResult> {
    if (!isElectron) {
      return {
        valid: false,
        errors: [{
          message: 'SUSA interpreter only available in desktop app',
          line: 1,
          column: 1,
          severity: 'error'
        }],
        warnings: [],
        tokens: 0,
        astNodes: 0
      };
    }

    if (!this.isConnected) {
      await this.checkConnection();
    }

    if (!this.isConnected) {
      return {
        valid: false,
        errors: [{
          message: 'SUSA interpreter is not available',
          line: 1,
          column: 1,
          severity: 'error'
        }],
        warnings: [],
        tokens: 0,
        astNodes: 0
      };
    }

    try {
      return await window.susaAPI.validateCode(code);
    } catch (error) {
      return {
        valid: false,
        errors: [{
          message: `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          line: 1,
          column: 1,
          severity: 'error'
        }],
        warnings: [],
        tokens: 0,
        astNodes: 0
      };
    }
  }

  // Format SUSA code
  async formatCode(code: string): Promise<SUSAFormatResult> {
    if (!isElectron) {
      return {
        success: false,
        formattedCode: code,
        changesMade: false,
        error: 'SUSA interpreter only available in desktop app'
      };
    }

    if (!this.isConnected) {
      await this.checkConnection();
    }

    if (!this.isConnected) {
      return {
        success: false,
        formattedCode: code,
        changesMade: false,
        error: 'SUSA interpreter is not available'
      };
    }

    try {
      return await window.susaAPI.formatCode(code);
    } catch (error) {
      return {
        success: false,
        formattedCode: code,
        changesMade: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get SUSA syntax information
  async getSyntaxInfo(): Promise<SUSASyntaxInfo | null> {
    if (!isElectron) {
      return null;
    }

    if (!this.isConnected) {
      await this.checkConnection();
    }

    if (!this.isConnected) {
      return null;
    }

    try {
      return await window.susaAPI.getSyntaxInfo();
    } catch (error) {
      console.error('Failed to get syntax info:', error);
      return null;
    }
  }

  // Get SUSA code examples
  async getExamples(): Promise<Record<string, SUSAExample> | null> {
    if (!isElectron) {
      return null;
    }

    if (!this.isConnected) {
      await this.checkConnection();
    }

    if (!this.isConnected) {
      return null;
    }

    try {
      return await window.susaAPI.getExamples();
    } catch (error) {
      console.error('Failed to get examples:', error);
      return null;
    }
  }

  // Get connection status
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  // Check if running in Electron
  isElectronApp(): boolean {
    return isElectron;
  }
}

// Create singleton instance
export const susaService = new SUSAService();

// Auto-check connection on module load
susaService.checkConnection().catch(console.warn);

export default susaService;

// Type declarations for Electron API
declare global {
  interface Window {
    electronAPI: {
      getAppVersion: () => Promise<string>;
      showSaveDialog: (options: any) => Promise<any>;
      showOpenDialog: (options: any) => Promise<any>;
      showMessageBox: (options: any) => Promise<any>;
      readFile: (filePath: string) => Promise<{ success: boolean; content?: string; error?: string }>;
      writeFile: (filePath: string, content: string) => Promise<{ success: boolean; error?: string }>;
      createFile: (filePath: string) => Promise<{ success: boolean; error?: string }>;
      deleteFile: (filePath: string) => Promise<{ success: boolean; error?: string }>;
      renameFile: (oldPath: string, newPath: string) => Promise<{ success: boolean; error?: string }>;
      listDirectory: (dirPath: string) => Promise<{ success: boolean; items?: any[]; error?: string }>;
      createDirectory: (dirPath: string) => Promise<{ success: boolean; error?: string }>;
      getWorkspacePath: () => Promise<string>;
      onMenuNewFile: (callback: () => void) => void;
      onMenuOpenFile: (callback: (event: any, filePath: string) => void) => void;
      onMenuSaveFile: (callback: () => void) => void;
      onMenuSaveAsFile: (callback: (event: any, filePath: string) => void) => void;
      onMenuRunFile: (callback: () => void) => void;
      onMenuRunSelection: (callback: () => void) => void;
      onMenuFind: (callback: () => void) => void;
      onMenuReplace: (callback: () => void) => void;
      onMenuFormatCode: (callback: () => void) => void;
      onMenuToggleTerminal: (callback: () => void) => void;
      removeAllListeners: (channel: string) => void;
      platform: string;
      isElectron: boolean;
    };
    susaAPI: {
      executeCode: (code: string, options?: { timeout?: number }) => Promise<SUSAExecutionResult>;
      validateCode: (code: string) => Promise<SUSAValidationResult>;
      formatCode: (code: string) => Promise<SUSAFormatResult>;
      getSyntaxInfo: () => Promise<SUSASyntaxInfo>;
      getExamples: () => Promise<Record<string, SUSAExample>>;
      checkHealth: () => Promise<{ status: string; language: string; version: string; interpreter: string }>;
      isDesktopApp: boolean;
      version: string;
      interpreter: string;
    };
  }
}