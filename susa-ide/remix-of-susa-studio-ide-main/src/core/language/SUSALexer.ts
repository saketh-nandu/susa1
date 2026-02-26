/**
 * Production SUSA Lexer with Comment Handling and Case-Insensitive Keywords
 * Handles all SUSA language tokenization requirements
 */

export enum TokenType {
  // Keywords (normalized to uppercase)
  START = 'START',
  END = 'END',
  IF = 'IF',
  ELSE = 'ELSE',
  LOOP = 'LOOP',
  WHILE = 'WHILE',
  FOR = 'FOR',
  FUNC = 'FUNC',
  RETURN = 'RETURN',
  LET = 'LET',
  PRINT = 'PRINT',
  TRUE = 'TRUE',
  FALSE = 'FALSE',
  NULL = 'NULL',
  
  // Operators
  ASSIGN = 'ASSIGN',
  PLUS = 'PLUS',
  MINUS = 'MINUS',
  MULTIPLY = 'MULTIPLY',
  DIVIDE = 'DIVIDE',
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  LESS_THAN = 'LESS_THAN',
  GREATER_THAN = 'GREATER_THAN',
  
  // Literals
  IDENTIFIER = 'IDENTIFIER',
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  
  // Punctuation
  COLON = 'COLON',
  SEMICOLON = 'SEMICOLON',
  COMMA = 'COMMA',
  LPAREN = 'LPAREN',
  RPAREN = 'RPAREN',
  LBRACE = 'LBRACE',
  RBRACE = 'RBRACE',
  
  // Special
  NEWLINE = 'NEWLINE',
  EOF = 'EOF',
  COMMENT = 'COMMENT',
  WHITESPACE = 'WHITESPACE'
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
  startOffset: number;
  endOffset: number;
}

export interface LexerError {
  message: string;
  line: number;
  column: number;
  offset: number;
}

export class SUSALexer {
  private input: string = '';
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;
  private tokens: Token[] = [];
  private errors: LexerError[] = [];

  // Case-insensitive keyword mapping
  private static readonly KEYWORDS: Map<string, TokenType> = new Map([
    ['start', TokenType.START],
    ['end', TokenType.END],
    ['if', TokenType.IF],
    ['else', TokenType.ELSE],
    ['loop', TokenType.LOOP],
    ['while', TokenType.WHILE],
    ['for', TokenType.FOR],
    ['func', TokenType.FUNC],
    ['function', TokenType.FUNC], // Alternative
    ['return', TokenType.RETURN],
    ['let', TokenType.LET],
    ['var', TokenType.LET], // Alternative
    ['print', TokenType.PRINT],
    ['true', TokenType.TRUE],
    ['false', TokenType.FALSE],
    ['null', TokenType.NULL],
    ['nil', TokenType.NULL] // Alternative
  ]);

  /**
   * Tokenize SUSA source code with comment preprocessing
   */
  tokenize(source: string): { tokens: Token[], errors: LexerError[] } {
    this.input = this.preprocessComments(source);
    this.position = 0;
    this.line = 1;
    this.column = 1;
    this.tokens = [];
    this.errors = [];

    while (!this.isAtEnd()) {
      this.scanToken();
    }

    // Add EOF token
    this.addToken(TokenType.EOF, '');

    return {
      tokens: this.tokens.filter(t => t.type !== TokenType.WHITESPACE),
      errors: this.errors
    };
  }

  /**
   * Preprocess comments and normalize line endings
   */
  private preprocessComments(source: string): string {
    const lines = source.split(/\r?\n/);
    const processedLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      
      // Handle comments
      const commentIndex = line.indexOf('#');
      if (commentIndex !== -1) {
        // Check if # is inside a string
        if (!this.isInsideString(line, commentIndex)) {
          // Replace comment with whitespace to preserve positions
          const beforeComment = line.substring(0, commentIndex);
          const commentPart = line.substring(commentIndex);
          line = beforeComment + ' '.repeat(commentPart.length);
        }
      }
      
      processedLines.push(line);
    }

    return processedLines.join('\n');
  }

  /**
   * Check if position is inside a string literal
   */
  private isInsideString(line: string, position: number): boolean {
    let inString = false;
    let stringChar = '';
    
    for (let i = 0; i < position; i++) {
      const char = line[i];
      if ((char === '"' || char === "'") && (i === 0 || line[i-1] !== '\\')) {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
          stringChar = '';
        }
      }
    }
    
    return inString;
  }

  /**
   * Scan next token
   */
  private scanToken(): void {
    const startPosition = this.position;
    const startLine = this.line;
    const startColumn = this.column;
    
    const char = this.advance();

    switch (char) {
      case ' ':
      case '\r':
      case '\t':
        this.addToken(TokenType.WHITESPACE, char);
        break;
      case '\n':
        this.addToken(TokenType.NEWLINE, char);
        this.line++;
        this.column = 1;
        break;
      case ':':
        this.addToken(TokenType.COLON, char);
        break;
      case ';':
        this.addToken(TokenType.SEMICOLON, char);
        break;
      case ',':
        this.addToken(TokenType.COMMA, char);
        break;
      case '(':
        this.addToken(TokenType.LPAREN, char);
        break;
      case ')':
        this.addToken(TokenType.RPAREN, char);
        break;
      case '{':
        this.addToken(TokenType.LBRACE, char);
        break;
      case '}':
        this.addToken(TokenType.RBRACE, char);
        break;
      case '+':
        this.addToken(TokenType.PLUS, char);
        break;
      case '-':
        this.addToken(TokenType.MINUS, char);
        break;
      case '*':
        this.addToken(TokenType.MULTIPLY, char);
        break;
      case '/':
        this.addToken(TokenType.DIVIDE, char);
        break;
      case '=':
        if (this.match('=')) {
          this.addToken(TokenType.EQUALS, '==');
        } else {
          this.addToken(TokenType.ASSIGN, '=');
        }
        break;
      case '!':
        if (this.match('=')) {
          this.addToken(TokenType.NOT_EQUALS, '!=');
        } else {
          this.addError('Unexpected character: !');
        }
        break;
      case '<':
        this.addToken(TokenType.LESS_THAN, char);
        break;
      case '>':
        this.addToken(TokenType.GREATER_THAN, char);
        break;
      case '"':
      case "'":
        this.scanString(char);
        break;
      default:
        if (this.isDigit(char)) {
          this.scanNumber();
        } else if (this.isAlpha(char)) {
          this.scanIdentifier();
        } else {
          this.addError(`Unexpected character: ${char}`);
        }
        break;
    }
  }

  /**
   * Scan string literal
   */
  private scanString(quote: string): void {
    const startPosition = this.position - 1;
    let value = '';

    while (!this.isAtEnd() && this.peek() !== quote) {
      if (this.peek() === '\n') {
        this.line++;
        this.column = 1;
      }
      if (this.peek() === '\\') {
        this.advance(); // Skip escape character
        const escaped = this.advance();
        switch (escaped) {
          case 'n': value += '\n'; break;
          case 't': value += '\t'; break;
          case 'r': value += '\r'; break;
          case '\\': value += '\\'; break;
          case '"': value += '"'; break;
          case "'": value += "'"; break;
          default: value += escaped; break;
        }
      } else {
        value += this.advance();
      }
    }

    if (this.isAtEnd()) {
      this.addError('Unterminated string');
      return;
    }

    // Consume closing quote
    this.advance();
    this.addToken(TokenType.STRING, value);
  }

  /**
   * Scan number literal
   */
  private scanNumber(): void {
    while (this.isDigit(this.peek())) {
      this.advance();
    }

    // Look for decimal part
    if (this.peek() === '.' && this.isDigit(this.peekNext())) {
      this.advance(); // Consume '.'
      while (this.isDigit(this.peek())) {
        this.advance();
      }
    }

    const value = this.input.substring(this.tokens[this.tokens.length - 1]?.endOffset || 0, this.position);
    this.addToken(TokenType.NUMBER, value);
  }

  /**
   * Scan identifier or keyword
   */
  private scanIdentifier(): void {
    while (this.isAlphaNumeric(this.peek())) {
      this.advance();
    }

    const startPos = this.tokens.length > 0 ? this.tokens[this.tokens.length - 1].endOffset : 0;
    const value = this.input.substring(startPos, this.position);
    const lowerValue = value.toLowerCase();
    
    // Check if it's a keyword (case-insensitive)
    const tokenType = SUSALexer.KEYWORDS.get(lowerValue) || TokenType.IDENTIFIER;
    this.addToken(tokenType, value);
  }

  /**
   * Helper methods
   */
  private isAtEnd(): boolean {
    return this.position >= this.input.length;
  }

  private advance(): string {
    const char = this.input.charAt(this.position);
    this.position++;
    this.column++;
    return char;
  }

  private match(expected: string): boolean {
    if (this.isAtEnd() || this.input.charAt(this.position) !== expected) {
      return false;
    }
    this.position++;
    this.column++;
    return true;
  }

  private peek(): string {
    if (this.isAtEnd()) return '\0';
    return this.input.charAt(this.position);
  }

  private peekNext(): string {
    if (this.position + 1 >= this.input.length) return '\0';
    return this.input.charAt(this.position + 1);
  }

  private isDigit(char: string): boolean {
    return char >= '0' && char <= '9';
  }

  private isAlpha(char: string): boolean {
    return (char >= 'a' && char <= 'z') ||
           (char >= 'A' && char <= 'Z') ||
           char === '_';
  }

  private isAlphaNumeric(char: string): boolean {
    return this.isAlpha(char) || this.isDigit(char);
  }

  private addToken(type: TokenType, value: string): void {
    const startOffset = this.tokens.length > 0 ? this.tokens[this.tokens.length - 1].endOffset : 0;
    
    this.tokens.push({
      type,
      value,
      line: this.line,
      column: this.column - value.length,
      startOffset,
      endOffset: this.position
    });
  }

  private addError(message: string): void {
    this.errors.push({
      message,
      line: this.line,
      column: this.column,
      offset: this.position
    });
  }
}