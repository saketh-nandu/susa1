// SUSA Language Validator - Static code analysis

import { tokenize, Token } from './tokenizer';

export interface ValidationError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export function validate(source: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const tokens = tokenize(source);
  
  // Track block nesting
  const blockStack: { keyword: string; line: number }[] = [];
  
  // Track declared variables
  const declaredVariables = new Set<string>();
  const usedVariables = new Set<string>();
  
  // Check for START
  const startTokens = tokens.filter(t => t.type === 'KEYWORD' && t.value === 'START');
  if (startTokens.length === 0) {
    errors.push({
      line: 1,
      column: 1,
      message: "Program must begin with 'START' keyword",
      severity: 'error',
    });
  } else if (startTokens.length > 1) {
    errors.push({
      line: startTokens[1].line,
      column: startTokens[1].column,
      message: "Multiple 'START' keywords found",
      severity: 'error',
    });
  }

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const prevToken = tokens[i - 1];
    const nextToken = tokens[i + 1];

    // Track block keywords
    if (token.type === 'KEYWORD') {
      switch (token.value) {
        case 'START':
        case 'IF':
        case 'WHILE':
        case 'LOOP':
          blockStack.push({ keyword: token.value, line: token.line });
          break;
        case 'END':
          if (blockStack.length === 0) {
            errors.push({
              line: token.line,
              column: token.column,
              message: "Unexpected 'END' - no matching block",
              severity: 'error',
            });
          } else {
            blockStack.pop();
          }
          break;
      }
    }

    // Track variable declarations
    if (token.type === 'KEYWORD' && token.value === 'USE' && nextToken?.type === 'IDENTIFIER') {
      declaredVariables.add(nextToken.value);
    }

    // Track variable usage
    if (token.type === 'IDENTIFIER') {
      usedVariables.add(token.value);
      
      // Check if variable is used before declaration
      if (!declaredVariables.has(token.value)) {
        const isDeclaration = prevToken?.type === 'KEYWORD' && prevToken.value === 'USE';
        const isLoopVar = prevToken?.type === 'KEYWORD' && prevToken.value === 'LOOP';
        
        if (!isDeclaration && !isLoopVar) {
          // Check if it's a future declaration (lookahead)
          let isDeclaredLater = false;
          for (let j = i + 1; j < tokens.length; j++) {
            if (tokens[j].value === 'USE' && tokens[j + 1]?.value === token.value) {
              isDeclaredLater = true;
              break;
            }
          }
          
          if (!isDeclaredLater) {
            errors.push({
              line: token.line,
              column: token.column,
              message: `Variable '${token.value}' is used but never declared`,
              severity: 'warning',
            });
          }
        }
      }
    }

    // Check for unclosed strings
    if (token.type === 'STRING') {
      const quote = token.value[0];
      if (!token.value.endsWith(quote) || token.value.length < 2) {
        errors.push({
          line: token.line,
          column: token.column,
          message: 'Unclosed string literal',
          severity: 'error',
        });
      }
    }

    // Check for unknown tokens
    if (token.type === 'UNKNOWN') {
      errors.push({
        line: token.line,
        column: token.column,
        message: `Unexpected character: '${token.value}'`,
        severity: 'error',
      });
    }

    // Check for empty PRINT statements
    if (token.type === 'KEYWORD' && token.value === 'PRINT') {
      if (!nextToken || nextToken.type === 'KEYWORD' || nextToken.type === 'NEWLINE') {
        errors.push({
          line: token.line,
          column: token.column,
          message: 'PRINT statement requires an expression',
          severity: 'error',
        });
      }
    }

    // Check for incomplete variable declarations
    if (token.type === 'KEYWORD' && token.value === 'USE') {
      if (!nextToken || nextToken.type !== 'IDENTIFIER') {
        errors.push({
          line: token.line,
          column: token.column,
          message: 'USE must be followed by a variable name',
          severity: 'error',
        });
      } else {
        const equalsToken = tokens[i + 2];
        if (!equalsToken || equalsToken.value !== '=') {
          errors.push({
            line: token.line,
            column: token.column,
            message: "Variable declaration requires '=' and an initial value",
            severity: 'error',
          });
        }
      }
    }

    // Check for LOOP syntax
    if (token.type === 'KEYWORD' && token.value === 'LOOP') {
      const varToken = tokens[i + 1];
      const fromToken = tokens[i + 2];
      
      if (!varToken || varToken.type !== 'IDENTIFIER') {
        errors.push({
          line: token.line,
          column: token.column,
          message: 'LOOP requires a variable name',
          severity: 'error',
        });
      } else if (!fromToken || fromToken.value !== 'FROM') {
        errors.push({
          line: token.line,
          column: token.column,
          message: "LOOP requires 'FROM' keyword",
          severity: 'error',
        });
      }
    }
  }

  // Check for unclosed blocks
  for (const block of blockStack) {
    errors.push({
      line: block.line,
      column: 1,
      message: `Unclosed '${block.keyword}' block - missing 'END'`,
      severity: 'error',
    });
  }

  // Sort errors by line number
  errors.sort((a, b) => a.line - b.line);

  return errors;
}

export function getErrorMarkers(source: string): { 
  line: number; 
  column: number; 
  endColumn: number; 
  message: string; 
  severity: number 
}[] {
  const errors = validate(source);
  
  return errors.map(e => ({
    line: e.line,
    column: e.column,
    endColumn: e.column + 10,
    message: e.message,
    severity: e.severity === 'error' ? 8 : e.severity === 'warning' ? 4 : 2,
  }));
}
