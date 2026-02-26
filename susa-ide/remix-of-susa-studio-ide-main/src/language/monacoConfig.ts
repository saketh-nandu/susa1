// SUSA Monaco Editor Configuration

import * as monaco from 'monaco-editor';
import { Theme } from '@/store/settingsStore';

export const SUSA_LANGUAGE_ID = 'susa';

// SUSA Language Definition - Updated to match actual SUSA syntax
export const susaLanguageConfig: monaco.languages.LanguageConfiguration = {
  comments: {
    lineComment: '#',
    blockComment: ['/*', '*/'],
  },
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"', notIn: ['string'] },
    { open: "'", close: "'", notIn: ['string'] },
  ],
  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
  folding: {
    markers: {
      start: /^\s*(START|IF|LOOP|WHILE|FOR|FUNC|CLASS|TRY|SWITCH|USE)\b.*:$/,
      end: /^\s*END\s*:$/,
    },
  },
  indentationRules: {
    increaseIndentPattern: /^\s*(START|IF|ELSE|ELIF|LOOP|WHILE|FOR|FUNC|CLASS|TRY|CATCH|FINALLY|SWITCH|CASE|DEFAULT|USE)\s*:$/,
    decreaseIndentPattern: /^\s*(END|ELSE|ELIF|CATCH|FINALLY|CASE|DEFAULT)\s*:$/,
  },
};

// SUSA Token Provider - Updated with actual SUSA keywords
export const susaTokensProvider: monaco.languages.IMonarchLanguage = {
  defaultToken: 'invalid',
  
  keywords: [
    // Control flow
    'if', 'else', 'loop', 'for', 'while', 'times', 
    'start', 'end', 'break', 'continue',
    
    // Switch/Match statements
    'switch', 'match', 'case', 'default',
    
    // Error handling
    'try', 'catch', 'finally', 'throw',
    
    // Functions and classes
    'func', 'return', 'class', 'extends',
    
    // Variables and imports
    'let', 'add', 'remove', 'print', 'from', 'as', 'share',
    
    // Multi-language support
    'use', 'shared', 'unsafe',
    
    // Literals
    'true', 'false', 'null',
    
    // Logical operators
    'and', 'or', 'not', 'is', 'in'
  ],
  
  typeKeywords: [
    'int', 'float', 'string', 'bool'
  ],
  
  operators: [
    '=', '>', '<', '!', '~', '?', ':',
    '==', '<=', '>=', '!=', 'IS NOT', 'IS',
    '+', '-', '*', '/', '%',
    '+=', '-=', '*=', '/='
  ],
  
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  
  tokenizer: {
    root: [
      [/[a-zA-Z_]\w*/, {
        cases: {
          '@typeKeywords': 'type',
          '@keywords': 'keyword',
          'true|false': 'constant.language',
          'null': 'constant.language',
          '@default': 'identifier'
        }
      }],
      
      { include: '@whitespace' },
      
      [/[{}()\[\]]/, '@brackets'],
      [/[;,.]/, 'delimiter'],
      [/:/, 'delimiter.colon'],
      
      // Numbers
      [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
      [/\d+/, 'number'],
      
      // Runtime interpolated strings
      [/rt"/, 'string.interpolated', '@string_rt'],
      
      // Regular strings
      [/"([^"\\]|\\.)*$/, 'string.invalid'],
      [/'([^'\\]|\\.)*$/, 'string.invalid'],
      [/"/, 'string', '@string_double'],
      [/'/, 'string', '@string_single'],
      
      [/@symbols/, {
        cases: {
          '@operators': 'operator',
          '@default': ''
        }
      }],
    ],
    
    whitespace: [
      [/[ \t\r\n]+/, 'white'],
      [/\/\*/, 'comment', '@comment'],
      [/#.*$/, 'comment'],
    ],
    
    comment: [
      [/[^\/*]+/, 'comment'],
      [/\*\//, 'comment', '@pop'],
      [/[\/*]/, 'comment']
    ],
    
    string_double: [
      [/[^\\"]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, 'string', '@pop']
    ],
    
    string_single: [
      [/[^\\']+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/'/, 'string', '@pop']
    ],
    
    string_rt: [
      [/[^\\"{]+/, 'string.interpolated'],
      [/\{[^}]*\}/, 'string.interpolated.expression'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, 'string.interpolated', '@pop']
    ],
  },
};

// Theme definitions for each SUSA theme
export const susaThemes: Record<Theme, monaco.editor.IStandaloneThemeData> = {
  dark: {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '22d3ee', fontStyle: 'bold' },
      { token: 'constant', foreground: 'fab387', fontStyle: 'bold' },
      { token: 'identifier', foreground: 'cdd6f4' },
      { token: 'number', foreground: 'fab387' },
      { token: 'number.float', foreground: 'fab387' },
      { token: 'string', foreground: 'a6e3a1' },
      { token: 'string.escape', foreground: 'f5c2e7' },
      { token: 'comment', foreground: '6c7086', fontStyle: 'italic' },
      { token: 'operator', foreground: 'f38ba8' },
      { token: 'delimiter', foreground: '9399b2' },
      { token: 'brackets', foreground: 'cba6f7' },
    ],
    colors: {
      'editor.background': '#181825',
      'editor.foreground': '#cdd6f4',
      'editor.lineHighlightBackground': '#1e1e2e',
      'editor.selectionBackground': '#45475a',
      'editorCursor.foreground': '#22d3ee',
      'editorLineNumber.foreground': '#6c7086',
      'editorLineNumber.activeForeground': '#cdd6f4',
      'editorGutter.background': '#181825',
      'editorWidget.background': '#1e1e2e',
      'editorWidget.border': '#313244',
    },
  },
  light: {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '0891b2', fontStyle: 'bold' },
      { token: 'constant', foreground: 'd97706', fontStyle: 'bold' },
      { token: 'identifier', foreground: '1e293b' },
      { token: 'number', foreground: 'd97706' },
      { token: 'number.float', foreground: 'd97706' },
      { token: 'string', foreground: '16a34a' },
      { token: 'string.escape', foreground: 'db2777' },
      { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
      { token: 'operator', foreground: 'e11d48' },
      { token: 'delimiter', foreground: '475569' },
      { token: 'brackets', foreground: '7c3aed' },
    ],
    colors: {
      'editor.background': '#ffffff',
      'editor.foreground': '#1e293b',
      'editor.lineHighlightBackground': '#f1f5f9',
      'editor.selectionBackground': '#cbd5e1',
      'editorCursor.foreground': '#0891b2',
      'editorLineNumber.foreground': '#94a3b8',
      'editorLineNumber.activeForeground': '#1e293b',
      'editorGutter.background': '#f8fafc',
      'editorWidget.background': '#ffffff',
      'editorWidget.border': '#e2e8f0',
    },
  },
  'susa-midnight': {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: 'a78bfa', fontStyle: 'bold' },
      { token: 'constant', foreground: 'f472b6', fontStyle: 'bold' },
      { token: 'identifier', foreground: 'e2e8f0' },
      { token: 'number', foreground: 'f472b6' },
      { token: 'string', foreground: '34d399' },
      { token: 'comment', foreground: '6366f1', fontStyle: 'italic' },
      { token: 'operator', foreground: 'ec4899' },
      { token: 'brackets', foreground: 'c084fc' },
    ],
    colors: {
      'editor.background': '#1a1625',
      'editor.foreground': '#e2e8f0',
      'editor.lineHighlightBackground': '#231d30',
      'editor.selectionBackground': '#4c1d95',
      'editorCursor.foreground': '#a78bfa',
      'editorLineNumber.foreground': '#6366f1',
      'editorGutter.background': '#1a1625',
      'editorWidget.background': '#231d30',
    },
  },
  'susa-ocean': {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '22d3ee', fontStyle: 'bold' },
      { token: 'constant', foreground: '2dd4bf', fontStyle: 'bold' },
      { token: 'identifier', foreground: 'e0f2fe' },
      { token: 'number', foreground: '38bdf8' },
      { token: 'string', foreground: '2dd4bf' },
      { token: 'comment', foreground: '0ea5e9', fontStyle: 'italic' },
      { token: 'operator', foreground: 'f472b6' },
      { token: 'brackets', foreground: 'a78bfa' },
    ],
    colors: {
      'editor.background': '#0c1929',
      'editor.foreground': '#e0f2fe',
      'editor.lineHighlightBackground': '#0f2537',
      'editor.selectionBackground': '#164e63',
      'editorCursor.foreground': '#22d3ee',
      'editorLineNumber.foreground': '#0ea5e9',
      'editorGutter.background': '#0c1929',
      'editorWidget.background': '#0f2537',
    },
  },
};

// SUSA Completions Provider - Updated with actual SUSA syntax
export const susaCompletionsProvider: monaco.languages.CompletionItemProvider = {
  provideCompletionItems: (model, position) => {
    const word = model.getWordUntilPosition(position);
    const range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: word.startColumn,
      endColumn: word.endColumn,
    };

    const suggestions: monaco.languages.CompletionItem[] = [
      // Variable declarations
      {
        label: 'let',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'let ${1:name} = ${2:value}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Declare a variable',
        range,
      },
      {
        label: 'int',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'int ${1:name} = ${2:0}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Declare an integer variable',
        range,
      },
      {
        label: 'string',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'string ${1:name} = "${2:value}"',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Declare a string variable',
        range,
      },
      {
        label: 'bool',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'bool ${1:name} = ${2:true}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Declare a boolean variable',
        range,
      },
      
      // Control flow
      {
        label: 'if',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'IF ${1:condition}: START:\n    ${2}\nEND:',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Conditional statement',
        range,
      },
      {
        label: 'if-else',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'IF ${1:condition}: START:\n    ${2}\nELSE: START:\n    ${3}\nEND:',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Conditional statement with else branch',
        range,
      },
      {
        label: 'loop',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'LOOP ${1:i} = ${2:0} FOR ${3:10} TIMES: START:\n    ${4}\nEND:',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'For loop with counter',
        range,
      },
      {
        label: 'while',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'WHILE ${1:condition}: START:\n    ${2}\nEND:',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'While loop',
        range,
      },
      
      // Functions
      {
        label: 'func',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'FUNC ${1:name}(${2:params}): START:\n    ${3}\n    RETURN ${4:value}\nEND:',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Function definition',
        range,
      },
      
      // Classes
      {
        label: 'class',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'CLASS ${1:name}: START:\n    ${2}\nEND:',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Class definition',
        range,
      },
      
      // Error handling
      {
        label: 'try',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'TRY: START:\n    ${1}\nEND:\nCATCH: START:\n    ${2}\nEND:',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Try-catch block',
        range,
      },
      
      // Switch statements
      {
        label: 'switch',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'SWITCH ${1:variable}: START:\nCASE ${2:value}:\n    ${3}\n    BREAK:\nDEFAULT:\n    ${4}\nEND:',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Switch statement',
        range,
      },
      
      // Multi-language blocks
      {
        label: 'use-python',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'USE PYTHON: START:\n"${1:python_code}"\nEND:',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Python code block',
        range,
      },
      {
        label: 'use-javascript',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'USE JAVASCRIPT: START:\n"${1:javascript_code}"\nEND:',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'JavaScript code block',
        range,
      },
      
      // Common statements
      {
        label: 'print',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'PRINT ${1:expression}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Print a value to output',
        range,
      },
      {
        label: 'return',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'RETURN ${1:value}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Return a value from function',
        range,
      },
      {
        label: 'break',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'BREAK:',
        documentation: 'Break out of a loop',
        range,
      },
      {
        label: 'continue',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'CONTINUE:',
        documentation: 'Continue to next iteration',
        range,
      },
      
      // Literals
      {
        label: 'true',
        kind: monaco.languages.CompletionItemKind.Constant,
        insertText: 'true',
        documentation: 'Boolean true value',
        range,
      },
      {
        label: 'false',
        kind: monaco.languages.CompletionItemKind.Constant,
        insertText: 'false',
        documentation: 'Boolean false value',
        range,
      },
      {
        label: 'null',
        kind: monaco.languages.CompletionItemKind.Constant,
        insertText: 'null',
        documentation: 'Null value',
        range,
      },
      
      // String interpolation
      {
        label: 'rt-string',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'rt"${1:text with {variable}}"',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Runtime interpolated string',
        range,
      },
    ];

    return { suggestions };
  },
};

// SUSA Hover Provider - Updated with actual SUSA syntax
export const susaHoverProvider: monaco.languages.HoverProvider = {
  provideHover: (model, position) => {
    const word = model.getWordAtPosition(position);
    if (!word) return null;

    const hoverInfo: Record<string, string> = {
      // Variable declarations
      let: '**let** - Declares a variable with automatic type inference.\n\nSyntax: `let name = value`',
      int: '**int** - Declares an integer variable.\n\nSyntax: `int name = value`',
      float: '**float** - Declares a floating-point variable.\n\nSyntax: `float name = value`',
      string: '**string** - Declares a string variable.\n\nSyntax: `string name = "value"`',
      bool: '**bool** - Declares a boolean variable.\n\nSyntax: `bool name = true`',
      
      // Control flow
      if: '**IF** - Conditional statement.\n\nSyntax:\n```susa\nIF condition: START:\n    // code\nEND:\n```',
      else: '**ELSE** - Alternative branch for IF statement.\n\nSyntax:\n```susa\nIF condition: START:\n    // code\nELSE: START:\n    // alternative\nEND:\n```',
      loop: '**LOOP** - For loop with counter.\n\nSyntax:\n```susa\nLOOP i = 0 FOR 10 TIMES: START:\n    // code\nEND:\n```',
      while: '**WHILE** - Loop that continues while condition is true.\n\nSyntax:\n```susa\nWHILE condition: START:\n    // code\nEND:\n```',
      for: '**FOR** - Alternative loop syntax.\n\nSyntax:\n```susa\nFOR i = 0; i < 10; i = i + 1: START:\n    // code\nEND:\n```',
      
      // Functions and classes
      func: '**FUNC** - Function definition.\n\nSyntax:\n```susa\nFUNC name(params): START:\n    // code\n    RETURN value\nEND:\n```',
      return: '**RETURN** - Returns a value from a function.\n\nSyntax: `RETURN value`',
      class: '**CLASS** - Class definition.\n\nSyntax:\n```susa\nCLASS Name: START:\n    // methods and properties\nEND:\n```',
      extends: '**EXTENDS** - Class inheritance.\n\nSyntax: `CLASS Child EXTENDS Parent: START: ... END:`',
      
      // Error handling
      try: '**TRY** - Error handling block.\n\nSyntax:\n```susa\nTRY: START:\n    // code\nEND:\nCATCH: START:\n    // error handling\nEND:\n```',
      catch: '**CATCH** - Catches exceptions from TRY block.',
      finally: '**FINALLY** - Code that always executes after TRY/CATCH.',
      throw: '**THROW** - Throws an exception.\n\nSyntax: `THROW error_value`',
      
      // Switch statements
      switch: '**SWITCH** - Multi-way conditional.\n\nSyntax:\n```susa\nSWITCH variable: START:\nCASE value:\n    // code\n    BREAK:\nDEFAULT:\n    // default code\nEND:\n```',
      match: '**MATCH** - Pattern matching (alias for SWITCH).',
      case: '**CASE** - Branch in SWITCH statement.',
      default: '**DEFAULT** - Default branch in SWITCH statement.',
      
      // Multi-language support
      use: '**USE** - Multi-language code blocks.\n\nSyntax:\n```susa\nUSE PYTHON: START:\n"python_code_here"\nEND:\n```',
      shared: '**SHARED** - Shared variable across languages.',
      unsafe: '**UNSAFE** - Unsafe operations marker.',
      
      // I/O and utilities
      print: '**PRINT** - Outputs a value to the console.\n\nSyntax: `PRINT expression`',
      add: '**ADD** - Adds elements to collections.',
      remove: '**REMOVE** - Removes elements from collections.',
      share: '**SHARE** - Shares data between contexts.',
      
      // Control keywords
      start: '**START** - Begins a code block. Must be paired with END.',
      end: '**END** - Closes a code block. Must be paired with START.',
      break: '**BREAK** - Exits the current loop immediately.\n\nSyntax: `BREAK:`',
      continue: '**CONTINUE** - Skips to the next iteration of the loop.\n\nSyntax: `CONTINUE:`',
      
      // Literals
      true: '**true** - Boolean true value.',
      false: '**false** - Boolean false value.',
      null: '**null** - Represents no value or empty reference.',
      
      // Logical operators
      and: '**AND** - Logical AND operator.\n\nSyntax: `condition1 AND condition2`',
      or: '**OR** - Logical OR operator.\n\nSyntax: `condition1 OR condition2`',
      not: '**NOT** - Logical NOT operator.\n\nSyntax: `NOT condition`',
      is: '**IS** - Identity comparison operator.\n\nSyntax: `value IS other_value`',
      in: '**IN** - Membership test operator.\n\nSyntax: `item IN collection`',
      
      // Import system
      from: '**FROM** - Imports from modules.\n\nSyntax: `FROM module_name`',
      as: '**AS** - Alias in import statements.\n\nSyntax: `FROM module AS alias`',
      
      // Loop control
      times: '**TIMES** - Used in LOOP statements to specify iterations.\n\nSyntax: `LOOP i = 0 FOR 10 TIMES`',
    };

    const info = hoverInfo[word.word.toLowerCase()];
    if (info) {
      return {
        range: new monaco.Range(
          position.lineNumber,
          word.startColumn,
          position.lineNumber,
          word.endColumn
        ),
        contents: [{ value: info }],
      };
    }

    return null;
  },
};

// Register SUSA language with Monaco
export function registerSUSALanguage(monacoInstance: typeof monaco, theme: Theme = 'dark') {
  // Register the language
  monacoInstance.languages.register({ id: SUSA_LANGUAGE_ID });
  
  // Set language configuration
  monacoInstance.languages.setLanguageConfiguration(SUSA_LANGUAGE_ID, susaLanguageConfig);
  
  // Set token provider
  monacoInstance.languages.setMonarchTokensProvider(SUSA_LANGUAGE_ID, susaTokensProvider);
  
  // Define all themes
  Object.entries(susaThemes).forEach(([themeName, themeData]) => {
    monacoInstance.editor.defineTheme(`susa-${themeName}`, themeData);
  });
  
  // Register completion provider
  monacoInstance.languages.registerCompletionItemProvider(SUSA_LANGUAGE_ID, susaCompletionsProvider);
  
  // Register hover provider
  monacoInstance.languages.registerHoverProvider(SUSA_LANGUAGE_ID, susaHoverProvider);
}

// Get Monaco theme name from app theme
export function getMonacoTheme(theme: Theme): string {
  return `susa-${theme}`;
}
