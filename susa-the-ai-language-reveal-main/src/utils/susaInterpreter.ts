// SUSA Web Interpreter - Direct JavaScript Implementation
// This provides SUSA functionality directly in the browser

interface SUSAVariable {
  name: string;
  value: any;
  type: string;
}

interface SUSAFunction {
  name: string;
  params: string[];
  body: string[];
}

class SUSAWebInterpreter {
  private variables: Map<string, any> = new Map();
  private functions: Map<string, SUSAFunction> = new Map();
  private output: string[] = [];

  constructor() {
    // Initialize built-in functions
    this.initializeBuiltins();
  }

  private initializeBuiltins() {
    // Built-in PRINT function
    this.functions.set('PRINT', {
      name: 'PRINT',
      params: ['value'],
      body: []
    });
  }

  public execute(code: string): { success: boolean; output: string; error?: string } {
    try {
      this.output = [];
      this.variables.clear();
      this.initializeBuiltins();

      const lines = code.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'));
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        try {
          this.executeLine(line, lines, i);
        } catch (error) {
          return {
            success: false,
            output: this.output.join('\n'),
            error: `Line ${i + 1}: ${error.message}`
          };
        }
      }

      return {
        success: true,
        output: this.output.join('\n') || 'Code executed successfully!'
      };
    } catch (error) {
      return {
        success: false,
        output: this.output.join('\n'),
        error: error.message
      };
    }
  }

  private executeLine(line: string, allLines: string[], currentIndex: number): number {
    line = line.trim();
    if (!line || line.startsWith('#')) return currentIndex;

    // Variable declaration: let x = value
    if (line.startsWith('let ')) {
      this.handleVariableDeclaration(line);
    }
    // Print statement: PRINT value
    else if (line.startsWith('PRINT ')) {
      this.handlePrint(line);
    }
    // Function definition: FUNC name(params):
    else if (line.startsWith('FUNC ')) {
      return this.handleFunctionDefinition(line, allLines, currentIndex);
    }
    // IF statement
    else if (line.startsWith('IF ')) {
      return this.handleIfStatement(line, allLines, currentIndex);
    }
    // FOR loop
    else if (line.startsWith('FOR ') || line.startsWith('LOOP ')) {
      return this.handleLoop(line, allLines, currentIndex);
    }
    // Function call or assignment
    else if (line.includes('=') && !line.startsWith('let ')) {
      this.handleAssignment(line);
    }
    // Function call without assignment
    else if (line.includes('(') && line.includes(')')) {
      this.evaluateExpression(line);
    }
    // Skip structural keywords
    else if (['START:', 'END:', 'ELSE:'].includes(line)) {
      // These are handled by their parent constructs
      return currentIndex;
    }

    return currentIndex;
  }

  private handleVariableDeclaration(line: string) {
    const match = line.match(/let\s+(\w+)\s*=\s*(.+)/);
    if (match) {
      const [, varName, valueExpr] = match;
      const value = this.evaluateExpression(valueExpr);
      this.variables.set(varName, value);
    }
  }

  private handlePrint(line: string) {
    const content = line.substring(6).trim();
    const value = this.evaluateExpression(content);
    this.output.push(String(value));
  }

  private handleFunctionDefinition(line: string, allLines: string[], currentIndex: number): number {
    const match = line.match(/FUNC\s+(\w+)\s*\(([^)]*)\):/);
    if (match) {
      const [, funcName, paramsStr] = match;
      const params = paramsStr.split(',').map(p => p.trim()).filter(p => p);
      
      // Find function body (between START: and END:)
      const body: string[] = [];
      let i = currentIndex + 1;
      let foundStart = false;
      let depth = 0;

      while (i < allLines.length) {
        const bodyLine = allLines[i].trim();
        
        if (bodyLine === 'START:') {
          foundStart = true;
          depth++;
        } else if (bodyLine === 'END:') {
          depth--;
          if (depth === 0 && foundStart) {
            break;
          }
        } else if (foundStart && depth > 0) {
          body.push(bodyLine);
        }
        i++;
      }
      
      this.functions.set(funcName, {
        name: funcName,
        params,
        body
      });

      return i; // Return the index after END:
    }
    return currentIndex;
  }

  private handleIfStatement(line: string, allLines: string[], currentIndex: number): number {
    const match = line.match(/IF\s+(.+):/);
    if (match) {
      const condition = match[1];
      const result = this.evaluateCondition(condition);
      
      // Find the IF body and optional ELSE body
      let i = currentIndex + 1;
      let foundStart = false;
      let depth = 0;
      const ifBody: string[] = [];
      const elseBody: string[] = [];
      let inElse = false;

      while (i < allLines.length) {
        const bodyLine = allLines[i].trim();
        
        if (bodyLine === 'START:') {
          foundStart = true;
          depth++;
        } else if (bodyLine === 'END:') {
          depth--;
          if (depth === 0 && foundStart) {
            if (inElse || !allLines[i + 1] || !allLines[i + 1].trim().startsWith('ELSE:')) {
              break;
            }
          }
        } else if (bodyLine === 'ELSE:') {
          inElse = true;
          depth = 0;
          foundStart = false;
        } else if (foundStart && depth > 0) {
          if (inElse) {
            elseBody.push(bodyLine);
          } else {
            ifBody.push(bodyLine);
          }
        }
        i++;
      }

      // Execute the appropriate body
      const bodyToExecute = result ? ifBody : elseBody;
      for (const bodyLine of bodyToExecute) {
        this.executeLine(bodyLine, allLines, 0);
      }

      return i;
    }
    return currentIndex;
  }

  private handleLoop(line: string, allLines: string[], currentIndex: number): number {
    // Handle LOOP i = 1 FOR 5 TIMES:
    const forMatch = line.match(/LOOP\s+(\w+)\s*=\s*(\d+)\s+FOR\s+(\d+)\s+TIMES:/);
    if (forMatch) {
      const [, varName, start, count] = forMatch;
      const startNum = parseInt(start);
      const countNum = parseInt(count);
      
      // Find loop body
      const body: string[] = [];
      let i = currentIndex + 1;
      let foundStart = false;
      let depth = 0;

      while (i < allLines.length) {
        const bodyLine = allLines[i].trim();
        
        if (bodyLine === 'START:') {
          foundStart = true;
          depth++;
        } else if (bodyLine === 'END:') {
          depth--;
          if (depth === 0 && foundStart) {
            break;
          }
        } else if (foundStart && depth > 0) {
          body.push(bodyLine);
        }
        i++;
      }

      // Execute loop
      for (let j = startNum; j < startNum + countNum; j++) {
        this.variables.set(varName, j);
        for (const bodyLine of body) {
          this.executeLine(bodyLine, allLines, 0);
        }
      }

      return i;
    }

    // Handle FOR item IN list:
    const inMatch = line.match(/FOR\s+(\w+)\s+IN\s+(\w+):/);
    if (inMatch) {
      const [, itemVar, listVar] = inMatch;
      const list = this.variables.get(listVar);
      
      if (Array.isArray(list)) {
        // Find loop body
        const body: string[] = [];
        let i = currentIndex + 1;
        let foundStart = false;
        let depth = 0;

        while (i < allLines.length) {
          const bodyLine = allLines[i].trim();
          
          if (bodyLine === 'START:') {
            foundStart = true;
            depth++;
          } else if (bodyLine === 'END:') {
            depth--;
            if (depth === 0 && foundStart) {
              break;
            }
          } else if (foundStart && depth > 0) {
            body.push(bodyLine);
          }
          i++;
        }

        // Execute loop
        for (const item of list) {
          this.variables.set(itemVar, item);
          for (const bodyLine of body) {
            this.executeLine(bodyLine, allLines, 0);
          }
        }

        return i;
      }
    }

    return currentIndex;
  }

  private handleAssignment(line: string) {
    const match = line.match(/(\w+)\s*=\s*(.+)/);
    if (match) {
      const [, varName, valueExpr] = match;
      const value = this.evaluateExpression(valueExpr);
      this.variables.set(varName, value);
    }
  }

  private evaluateExpression(expr: string): any {
    expr = expr.trim();

    // String literal
    if (expr.startsWith('"') && expr.endsWith('"')) {
      return expr.slice(1, -1);
    }

    // Number literal
    if (/^\d+(\.\d+)?$/.test(expr)) {
      return parseFloat(expr);
    }

    // Boolean literals
    if (expr === 'true') return true;
    if (expr === 'false') return false;
    if (expr === 'null') return null;

    // Array literal
    if (expr.startsWith('[') && expr.endsWith(']')) {
      const items = expr.slice(1, -1).split(',').map(item => this.evaluateExpression(item.trim()));
      return items;
    }

    // Variable reference
    if (/^\w+$/.test(expr)) {
      return this.variables.get(expr) ?? expr;
    }

    // String concatenation with +
    if (expr.includes(' + ')) {
      const parts = expr.split(' + ').map(part => this.evaluateExpression(part.trim()));
      return parts.join('');
    }

    // Arithmetic operations
    if (expr.includes(' - ')) {
      const parts = expr.split(' - ').map(part => this.evaluateExpression(part.trim()));
      return parts.reduce((a, b) => Number(a) - Number(b));
    }

    if (expr.includes(' * ')) {
      const parts = expr.split(' * ').map(part => this.evaluateExpression(part.trim()));
      return parts.reduce((a, b) => Number(a) * Number(b));
    }

    if (expr.includes(' / ')) {
      const parts = expr.split(' / ').map(part => this.evaluateExpression(part.trim()));
      return parts.reduce((a, b) => Number(a) / Number(b));
    }

    // Function call
    const funcMatch = expr.match(/(\w+)\s*\(([^)]*)\)/);
    if (funcMatch) {
      const [, funcName, argsStr] = funcMatch;
      const args = argsStr ? argsStr.split(',').map(arg => this.evaluateExpression(arg.trim())) : [];
      return this.callFunction(funcName, args);
    }

    return expr;
  }

  private evaluateCondition(condition: string): boolean {
    // Handle comparison operators
    if (condition.includes(' >= ')) {
      const [left, right] = condition.split(' >= ').map(part => this.evaluateExpression(part.trim()));
      return Number(left) >= Number(right);
    }
    if (condition.includes(' <= ')) {
      const [left, right] = condition.split(' <= ').map(part => this.evaluateExpression(part.trim()));
      return Number(left) <= Number(right);
    }
    if (condition.includes(' > ')) {
      const [left, right] = condition.split(' > ').map(part => this.evaluateExpression(part.trim()));
      return Number(left) > Number(right);
    }
    if (condition.includes(' < ')) {
      const [left, right] = condition.split(' < ').map(part => this.evaluateExpression(part.trim()));
      return Number(left) < Number(right);
    }
    if (condition.includes(' == ')) {
      const [left, right] = condition.split(' == ').map(part => this.evaluateExpression(part.trim()));
      return left == right;
    }

    return Boolean(this.evaluateExpression(condition));
  }

  private callFunction(name: string, args: any[]): any {
    if (name === 'PRINT') {
      this.output.push(String(args[0] || ''));
      return null;
    }

    const func = this.functions.get(name);
    if (func) {
      // Save current variable state
      const savedVars = new Map(this.variables);
      
      // Set parameters as variables
      for (let i = 0; i < func.params.length; i++) {
        this.variables.set(func.params[i], args[i]);
      }
      
      // Execute function body
      let returnValue = null;
      for (const bodyLine of func.body) {
        if (bodyLine.startsWith('RETURN ')) {
          returnValue = this.evaluateExpression(bodyLine.substring(7));
          break;
        } else {
          this.executeLine(bodyLine, func.body, 0);
        }
      }
      
      // Restore variable state (except for global changes)
      this.variables = savedVars;
      
      return returnValue;
    }

    throw new Error(`Unknown function: ${name}`);
  }
}

export const susaWebInterpreter = new SUSAWebInterpreter();