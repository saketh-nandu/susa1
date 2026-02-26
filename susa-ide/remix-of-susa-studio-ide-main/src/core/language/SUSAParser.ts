/**
 * Production SUSA Parser with Complete AST Generation
 * Handles all SUSA language constructs with precise error reporting
 */

import { Token, TokenType, SUSALexer, LexerError } from './SUSALexer';

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

export interface ParseError {
  message: string;
  location: SourceLocation;
  severity: 'error' | 'warning' | 'info';
  code?: string;
  suggestions?: string[];
}

export interface ParseResult {
  ast: ASTNode | null;
  errors: ParseError[];
  warnings: ParseError[];
  tokens: Token[];
}

export class SUSAParser {
  private tokens: Token[] = [];
  private current: number = 0;
  private errors: ParseError[] = [];
  private warnings: ParseError[] = [];

  constructor(tokens: Token[]) {
    this.tokens = tokens.filter(t => t.type !== TokenType.WHITESPACE);
    this.current = 0;
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Parse tokens into AST
   */
  parse(): ParseResult {
    try {
      const ast = this.parseProgram();
      
      return {
        ast,
        errors: this.errors,
        warnings: this.warnings,
        tokens: this.tokens
      };
    } catch (error) {
      this.addError(
        `Fatal parse error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        this.getCurrentLocation(),
        'error'
      );
      
      return {
        ast: null,
        errors: this.errors,
        warnings: this.warnings,
        tokens: this.tokens
      };
    }
  }

  /**
   * Parse program (top-level)
   */
  private parseProgram(): ASTNode {
    const statements: ASTNode[] = [];
    const startLocation = this.getCurrentLocation();

    while (!this.isAtEnd()) {
      try {
        const stmt = this.parseStatement();
        if (stmt) {
          statements.push(stmt);
        }
      } catch (error) {
        // Skip to next statement on error
        this.synchronize();
      }
    }

    return {
      type: 'Program',
      location: startLocation,
      children: statements
    };
  }

  /**
   * Parse statement
   */
  private parseStatement(): ASTNode | null {
    try {
      // Skip newlines
      this.skipNewlines();
      
      if (this.isAtEnd()) return null;

      // Variable declarations
      if (this.match(TokenType.LET) || this.matchKeywordTypes()) {
        return this.parseVariableDeclaration();
      }

      // Function declarations
      if (this.match(TokenType.FUNC)) {
        return this.parseFunctionDeclaration();
      }

      // Class declarations
      if (this.check(TokenType.IDENTIFIER) && this.peek().value.toLowerCase() === 'class') {
        this.advance(); // consume 'class'
        return this.parseClassDeclaration();
      }

      // Control flow statements
      if (this.match(TokenType.IF)) {
        return this.parseIfStatement();
      }

      if (this.match(TokenType.WHILE)) {
        return this.parseWhileStatement();
      }

      if (this.match(TokenType.FOR) || this.match(TokenType.LOOP)) {
        return this.parseLoopStatement();
      }

      // Block statements
      if (this.match(TokenType.START)) {
        return this.parseBlockStatement();
      }

      // Return statements
      if (this.match(TokenType.RETURN)) {
        return this.parseReturnStatement();
      }

      // Print statements
      if (this.match(TokenType.PRINT)) {
        return this.parsePrintStatement();
      }

      // Expression statements (assignments, function calls, etc.)
      return this.parseExpressionStatement();

    } catch (error) {
      this.addError(
        `Statement parse error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        this.getCurrentLocation(),
        'error'
      );
      return null;
    }
  }

  /**
   * Parse variable declaration
   */
  private parseVariableDeclaration(): ASTNode {
    const startLocation = this.getCurrentLocation();
    let typeToken: Token | null = null;

    // Check if we have a type keyword
    if (this.previous().type !== TokenType.LET) {
      typeToken = this.previous();
    }

    // Expect identifier
    if (!this.check(TokenType.IDENTIFIER)) {
      throw new Error('Expected variable name');
    }

    const nameToken = this.advance();
    let initializer: ASTNode | null = null;

    // Optional initializer
    if (this.match(TokenType.ASSIGN)) {
      initializer = this.parseExpression();
    }

    // Optional semicolon
    this.match(TokenType.SEMICOLON);

    return {
      type: 'VariableDeclaration',
      location: startLocation,
      value: nameToken.value,
      metadata: {
        dataType: typeToken?.value || 'auto',
        hasInitializer: initializer !== null
      },
      children: initializer ? [initializer] : []
    };
  }

  /**
   * Parse function declaration
   */
  private parseFunctionDeclaration(): ASTNode {
    const startLocation = this.getCurrentLocation();

    // Expect function name
    if (!this.check(TokenType.IDENTIFIER)) {
      throw new Error('Expected function name');
    }

    const nameToken = this.advance();
    const parameters: ASTNode[] = [];

    // Parse parameters
    if (this.match(TokenType.LPAREN)) {
      if (!this.check(TokenType.RPAREN)) {
        do {
          if (!this.check(TokenType.IDENTIFIER)) {
            throw new Error('Expected parameter name');
          }
          
          const paramToken = this.advance();
          parameters.push({
            type: 'Parameter',
            location: this.getTokenLocation(paramToken),
            value: paramToken.value
          });
        } while (this.match(TokenType.COMMA));
      }

      if (!this.match(TokenType.RPAREN)) {
        throw new Error('Expected ")" after parameters');
      }
    }

    // Expect colon
    if (!this.match(TokenType.COLON)) {
      throw new Error('Expected ":" after function signature');
    }

    // Parse function body
    const body = this.parseBlockStatement();

    return {
      type: 'FunctionDeclaration',
      location: startLocation,
      value: nameToken.value,
      metadata: {
        parameterCount: parameters.length
      },
      children: [...parameters, body]
    };
  }

  /**
   * Parse class declaration
   */
  private parseClassDeclaration(): ASTNode {
    const startLocation = this.getCurrentLocation();

    // Expect class name
    if (!this.check(TokenType.IDENTIFIER)) {
      throw new Error('Expected class name');
    }

    const nameToken = this.advance();
    let superclass: ASTNode | null = null;

    // Optional inheritance
    if (this.check(TokenType.IDENTIFIER) && this.peek().value.toLowerCase() === 'extends') {
      this.advance(); // consume 'extends'
      
      if (!this.check(TokenType.IDENTIFIER)) {
        throw new Error('Expected superclass name');
      }
      
      const superToken = this.advance();
      superclass = {
        type: 'Identifier',
        location: this.getTokenLocation(superToken),
        value: superToken.value
      };
    }

    // Expect colon
    if (!this.match(TokenType.COLON)) {
      throw new Error('Expected ":" after class declaration');
    }

    // Parse class body
    const body = this.parseBlockStatement();

    return {
      type: 'ClassDeclaration',
      location: startLocation,
      value: nameToken.value,
      children: superclass ? [superclass, body] : [body]
    };
  }

  /**
   * Parse if statement
   */
  private parseIfStatement(): ASTNode {
    const startLocation = this.getCurrentLocation();

    // Parse condition
    const condition = this.parseExpression();

    // Expect colon
    if (!this.match(TokenType.COLON)) {
      throw new Error('Expected ":" after if condition');
    }

    // Parse then branch
    const thenBranch = this.parseBlockStatement();
    let elseBranch: ASTNode | null = null;

    // Optional else branch
    if (this.match(TokenType.ELSE)) {
      if (this.match(TokenType.COLON)) {
        elseBranch = this.parseBlockStatement();
      } else {
        throw new Error('Expected ":" after else');
      }
    }

    return {
      type: 'IfStatement',
      location: startLocation,
      children: elseBranch ? [condition, thenBranch, elseBranch] : [condition, thenBranch]
    };
  }

  /**
   * Parse while statement
   */
  private parseWhileStatement(): ASTNode {
    const startLocation = this.getCurrentLocation();

    // Parse condition
    const condition = this.parseExpression();

    // Expect colon
    if (!this.match(TokenType.COLON)) {
      throw new Error('Expected ":" after while condition');
    }

    // Parse body
    const body = this.parseBlockStatement();

    return {
      type: 'WhileStatement',
      location: startLocation,
      children: [condition, body]
    };
  }

  /**
   * Parse loop statement (for/loop)
   */
  private parseLoopStatement(): ASTNode {
    const startLocation = this.getCurrentLocation();
    const loopType = this.previous().value.toLowerCase();

    if (loopType === 'for') {
      return this.parseForLoop(startLocation);
    } else {
      return this.parseSimpleLoop(startLocation);
    }
  }

  /**
   * Parse for loop
   */
  private parseForLoop(startLocation: SourceLocation): ASTNode {
    // Parse loop variable
    if (!this.check(TokenType.IDENTIFIER)) {
      throw new Error('Expected loop variable');
    }

    const variable = this.advance();

    // Expect '='
    if (!this.match(TokenType.ASSIGN)) {
      throw new Error('Expected "=" in for loop');
    }

    // Parse start value
    const startValue = this.parseExpression();

    // Check for different loop patterns
    let endValue: ASTNode | null = null;
    let step: ASTNode | null = null;

    if (this.check(TokenType.IDENTIFIER) && this.peek().value.toLowerCase() === 'to') {
      this.advance(); // consume 'to'
      endValue = this.parseExpression();
    } else if (this.check(TokenType.IDENTIFIER) && this.peek().value.toLowerCase() === 'for') {
      this.advance(); // consume 'for'
      endValue = this.parseExpression();
      
      if (this.check(TokenType.IDENTIFIER) && this.peek().value.toLowerCase() === 'times') {
        this.advance(); // consume 'times'
      }
    }

    // Expect colon
    if (!this.match(TokenType.COLON)) {
      throw new Error('Expected ":" after for loop header');
    }

    // Parse body
    const body = this.parseBlockStatement();

    return {
      type: 'ForStatement',
      location: startLocation,
      metadata: {
        variable: variable.value,
        loopType: endValue ? 'range' : 'times'
      },
      children: [startValue, ...(endValue ? [endValue] : []), body]
    };
  }

  /**
   * Parse simple loop
   */
  private parseSimpleLoop(startLocation: SourceLocation): ASTNode {
    // Parse loop count or condition
    const condition = this.parseExpression();

    // Expect colon
    if (!this.match(TokenType.COLON)) {
      throw new Error('Expected ":" after loop condition');
    }

    // Parse body
    const body = this.parseBlockStatement();

    return {
      type: 'LoopStatement',
      location: startLocation,
      children: [condition, body]
    };
  }

  /**
   * Parse block statement
   */
  private parseBlockStatement(): ASTNode {
    const startLocation = this.getCurrentLocation();
    const statements: ASTNode[] = [];

    // Skip newlines after START:
    this.skipNewlines();

    // Parse statements until END:
    while (!this.check(TokenType.END) && !this.isAtEnd()) {
      const stmt = this.parseStatement();
      if (stmt) {
        statements.push(stmt);
      }
    }

    // Expect END:
    if (!this.match(TokenType.END)) {
      throw new Error('Expected "END:" to close block');
    }

    // Expect colon after END
    if (!this.match(TokenType.COLON)) {
      throw new Error('Expected ":" after END');
    }

    return {
      type: 'BlockStatement',
      location: startLocation,
      children: statements
    };
  }

  /**
   * Parse return statement
   */
  private parseReturnStatement(): ASTNode {
    const startLocation = this.getCurrentLocation();
    let value: ASTNode | null = null;

    // Optional return value
    if (!this.checkNewlineOrEnd()) {
      value = this.parseExpression();
    }

    return {
      type: 'ReturnStatement',
      location: startLocation,
      children: value ? [value] : []
    };
  }

  /**
   * Parse print statement
   */
  private parsePrintStatement(): ASTNode {
    const startLocation = this.getCurrentLocation();

    // Parse expression to print
    const expression = this.parseExpression();

    return {
      type: 'PrintStatement',
      location: startLocation,
      children: [expression]
    };
  }

  /**
   * Parse expression statement
   */
  private parseExpressionStatement(): ASTNode {
    const startLocation = this.getCurrentLocation();
    const expression = this.parseExpression();

    return {
      type: 'ExpressionStatement',
      location: startLocation,
      children: [expression]
    };
  }

  /**
   * Parse expression
   */
  private parseExpression(): ASTNode {
    return this.parseAssignment();
  }

  /**
   * Parse assignment expression
   */
  private parseAssignment(): ASTNode {
    const expr = this.parseLogicalOr();

    if (this.match(TokenType.ASSIGN)) {
      const operator = this.previous();
      const value = this.parseAssignment();

      if (expr.type !== 'Identifier') {
        throw new Error('Invalid assignment target');
      }

      return {
        type: 'AssignmentExpression',
        location: expr.location,
        metadata: { operator: operator.value },
        children: [expr, value]
      };
    }

    return expr;
  }

  /**
   * Parse logical OR expression
   */
  private parseLogicalOr(): ASTNode {
    let expr = this.parseLogicalAnd();

    while (this.check(TokenType.IDENTIFIER) && this.peek().value.toLowerCase() === 'or') {
      const operator = this.advance();
      const right = this.parseLogicalAnd();
      
      expr = {
        type: 'BinaryExpression',
        location: expr.location,
        metadata: { operator: operator.value },
        children: [expr, right]
      };
    }

    return expr;
  }

  /**
   * Parse logical AND expression
   */
  private parseLogicalAnd(): ASTNode {
    let expr = this.parseEquality();

    while (this.check(TokenType.IDENTIFIER) && this.peek().value.toLowerCase() === 'and') {
      const operator = this.advance();
      const right = this.parseEquality();
      
      expr = {
        type: 'BinaryExpression',
        location: expr.location,
        metadata: { operator: operator.value },
        children: [expr, right]
      };
    }

    return expr;
  }

  /**
   * Parse equality expression
   */
  private parseEquality(): ASTNode {
    let expr = this.parseComparison();

    while (this.match(TokenType.EQUALS, TokenType.NOT_EQUALS)) {
      const operator = this.previous();
      const right = this.parseComparison();
      
      expr = {
        type: 'BinaryExpression',
        location: expr.location,
        metadata: { operator: operator.value },
        children: [expr, right]
      };
    }

    return expr;
  }

  /**
   * Parse comparison expression
   */
  private parseComparison(): ASTNode {
    let expr = this.parseTerm();

    while (this.match(TokenType.GREATER_THAN, TokenType.LESS_THAN)) {
      const operator = this.previous();
      const right = this.parseTerm();
      
      expr = {
        type: 'BinaryExpression',
        location: expr.location,
        metadata: { operator: operator.value },
        children: [expr, right]
      };
    }

    return expr;
  }

  /**
   * Parse term expression (+ -)
   */
  private parseTerm(): ASTNode {
    let expr = this.parseFactor();

    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const operator = this.previous();
      const right = this.parseFactor();
      
      expr = {
        type: 'BinaryExpression',
        location: expr.location,
        metadata: { operator: operator.value },
        children: [expr, right]
      };
    }

    return expr;
  }

  /**
   * Parse factor expression (* /)
   */
  private parseFactor(): ASTNode {
    let expr = this.parseUnary();

    while (this.match(TokenType.MULTIPLY, TokenType.DIVIDE)) {
      const operator = this.previous();
      const right = this.parseUnary();
      
      expr = {
        type: 'BinaryExpression',
        location: expr.location,
        metadata: { operator: operator.value },
        children: [expr, right]
      };
    }

    return expr;
  }

  /**
   * Parse unary expression
   */
  private parseUnary(): ASTNode {
    if (this.match(TokenType.MINUS) || 
        (this.check(TokenType.IDENTIFIER) && this.peek().value.toLowerCase() === 'not')) {
      const operator = this.previous();
      const right = this.parseUnary();
      
      return {
        type: 'UnaryExpression',
        location: this.getTokenLocation(operator),
        metadata: { operator: operator.value },
        children: [right]
      };
    }

    return this.parseCall();
  }

  /**
   * Parse function call
   */
  private parseCall(): ASTNode {
    let expr = this.parsePrimary();

    while (true) {
      if (this.match(TokenType.LPAREN)) {
        expr = this.finishCall(expr);
      } else {
        break;
      }
    }

    return expr;
  }

  /**
   * Finish parsing function call
   */
  private finishCall(callee: ASTNode): ASTNode {
    const args: ASTNode[] = [];

    if (!this.check(TokenType.RPAREN)) {
      do {
        args.push(this.parseExpression());
      } while (this.match(TokenType.COMMA));
    }

    if (!this.match(TokenType.RPAREN)) {
      throw new Error('Expected ")" after arguments');
    }

    return {
      type: 'CallExpression',
      location: callee.location,
      metadata: { argumentCount: args.length },
      children: [callee, ...args]
    };
  }

  /**
   * Parse primary expression
   */
  private parsePrimary(): ASTNode {
    // Literals
    if (this.match(TokenType.TRUE)) {
      return {
        type: 'Literal',
        location: this.getTokenLocation(this.previous()),
        value: true,
        metadata: { dataType: 'boolean' }
      };
    }

    if (this.match(TokenType.FALSE)) {
      return {
        type: 'Literal',
        location: this.getTokenLocation(this.previous()),
        value: false,
        metadata: { dataType: 'boolean' }
      };
    }

    if (this.match(TokenType.NULL)) {
      return {
        type: 'Literal',
        location: this.getTokenLocation(this.previous()),
        value: null,
        metadata: { dataType: 'null' }
      };
    }

    if (this.match(TokenType.NUMBER)) {
      const token = this.previous();
      return {
        type: 'Literal',
        location: this.getTokenLocation(token),
        value: parseFloat(token.value),
        metadata: { dataType: 'number' }
      };
    }

    if (this.match(TokenType.STRING)) {
      const token = this.previous();
      return {
        type: 'Literal',
        location: this.getTokenLocation(token),
        value: token.value,
        metadata: { dataType: 'string' }
      };
    }

    if (this.match(TokenType.IDENTIFIER)) {
      const token = this.previous();
      return {
        type: 'Identifier',
        location: this.getTokenLocation(token),
        value: token.value
      };
    }

    // Parenthesized expression
    if (this.match(TokenType.LPAREN)) {
      const expr = this.parseExpression();
      
      if (!this.match(TokenType.RPAREN)) {
        throw new Error('Expected ")" after expression');
      }
      
      return expr;
    }

    throw new Error(`Unexpected token: ${this.peek().value}`);
  }

  /**
   * Utility methods
   */
  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private matchKeywordTypes(): boolean {
    if (!this.check(TokenType.IDENTIFIER)) return false;
    
    const value = this.peek().value.toLowerCase();
    const typeKeywords = ['int', 'float', 'string', 'bool'];
    
    if (typeKeywords.includes(value)) {
      this.advance();
      return true;
    }
    
    return false;
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.current >= this.tokens.length || this.peek().type === TokenType.EOF;
  }

  private peek(): Token {
    if (this.current >= this.tokens.length) {
      return { type: TokenType.EOF, value: '', line: 0, column: 0, startOffset: 0, endOffset: 0 };
    }
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private skipNewlines(): void {
    while (this.match(TokenType.NEWLINE)) {
      // Skip newlines
    }
  }

  private checkNewlineOrEnd(): boolean {
    return this.check(TokenType.NEWLINE) || this.isAtEnd();
  }

  private synchronize(): void {
    this.advance();

    while (!this.isAtEnd()) {
      if (this.previous().type === TokenType.NEWLINE) return;

      switch (this.peek().type) {
        case TokenType.FUNC:
        case TokenType.LET:
        case TokenType.IF:
        case TokenType.WHILE:
        case TokenType.FOR:
        case TokenType.LOOP:
        case TokenType.RETURN:
        case TokenType.PRINT:
          return;
      }

      this.advance();
    }
  }

  private getCurrentLocation(): SourceLocation {
    const token = this.peek();
    return {
      line: token.line,
      column: token.column,
      offset: token.startOffset
    };
  }

  private getTokenLocation(token: Token): SourceLocation {
    return {
      line: token.line,
      column: token.column,
      offset: token.startOffset
    };
  }

  private addError(message: string, location: SourceLocation, severity: 'error' | 'warning' | 'info' = 'error'): void {
    const error: ParseError = {
      message,
      location,
      severity,
      suggestions: this.generateSuggestions(message)
    };

    if (severity === 'error') {
      this.errors.push(error);
    } else {
      this.warnings.push(error);
    }
  }

  private generateSuggestions(message: string): string[] {
    const suggestions: string[] = [];

    if (message.includes('Expected')) {
      if (message.includes('"START:"')) {
        suggestions.push('Add "START:" to begin a block');
        suggestions.push('Check if you have proper block structure');
      }
      if (message.includes('"END:"')) {
        suggestions.push('Add "END:" to close the block');
        suggestions.push('Make sure all blocks are properly closed');
      }
      if (message.includes('":"')) {
        suggestions.push('Add ":" after the statement');
        suggestions.push('Check SUSA syntax for proper colon usage');
      }
    }

    if (message.includes('Unexpected token')) {
      suggestions.push('Check for typos in keywords');
      suggestions.push('Ensure proper SUSA syntax');
      suggestions.push('Remove or fix the unexpected token');
    }

    return suggestions;
  }
}

/**
 * Parse SUSA source code
 */
export function parseSUSACode(sourceCode: string): ParseResult {
  const lexer = new SUSALexer();
  const { tokens, errors: lexerErrors } = lexer.tokenize(sourceCode);
  
  const parser = new SUSAParser(tokens);
  const result = parser.parse();
  
  // Combine lexer and parser errors
  const allErrors = [
    ...lexerErrors.map(err => ({
      message: err.message,
      location: { line: err.line, column: err.column, offset: err.offset },
      severity: 'error' as const
    })),
    ...result.errors
  ];
  
  return {
    ...result,
    errors: allErrors
  };
}