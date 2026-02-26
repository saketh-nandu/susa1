// SUSA Language Interpreter

import { ASTNode, parse } from './parser';

export interface RuntimeOutput {
  type: 'output' | 'error' | 'info';
  content: string;
  line?: number;
}

export interface ExecutionResult {
  success: boolean;
  outputs: RuntimeOutput[];
  variables: Record<string, unknown>;
  error?: string;
  errorLine?: number;
}

export interface ExecutionContext {
  variables: Record<string, unknown>;
  outputs: RuntimeOutput[];
  breakFlag: boolean;
  continueFlag: boolean;
  onLineExecute?: (line: number) => void;
  onOutput?: (output: RuntimeOutput) => void;
}

class Interpreter {
  private context: ExecutionContext = {
    variables: {},
    outputs: [],
    breakFlag: false,
    continueFlag: false,
  };

  execute(
    source: string,
    onLineExecute?: (line: number) => void,
    onOutput?: (output: RuntimeOutput) => void
  ): ExecutionResult {
    this.context = {
      variables: {},
      outputs: [],
      breakFlag: false,
      continueFlag: false,
      onLineExecute,
      onOutput,
    };

    const { ast, errors } = parse(source);

    if (errors.length > 0) {
      const errorOutputs = errors.map((e) => ({
        type: 'error' as const,
        content: `[Line ${e.line}] ${e.message}`,
        line: e.line,
      }));
      return {
        success: false,
        outputs: errorOutputs,
        variables: {},
        error: errors[0].message,
        errorLine: errors[0].line,
      };
    }

    if (!ast) {
      return {
        success: false,
        outputs: [{ type: 'error', content: 'Failed to parse program' }],
        variables: {},
        error: 'Failed to parse program',
      };
    }

    try {
      this.executeNode(ast);
      return {
        success: true,
        outputs: this.context.outputs,
        variables: { ...this.context.variables },
      };
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
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

  private executeNode(node: ASTNode): unknown {
    if (this.context.onLineExecute && node.line) {
      this.context.onLineExecute(node.line);
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
      case 'RTStringLiteral':
        return this.evaluateRTString(node);
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  private executeProgram(node: ASTNode): void {
    if (node.body) {
      for (const stmt of node.body) {
        this.executeNode(stmt);
        if (this.context.breakFlag || this.context.continueFlag) break;
      }
    }
  }

  private executeVariableDeclaration(node: ASTNode): void {
    const value = this.executeNode(node.right!);
    this.context.variables[node.name!] = value;
  }

  private executeAssignment(node: ASTNode): void {
    const value = this.executeNode(node.right!);
    if (!(node.name! in this.context.variables)) {
      throw new Error(`Variable '${node.name}' is not defined`);
    }
    this.context.variables[node.name!] = value;
  }

  private executePrint(node: ASTNode): void {
    const value = this.executeNode(node.right!);
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

  private executeIf(node: ASTNode): void {
    const condition = this.executeNode(node.condition!);
    
    if (this.isTruthy(condition)) {
      if (node.body) {
        for (const stmt of node.body) {
          this.executeNode(stmt);
          if (this.context.breakFlag || this.context.continueFlag) break;
        }
      }
    } else if (node.elseBody) {
      for (const stmt of node.elseBody) {
        this.executeNode(stmt);
        if (this.context.breakFlag || this.context.continueFlag) break;
      }
    }
  }

  private executeWhile(node: ASTNode): void {
    let iterations = 0;
    const maxIterations = 10000; // Prevent infinite loops

    while (this.isTruthy(this.executeNode(node.condition!))) {
      if (++iterations > maxIterations) {
        throw new Error('Maximum loop iterations exceeded (possible infinite loop)');
      }

      if (node.body) {
        for (const stmt of node.body) {
          this.executeNode(stmt);
          if (this.context.breakFlag) {
            this.context.breakFlag = false;
            return;
          }
          if (this.context.continueFlag) {
            this.context.continueFlag = false;
            break;
          }
        }
      }
    }
  }

  private executeFor(node: ASTNode): void {
    const start = Number(this.executeNode(node.init!));
    const end = Number(this.executeNode(node.to!));
    const varName = node.variable!;

    for (let i = start; i <= end; i++) {
      this.context.variables[varName] = i;

      if (node.body) {
        for (const stmt of node.body) {
          this.executeNode(stmt);
          if (this.context.breakFlag) {
            this.context.breakFlag = false;
            return;
          }
          if (this.context.continueFlag) {
            this.context.continueFlag = false;
            break;
          }
        }
      }
    }
  }

  private evaluateBinaryExpression(node: ASTNode): unknown {
    const left = this.executeNode(node.left!);
    const right = this.executeNode(node.right!);
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
        if (Number(right) === 0) {
          throw new Error('Division by zero');
        }
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

  private evaluateUnaryExpression(node: ASTNode): unknown {
    const operand = this.executeNode(node.operand!);
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

  private evaluateRTString(node: ASTNode): string {
    let result = '';
    let exprIndex = 0;
    
    for (const part of node.template || []) {
      if (part === null) {
        // This is a placeholder for an expression
        if (exprIndex < (node.expressions?.length || 0)) {
          const exprValue = this.executeNode(node.expressions![exprIndex]);
          result += String(exprValue);
          exprIndex++;
        }
      } else {
        // This is a literal string part
        result += part;
      }
    }
    
    return result;
  }
}

export function runSUSA(
  source: string,
  onLineExecute?: (line: number) => void,
  onOutput?: (output: RuntimeOutput) => void
): ExecutionResult {
  const interpreter = new Interpreter();
  return interpreter.execute(source, onLineExecute, onOutput);
}
