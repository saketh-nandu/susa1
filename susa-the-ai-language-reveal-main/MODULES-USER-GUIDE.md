# SUSA Modules - User Guide

## Welcome to SUSA Modules! 🚀

This guide will help you navigate and use the SUSA modules documentation on the website.

---

## What Are SUSA Modules?

SUSA comes with **9 powerful modules** containing **200+ functions** for common programming tasks:

1. **Math Utils** - Mathematical operations (40 functions)
2. **String Utils** - String manipulation (18 functions)
3. **Array Utils** - Array operations (50+ functions)
4. **DateTime Utils** - Date and time (28 functions)
5. **File Utils** - File operations (35 functions)
6. **JSON Utils** - JSON handling (22 functions)
7. **HTTP Client** - Web requests (20 functions)
8. **Data Structures** - Stack, Queue, Tree, etc. (9 classes)
9. **Algorithms** - Sorting, searching, etc. (30+ functions)

**All modules are built-in** - no installation required!

---

## How to Use the Modules Page

### Step 1: Browse Modules

When you visit `/modules`, you'll see:

```
┌─────────────────────────────────────────────────┐
│         SUSA Modules                            │
│    200+ Functions Across 9 Modules              │
│                                                 │
│  [9 Modules] [200+ Functions] [10-100x] [0 Deps]│
│                                                 │
│  🔍 [Search modules...]                         │
│  [All] [Core] [System] [Data] [Network] [Adv]  │
│                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌───────────┐ │
│  │ 📦 Math     │ │ 📦 String   │ │ 📦 Array  │ │
│  │ Utils       │ │ Utils       │ │ Utils     │ │
│  │             │ │             │ │           │ │
│  │ 40 functions│ │ 18 functions│ │ 50+ funcs │ │
│  │ 100x faster │ │ 30x faster  │ │ 50x faster│ │
│  │             │ │             │ │           │ │
│  │ [View Docs] │ │ [View Docs] │ │ [View Docs]│
│  └─────────────┘ └─────────────┘ └───────────┘ │
│                                                 │
│  ... 6 more modules ...                        │
└─────────────────────────────────────────────────┘
```

**Features:**
- **Search**: Type to find modules by name or description
- **Filter**: Click category buttons to filter modules
- **Click**: Click any module card to view documentation

---

### Step 2: View Module Documentation

Click any module to see its full documentation:

```
┌─────────────────────────────────────────────────┐
│  ← Back to Modules        Math Utils v1.0       │
├─────────────────────────────────────────────────┤
│                                                 │
│  📦 Math Utils                                  │
│  Advanced mathematical functions and operations │
│                                                 │
│  📊 40 functions  ⚡ 100x faster  🏷️ Core      │
│                                                 │
│  The Math Utils module provides comprehensive   │
│  mathematical operations including basic        │
│  arithmetic, trigonometry, logarithms...        │
│                                                 │
├─────────────────────────────────────────────────┤
│  📄 Import                                      │
│  ┌───────────────────────────────────────────┐ │
│  │ ADD math_utils                   [Copy]   │ │
│  └───────────────────────────────────────────┘ │
├─────────────────────────────────────────────────┤
│  ⚡ Quick Reference                             │
│  [sqrt] [pow] [abs] [round] [sin] [cos] [tan]  │
│  [factorial] [gcd] [lcm] [is_prime] [random]   │
├─────────────────────────────────────────────────┤
│  📖 Function Documentation                      │
│  ─────────────────────────────────────────────  │
│  sqrt(x)                                        │
│  Calculate square root of a number              │
│                                                 │
│  Parameters:                                    │
│  x (Number) - The number to calculate sqrt of  │
│                                                 │
│  Returns: Number - Square root of x             │
│                                                 │
│  Example:                              [Copy]   │
│  ┌───────────────────────────────────────────┐ │
│  │ let result = sqrt(16)                     │ │
│  │ PRINT result  # Output: 4                 │ │
│  └───────────────────────────────────────────┘ │
│  ─────────────────────────────────────────────  │
│  pow(base, exponent)                            │
│  Calculate base raised to exponent power        │
│  ...                                            │
│  ─────────────────────────────────────────────  │
│  ... more functions ...                         │
├─────────────────────────────────────────────────┤
│  💻 Complete Example                   [Copy]   │
│  ┌───────────────────────────────────────────┐ │
│  │ ADD math_utils                            │ │
│  │                                           │ │
│  │ # Basic operations                        │ │
│  │ let num = -15.7                           │ │
│  │ PRINT rt"Absolute: {abs(num)}"            │ │
│  │ PRINT rt"Rounded: {round(num)}"           │ │
│  │ PRINT rt"Square root: {sqrt(144)}"        │ │
│  │                                           │ │
│  │ # Trigonometry                            │ │
│  │ let angle = PI / 4                        │ │
│  │ PRINT rt"sin(45°): {sin(angle)}"          │ │
│  │ ...                                       │ │
│  └───────────────────────────────────────────┘ │
├─────────────────────────────────────────────────┤
│  🔗 Related Modules                             │
│  [Array Utils →] [Algorithms →]                 │
└─────────────────────────────────────────────────┘
```

---

## Key Features

### 1. 🔍 Search Modules
Type in the search box to find modules:
- Search by name: "math", "string", "array"
- Search by description: "date", "file", "http"

### 2. 🏷️ Filter by Category
Click category buttons to filter:
- **All** - Show all modules
- **Core** - Math, String, Array, DateTime
- **System** - File operations
- **Data** - JSON handling
- **Network** - HTTP requests
- **Advanced** - Data structures, Algorithms

### 3. 📋 Copy Code Examples
Every code example has a **[Copy]** button:
1. Click the copy button
2. Code is copied to clipboard
3. Paste into your SUSA code editor

### 4. 🔗 Navigate Related Modules
At the bottom of each module doc:
- See related modules
- Click to jump to their documentation
- Explore connected functionality

### 5. ⬅️ Easy Navigation
- **Back to Modules** button at top
- Returns to module list
- Keeps your search/filter settings

---

## Example Usage Flow

### Scenario: You want to work with arrays

1. **Visit** `/modules`
2. **Search** for "array" or click **Core** category
3. **Click** "Array Utils" card
4. **Read** overview and import instructions
5. **Browse** function documentation
6. **Copy** example code you need
7. **Try** in SUSA IDE or CLI

### Scenario: You need to make HTTP requests

1. **Visit** `/modules`
2. **Click** "Network" category
3. **Click** "HTTP Client" card
4. **Read** about `get()`, `post()` functions
5. **Copy** authentication example
6. **Use** in your SUSA project

---

## Tips & Tricks

### 💡 Quick Tips

1. **Bookmark Modules Page**
   - Save `/modules` for quick access
   - Reference while coding

2. **Use Quick Reference**
   - See all function names at a glance
   - Find what you need quickly

3. **Copy Complete Examples**
   - Start with working code
   - Modify for your needs

4. **Explore Related Modules**
   - Discover complementary functions
   - Build more powerful programs

5. **Mobile Friendly**
   - Works great on phones/tablets
   - Reference docs anywhere

### 🎯 Best Practices

1. **Read Overview First**
   - Understand module purpose
   - Know what's available

2. **Check Parameters**
   - Know what each function needs
   - Avoid errors

3. **Try Examples**
   - Copy and run examples
   - Learn by doing

4. **Combine Modules**
   - Use multiple modules together
   - Build complex applications

---

## Common Questions

### Q: Do I need to install modules?
**A:** No! All modules are built into SUSA. Just import and use.

### Q: How do I import a module?
**A:** Use `ADD module_name` at the top of your code.

### Q: Can I use multiple modules?
**A:** Yes! Import as many as you need:
```susa
ADD math_utils
ADD string_utils
ADD array_utils
```

### Q: Are modules free?
**A:** Yes! All modules are included with SUSA at no cost.

### Q: How do I know which module to use?
**A:** Check the module descriptions and categories. Use search to find specific functionality.

### Q: Can I see all functions?
**A:** Yes! Click any module to see complete function documentation.

### Q: Do examples work in both CLI and IDE?
**A:** Yes! All examples work in both SUSA CLI and SUSA IDE.

---

## Module Quick Reference

| Module | Use For | Top Functions |
|--------|---------|---------------|
| Math Utils | Calculations | sqrt, pow, sin, cos, factorial |
| String Utils | Text processing | upper, lower, split, join, trim |
| Array Utils | List operations | sort, filter, map, unique, chunk |
| DateTime Utils | Dates/times | now, today, format_date, add_days |
| File Utils | File I/O | read_file, write_file, exists |
| JSON Utils | JSON data | parse, stringify, get_value |
| HTTP Client | Web requests | get, post, download_file |
| Data Structures | Advanced data | Stack, Queue, HashMap, Tree |
| Algorithms | Sorting/searching | quick_sort, binary_search, bfs |

---

## Getting Help

### 📚 Resources
- **Module Docs**: Click any module for full documentation
- **Examples Page**: `/examples` for more code samples
- **Full Docs**: `/docs` for complete SUSA documentation

### 💬 Support
- Check function documentation for usage
- Try the complete examples
- Explore related modules
- Visit community forums

---

## Start Exploring!

Ready to use SUSA modules? Here's how:

1. **Visit** [/modules](/modules) on the website
2. **Browse** the 9 available modules
3. **Click** any module to view documentation
4. **Copy** examples and try them
5. **Build** amazing SUSA programs!

---

**Happy Coding with SUSA! 🚀**

All modules are built-in, optimized, and ready to use.  
No installation. No dependencies. Just pure performance.

---

*Last Updated: February 2026*  
*SUSA Version: 1.0.0*
