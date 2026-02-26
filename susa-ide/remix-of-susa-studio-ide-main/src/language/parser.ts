// SUSA Language Parser - Builds an AST from tokens

import { Token, tokenize } from './tokenizer';

export type ASTNodeType =
  | 'Program'
  | 'VariableDeclaration'
  | 'Assignment'
  | 'PrintStatement'
  | 'IfStatement'
  | 'WhileLoop'
  | 'ForLoop'
  | 'BreakStatement'
  | 'ContinueStatement'
  | 'BinaryExpression'
  | 'UnaryExpression'
  | 'Identifier'
  | 'NumberLiteral'
  | 'StringLiteral'
  | 'RTStringLiteral'
  | 'BooleanLiteral'
  | 'NullLiteral'
  | 'Block';

export interface ASTNode {
  type: ASTNodeType;
  line: number;
  column: number;
  value?: string | number | boolean | null;
  name?: string;
  template?: string[];
  expressions?: ASTNode[];
  left?: ASTNode;
  right?: ASTNode;
  operator?: string;
  operand?: ASTNode;
  condition?: ASTNode;
  body?: ASTNode[];
  elseBody?: ASTNode[];
  init?: ASTNode;
  to?: ASTNode;
  variable?: string;
  children?: ASTNode[];
}

export interface ParseError {
  message: string;
  line: number;
  column: number;
  severity: 'error' | 'warning';
}

class Parser {
  private tokens: Token[] = [];
  private pos = 0;
  private errors: ParseError[] = [];

  parse(source: string): { ast: ASTNode | null; errors: ParseError[] } {
    this.tokens = tokenize(source).filter(
      (t) => t.type !== 'WHITESPACE' && t.type !== 'NEWLINE' && t.type !== 'COMMENT'
    );
    this.pos = 0;
    this.errors = [];

    try {
      const ast = this.parseProgram();
      return { ast, errors: this.errors };
    } catch (e) {
      if (e instanceof Error) {
        this.errors.push({
          message: e.message,
          line: this.current()?.line || 1,
          column: this.current()?.column || 1,
          severity: 'error',
        });
      }
      return { ast: null, errors: this.errors };
    }
  }

  private current(): Token | null {
    return this.tokens[this.pos] || null;
  }

  private peek(offset = 0): Token | null {
    return this.tokens[this.pos + offset] || null;
  }

  private advance(): Token | null {
    return this.tokens[this.pos++] || null;
  }

  private expect(type: string, value?: string): Token {
    const token = this.current();
    if (!token || token.type !== type || (value && token.value !== value)) {
      const expected = value ? `${type} '${value}'` : type;
      const got = token ? `${token.type} '${token.value}'` : 'end of file';
      throw new Error(`Expected ${expected}, got ${got}`);
    }
    return this.advance()!;
  }

  private match(type: string, value?: string): boolean {
    const token = this.current();
    return token !== null && token.type === type && (!value || token.value === value);
  }

  private parseProgram(): ASTNode {
    this.expect('KEYWORD', 'START');
    const body = this.parseBlock();
    
    if (!this.match('KEYWORD', 'END')) {
      this.errors.push({
        message: "Missing 'END' keyword to close program",
        line: this.current()?.line || 1,
        column: this.current()?.column || 1,
        severity: 'error',
      });
    } else {
      this.advance();
    }

    return {
      type: 'Program',
      line: 1,
      column: 1,
      body,
    };
  }

  private parseBlock(): ASTNode[] {
    const statements: ASTNode[] = [];

    while (
      this.current() &&
      !this.match('KEYWORD', 'END') &&
      !this.match('KEYWORD', 'ELSE')
    ) {
      const stmt = this.parseStatement();
      if (stmt) statements.push(stmt);
    }

    return statements;
  }

  private parseStatement(): ASTNode | null {
    const token = this.current();
    if (!token) return null;

    if (token.type === 'KEYWORD') {
      switch (token.value) {
        case 'USE':
          return this.parseVariableDeclaration();
        case 'PRINT':
          return this.parsePrintStatement();
        case 'IF':
          return this.parseIfStatement();
        case 'WHILE':
          return this.parseWhileLoop();
        case 'LOOP':
          return this.parseForLoop();
        case 'BREAK':
          this.advance();
          return { type: 'BreakStatement', line: token.line, column: token.column };
        case 'CONTINUE':
          this.advance();
          return { type: 'ContinueStatement', line: token.line, column: token.column };
        default:
          this.errors.push({
            message: `Unexpected keyword '${token.value}'`,
            line: token.line,
            column: token.column,
            severity: 'warning',
          });
          this.advance();
          return null;
      }
    }

    if (token.type === 'IDENTIFIER') {
      return this.parseAssignment();
    }

    this.advance();
    return null;
  }

  private parseVariableDeclaration(): ASTNode {
    const token = this.expect('KEYWORD', 'USE');
    const nameToken = this.expect('IDENTIFIER');
    this.expect('OPERATOR', '=');
    const value = this.parseExpression();

    return {
      type: 'VariableDeclaration',
      line: token.line,
      column: token.column,
      name: nameToken.value,
      right: value,
    };
  }

  private parseAssignment(): ASTNode {
    const nameToken = this.expect('IDENTIFIER');
    this.expect('OPERATOR', '=');
    const value = this.parseExpression();

    return {
      type: 'Assignment',
      line: nameToken.line,
      column: nameToken.column,
      name: nameToken.value,
      right: value,
    };
  }

  private parsePrintStatement(): ASTNode {
    const token = this.expect('KEYWORD', 'PRINT');
    const value = this.parseExpression();

    return {
      type: 'PrintStatement',
      line: token.line,
      column: token.column,
      right: value,
    };
  }

  private parseIfStatement(): ASTNode {
    const token = this.expect('KEYWORD', 'IF');
    const condition = this.parseExpression();
    const body = this.parseBlock();
    let elseBody: ASTNode[] | undefined;

    if (this.match('KEYWORD', 'ELSE')) {
      this.advance();
      elseBody = this.parseBlock();
    }

    if (!this.match('KEYWORD', 'END')) {
      this.errors.push({
        message: "Missing 'END' keyword to close IF statement",
        line: this.current()?.line || token.line,
        column: this.current()?.column || token.column,
        severity: 'error',
      });
    } else {
      this.advance();
    }

    return {
      type: 'IfStatement',
      line: token.line,
      column: token.column,
      condition,
      body,
      elseBody,
    };
  }

  private parseWhileLoop(): ASTNode {
    const token = this.expect('KEYWORD', 'WHILE');
    const condition = this.parseExpression();
    const body = this.parseBlock();

    if (!this.match('KEYWORD', 'END')) {
      this.errors.push({
        message: "Missing 'END' keyword to close WHILE loop",
        line: this.current()?.line || token.line,
        column: this.current()?.column || token.column,
        severity: 'error',
      });
    } else {
      this.advance();
    }

    return {
      type: 'WhileLoop',
      line: token.line,
      column: token.column,
      condition,
      body,
    };
  }

  private parseForLoop(): ASTNode {
    const token = this.expect('KEYWORD', 'LOOP');
    const varToken = this.expect('IDENTIFIER');
    this.expect('KEYWORD', 'FROM');
    const init = this.parseExpression();
    this.expect('KEYWORD', 'TO');
    const to = this.parseExpression();
    const body = this.parseBlock();

    if (!this.match('KEYWORD', 'END')) {
      this.errors.push({
        message: "Missing 'END' keyword to close LOOP",
        line: this.current()?.line || token.line,
        column: this.current()?.column || token.column,
        severity: 'error',
      });
    } else {
      this.advance();
    }

    return {
      type: 'ForLoop',
      line: token.line,
      column: token.column,
      variable: varToken.value,
      init,
      to,
      body,
    };
  }

  private parseExpression(): ASTNode {
    return this.parseOr();
  }

  private parseOr(): ASTNode {
    let left = this.parseAnd();

    while (this.match('KEYWORD', 'OR') || this.match('OPERATOR', '||')) {
      const op = this.advance()!;
      const right = this.parseAnd();
      left = {
        type: 'BinaryExpression',
        line: op.line,
        column: op.column,
        operator: 'OR',
        left,
        right,
      };
    }

    return left;
  }

  private parseAnd(): ASTNode {
    let left = this.parseEquality();

    while (this.match('KEYWORD', 'AND') || this.match('OPERATOR', '&&')) {
      const op = this.advance()!;
      const right = this.parseEquality();
      left = {
        type: 'BinaryExpression',
        line: op.line,
        column: op.column,
        operator: 'AND',
        left,
        right,
      };
    }

    return left;
  }

  private parseEquality(): ASTNode {
    let left = this.parseComparison();

    while (this.match('OPERATOR', '==') || this.match('OPERATOR', '!=')) {
      const op = this.advance()!;
      const right = this.parseComparison();
      left = {
        type: 'BinaryExpression',
        line: op.line,
        column: op.column,
        operator: op.value,
        left,
        right,
      };
    }

    return left;
  }

  private parseComparison(): ASTNode {
    let left = this.parseAddition();

    while (
      this.match('OPERATOR', '<') ||
      this.match('OPERATOR', '>') ||
      this.match('OPERATOR', '<=') ||
      this.match('OPERATOR', '>=')
    ) {
      const op = this.advance()!;
      const right = this.parseAddition();
      left = {
        type: 'BinaryExpression',
        line: op.line,
        column: op.column,
        operator: op.value,
        left,
        right,
      };
    }

    return left;
  }

  private parseAddition(): ASTNode {
    let left = this.parseMultiplication();

    while (this.match('OPERATOR', '+') || this.match('OPERATOR', '-')) {
      const op = this.advance()!;
      const right = this.parseMultiplication();
      left = {
        type: 'BinaryExpression',
        line: op.line,
        column: op.column,
        operator: op.value,
        left,
        right,
      };
    }

    return left;
  }

  private parseMultiplication(): ASTNode {
    let left = this.parseUnary();

    while (
      this.match('OPERATOR', '*') ||
      this.match('OPERATOR', '/') ||
      this.match('OPERATOR', '%')
    ) {
      const op = this.advance()!;
      const right = this.parseUnary();
      left = {
        type: 'BinaryExpression',
        line: op.line,
        column: op.column,
        operator: op.value,
        left,
        right,
      };
    }

    return left;
  }

  private parseUnary(): ASTNode {
    if (
      this.match('OPERATOR', '-') ||
      this.match('OPERATOR', '!') ||
      this.match('KEYWORD', 'NOT')
    ) {
      const op = this.advance()!;
      const operand = this.parseUnary();
      return {
        type: 'UnaryExpression',
        line: op.line,
        column: op.column,
        operator: op.value,
        operand,
      };
    }

    return this.parsePrimary();
  }

  private parsePrimary(): ASTNode {
    const token = this.current();
    if (!token) {
      throw new Error('Unexpected end of input');
    }

    if (token.type === 'NUMBER') {
      this.advance();
      return {
        type: 'NumberLiteral',
        line: token.line,
        column: token.column,
        value: parseFloat(token.value),
      };
    }

    if (token.type === 'STRING') {
      this.advance();
      return {
        type: 'StringLiteral',
        line: token.line,
        column: token.column,
        value: token.value.slice(1, -1), // Remove quotes
      };
    }

    if (token.type === 'RT_STRING') {
      this.advance();
      return this.parseRTString(token);
    }

    if (token.type === 'BOOLEAN') {
      this.advance();
      return {
        type: 'BooleanLiteral',
        line: token.line,
        column: token.column,
        value: token.value === 'TRUE',
      };
    }

    if (token.type === 'NULL') {
      this.advance();
      return {
        type: 'NullLiteral',
        line: token.line,
        column: token.column,
        value: null,
      };
    }

    if (token.type === 'IDENTIFIER') {
      this.advance();
      return {
        type: 'Identifier',
        line: token.line,
        column: token.column,
        name: token.value,
      };
    }

    if (this.match('PUNCTUATION', '(')) {
      this.advance();
      const expr = this.parseExpression();
      this.expect('PUNCTUATION', ')');
      return expr;
    }

    throw new Error(`Unexpected token: ${token.value}`);
  }

  private parseRTString(token: Token): ASTNode {
    // Parse rt"Hello {name}!" into template parts and expressions
    const content = token.value.slice(3, -1); // Remove rt" and "
    const template: string[] = [];
    const expressions: ASTNode[] = [];
    
    let i = 0;
    let currentPart = '';
    
    while (i < content.length) {
      if (content[i] === '{') {
        // Save current part
        if (currentPart) {
          template.push(currentPart);
          currentPart = '';
        }
        
        // Find matching }
        let braceCount = 1;
        let exprStart = i + 1;
        i++;
        
        while (i < content.length && braceCount > 0) {
          if (content[i] === '{') braceCount++;
          else if (content[i] === '}') braceCount--;
          i++;
        }
        
        // Parse the expression
        const exprCode = content.slice(exprStart, i - 1);
        if (exprCode.trim()) {
          try {
            const exprTokens = tokenize(exprCode);
            const exprParser = new Parser();
            exprParser.tokens = exprTokens.filter(
              (t) => t.type !== 'WHITESPACE' && t.type !== 'NEWLINE' && t.type !== 'COMMENT'
            );
            exprParser.pos = 0;
            const expr = exprParser.parseExpression();
            expressions.push(expr);
            template.push(null as any); // Placeholder for expression
          } catch (e) {
            this.errors.push({
              message: `Error parsing expression in rt-string: ${e instanceof Error ? e.message : String(e)}`,
              line: token.line,
              column: token.column,
            });
          }
        }
      } else {
        currentPart += content[i];
        i++;
      }
    }
    
    if (currentPart) {
      template.push(currentPart);
    }
    
    return {
      type: 'RTStringLiteral',
      line: token.line,
      column: token.column,
      template,
      expressions,
    };
  }
}

export function parse(source: string): { ast: ASTNode | null; errors: ParseError[] } {
  const parser = new Parser();
  return parser.parse(source);
}
