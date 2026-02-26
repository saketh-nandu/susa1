// SUSA Debugger - Enhanced interpreter with debugging support

import { ASTNode, parse } from './parser';
import { useDebuggerStore } from '@/store/debuggerStore';

export interface RuntimeOutput {
  type: 'output' | 'error' | 'info';
  content: string;
  line?: number;
}

export interface DebugExecutionResult {
  success: boolean;
  outputs: RuntimeOutput[];
  variables: Record<string, unknown>;
  error?: string;
  errorLine?: number;
}

interface DebugContext {
  variables: Record<string, unknown>;
  outputs: RuntimeOutput[];
  breakFlag: boolean;
  continueFlag: boolean;
  shouldStop: boolean;
  onOutput?: (output: RuntimeOutput) => void;
}

class DebugInterpreter {
  private context: DebugContext = {
    variables: {},
    outputs: [],
    breakFlag: false,
    continueFlag: false,
    shouldStop: false,
  };

  async executeDebug(
    source: string,
    onOutput?: (output: RuntimeOutput) => void
  ): Promise<DebugExecutionResult> {
    this.context = {
      variables: {},
      outputs: [],
      breakFlag: false,
      continueFlag: false,
      shouldStop: false,
      onOutput,
    };

    const debugStore = useDebuggerStore.getState();
    debugStore.startDebug();

    const { ast, errors } = parse(source);

    if (errors.length > 0) {
      const errorOutputs = errors.map((e) => ({
        type: 'error' as const,
        content: `[Line ${e.line}] ${e.message}`,
        line: e.line,
      }));
      debugStore.stopDebug();
      return {
        success: false,
        outputs: errorOutputs,
        variables: {},
        error: errors[0].message,
        errorLine: errors[0].line,
      };
    }

    if (!ast) {
      debugStore.stopDebug();
      return {
        success: false,
        outputs: [{ type: 'error', content: 'Failed to parse program' }],
        variables: {},
        error: 'Failed to parse program',
      };
    }

    try {
      await this.executeNode(ast);
      debugStore.stopDebug();
      return {
        success: true,
        outputs: this.context.outputs,
        variables: { ...this.context.variables },
      };
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      debugStore.stopDebug();
      return {
        success: false,
        outputs: [
          ...this.context.outputs,
          { type: 'error', content: message },
        ],
        variables: { ...this.context.variables },
        error: message,
      };
    }
  }

  private async checkBreakpoint(line: number): Promise<void> {
    const debugStore = useDebuggerStore.getState();
    
    if (this.context.shouldStop) {
      throw new Error('Execution stopped');
    }

    // Update current line
    debugStore.setCurrentLine(line);
    debugStore.setVariables(this.context.variables);

    const hasBreakpoint = debugStore.hasBreakpoint(line);
    const state = debugStore.state;
    const stepMode = debugStore.stepMode;

    // Check if we should pause
    const shouldPause = 
      hasBreakpoint || 
      stepMode === 'over' || 
      stepMode === 'into';

    if (shouldPause && state !== 'idle') {
      debugStore.setState('paused');
      
      // Wait for user to continue/step
      await new Promise<void>((resolve) => {
        debugStore.setStepResolve(resolve);
        
        // Check if stopped while waiting
        const unsubscribe = useDebuggerStore.subscribe((newState) => {
          if (newState.state === 'idle') {
            this.context.shouldStop = true;
            resolve();
            unsubscribe();
          }
        });
      });

      // Re-check if stopped
      if (useDebuggerStore.getState().state === 'idle') {
        throw new Error('Execution stopped');
      }
    }

    // Small delay for visual feedback when running
    if (state === 'running') {
      await new Promise((r) => setTimeout(r, 50));
    }
  }

  private async executeNode(node: ASTNode): Promise<unknown> {
    if (node.line) {
      await this.checkBreakpoint(node.line);
    }

    switch (node.type) {
      case 'Program':
        return this.executeProgram(node);
      case 'VariableDeclaration':
        return this.executeVariableDeclaration(node);
      case 'Assignment':
        return this.executeAssignment(node);
      case 'PrintStatement':
        return this.executePrint(node);
      case 'IfStatement':
        return this.executeIf(node);
      case 'WhileLoop':
        return this.executeWhile(node);
      case 'ForLoop':
        return this.executeFor(node);
      case 'BreakStatement':
        this.context.breakFlag = true;
        return null;
      case 'ContinueStatement':
        this.context.continueFlag = true;
        return null;
      case 'BinaryExpression':
        return this.evaluateBinaryExpression(node);
      case 'UnaryExpression':
        return this.evaluateUnaryExpression(node);
      case 'Identifier':
        return this.getVariable(node.name!);
      case 'NumberLiteral':
      case 'StringLiteral':
      case 'BooleanLiteral':
      case 'NullLiteral':
        return node.value;
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  private async executeProgram(node: ASTNode): Promise<void> {
    if (node.body) {
      for (const stmt of node.body) {
        await this.executeNode(stmt);
        if (this.context.breakFlag || this.context.continueFlag) break;
        if (this.context.shouldStop) break;
      }
    }
  }

  private async executeVariableDeclaration(node: ASTNode): Promise<void> {
    const value = await this.executeNode(node.right!);
    this.context.variables[node.name!] = value;
    useDebuggerStore.getState().setVariables(this.context.variables);
  }

  private async executeAssignment(node: ASTNode): Promise<void> {
    const value = await this.executeNode(node.right!);
    if (!(node.name! in this.context.variables)) {
      throw new Error(`Variable '${node.name}' is not defined`);
    }
    this.context.variables[node.name!] = value;
    useDebuggerStore.getState().setVariables(this.context.variables);
  }

  private async executePrint(node: ASTNode): Promise<void> {
    const value = await this.executeNode(node.right!);
    const output: RuntimeOutput = {
      type: 'output',
      content: String(value),
      line: node.line,
    };
    this.context.outputs.push(output);
    if (this.context.onOutput) {
      this.context.onOutput(output);
    }
  }

  private async executeIf(node: ASTNode): Promise<void> {
    const condition = await this.executeNode(node.condition!);
    
    if (this.isTruthy(condition)) {
      if (node.body) {
        for (const stmt of node.body) {
          await this.executeNode(stmt);
          if (this.context.breakFlag || this.context.continueFlag) break;
          if (this.context.shouldStop) break;
        }
      }
    } else if (node.elseBody) {
      for (const stmt of node.elseBody) {
        await this.executeNode(stmt);
        if (this.context.breakFlag || this.context.continueFlag) break;
        if (this.context.shouldStop) break;
      }
    }
  }

  private async executeWhile(node: ASTNode): Promise<void> {
    let iterations = 0;
    const maxIterations = 10000;

    while (this.isTruthy(await this.executeNode(node.condition!))) {
      if (++iterations > maxIterations) {
        throw new Error('Maximum loop iterations exceeded');
      }

      if (this.context.shouldStop) break;

      if (node.body) {
        for (const stmt of node.body) {
          await this.executeNode(stmt);
          if (this.context.breakFlag) {
            this.context.breakFlag = false;
            return;
          }
          if (this.context.continueFlag) {
            this.context.continueFlag = false;
            break;
          }
          if (this.context.shouldStop) break;
        }
      }
    }
  }

  private async executeFor(node: ASTNode): Promise<void> {
    const start = Number(await this.executeNode(node.init!));
    const end = Number(await this.executeNode(node.to!));
    const varName = node.variable!;

    for (let i = start; i <= end; i++) {
      this.context.variables[varName] = i;
      useDebuggerStore.getState().setVariables(this.context.variables);

      if (this.context.shouldStop) break;

      if (node.body) {
        for (const stmt of node.body) {
          await this.executeNode(stmt);
          if (this.context.breakFlag) {
            this.context.breakFlag = false;
            return;
          }
          if (this.context.continueFlag) {
            this.context.continueFlag = false;
            break;
          }
          if (this.context.shouldStop) break;
        }
      }
    }
  }

  private async evaluateBinaryExpression(node: ASTNode): Promise<unknown> {
    const left = await this.executeNode(node.left!);
    const right = await this.executeNode(node.right!);
    const op = node.operator!;

    switch (op) {
      case '+':
        if (typeof left === 'string' || typeof right === 'string') {
          return String(left) + String(right);
        }
        return Number(left) + Number(right);
      case '-':
        return Number(left) - Number(right);
      case '*':
        return Number(left) * Number(right);
      case '/':
        if (Number(right) === 0) throw new Error('Division by zero');
        return Number(left) / Number(right);
      case '%':
        return Number(left) % Number(right);
      case '==':
        return left === right;
      case '!=':
        return left !== right;
      case '<':
        return Number(left) < Number(right);
      case '>':
        return Number(left) > Number(right);
      case '<=':
        return Number(left) <= Number(right);
      case '>=':
        return Number(left) >= Number(right);
      case 'AND':
        return this.isTruthy(left) && this.isTruthy(right);
      case 'OR':
        return this.isTruthy(left) || this.isTruthy(right);
      default:
        throw new Error(`Unknown operator: ${op}`);
    }
  }

  private async evaluateUnaryExpression(node: ASTNode): Promise<unknown> {
    const operand = await this.executeNode(node.operand!);
    const op = node.operator!;

    switch (op) {
      case '-':
        return -Number(operand);
      case '!':
      case 'NOT':
        return !this.isTruthy(operand);
      default:
        throw new Error(`Unknown unary operator: ${op}`);
    }
  }

  private getVariable(name: string): unknown {
    if (!(name in this.context.variables)) {
      throw new Error(`Variable '${name}' is not defined`);
    }
    return this.context.variables[name];
  }

  private isTruthy(value: unknown): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value !== 0;
    if (typeof value === 'string') return value.length > 0;
    return true;
  }
}

export async function runSUSADebug(
  source: string,
  onOutput?: (output: RuntimeOutput) => void
): Promise<DebugExecutionResult> {
  const interpreter = new DebugInterpreter();
  return interpreter.executeDebug(source, onOutput);
}
