# String Utils Module

## Overview
The `string_utils` module provides comprehensive string manipulation functions including case conversion, trimming, searching, splitting, and transformation operations.

## Import
```susa
ADD string_utils
```

---

## Length and Size

### len(str)
Returns the length of a string or list.

**Parameters:**
- `str` (string or list): The string or list to measure

**Returns:** Number of characters in string or elements in list

**Example:**
```susa
ADD string_utils
PRINT string_utils.len("Hello")         // Output: 5
PRINT string_utils.len("SUSA")          // Output: 4
PRINT string_utils.len("")              // Output: 0
```

---

## Case Conversion

### upper(str)
Converts all characters in a string to uppercase.

**Parameters:**
- `str` (string): The string to convert

**Returns:** String with all uppercase letters

**Example:**
```susa
ADD string_utils
PRINT string_utils.upper("hello")       // Output: HELLO
PRINT string_utils.upper("Hello World") // Output: HELLO WORLD
PRINT string_utils.upper("susa123")     // Output: SUSA123
```

---

### lower(str)
Converts all characters in a string to lowercase.

**Parameters:**
- `str` (string): The string to convert

**Returns:** String with all lowercase letters

**Example:**
```susa
ADD string_utils
PRINT string_utils.lower("HELLO")       // Output: hello
PRINT string_utils.lower("Hello World") // Output: hello world
PRINT string_utils.lower("SUSA123")     // Output: susa123
```

---

### capitalize(str)
Capitalizes the first character of a string.

**Parameters:**
- `str` (string): The string to capitalize

**Returns:** String with first character uppercase, rest unchanged

**Example:**
```susa
ADD string_utils
PRINT string_utils.capitalize("hello")      // Output: Hello
PRINT string_utils.capitalize("world")      // Output: World
PRINT string_utils.capitalize("susa lang")  // Output: Susa lang
```

---

### title(str)
Converts string to title case (first letter of each word capitalized).

**Parameters:**
- `str` (string): The string to convert

**Returns:** String in title case

**Example:**
```susa
ADD string_utils
PRINT string_utils.title("hello world")         // Output: Hello World
PRINT string_utils.title("the quick brown fox") // Output: The Quick Brown Fox
PRINT string_utils.title("susa programming")    // Output: Susa Programming
```

---

## Trimming and Whitespace

### strip(str)
Removes leading and trailing whitespace from a string.

**Parameters:**
- `str` (string): The string to trim

**Returns:** String with whitespace removed from both ends

**Example:**
```susa
ADD string_utils
PRINT string_utils.strip("  hello  ")      // Output: hello
PRINT string_utils.strip("\n\tworld\n")    // Output: world
PRINT string_utils.strip("   SUSA   ")     // Output: SUSA
```

---

### lstrip(str)
Removes leading (left) whitespace from a string.

**Parameters:**
- `str` (string): The string to trim

**Returns:** String with whitespace removed from the left

**Example:**
```susa
ADD string_utils
PRINT string_utils.lstrip("  hello")       // Output: hello
PRINT string_utils.lstrip("\n\tworld")     // Output: world
PRINT string_utils.lstrip("   SUSA   ")    // Output: SUSA   
```

---

### rstrip(str)
Removes trailing (right) whitespace from a string.

**Parameters:**
- `str` (string): The string to trim

**Returns:** String with whitespace removed from the right

**Example:**
```susa
ADD string_utils
PRINT string_utils.rstrip("hello  ")       // Output: hello
PRINT string_utils.rstrip("world\n\t")     // Output: world
PRINT string_utils.rstrip("   SUSA   ")    // Output:    SUSA
```

---

## String Replacement

### replace(str, old, new)
Replaces all occurrences of a substring with another string.

**Parameters:**
- `str` (string): The original string
- `old` (string): The substring to replace
- `new` (string): The replacement string

**Returns:** String with all occurrences replaced

**Example:**
```susa
ADD string_utils
PRINT string_utils.replace("Hello World", "World", "SUSA")  // Output: Hello SUSA
PRINT string_utils.replace("aaa", "a", "b")                 // Output: bbb
PRINT string_utils.replace("one two one", "one", "three")   // Output: three two three
```

---

## String Splitting and Joining

### split(str, delimiter)
Splits a string into a list of substrings.

**Parameters:**
- `str` (string): The string to split
- `delimiter` (string, optional): The separator (default: space)

**Returns:** List of substrings

**Example:**
```susa
ADD string_utils
let words = string_utils.split("Hello World SUSA")
PRINT words[0]  // Output: Hello

let csv = string_utils.split("apple,banana,orange", ",")
PRINT csv[1]    // Output: banana

let path = string_utils.split("C:\\Users\\Documents", "\\")
PRINT path[2]   // Output: Documents
```

---

### join(delimiter, list)
Joins a list of strings into a single string.

**Parameters:**
- `delimiter` (string): The separator to use
- `list` (list): List of strings to join

**Returns:** Single joined string

**Example:**
```susa
ADD string_utils
let words = ["Hello", "World", "SUSA"]
PRINT string_utils.join(" ", words)     // Output: Hello World SUSA

let items = ["apple", "banana", "orange"]
PRINT string_utils.join(", ", items)    // Output: apple, banana, orange

let path = ["C:", "Users", "Documents"]
PRINT string_utils.join("\\", path)     // Output: C:\Users\Documents
```

---

## String Searching

### startswith(str, prefix)
Checks if a string starts with a specific prefix.

**Parameters:**
- `str` (string): The string to check
- `prefix` (string): The prefix to look for

**Returns:** true if string starts with prefix, false otherwise

**Example:**
```susa
ADD string_utils
PRINT string_utils.startswith("Hello World", "Hello")   // Output: true
PRINT string_utils.startswith("Hello World", "World")   // Output: false
PRINT string_utils.startswith("SUSA", "SU")             // Output: true
```

---

### endswith(str, suffix)
Checks if a string ends with a specific suffix.

**Parameters:**
- `str` (string): The string to check
- `suffix` (string): The suffix to look for

**Returns:** true if string ends with suffix, false otherwise

**Example:**
```susa
ADD string_utils
PRINT string_utils.endswith("Hello World", "World")     // Output: true
PRINT string_utils.endswith("Hello World", "Hello")     // Output: false
PRINT string_utils.endswith("file.txt", ".txt")         // Output: true
```

---

### contains(str, substring)
Checks if a string contains a substring.

**Parameters:**
- `str` (string): The string to search in
- `substring` (string): The substring to look for

**Returns:** true if substring is found, false otherwise

**Example:**
```susa
ADD string_utils
PRINT string_utils.contains("Hello World", "World")     // Output: true
PRINT string_utils.contains("Hello World", "SUSA")      // Output: false
PRINT string_utils.contains("programming", "gram")      // Output: true
```

---

### count(str, substring)
Counts how many times a substring appears in a string.

**Parameters:**
- `str` (string): The string to search in
- `substring` (string): The substring to count

**Returns:** Number of occurrences

**Example:**
```susa
ADD string_utils
PRINT string_utils.count("hello hello hello", "hello")  // Output: 3
PRINT string_utils.count("aaa", "a")                    // Output: 3
PRINT string_utils.count("one two three", "o")          // Output: 2
```

---

## String Transformation

### reverse(str)
Reverses a string.

**Parameters:**
- `str` (string): The string to reverse

**Returns:** Reversed string

**Example:**
```susa
ADD string_utils
PRINT string_utils.reverse("Hello")     // Output: olleH
PRINT string_utils.reverse("SUSA")      // Output: ASUS
PRINT string_utils.reverse("12345")     // Output: 54321
```

---

### repeat(str, times)
Repeats a string multiple times.

**Parameters:**
- `str` (string): The string to repeat
- `times` (integer): Number of times to repeat

**Returns:** Repeated string

**Example:**
```susa
ADD string_utils
PRINT string_utils.repeat("Ha", 3)      // Output: HaHaHa
PRINT string_utils.repeat("*", 5)       // Output: *****
PRINT string_utils.repeat("SUSA ", 2)   // Output: SUSA SUSA 
```

---

## String Padding

### pad_left(str, width, fill)
Pads a string on the left to reach a specified width.

**Parameters:**
- `str` (string): The string to pad
- `width` (integer): Target width
- `fill` (string, optional): Character to pad with (default: space)

**Returns:** Left-padded string

**Example:**
```susa
ADD string_utils
PRINT string_utils.pad_left("5", 3, "0")        // Output: 005
PRINT string_utils.pad_left("Hello", 10, " ")   // Output:      Hello
PRINT string_utils.pad_left("42", 5, "0")       // Output: 00042
```

---

### pad_right(str, width, fill)
Pads a string on the right to reach a specified width.

**Parameters:**
- `str` (string): The string to pad
- `width` (integer): Target width
- `fill` (string, optional): Character to pad with (default: space)

**Returns:** Right-padded string

**Example:**
```susa
ADD string_utils
PRINT string_utils.pad_right("5", 3, "0")       // Output: 500
PRINT string_utils.pad_right("Hello", 10, " ")  // Output: Hello     
PRINT string_utils.pad_right("42", 5, "-")      // Output: 42---
```

---

## Complete Example

```susa
// Import the string_utils module
ADD string_utils

// Case conversion
let text = "hello world"
PRINT "Original: " + text
PRINT "Upper: " + string_utils.upper(text)
PRINT "Title: " + string_utils.title(text)
PRINT "Capitalized: " + string_utils.capitalize(text)

// Trimming
let messy = "   SUSA Programming   "
PRINT "Original: '" + messy + "'"
PRINT "Stripped: '" + string_utils.strip(messy) + "'"

// Replacement
let sentence = "I love Python"
PRINT string_utils.replace(sentence, "Python", "SUSA")

// Splitting and joining
let csv = "apple,banana,orange,grape"
let fruits = string_utils.split(csv, ",")
PRINT "First fruit: " + fruits[0]
PRINT "Last fruit: " + fruits[3]

let joined = string_utils.join(" | ", fruits)
PRINT "Joined: " + joined

// Searching
let filename = "document.txt"
if string_utils.endswith(filename, ".txt"):
START:
    PRINT "This is a text file"
END:

// Checking content
let email = "user@example.com"
if string_utils.contains(email, "@"):
START:
    PRINT "Valid email format"
END:

// Counting
let repeated = "hello hello hello"
let count = string_utils.count(repeated, "hello")
PRINT "The word 'hello' appears " + str(count) + " times"

// Transformation
let word = "SUSA"
PRINT "Reversed: " + string_utils.reverse(word)
PRINT "Repeated: " + string_utils.repeat(word + " ", 3)

// Padding
let number = "42"
PRINT "Padded: " + string_utils.pad_left(number, 5, "0")
```

---

## Function Summary

| Category | Functions |
|----------|-----------|
| **Length** | len |
| **Case** | upper, lower, capitalize, title |
| **Trimming** | strip, lstrip, rstrip |
| **Replacement** | replace |
| **Split/Join** | split, join |
| **Searching** | startswith, endswith, contains, count |
| **Transform** | reverse, repeat |
| **Padding** | pad_left, pad_right |

**Total:** 18 functions

---

## Common Use Cases

### 1. Cleaning User Input
```susa
ADD string_utils
let input = "  John Doe  "
let cleaned = string_utils.strip(input)
let formatted = string_utils.title(cleaned)
PRINT formatted  // Output: John Doe
```

### 2. Parsing CSV Data
```susa
ADD string_utils
let csv_line = "John,25,Engineer"
let fields = string_utils.split(csv_line, ",")
PRINT "Name: " + fields[0]
PRINT "Age: " + fields[1]
PRINT "Job: " + fields[2]
```

### 3. Building File Paths
```susa
ADD string_utils
let parts = ["C:", "Users", "Documents", "file.txt"]
let path = string_utils.join("\\", parts)
PRINT path  // Output: C:\Users\Documents\file.txt
```

### 4. Formatting Output
```susa
ADD string_utils
let name = "SUSA"
let version = "1.0"
let separator = string_utils.repeat("=", 40)
PRINT separator
PRINT string_utils.title(name) + " Version " + version
PRINT separator
```

### 5. Validating Input
```susa
ADD string_utils
let email = "user@example.com"
let has_at = string_utils.contains(email, "@")
let has_dot = string_utils.contains(email, ".")

if has_at AND has_dot:
START:
    PRINT "Email format looks valid"
END:
```

