# Missing Features in C++ Interpreter

## Compared to Python Version

### 1. String Interpolation (rt"...")
**Status:** ❌ Not implemented
**Example:**
```susa
let name = "John"
let age = 25
PRINT rt"Name: {name}, Age: {age}"
```

### 2. Type Declarations
**Status:** ❌ Not implemented
**Example:**
```susa
int age = 25
string name = "John"
bool isReady = true
```
**Current:** Only `let` is supported

### 3. USE PYTHON: Blocks
**Status:** ❌ Token exists but not implemented
**Example:**
```susa
FUNC get_data(): START:
    USE PYTHON: START:
    "
    import requests
    return requests.get('https://api.example.com').json()
    "
    END:
END:
```

### 4. USE C: Blocks
**Status:** ❌ Not implemented
**Example:**
```susa
FUNC fast_calculation(n): START:
    USE C: START:
    "
    int result = 0;
    for(int i = 0; i < n; i++) {
        result += i * i;
    }
    return result;
    "
    END:
END:
```

### 5. Multi-line Strings
**Status:** ❓ Unknown
**Example:**
```susa
let text = """
This is a
multi-line
string
"""
```

## Implementation Priority

### High Priority (Breaking current code):
1. ✅ Type declarations (int, string, bool) - Parse but treat as let
2. ✅ String interpolation (rt"...{var}...")
3. ❌ USE PYTHON: blocks

### Medium Priority:
4. ❌ USE C: blocks
5. ❌ Better error messages
6. ❌ Multi-line strings

### Low Priority:
7. ❌ Advanced module features
8. ❌ Decorators
9. ❌ Async/await

## Quick Fix Solution

For now, the IDE should:
1. Detect if code uses advanced features (rt"", int/string/bool, USE blocks)
2. If yes, use Python interpreter (if available)
3. If no, use C++ interpreter for speed

This gives users:
- ✅ Fast execution for simple code (C++)
- ✅ Full features for complex code (Python)
- ✅ Backward compatibility
