# SUSA Standard Library Modules

## Overview
SUSA comes with 9 powerful standard library modules providing over 200 functions for common programming tasks.

## Available Modules

### 1. [Math Utils](./math_utils.md)
**Purpose:** Provides comprehensive mathematical operations for scientific computing, data analysis, game development, and general-purpose calculations.

**Module Information:**
- **Total Functions:** 40 mathematical functions
- **Constants Provided:** PI (3.14159...), E (2.71828...), GOLDEN_RATIO (1.61803...)
- **Performance:** Optimized C++ implementation, 100x faster than pure SUSA implementations
- **Categories:** 
  - Basic arithmetic (abs, max, min, pow, sqrt, cbrt)
  - Trigonometry (sin, cos, tan, asin, acos, atan, atan2)
  - Logarithms (log, ln, log2, exp)
  - Rounding (ceil, floor, round, trunc)
  - Advanced math (factorial, gcd, lcm, is_prime)
  - Random numbers (random, random_int)
  - Angle conversion (degrees, radians)
  - Utilities (clamp, lerp)

**When to Use This Module:**
- Performing mathematical calculations in your programs
- Building scientific or engineering applications
- Creating games that need physics or geometry calculations
- Generating random numbers for simulations or games
- Working with angles and trigonometry
- Implementing algorithms that require mathematical operations

**Detailed Example with Explanations:**
```susa
ADD math_utils

# ============================================
# BASIC ARITHMETIC OPERATIONS
# ============================================

# Square Root - Useful for distance calculations, physics, statistics
let distance = math_utils.sqrt(16)
PRINT rt"Square root of 16 is: {distance}"  # Output: 4
# Use case: Calculate distance between two points in 2D space
# Formula: distance = sqrt((x2-x1)^2 + (y2-y1)^2)

# Power - Raise numbers to any exponent
let area = math_utils.pow(5, 2)  # 5 squared = 25
PRINT rt"5 squared is: {area}"   # Output: 25
# Use case: Calculate area of square, compound interest, exponential growth

# Absolute Value - Get magnitude without sign
let temperature_diff = math_utils.abs(-10)
PRINT rt"Temperature difference: {temperature_diff}°C"  # Output: 10
# Use case: Calculate differences, distances, error margins


# ============================================
# TRIGONOMETRY - For angles and rotations
# ============================================

# Working with angles requires the PI constant
# PI is automatically available after adding math_utils
PRINT rt"Value of PI: {PI}"  # Output: 3.14159265358979

# Sine function - Returns vertical component of unit circle
let angle_90_degrees = PI / 2  # Convert 90 degrees to radians
let sine_value = math_utils.sin(angle_90_degrees)
PRINT rt"sin(90°) = {sine_value}"  # Output: 1
# Use case: Calculate wave patterns, circular motion, oscillations

# Cosine function - Returns horizontal component of unit circle
let cosine_value = math_utils.cos(0)
PRINT rt"cos(0°) = {cosine_value}"  # Output: 1
# Use case: Calculate positions in circular paths, wave functions

# Tangent function - Ratio of sine to cosine
let angle_45_degrees = PI / 4
let tangent_value = math_utils.tan(angle_45_degrees)
PRINT rt"tan(45°) = {tangent_value}"  # Output: 1
# Use case: Calculate slopes, angles of elevation


# ============================================
# ADVANCED MATHEMATICAL FUNCTIONS
# ============================================

# Factorial - Product of all positive integers up to n
# Formula: n! = n × (n-1) × (n-2) × ... × 1
let factorial_5 = math_utils.factorial(5)  # 5! = 5×4×3×2×1 = 120
PRINT rt"5! = {factorial_5}"  # Output: 120
# Use case: Combinatorics, probability calculations, permutations

# Prime Number Check - Determines if a number is prime
# A prime number is only divisible by 1 and itself
let is_17_prime = math_utils.is_prime(17)
PRINT rt"Is 17 prime? {is_17_prime}"  # Output: true
# Use case: Cryptography, number theory, optimization algorithms

# Greatest Common Divisor (GCD) - Largest number that divides both inputs
let gcd_result = math_utils.gcd(48, 18)  # GCD(48, 18) = 6
PRINT rt"GCD(48, 18) = {gcd_result}"  # Output: 6
# Use case: Simplifying fractions, finding common factors

# Least Common Multiple (LCM) - Smallest number divisible by both inputs
let lcm_result = math_utils.lcm(12, 18)  # LCM(12, 18) = 36
PRINT rt"LCM(12, 18) = {lcm_result}"  # Output: 36
# Use case: Synchronizing cycles, scheduling problems


# ============================================
# RANDOM NUMBER GENERATION
# ============================================

# Random float between 0 and 1
let random_probability = math_utils.random()
PRINT rt"Random probability: {random_probability}"  # Output: 0.0 to 1.0
# Use case: Probability simulations, random events, Monte Carlo methods

# Random integer in a range (inclusive)
let dice_roll = math_utils.random_int(1, 6)
PRINT rt"Dice roll: {dice_roll}"  # Output: 1, 2, 3, 4, 5, or 6
# Use case: Games, simulations, random sampling

# Generate multiple random numbers
PRINT "Rolling dice 5 times:"
LOOP i = 0 FOR 5 TIMES: START:
    let roll = math_utils.random_int(1, 6)
    PRINT rt"  Roll {i + 1}: {roll}"
END:


# ============================================
# ROUNDING FUNCTIONS
# ============================================

let decimal_number = 3.7

# Round to nearest integer
let rounded = math_utils.round(decimal_number)
PRINT rt"Rounded: {rounded}"  # Output: 4

# Always round up
let ceiling = math_utils.ceil(decimal_number)
PRINT rt"Ceiling: {ceiling}"  # Output: 4

# Always round down
let floor = math_utils.floor(decimal_number)
PRINT rt"Floor: {floor}"  # Output: 3

# Remove decimal part
let truncated = math_utils.trunc(decimal_number)
PRINT rt"Truncated: {truncated}"  # Output: 3


# ============================================
# PRACTICAL EXAMPLE: Calculate Circle Properties
# ============================================

let radius = 5

# Area = π × r²
let circle_area = PI * math_utils.pow(radius, 2)
PRINT rt"Circle area (radius {radius}): {circle_area}"  # Output: 78.54

# Circumference = 2 × π × r
let circumference = 2 * PI * radius
PRINT rt"Circle circumference: {circumference}"  # Output: 31.42


# ============================================
# PRACTICAL EXAMPLE: Distance Between Points
# ============================================

# Calculate distance between two points (x1,y1) and (x2,y2)
# Formula: distance = sqrt((x2-x1)² + (y2-y1)²)

let x1 = 0
let y1 = 0
let x2 = 3
let y2 = 4

let dx = x2 - x1  # Difference in x
let dy = y2 - y1  # Difference in y

# Calculate distance using Pythagorean theorem
let distance_squared = math_utils.pow(dx, 2) + math_utils.pow(dy, 2)
let distance = math_utils.sqrt(distance_squared)

PRINT rt"Distance from ({x1},{y1}) to ({x2},{y2}): {distance}"  # Output: 5


# ============================================
# PRACTICAL EXAMPLE: Convert Angles
# ============================================

# Convert degrees to radians for trigonometric functions
let angle_in_degrees = 45
let angle_in_radians = math_utils.radians(angle_in_degrees)
PRINT rt"{angle_in_degrees}° = {angle_in_radians} radians"

# Convert radians back to degrees
let back_to_degrees = math_utils.degrees(angle_in_radians)
PRINT rt"{angle_in_radians} radians = {back_to_degrees}°"
```

**Common Use Cases:**
1. **Game Development:** Calculate positions, rotations, physics, collisions
2. **Data Analysis:** Statistical calculations, averages, standard deviations
3. **Graphics:** Coordinate transformations, rotations, scaling
4. **Simulations:** Random events, probability distributions, Monte Carlo methods
5. **Engineering:** Scientific calculations, unit conversions, formulas
6. **Finance:** Compound interest, growth rates, financial modeling

**Important Notes:**
- Trigonometric functions use **radians**, not degrees. Use `math_utils.radians()` to convert.
- The constants PI, E, and GOLDEN_RATIO are available globally after adding the module.
- Random functions use a pseudo-random number generator suitable for games and simulations.
- For cryptographic security, use a dedicated cryptography module instead.

**See Full Documentation:** [math_utils.md](./math_utils.md) for all 40 functions with detailed parameters and examples.

---

### 2. [String Utils](./string_utils.md)
**Purpose:** Provides comprehensive string manipulation and text processing functions for handling user input, formatting output, parsing data, and text analysis.

**Module Information:**
- **Total Functions:** 18 string manipulation functions
- **Performance:** Optimized C++ implementation, 30x faster than pure SUSA implementations
- **Categories:**
  - Case conversion (upper, lower, capitalize, title)
  - Whitespace handling (strip, lstrip, rstrip, trim)
  - String searching (contains, startswith, endswith, index_of, count)
  - String transformation (reverse, repeat, replace)
  - String splitting and joining (split, join)
  - String padding (pad_left, pad_right)
  - Length measurement (len)

**When to Use This Module:**
- Processing user input and cleaning data
- Formatting text output for display
- Parsing CSV, log files, or structured text
- Validating email addresses, URLs, or other patterns
- Building text-based user interfaces
- Manipulating file paths and names
- Creating formatted reports or documents

**Detailed Example with Explanations:**
```susa
ADD string_utils

# ============================================
# CASE CONVERSION - Change text capitalization
# ============================================

let original_text = "hello world from SUSA"

# Convert to UPPERCASE - Useful for comparisons, constants, headers
let uppercase = string_utils.upper(original_text)
PRINT rt"Uppercase: {uppercase}"  # Output: HELLO WORLD FROM SUSA
# Use case: Normalize user input for case-insensitive comparisons
# Example: if string_utils.upper(user_input) == "YES": ...

# Convert to lowercase - Useful for normalization, file names
let lowercase = string_utils.lower(original_text)
PRINT rt"Lowercase: {lowercase}"  # Output: hello world from susa
# Use case: Create URL-friendly slugs, normalize email addresses

# Capitalize first letter only - Useful for names, sentences
let capitalized = string_utils.capitalize(original_text)
PRINT rt"Capitalized: {capitalized}"  # Output: Hello world from susa
# Use case: Format user names, start of sentences

# Title Case - Capitalize first letter of each word
let title_case = string_utils.title(original_text)
PRINT rt"Title Case: {title_case}"  # Output: Hello World From Susa
# Use case: Format book titles, headers, proper names


# ============================================
# WHITESPACE HANDLING - Clean up text
# ============================================

let messy_input = "   Hello SUSA!   \n\t"

# Remove whitespace from both ends
let cleaned = string_utils.strip(messy_input)
PRINT rt"Cleaned: '{cleaned}'"  # Output: 'Hello SUSA!'
# Use case: Clean user input from forms, remove accidental spaces

# Remove only leading (left) whitespace
let left_trimmed = string_utils.lstrip(messy_input)
PRINT rt"Left trimmed: '{left_trimmed}'"  # Output: 'Hello SUSA!   \n\t'
# Use case: Remove indentation, clean left-aligned text

# Remove only trailing (right) whitespace
let right_trimmed = string_utils.rstrip(messy_input)
PRINT rt"Right trimmed: '{right_trimmed}'"  # Output: '   Hello SUSA!'
# Use case: Remove trailing newlines, clean right-aligned text


# ============================================
# STRING SEARCHING - Find text within strings
# ============================================

let email = "user@example.com"
let sentence = "The quick brown fox jumps over the lazy dog"

# Check if string contains a substring
let has_at_symbol = string_utils.contains(email, "@")
PRINT rt"Email contains @: {has_at_symbol}"  # Output: true
# Use case: Validate email format, check for keywords

# Check if string starts with a prefix
let starts_with_the = string_utils.startswith(sentence, "The")
PRINT rt"Starts with 'The': {starts_with_the}"  # Output: true
# Use case: Check file extensions, validate prefixes

# Check if string ends with a suffix
let filename = "document.txt"
let is_text_file = string_utils.endswith(filename, ".txt")
PRINT rt"Is text file: {is_text_file}"  # Output: true
# Use case: Filter files by extension, validate formats

# Find position of substring (returns index or -1 if not found)
let position = string_utils.index_of(sentence, "fox")
PRINT rt"Position of 'fox': {position}"  # Output: 16
# Use case: Locate specific text, parse structured data

# Count occurrences of substring
let text_with_repeats = "hello hello hello world"
let hello_count = string_utils.count(text_with_repeats, "hello")
PRINT rt"'hello' appears {hello_count} times"  # Output: 3
# Use case: Count word frequency, analyze text patterns


# ============================================
# STRING TRANSFORMATION - Modify strings
# ============================================

# Reverse a string - Flip character order
let word = "SUSA"
let reversed = string_utils.reverse(word)
PRINT rt"Reversed: {reversed}"  # Output: ASUS
# Use case: Palindrome checking, text effects, puzzles

# Repeat a string multiple times
let separator = string_utils.repeat("=", 50)
PRINT separator  # Output: ==================================================
# Use case: Create dividers, patterns, decorative elements

let laugh = string_utils.repeat("Ha", 3)
PRINT laugh  # Output: HaHaHa
# Use case: Generate repeated patterns, text effects

# Replace all occurrences of substring
let greeting = "Hello Bob, how are you Bob?"
let updated = string_utils.replace(greeting, "Bob", "Alice")
PRINT updated  # Output: Hello Alice, how are you Alice?
# Use case: Find and replace, template substitution, text cleanup


# ============================================
# SPLITTING AND JOINING - Parse and combine text
# ============================================

# Split string into array by delimiter
let csv_line = "John,Doe,30,Engineer"
let fields = string_utils.split(csv_line, ",")
PRINT rt"First name: {fields[0]}"   # Output: John
PRINT rt"Last name: {fields[1]}"    # Output: Doe
PRINT rt"Age: {fields[2]}"          # Output: 30
PRINT rt"Job: {fields[3]}"          # Output: Engineer
# Use case: Parse CSV files, split command-line arguments

# Split by whitespace (default delimiter)
let sentence_words = string_utils.split("The quick brown fox", " ")
PRINT rt"Word count: {string_utils.len(sentence_words)}"  # Output: 4
# Use case: Count words, tokenize text, parse sentences

# Join array elements into string with delimiter
let path_parts = ["C:", "Users", "Documents", "file.txt"]
let file_path = string_utils.join(path_parts, "\\")
PRINT rt"File path: {file_path}"  # Output: C:\Users\Documents\file.txt
# Use case: Build file paths, create URLs, format lists

let words = ["Hello", "World", "from", "SUSA"]
let sentence_joined = string_utils.join(words, " ")
PRINT sentence_joined  # Output: Hello World from SUSA
# Use case: Combine words into sentences, format output


# ============================================
# STRING PADDING - Align and format text
# ============================================

# Pad left with zeros - Common for numbers
let number = "42"
let padded_number = string_utils.pad_left(number, 5, "0")
PRINT rt"Padded number: {padded_number}"  # Output: 00042
# Use case: Format IDs, create fixed-width numbers, align columns

# Pad right with spaces - Align text left
let name = "Alice"
let padded_name = string_utils.pad_right(name, 20, " ")
PRINT rt"Name: '{padded_name}' (padded)"  # Output: 'Alice               '
# Use case: Create tables, align columns, format reports


# ============================================
# PRACTICAL EXAMPLE: Clean and Validate Email
# ============================================

PRINT "\n=== Email Validation Example ==="

let user_email = "  USER@EXAMPLE.COM  "

# Step 1: Clean the input
let cleaned_email = string_utils.strip(user_email)
PRINT rt"Cleaned: '{cleaned_email}'"

# Step 2: Normalize to lowercase
let normalized_email = string_utils.lower(cleaned_email)
PRINT rt"Normalized: '{normalized_email}'"

# Step 3: Validate format
let has_at = string_utils.contains(normalized_email, "@")
let has_dot = string_utils.contains(normalized_email, ".")
let at_position = string_utils.index_of(normalized_email, "@")
let dot_after_at = string_utils.index_of(normalized_email, ".") > at_position

IF has_at AND has_dot AND dot_after_at: START:
    PRINT "✓ Email format is valid"
    PRINT rt"Final email: {normalized_email}"
ELSE: START:
    PRINT "✗ Invalid email format"
END:


# ============================================
# PRACTICAL EXAMPLE: Parse CSV Data
# ============================================

PRINT "\n=== CSV Parsing Example ==="

let csv_data = "Alice,25,Engineer\nBob,30,Designer\nCarol,28,Manager"
let lines = string_utils.split(csv_data, "\n")

PRINT rt"Processing {string_utils.len(lines)} records:"

LOOP i = 0 FOR string_utils.len(lines) TIMES: START:
    let line = lines[i]
    let fields = string_utils.split(line, ",")
    
    let name = fields[0]
    let age = fields[1]
    let job = fields[2]
    
    PRINT rt"  {i + 1}. {name} - Age: {age}, Job: {job}"
END:


# ============================================
# PRACTICAL EXAMPLE: Format Table Output
# ============================================

PRINT "\n=== Table Formatting Example ==="

# Create table header
let separator = string_utils.repeat("=", 60)
PRINT separator
PRINT "| Name                 | Age  | Job                  |"
PRINT separator

# Format table rows with padding
let employees = [
    ["Alice", "25", "Engineer"],
    ["Bob", "30", "Designer"],
    ["Carol", "28", "Manager"]
]

LOOP i = 0 FOR string_utils.len(employees) TIMES: START:
    let emp = employees[i]
    let name_padded = string_utils.pad_right(emp[0], 20, " ")
    let age_padded = string_utils.pad_right(emp[1], 4, " ")
    let job_padded = string_utils.pad_right(emp[2], 20, " ")
    
    PRINT rt"| {name_padded} | {age_padded} | {job_padded} |"
END:

PRINT separator


# ============================================
# PRACTICAL EXAMPLE: Build File Path
# ============================================

PRINT "\n=== File Path Building Example ==="

let drive = "C:"
let folders = ["Users", "Alice", "Documents", "Projects"]
let filename = "report.txt"

# Build path step by step
let path_parts = [drive]
LOOP i = 0 FOR string_utils.len(folders) TIMES: START:
    # Add each folder to path
    let folder = folders[i]
    # path_parts.push(folder)  # Would need array_utils
END:

# For now, manually build
let full_path = drive + "\\" + string_utils.join(folders, "\\") + "\\" + filename
PRINT rt"Full path: {full_path}"
# Output: C:\Users\Alice\Documents\Projects\report.txt


# ============================================
# PRACTICAL EXAMPLE: Text Statistics
# ============================================

PRINT "\n=== Text Analysis Example ==="

let article = "The quick brown fox jumps over the lazy dog. The dog was very lazy."

# Count words
let words_array = string_utils.split(article, " ")
let word_count = string_utils.len(words_array)
PRINT rt"Word count: {word_count}"

# Count specific word
let the_count = string_utils.count(string_utils.lower(article), "the")
PRINT rt"'the' appears: {the_count} times"

# Count sentences (approximate by counting periods)
let sentence_count = string_utils.count(article, ".")
PRINT rt"Sentences: {sentence_count}"

# Character count
let char_count = string_utils.len(article)
PRINT rt"Characters: {char_count}"
```

**Common Use Cases:**
1. **Data Validation:** Clean and validate user input (emails, names, phone numbers)
2. **Text Parsing:** Parse CSV files, log files, configuration files
3. **Formatting Output:** Create tables, reports, formatted text displays
4. **File Operations:** Build file paths, check extensions, parse filenames
5. **Text Processing:** Search and replace, word counting, text analysis
6. **User Interface:** Format prompts, create menus, display messages
7. **Data Cleaning:** Remove whitespace, normalize case, standardize formats

**Important Notes:**
- String operations create new strings; original strings are not modified
- Index positions start at 0 (first character is at index 0)
- `index_of()` returns -1 if substring is not found
- Case-sensitive by default; use `upper()` or `lower()` for case-insensitive comparisons
- Empty strings are valid and have length 0

**See Full Documentation:** [string_utils.md](./string_utils.md) for all 18 functions with detailed parameters and examples.

---

### 3. [Array Utils](./array_utils.md)
**Purpose:** Provides comprehensive array and list manipulation functions for data processing, collection management, functional programming, and algorithm implementation.

**Module Information:**
- **Total Functions:** 50+ array manipulation functions
- **Performance:** Optimized C++ implementation, 50x faster than pure SUSA implementations
- **Categories:**
  - Basic operations (push, pop, shift, unshift, length)
  - Array modification (slice, splice, concat, reverse)
  - Sorting and searching (sort_array, binary_search, find, find_index)
  - Mathematical operations (sum, average, max, min, product)
  - Functional programming (map_array, filter_array, reduce, forEach)
  - Set operations (unique, union, intersection, difference)
  - Array transformation (flatten, chunk, zip, partition)
  - Advanced utilities (group_by, count_by, shuffle, sample)

**When to Use This Module:**
- Processing collections of data
- Implementing data structures and algorithms
- Performing statistical calculations on datasets
- Filtering and transforming data
- Removing duplicates and finding unique values
- Sorting and organizing information
- Implementing functional programming patterns
- Working with matrices and multi-dimensional data

**Detailed Example with Explanations:**
```susa
ADD array_utils

# ============================================
# BASIC ARRAY OPERATIONS - Add and remove elements
# ============================================

let numbers = [10, 20, 30]
PRINT rt"Original array: {numbers}"  # Output: [10, 20, 30]

# Add element to end of array
array_utils.push(numbers, 40)
PRINT rt"After push(40): {numbers}"  # Output: [10, 20, 30, 40]
# Use case: Build lists dynamically, add items to cart, append data

# Remove and return last element
let last_item = array_utils.pop(numbers)
PRINT rt"Popped: {last_item}"  # Output: 40
PRINT rt"After pop: {numbers}"  # Output: [10, 20, 30]
# Use case: Implement stack (LIFO), undo operations, remove last item

# Remove and return first element
let first_item = array_utils.shift(numbers)
PRINT rt"Shifted: {first_item}"  # Output: 10
PRINT rt"After shift: {numbers}"  # Output: [20, 30]
# Use case: Implement queue (FIFO), process items in order

# Add element to beginning of array
let new_array = array_utils.unshift(numbers, 5)
PRINT rt"After unshift(5): {new_array}"  # Output: [5, 20, 30]
# Use case: Prepend items, add priority elements, insert at start

# Get array length
let count = array_utils.length(numbers)
PRINT rt"Array length: {count}"  # Output: 2
# Use case: Loop bounds, validation, size checking


# ============================================
# SORTING AND ORGANIZING - Order your data
# ============================================

let unsorted = [64, 34, 25, 12, 22, 11, 90]
PRINT rt"Unsorted: {unsorted}"

# Sort array in ascending order
let sorted_asc = array_utils.sort_array(unsorted)
PRINT rt"Sorted ascending: {sorted_asc}"  # Output: [11, 12, 22, 25, 34, 64, 90]
# Use case: Organize data, prepare for binary search, display ordered lists

# Reverse array order
let reversed = array_utils.reverse_array(sorted_asc)
PRINT rt"Reversed (descending): {reversed}"  # Output: [90, 64, 34, 25, 22, 12, 11]
# Use case: Sort descending, reverse chronological order, flip data

# Remove duplicate values
let with_duplicates = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5]
let unique_values = array_utils.unique(with_duplicates)
PRINT rt"Unique values: {unique_values}"  # Output: [1, 2, 3, 4, 5]
# Use case: Remove duplicates, get distinct values, clean datasets


# ============================================
# MATHEMATICAL OPERATIONS - Calculate statistics
# ============================================

let dataset = [10, 20, 30, 40, 50]
PRINT rt"Dataset: {dataset}"

# Sum all elements
let total = array_utils.sum(dataset)
PRINT rt"Sum: {total}"  # Output: 150
# Use case: Calculate totals, aggregate values, sum scores

# Calculate average (mean)
let average = array_utils.average(dataset)
PRINT rt"Average: {average}"  # Output: 30
# Use case: Find mean, calculate GPA, average temperatures

# Find maximum value
let maximum = array_utils.max(dataset)
PRINT rt"Maximum: {maximum}"  # Output: 50
# Use case: Find highest score, peak value, upper bound

# Find minimum value
let minimum = array_utils.min(dataset)
PRINT rt"Minimum: {minimum}"  # Output: 10
# Use case: Find lowest score, minimum value, lower bound

# Calculate product of all elements
let product = array_utils.product(dataset)
PRINT rt"Product: {product}"  # Output: 12000000
# Use case: Compound calculations, factorial-like operations


# ============================================
# SEARCHING - Find elements in arrays
# ============================================

let fruits = ["apple", "banana", "cherry", "date", "elderberry"]

# Find index of element
let banana_index = array_utils.index_of(fruits, "banana")
PRINT rt"Index of 'banana': {banana_index}"  # Output: 1
# Use case: Locate items, check positions, find elements

# Check if array contains element
let has_cherry = array_utils.contains(fruits, "cherry")
PRINT rt"Contains 'cherry': {has_cherry}"  # Output: true
# Use case: Validate presence, check membership, filter data

# Binary search (requires sorted array) - Much faster for large arrays
let sorted_numbers = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
let search_result = array_utils.binary_search(sorted_numbers, 11)
PRINT rt"Binary search for 11: {search_result}"  # Output: 5 (index)
# Use case: Fast searching in sorted data, efficient lookups


# ============================================
# FUNCTIONAL PROGRAMMING - Transform data
# ============================================

let numbers_to_process = [1, 2, 3, 4, 5]

# Map - Transform each element
FUNC double(x): START:
    RETURN x * 2
END:

let doubled = array_utils.map_array(numbers_to_process, double)
PRINT rt"Doubled: {doubled}"  # Output: [2, 4, 6, 8, 10]
# Use case: Transform data, apply function to all elements, convert units

# Filter - Keep only elements that match condition
FUNC is_even(x): START:
    RETURN x % 2 == 0
END:

let even_numbers = array_utils.filter_array(numbers_to_process, is_even)
PRINT rt"Even numbers: {even_numbers}"  # Output: [2, 4]
# Use case: Filter data, remove unwanted items, select subsets

# Reduce - Combine all elements into single value
FUNC add(accumulator, current): START:
    RETURN accumulator + current
END:

let sum_result = array_utils.reduce(numbers_to_process, add, 0)
PRINT rt"Sum via reduce: {sum_result}"  # Output: 15
# Use case: Aggregate data, calculate totals, combine values


# ============================================
# SET OPERATIONS - Work with collections
# ============================================

let set_a = [1, 2, 3, 4, 5]
let set_b = [4, 5, 6, 7, 8]

# Union - All unique elements from both sets
let union_result = array_utils.union(set_a, set_b)
PRINT rt"Union: {union_result}"  # Output: [1, 2, 3, 4, 5, 6, 7, 8]
# Use case: Combine lists, merge datasets, get all items

# Intersection - Elements present in both sets
let intersection_result = array_utils.intersection(set_a, set_b)
PRINT rt"Intersection: {intersection_result}"  # Output: [4, 5]
# Use case: Find common elements, shared items, overlaps

# Difference - Elements in first set but not in second
let difference_result = array_utils.difference(set_a, set_b)
PRINT rt"Difference: {difference_result}"  # Output: [1, 2, 3]
# Use case: Find unique to first set, remove common items


# ============================================
# ARRAY TRANSFORMATION - Reshape data
# ============================================

# Flatten nested arrays
let nested = [[1, 2], [3, 4], [5, 6]]
let flattened = array_utils.flatten(nested)
PRINT rt"Flattened: {flattened}"  # Output: [1, 2, 3, 4, 5, 6]
# Use case: Simplify nested data, merge sub-arrays, linearize

# Chunk - Split array into smaller arrays
let long_array = [1, 2, 3, 4, 5, 6, 7, 8, 9]
let chunks = array_utils.chunk(long_array, 3)
PRINT rt"Chunks of 3: {chunks}"  # Output: [[1,2,3], [4,5,6], [7,8,9]]
# Use case: Pagination, batch processing, group items

# Zip - Combine multiple arrays element-wise
let names = ["Alice", "Bob", "Carol"]
let ages = [25, 30, 28]
let zipped = array_utils.zip(names, ages)
PRINT rt"Zipped: {zipped}"  # Output: [["Alice",25], ["Bob",30], ["Carol",28]]
# Use case: Combine related data, create pairs, merge parallel arrays


# ============================================
# PRACTICAL EXAMPLE: Student Grade Analysis
# ============================================

PRINT "\n=== Student Grade Analysis ==="

let student_names = ["Alice", "Bob", "Carol", "David", "Eve"]
let test_scores = [85, 92, 78, 95, 88]

# Calculate class statistics
let class_average = array_utils.average(test_scores)
let highest_score = array_utils.max(test_scores)
let lowest_score = array_utils.min(test_scores)
let total_students = array_utils.length(student_names)

PRINT rt"Class Size: {total_students} students"
PRINT rt"Class Average: {class_average}"
PRINT rt"Highest Score: {highest_score}"
PRINT rt"Lowest Score: {lowest_score}"

# Find top student
let top_student_index = array_utils.index_of(test_scores, highest_score)
let top_student = student_names[top_student_index]
PRINT rt"Top Student: {top_student} with {highest_score} points"

# Filter students who passed (score >= 80)
FUNC passed(score): START:
    RETURN score >= 80
END:

let passing_scores = array_utils.filter_array(test_scores, passed)
let pass_count = array_utils.length(passing_scores)
let pass_rate = (pass_count * 100) / total_students

PRINT rt"Students Passed: {pass_count}/{total_students} ({pass_rate}%)"


# ============================================
# PRACTICAL EXAMPLE: Shopping Cart
# ============================================

PRINT "\n=== Shopping Cart Example ==="

let cart_items = ["Apple", "Banana", "Orange"]
let cart_prices = [1.50, 0.75, 2.00]
let cart_quantities = [3, 5, 2]

PRINT "Cart Contents:"
LOOP i = 0 FOR array_utils.length(cart_items) TIMES: START:
    let item = cart_items[i]
    let price = cart_prices[i]
    let qty = cart_quantities[i]
    let subtotal = price * qty
    
    PRINT rt"  {item}: {qty} × ${price} = ${subtotal}"
END:

# Calculate total
FUNC multiply_arrays(index): START:
    RETURN cart_prices[index] * cart_quantities[index]
END:

# Manual calculation of total
let total_cost = 0
LOOP i = 0 FOR array_utils.length(cart_prices) TIMES: START:
    total_cost = total_cost + (cart_prices[i] * cart_quantities[i])
END:

PRINT rt"Total Cost: ${total_cost}"


# ============================================
# PRACTICAL EXAMPLE: Data Cleaning
# ============================================

PRINT "\n=== Data Cleaning Example ==="

# Raw data with duplicates and unsorted
let raw_data = [45, 23, 67, 23, 89, 12, 45, 67, 34, 12]
PRINT rt"Raw data: {raw_data}"
PRINT rt"Count: {array_utils.length(raw_data)} items"

# Step 1: Remove duplicates
let cleaned_data = array_utils.unique(raw_data)
PRINT rt"After removing duplicates: {cleaned_data}"
PRINT rt"Count: {array_utils.length(cleaned_data)} items"

# Step 2: Sort the data
let sorted_data = array_utils.sort_array(cleaned_data)
PRINT rt"After sorting: {sorted_data}"

# Step 3: Calculate statistics
let data_min = array_utils.min(sorted_data)
let data_max = array_utils.max(sorted_data)
let data_avg = array_utils.average(sorted_data)
let data_sum = array_utils.sum(sorted_data)

PRINT "\nData Statistics:"
PRINT rt"  Minimum: {data_min}"
PRINT rt"  Maximum: {data_max}"
PRINT rt"  Average: {data_avg}"
PRINT rt"  Sum: {data_sum}"
PRINT rt"  Range: {data_max - data_min}"


# ============================================
# PRACTICAL EXAMPLE: Inventory Management
# ============================================

PRINT "\n=== Inventory Management ==="

let product_ids = [101, 102, 103, 104, 105]
let product_names = ["Laptop", "Mouse", "Keyboard", "Monitor", "Webcam"]
let stock_levels = [5, 25, 15, 8, 12]
let reorder_points = [10, 20, 10, 5, 10]

PRINT "Inventory Status:"
PRINT "ID   | Product    | Stock | Reorder | Status"
PRINT "-----+------------+-------+---------+--------"

LOOP i = 0 FOR array_utils.length(product_ids) TIMES: START:
    let id = product_ids[i]
    let name = product_names[i]
    let stock = stock_levels[i]
    let reorder = reorder_points[i]
    
    let status = "OK"
    IF stock < reorder: START:
        status = "LOW - REORDER"
    END:
    
    PRINT rt"{id} | {name:10} | {stock:5} | {reorder:7} | {status}"
END:

# Find products that need reordering
PRINT "\nProducts needing reorder:"
LOOP i = 0 FOR array_utils.length(stock_levels) TIMES: START:
    IF stock_levels[i] < reorder_points[i]: START:
        PRINT rt"  - {product_names[i]} (Stock: {stock_levels[i]})"
    END:
END:

# Calculate total inventory value (assuming prices)
let prices = [1200, 25, 75, 350, 80]
let total_value = 0
LOOP i = 0 FOR array_utils.length(prices) TIMES: START:
    total_value = total_value + (prices[i] * stock_levels[i])
END:
PRINT rt"\nTotal Inventory Value: ${total_value}"
```

**Common Use Cases:**
1. **Data Processing:** Clean, filter, and transform datasets
2. **Statistics:** Calculate averages, sums, min/max values
3. **Sorting:** Organize data for display or searching
4. **Searching:** Find elements efficiently in collections
5. **Deduplication:** Remove duplicate values from lists
6. **Set Operations:** Find unions, intersections, differences
7. **Batch Processing:** Split data into chunks for processing
8. **Functional Programming:** Map, filter, reduce operations

**Important Notes:**
- Array indices start at 0 (first element is at index 0)
- Many functions return new arrays without modifying the original
- `sort_array()` sorts in ascending order by default
- `binary_search()` requires a sorted array to work correctly
- Empty arrays are valid and have length 0
- Use `unique()` before set operations for better performance

**See Full Documentation:** [array_utils.md](./array_utils.md) for all 50+ functions with detailed parameters and examples.
let flattened = array_utils.flatten([[1,2],[3,4]]) # Output: [1,2,3,4]

# Functional programming
FUNC is_even(x): START:
    RETURN x % 2 == 0
END:
let evens = array_utils.filter_array(arr, is_even)
```

---

### 4. [DateTime Utils](./datetime_utils.md)
Date and time operations.
- **Functions:** 35+
- **Categories:** Current time, formatting, arithmetic, validation

**Quick Example:**
```susa
ADD datetime_utils
PRINT datetime_utils.now()          // Output: 2026-02-20 19:45:30
PRINT datetime_utils.today()        // Output: 2026-02-20
PRINT datetime_utils.get_day_name() // Output: Friday
```

---

### 5. [File Utils](./file_utils.md)
File system operations.
- **Functions:** 20+
- **Categories:** Reading, writing, file operations, directory operations

**Quick Example:**
```susa
ADD file_utils
file_utils.write_file("test.txt", "Hello SUSA!")
let content = file_utils.read_file("test.txt")
PRINT content                       // Output: Hello SUSA!
```

---

### 6. [JSON Utils](./json_utils.md)
JSON parsing and generation.
- **Functions:** 10+
- **Categories:** Parsing, generation, validation, formatting

**Quick Example:**
```susa
ADD json_utils
let data = {"name": "SUSA", "version": "1.0"}
let json_str = json_utils.to_json(data)
PRINT json_str                      // Output: {"name":"SUSA","version":"1.0"}
```

---

### 7. [HTTP Client](./http_client.md)
HTTP requests and web APIs.
- **Functions:** 15+
- **Categories:** GET, POST, PUT, DELETE, headers, response handling

**Quick Example:**
```susa
ADD http_client
let response = http_client.get("https://api.example.com/data")
PRINT http_client.get_status(response)  // Output: 200
PRINT http_client.get_body(response)    // Output: API response
```

---

### 8. [Data Structures](./data_structures.md)
Advanced data structures.
- **Structures:** Stack, Queue, LinkedList, HashMap
- **Operations:** Push, pop, enqueue, dequeue, insert, delete, search

**Quick Example:**
```susa
ADD data_structures
let stack = data_structures.create_stack()
data_structures.push(stack, 10)
data_structures.push(stack, 20)
PRINT data_structures.pop(stack)    // Output: 20
```

---

### 9. [Algorithms](./algorithms.md)
Common algorithms and utilities.
- **Functions:** 20+
- **Categories:** Sorting, searching, validation, string algorithms

**Quick Example:**
```susa
ADD algorithms
let arr = [64, 34, 25, 12, 22]
algorithms.quick_sort(arr)
PRINT arr                           // Output: [12, 22, 25, 34, 64]

PRINT algorithms.binary_search(arr, 25)  // Output: 2
```

---

## How to Use Modules

### Step 1: Add the Module
Use the `ADD` keyword to import a module into your SUSA program:

```susa
ADD math_utils
```

**Important**: SUSA uses `ADD` (not IMPORT) to include modules. This is the correct syntax.

### Step 2: Use Module Functions
Once added, you can call any function from the module using dot notation:

```susa
ADD math_utils

# Call functions directly
let result = math_utils.sqrt(16)
PRINT result  # Output: 4

# Use multiple functions
let power = math_utils.pow(2, 3)
PRINT power  # Output: 8

# Chain operations
let calc = math_utils.abs(math_utils.sin(PI / 2))
PRINT calc  # Output: 1
```

### Step 3: Access Module Constants
Some modules provide constants that you can use directly:

```susa
ADD math_utils

# Math constants are available after adding the module
PRINT PI              # Output: 3.14159...
PRINT E               # Output: 2.71828...
PRINT GOLDEN_RATIO    # Output: 1.61803...

# Use constants in calculations
let circumference = 2 * PI * 5
PRINT rt"Circumference: {circumference}"
```

### Using Multiple Modules Together
You can add and use multiple modules in the same program:

```susa
ADD math_utils
ADD string_utils
ADD array_utils

# Use functions from different modules
let numbers = [1, 2, 3, 4, 5]
let sum = array_utils.sum(numbers)
let avg = sum / array_utils.length(numbers)

# Format the output
let result_text = string_utils.upper("average")
PRINT rt"{result_text}: {avg}"

# Combine module functions
let rounded = math_utils.round(avg)
PRINT rt"Rounded: {rounded}"
```

### Module Function Syntax
All module functions follow this pattern:

```susa
module_name.function_name(parameters)
```

**Examples:**
```susa
ADD math_utils
ADD string_utils
ADD array_utils

# Math module
math_utils.sqrt(144)
math_utils.factorial(5)
math_utils.is_prime(17)

# String module
string_utils.upper("hello")
string_utils.split("a,b,c", ",")
string_utils.trim("  text  ")

# Array module
array_utils.sort_array([5, 2, 8])
array_utils.unique([1, 2, 2, 3])
array_utils.filter_array(arr, func)
```

---

## Quick Reference

### Most Used Functions

#### Math
- `math_utils.sqrt(x)` - Square root
- `math_utils.pow(base, exp)` - Power
- `math_utils.abs(x)` - Absolute value
- `math_utils.round(x)` - Round number
- `math_utils.random()` - Random 0-1
- `math_utils.random_int(min, max)` - Random integer

#### String
- `string_utils.upper(str)` - Uppercase
- `string_utils.lower(str)` - Lowercase
- `string_utils.split(str, delim)` - Split string
- `string_utils.join(delim, list)` - Join strings
- `string_utils.replace(str, old, new)` - Replace text
- `string_utils.strip(str)` - Trim whitespace

#### Array
- `array_utils.length(arr)` - Array length
- `array_utils.push(arr, item)` - Add to end
- `array_utils.pop(arr)` - Remove from end
- `array_utils.sort(arr)` - Sort array
- `array_utils.sum(arr)` - Sum elements
- `array_utils.average(arr)` - Average value

#### DateTime
- `datetime_utils.now()` - Current date/time
- `datetime_utils.today()` - Current date
- `datetime_utils.get_year()` - Current year
- `datetime_utils.get_month()` - Current month
- `datetime_utils.format_date(format)` - Format date

---

## Complete Example Program

```susa
// Multi-module example
ADD math_utils
ADD string_utils
ADD array_utils
ADD datetime_utils

// Header
let title = "SUSA Module Demo"
let separator = string_utils.repeat("=", 50)
PRINT separator
PRINT string_utils.title(title)
PRINT separator
PRINT ""

// Math operations
PRINT "Math Operations:"
let numbers = [10, 20, 30, 40, 50]
let sum = array_utils.sum(numbers)
let avg = array_utils.average(numbers)
PRINT "  Numbers: " + str(numbers)
PRINT "  Sum: " + str(sum)
PRINT "  Average: " + str(avg)
PRINT "  Square root of sum: " + str(math_utils.sqrt(sum))
PRINT ""

// String operations
PRINT "String Operations:"
let text = "hello world from susa"
PRINT "  Original: " + text
PRINT "  Title Case: " + string_utils.title(text)
PRINT "  Uppercase: " + string_utils.upper(text)
let words = string_utils.split(text, " ")
PRINT "  Word Count: " + str(array_utils.length(words))
PRINT ""

// Date and time
PRINT "Date and Time:"
PRINT "  Current Date: " + datetime_utils.today()
PRINT "  Current Time: " + datetime_utils.current_time()
PRINT "  Day of Week: " + datetime_utils.get_day_name()
PRINT "  Month: " + datetime_utils.get_month_name()
PRINT ""

// Random numbers
PRINT "Random Numbers:"
PRINT "  Random float: " + str(math_utils.random())
PRINT "  Random dice roll: " + str(math_utils.random_int(1, 6))
PRINT "  Random lottery: " + str(math_utils.random_int(1, 100))
PRINT ""

PRINT separator
PRINT "Demo completed successfully!"
PRINT separator
```

---

## Module Categories

### Data Processing
- **array_utils** - Array operations
- **string_utils** - String manipulation
- **json_utils** - JSON handling

### Mathematics
- **math_utils** - Mathematical functions
- **algorithms** - Sorting and searching

### System & I/O
- **file_utils** - File operations
- **http_client** - Web requests
- **datetime_utils** - Date and time

### Data Structures
- **data_structures** - Stack, Queue, LinkedList

---

## Getting Help

### In Documentation
Each module has detailed documentation with:
- Function descriptions
- Parameter explanations
- Return value descriptions
- Code examples
- Common use cases

### In Code
```susa
// Use descriptive variable names
let user_age = 25
let user_name = "Alice"

// Add comments
// Calculate the average of test scores
let scores = [85, 90, 78, 92]
let average = array_utils.average(scores)
```

---

## Best Practices

### 1. Import Only What You Need
```susa
// Good - only import needed modules
ADD math_utils
ADD string_utils

// Avoid importing all modules if not needed
```

### 2. Use Descriptive Names
```susa
// Good
let user_email = "user@example.com"
let is_valid = string_utils.contains(user_email, "@")

// Avoid
let e = "user@example.com"
let v = string_utils.contains(e, "@")
```

### 3. Check Return Values
```susa
ADD file_utils
if file_utils.file_exists("data.txt"):
START:
    let content = file_utils.read_file("data.txt")
    PRINT content
END:
```

### 4. Handle Errors
```susa
ADD array_utils
let arr = [1, 2, 3]
let index = 5

// Check bounds before accessing
if index < array_utils.length(arr):
START:
    PRINT arr[index]
END:
```

---

## Performance Tips

### 1. Reuse Results
```susa
// Good - calculate once
let arr_length = array_utils.length(arr)
LOOP i = 0 FOR arr_length TIMES:
START:
    PRINT arr[i]
END:

// Avoid - calculates every iteration
LOOP i = 0 FOR array_utils.length(arr) TIMES:
START:
    PRINT arr[i]
END:
```

### 2. Use Appropriate Data Structures
```susa
// For frequent additions/removals at ends
ADD data_structures
let stack = data_structures.create_stack()

// For ordered data with frequent searches
ADD array_utils
let sorted_arr = [1, 2, 3, 4, 5]
```

---

## Version Information

- **SUSA Version:** 1.0.0
- **Total Modules:** 9
- **Total Functions:** 200+
- **Last Updated:** February 2026

---

## Next Steps

1. **Explore Individual Modules:** Click on any module above for detailed documentation
2. **Try Examples:** Run the example code in SUSA IDE
3. **Build Projects:** Combine modules to create powerful applications
4. **Share:** Contribute your own modules to the SUSA community

---

**Happy Coding with SUSA! 🚀**

