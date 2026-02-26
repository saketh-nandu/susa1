/**
 * Production Debugger Engine for SUSA IDE
 * Handles breakpoints, step execution, variable watching, and precise error mapping
 */

import { eventBus } from '../architecture/EventBus';
import { parseSUSACode, ParseResult } from '../language/SUSAParser';
import { SUSALexer } from '../language/SUSALexer';

export interface SourceLocation {
  line: number;
  column: number;
  offset: number;
}

export interface ASTNode {
  type: string;
  location: SourceLocation;
  children?: ASTNode[];
  value?: any;
  metadata?: Record<string, any>;
}

export interface DebugError {
  type: 'syntax' | 'runtime' | 'logical';
  message: string;
  location: SourceLocation;
  severity: 'error' | 'warning' | 'info';
  code?: string;
  suggestions?: string[];
  stackTrace?: string[];
}

export interface Breakpoint {
  id: string;
  line: number;
  column?: number;
  enabled: boolean;
  condition?: string;
  hitCount: number;
  logMessage?: string;
}

export interface Variable {
  name: string;
  value: any;
  type: string;
  scope: 'local' | 'global' | 'parameter';
  location?: SourceLocation;
  isExpandable?: boolean;
  children?: Variable[];
}

export interface ExecutionFrame {
  id: string;
  functionName: string;
  location: SourceLocation;
  variables: Variable[];
  source?: string;
}

export interface DebugState {
  isDebugging: boolean;
  isPaused: boolean;
  currentLine: number;
  currentColumn: number;
  executionFrames: ExecutionFrame[];
  variables: Variable[];
  errors: DebugError[];
  breakpoints: Breakpoint[];
  watchExpressions: string[];
  stepMode: 'over' | 'into' | 'out' | null;
}

export interface DebugSession {
  id: string;
  startTime: number;
  sourceCode: string;
  ast: ASTNode | null;
  sourceMap: Map<number, SourceLocation[]>;
  executionPath: SourceLocation[];
}

export class DebuggerEngine {
  private state: DebugState = {
    isDebugging: false,
    isPaused: false,
    currentLine: 0,
    currentColumn: 0,
    executionFrames: [],
    variables: [],
    errors: [],
    breakpoints: [],
    watchExpressions: [],
    stepMode: null
  };

  private listeners: Set<(state: DebugState) => void> = new Set();
  private session: DebugSession | null = null;
  private stepResolve: (() => void) | null = null;

  constructor() {
    this.setupEventListeners();
  }

  /**
   * Setup event bus listeners
   */
  private setupEventListeners(): void {
    eventBus.on('debug.breakpoint_hit', (event) => {
      this.handleBreakpointHit(event.payload);
    });

    eventBus.on('debug.step_complete', (event) => {
      this.handleStepComplete(event.payload);
    });

    eventBus.on('debug.variable_update', (event) => {
      this.updateVariables(event.payload);
    });

    eventBus.on('execution.error', (event) => {
      this.handleExecutionError(event.payload);
    });
  }

  /**
   * Subscribe to debugger state changes
   */
  onStateChange(callback: (state: DebugState) => void): () => void {
    this.listeners.add(callback);
    callback({ ...this.state });
    
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Notify all listeners of state changes
   */
  private notifyListeners(): void {
    const stateCopy = { ...this.state };
    this.listeners.forEach(callback => {
      try {
        callback(stateCopy);
      } catch (error) {
        console.error('Debugger listener error:', error);
      }
    });
  }

  /**
   * Start debug session
   */
  async startDebugSession(sourceCode: string): Promise<void> {
    try {
      // Prevent multiple simultaneous debug sessions
      if (this.state.isDebugging) {
        console.warn('Debug session already active');
        return;
      }

      // Create new session
      this.session = {
        id: `debug_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        startTime: Date.now(),
        sourceCode,
        ast: null,
        sourceMap: new Map(),
        executionPath: []
      };

      // Parse source code and build AST (non-blocking)
      setTimeout(async () => {
        try {
          await this.parseSourceCode(sourceCode);
          this.buildSourceMap();
          
          // Update state
          this.state.isDebugging = true;
          this.state.isPaused = false;
          this.state.errors = [];
          this.state.executionFrames = [];
          this.state.variables = [];
          this.state.currentLine = 0;
          this.state.currentColumn = 0;

          this.notifyListeners();

          // Emit debug start event
          eventBus.emit('debug.session_start', { sessionId: this.session.id });
        } catch (error) {
          this.addError({
            type: 'syntax',
            message: `Failed to start debug session: ${error instanceof Error ? error.message : 'Unknown error'}`,
            location: { line: 1, column: 1, offset: 0 },
            severity: 'error',
            suggestions: ['Check your SUSA syntax', 'Ensure all blocks are properly closed']
          });
        }
      }, 0);

    } catch (error) {
      this.addError({
        type: 'syntax',
        message: `Failed to start debug session: ${error instanceof Error ? error.message : 'Unknown error'}`,
        location: { line: 1, column: 1, offset: 0 },
        severity: 'error',
        suggestions: ['Check your SUSA syntax', 'Ensure all blocks are properly closed']
      });
    }
  }

  /**
   * Stop debug session
   */
  stopDebugSession(): void {
    if (this.session) {
      eventBus.emit('debug.session_stop', { sessionId: this.session.id });
    }

    this.state.isDebugging = false;
    this.state.isPaused = false;
    this.state.currentLine = 0;
    this.state.currentColumn = 0;
    this.state.executionFrames = [];
    this.state.stepMode = null;

    if (this.stepResolve) {
      this.stepResolve();
      this.stepResolve = null;
    }

    this.session = null;
    this.notifyListeners();
  }

  /**
   * Parse source code and build AST
   */
  private async parseSourceCode(sourceCode: string): Promise<void> {
    try {
      // Try to use the production SUSA parser first
      const parseResult = parseSUSACode(sourceCode);
      
      if (parseResult.errors.length > 0) {
        // Add parse errors to debugger
        parseResult.errors.forEach(error => {
          this.addError({
            type: 'syntax',
            message: error.message,
            location: error.location,
            severity: error.severity,
            suggestions: error.suggestions || []
          });
        });
      }
      
      if (parseResult.warnings.length > 0) {
        // Add parse warnings
        parseResult.warnings.forEach(warning => {
          this.addError({
            type: 'syntax',
            message: warning.message,
            location: warning.location,
            severity: warning.severity,
            suggestions: warning.suggestions || []
          });
        });
      }
      
      // Store the AST (use simplified if full parser failed)
      if (parseResult.ast) {
        this.session!.ast = parseResult.ast;
      } else {
        // Fallback to simplified AST
        this.session!.ast = this.createSimplifiedAST(sourceCode);
      }
      
      // Extract variables from the AST for debugging
      if (this.session!.ast) {
        this.extractVariablesFromAST(this.session!.ast);
      }
      
      // If we have critical errors but no AST, create simplified AST anyway
      if (parseResult.errors.some(e => e.severity === 'error') && !parseResult.ast) {
        console.warn('Parser failed, using simplified AST for debugging');
        this.session!.ast = this.createSimplifiedAST(sourceCode);
        this.extractVariablesFromAST(this.session!.ast);
      }

    } catch (error) {
      // If parser completely fails, use simplified AST
      console.warn('Parser error, falling back to simplified AST:', error);
      this.session!.ast = this.createSimplifiedAST(sourceCode);
      this.extractVariablesFromAST(this.session!.ast);
      
      this.addError({
        type: 'syntax',
        message: `Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        location: { line: 1, column: 1, offset: 0 },
        severity: 'warning',
        suggestions: ['Using simplified parsing for debugging']
      });
    }
  }

  /**
   * Extract variables from AST for debugging
   */
  private extractVariablesFromAST(node: ASTNode): void {
    if (!node) return;

    // Extract variable declarations
    if (node.type === 'VariableDeclaration') {
      const variable: Variable = {
        name: node.value || node.metadata?.name || 'unknown',
        value: this.getInitialValue(node),
        type: this.inferType(node),
        scope: 'local',
        location: node.location
      };
      
      // Add to debugger state
      const existingIndex = this.state.variables.findIndex(v => v.name === variable.name);
      if (existingIndex >= 0) {
        this.state.variables[existingIndex] = variable;
      } else {
        this.state.variables.push(variable);
      }
    }

    // Extract assignments (variable updates)
    if (node.type === 'Assignment' && node.children && node.children.length >= 2) {
      const nameNode = node.children[0];
      const valueNode = node.children[1];
      
      if (nameNode && nameNode.value) {
        const variable: Variable = {
          name: nameNode.value,
          value: this.getValueFromNode(valueNode),
          type: this.getTypeFromValue(this.getValueFromNode(valueNode)),
          scope: 'local',
          location: node.location
        };
        
        const existingIndex = this.state.variables.findIndex(v => v.name === variable.name);
        if (existingIndex >= 0) {
          this.state.variables[existingIndex] = variable;
        } else {
          this.state.variables.push(variable);
        }
      }
    }

    // Extract function parameters
    if (node.type === 'FunctionDeclaration' && node.children) {
      node.children.forEach(child => {
        if (child.type === 'Parameter' && child.value) {
          const variable: Variable = {
            name: child.value,
            value: undefined,
            type: 'parameter',
            scope: 'parameter',
            location: child.location
          };
          this.state.variables.push(variable);
        }
      });
    }

    // Extract loop variables
    if (node.type === 'LoopStatement' && node.children) {
      node.children.forEach(child => {
        if (child.type === 'LoopVariable' && child.value) {
          const variable: Variable = {
            name: child.value,
            value: 0, // Default loop start
            type: 'number',
            scope: 'local',
            location: child.location
          };
          this.state.variables.push(variable);
        }
      });
    }

    // Extract class properties
    if (node.type === 'ClassDeclaration' && node.children) {
      node.children.forEach(child => {
        if (child.type === 'PropertyDeclaration' && child.value) {
          const variable: Variable = {
            name: child.value,
            value: this.getInitialValue(child),
            type: this.inferType(child),
            scope: 'local',
            location: child.location
          };
          this.state.variables.push(variable);
        }
      });
    }

    // Recursively process children
    if (node.children) {
      node.children.forEach(child => this.extractVariablesFromAST(child));
    }
  }

  /**
   * Get initial value from AST node
   */
  private getInitialValue(node: ASTNode): any {
    if (node.children && node.children.length > 0) {
      const valueNode = node.children[0];
      return this.getValueFromNode(valueNode);
    }
    return undefined;
  }

  /**
   * Get value from any AST node
   */
  private getValueFromNode(node: ASTNode): any {
    if (!node) return undefined;
    
    switch (node.type) {
      case 'NumberLiteral':
      case 'Literal':
        return node.value;
      case 'StringLiteral':
        return node.value;
      case 'BooleanLiteral':
        return node.value;
      case 'NullLiteral':
        return null;
      case 'ArrayLiteral':
        return node.children ? node.children.map(child => this.getValueFromNode(child)) : [];
      case 'ObjectLiteral':
        const obj: Record<string, any> = {};
        if (node.children) {
          node.children.forEach(child => {
            if (child.type === 'Property' && child.children && child.children.length >= 2) {
              const key = this.getValueFromNode(child.children[0]);
              const value = this.getValueFromNode(child.children[1]);
              obj[key] = value;
            }
          });
        }
        return obj;
      case 'Identifier':
        return `<variable: ${node.value}>`;
      case 'BinaryExpression':
        return `<expression: ${node.value || 'binary'}>`;
      case 'CallExpression':
        return `<function call: ${node.value || 'unknown'}>`;
      default:
        return `<${node.type}>`;
    }
  }

  /**
   * Get type from value
   */
  private getTypeFromValue(value: any): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object') return 'object';
    return typeof value;
  }

  /**
   * Infer type from AST node
   */
  private inferType(node: ASTNode): string {
    if (node.metadata?.dataType) {
      return node.metadata.dataType;
    }
    
    if (node.children && node.children.length > 0) {
      const valueNode = node.children[0];
      switch (valueNode.type) {
        case 'NumberLiteral':
        case 'Literal':
          return typeof valueNode.value === 'number' ? 'number' : 'unknown';
        case 'StringLiteral':
          return 'string';
        case 'BooleanLiteral':
          return 'boolean';
        case 'NullLiteral':
          return 'null';
        default:
          return 'unknown';
      }
    }
    
    return 'auto';
  }

  /**
   * Create simplified AST for debugging (temporary solution)
   */
  private createSimplifiedAST(sourceCode: string): ASTNode {
    const lines = sourceCode.split('\n');
    const nodes: ASTNode[] = [];

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const node = this.parseLineToNode(trimmed, index + 1);
        if (node) {
          nodes.push(node);
        }
      }
    });

    return {
      type: 'Program',
      location: { line: 1, column: 1, offset: 0 },
      children: nodes
    };
  }

  /**
   * Parse a single line to AST node
   */
  private parseLineToNode(line: string, lineNumber: number): ASTNode | null {
    const trimmed = line.toLowerCase().trim();
    const original = line.trim();
    
    // Variable declarations
    if (trimmed.startsWith('let ') || trimmed.startsWith('int ') || 
        trimmed.startsWith('float ') || trimmed.startsWith('string ') || 
        trimmed.startsWith('bool ')) {
      
      const parts = original.split('=');
      if (parts.length >= 2) {
        const varPart = parts[0].trim();
        const valuePart = parts[1].trim();
        const varName = varPart.split(' ').pop() || 'unknown';
        
        return {
          type: 'VariableDeclaration',
          location: { line: lineNumber, column: 1, offset: 0 },
          value: varName,
          children: [this.parseValue(valuePart, lineNumber)]
        };
      }
    }
    
    // Assignments
    if (original.includes(' = ') && !trimmed.startsWith('let ') && 
        !trimmed.startsWith('int ') && !trimmed.startsWith('float ') && 
        !trimmed.startsWith('string ') && !trimmed.startsWith('bool ')) {
      
      const parts = original.split('=');
      if (parts.length >= 2) {
        const varName = parts[0].trim();
        const valuePart = parts[1].trim();
        
        return {
          type: 'Assignment',
          location: { line: lineNumber, column: 1, offset: 0 },
          children: [
            { type: 'Identifier', value: varName, location: { line: lineNumber, column: 1, offset: 0 } },
            this.parseValue(valuePart, lineNumber)
          ]
        };
      }
    }
    
    // Loop statements
    if (trimmed.startsWith('loop ')) {
      const loopMatch = original.match(/loop\s+(\w+)\s*=/i);
      if (loopMatch) {
        const loopVar = loopMatch[1];
        return {
          type: 'LoopStatement',
          location: { line: lineNumber, column: 1, offset: 0 },
          value: original,
          children: [{
            type: 'LoopVariable',
            value: loopVar,
            location: { line: lineNumber, column: 1, offset: 0 }
          }]
        };
      }
    }
    
    // Function declarations
    if (trimmed.startsWith('func ')) {
      const funcMatch = original.match(/func\s+(\w+)/i);
      if (funcMatch) {
        return {
          type: 'FunctionDeclaration',
          location: { line: lineNumber, column: 1, offset: 0 },
          value: funcMatch[1],
          children: []
        };
      }
    }
    
    // Other statements
    return {
      type: this.getNodeType(original),
      location: { line: lineNumber, column: 1, offset: 0 },
      value: original
    };
  }

  /**
   * Parse value string to AST node
   */
  private parseValue(value: string, lineNumber: number): ASTNode {
    const trimmed = value.trim();
    
    // String literals
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || 
        (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
      return {
        type: 'StringLiteral',
        value: trimmed.slice(1, -1),
        location: { line: lineNumber, column: 1, offset: 0 }
      };
    }
    
    // Number literals
    if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
      return {
        type: 'NumberLiteral',
        value: parseFloat(trimmed),
        location: { line: lineNumber, column: 1, offset: 0 }
      };
    }
    
    // Boolean literals
    if (trimmed === 'true' || trimmed === 'false') {
      return {
        type: 'BooleanLiteral',
        value: trimmed === 'true',
        location: { line: lineNumber, column: 1, offset: 0 }
      };
    }
    
    // Null literal
    if (trimmed === 'null') {
      return {
        type: 'NullLiteral',
        value: null,
        location: { line: lineNumber, column: 1, offset: 0 }
      };
    }
    
    // Default to identifier or expression
    return {
      type: 'Identifier',
      value: trimmed,
      location: { line: lineNumber, column: 1, offset: 0 }
    };
  }

  /**
   * Get node type from line content
   */
  private getNodeType(line: string): string {
    const trimmed = line.toLowerCase().trim();
    
    if (trimmed.startsWith('let ') || trimmed.startsWith('int ') || 
        trimmed.startsWith('float ') || trimmed.startsWith('string ') || 
        trimmed.startsWith('bool ')) {
      return 'VariableDeclaration';
    }
    if (trimmed.startsWith('print ')) return 'PrintStatement';
    if (trimmed.startsWith('if ')) return 'IfStatement';
    if (trimmed.startsWith('loop ')) return 'LoopStatement';
    if (trimmed.startsWith('func ')) return 'FunctionDeclaration';
    if (trimmed.startsWith('class ')) return 'ClassDeclaration';
    if (trimmed.startsWith('return ')) return 'ReturnStatement';
    if (trimmed.includes(' = ')) return 'Assignment';
    if (trimmed === 'start:') return 'BlockStart';
    if (trimmed === 'end:') return 'BlockEnd';
    
    return 'Expression';
  }

  /**
   * Build source map for line-to-AST mapping
   */
  private buildSourceMap(): void {
    if (!this.session?.ast) return;

    this.session.sourceMap.clear();
    this.mapASTNodes(this.session.ast);
  }

  /**
   * Recursively map AST nodes to source locations
   */
  private mapASTNodes(node: ASTNode): void {
    if (!this.session) return;

    const line = node.location.line;
    if (!this.session.sourceMap.has(line)) {
      this.session.sourceMap.set(line, []);
    }
    this.session.sourceMap.get(line)!.push(node.location);

    if (node.children) {
      node.children.forEach(child => this.mapASTNodes(child));
    }
  }

  /**
   * Add or update breakpoint
   */
  addBreakpoint(line: number, condition?: string, logMessage?: string): Breakpoint {
    const existing = this.state.breakpoints.find(bp => bp.line === line);
    
    if (existing) {
      existing.enabled = true;
      existing.condition = condition;
      existing.logMessage = logMessage;
      this.notifyListeners();
      return existing;
    }

    const breakpoint: Breakpoint = {
      id: `bp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      line,
      enabled: true,
      condition,
      logMessage,
      hitCount: 0
    };

    this.state.breakpoints.push(breakpoint);
    this.notifyListeners();
    return breakpoint;
  }

  /**
   * Remove breakpoint
   */
  removeBreakpoint(line: number): void {
    this.state.breakpoints = this.state.breakpoints.filter(bp => bp.line !== line);
    this.notifyListeners();
  }

  /**
   * Toggle breakpoint
   */
  toggleBreakpoint(line: number): void {
    const existing = this.state.breakpoints.find(bp => bp.line === line);
    
    if (existing) {
      existing.enabled = !existing.enabled;
    } else {
      this.addBreakpoint(line);
    }
    
    this.notifyListeners();
  }

  /**
   * Check if line has breakpoint
   */
  hasBreakpoint(line: number): boolean {
    return this.state.breakpoints.some(bp => bp.line === line && bp.enabled);
  }

  /**
   * Handle breakpoint hit
   */
  private handleBreakpointHit(payload: { line: number; variables: Record<string, any> }): void {
    const breakpoint = this.state.breakpoints.find(bp => bp.line === payload.line && bp.enabled);
    
    if (breakpoint) {
      breakpoint.hitCount++;
      
      // Check condition if present
      if (breakpoint.condition) {
        try {
          // Evaluate condition (simplified)
          const conditionMet = this.evaluateCondition(breakpoint.condition, payload.variables);
          if (!conditionMet) return;
        } catch (error) {
          this.addError({
            type: 'runtime',
            message: `Breakpoint condition error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            location: { line: payload.line, column: 1, offset: 0 },
            severity: 'warning'
          });
        }
      }

      // Log message if present
      if (breakpoint.logMessage) {
        eventBus.emit('console.message', {
          type: 'system',
          content: `[BREAKPOINT] ${breakpoint.logMessage}`,
          timestamp: Date.now()
        });
      }

      // Pause execution
      this.pauseExecution(payload.line, 1);
      this.updateVariables(payload.variables);
    }
  }

  /**
   * Evaluate breakpoint condition
   */
  private evaluateCondition(condition: string, variables: Record<string, any>): boolean {
    // Simplified condition evaluation
    // In production, you'd want a proper expression evaluator
    try {
      const func = new Function(...Object.keys(variables), `return ${condition}`);
      return Boolean(func(...Object.values(variables)));
    } catch {
      return false;
    }
  }

  /**
   * Pause execution at specific location
   */
  pauseExecution(line: number, column: number = 1): void {
    this.state.isPaused = true;
    this.state.currentLine = line;
    this.state.currentColumn = column;
    this.notifyListeners();

    eventBus.emit('debug.execution_paused', { line, column });
  }

  /**
   * Continue execution
   */
  continueExecution(): void {
    this.state.isPaused = false;
    this.state.stepMode = null;
    this.notifyListeners();

    if (this.stepResolve) {
      this.stepResolve();
      this.stepResolve = null;
    }

    eventBus.emit('debug.execution_continued', {});
  }

  /**
   * Step over (execute next line)
   */
  async stepOver(): Promise<void> {
    return new Promise((resolve) => {
      // Prevent multiple step operations
      if (this.stepResolve) {
        this.stepResolve();
      }
      
      this.state.stepMode = 'over';
      this.stepResolve = () => {
        resolve();
        this.stepResolve = null;
      };
      this.notifyListeners();
      
      // Auto-resolve after timeout to prevent hanging
      setTimeout(() => {
        if (this.stepResolve) {
          this.stepResolve();
        }
      }, 5000);
      
      eventBus.emit('debug.step_request', { mode: 'over' });
    });
  }

  /**
   * Step into (enter function calls)
   */
  async stepInto(): Promise<void> {
    return new Promise((resolve) => {
      // Prevent multiple step operations
      if (this.stepResolve) {
        this.stepResolve();
      }
      
      this.state.stepMode = 'into';
      this.stepResolve = () => {
        resolve();
        this.stepResolve = null;
      };
      this.notifyListeners();
      
      // Auto-resolve after timeout to prevent hanging
      setTimeout(() => {
        if (this.stepResolve) {
          this.stepResolve();
        }
      }, 5000);
      
      eventBus.emit('debug.step_request', { mode: 'into' });
    });
  }

  /**
   * Step out (exit current function)
   */
  async stepOut(): Promise<void> {
    return new Promise((resolve) => {
      // Prevent multiple step operations
      if (this.stepResolve) {
        this.stepResolve();
      }
      
      this.state.stepMode = 'out';
      this.stepResolve = () => {
        resolve();
        this.stepResolve = null;
      };
      this.notifyListeners();
      
      // Auto-resolve after timeout to prevent hanging
      setTimeout(() => {
        if (this.stepResolve) {
          this.stepResolve();
        }
      }, 5000);
      
      eventBus.emit('debug.step_request', { mode: 'out' });
    });
  }

  /**
   * Handle step completion
   */
  private handleStepComplete(payload: { line: number; column: number }): void {
    this.state.currentLine = payload.line;
    this.state.currentColumn = payload.column;
    this.state.stepMode = null;
    
    if (this.stepResolve) {
      this.stepResolve();
      this.stepResolve = null;
    }
    
    this.notifyListeners();
  }

  /**
   * Update variables
   */
  updateVariables(variables: Record<string, any>): void {
    this.state.variables = Object.entries(variables).map(([name, value]) => ({
      name,
      value,
      type: this.getVariableType(value),
      scope: 'local', // Simplified
      isExpandable: typeof value === 'object' && value !== null
    }));
    
    this.notifyListeners();
  }

  /**
   * Get variable type
   */
  private getVariableType(value: any): string {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  }

  /**
   * Add error
   */
  addError(error: DebugError): void {
    this.state.errors.push(error);
    this.notifyListeners();
    
    eventBus.emit('debug.error_added', error);
  }

  /**
   * Clear errors
   */
  clearErrors(): void {
    this.state.errors = [];
    this.notifyListeners();
  }

  /**
   * Handle execution error
   */
  private handleExecutionError(payload: any): void {
    const error: DebugError = {
      type: payload.type || 'runtime',
      message: payload.message,
      location: payload.location || { line: this.state.currentLine, column: this.state.currentColumn, offset: 0 },
      severity: payload.severity || 'error',
      code: payload.code,
      suggestions: payload.suggestions || [],
      stackTrace: payload.stackTrace || []
    };
    
    this.addError(error);
    
    // Pause on error if debugging
    if (this.state.isDebugging) {
      this.pauseExecution(error.location.line, error.location.column);
    }
  }

  /**
   * Add watch expression
   */
  addWatchExpression(expression: string): void {
    if (!this.state.watchExpressions.includes(expression)) {
      this.state.watchExpressions.push(expression);
      this.notifyListeners();
    }
  }

  /**
   * Remove watch expression
   */
  removeWatchExpression(expression: string): void {
    this.state.watchExpressions = this.state.watchExpressions.filter(expr => expr !== expression);
    this.notifyListeners();
  }

  /**
   * Get current state
   */
  getState(): DebugState {
    return { ...this.state };
  }

  /**
   * Get current session
   */
  getSession(): DebugSession | null {
    return this.session;
  }
}

// Export singleton instance
export const debuggerEngine = new DebuggerEngine();