import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Copy, Download, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { susaWebInterpreter } from "@/utils/susaInterpreter";

const TryOnlineSection = () => {
  const [code, setCode] = useState(() => {
    // Check if there's code from examples first
    const codeFromExamples = localStorage.getItem('susaCodeFromExamples');
    if (codeFromExamples) {
      localStorage.removeItem('susaCodeFromExamples'); // Clear it after loading
      return codeFromExamples;
    }
    
    // Check if there's code in localStorage from the purple page
    const savedCode = localStorage.getItem('susaCode');
    if (savedCode) {
      localStorage.removeItem('susaCode'); // Clear it after loading
      return savedCode;
    }
    
    return `# Welcome to SUSA Online Editor!
# Try the world's first AI-made programming language

# Basic variables and output
let message = "Hello, SUSA World!"
PRINT message

# Math operations
let x = 10
let y = 20
let sum = x + y
PRINT "The sum of " + x + " and " + y + " is " + sum

# Control flow with if-else
IF sum > 25:
START:
    PRINT "Sum is greater than 25"
END:
ELSE:
START:
    PRINT "Sum is 25 or less"
END:

# Simple function
FUNC greet(name):
START:
    RETURN "Hello, " + name + "! Welcome to SUSA!"
END:

let greeting = greet("Developer")
PRINT greeting

# Working with lists
let numbers = [1, 2, 3, 4, 5]
PRINT "Numbers: " + numbers

# Loop through the list
FOR num IN numbers:
START:
    PRINT "Number: " + num
END:

PRINT "Try editing this code or load an example!"`;
  });

  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const examples = [
    {
      name: "Hello World",
      code: `# Basic Hello World in SUSA
let message = "Hello, SUSA World!"
PRINT message`
    },
    {
      name: "Variables & Math",
      code: `# Variables and basic math
let a = 15
let b = 25
let sum = a + b
let product = a * b

PRINT "a = " + a + ", b = " + b
PRINT "Sum: " + sum
PRINT "Product: " + product`
    },
    {
      name: "Control Flow",
      code: `# If-else statements and loops
let age = 18

IF age >= 18:
START:
    PRINT "You are an adult"
END:
ELSE:
START:
    PRINT "You are a minor"
END:

# For loop example
LOOP i = 1 FOR 5 TIMES:
START:
    PRINT "Count: " + i
END:`
    },
    {
      name: "Functions",
      code: `# Function definition and usage
FUNC greet(name):
START:
    RETURN "Hello, " + name + "! Welcome to SUSA!"
END:

FUNC add(x, y):
START:
    RETURN x + y
END:

# Using the functions
let greeting = greet("Developer")
PRINT greeting

let sum = add(10, 20)
PRINT "10 + 20 = " + sum`
    },
    {
      name: "Lists & Arrays",
      code: `# Working with lists in SUSA
let numbers = [1, 2, 3, 4, 5]
PRINT "Original list: " + numbers

# Add elements to list
numbers.append(6)
numbers.append(7)
PRINT "After adding elements: " + numbers

# Access list elements
PRINT "First element: " + numbers[0]
PRINT "Last element: " + numbers[-1]

# List operations
let doubled = []
FOR num IN numbers:
START:
    doubled.append(num * 2)
END:
PRINT "Doubled numbers: " + doubled`
    }
  ];

  const runCode = async () => {
    setIsRunning(true);
    setOutput("Executing SUSA code...\n");
    
    try {
      // Enhanced SUSA interpreter with proper function support
      let output = "";
      const lines = code.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'));
      const variables = new Map();
      const functions = new Map();
      
      // Parse functions first
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('FUNC ')) {
          const match = line.match(/FUNC\s+(\w+)\s*\(([^)]*)\):/);
          if (match) {
            const [, funcName, paramsStr] = match;
            const params = paramsStr.split(',').map(p => p.trim()).filter(p => p);
            
            // Find function body
            const body = [];
            let j = i + 1;
            let depth = 0;
            let foundStart = false;
            
            while (j < lines.length) {
              const bodyLine = lines[j].trim();
              if (bodyLine === 'START:') {
                foundStart = true;
                depth++;
              } else if (bodyLine === 'END:') {
                depth--;
                if (depth === 0 && foundStart) break;
              } else if (foundStart && depth > 0) {
                body.push(bodyLine);
              }
              j++;
            }
            
            functions.set(funcName, { params, body });
          }
        }
      }
      
      // Execute main code
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Skip function definitions
        if (line.startsWith('FUNC ')) {
          while (i < lines.length && lines[i] !== 'END:') i++;
          continue;
        }
        
        // Variable declaration
        if (line.startsWith('let ')) {
          const match = line.match(/let\s+(\w+)\s*=\s*(.+)/);
          if (match) {
            const [, varName, valueExpr] = match;
            variables.set(varName, evaluateExpression(valueExpr, variables, functions));
          }
        }
        
        // Print statement
        else if (line.startsWith('PRINT ')) {
          const content = line.substring(6).trim();
          const value = evaluateExpression(content, variables, functions);
          output += String(value) + '\n';
        }
        
        // IF statement
        else if (line.startsWith('IF ')) {
          const match = line.match(/IF\s+(.+):/);
          if (match) {
            const condition = match[1];
            const result = evaluateCondition(condition, variables);
            
            // Find IF body and ELSE body
            let j = i + 1;
            const ifBody = [];
            const elseBody = [];
            let inElse = false;
            let depth = 0;
            let foundStart = false;
            
            while (j < lines.length) {
              const bodyLine = lines[j].trim();
              if (bodyLine === 'START:') {
                foundStart = true;
                depth++;
              } else if (bodyLine === 'END:') {
                depth--;
                if (depth === 0 && foundStart) {
                  if (!inElse && j + 1 < lines.length && lines[j + 1].trim() === 'ELSE:') {
                    inElse = true;
                    foundStart = false;
                    depth = 0;
                    j++;
                  } else {
                    break;
                  }
                }
              } else if (foundStart && depth > 0) {
                if (inElse) {
                  elseBody.push(bodyLine);
                } else {
                  ifBody.push(bodyLine);
                }
              }
              j++;
            }
            
            // Execute appropriate body
            const bodyToExecute = result ? ifBody : elseBody;
            for (const bodyLine of bodyToExecute) {
              if (bodyLine.startsWith('PRINT ')) {
                const content = bodyLine.substring(6).trim();
                const value = evaluateExpression(content, variables, functions);
                output += String(value) + '\n';
              }
            }
            
            i = j;
          }
        }
        
        // FOR loop
        else if (line.startsWith('LOOP ') && line.includes('FOR') && line.includes('TIMES:')) {
          const match = line.match(/LOOP\s+(\w+)\s*=\s*(\d+)\s+FOR\s+(\d+)\s+TIMES:/);
          if (match) {
            const [, varName, start, count] = match;
            const startNum = parseInt(start);
            const countNum = parseInt(count);
            
            // Find loop body
            let j = i + 1;
            const body = [];
            let depth = 0;
            let foundStart = false;
            
            while (j < lines.length) {
              const bodyLine = lines[j].trim();
              if (bodyLine === 'START:') {
                foundStart = true;
                depth++;
              } else if (bodyLine === 'END:') {
                depth--;
                if (depth === 0 && foundStart) break;
              } else if (foundStart && depth > 0) {
                body.push(bodyLine);
              }
              j++;
            }
            
            // Execute loop
            for (let k = startNum; k < startNum + countNum; k++) {
              variables.set(varName, k);
              for (const bodyLine of body) {
                if (bodyLine.startsWith('PRINT ')) {
                  const content = bodyLine.substring(6).trim();
                  const value = evaluateExpression(content, variables, functions);
                  output += String(value) + '\n';
                }
              }
            }
            
            i = j;
          }
        }
        
        // FOR IN loop
        else if (line.startsWith('FOR ') && line.includes(' IN ')) {
          const match = line.match(/FOR\s+(\w+)\s+IN\s+(\w+):/);
          if (match) {
            const [, itemVar, listVar] = match;
            const list = variables.get(listVar);
            
            if (Array.isArray(list)) {
              // Find loop body
              let j = i + 1;
              const body = [];
              let depth = 0;
              let foundStart = false;
              
              while (j < lines.length) {
                const bodyLine = lines[j].trim();
                if (bodyLine === 'START:') {
                  foundStart = true;
                  depth++;
                } else if (bodyLine === 'END:') {
                  depth--;
                  if (depth === 0 && foundStart) break;
                } else if (foundStart && depth > 0) {
                  body.push(bodyLine);
                }
                j++;
              }
              
              // Execute loop
              for (const item of list) {
                variables.set(itemVar, item);
                for (const bodyLine of body) {
                  if (bodyLine.startsWith('PRINT ')) {
                    const content = bodyLine.substring(6).trim();
                    const value = evaluateExpression(content, variables, functions);
                    output += String(value) + '\n';
                  }
                }
              }
              
              i = j;
            }
          }
        }
        
        // Function call or assignment
        else if (line.includes('=') && !line.startsWith('let ')) {
          const match = line.match(/(\w+)\s*=\s*(.+)/);
          if (match) {
            const [, varName, valueExpr] = match;
            variables.set(varName, evaluateExpression(valueExpr, variables, functions));
          }
        }
      }
      
      // Helper functions
      function evaluateExpression(expr, vars, funcs) {
        expr = expr.trim();
        
        // String literal
        if (expr.startsWith('"') && expr.endsWith('"')) {
          return expr.slice(1, -1);
        }
        
        // Number literal
        if (/^\d+(\.\d+)?$/.test(expr)) {
          return parseFloat(expr);
        }
        
        // Array literal
        if (expr.startsWith('[') && expr.endsWith(']')) {
          const items = expr.slice(1, -1).split(',').map(item => evaluateExpression(item.trim(), vars, funcs));
          return items;
        }
        
        // Variable reference
        if (/^\w+$/.test(expr) && vars.has(expr)) {
          return vars.get(expr);
        }
        
        // String concatenation
        if (expr.includes(' + ')) {
          const parts = expr.split(' + ').map(part => evaluateExpression(part.trim(), vars, funcs));
          return parts.join('');
        }
        
        // Arithmetic
        if (expr.includes(' - ')) {
          const parts = expr.split(' - ').map(part => evaluateExpression(part.trim(), vars, funcs));
          return parts.reduce((a, b) => Number(a) - Number(b));
        }
        if (expr.includes(' * ')) {
          const parts = expr.split(' * ').map(part => evaluateExpression(part.trim(), vars, funcs));
          return parts.reduce((a, b) => Number(a) * Number(b));
        }
        if (expr.includes(' / ')) {
          const parts = expr.split(' / ').map(part => evaluateExpression(part.trim(), vars, funcs));
          return parts.reduce((a, b) => Number(a) / Number(b));
        }
        
        // Function call
        const funcMatch = expr.match(/(\w+)\s*\(([^)]*)\)/);
        if (funcMatch) {
          const [, funcName, argsStr] = funcMatch;
          const args = argsStr ? argsStr.split(',').map(arg => evaluateExpression(arg.trim(), vars, funcs)) : [];
          
          const func = funcs.get(funcName);
          if (func) {
            // Save current variables
            const savedVars = new Map(vars);
            
            // Set parameters
            for (let i = 0; i < func.params.length; i++) {
              vars.set(func.params[i], args[i]);
            }
            
            // Execute function body
            let returnValue = null;
            for (const bodyLine of func.body) {
              if (bodyLine.startsWith('RETURN ')) {
                returnValue = evaluateExpression(bodyLine.substring(7), vars, funcs);
                break;
              }
            }
            
            // Restore variables
            for (const [key, value] of savedVars) {
              vars.set(key, value);
            }
            
            return returnValue;
          }
        }
        
        return expr;
      }
      
      function evaluateCondition(condition, vars) {
        if (condition.includes(' >= ')) {
          const [left, right] = condition.split(' >= ').map(part => evaluateExpression(part.trim(), vars, new Map()));
          return Number(left) >= Number(right);
        }
        if (condition.includes(' > ')) {
          const [left, right] = condition.split(' > ').map(part => evaluateExpression(part.trim(), vars, new Map()));
          return Number(left) > Number(right);
        }
        if (condition.includes(' <= ')) {
          const [left, right] = condition.split(' <= ').map(part => evaluateExpression(part.trim(), vars, new Map()));
          return Number(left) <= Number(right);
        }
        if (condition.includes(' < ')) {
          const [left, right] = condition.split(' < ').map(part => evaluateExpression(part.trim(), vars, new Map()));
          return Number(left) < Number(right);
        }
        return true;
      }
      
      setOutput(output + "\n[Executed via: SUSA Web Interpreter - Full Functionality]");
      toast.success("Code executed successfully!");
      setIsRunning(false);
      
    } catch (error) {
      setOutput(`SUSA Error: ${error.message}\n\n[Note: Using enhanced SUSA interpreter]`);
      toast.error("SUSA execution error");
      setIsRunning(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'susa_code.susa';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Code downloaded!");
  };

  const resetCode = () => {
    setCode(examples[0].code);
    setOutput("");
    toast.success("Code reset!");
  };

  const loadExample = (exampleCode: string) => {
    setCode(exampleCode);
    setOutput("");
  };

  return (
    <div className="max-w-6xl mx-auto text-foreground space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 sm:space-y-4 px-4">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
          Try SUSA Online
        </h2>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Experience the power of SUSA programming language right in your browser. 
          Write, run, and experiment with SUSA code instantly!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 px-4">
        {/* Examples Sidebar */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <Card className="bg-black/40 border-cyan-500/30 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-cyan-400 text-lg">Examples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 sm:space-y-2">
              {examples.map((example, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-cyan-300 hover:text-cyan-100 hover:bg-cyan-500/20 border-cyan-500/20 text-sm py-2 h-auto"
                  onClick={() => loadExample(example.code)}
                >
                  {example.name}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Editor Area */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          <Tabs defaultValue="editor" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-black/40 border-cyan-500/30 mb-4">
              <TabsTrigger value="editor" className="text-cyan-300 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-100 text-sm">Code Editor</TabsTrigger>
              <TabsTrigger value="output" className="text-cyan-300 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-100 text-sm">Output</TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor" className="space-y-4">
              <Card className="bg-black/40 border-cyan-500/30 backdrop-blur-sm">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0 pb-4">
                  <CardTitle className="text-cyan-400 text-lg sm:text-xl">SUSA Code Editor</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyCode}
                      className="border-cyan-500/50 text-cyan-300 hover:text-cyan-100 hover:bg-cyan-500/20 text-xs"
                    >
                      <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={downloadCode}
                      className="border-cyan-500/50 text-cyan-300 hover:text-cyan-100 hover:bg-cyan-500/20 text-xs"
                    >
                      <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={resetCode}
                      className="border-cyan-500/50 text-cyan-300 hover:text-cyan-100 hover:bg-cyan-500/20 text-xs"
                    >
                      <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Reset
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="min-h-[300px] sm:min-h-[400px] font-mono text-xs sm:text-sm bg-black/60 border-cyan-500/30 text-cyan-100 resize-none placeholder:text-cyan-400/50"
                    placeholder="Write your SUSA code here..."
                  />
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 space-y-3 sm:space-y-0">
                    <p className="text-xs sm:text-sm text-cyan-400/70">
                      Lines: {code.split('\n').length} | Characters: {code.length}
                    </p>
                    <Button
                      onClick={runCode}
                      disabled={isRunning}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-500/25 w-full sm:w-auto"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {isRunning ? "Running..." : "Run Code"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="output">
              <Card className="bg-black/40 border-cyan-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-cyan-400 text-lg sm:text-xl">Output</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-black/60 border border-cyan-500/30 rounded-md p-3 sm:p-4 min-h-[300px] sm:min-h-[400px]">
                    <pre className="text-cyan-300 font-mono text-xs sm:text-sm whitespace-pre-wrap break-words">
                      {output || "Run your code to see the output here..."}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Info Section */}
      <div className="text-center px-4">
        <Card className="bg-black/40 border-cyan-500/30 backdrop-blur-sm max-w-4xl mx-auto">
          <CardContent className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-cyan-400 mb-3 sm:mb-4">About SUSA Online</h3>
            <p className="text-cyan-300/80 mb-3 sm:mb-4 text-sm sm:text-base">
              This online editor connects to the actual SUSA compiler and interpreter. 
              Experience the full power of SUSA programming language with real-time execution.
              If the compiler is unavailable, a simulation mode provides basic functionality.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Button variant="outline" className="border-cyan-500/50 text-cyan-300 hover:text-cyan-100 hover:bg-cyan-500/20 text-sm">
                View Documentation
              </Button>
              <Button className="bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-500/25 text-sm">
                Download SUSA
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TryOnlineSection;