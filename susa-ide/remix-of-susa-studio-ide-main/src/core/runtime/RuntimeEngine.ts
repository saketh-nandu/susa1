/**
 * Production Runtime Engine for SUSA IDE
 * Handles code execution with debugging support and non-blocking I/O
 */

import { eventBus } from '../architecture/EventBus';
import { consoleEngine } from '../console/ConsoleEngine';
import { debuggerEngine } from '../debugger/DebuggerEngine';

export interface RuntimeConfig {
  timeout?: number;
  debugMode?: boolean;
  stepMode?: boolean;
  maxMemory?: number;
  maxExecutionTime?: number;
}

export interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime: number;
  memoryUsed?: number;
  exitCode: number;
}

export interface RuntimeState {
  isExecuting: boolean;
  isPaused: boolean;
  currentLine: number;
  variables: Map<string, any>;
  callStack: string[];
  executionId: string | null;
}

export class RuntimeEngine {
  private state: RuntimeState = {
    isExecuting: false,
    isPaused: false,
    currentLine: 0,
    variables: new Map(),
    callStack: [],
    executionId: null
  };

  private listeners: Set<(state: RuntimeState) => void> = new Set();
  private executionPromise: Promise<ExecutionResult> | null = null;
  private executionController: AbortController | null = null;

  constructor() {
    this.setupEventListeners();
  }

  /**
   * Setup event bus listeners
   */
  private setupEventListeners(): void {
    eventBus.on('debug.step_request', (event) => {
      this.handleStepRequest(event.payload);
    });

    eventBus.on('debug.execution_continued', () => {
      this.resumeExecution();
    });

    eventBus.on('execution.input_response', (event) => {
      this.handleInputResponse(event.payload);
    });
  }

  /**
   * Subscribe to runtime state changes
   */
  onStateChange(callback: (state: RuntimeState) => void): () => void {
    this.listeners.add(callback);
    callback({ ...this.state });
    
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Notify listeners of state changes
   */
  private notifyListeners(): void {
    const stateCopy = { ...this.state };
    this.listeners.forEach(callback => {
      try {
        callback(stateCopy);
      } catch (error) {
        console.error('Runtime listener error:', error);
      }
    });
  }

  /**
   * Execute SUSA code
   */
  async executeCode(code: string, config: RuntimeConfig = {}): Promise<ExecutionResult> {
    if (this.state.isExecuting) {
      throw new Error('Runtime is already executing code');
    }

    // Create execution context
    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.state.executionId = executionId;
    this.state.isExecuting = true;
    this.state.isPaused = false;
    this.state.currentLine = 0;
    this.state.variables.clear();
    this.state.callStack = [];

    // Create abort controller for cancellation
    this.executionController = new AbortController();

    // Notify listeners
    this.notifyListeners();

    // Emit execution start event
    eventBus.emit('execution.start', { executionId, code, config });

    try {
      // Start debug session if in debug mode
      if (config.debugMode) {
        await debuggerEngine.startDebugSession(code);
      }

      // Create execution promise
      this.executionPromise = this.runCode(code, config);
      
      // Execute with timeout
      const result = await Promise.race([
        this.executionPromise,
        this.createTimeoutPromise(config.timeout || 30000)
      ]);

      // Complete execution
      this.completeExecution(true);
      
      return result;

    } catch (error) {
      // Handle execution error
      const errorMessage = error instanceof Error ? error.message : 'Unknown execution error';
      
      eventBus.emit('execution.error', {
        type: 'runtime',
        message: errorMessage,
        location: { line: this.state.currentLine, column: 1, offset: 0 }
      });

      this.completeExecution(false);

      return {
        success: false,
        output: '',
        error: errorMessage,
        executionTime: 0,
        exitCode: 1
      };
    }
  }

  /**
   * Run SUSA code with interpreter
   */
  private async runCode(code: string, config: RuntimeConfig): Promise<ExecutionResult> {
    const startTime = Date.now();
    let output = '';
    let error = '';

    try {
      // Check if we're in Electron environment
      if (typeof window !== 'undefined' && window.susaAPI) {
        // Use embedded SUSA interpreter
        const result = await window.susaAPI.executeCode(code, {
          timeout: config.timeout,
          debugMode: config.debugMode
        });

        // For console execution, send output to console engine
        if (result.stdout) {
          // Check if this is console execution (not main editor execution)
          if (!config.debugMode && config.timeout === 10000) {
            // This is console execution - send to console
            consoleEngine.addMessage({
              id: `out_${Date.now()}`,
              type: 'output',
              content: result.stdout,
              timestamp: Date.now()
            });
          } else {
            // This is main editor execution - send to output panel
            eventBus.emit('execution.output', {
              content: result.stdout,
              metadata: { line: this.state.currentLine }
            });
          }
        }

        if (result.stderr) {
          // Check if this is console execution
          if (!config.debugMode && config.timeout === 10000) {
            // This is console execution - send to console
            consoleEngine.addMessage({
              id: `err_${Date.now()}`,
              type: 'error',
              content: result.stderr,
              timestamp: Date.now()
            });
          } else {
            // This is main editor execution - send to output panel
            eventBus.emit('execution.error', {
              type: 'runtime',
              message: result.stderr,
              location: { line: this.state.currentLine, column: 1, offset: 0 }
            });
          }
        }

        return {
          success: result.success,
          output: result.stdout,
          error: result.stderr,
          executionTime: Date.now() - startTime,
          exitCode: result.exitCode
        };
      } else {
        // Use built-in JavaScript interpreter
        return await this.executeWithBuiltinInterpreter(code, config);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Check if this is console execution
      if (!config.debugMode && config.timeout === 10000) {
        // This is console execution - send to console
        consoleEngine.addMessage({
          id: `err_${Date.now()}`,
          type: 'error',
          content: errorMessage,
          timestamp: Date.now()
        });
      } else {
        // This is main editor execution - send to output panel
        eventBus.emit('execution.error', {
          type: 'runtime',
          message: errorMessage,
          location: { line: this.state.currentLine, column: 1, offset: 0 }
        });
      }

      return {
        success: false,
        output,
        error: errorMessage,
        executionTime: Date.now() - startTime,
        exitCode: 1
      };
    }
  }

  /**
   * Execute with built-in JavaScript interpreter
   */
  private async executeWithBuiltinInterpreter(code: string, config: RuntimeConfig): Promise<ExecutionResult> {
    const startTime = Date.now();
    let output = '';
    const variables = new Map<string, any>();

    // Simple SUSA interpreter
    const lines = code.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('#')) continue;

      // Update current line
      this.state.currentLine = i + 1;
      this.notifyListeners();

      // Check for breakpoints in debug mode
      if (config.debugMode && debuggerEngine.hasBreakpoint(i + 1)) {
        await this.handleBreakpoint(i + 1, Object.fromEntries(variables));
      }

      // Check for step mode
      if (config.stepMode || debuggerEngine.getState().stepMode) {
        await this.handleStep(i + 1);
      }

      // Check for abort signal
      if (this.executionController?.signal.aborted) {
        throw new Error('Execution aborted');
      }

      try {
        // Execute line and capture output
        const lineOutput = await this.executeLine(line, variables);
        if (lineOutput) {
          output += lineOutput + '\n';
        }
        
      } catch (lineError) {
        const errorMessage = lineError instanceof Error ? lineError.message : 'Unknown error';
        
        eventBus.emit('execution.error', {
          type: 'runtime',
          message: `Line ${i + 1}: ${errorMessage}`,
          location: { line: i + 1, column: 1, offset: 0 }
        });

        throw lineError;
      }
    }

    return {
      success: true,
      output: output.trim(),
      error: '',
      executionTime: Date.now() - startTime,
      exitCode: 0
    };
  }

  /**
   * Execute a single line of SUSA code
   */
  private async executeLine(line: string, variables: Map<string, any>): Promise<string | null> {
    // Handle variable declarations and assignments
    if (line.includes(' = ')) {
      const parts = line.split(' = ', 2);
      let varName = parts[0].trim();
      const varValue = parts[1].trim();
      
      // Remove type declarations (let, int, string, bool, float)
      varName = varName.replace(/^(let|int|string|bool|float)\s+/, '');
      
      const value = this.evaluateExpression(varValue, variables);
      variables.set(varName, value);
      
      // Update runtime state
      this.state.variables = new Map(variables);
      this.notifyListeners();
      
      return null; // No output for assignments
    }

    // Handle PRINT statements (both PRINT and print)
    if (line.toLowerCase().startsWith('print ')) {
      const content = line.substring(6).trim();
      const result = this.evaluateExpression(content, variables);
      const output = String(result);
      
      eventBus.emit('execution.output', {
        content: output,
        metadata: { line: this.state.currentLine }
      });
      
      return output;
    }

    // Handle LOOP statements
    if (line.toLowerCase().includes('loop ') && line.toLowerCase().includes('for ') && line.toLowerCase().includes('times')) {
      const loopMatch = line.match(/loop\s+(\w+)\s*=\s*(\d+)\s+for\s+(\w+|\d+)\s+times\s*:\s*(.*)/i);
      if (loopMatch) {
        const [, loopVar, startVal, countExpr, body] = loopMatch;
        const start = parseInt(startVal);
        let count = 0;
        
        // Evaluate count expression
        if (isNaN(parseInt(countExpr))) {
          // It's a variable
          if (variables.has(countExpr)) {
            count = variables.get(countExpr);
          } else {
            throw new Error(`Variable '${countExpr}' not found`);
          }
        } else {
          count = parseInt(countExpr);
        }
        
        let output = '';
        
        // Execute loop
        for (let i = start; i < start + count; i++) {
          variables.set(loopVar, i);
          this.state.variables = new Map(variables);
          this.notifyListeners();
          
          // Handle loop body
          if (body.trim()) {
            const bodyOutput = await this.executeLine(body.trim(), variables);
            if (bodyOutput) {
              output += bodyOutput + '\n';
            }
          }
        }
        
        return output.trim() || null;
      }
    }

    // Handle multi-line LOOP with START/END
    if (line.toLowerCase().startsWith('loop ') && line.toLowerCase().includes('times:')) {
      // This is a loop declaration, store it for multi-line processing
      // For now, just extract the loop variable
      const loopMatch = line.match(/loop\s+(\w+)\s*=\s*(\d+)\s+for\s+(\w+|\d+)\s+times/i);
      if (loopMatch) {
        const [, loopVar, startVal, countExpr] = loopMatch;
        const start = parseInt(startVal);
        let count = 0;
        
        if (isNaN(parseInt(countExpr))) {
          if (variables.has(countExpr)) {
            count = variables.get(countExpr);
          } else {
            throw new Error(`Variable '${countExpr}' not found`);
          }
        } else {
          count = parseInt(countExpr);
        }
        
        // Set loop variable
        variables.set(loopVar, start);
        variables.set(`${loopVar}_max`, count);
        variables.set(`${loopVar}_start`, start);
        
        this.state.variables = new Map(variables);
        this.notifyListeners();
      }
      return null;
    }

    // Handle START: and END: blocks (simplified)
    if (line.toLowerCase() === 'start:' || line.toLowerCase() === 'end:') {
      return null; // Block markers don't produce output
    }

    // Handle input requests (simplified)
    if (line.includes('input(')) {
      const promptMatch = line.match(/input\("([^"]*)"\)/);
      const prompt = promptMatch ? promptMatch[1] : 'Enter input:';
      
      try {
        const input = await consoleEngine.requestInput({ prompt, timeout: 30000 });
        
        // If this is an assignment, store the input
        if (line.includes(' = ')) {
          const varName = line.split(' = ')[0].replace(/^(let|int|string|bool|float)\s+/, '').trim();
          variables.set(varName, input);
          this.state.variables = new Map(variables);
          this.notifyListeners();
        }
        
        return null; // Input doesn't produce output
        
      } catch (error) {
        throw new Error(`Input timeout or error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Handle IF statements (simplified)
    if (line.toLowerCase().startsWith('if ')) {
      // For now, just skip IF statements in console execution
      return null;
    }

    // Handle other statements (simplified)
    return null;
  }

  /**
   * Evaluate expression (simplified)
   */
  private evaluateExpression(expr: string, variables: Map<string, any>): any {
    expr = expr.trim();
    
    // Handle string literals
    if (expr.startsWith('"') && expr.endsWith('"')) {
      return expr.slice(1, -1);
    }
    
    // Handle template strings (rt"...")
    if (expr.startsWith('rt"') && expr.endsWith('"')) {
      let template = expr.slice(3, -1); // Remove rt" and "
      
      // Replace variables in template {variable}
      template = template.replace(/\{(\w+)\}/g, (match, varName) => {
        if (variables.has(varName)) {
          return String(variables.get(varName));
        }
        return match; // Keep original if variable not found
      });
      
      return template;
    }
    
    // Handle numbers
    if (!isNaN(Number(expr))) {
      return Number(expr);
    }
    
    // Handle boolean values
    if (expr.toLowerCase() === 'true') return true;
    if (expr.toLowerCase() === 'false') return false;
    if (expr.toLowerCase() === 'null') return null;
    
    // Handle variables
    if (variables.has(expr)) {
      return variables.get(expr);
    }
    
    // Handle simple expressions (very simplified)
    if (expr.includes(' + ')) {
      const parts = expr.split(' + ');
      return parts.reduce((acc, part) => {
        const value = this.evaluateExpression(part.trim(), variables);
        return acc + value;
      }, '');
    }
    
    return expr;
  }

  /**
   * Handle breakpoint hit
   */
  private async handleBreakpoint(line: number, variables: Record<string, any>): Promise<void> {
    this.state.isPaused = true;
    this.notifyListeners();
    
    eventBus.emit('debug.breakpoint_hit', { line, variables });
    
    // Wait for continuation
    return new Promise((resolve) => {
      const unsubscribe = eventBus.on('debug.execution_continued', () => {
        unsubscribe();
        this.state.isPaused = false;
        this.notifyListeners();
        resolve();
      });
    });
  }

  /**
   * Handle step execution
   */
  private async handleStep(line: number): Promise<void> {
    this.state.isPaused = true;
    this.notifyListeners();
    
    eventBus.emit('debug.step_complete', { line, column: 1 });
    
    // Wait for step continuation
    return new Promise((resolve) => {
      const unsubscribe = eventBus.on('debug.step_request', () => {
        unsubscribe();
        this.state.isPaused = false;
        this.notifyListeners();
        resolve();
      });
    });
  }

  /**
   * Handle step request from debugger
   */
  private handleStepRequest(payload: { mode: string }): void {
    // Resume execution for one step
    this.resumeExecution();
  }

  /**
   * Resume execution
   */
  private resumeExecution(): void {
    this.state.isPaused = false;
    this.notifyListeners();
  }

  /**
   * Handle input response
   */
  private handleInputResponse(payload: { input: string }): void {
    // Input handling is managed by console engine
    // This is just for state synchronization
  }

  /**
   * Create timeout promise
   */
  private createTimeoutPromise(timeout: number): Promise<ExecutionResult> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Execution timeout after ${timeout}ms`));
      }, timeout);
    });
  }

  /**
   * Stop execution
   */
  stopExecution(): void {
    if (this.executionController) {
      this.executionController.abort();
    }
    
    this.completeExecution(false);
    
    eventBus.emit('execution.complete', { success: false });
  }

  /**
   * Complete execution
   */
  private completeExecution(success: boolean): void {
    this.state.isExecuting = false;
    this.state.isPaused = false;
    this.state.executionId = null;
    this.executionPromise = null;
    this.executionController = null;
    
    this.notifyListeners();
    
    // Stop debug session if active
    if (debuggerEngine.getState().isDebugging) {
      debuggerEngine.stopDebugSession();
    }
    
    // Complete console execution
    consoleEngine.completeExecution(success);
  }

  /**
   * Get current state
   */
  getState(): RuntimeState {
    return { ...this.state };
  }

  /**
   * Check if runtime is executing
   */
  isExecuting(): boolean {
    return this.state.isExecuting;
  }

  /**
   * Check if runtime is paused
   */
  isPaused(): boolean {
    return this.state.isPaused;
  }
}

// Export singleton instance
export const runtimeEngine = new RuntimeEngine();