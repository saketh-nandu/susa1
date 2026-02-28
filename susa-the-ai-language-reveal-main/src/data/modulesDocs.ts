// Module documentation data
export interface ModuleFunction {
  name: string;
  description: string;
  parameters: string;
  returns: string;
  example: string;
}

export interface ModuleDoc {
  name: string;
  displayName: string;
  version: string;
  description: string;
  category: string;
  functions: number;
  performance: string;
  overview: string;
  importExample: string;
  quickFunctions: string[];
  detailedFunctions: ModuleFunction[];
  completeExample: string;
  relatedModules: string[];
}

export const modulesDocs: Record<string, ModuleDoc> = {
  math_utils: {
    name: "math_utils",
    displayName: "Math Utils",
    version: "1.0.0",
    description: "Comprehensive mathematical operations for scientific computing, data analysis, game development, and general-purpose calculations",
    category: "Core",
    functions: 40,
    performance: "100x faster",
    overview: `The Math Utils module is your complete mathematical toolkit for SUSA programming. It provides 40 optimized functions covering everything from basic arithmetic to advanced mathematical operations.

**What's Included:**
• Basic Arithmetic: Square roots, powers, absolute values, min/max operations
• Trigonometry: All standard trig functions (sin, cos, tan) and their inverses
• Logarithms: Natural log, base-10 log, base-2 log, and exponential functions
• Rounding: Ceiling, floor, round, and truncate operations
• Advanced Math: Factorials, GCD, LCM, prime number checking
• Random Numbers: Generate random floats and integers
• Angle Conversion: Convert between degrees and radians
• Utilities: Clamp values, linear interpolation (lerp)

**Mathematical Constants:**
After adding this module, you get instant access to three important mathematical constants:
• PI (π) = 3.14159265358979... - The ratio of a circle's circumference to its diameter
• E (e) = 2.71828182845904... - Euler's number, the base of natural logarithms
• GOLDEN_RATIO (φ) = 1.61803398874989... - The golden ratio found in nature and art

**Performance:**
All functions are implemented in optimized C++ code, making them 100x faster than equivalent pure SUSA implementations. Perfect for computationally intensive tasks like physics simulations, data analysis, and real-time calculations.

**Common Use Cases:**
• Game Development: Calculate positions, rotations, physics, collision detection
• Data Science: Statistical analysis, averages, standard deviations, data normalization
• Graphics Programming: Coordinate transformations, rotations, scaling, projections
• Simulations: Random events, probability distributions, Monte Carlo methods
• Engineering: Scientific calculations, unit conversions, formula implementations
• Finance: Compound interest calculations, growth rates, financial modeling
• Education: Teaching mathematics, creating math problems, visualizing concepts`,
    importExample: `ADD math_utils`,
    quickFunctions: ["sqrt", "pow", "abs", "round", "sin", "cos", "tan", "factorial", "gcd", "lcm", "is_prime", "random"],
    detailedFunctions: [
      {
        name: "sqrt(x)",
        description: "Calculate the square root of a number. Essential for distance calculations, physics simulations, and statistical operations. The square root of a number x is a value that, when multiplied by itself, gives x.",
        parameters: "x (Number) - The number to calculate square root of. Must be non-negative (>= 0). Negative numbers will cause an error.",
        returns: "Number - The square root of x. For example, sqrt(16) returns 4 because 4 × 4 = 16.",
        example: `ADD math_utils

# Basic square root
let result = math_utils.sqrt(16)
PRINT result  # Output: 4

# Calculate distance between two points
# Using Pythagorean theorem: distance = sqrt(dx² + dy²)
let x1 = 0, y1 = 0
let x2 = 3, y2 = 4
let dx = x2 - x1
let dy = y2 - y1
let distance = math_utils.sqrt(dx*dx + dy*dy)
PRINT rt"Distance: {distance}"  # Output: 5`
      },
      {
        name: "pow(base, exponent)",
        description: "Raise a number to a power (exponentiation). This calculates base^exponent. Use this for area calculations, compound interest, exponential growth, and any situation requiring repeated multiplication.",
        parameters: "base (Number) - The base number to be raised\nexponent (Number) - The power to raise the base to. Can be positive, negative, or fractional.",
        returns: "Number - The result of base raised to the exponent power. For example, pow(2, 3) = 2³ = 2×2×2 = 8",
        example: `ADD math_utils

# Calculate area of square
let side = 5
let area = math_utils.pow(side, 2)
PRINT rt"Area: {area}"  # Output: 25

# Calculate volume of cube
let volume = math_utils.pow(side, 3)
PRINT rt"Volume: {volume}"  # Output: 125

# Compound interest: A = P(1 + r)^t
let principal = 1000
let rate = 0.05  # 5% interest
let years = 10
let amount = principal * math_utils.pow(1 + rate, years)
PRINT rt"After {years} years: $" + str(amount)  # Output: $1628.89`
      },
      {
        name: "abs(x)",
        description: "Get the absolute value (magnitude) of a number, removing any negative sign. This is useful for calculating distances, differences, error margins, and any situation where you need the size of a number regardless of direction.",
        parameters: "x (Number) - Any number (positive, negative, or zero)",
        returns: "Number - The absolute value of x. Always returns a non-negative number. abs(-5) = 5, abs(5) = 5, abs(0) = 0",
        example: `ADD math_utils

# Calculate temperature difference
let temp1 = 25
let temp2 = 15
let difference = math_utils.abs(temp1 - temp2)
PRINT rt"Temperature difference: {difference}°C"  # Output: 10°C

# Calculate error margin
let expected = 100
let actual = 95
let error = math_utils.abs(expected - actual)
let error_percent = (error / expected) * 100
PRINT rt"Error: {error_percent}%"  # Output: 5%`
      },
      {
        name: "round(x), ceil(x), floor(x)",
        description: "Rounding functions for converting decimal numbers to integers. round() rounds to nearest integer, ceil() always rounds up, floor() always rounds down. Use these for displaying whole numbers, pagination, grid positioning, and discrete calculations.",
        parameters: "x (Number) - The decimal number to round",
        returns: "Number - The rounded integer value",
        example: `ADD math_utils

let price = 19.99

# Round to nearest integer
PRINT math_utils.round(price)  # Output: 20

# Always round up (ceiling)
PRINT math_utils.ceil(price)   # Output: 20

# Always round down (floor)
PRINT math_utils.floor(price)  # Output: 19

# Pagination example
let total_items = 47
let items_per_page = 10
let total_pages = math_utils.ceil(total_items / items_per_page)
PRINT rt"Total pages: {total_pages}"  # Output: 5`
      },
      {
        name: "sin(x), cos(x), tan(x)",
        description: "Trigonometric functions for working with angles and circular motion. sin() returns the vertical component, cos() returns the horizontal component, and tan() returns the slope. Essential for game development, physics, graphics, and any circular or wave-based calculations. IMPORTANT: These functions use RADIANS, not degrees. Use math_utils.radians() to convert degrees to radians.",
        parameters: "x (Number) - Angle in RADIANS (not degrees). To convert degrees to radians: radians = degrees × (PI / 180)",
        returns: "Number - The trigonometric value, ranging from -1 to 1 for sin and cos",
        example: `ADD math_utils

# Calculate position on unit circle
let angle_degrees = 45
let angle_radians = math_utils.radians(angle_degrees)

let x = math_utils.cos(angle_radians)
let y = math_utils.sin(angle_radians)
PRINT rt"Position at {angle_degrees}°: ({x}, {y})"

# Create circular motion for game object
let time = 0
let radius = 100
LOOP i = 0 FOR 360 TIMES: START:
    let angle = math_utils.radians(i)
    let pos_x = radius * math_utils.cos(angle)
    let pos_y = radius * math_utils.sin(angle)
    # Move object to (pos_x, pos_y)
END:

# Calculate wave pattern
let amplitude = 10
let frequency = 2
let wave_value = amplitude * math_utils.sin(frequency * time)
PRINT rt"Wave: {wave_value}"`
      },
      {
        name: "factorial(n)",
        description: "Calculate the factorial of a number (n!). The factorial is the product of all positive integers up to n. For example, 5! = 5×4×3×2×1 = 120. Used in combinatorics, probability calculations, permutations, and mathematical formulas.",
        parameters: "n (Number) - A non-negative integer (0, 1, 2, 3, ...). Must be >= 0. Large values (n > 20) may cause overflow.",
        returns: "Number - The factorial of n. Special case: 0! = 1 by definition.",
        example: `ADD math_utils

# Calculate permutations
# How many ways to arrange 5 items?
let items = 5
let arrangements = math_utils.factorial(items)
PRINT rt"{items} items can be arranged in {arrangements} ways"  # Output: 120

# Calculate combinations: C(n,r) = n! / (r! × (n-r)!)
let n = 10  # Total items
let r = 3   # Items to choose
let combinations = math_utils.factorial(n) / (math_utils.factorial(r) * math_utils.factorial(n - r))
PRINT rt"Choose {r} from {n}: {combinations} ways"  # Output: 120`
      },
      {
        name: "is_prime(n)",
        description: "Check if a number is prime. A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself. Examples: 2, 3, 5, 7, 11, 13, 17, 19, 23... Used in cryptography, number theory, and optimization algorithms.",
        parameters: "n (Number) - The integer to check. Should be a positive integer >= 2.",
        returns: "Boolean - true if n is prime, false otherwise. Returns false for numbers less than 2.",
        example: `ADD math_utils

# Check if number is prime
PRINT math_utils.is_prime(17)  # Output: true
PRINT math_utils.is_prime(18)  # Output: false

# Find all prime numbers up to 50
PRINT "Prime numbers up to 50:"
LOOP i = 2 FOR 49 TIMES: START:
    IF math_utils.is_prime(i): START:
        PRINT rt"{i} "
    END:
END:

# Prime number generator for cryptography
let candidate = 97
IF math_utils.is_prime(candidate): START:
    PRINT rt"{candidate} is suitable for cryptographic use"
END:`
      },
      {
        name: "gcd(a, b) and lcm(a, b)",
        description: "GCD (Greatest Common Divisor) finds the largest number that divides both inputs. LCM (Least Common Multiple) finds the smallest number that both inputs divide into. Used for simplifying fractions, finding common factors, synchronizing cycles, and scheduling problems.",
        parameters: "a, b (Number) - Two integers to find GCD or LCM of",
        returns: "Number - The GCD or LCM of the two numbers",
        example: `ADD math_utils

# Simplify a fraction
let numerator = 48
let denominator = 18
let divisor = math_utils.gcd(numerator, denominator)
let simplified_num = numerator / divisor
let simplified_den = denominator / divisor
PRINT rt"{numerator}/{denominator} = {simplified_num}/{simplified_den}"  # Output: 48/18 = 8/3

# Find when two events synchronize
let event1_interval = 12  # Every 12 seconds
let event2_interval = 18  # Every 18 seconds
let sync_time = math_utils.lcm(event1_interval, event2_interval)
PRINT rt"Events sync every {sync_time} seconds"  # Output: 36`
      },
      {
        name: "random() and random_int(min, max)",
        description: "Generate random numbers. random() returns a decimal between 0 and 1. random_int(min, max) returns a random integer between min and max (inclusive). Perfect for games, simulations, random sampling, and adding unpredictability to your programs.",
        parameters: "For random(): None\nFor random_int(): min (Number) - Minimum value (inclusive), max (Number) - Maximum value (inclusive)",
        returns: "random(): Number between 0.0 and 1.0 (exclusive of 1.0)\nrandom_int(): Integer between min and max (both inclusive)",
        example: `ADD math_utils

# Simulate dice roll
let dice = math_utils.random_int(1, 6)
PRINT rt"You rolled: {dice}"

# Random probability check
let hit_chance = 0.75  # 75% chance
IF math_utils.random() < hit_chance: START:
    PRINT "Hit!"
ELSE: START:
    PRINT "Miss!"
END:

# Generate random password character
let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
let random_index = math_utils.random_int(0, 35)
# Get character at random_index

# Shuffle algorithm (Fisher-Yates)
let deck = [1, 2, 3, 4, 5]
LOOP i = 4 FOR 0 STEP -1: START:
    let j = math_utils.random_int(0, i)
    # Swap deck[i] and deck[j]
END:`
      }
    ],
    completeExample: `ADD math_utils

# ============================================
# COMPREHENSIVE MATH UTILS DEMONSTRATION
# ============================================

PRINT "=== SUSA Math Utils Module ==="
PRINT ""

# Mathematical Constants
PRINT "Mathematical Constants:"
PRINT rt"  PI = {PI}"
PRINT rt"  E = {E}"
PRINT rt"  Golden Ratio = {GOLDEN_RATIO}"
PRINT ""

# Basic Arithmetic
PRINT "Basic Arithmetic:"
let num = -15.7
PRINT rt"  Absolute value of {num}: {math_utils.abs(num)}"
PRINT rt"  Rounded: {math_utils.round(num)}"
PRINT rt"  Ceiling: {math_utils.ceil(num)}"
PRINT rt"  Floor: {math_utils.floor(num)}"
PRINT rt"  Square root of 144: {math_utils.sqrt(144)}"
PRINT rt"  2 to the power of 8: {math_utils.pow(2, 8)}"
PRINT ""

# Trigonometry
PRINT "Trigonometry:"
let angle_45 = PI / 4
PRINT rt"  sin(45°) = {math_utils.sin(angle_45)}"
PRINT rt"  cos(45°) = {math_utils.cos(angle_45)}"
PRINT rt"  tan(45°) = {math_utils.tan(angle_45)}"
PRINT ""

# Advanced Mathematics
PRINT "Advanced Math:"
PRINT rt"  5! (factorial) = {math_utils.factorial(5)}"
PRINT rt"  Is 17 prime? {math_utils.is_prime(17)}"
PRINT rt"  Is 18 prime? {math_utils.is_prime(18)}"
PRINT rt"  GCD(48, 18) = {math_utils.gcd(48, 18)}"
PRINT rt"  LCM(12, 18) = {math_utils.lcm(12, 18)}"
PRINT ""

# Random Numbers
PRINT "Random Numbers:"
PRINT rt"  Random float (0-1): {math_utils.random()}"
PRINT rt"  Random dice roll (1-6): {math_utils.random_int(1, 6)}"
PRINT rt"  Random number (1-100): {math_utils.random_int(1, 100)}"
PRINT ""

# Practical Example: Calculate Circle Properties
PRINT "Practical Example - Circle Calculations:"
let radius = 5
let area = PI * math_utils.pow(radius, 2)
let circumference = 2 * PI * radius
PRINT rt"  Radius: {radius}"
PRINT rt"  Area: {area}"
PRINT rt"  Circumference: {circumference}"`,
    relatedModules: ["array_utils", "algorithms"]
  },

  string_utils: {
    name: "string_utils",
    displayName: "String Utils",
    version: "1.0.0",
    description: "Comprehensive string manipulation and text processing for handling user input, formatting output, parsing data, and text analysis",
    category: "Core",
    functions: 18,
    performance: "30x faster",
    overview: `The String Utils module is your complete text processing toolkit for SUSA programming. It provides 18 optimized functions for manipulating, searching, and transforming strings.

**What's Included:**
• Case Conversion: Convert between uppercase, lowercase, title case, and capitalized text
• Whitespace Handling: Trim, strip, and clean whitespace from strings
• String Searching: Find substrings, check prefixes/suffixes, count occurrences
• String Transformation: Reverse, repeat, and replace text
• Splitting & Joining: Parse CSV data, split sentences, combine arrays into strings
• String Padding: Align text, format numbers, create fixed-width columns
• Length Measurement: Get string and array lengths

**Performance:**
All functions are implemented in optimized C++ code, making them 30x faster than equivalent pure SUSA implementations. Perfect for processing large text files, handling user input, and real-time text manipulation.

**Common Use Cases:**
• Data Validation: Clean and validate user input (emails, names, phone numbers)
• Text Parsing: Parse CSV files, log files, configuration files, structured data
• Output Formatting: Create tables, reports, formatted displays, aligned columns
• File Operations: Build file paths, check extensions, parse filenames
• Text Processing: Search and replace, word counting, text analysis, pattern matching
• User Interface: Format prompts, create menus, display messages, build dialogs
• Data Cleaning: Remove whitespace, normalize case, standardize formats

**Important Notes:**
• String operations create new strings; original strings are never modified
• Index positions start at 0 (first character is at index 0)
• Functions are case-sensitive by default; use upper() or lower() for case-insensitive operations
• Empty strings are valid and have length 0`,
    importExample: `ADD string_utils`,
    quickFunctions: ["upper", "lower", "capitalize", "title", "strip", "split", "join", "replace", "contains", "startswith", "endswith"],
    detailedFunctions: [
      {
        name: "upper(str) and lower(str)",
        description: "Convert string to UPPERCASE or lowercase. upper() converts all letters to capitals, lower() converts all to lowercase. Essential for normalizing user input, creating case-insensitive comparisons, formatting constants and headers, and standardizing data.",
        parameters: "str (String) - The string to convert. Can contain letters, numbers, spaces, and special characters. Only letters are affected.",
        returns: "String - A new string with all letters converted to the specified case. Numbers and special characters remain unchanged.",
        example: `ADD string_utils

# Normalize user input for comparison
let user_input = "Yes"
IF string_utils.upper(user_input) == "YES": START:
    PRINT "User confirmed!"
END:

# Create URL-friendly slugs
let title = "Hello World from SUSA"
let slug = string_utils.lower(title)
PRINT slug  # Output: "hello world from susa"

# Format constants
let api_key = "abc123xyz"
let formatted_key = string_utils.upper(api_key)
PRINT formatted_key  # Output: "ABC123XYZ"`
      },
      {
        name: "capitalize(str) and title(str)",
        description: "capitalize() makes only the first letter uppercase, rest unchanged. title() capitalizes the first letter of EVERY word. Use capitalize() for sentences and names, title() for book titles, headers, and proper nouns.",
        parameters: "str (String) - The string to capitalize",
        returns: "String - A new string with appropriate capitalization applied",
        example: `ADD string_utils

# Format user name
let name = "john doe"
let proper_name = string_utils.title(name)
PRINT proper_name  # Output: "John Doe"

# Format sentence
let sentence = "hello world"
let formatted = string_utils.capitalize(sentence)
PRINT formatted  # Output: "Hello world"

# Format book title
let book = "the great gatsby"
let title = string_utils.title(book)
PRINT title  # Output: "The Great Gatsby"`
      },
      {
        name: "strip(str), lstrip(str), rstrip(str)",
        description: "Remove whitespace from strings. strip() removes from both ends, lstrip() removes from left (start), rstrip() removes from right (end). Whitespace includes spaces, tabs (\\t), newlines (\\n), and carriage returns (\\r). Essential for cleaning user input from forms and files.",
        parameters: "str (String) - The string to clean. Can contain any characters.",
        returns: "String - A new string with whitespace removed from the specified end(s)",
        example: `ADD string_utils

# Clean user input from form
let user_email = "  user@example.com  \\n"
let cleaned = string_utils.strip(user_email)
PRINT rt"Cleaned: '{cleaned}'"  # Output: 'user@example.com'

# Remove indentation
let code_line = "    let x = 10"
let no_indent = string_utils.lstrip(code_line)
PRINT rt"'{no_indent}'"  # Output: 'let x = 10'

# Remove trailing newlines from file
let file_line = "Hello World\\n\\n"
let clean_line = string_utils.rstrip(file_line)
PRINT rt"'{clean_line}'"  # Output: 'Hello World'`
      },
      {
        name: "split(str, delimiter)",
        description: "Split a string into an array of substrings using a delimiter. The delimiter is removed from the result. Perfect for parsing CSV files, splitting sentences into words, parsing command-line arguments, and breaking structured data into parts. If delimiter is not found, returns array with original string.",
        parameters: "str (String) - The string to split\ndelimiter (String) - The separator to split on. Can be any string (comma, space, newline, etc.)",
        returns: "Array - An array of substrings. Empty strings are included if delimiter appears consecutively.",
        example: `ADD string_utils

# Parse CSV data
let csv_line = "John,Doe,30,Engineer"
let fields = string_utils.split(csv_line, ",")
PRINT rt"First name: {fields[0]}"  # Output: John
PRINT rt"Last name: {fields[1]}"   # Output: Doe
PRINT rt"Age: {fields[2]}"         # Output: 30
PRINT rt"Job: {fields[3]}"         # Output: Engineer

# Split sentence into words
let sentence = "The quick brown fox"
let words = string_utils.split(sentence, " ")
PRINT rt"Word count: {string_utils.len(words)}"  # Output: 4

# Parse file path
let path = "C:\\\\Users\\\\Documents\\\\file.txt"
let parts = string_utils.split(path, "\\\\")
let filename = parts[string_utils.len(parts) - 1]
PRINT rt"Filename: {filename}"  # Output: file.txt`
      },
      {
        name: "join(array, delimiter)",
        description: "Combine an array of strings into a single string with a delimiter between each element. The opposite of split(). Use this to build file paths, create URLs, format lists, combine words into sentences, and construct structured data strings.",
        parameters: "array (Array) - Array of strings to join. Non-string elements will be converted to strings.\ndelimiter (String) - The separator to place between elements",
        returns: "String - A single string with all array elements joined by the delimiter",
        example: `ADD string_utils

# Build file path
let path_parts = ["C:", "Users", "Documents", "file.txt"]
let full_path = string_utils.join(path_parts, "\\\\")
PRINT full_path  # Output: C:\\Users\\Documents\\file.txt

# Create CSV line
let data = ["Alice", "25", "Engineer"]
let csv = string_utils.join(data, ",")
PRINT csv  # Output: Alice,25,Engineer

# Format list for display
let items = ["apples", "bananas", "oranges"]
let list_text = string_utils.join(items, ", ")
PRINT rt"Shopping list: {list_text}"  # Output: apples, bananas, oranges`
      },
      {
        name: "contains(str, substring)",
        description: "Check if a string contains a substring anywhere within it. Case-sensitive search. Returns true if found, false otherwise. Use this for validation (checking for @ in emails), keyword searching, pattern detection, and filtering data.",
        parameters: "str (String) - The string to search in\nsubstring (String) - The text to search for",
        returns: "Boolean - true if substring is found anywhere in str, false otherwise",
        example: `ADD string_utils

# Validate email format
let email = "user@example.com"
let has_at = string_utils.contains(email, "@")
let has_dot = string_utils.contains(email, ".")
IF has_at AND has_dot: START:
    PRINT "Valid email format"
END:

# Check for keywords
let text = "This is a SUSA programming tutorial"
IF string_utils.contains(text, "SUSA"): START:
    PRINT "This is about SUSA!"
END:

# Filter files
let filename = "report_2024.pdf"
IF string_utils.contains(filename, "2024"): START:
    PRINT "This is a 2024 file"
END:`
      },
      {
        name: "startswith(str, prefix) and endswith(str, suffix)",
        description: "Check if a string starts with a specific prefix or ends with a specific suffix. Case-sensitive. Use startswith() to check file types, validate prefixes, detect protocols (http://, https://). Use endswith() to check file extensions, validate suffixes, detect line endings.",
        parameters: "str (String) - The string to check\nprefix/suffix (String) - The text to look for at the start/end",
        returns: "Boolean - true if string starts/ends with the specified text, false otherwise",
        example: `ADD string_utils

# Check file extension
let filename = "document.pdf"
IF string_utils.endswith(filename, ".pdf"): START:
    PRINT "This is a PDF file"
ELIF string_utils.endswith(filename, ".txt"): START:
    PRINT "This is a text file"
END:

# Validate URL protocol
let url = "https://example.com"
IF string_utils.startswith(url, "https://"): START:
    PRINT "Secure connection"
ELIF string_utils.startswith(url, "http://"): START:
    PRINT "Insecure connection"
END:

# Check command prefix
let command = "/help"
IF string_utils.startswith(command, "/"): START:
    PRINT "This is a command"
END:`
      },
      {
        name: "replace(str, old, new)",
        description: "Replace ALL occurrences of a substring with another string. Case-sensitive. Creates a new string with replacements applied. Use this for find-and-replace operations, template substitution, text cleanup, and data transformation. If old substring is not found, returns original string unchanged.",
        parameters: "str (String) - The original string\nold (String) - The substring to find and replace\nnew (String) - The replacement text",
        returns: "String - A new string with all occurrences of old replaced with new",
        example: `ADD string_utils

# Template substitution
let template = "Hello {name}, welcome to {place}!"
let message = string_utils.replace(template, "{name}", "Alice")
message = string_utils.replace(message, "{place}", "SUSA")
PRINT message  # Output: Hello Alice, welcome to SUSA!

# Clean data
let text = "Hello  World  with  spaces"
let cleaned = string_utils.replace(text, "  ", " ")
PRINT cleaned  # Output: Hello World with spaces

# Censor words
let comment = "This is bad and bad again"
let censored = string_utils.replace(comment, "bad", "***")
PRINT censored  # Output: This is *** and *** again`
      },
      {
        name: "reverse(str) and repeat(str, times)",
        description: "reverse() flips the string backwards. repeat() duplicates the string multiple times. Use reverse() for palindrome checking, text effects, puzzles. Use repeat() for creating separators, patterns, decorative elements, and repeated text.",
        parameters: "For reverse(): str (String) - String to reverse\nFor repeat(): str (String) - String to repeat, times (Number) - How many times to repeat",
        returns: "String - The reversed or repeated string",
        example: `ADD string_utils

# Check palindrome
let word = "racecar"
let reversed = string_utils.reverse(word)
IF word == reversed: START:
    PRINT rt"{word} is a palindrome!"
END:

# Create separator line
let separator = string_utils.repeat("=", 50)
PRINT separator
PRINT "TITLE"
PRINT separator

# Create pattern
let pattern = string_utils.repeat("*-", 10)
PRINT pattern  # Output: *-*-*-*-*-*-*-*-*-*-

# Repeat text
let laugh = string_utils.repeat("Ha", 5)
PRINT laugh  # Output: HaHaHaHaHa`
      },
      {
        name: "pad_left(str, width, fill) and pad_right(str, width, fill)",
        description: "Add padding characters to reach a target width. pad_left() adds to the left (right-aligns text), pad_right() adds to the right (left-aligns text). Use for formatting tables, aligning columns, creating fixed-width output, formatting numbers with leading zeros.",
        parameters: "str (String) - The string to pad\nwidth (Number) - Target width (total length after padding)\nfill (String) - Character to use for padding (usually space or zero)",
        returns: "String - The padded string. If string is already >= width, returns original string.",
        example: `ADD string_utils

# Format numbers with leading zeros
let id = "42"
let padded_id = string_utils.pad_left(id, 5, "0")
PRINT padded_id  # Output: 00042

# Create aligned table
let name1 = "Alice"
let name2 = "Bob"
let name3 = "Carol"
PRINT string_utils.pad_right(name1, 20, " ") + "| Age: 25"
PRINT string_utils.pad_right(name2, 20, " ") + "| Age: 30"
PRINT string_utils.pad_right(name3, 20, " ") + "| Age: 28"

# Format currency
let price = "9.99"
let formatted = "$" + string_utils.pad_left(price, 8, " ")
PRINT formatted  # Output: $    9.99`
      }
    ],
    completeExample: `ADD string_utils

# ============================================
# COMPREHENSIVE STRING UTILS DEMONSTRATION
# ============================================

PRINT "=== SUSA String Utils Module ==="
PRINT ""

# Case Conversion
PRINT "Case Conversion:"
let text = "hello world from SUSA"
PRINT rt"  Original: {text}"
PRINT rt"  Uppercase: {string_utils.upper(text)}"
PRINT rt"  Lowercase: {string_utils.lower(text)}"
PRINT rt"  Title Case: {string_utils.title(text)}"
PRINT rt"  Capitalized: {string_utils.capitalize(text)}"
PRINT ""

# Whitespace Handling
PRINT "Whitespace Handling:"
let messy = "   Hello SUSA!   "
PRINT rt"  Original: '{messy}'"
PRINT rt"  Stripped: '{string_utils.strip(messy)}'"
PRINT ""

# String Searching
PRINT "String Searching:"
let email = "user@example.com"
PRINT rt"  Email: {email}"
PRINT rt"  Contains @: {string_utils.contains(email, '@')}"
PRINT rt"  Ends with .com: {string_utils.endswith(email, '.com')}"
PRINT ""

# Splitting and Joining
PRINT "Splitting and Joining:"
let csv = "Alice,25,Engineer"
let fields = string_utils.split(csv, ",")
PRINT rt"  CSV: {csv}"
PRINT rt"  Name: {fields[0]}, Age: {fields[1]}, Job: {fields[2]}"
let rejoined = string_utils.join(fields, " | ")
PRINT rt"  Rejoined: {rejoined}"
PRINT ""

# String Transformation
PRINT "String Transformation:"
let word = "SUSA"
PRINT rt"  Original: {word}"
PRINT rt"  Reversed: {string_utils.reverse(word)}"
PRINT rt"  Repeated 3x: {string_utils.repeat(word, 3)}"
PRINT ""

# Practical Example: Email Validation
PRINT "Email Validation Example:"
let user_email = "  USER@EXAMPLE.COM  "
let cleaned_email = string_utils.strip(user_email)
let normalized_email = string_utils.lower(cleaned_email)
let has_at = string_utils.contains(normalized_email, "@")
let has_dot = string_utils.contains(normalized_email, ".")
PRINT rt"  Input: '{user_email}'"
PRINT rt"  Cleaned: '{normalized_email}'"
PRINT rt"  Valid: {has_at AND has_dot}"`,
    relatedModules: ["array_utils", "file_utils"]
  },

  array_utils: {
    name: "array_utils",
    displayName: "Array Utils",
    version: "1.0.0",
    description: "Comprehensive array and list manipulation for data processing, collection management, functional programming, and algorithm implementation",
    category: "Core",
    functions: 50,
    performance: "50x faster",
    overview: `The Array Utils module is your complete data collection toolkit for SUSA programming. It provides over 50 optimized functions for manipulating, sorting, searching, and transforming arrays and lists.

**What's Included:**
• Basic Operations: push, pop, shift, unshift, length - Add and remove elements
• Array Modification: slice, splice, concat, reverse - Modify and combine arrays
• Sorting & Searching: sort_array, binary_search, find, find_index - Organize and locate data
• Mathematical Operations: sum, average, max, min, product - Calculate statistics
• Functional Programming: map_array, filter_array, reduce, forEach - Transform data functionally
• Set Operations: unique, union, intersection, difference - Work with collections
• Array Transformation: flatten, chunk, zip, partition - Reshape data structures
• Advanced Utilities: group_by, count_by, shuffle, sample - Complex operations

**Performance:**
All functions are implemented in optimized C++ code, making them 50x faster than equivalent pure SUSA implementations. Perfect for processing large datasets, implementing algorithms, and real-time data manipulation.

**Common Use Cases:**
• Data Processing: Clean, filter, and transform datasets for analysis
• Statistics: Calculate averages, sums, min/max values, and other metrics
• Sorting: Organize data for display, searching, or processing
• Searching: Find elements efficiently in collections using various methods
• Deduplication: Remove duplicate values from lists and datasets
• Set Operations: Find unions, intersections, and differences between collections
• Batch Processing: Split data into chunks for parallel or sequential processing
• Functional Programming: Apply map, filter, reduce patterns for data transformation

**Important Notes:**
• Array indices start at 0 (first element is at index 0)
• Many functions return new arrays without modifying the original
• sort_array() sorts in ascending order by default
• binary_search() requires a sorted array to work correctly
• Empty arrays are valid and have length 0`,
    importExample: `ADD array_utils`,
    quickFunctions: ["push", "pop", "sort_array", "filter_array", "map_array", "unique", "flatten", "chunk", "sum", "average", "max", "min"],
    detailedFunctions: [
      {
        name: "push(arr, element) and pop(arr)",
        description: "push() adds an element to the end of an array. pop() removes and returns the last element. These are fundamental operations for building lists dynamically, implementing stacks (LIFO - Last In First Out), managing collections, and processing data sequentially.",
        parameters: "For push(): arr (Array) - The array to modify, element (Any) - The element to add\nFor pop(): arr (Array) - The array to modify",
        returns: "push() returns the modified array. pop() returns the removed element, or null if array is empty.",
        example: `ADD array_utils

# Build a list dynamically
let shopping_cart = []
array_utils.push(shopping_cart, "Apple")
array_utils.push(shopping_cart, "Banana")
array_utils.push(shopping_cart, "Orange")
PRINT shopping_cart  # Output: ["Apple", "Banana", "Orange"]

# Implement stack (LIFO)
let stack = [1, 2, 3]
let last = array_utils.pop(stack)
PRINT rt"Popped: {last}"  # Output: 3
PRINT rt"Stack: {stack}"  # Output: [1, 2]

# Undo operation
let history = ["action1", "action2", "action3"]
let last_action = array_utils.pop(history)
PRINT rt"Undoing: {last_action}"`
      },
      {
        name: "sort_array(arr) and reverse_array(arr)",
        description: "sort_array() arranges elements in ascending order (smallest to largest). reverse_array() flips the array backwards. Use sort_array() to organize data for display, prepare for binary search, or find rankings. Use reverse_array() to get descending order or reverse chronological order.",
        parameters: "arr (Array) - The array to sort or reverse. Can contain numbers or strings.",
        returns: "Array - A new sorted or reversed array. Original array is not modified.",
        example: `ADD array_utils

# Sort numbers
let scores = [85, 92, 78, 95, 88]
let sorted_scores = array_utils.sort_array(scores)
PRINT rt"Sorted: {sorted_scores}"  # Output: [78, 85, 88, 92, 95]

# Get descending order
let descending = array_utils.reverse_array(sorted_scores)
PRINT rt"Descending: {descending}"  # Output: [95, 92, 88, 85, 78]

# Sort strings alphabetically
let names = ["Charlie", "Alice", "Bob"]
let sorted_names = array_utils.sort_array(names)
PRINT sorted_names  # Output: ["Alice", "Bob", "Charlie"]

# Find top 3 scores
let top_3 = array_utils.reverse_array(sorted_scores)
PRINT rt"Top 3: {top_3[0]}, {top_3[1]}, {top_3[2]}"`
      },
      {
        name: "unique(arr)",
        description: "Remove all duplicate values from an array, keeping only the first occurrence of each unique element. Essential for data cleaning, finding distinct values, removing redundant entries, and preparing data for set operations. Preserves the original order of first occurrences.",
        parameters: "arr (Array) - The array that may contain duplicates",
        returns: "Array - A new array with all duplicates removed, containing only unique values",
        example: `ADD array_utils

# Remove duplicate IDs
let user_ids = [101, 102, 101, 103, 102, 104, 101]
let unique_ids = array_utils.unique(user_ids)
PRINT unique_ids  # Output: [101, 102, 103, 104]

# Get unique tags
let tags = ["python", "javascript", "python", "java", "javascript"]
let unique_tags = array_utils.unique(tags)
PRINT unique_tags  # Output: ["python", "javascript", "java"]

# Clean survey responses
let responses = ["yes", "no", "yes", "yes", "no", "maybe", "yes"]
let unique_responses = array_utils.unique(responses)
PRINT rt"Unique responses: {unique_responses}"
PRINT rt"Response types: {array_utils.length(unique_responses)}"`
      },
      {
        name: "sum(arr), average(arr), max(arr), min(arr)",
        description: "Mathematical operations on arrays. sum() adds all elements. average() calculates the mean. max() finds the largest value. min() finds the smallest value. Essential for statistical analysis, data aggregation, finding extremes, and calculating metrics.",
        parameters: "arr (Array) - Array of numbers to calculate on",
        returns: "Number - The calculated result (sum, average, maximum, or minimum)",
        example: `ADD array_utils

# Analyze test scores
let test_scores = [85, 92, 78, 95, 88, 90]

let total = array_utils.sum(test_scores)
PRINT rt"Total points: {total}"  # Output: 528

let avg = array_utils.average(test_scores)
PRINT rt"Class average: {avg}"  # Output: 88

let highest = array_utils.max(test_scores)
PRINT rt"Highest score: {highest}"  # Output: 95

let lowest = array_utils.min(test_scores)
PRINT rt"Lowest score: {lowest}"  # Output: 78

# Calculate grade distribution
let pass_threshold = 80
let passed_count = 0
LOOP i = 0 FOR array_utils.length(test_scores) TIMES: START:
    IF test_scores[i] >= pass_threshold: START:
        passed_count = passed_count + 1
    END:
END:
let pass_rate = (passed_count * 100) / array_utils.length(test_scores)
PRINT rt"Pass rate: {pass_rate}%"`
      },
      {
        name: "filter_array(arr, func)",
        description: "Create a new array containing only elements that pass a test function. The function is called for each element; if it returns true, the element is included. Perfect for selecting subsets of data, removing unwanted items, implementing search filters, and conditional data extraction.",
        parameters: "arr (Array) - The array to filter\nfunc (Function) - A function that takes an element and returns true (keep) or false (remove)",
        returns: "Array - A new array containing only elements where func returned true",
        example: `ADD array_utils

# Filter even numbers
FUNC is_even(x): START:
    RETURN x % 2 == 0
END:

let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
let evens = array_utils.filter_array(numbers, is_even)
PRINT evens  # Output: [2, 4, 6, 8, 10]

# Filter passing grades
FUNC is_passing(score): START:
    RETURN score >= 60
END:

let grades = [45, 78, 92, 55, 88, 67]
let passing = array_utils.filter_array(grades, is_passing)
PRINT rt"Passing grades: {passing}"

# Filter adults
FUNC is_adult(age): START:
    RETURN age >= 18
END:

let ages = [15, 22, 17, 30, 16, 25]
let adults = array_utils.filter_array(ages, is_adult)
PRINT rt"Adult count: {array_utils.length(adults)}"`
      },
      {
        name: "map_array(arr, func)",
        description: "Transform each element in an array by applying a function to it. Creates a new array with the transformed values. Essential for data transformation, unit conversion, applying calculations to all elements, and functional programming patterns.",
        parameters: "arr (Array) - The array to transform\nfunc (Function) - A function that takes an element and returns the transformed value",
        returns: "Array - A new array with each element transformed by the function",
        example: `ADD array_utils

# Double all numbers
FUNC double(x): START:
    RETURN x * 2
END:

let numbers = [1, 2, 3, 4, 5]
let doubled = array_utils.map_array(numbers, double)
PRINT doubled  # Output: [2, 4, 6, 8, 10]

# Convert Celsius to Fahrenheit
FUNC celsius_to_fahrenheit(c): START:
    RETURN (c * 9/5) + 32
END:

let celsius = [0, 10, 20, 30, 40]
let fahrenheit = array_utils.map_array(celsius, celsius_to_fahrenheit)
PRINT fahrenheit  # Output: [32, 50, 68, 86, 104]

# Calculate prices with tax
FUNC add_tax(price): START:
    RETURN price * 1.08  # 8% tax
END:

let prices = [10.00, 25.50, 15.75]
let prices_with_tax = array_utils.map_array(prices, add_tax)
PRINT prices_with_tax`
      },
      {
        name: "flatten(arr) and chunk(arr, size)",
        description: "flatten() converts nested arrays into a single flat array. chunk() splits an array into smaller arrays of specified size. Use flatten() to simplify nested data structures. Use chunk() for pagination, batch processing, and grouping data.",
        parameters: "For flatten(): arr (Array) - Nested array to flatten\nFor chunk(): arr (Array) - Array to split, size (Number) - Size of each chunk",
        returns: "flatten() returns a flat array. chunk() returns an array of arrays (chunks).",
        example: `ADD array_utils

# Flatten nested data
let nested = [[1, 2], [3, 4], [5, 6]]
let flat = array_utils.flatten(nested)
PRINT flat  # Output: [1, 2, 3, 4, 5, 6]

# Merge multiple lists
let list1 = [1, 2, 3]
let list2 = [4, 5, 6]
let list3 = [7, 8, 9]
let all_lists = [list1, list2, list3]
let merged = array_utils.flatten(all_lists)
PRINT merged  # Output: [1, 2, 3, 4, 5, 6, 7, 8, 9]

# Pagination
let items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
let pages = array_utils.chunk(items, 3)
PRINT rt"Page 1: {pages[0]}"  # Output: [1, 2, 3]
PRINT rt"Page 2: {pages[1]}"  # Output: [4, 5, 6]
PRINT rt"Total pages: {array_utils.length(pages)}"

# Batch processing
let data = [1, 2, 3, 4, 5, 6, 7, 8]
let batches = array_utils.chunk(data, 2)
LOOP i = 0 FOR array_utils.length(batches) TIMES: START:
    PRINT rt"Processing batch {i + 1}: {batches[i]}"
END:`
      },
      {
        name: "union(arr1, arr2), intersection(arr1, arr2), difference(arr1, arr2)",
        description: "Set operations on arrays. union() combines both arrays (all unique elements). intersection() finds common elements (present in both). difference() finds elements in first array but not in second. Essential for comparing datasets, finding overlaps, and set-based logic.",
        parameters: "arr1, arr2 (Array) - Two arrays to perform set operation on",
        returns: "Array - Result of the set operation (union, intersection, or difference)",
        example: `ADD array_utils

# Compare user permissions
let user1_perms = ["read", "write", "delete"]
let user2_perms = ["read", "write", "execute"]

# All permissions (union)
let all_perms = array_utils.union(user1_perms, user2_perms)
PRINT rt"All permissions: {all_perms}"
# Output: ["read", "write", "delete", "execute"]

# Common permissions (intersection)
let common_perms = array_utils.intersection(user1_perms, user2_perms)
PRINT rt"Common: {common_perms}"  # Output: ["read", "write"]

# Unique to user1 (difference)
let unique_to_user1 = array_utils.difference(user1_perms, user2_perms)
PRINT rt"Unique to user1: {unique_to_user1}"  # Output: ["delete"]

# Find new items
let old_inventory = [101, 102, 103, 104]
let new_inventory = [103, 104, 105, 106]
let added_items = array_utils.difference(new_inventory, old_inventory)
PRINT rt"New items: {added_items}"  # Output: [105, 106]`
      }
    ],
    completeExample: `ADD array_utils

# ============================================
# COMPREHENSIVE ARRAY UTILS DEMONSTRATION
# ============================================

PRINT "=== SUSA Array Utils Module ==="
PRINT ""

# Basic Operations
PRINT "Basic Operations:"
let numbers = [3, 1, 4, 1, 5, 9, 2, 6]
PRINT rt"  Original: {numbers}"
PRINT rt"  Length: {array_utils.length(numbers)}"
array_utils.push(numbers, 10)
PRINT rt"  After push(10): {numbers}"
let last = array_utils.pop(numbers)
PRINT rt"  Popped: {last}"
PRINT ""

# Sorting and Organizing
PRINT "Sorting:"
let unsorted = [64, 34, 25, 12, 22]
let sorted = array_utils.sort_array(unsorted)
PRINT rt"  Sorted: {sorted}"
let reversed = array_utils.reverse_array(sorted)
PRINT rt"  Reversed: {reversed}"
PRINT ""

# Remove Duplicates
PRINT "Remove Duplicates:"
let with_dupes = [1, 2, 2, 3, 3, 3, 4]
let unique = array_utils.unique(with_dupes)
PRINT rt"  Original: {with_dupes}"
PRINT rt"  Unique: {unique}"
PRINT ""

# Mathematical Operations
PRINT "Statistics:"
let dataset = [10, 20, 30, 40, 50]
PRINT rt"  Data: {dataset}"
PRINT rt"  Sum: {array_utils.sum(dataset)}"
PRINT rt"  Average: {array_utils.average(dataset)}"
PRINT rt"  Max: {array_utils.max(dataset)}"
PRINT rt"  Min: {array_utils.min(dataset)}"
PRINT ""

# Functional Programming
PRINT "Functional Programming:"
FUNC double(x): START:
    RETURN x * 2
END:
FUNC is_even(x): START:
    RETURN x % 2 == 0
END:

let nums = [1, 2, 3, 4, 5]
let doubled = array_utils.map_array(nums, double)
let evens = array_utils.filter_array(nums, is_even)
PRINT rt"  Original: {nums}"
PRINT rt"  Doubled: {doubled}"
PRINT rt"  Evens: {evens}"
PRINT ""

# Array Transformation
PRINT "Transformation:"
let nested = [[1, 2], [3, 4]]
let flat = array_utils.flatten(nested)
PRINT rt"  Flattened: {flat}"
let chunks = array_utils.chunk(flat, 2)
PRINT rt"  Chunked: {chunks}"`,
    relatedModules: ["algorithms", "math_utils"]
  },

  datetime_utils: {
    name: "datetime_utils",
    displayName: "DateTime Utils",
    version: "1.0.0",
    description: "Comprehensive date and time manipulation for scheduling, time tracking, date calculations, and temporal data processing",
    category: "Core",
    functions: 35,
    performance: "40x faster",
    overview: `The DateTime Utils module is your complete time management toolkit for SUSA programming. It provides 35+ optimized functions for working with dates, times, and temporal data.

**What's Included:**
• Current Time Functions: now, today, current_time, timestamp - Get current date/time in various formats
• Date Components: get_year, get_month, get_day, get_hour, get_minute, get_second - Extract specific parts
• Date Formatting: format_date with patterns (%Y, %m, %d, %H, %M, %S) - Create custom date formats
• Date Arithmetic: add_days, add_hours, add_minutes, diff_days, diff_hours - Calculate time differences
• Date Validation: is_leap_year, is_weekend, is_weekday, days_in_month - Validate and check dates
• Day/Month Names: get_day_name, get_month_name, get_yearday - Get human-readable names

**Performance:**
All functions are implemented in optimized C++ code, making them 40x faster than equivalent pure SUSA implementations. Perfect for scheduling systems, time tracking applications, log analysis, and any program requiring date/time operations.

**Common Use Cases:**
• Scheduling Systems: Calculate appointment times, check availability, manage calendars and bookings
• Time Tracking: Log events with timestamps, calculate work hours, track project time
• Age Calculation: Calculate ages from birthdates, check eligibility based on age, validate dates
• Data Analysis: Analyze time-series data, group events by date, find temporal patterns
• Reminders & Notifications: Calculate due dates, check deadlines, send time-based alerts
• Logging: Timestamp log entries, format log files, analyze logs by time period

**Important Notes:**
• All times are in local timezone unless otherwise specified
• Date formats use strftime-style patterns (%Y for year, %m for month, %d for day, etc.)
• Timestamps are Unix time (seconds since January 1, 1970 UTC)
• Leap years are automatically handled in all date calculations`,
    importExample: `ADD datetime_utils`,
    quickFunctions: ["now", "today", "format_date", "add_days", "diff_days", "is_leap_year", "get_day_name"],
    detailedFunctions: [
      {
        name: "now(), today(), current_time()",
        description: "Get the current date and time in different formats. now() returns full date and time with seconds. today() returns only the date. current_time() returns only the time. Essential for timestamping events, logging activities, scheduling tasks, and any operation requiring the current moment.",
        parameters: "None - These functions take no parameters and always return the current local time",
        returns: "now() returns String in format 'YYYY-MM-DD HH:MM:SS' (e.g., '2024-02-20 14:30:45')\ntoday() returns String in format 'YYYY-MM-DD' (e.g., '2024-02-20')\ncurrent_time() returns String in format 'HH:MM:SS' (e.g., '14:30:45')",
        example: `ADD datetime_utils

# Timestamp an event
let event_time = datetime_utils.now()
PRINT rt"Event occurred at: {event_time}"
# Output: Event occurred at: 2024-02-20 14:30:45

# Get today's date for comparison
let today = datetime_utils.today()
PRINT rt"Today is: {today}"
# Output: Today is: 2024-02-20

# Get current time only
let time_now = datetime_utils.current_time()
PRINT rt"Current time: {time_now}"
# Output: Current time: 14:30:45

# Create log entry
let log_entry = rt"{datetime_utils.now()} - User logged in successfully"
PRINT log_entry

# Check if event is today
let event_date = "2024-02-20"
IF event_date == datetime_utils.today(): START:
    PRINT "Event is happening today!"
END:`
      },
      {
        name: "format_date(format)",
        description: "Format the current date and time using custom patterns. Supports strftime-style format codes like %Y (year), %m (month), %d (day), %H (hour), %M (minute), %S (second), %A (day name), %B (month name). Perfect for creating custom date displays, generating filenames with dates, formatting reports, and localizing date output.",
        parameters: "format (String) - Format string using % codes:\n%Y = 4-digit year (2024)\n%m = 2-digit month (01-12)\n%d = 2-digit day (01-31)\n%H = 2-digit hour 24h (00-23)\n%M = 2-digit minute (00-59)\n%S = 2-digit second (00-59)\n%A = Full day name (Monday)\n%B = Full month name (January)",
        returns: "String - The current date/time formatted according to the pattern",
        example: `ADD datetime_utils

# ISO 8601 format
let iso_date = datetime_utils.format_date("%Y-%m-%d")
PRINT iso_date  # Output: 2024-02-20

# US format
let us_date = datetime_utils.format_date("%m/%d/%Y")
PRINT us_date  # Output: 02/20/2024

# Full readable format
let full_date = datetime_utils.format_date("%A, %B %d, %Y")
PRINT full_date  # Output: Tuesday, February 20, 2024

# Time only (24-hour)
let time_24h = datetime_utils.format_date("%H:%M:%S")
PRINT time_24h  # Output: 14:30:45

# Filename with timestamp
let filename = "backup_" + datetime_utils.format_date("%Y%m%d_%H%M%S") + ".txt"
PRINT filename  # Output: backup_20240220_143045.txt`
      },
      {
        name: "add_days(days), add_hours(hours), add_minutes(minutes)",
        description: "Add time to the current date/time. add_days() adds days, add_hours() adds hours, add_minutes() adds minutes. Returns the calculated future (or past if negative) date/time. Essential for scheduling future events, calculating deadlines, setting reminders, and time-based calculations.",
        parameters: "days/hours/minutes (Number) - Amount to add. Can be positive (future) or negative (past)",
        returns: "String - The calculated date/time in format 'YYYY-MM-DD HH:MM:SS'",
        example: `ADD datetime_utils

# Calculate future dates
let tomorrow = datetime_utils.add_days(1)
PRINT rt"Tomorrow: {tomorrow}"

let next_week = datetime_utils.add_days(7)
PRINT rt"Next week: {next_week}"

let in_30_days = datetime_utils.add_days(30)
PRINT rt"In 30 days: {in_30_days}"

# Calculate past dates
let yesterday = datetime_utils.add_days(-1)
PRINT rt"Yesterday: {yesterday}"

# Calculate future times
let in_2_hours = datetime_utils.add_hours(2)
PRINT rt"In 2 hours: {in_2_hours}"

let in_30_minutes = datetime_utils.add_minutes(30)
PRINT rt"In 30 minutes: {in_30_minutes}"

# Set reminder
let reminder_time = datetime_utils.add_hours(24)
PRINT rt"Reminder set for: {reminder_time}"`
      },
      {
        name: "get_year(), get_month(), get_day(), get_hour(), get_minute(), get_second()",
        description: "Extract individual components from the current date and time. get_year() returns the 4-digit year, get_month() returns month (1-12), get_day() returns day of month (1-31), get_hour() returns hour (0-23), get_minute() returns minute (0-59), get_second() returns second (0-59). Use these to analyze dates, perform date-based logic, and extract specific time components.",
        parameters: "None - These functions extract from the current date/time",
        returns: "Number - The requested component as an integer",
        example: `ADD datetime_utils

# Get current date components
let year = datetime_utils.get_year()
let month = datetime_utils.get_month()
let day = datetime_utils.get_day()

PRINT rt"Date: {year}-{month}-{day}"

# Get current time components
let hour = datetime_utils.get_hour()
let minute = datetime_utils.get_minute()
let second = datetime_utils.get_second()

PRINT rt"Time: {hour}:{minute}:{second}"

# Check if it's a specific month
IF datetime_utils.get_month() == 12: START:
    PRINT "It's December!"
END:

# Check time of day
let current_hour = datetime_utils.get_hour()
IF current_hour < 12: START:
    PRINT "Good morning!"
ELIF current_hour < 18: START:
    PRINT "Good afternoon!"
ELSE: START:
    PRINT "Good evening!"
END:`
      },
      {
        name: "is_leap_year(year), is_weekend(), is_weekday()",
        description: "Validate and check date properties. is_leap_year() checks if a year is a leap year (366 days). is_weekend() checks if today is Saturday or Sunday. is_weekday() checks if today is Monday-Friday. Essential for business logic, scheduling, calendar applications, and date validation.",
        parameters: "For is_leap_year(): year (Number) - The year to check\nFor is_weekend() and is_weekday(): None - checks current day",
        returns: "Boolean - true or false based on the check",
        example: `ADD datetime_utils

# Check if current year is leap year
let current_year = datetime_utils.get_year()
let is_leap = datetime_utils.is_leap_year(current_year)
PRINT rt"Is {current_year} a leap year? {is_leap}"

# Check specific years
PRINT rt"2024: {datetime_utils.is_leap_year(2024)}"  # true
PRINT rt"2023: {datetime_utils.is_leap_year(2023)}"  # false

# Weekend/weekday logic
IF datetime_utils.is_weekend(): START:
    PRINT "It's the weekend! Time to relax!"
ELIF datetime_utils.is_weekday(): START:
    PRINT "It's a weekday. Time to work!"
END:

# Business hours check
IF datetime_utils.is_weekday(): START:
    let hour = datetime_utils.get_hour()
    IF hour >= 9 AND hour < 17: START:
        PRINT "Office is open"
    ELSE: START:
        PRINT "Office is closed"
    END:
END:`
      }
    ],
    completeExample: `ADD datetime_utils

# ============================================
# COMPREHENSIVE DATETIME UTILS DEMONSTRATION
# ============================================

PRINT "=== SUSA DateTime Utils Module ==="
PRINT ""

# Current Date and Time
PRINT "Current Date and Time:"
PRINT rt"  Full: {datetime_utils.now()}"
PRINT rt"  Date only: {datetime_utils.today()}"
PRINT rt"  Time only: {datetime_utils.current_time()}"
PRINT rt"  Unix timestamp: {datetime_utils.timestamp()}"
PRINT ""

# Date Components
PRINT "Date Components:"
PRINT rt"  Year: {datetime_utils.get_year()}"
PRINT rt"  Month: {datetime_utils.get_month()}"
PRINT rt"  Day: {datetime_utils.get_day()}"
PRINT rt"  Hour: {datetime_utils.get_hour()}"
PRINT rt"  Minute: {datetime_utils.get_minute()}"
PRINT rt"  Second: {datetime_utils.get_second()}"
PRINT ""

# Day and Month Names
PRINT "Names:"
PRINT rt"  Day of week: {datetime_utils.get_day_name()}"
PRINT rt"  Month name: {datetime_utils.get_month_name()}"
PRINT ""

# Date Formatting
PRINT "Date Formatting:"
let iso = datetime_utils.format_date("%Y-%m-%d")
let us = datetime_utils.format_date("%m/%d/%Y")
let full = datetime_utils.format_date("%A, %B %d, %Y")
PRINT rt"  ISO: {iso}"
PRINT rt"  US: {us}"
PRINT rt"  Full: {full}"
PRINT ""

# Date Arithmetic
PRINT "Date Arithmetic:"
let tomorrow = datetime_utils.add_days(1)
let next_week = datetime_utils.add_days(7)
let in_2_hours = datetime_utils.add_hours(2)
PRINT rt"  Tomorrow: {tomorrow}"
PRINT rt"  Next week: {next_week}"
PRINT rt"  In 2 hours: {in_2_hours}"
PRINT ""

# Date Validation
PRINT "Date Validation:"
let year = datetime_utils.get_year()
PRINT rt"  Is {year} leap year? {datetime_utils.is_leap_year(year)}"
PRINT rt"  Is weekend? {datetime_utils.is_weekend()}"
PRINT rt"  Is weekday? {datetime_utils.is_weekday()}"`,
    relatedModules: ["string_utils"]
  },

  file_utils: {
    name: "file_utils",
    displayName: "File Utils",
    version: "1.0.0",
    description: "Comprehensive file and directory operations for reading, writing, managing files, and working with file systems",
    category: "System",
    functions: 35,
    performance: "60x faster",
    overview: `The File Utils module provides comprehensive file and directory operations for reading, writing, and managing files in SUSA.

**What's Included:**
• Basic File Operations: read_file, write_file, append_file, delete_file, copy_file, move_file
• File and Directory Checks: exists, is_file, is_directory
• Directory Operations: create_directory, delete_directory, list_directory
• File Information: get_file_size, get_file_extension, get_file_name, get_directory_name
• Path Manipulation: join_path, split_path, normalize_path, absolute_path, relative_path
• Directory Navigation: get_current_directory, change_directory, get_home_directory, get_temp_directory
• Line-Based Operations: read_lines, write_lines
• JSON File Operations: read_json, write_json
• CSV File Operations: read_csv, write_csv
• File Searching: find_files, search_in_files
• Backup and Compression: backup_file, compress_file, decompress_file

**Performance:**
All functions are implemented in optimized C++ code, making them 60x faster than equivalent pure SUSA implementations.

**Common Use Cases:**
• Configuration Management: Read and write config files in JSON format
• Data Persistence: Save and load application data to files
• Log Management: Append log entries, read log files, search logs
• File Processing: Batch process files, search and replace in files
• Backup Systems: Create timestamped backups, compress files
• Data Import/Export: Read and write CSV files for data exchange`,
    importExample: `ADD file_utils`,
    quickFunctions: ["read_file", "write_file", "exists", "list_directory", "copy_file", "delete_file", "read_json", "write_json"],
    detailedFunctions: [
      {
        name: "read_file(file_path), write_file(file_path, content)",
        description: "Read entire file content as a string or write content to a file (overwrites existing). Essential for loading configuration files, reading data files, saving application state, and any file I/O operations.",
        parameters: "For read_file(): file_path (String) - Path to the file to read\nFor write_file(): file_path (String) - Path to the file, content (String) - Content to write",
        returns: "read_file() returns String with file content. write_file() returns Boolean (true if successful)",
        example: `ADD file_utils

# Write data to file
let data = "Hello, SUSA!\\nThis is line 2."
file_utils.write_file("data.txt", data)
PRINT "File written"

# Read file content
let content = file_utils.read_file("data.txt")
PRINT rt"Content: {content}"

# Write configuration
let config_text = "app_name=MyApp\\nversion=1.0\\ndebug=true"
file_utils.write_file("config.txt", config_text)

# Read and parse config
let config = file_utils.read_file("config.txt")
PRINT config`
      },
      {
        name: "read_json(file_path), write_json(file_path, data)",
        description: "Read and parse JSON file into object/array, or write data to JSON file with formatting. Perfect for configuration files, data storage, API responses, and structured data persistence.",
        parameters: "For read_json(): file_path (String) - Path to JSON file\nFor write_json(): file_path (String) - Path to JSON file, data (Object/Array) - Data to write",
        returns: "read_json() returns Object/Array with parsed JSON data. write_json() returns Boolean (true if successful)",
        example: `ADD file_utils

# Write JSON configuration
let config = {
    "app_name": "MyApp",
    "version": "1.0.0",
    "settings": {
        "debug": true,
        "port": 8080
    }
}
file_utils.write_json("config.json", config)

# Read JSON configuration
let loaded = file_utils.read_json("config.json")
PRINT rt"App: {loaded['app_name']}"
PRINT rt"Port: {loaded['settings']['port']}"

# Save user data
let users = [
    {"name": "Alice", "age": 25},
    {"name": "Bob", "age": 30}
]
file_utils.write_json("users.json", users)`
      },
      {
        name: "list_directory(directory_path)",
        description: "List all files and directories in a directory. Returns an array of file and directory names. Essential for file browsers, batch processing, directory scanning, and file management operations.",
        parameters: "directory_path (String) - Path to directory to list. Use '.' for current directory",
        returns: "Array - List of file and directory names (strings)",
        example: `ADD file_utils

# List current directory
let files = file_utils.list_directory(".")
PRINT rt"Found {array_utils.length(files)} items"

LOOP i = 0 FOR array_utils.length(files) TIMES: START:
    PRINT rt"  {i + 1}. {files[i]}"
END:

# List specific directory
let data_files = file_utils.list_directory("data")
PRINT "Files in data folder:"
LOOP i = 0 FOR array_utils.length(data_files) TIMES: START:
    PRINT rt"  - {data_files[i]}"
END:`
      },
      {
        name: "exists(path), is_file(path), is_directory(path)",
        description: "Check if a path exists, is a file, or is a directory. Essential for validation before file operations, preventing errors, and implementing conditional file logic.",
        parameters: "path (String) - Path to check",
        returns: "Boolean - true if condition is met, false otherwise",
        example: `ADD file_utils

# Check before reading
IF file_utils.exists("data.txt"): START:
    let content = file_utils.read_file("data.txt")
    PRINT content
ELSE: START:
    PRINT "File not found"
END:

# Check file vs directory
let path = "data"
IF file_utils.is_directory(path): START:
    PRINT rt"{path} is a directory"
    let files = file_utils.list_directory(path)
    PRINT rt"Contains {array_utils.length(files)} items"
ELIF file_utils.is_file(path): START:
    PRINT rt"{path} is a file"
END:`
      },
      {
        name: "copy_file(source, dest), move_file(source, dest), delete_file(path)",
        description: "Copy a file to new location, move/rename a file, or delete a file. Essential for file management, backup operations, cleanup tasks, and file organization.",
        parameters: "source (String) - Source file path\ndest (String) - Destination file path\npath (String) - File path to delete",
        returns: "Boolean - true if successful, false otherwise",
        example: `ADD file_utils

# Create backup copy
file_utils.copy_file("important.txt", "important_backup.txt")
PRINT "Backup created"

# Rename file
file_utils.move_file("old_name.txt", "new_name.txt")
PRINT "File renamed"

# Delete temporary file
IF file_utils.exists("temp.txt"): START:
    file_utils.delete_file("temp.txt")
    PRINT "Temp file deleted"
END:

# Organize files
file_utils.copy_file("report.pdf", "archive/report_2024.pdf")
file_utils.delete_file("report.pdf")
PRINT "File archived"`
      }
    ],
    completeExample: `ADD file_utils

# ============================================
# COMPREHENSIVE FILE UTILS DEMONSTRATION
# ============================================

PRINT "=== SUSA File Utils Module ==="
PRINT ""

# Create directory structure
file_utils.create_directory("data/logs")
file_utils.create_directory("data/backups")
PRINT "Directories created"
PRINT ""

# Write and read text file
PRINT "Text File Operations:"
let content = "Hello, SUSA!\\nThis is a test file."
file_utils.write_file("data/test.txt", content)
let read_content = file_utils.read_file("data/test.txt")
PRINT rt"  Content: {read_content}"
PRINT ""

# File information
PRINT "File Information:"
let size = file_utils.get_file_size("data/test.txt")
let ext = file_utils.get_file_extension("data/test.txt")
PRINT rt"  Size: {size} bytes"
PRINT rt"  Extension: {ext}"
PRINT ""

# JSON operations
PRINT "JSON Operations:"
let config = {
    "app_name": "MyApp",
    "version": "1.0.0",
    "settings": {
        "debug": true,
        "port": 8080
    }
}
file_utils.write_json("data/config.json", config)
let loaded_config = file_utils.read_json("data/config.json")
PRINT rt"  App: {loaded_config['app_name']}"
PRINT rt"  Version: {loaded_config['version']}"
PRINT ""

# CSV operations
PRINT "CSV Operations:"
let csv_data = [
    ["Name", "Age", "City"],
    ["Alice", "25", "New York"],
    ["Bob", "30", "Los Angeles"]
]
file_utils.write_csv("data/people.csv", csv_data)
let people = file_utils.read_csv("data/people.csv")
PRINT rt"  Loaded {array_utils.length(people)} rows"
PRINT ""

# List directory
PRINT "Directory Listing:"
let files = file_utils.list_directory("data")
LOOP i = 0 FOR array_utils.length(files) TIMES: START:
    PRINT rt"  - {files[i]}"
END:`,
    relatedModules: ["json_utils", "string_utils", "datetime_utils"]
  },

  json_utils: {
    name: "json_utils",
    displayName: "JSON Utils",
    version: "1.0.0",
    description: "JSON parsing and manipulation functions",
    category: "Data",
    functions: 22,
    performance: "80x faster",
    overview: `Complete JSON operations including parsing, stringification, validation, transformation, and schema validation.`,
    importExample: `ADD json_utils`,
    quickFunctions: ["parse", "stringify", "get_value", "set_value", "validate", "pretty_print"],
    detailedFunctions: [
      {
        name: "parse(json_str)",
        description: "Parse JSON string",
        parameters: "json_str (String) - JSON string",
        returns: "Object - Parsed object",
        example: `let obj = parse('{"name": "Alice"}')\nPRINT obj["name"]`
      },
      {
        name: "stringify(obj, indent)",
        description: "Convert object to JSON",
        parameters: "obj (Object) - Object to convert\nindent (Number) - Indentation",
        returns: "String - JSON string",
        example: `let json = stringify({"age": 25}, 2)\nPRINT json`
      }
    ],
    completeExample: `ADD json_utils

let data = {"name": "Alice", "age": 25}
let json = stringify(data, 2)
PRINT json

let parsed = parse(json)
PRINT rt"Name: {parsed['name']}"`,
    relatedModules: ["file_utils", "http_client"]
  },

  http_client: {
    name: "http_client",
    displayName: "HTTP Client",
    version: "1.0.0",
    description: "HTTP requests and web API functions",
    category: "Network",
    functions: 20,
    performance: "Educational",
    overview: `Complete HTTP client with support for all methods, authentication, file upload/download, and request retrying.`,
    importExample: `ADD http_client`,
    quickFunctions: ["get", "post", "put", "delete", "download_file", "add_bearer_token"],
    detailedFunctions: [
      {
        name: "get(url, headers, params, timeout)",
        description: "Make HTTP GET request",
        parameters: "url (String) - Request URL\nheaders (Object) - Headers\nparams (Object) - Query params\ntimeout (Number) - Timeout",
        returns: "Object - Response object",
        example: `let response = get("https://api.example.com/data", null, null, null)\nPRINT response["status_code"]`
      },
      {
        name: "post(url, data, headers, timeout)",
        description: "Make HTTP POST request",
        parameters: "url (String) - Request URL\ndata (Object) - Request body\nheaders (Object) - Headers\ntimeout (Number) - Timeout",
        returns: "Object - Response object",
        example: `let response = post("https://api.example.com/users", {"name": "Alice"}, null, null)`
      }
    ],
    completeExample: `ADD http_client

let response = get("https://api.example.com/data", null, null, null)
IF response["ok"]: START:
    PRINT response["data"]
END:

let headers = add_bearer_token(null, "token123")
let auth_response = get("https://api.example.com/protected", headers, null, null)`,
    relatedModules: ["json_utils"]
  },

  data_structures: {
    name: "data_structures",
    displayName: "Data Structures",
    version: "1.0.0",
    description: "Advanced data structures (Stack, Queue, Tree, Graph)",
    category: "Advanced",
    functions: 20,
    performance: "70x faster",
    overview: `Implementations of Stack, Queue, LinkedList, BinaryTree, HashMap, Set, PriorityQueue, Graph, and Trie.`,
    importExample: `ADD data_structures`,
    quickFunctions: ["Stack", "Queue", "HashMap", "BinaryTree", "Graph", "Trie"],
    detailedFunctions: [
      {
        name: "Stack()",
        description: "Create LIFO stack",
        parameters: "None",
        returns: "Stack - New stack instance",
        example: `let stack = Stack()\nstack.push(10)\nstack.push(20)\nPRINT stack.pop()  # Output: 20`
      },
      {
        name: "Queue()",
        description: "Create FIFO queue",
        parameters: "None",
        returns: "Queue - New queue instance",
        example: `let queue = Queue()\nqueue.enqueue("first")\nqueue.enqueue("second")\nPRINT queue.dequeue()  # Output: "first"`
      },
      {
        name: "HashMap(capacity)",
        description: "Create hash map",
        parameters: "capacity (Number) - Initial capacity",
        returns: "HashMap - New hash map",
        example: `let map = HashMap(16)\nmap.put("key", "value")\nPRINT map.get("key")`
      }
    ],
    completeExample: `ADD data_structures

# Stack
let stack = Stack()
stack.push(1)
stack.push(2)
PRINT stack.pop()

# HashMap
let map = HashMap(16)
map.put("name", "Alice")
PRINT map.get("name")

# BinaryTree
let tree = BinaryTree()
tree.insert(50)
tree.insert(30)
tree.insert(70)
PRINT tree.inorder_traversal()`,
    relatedModules: ["algorithms"]
  },

  algorithms: {
    name: "algorithms",
    displayName: "Algorithms",
    version: "1.0.0",
    description: "Common algorithms and sorting functions",
    category: "Advanced",
    functions: 30,
    performance: "90x faster",
    overview: `Sorting, searching, graph algorithms, dynamic programming, and more.`,
    importExample: `ADD algorithms`,
    quickFunctions: ["quick_sort", "binary_search", "bfs", "dfs", "dijkstra", "kadane"],
    detailedFunctions: [
      {
        name: "quick_sort(arr)",
        description: "Sort array using quicksort",
        parameters: "arr (Array) - Array to sort",
        returns: "Array - Sorted array",
        example: `let sorted = quick_sort([5, 2, 8, 1])\nPRINT sorted  # Output: [1, 2, 5, 8]`
      },
      {
        name: "binary_search(arr, target)",
        description: "Search in sorted array",
        parameters: "arr (Array) - Sorted array\ntarget (Any) - Value to find",
        returns: "Number - Index or -1",
        example: `let index = binary_search([1, 2, 5, 8], 5)\nPRINT index  # Output: 2`
      },
      {
        name: "bfs(graph, start)",
        description: "Breadth-first search",
        parameters: "graph (Object) - Graph adjacency list\nstart (String) - Start vertex",
        returns: "Array - Traversal order",
        example: `let graph = {"A": ["B", "C"], "B": ["D"], "C": [], "D": []}\nlet order = bfs(graph, "A")`
      }
    ],
    completeExample: `ADD algorithms

# Sorting
let arr = [64, 34, 25, 12, 22]
PRINT rt"Quick Sort: {quick_sort(arr)}"
PRINT rt"Merge Sort: {merge_sort(arr)}"

# Searching
let sorted = [1, 2, 5, 8, 12, 22, 25]
PRINT rt"Binary Search: {binary_search(sorted, 12)}"

# Graph algorithms
let graph = {"A": ["B", "C"], "B": ["D"], "C": ["D"], "D": []}
PRINT rt"BFS: {bfs(graph, 'A')}"
PRINT rt"DFS: {dfs(graph, 'A')}"`,
    relatedModules: ["data_structures", "array_utils"]
  }
};


