const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

class SUSAInterpreter {
  constructor() {
    console.log('========================================');
    console.log('SUSA C++ Core Interpreter - v2.0');
    console.log('100% C++ Implementation');
    console.log('========================================');
  }

  async executeCode(code, options = {}) {
    return new Promise((resolve, reject) => {
      // Check if SUSA C++ core is installed on the system
      this.checkSUSACLI()
        .then((cliPath) => {
          // SUSA C++ core is installed, use it
          console.log('✅ Using SUSA C++ Core:', cliPath);
          this.executeSUSACLI(code, options, resolve, reject, cliPath);
        })
        .catch((error) => {
          // SUSA C++ core not found, return error message
          console.error('❌ SUSA C++ Core not found:', error.message);
          resolve({
            success: false,
            stdout: '',
            stderr: `❌ SUSA C++ Core not installed!\n\n` +
                   `To run SUSA code, you need the SUSA C++ Core.\n\n` +
                   `Installation steps:\n` +
                   `1. Build the C++ core: cd cpp-core && build-final.bat\n` +
                   `2. Add SUSA directory to your system PATH\n` +
                   `3. Or set SUSA_HOME environment variable\n` +
                   `4. Restart the IDE\n\n` +
                   `The SUSA C++ Core should be available as 'susa-cpp.exe'.\n\n` +
                   `Error details: ${error.message}`,
            exitCode: -1,
            executionTime: '0s'
          });
        });
    });
  }

  /**
   * Check if SUSA C++ Core is installed on the system
   */
  async checkSUSACLI() {
    return new Promise((resolve, reject) => {
      const { exec } = require('child_process');
      
      // Get SUSA_HOME from environment variable
      const susaHome = process.env.SUSA_HOME;
      
      // Get the current working directory and common SUSA locations
      const cwd = process.cwd();
      const userDownloads = path.join(os.homedir(), 'Downloads', 'SUSA');
      
      // List of possible SUSA C++ Core locations to try
      // PRIORITY: Try C++ core first for best performance
      const possibleCommands = [
        // First try current working directory
        path.join(cwd, 'susa-cpp.exe'),
        // Try Downloads/SUSA directory
        path.join(userDownloads, 'susa-cpp.exe'),
        // Try SUSA_HOME environment variable
        susaHome ? path.join(susaHome, 'susa-cpp.exe') : null,
        // Try common installation directories
        'C:\\Program Files\\SUSA\\susa-cpp.exe',
        'C:\\Program Files (x86)\\SUSA\\susa-cpp.exe',
        path.join(process.env.PROGRAMFILES || 'C:\\Program Files', 'SUSA', 'susa-cpp.exe'),
        path.join(process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)', 'SUSA', 'susa-cpp.exe'),
        'C:\\Users\\' + os.userInfo().username + '\\AppData\\Local\\Programs\\SUSA\\susa-cpp.exe',
        path.join(process.env.LOCALAPPDATA || '', 'Programs', 'SUSA', 'susa-cpp.exe'),
        // Try PATH commands
        'susa-cpp',
        'susa-cpp.exe',
        // Then try SUSA CLI (which will use C++ core if available)
        path.join(cwd, 'susa.bat'),
        path.join(userDownloads, 'susa.bat'),
        susaHome ? path.join(susaHome, 'susa.bat') : null,
        'C:\\Program Files\\SUSA\\susa.bat',
        'C:\\Program Files (x86)\\SUSA\\susa.bat',
        'susa',
        'susa.bat'
      ].filter(cmd => cmd !== null); // Remove null entries
      
      // Try each command in sequence
      const tryCommand = (index) => {
        if (index >= possibleCommands.length) {
          reject(new Error('SUSA C++ Core not found in any location. Please ensure susa-cpp.exe is built and accessible.'));
          return;
        }
        
        const cmd = possibleCommands[index];
        console.log(`[${index + 1}/${possibleCommands.length}] Trying: ${cmd}`);
        
        // For file paths, check if file exists first
        if (cmd.includes('\\') || cmd.includes('/')) {
          if (!fs.existsSync(cmd)) {
            console.log(`  ❌ File does not exist`);
            tryCommand(index + 1);
            return;
          }
        }
        
        // Test with --version flag
        const testCmd = `"${cmd}" --version`;
        
        exec(testCmd, { timeout: 5000, shell: true }, (error, stdout, stderr) => {
          if (error) {
            console.log(`  ❌ Failed to execute: ${error.message}`);
            // Try next command
            tryCommand(index + 1);
          } else {
            console.log('  ✅ SUSA C++ Core found!');
            console.log('  Version:', stdout.trim());
            console.log('🚀 Using C++ core for maximum performance!');
            resolve(cmd);
          }
        });
      };
      
      // Start trying commands
      console.log('Searching for SUSA C++ Core...');
      tryCommand(0);
    });
  }

  executeSUSACLI(code, options, resolve, reject, cliCommand = 'susa') {
    try {
      // Create temporary file for the code
      const tempDir = os.tmpdir();
      const tempFile = path.join(tempDir, `susa_temp_${Date.now()}.susa`);
      
      console.log('Writing code to temp file:', tempFile);
      fs.writeFileSync(tempFile, code, 'utf8');

      // Verify file was created
      if (!fs.existsSync(tempFile)) {
        throw new Error('Failed to create temporary file');
      }

      // Determine execution command based on CLI type
      let execArgs;
      if (cliCommand.includes('susa-cpp')) {
        // C++ core - direct execution
        console.log(`🚀 Executing with C++ core: ${cliCommand}`);
        execArgs = [tempFile];
      } else {
        // SUSA CLI - use 'run' command
        console.log(`Executing with SUSA CLI: ${cliCommand} run`);
        execArgs = ['run', tempFile];
      }
      
      const startTime = Date.now();
      
      // Quote the command if it contains spaces (Windows path issue)
      const quotedCommand = cliCommand.includes(' ') ? `"${cliCommand}"` : cliCommand;
      
      const child = spawn(quotedCommand, execArgs, {
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout: options.timeout || 30000,
        windowsHide: true,
        shell: true  // Use shell to find command in PATH
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (exitCode) => {
        const executionTime = ((Date.now() - startTime) / 1000).toFixed(2) + 's';
        
        // Log performance info
        console.log(`✅ C++ core execution completed in ${executionTime}`);
        console.log(`Exit code: ${exitCode}`);
        
        // Clean up temp file
        try {
          if (fs.existsSync(tempFile)) {
            fs.unlinkSync(tempFile);
          }
        } catch (e) {
          console.warn('Failed to clean up temp file:', e);
        }

        resolve({
          success: exitCode === 0,
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          exitCode: exitCode || 0,
          executionTime: executionTime,
          usedCppCore: true
        });
      });

      child.on('error', (error) => {
        // Clean up temp file
        try {
          if (fs.existsSync(tempFile)) {
            fs.unlinkSync(tempFile);
          }
        } catch (e) {
          console.warn('Failed to clean up temp file:', e);
        }

        console.error('❌ C++ core execution error:', error);
        reject(error);
      });

    } catch (error) {
      console.error('❌ SUSA CLI execution error:', error);
      reject(error);
    }
  }

  async validateCode(code) {
    // For C++ core, we don't have a separate validation step
    // Just return success - validation happens during execution
    return new Promise((resolve) => {
      resolve({
        valid: true,
        errors: [],
        warnings: []
      });
    });
  }

  normalizeCode(code) {
    // No normalization needed for C++ core
    return code;
  }
}

module.exports = SUSAInterpreter;
