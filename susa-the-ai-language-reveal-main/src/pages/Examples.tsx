import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Play, ArrowLeft, Code, FileCode, Zap, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Examples = () => {
  const [selectedExample, setSelectedExample] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const examples = [
    {
      title: "Hello World",
      category: "Basics",
      difficulty: "Beginner",
      description: "Your first SUSA program - print text to the console",
      explanation: "This is the simplest SUSA program. The PRINT command displays text on the screen. You can print strings (text in quotes), numbers, or variables. This is how you communicate with users and show output from your programs.",
      code: `# Hello World in SUSA
PRINT "Hello, World!"
PRINT "Welcome to SUSA programming!"`,
      output: `Hello, World!
Welcome to SUSA programming!`
    },
    {
      title: "Variables & Types",
      category: "Basics",
      difficulty: "Beginner",
      description: "Learn about variables and data types in SUSA",
      explanation: "Variables store data that your program can use and modify. SUSA supports multiple data types: strings (text), numbers (integers and decimals), booleans (true/false), and null (no value). Use LET to create variables. Variable names should be descriptive to make your code readable.",
      code: `# Variables and Data Types
LET name = "Alice"
LET age = 25
LET active = true
LET nothing = null

PRINT "Name: " + name
PRINT "Age: " + age
PRINT "Active: " + active
PRINT "Nothing: " + nothing`,
      output: `Name: Alice
Age: 25
Active: true
Nothing: null`
    },
    {
      title: "Arithmetic Operations",
      category: "Basics",
      difficulty: "Beginner",
      description: "Perform basic math operations",
      explanation: "SUSA supports all standard arithmetic operations: addition (+), subtraction (-), multiplication (*), division (/), and modulo (%). The modulo operator (%) gives you the remainder after division. These operations follow standard mathematical order of operations (PEMDAS).",
      code: `# Arithmetic Operations
LET a = 10
LET b = 5

PRINT "Addition: " + (a + b)
PRINT "Subtraction: " + (a - b)
PRINT "Multiplication: " + (a * b)
PRINT "Division: " + (a / b)
PRINT "Modulo: " + (a % b)`,
      output: `Addition: 15
Subtraction: 5
Multiplication: 50
Division: 2
Modulo: 0`
    },
    {
      title: "IF Statements",
      category: "Control Flow",
      difficulty: "Beginner",
      description: "Make decisions with conditional statements",
      explanation: "IF statements let your program make decisions based on conditions. The code inside START: and END: only runs if the condition is true. Use ELSE IF for multiple conditions and ELSE for a default action. Conditions use comparison operators like >=, <=, ==, !=, >, <.",
      code: `# IF Statements
LET age = 25

IF age >= 18:
START:
    PRINT "You are an adult"
END:
ELSE:
START:
    PRINT "You are a minor"
END:

LET score = 85
IF score >= 90:
START:
    PRINT "Grade: A"
END:
ELSE IF score >= 80:
START:
    PRINT "Grade: B"
END:
ELSE:
START:
    PRINT "Grade: C"
END:`,
      output: `You are an adult
Grade: B`
    },
    {
      title: "FOR Loops",
      category: "Control Flow",
      difficulty: "Beginner",
      description: "Repeat code with FOR loops",
      explanation: "Loops let you repeat code multiple times without writing it over and over. The LOOP statement runs code a specific number of times. The variable 'i' automatically counts for you. Use loops for repetitive tasks like counting, processing lists, or generating patterns.",
      code: `# FOR Loops
PRINT "Counting 1 to 5:"
LOOP i = 1 FOR 5 TIMES:
START:
    PRINT "Count: " + i
END:

PRINT "Counting 10 to 1:"
LOOP i = 10 FOR 10 TIMES:
START:
    PRINT i
END:`,
      output: `Counting 1 to 5:
Count: 1
Count: 2
Count: 3
Count: 4
Count: 5
Counting 10 to 1:
10
9
8
7
6
5
4
3
2
1`
    },
    {
      title: "Math Utils Module",
      category: "Modules",
      difficulty: "Intermediate",
      description: "Use the math_utils module for advanced calculations",
      explanation: "The math_utils module provides 40+ mathematical functions built into SUSA. Use it for square roots, factorials, trigonometry, random numbers, and more. All functions are optimized in C++ for maximum performance. Perfect for scientific computing, games, and data analysis.",
      code: `# Math Utils Module
LET sqrt_result = math_utils.sqrt(144)
PRINT "Square root of 144: " + sqrt_result

LET factorial = math_utils.factorial(5)
PRINT "Factorial of 5: " + factorial

LET is_prime = math_utils.is_prime(17)
PRINT "Is 17 prime? " + is_prime

LET random = math_utils.random_int(1, 10)
PRINT "Random number (1-10): " + random`,
      output: `Square root of 144: 12
Factorial of 5: 120
Is 17 prime? true
Random number (1-10): 7`
    },
    {
      title: "String Utils Module",
      category: "Modules",
      difficulty: "Intermediate",
      description: "Manipulate strings with string_utils",
      explanation: "The string_utils module has 30+ functions for text processing. Convert case, reverse strings, split and join text, search for substrings, and more. Essential for handling user input, formatting output, parsing data, and text analysis.",
      code: `# String Utils Module
LET text = "hello world"
LET upper = string_utils.upper(text)
PRINT "Uppercase: " + upper

LET reversed = string_utils.reverse("SUSA")
PRINT "Reversed: " + reversed

LET parts = string_utils.split("a,b,c", ",")
PRINT "Split: " + parts

LET contains = string_utils.contains("test", "es")
PRINT "Contains 'es': " + contains`,
      output: `Uppercase: HELLO WORLD
Reversed: ASUS
Split: [a, b, c]
Contains 'es': true`
    },
    {
      title: "Array Utils Module",
      category: "Modules",
      difficulty: "Intermediate",
      description: "Work with arrays using array_utils",
      explanation: "The array_utils module provides 50+ functions for working with lists and arrays. Calculate statistics (sum, average, min, max), sort data, filter elements, and transform arrays. Perfect for data processing, algorithms, and collection management.",
      code: `# Array Utils Module
LET numbers = [5, 2, 8, 1, 9, 3]

LET sum = array_utils.sum(numbers)
PRINT "Sum: " + sum

LET avg = array_utils.average(numbers)
PRINT "Average: " + avg

LET max = array_utils.max(numbers)
PRINT "Max: " + max

LET sorted = array_utils.sort(numbers)
PRINT "Sorted: " + sorted`,
      output: `Sum: 28
Average: 4.666667
Max: 9
Sorted: [1, 2, 3, 5, 8, 9]`
    },
    {
      title: "File Operations",
      category: "Modules",
      difficulty: "Intermediate",
      description: "Read and write files with file_utils",
      explanation: "The file_utils module lets you work with files and directories. Read and write text files, check if files exist, delete files, and manage your file system. Essential for saving data, loading configuration, processing files, and building file-based applications.",
      code: `# File Utils Module
LET success = file_utils.write_file("test.txt", "Hello SUSA!")
PRINT "File written: " + success

LET exists = file_utils.exists("test.txt")
PRINT "File exists: " + exists

LET content = file_utils.read_file("test.txt")
PRINT "Content: " + content

LET deleted = file_utils.delete_file("test.txt")
PRINT "File deleted: " + deleted`,
      output: `File written: true
File exists: true
Content: Hello SUSA!
File deleted: true`
    },
    {
      title: "DateTime Operations",
      category: "Modules",
      difficulty: "Intermediate",
      description: "Work with dates and times",
      explanation: "The datetime_utils module provides 35+ functions for working with dates and times. Get current date/time, format dates, calculate time differences, check leap years, and more. Perfect for scheduling, time tracking, logging, and any time-based operations.",
      code: `# DateTime Utils Module
LET now = datetime_utils.now()
PRINT "Current time: " + now

LET today = datetime_utils.today()
PRINT "Today: " + today

LET year = datetime_utils.get_year()
PRINT "Year: " + year

LET day_name = datetime_utils.get_day_name()
PRINT "Day: " + day_name

LET is_leap = datetime_utils.is_leap_year(2024)
PRINT "Is 2024 leap year? " + is_leap`,
      output: `Current time: 2026-02-12 18:30:45
Today: 2026-02-12
Year: 2026
Day: Thursday
Is 2024 leap year? true`
    },
    {
      title: "Data Structures",
      category: "Advanced",
      difficulty: "Advanced",
      description: "Use stacks and queues",
      explanation: "The data_structures module provides implementations of common data structures like stacks, queues, trees, and graphs. Stacks follow LIFO (Last In First Out) - like a stack of plates. Queues follow FIFO (First In First Out) - like a line of people. These are fundamental for algorithms and complex programs.",
      code: `# Data Structures Module
LET stack = data_structures.stack_create()
LET stack = data_structures.stack_push(stack, 10)
LET stack = data_structures.stack_push(stack, 20)
LET stack = data_structures.stack_push(stack, 30)

LET size = data_structures.stack_size(stack)
PRINT "Stack size: " + size

LET top = data_structures.stack_peek(stack)
PRINT "Top element: " + top

LET stack = data_structures.stack_pop(stack)
LET new_top = data_structures.stack_peek(stack)
PRINT "After pop, top: " + new_top`,
      output: `Stack size: 3
Top element: 30
After pop, top: 20`
    },
    {
      title: "Sorting Algorithms",
      category: "Advanced",
      difficulty: "Advanced",
      description: "Sort arrays with different algorithms",
      explanation: "The algorithms module includes 35+ functions for sorting, searching, and graph algorithms. Quick sort is one of the fastest sorting algorithms, using a divide-and-conquer approach. Understanding algorithms helps you write efficient code and solve complex problems.",
      code: `# Algorithms Module
LET data = [5, 2, 8, 1, 9, 3, 7, 4, 6]
PRINT "Original: " + data

LET sorted = algorithms.quick_sort(data)
PRINT "Quick sorted: " + sorted

LET is_sorted = algorithms.is_sorted(sorted)
PRINT "Is sorted? " + is_sorted

LET median = algorithms.median([10, 20, 30, 40, 50])
PRINT "Median: " + median

LET is_palindrome = algorithms.is_palindrome("racecar")
PRINT "Is 'racecar' palindrome? " + is_palindrome`,
      output: `Original: [5, 2, 8, 1, 9, 3, 7, 4, 6]
Quick sorted: [1, 2, 3, 4, 5, 6, 7, 8, 9]
Is sorted? true
Median: 30
Is 'racecar' palindrome? true`
    }
  ];

  const categories = ["All", "Basics", "Control Flow", "Modules", "Advanced"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredExamples = examples.filter(example => {
    const matchesSearch = example.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      example.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || example.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  const runCode = () => {
    toast.info("Open SUSA IDE to run this code!");
  };

  return (
    <div className="h-screen overflow-y-auto bg-background text-foreground transition-colors duration-500">
      {/* Header */}
      <header className="border-b border-primary/20 bg-background/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" state={{ fromPage: 'examples' }} className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Home</span>
            </Link>
            <div className="flex items-center gap-2">
              <FileCode className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">SUSA Examples</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Learn by Example
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Explore {examples.length} practical examples covering everything from basics to advanced topics.
          </p>

          {/* Search and Filter */}
          <div className="max-w-2xl mx-auto">
            <div className="relative mb-4">
              <Input
                type="text"
                placeholder="Search examples..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[hsl(220,18%,8%,0.5)] border-[hsl(190,90%,50%,0.2)] text-white placeholder-gray-400 focus:border-blue-500"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category
                    ? "bg-[hsl(190,90%,50%)] hover:bg-blue-600 text-white"
                    : "border-[hsl(190,90%,50%,0.3)] text-[hsl(220,10%,70%)] hover:text-white hover:bg-[hsl(190,90%,50%)]/20"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Examples List */}
          <div className="lg:col-span-1">
            <div className="bg-[hsl(220,18%,8%,0.5)] backdrop-blur-sm border border-[hsl(190,90%,50%,0.2)] rounded-lg p-4 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <h3 className="text-lg font-semibold text-[hsl(190,90%,50%)] mb-4">Examples ({filteredExamples.length})</h3>
              <div className="space-y-2">
                {filteredExamples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedExample(examples.indexOf(example))}
                    className={`w-full text-left p-3 rounded-lg transition-all ${selectedExample === examples.indexOf(example)
                      ? 'bg-[hsl(190,90%,50%)] text-white'
                      : 'bg-gray-800/50 text-[hsl(220,10%,70%)] hover:bg-[hsl(220,18%,12%)] hover:text-white'
                      }`}
                  >
                    <div className="font-medium text-sm">{example.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`text-xs ${example.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                        example.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                        {example.difficulty}
                      </Badge>
                      <span className="text-xs text-[hsl(220,10%,60%)]">{example.category}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Example Detail */}
          <div className="lg:col-span-2">
            <Card className="bg-[hsl(220,18%,8%,0.5)] backdrop-blur-sm border-[hsl(190,90%,50%,0.2)]">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl text-white mb-2">
                      {examples[selectedExample].title}
                    </CardTitle>
                    <p className="text-[hsl(220,10%,60%)] mb-3">{examples[selectedExample].description}</p>
                    {examples[selectedExample].explanation && (
                      <div className="bg-[hsl(190,90%,50%)]/10 border border-[hsl(190,90%,50%,0.2)] rounded-lg p-4 mt-3">
                        <p className="text-[hsl(220,10%,80%)] text-sm leading-relaxed">
                          <span className="text-[hsl(190,90%,50%)] font-semibold">💡 What you'll learn: </span>
                          {examples[selectedExample].explanation}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Badge className={`${examples[selectedExample].difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      examples[selectedExample].difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                        'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}>
                      {examples[selectedExample].difficulty}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="code" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-800/50">
                    <TabsTrigger value="code" className="text-white data-[state=active]:bg-[hsl(190,90%,50%)]">
                      <Code className="w-4 h-4 mr-2" />
                      Code
                    </TabsTrigger>
                    <TabsTrigger value="output" className="text-white data-[state=active]:bg-[hsl(190,90%,50%)]">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Output
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="code" className="space-y-4">
                    <div className="relative">
                      <pre className="bg-black/50 border border-[hsl(190,90%,50%,0.3)] rounded-lg p-4 text-sm text-[hsl(190,90%,60%)] overflow-x-auto max-h-96">
                        <code>{examples[selectedExample].code}</code>
                      </pre>
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[hsl(190,90%,50%,0.3)] text-[hsl(220,10%,70%)] hover:text-white hover:bg-[hsl(190,90%,50%)]/20"
                          onClick={() => copyCode(examples[selectedExample].code)}
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </Button>
                        <Button
                          size="sm"
                          className="bg-[hsl(190,90%,50%)] hover:bg-blue-600 text-white"
                          onClick={runCode}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Run
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="output">
                    <div className="bg-black/50 border border-[hsl(190,90%,50%,0.3)] rounded-lg p-4">
                      <pre className="text-sm text-green-400 whitespace-pre-wrap">
                        {examples[selectedExample].output}
                      </pre>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 bg-[hsl(190,90%,50%)]/10 border border-[hsl(190,90%,50%,0.3)] rounded-lg p-4">
                  <div className="flex items-center gap-2 text-[hsl(190,90%,60%)] mb-2">
                    <Zap className="w-5 h-5" />
                    <span className="font-semibold">Try it yourself!</span>
                  </div>
                  <p className="text-[hsl(220,10%,60%)] text-sm">
                    Copy this code and run it in the SUSA IDE or save it as a .susa file and run with: <code className="bg-gray-800 px-2 py-1 rounded">susa run example.susa</code>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Examples;

