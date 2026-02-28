# Expanding Remaining Modules - Guide

## Status

### ✅ Completed (Detailed Documentation Added)
1. **math_utils** - Fully expanded with comprehensive examples
2. **string_utils** - Fully expanded with comprehensive examples  
3. **array_utils** - Fully expanded with comprehensive examples

### ⏳ Remaining (Need Expansion)
4. **datetime_utils** - Currently brief, needs expansion
5. **file_utils** - Currently brief, needs expansion
6. **json_utils** - Currently brief, needs expansion
7. **http_client** - Currently brief, needs expansion
8. **data_structures** - Currently brief, needs expansion
9. **algorithms** - Currently brief, needs expansion

---

## What Needs to Be Done

Each remaining module in `src/data/modulesDocs.ts` needs:

### 1. Expanded `overview` Section
Change from brief 1-2 sentences to comprehensive 3-4 paragraphs including:
- What's Included (bullet list of all function categories)
- Performance metrics and implementation details
- Common Use Cases (detailed list with examples)
- Important Notes (gotchas, best practices, limitations)

### 2. Detailed `detailedFunctions` Array
Each function needs:
- **Longer description** (2-3 sentences explaining what it does, when to use it, why it's useful)
- **Detailed parameters** (explain each parameter, valid ranges, special cases)
- **Detailed returns** (explain return value, special cases, error conditions)
- **Comprehensive example** (5-15 lines showing real-world usage with comments)

### 3. Expanded `completeExample`
Change from 10-15 lines to 40-60 lines including:
- Section headers with comments
- Multiple practical examples
- Real-world use cases
- Output comments showing expected results
- Step-by-step explanations

---

## Template for Each Module

```typescript
module_name: {
  name: "module_name",
  displayName: "Module Name",
  version: "1.0.0",
  description: "One comprehensive sentence describing the module's purpose and main use cases",
  category: "Core/System/Data/Advanced",
  functions: XX,
  performance: "XXx faster",
  overview: `The Module Name module is your complete [purpose] toolkit for SUSA programming. It provides XX optimized functions for [main capabilities].

**What's Included:**
• Category 1: function1, function2, function3 - Brief description
• Category 2: function4, function5, function6 - Brief description
• Category 3: function7, function8, function9 - Brief description
• Category 4: function10, function11, function12 - Brief description

**Performance:**
All functions are implemented in optimized C++ code, making them XXx faster than equivalent pure SUSA implementations. Perfect for [specific use cases].

**Common Use Cases:**
• Use Case 1: Detailed explanation with context
• Use Case 2: Detailed explanation with context
• Use Case 3: Detailed explanation with context
• Use Case 4: Detailed explanation with context
• Use Case 5: Detailed explanation with context

**Important Notes:**
• Note 1: Important detail users should know
• Note 2: Gotcha or limitation to be aware of
• Note 3: Best practice or recommendation`,
  importExample: `ADD module_name`,
  quickFunctions: ["func1", "func2", "func3", "func4", "func5"],
  detailedFunctions: [
    {
      name: "function_name(params)",
      description: "Comprehensive 2-3 sentence description explaining what the function does, when to use it, and why it's useful. Include real-world context and practical applications.",
      parameters: "param1 (Type) - Detailed explanation of parameter, valid ranges, special cases\nparam2 (Type) - Detailed explanation of parameter, valid ranges, special cases",
      returns: "Type - Detailed explanation of return value, special cases, error conditions",
      example: `ADD module_name

# Practical example with context
let input = "example"
let result = module_name.function_name(input)
PRINT rt"Result: {result}"  # Output: expected_output

# Real-world use case
let data = [1, 2, 3]
LOOP i = 0 FOR module_name.length(data) TIMES: START:
    let processed = module_name.function_name(data[i])
    PRINT processed
END:

# Edge case handling
IF module_name.function_name(special_case): START:
    PRINT "Special case handled"
END:`
    }
  ],
  completeExample: `ADD module_name

# ============================================
# COMPREHENSIVE MODULE DEMONSTRATION
# ============================================

PRINT "=== SUSA Module Name Module ==="
PRINT ""

# Section 1: Basic Operations
PRINT "Basic Operations:"
let data = [example_data]
PRINT rt"  Input: {data}"
let result1 = module_name.function1(data)
PRINT rt"  Result: {result1}"
PRINT ""

# Section 2: Advanced Features
PRINT "Advanced Features:"
let advanced_input = example
let result2 = module_name.function2(advanced_input)
PRINT rt"  Advanced result: {result2}"
PRINT ""

# Section 3: Practical Example
PRINT "Practical Example - [Real World Scenario]:"
let practical_data = [real_data]
LOOP i = 0 FOR module_name.length(practical_data) TIMES: START:
    let processed = module_name.process(practical_data[i])
    PRINT rt"  Item {i + 1}: {processed}"
END:
PRINT ""

# Section 4: Edge Cases
PRINT "Edge Cases:"
let edge_case = special_value
IF module_name.validate(edge_case): START:
    PRINT "  Edge case handled correctly"
END:`,
  relatedModules: ["related1", "related2"]
}
```

---

## Specific Guidance for Each Module

### datetime_utils
**Focus on:**
- Current time functions (now, today, timestamp)
- Date component extraction (year, month, day, hour, minute, second)
- Date formatting (format_date with various patterns)
- Date arithmetic (add_days, add_hours, diff_days)
- Date validation (is_leap_year, is_weekend, days_in_month)
- Practical examples: scheduling, age calculation, time tracking

### file_utils
**Focus on:**
- Basic file I/O (read_file, write_file, append_file)
- File operations (copy_file, delete_file, move_file)
- Directory operations (list_directory, create_directory)
- File information (file_exists, file_size, get_extension)
- Path manipulation (join_path, get_filename, get_directory)
- Practical examples: log files, configuration files, data persistence

### json_utils
**Focus on:**
- Parsing (parse - convert JSON string to object)
- Stringification (stringify - convert object to JSON string)
- Validation (validate - check if valid JSON)
- Pretty printing (pretty_print - formatted JSON output)
- Value access (get_value, set_value - navigate JSON structures)
- Practical examples: API responses, configuration files, data exchange

### http_client
**Focus on:**
- HTTP methods (get, post, put, delete, patch)
- Request configuration (headers, params, timeout)
- Response handling (status_code, body, headers)
- Authentication (add_bearer_token, basic_auth)
- File operations (download_file, upload_file)
- Practical examples: API calls, web scraping, file downloads

### data_structures
**Focus on:**
- Stack (LIFO operations: push, pop, peek)
- Queue (FIFO operations: enqueue, dequeue, front)
- HashMap (key-value storage: put, get, remove, has_key)
- BinaryTree (tree operations: insert, search, traversal)
- Graph (graph operations: add_vertex, add_edge, bfs, dfs)
- Practical examples: undo/redo, task queues, caching, tree traversal

### algorithms
**Focus on:**
- Sorting algorithms (quick_sort, merge_sort, bubble_sort, heap_sort)
- Searching algorithms (binary_search, linear_search, jump_search)
- Graph algorithms (bfs, dfs, dijkstra, bellman_ford)
- Dynamic programming (fibonacci, knapsack, longest_common_subsequence)
- String algorithms (levenshtein_distance, pattern_matching)
- Practical examples: data sorting, pathfinding, optimization problems

---

## How to Apply Changes

1. Open `susa-the-ai-language-reveal-main/src/data/modulesDocs.ts`
2. Find each module section (search for `module_name: {`)
3. Replace the brief content with expanded content following the template
4. Ensure all code examples use `ADD module_name` syntax (not IMPORT)
5. Test that TypeScript compiles without errors
6. Build and preview the website

---

## Example: Before vs After

### BEFORE (Brief)
```typescript
datetime_utils: {
  name: "datetime_utils",
  displayName: "DateTime Utils",
  version: "1.0.0",
  description: "Date and time manipulation functions",
  category: "Core",
  functions: 28,
  performance: "40x faster",
  overview: `Complete date and time operations including formatting, arithmetic, validation, and timezone handling.`,
  importExample: `ADD datetime_utils`,
  quickFunctions: ["now", "today", "format_date", "add_days"],
  detailedFunctions: [
    {
      name: "now()",
      description: "Get current date/time",
      parameters: "None",
      returns: "String - Current date/time",
      example: `PRINT now()  # Output: "2024-02-20 14:30:45"`
    }
  ],
  completeExample: `ADD datetime_utils
PRINT now()
PRINT today()`,
  relatedModules: ["string_utils"]
}
```

### AFTER (Detailed)
```typescript
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
• Current Time Functions: now, today, current_time, timestamp - Get current date/time
• Date Components: get_year, get_month, get_day, get_hour, get_minute, get_second - Extract parts
• Date Formatting: format_date with patterns (%Y, %m, %d, %H, %M, %S) - Custom formats
• Date Arithmetic: add_days, add_hours, add_minutes, diff_days, diff_hours - Calculate differences
• Date Validation: is_leap_year, is_weekend, is_weekday, days_in_month - Validate dates
• Day/Month Names: get_day_name, get_month_name - Human-readable names

**Performance:**
All functions are implemented in optimized C++ code, making them 40x faster than equivalent pure SUSA implementations. Perfect for scheduling systems, time tracking, log analysis, and any application requiring date/time operations.

**Common Use Cases:**
• Scheduling: Calculate appointment times, check availability, manage calendars
• Time Tracking: Log events, calculate durations, track work hours
• Age Calculation: Calculate ages, check eligibility, validate birthdates
• Data Analysis: Analyze time-series data, group by date, find patterns
• Reminders: Calculate due dates, check deadlines, send notifications
• Logging: Timestamp events, format log entries, analyze log files

**Important Notes:**
• All times are in local timezone unless specified
• Date formats use strftime-style patterns (%Y for year, %m for month, etc.)
• Timestamps are Unix time (seconds since January 1, 1970)
• Leap years are automatically handled in date calculations`,
  importExample: `ADD datetime_utils`,
  quickFunctions: ["now", "today", "format_date", "add_days", "diff_days", "is_leap_year"],
  detailedFunctions: [
    {
      name: "now() and today()",
      description: "Get the current date and time. now() returns full date and time with seconds. today() returns only the date. Essential for timestamping events, logging, scheduling, and any operation requiring the current moment. These functions always return the current local time.",
      parameters: "None - These functions take no parameters",
      returns: "now() returns String in format 'YYYY-MM-DD HH:MM:SS' (e.g., '2024-02-20 14:30:45')\ntoday() returns String in format 'YYYY-MM-DD' (e.g., '2024-02-20')",
      example: `ADD datetime_utils

# Timestamp an event
let event_time = datetime_utils.now()
PRINT rt"Event occurred at: {event_time}"
# Output: Event occurred at: 2024-02-20 14:30:45

# Get today's date for comparison
let today = datetime_utils.today()
PRINT rt"Today is: {today}"
# Output: Today is: 2024-02-20

# Log file entry
let log_entry = rt"{datetime_utils.now()} - User logged in"
PRINT log_entry
# Output: 2024-02-20 14:30:45 - User logged in

# Check if event is today
let event_date = "2024-02-20"
IF event_date == datetime_utils.today(): START:
    PRINT "Event is today!"
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
PRINT rt"  Now: {datetime_utils.now()}"
PRINT rt"  Today: {datetime_utils.today()}"
PRINT rt"  Time: {datetime_utils.current_time()}"
PRINT rt"  Timestamp: {datetime_utils.timestamp()}"
PRINT ""

# Date Components
PRINT "Date Components:"
PRINT rt"  Year: {datetime_utils.get_year()}"
PRINT rt"  Month: {datetime_utils.get_month()}"
PRINT rt"  Day: {datetime_utils.get_day()}"
PRINT rt"  Day Name: {datetime_utils.get_day_name()}"
PRINT rt"  Month Name: {datetime_utils.get_month_name()}"
PRINT ""

# Date Formatting
PRINT "Date Formatting:"
let iso_date = datetime_utils.format_date("%Y-%m-%d")
let us_date = datetime_utils.format_date("%m/%d/%Y")
let full_date = datetime_utils.format_date("%A, %B %d, %Y")
PRINT rt"  ISO Format: {iso_date}"
PRINT rt"  US Format: {us_date}"
PRINT rt"  Full Format: {full_date}"
PRINT ""

# Date Arithmetic
PRINT "Date Arithmetic:"
let tomorrow = datetime_utils.add_days(1)
let next_week = datetime_utils.add_days(7)
let in_2_hours = datetime_utils.add_hours(2)
PRINT rt"  Tomorrow: {tomorrow}"
PRINT rt"  Next Week: {next_week}"
PRINT rt"  In 2 Hours: {in_2_hours}"
PRINT ""

# Date Validation
PRINT "Date Validation:"
let current_year = datetime_utils.get_year()
let is_leap = datetime_utils.is_leap_year(current_year)
let is_weekend = datetime_utils.is_weekend()
PRINT rt"  Is {current_year} a leap year? {is_leap}"
PRINT rt"  Is it weekend? {is_weekend}"
PRINT ""

# Practical Example: Age Calculator
PRINT "Practical Example - Age Calculator:"
let birth_year = 1990
let current_year_val = datetime_utils.get_year()
let age = current_year_val - birth_year
PRINT rt"  Birth Year: {birth_year}"
PRINT rt"  Current Year: {current_year_val}"
PRINT rt"  Age: {age} years old"`,
  relatedModules: ["string_utils"]
}
```

---

## Next Steps

1. Continue expanding the remaining 6 modules following this template
2. Ensure all examples use correct `ADD module_name` syntax
3. Test TypeScript compilation: `npm run build`
4. Preview website: `npm run preview`
5. Deploy when all modules are expanded

---

*Guide Created: February 2026*  
*Status: 3/9 modules completed*  
*Remaining: datetime_utils, file_utils, json_utils, http_client, data_structures, algorithms*
