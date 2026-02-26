// SUSA Language Tokenizer

export type TokenType =
  | 'KEYWORD'
  | 'IDENTIFIER'
  | 'NUMBER'
  | 'STRING'
  | 'RT_STRING'
  | 'OPERATOR'
  | 'PUNCTUATION'
  | 'COMMENT'
  | 'BOOLEAN'
  | 'NULL'
  | 'WHITESPACE'
  | 'NEWLINE'
  | 'UNKNOWN';

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
  start: number;
  end: number;
}

const KEYWORDS = new Set([
  'START', 'END', 'IF', 'ELSE', 'LOOP', 'WHILE', 'BREAK', 'CONTINUE',
  'USE', 'PRINT', 'RETURN', 'FUNCTION', 'FROM', 'TO', 'AND', 'OR', 'NOT'
]);

const BOOLEANS = new Set(['TRUE', 'FALSE']);
const NULL_LITERAL = 'NULL';

const OPERATORS = new Set([
  '+', '-', '*', '/', '%', '=', '==', '!=', '<', '>', '<=', '>=',
  '&&', '||', '!', '+=', '-=', '*=', '/='
]);

const PUNCTUATION = new Set(['(', ')', '{', '}', '[', ']', ',', ';', ':']);

export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let pos = 0;
  let line = 1;
  let column = 1;

  const advance = (count = 1) => {
    for (let i = 0; i < count; i++) {
      if (source[pos] === '\n') {
        line++;
        column = 1;
      } else {
        column++;
      }
      pos++;
    }
  };

  const peek = (offset = 0) => source[pos + offset];
  const isEOF = () => pos >= source.length;
  const isAlpha = (ch: string) => /[a-zA-Z_]/.test(ch);
  const isDigit = (ch: string) => /[0-9]/.test(ch);
  const isAlphaNumeric = (ch: string) => isAlpha(ch) || isDigit(ch);

  while (!isEOF()) {
    const startPos = pos;
    const startLine = line;
    const startColumn = column;
    const ch = peek();

    // Skip whitespace
    if (/[ \t]/.test(ch)) {
      while (!isEOF() && /[ \t]/.test(peek())) {
        advance();
      }
      continue;
    }

    // Newlines
    if (ch === '\n') {
      tokens.push({
        type: 'NEWLINE',
        value: '\n',
        line: startLine,
        column: startColumn,
        start: startPos,
        end: pos + 1,
      });
      advance();
      continue;
    }

    // Comments
    if (ch === '/' && peek(1) === '/') {
      let comment = '';
      while (!isEOF() && peek() !== '\n') {
        comment += peek();
        advance();
      }
      tokens.push({
        type: 'COMMENT',
        value: comment,
        line: startLine,
        column: startColumn,
        start: startPos,
        end: pos,
      });
      continue;
    }

    // Multi-line comments
    if (ch === '/' && peek(1) === '*') {
      let comment = '/*';
      advance(2);
      while (!isEOF() && !(peek() === '*' && peek(1) === '/')) {
        comment += peek();
        advance();
      }
      if (!isEOF()) {
        comment += '*/';
        advance(2);
      }
      tokens.push({
        type: 'COMMENT',
        value: comment,
        line: startLine,
        column: startColumn,
        start: startPos,
        end: pos,
      });
      continue;
    }

    // Strings (check for rt-strings first)
    if (ch === 'r' && peek(1) === 't' && (peek(2) === '"' || peek(2) === "'")) {
      const quote = peek(2);
      let str = 'rt' + quote;
      advance(3);
      while (!isEOF() && peek() !== quote) {
        if (peek() === '\\' && peek(1)) {
          str += peek() + peek(1);
          advance(2);
        } else {
          str += peek();
          advance();
        }
      }
      if (peek() === quote) {
        str += quote;
        advance();
      }
      tokens.push({
        type: 'RT_STRING',
        value: str,
        line: startLine,
        column: startColumn,
        start: startPos,
        end: pos,
      });
      continue;
    }

    // Regular strings
    if (ch === '"' || ch === "'") {
      const quote = ch;
      let str = quote;
      advance();
      while (!isEOF() && peek() !== quote && peek() !== '\n') {
        if (peek() === '\\' && peek(1)) {
          str += peek() + peek(1);
          advance(2);
        } else {
          str += peek();
          advance();
        }
      }
      if (peek() === quote) {
        str += quote;
        advance();
      }
      tokens.push({
        type: 'STRING',
        value: str,
        line: startLine,
        column: startColumn,
        start: startPos,
        end: pos,
      });
      continue;
    }

    // Numbers
    if (isDigit(ch) || (ch === '.' && isDigit(peek(1)))) {
      let num = '';
      while (!isEOF() && (isDigit(peek()) || peek() === '.')) {
        num += peek();
        advance();
      }
      tokens.push({
        type: 'NUMBER',
        value: num,
        line: startLine,
        column: startColumn,
        start: startPos,
        end: pos,
      });
      continue;
    }

    // Identifiers and keywords
    if (isAlpha(ch)) {
      let ident = '';
      while (!isEOF() && isAlphaNumeric(peek())) {
        ident += peek();
        advance();
      }

      let type: TokenType = 'IDENTIFIER';
      if (KEYWORDS.has(ident)) {
        type = 'KEYWORD';
      } else if (BOOLEANS.has(ident)) {
        type = 'BOOLEAN';
      } else if (ident === NULL_LITERAL) {
        type = 'NULL';
      }

      tokens.push({
        type,
        value: ident,
        line: startLine,
        column: startColumn,
        start: startPos,
        end: pos,
      });
      continue;
    }

    // Operators (check multi-char first)
    const twoChar = ch + (peek(1) || '');
    if (OPERATORS.has(twoChar)) {
      tokens.push({
        type: 'OPERATOR',
        value: twoChar,
        line: startLine,
        column: startColumn,
        start: startPos,
        end: pos + 2,
      });
      advance(2);
      continue;
    }

    if (OPERATORS.has(ch)) {
      tokens.push({
        type: 'OPERATOR',
        value: ch,
        line: startLine,
        column: startColumn,
        start: startPos,
        end: pos + 1,
      });
      advance();
      continue;
    }

    // Punctuation
    if (PUNCTUATION.has(ch)) {
      tokens.push({
        type: 'PUNCTUATION',
        value: ch,
        line: startLine,
        column: startColumn,
        start: startPos,
        end: pos + 1,
      });
      advance();
      continue;
    }

    // Unknown character
    tokens.push({
      type: 'UNKNOWN',
      value: ch,
      line: startLine,
      column: startColumn,
      start: startPos,
      end: pos + 1,
    });
    advance();
  }

  return tokens;
}

export function getKeywords(): string[] {
  return Array.from(KEYWORDS);
}

export function getBooleans(): string[] {
  return Array.from(BOOLEANS);
}
