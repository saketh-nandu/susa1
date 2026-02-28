import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Copy, Download, RotateCcw, Book, Package, Code2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const TryOnline = () => {
  const [code, setCode] = useState(() => {
    const savedCode = localStorage.getItem('susaCode');
    if (savedCode) {
      localStorage.removeItem('susaCode');
      return savedCode;
    }

    return `# Welcome to SUSA Online Editor!
# Try the world's first AI-made programming language

# Basic variables and output
LET message = "Hello, SUSA World!"
PRINT message

# Math operations
LET x = 10
LET y = 20
LET sum = x + y
PRINT "The sum is: " + sum

# Control flow with if-else
IF sum > 25:
START:
    PRINT "Sum is greater than 25"
END:
ELSE:
START:
    PRINT "Sum is 25 or less"
END:

# Loop example
LOOP i = 1 FOR 5 TIMES:
START:
    PRINT "Count: " + i
END:

PRINT "Try editing this code or load an example!"`;
  });

  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const examples = [
    {
      name: "Hello World",
      category: "Basics",
      code: `# Hello World in SUSA
PRINT "Hello, SUSA World!"
PRINT "Welcome to programming!"`
    },
    {
      name: "Variables & Math",
      category: "Basics",
      code: `# Variables and basic math
LET a = 15
LET b = 25
LET sum = a + b
LET product = a * b

PRINT "a = " + a
PRINT "b = " + b
PRINT "Sum: " + sum
PRINT "Product: " + product`
    },
    {
      name: "Control Flow",
      category: "Basics",
      code: `# If-else statements
LET age = 18

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
      category: "Basics",
      code: `# Function definition and usage
FUNCTION greet(name):
START:
    RETURN "Hello, " + name + "!"
END:

FUNCTION add(x, y):
START:
    RETURN x + y
END:

# Using the functions
LET greeting = greet("Developer")
PRINT greeting

LET result = add(10, 20)
PRINT "10 + 20 = " + result`
    },
    {
      name: "Math Utils",
      category: "Modules",
      code: `# Math Utils Module
LET sqrt_result = math_utils.sqrt(144)
PRINT "Square root of 144: " + sqrt_result

LET factorial = math_utils.factorial(5)
PRINT "Factorial of 5: " + factorial

LET is_prime = math_utils.is_prime(17)
PRINT "Is 17 prime? " + is_prime

LET random = math_utils.random_int(1, 10)
PRINT "Random number: " + random`
    },
    {
      name: "String Utils",
      category: "Modules",
      code: `# String Utils Module
LET text = "hello world"
LET upper = string_utils.upper(text)
PRINT "Uppercase: " + upper

LET reversed = string_utils.reverse("SUSA")
PRINT "Reversed: " + reversed

LET parts = string_utils.split("a,b,c", ",")
PRINT "Split: " + parts

LET contains = string_utils.contains("test", "es")
PRINT "Contains 'es': " + contains`
    },
    {
      name: "Array Utils",
      category: "Modules",
      code: `# Array Utils Module
LET numbers = [5, 2, 8, 1, 9, 3]

LET sum = array_utils.sum(numbers)
PRINT "Sum: " + sum

LET avg = array_utils.average(numbers)
PRINT "Average: " + avg

LET max = array_utils.max(numbers)
PRINT "Max: " + max

LET sorted = array_utils.sort(numbers)
PRINT "Sorted: " + sorted`
    },
    {
      name: "File Operations",
      category: "Modules",
      code: `# File Utils Module
LET success = file_utils.write_file("test.txt", "Hello SUSA!")
PRINT "File written: " + success

LET exists = file_utils.exists("test.txt")
PRINT "File exists: " + exists

LET content = file_utils.read_file("test.txt")
PRINT "Content: " + content

LET deleted = file_utils.delete_file("test.txt")
PRINT "File deleted: " + deleted`
    },
    {
      name: "DateTime",
      category: "Modules",
      code: `# DateTime Utils Module
LET now = datetime_utils.now()
PRINT "Current time: " + now

LET today = datetime_utils.today()
PRINT "Today: " + today

LET year = datetime_utils.get_year()
PRINT "Year: " + year

LET day_name = datetime_utils.get_day_name()
PRINT "Day: " + day_name`
    },
    {
      name: "Data Structures",
      category: "Advanced",
      code: `# Data Structures Module
LET stack = data_structures.stack_create()
LET stack = data_structures.stack_push(stack, 10)
LET stack = data_structures.stack_push(stack, 20)
LET stack = data_structures.stack_push(stack, 30)

LET size = data_structures.stack_size(stack)
PRINT "Stack size: " + size

LET top = data_structures.stack_peek(stack)
PRINT "Top element: " + top`
    },
    {
      name: "Algorithms",
      category: "Advanced",
      code: `# Algorithms Module
LET data = [5, 2, 8, 1, 9, 3]
PRINT "Original: " + data

LET sorted = algorithms.quick_sort(data)
PRINT "Sorted: " + sorted

LET is_palindrome = algorithms.is_palindrome("racecar")
PRINT "Is 'racecar' palindrome? " + is_palindrome

LET median = algorithms.median([10, 20, 30, 40, 50])
PRINT "Median: " + median`
    }
  ];

  const runCode = async () => {
    setIsRunning(true);
    setOutput("Connecting to SUSA compiler...\n");

    try {
      const bridgeResponse = await fetch('http://localhost:8765', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          timeout: 15000
        })
      });

      if (bridgeResponse.ok) {
        const result = await bridgeResponse.json();
        if (result.success) {
          let output = result.output;
          if (result.method) {
            output += `\n\n[Executed via: ${result.method}]`;
          }
          setOutput(output);
          toast.success(`Code executed via ${result.method || 'SUSA Bridge'}!`);
          setIsRunning(false);
          return;
        }
      }
    } catch (error) {
      console.warn('SUSA Bridge Server not available:', error);
    }

    // Enhanced simulation
    setOutput("SUSA compiler not available, using simulation...\n");
    await new Promise(resolve => setTimeout(resolve, 1000));

    let mockOutput = "";
    const lines = code.split('\n');
    let variables: Record<string, any> = {};

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.startsWith('LET ')) {
        const match = trimmed.match(/LET\s+(\w+)\s*=\s*(.+)/);
        if (match) {
          const [, varName, value] = match;
          let parsedValue: string | number = value.replace(/"/g, '').trim();
          if (!isNaN(Number(parsedValue))) {
            parsedValue = Number(parsedValue);
          }
          variables[varName] = parsedValue;
        }
      }

      else if (trimmed.startsWith('PRINT ')) {
        let printContent = trimmed.substring(6).trim();
        printContent = printContent.replace(/"/g, '');

        for (const [varName, value] of Object.entries(variables)) {
          const regex = new RegExp(`\\b${varName}\\b`, 'g');
          printContent = printContent.replace(regex, String(value));
        }

        printContent = printContent.replace(/(\d+)\s*\+\s*(\d+)/g, (match, a, b) => {
          return String(Number(a) + Number(b));
        });

        mockOutput += printContent + '\n';
      }

      else if (trimmed.startsWith('#') && trimmed.includes('===')) {
        mockOutput += trimmed.substring(1).trim() + '\n';
      }
    }

    if (!mockOutput) {
      mockOutput = "Code executed successfully!\n(No PRINT statements found)";
    }

    mockOutput += "\n[Note: Using simulation - Install SUSA for full functionality]";
    setOutput(mockOutput);
    toast.success("Code executed (simulation)!");
    setIsRunning(false);
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

  const categories = ["All", "Basics", "Modules", "Advanced"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredExamples = examples.filter(example =>
    selectedCategory === "All" || example.category === selectedCategory
  );

  return (
    <div className="h-screen overflow-y-auto bg-background text-foreground transition-colors duration-500">
      {/* Header */}
      <header className="border-b border-primary/20 bg-background/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" state={{ fromPage: 'try-online' }} className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Home</span>
            </Link>
            <div className="flex items-center gap-2">
              <Code2 className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">Try SUSA Online</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">
            Experience SUSA in Your Browser
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Write, run, and experiment with SUSA code instantly. Try all 9 modules with 290 functions!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Examples Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20 sticky top-24">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Examples
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={selectedCategory === category
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-xs shadow-glow"
                        : "border-primary/20 text-muted-foreground hover:text-foreground hover:bg-primary/10 text-xs"
                      }
                    >
                      {category}
                    </Button>
                  ))}
                </div>

                {/* Examples List */}
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {filteredExamples.map((example, index) => (
                    <button
                      key={index}
                      className="w-full text-left p-3 rounded-lg transition-all bg-muted/30 text-muted-foreground hover:bg-primary/10 hover:text-foreground border border-transparent hover:border-primary/30"
                      onClick={() => loadExample(example.code)}
                    >
                      <div className="font-medium text-sm">{example.name}</div>
                      <div className="text-xs text-muted-foreground/60 mt-1">{example.category}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Editor Area */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="editor" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                <TabsTrigger value="editor" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Code2 className="w-4 h-4 mr-2" />
                  Code Editor
                </TabsTrigger>
                <TabsTrigger value="output" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Play className="w-4 h-4 mr-2" />
                  Output
                </TabsTrigger>
              </TabsList>

              <TabsContent value="editor" className="space-y-4">
                <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-foreground">SUSA Code Editor</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={copyCode}
                        className="border-primary/20 text-muted-foreground hover:text-foreground hover:bg-primary/10"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={downloadCode}
                        className="border-primary/20 text-muted-foreground hover:text-foreground hover:bg-primary/10"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={resetCode}
                        className="border-primary/20 text-muted-foreground hover:text-foreground hover:bg-primary/10"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="min-h-[400px] font-mono text-sm bg-muted/30 border-primary/20 text-primary resize-none focus-visible:ring-primary"
                      placeholder="Write your SUSA code here..."
                    />
                    <div className="flex justify-between items-center mt-4">
                      <p className="text-sm text-muted-foreground">
                        Lines: {code.split('\n').length} | Characters: {code.length}
                      </p>
                      <Button
                        onClick={runCode}
                        disabled={isRunning}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-glow"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {isRunning ? "Running..." : "Run Code"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="output">
                <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-foreground">Output</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted border border-primary/20 rounded-md p-4 min-h-[400px]">
                      <pre className="text-green-600 dark:text-green-400 font-mono text-sm whitespace-pre-wrap">
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
        <div className="mt-12">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20 max-w-4xl mx-auto">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-semibold mb-4">About SUSA Online</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                This online editor connects to the actual SUSA compiler and interpreter.
                Experience the full power of SUSA programming language with real-time execution.
                If the compiler is unavailable, a simulation mode provides basic functionality.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/docs">
                  <Button variant="outline" className="border-primary/20 text-muted-foreground hover:text-foreground hover:bg-primary/10">
                    <Book className="w-4 h-4 mr-2" />
                    View Documentation
                  </Button>
                </Link>
                <Link to="/download">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-glow">
                    <Download className="w-4 h-4 mr-2" />
                    Download SUSA
                  </Button>
                </Link>
              </div>

              {/* System Requirements */}
              <div className="mt-8 bg-primary/5 border border-primary/20 rounded-lg p-6 text-left">
                <h4 className="text-lg font-semibold text-primary mb-3">System Requirements</h4>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    4GB RAM minimum (8GB recommended)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    500MB disk space for compiler and runtime
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Internet connection for AI model downloads
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Modern CPU with AVX2 support for optimal performance
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TryOnline;
