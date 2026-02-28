# Next 5 Features - Batch 4

## Features to Implement

### 1. FUNC (Function Declarations) 🎯
**Priority:** HIGH - Required for many other features
**Syntax:**
```susa
FUNC add(a, b): START:
    RETURN a + b
END:

FUNC greet(name): START:
    PRINT "Hello, " + name
END:
```

**Implementation:**
- Parse FUNC keyword with parameters
- Create function storage in interpreter
- Handle RETURN statement
- Support function calls with arguments
- Create new environment for function scope

**Complexity:** High (300 lines)
**Why:** Enables proper static variables, recursion, and code organization

---

### 2. RETURN Statement 🔙
**Priority:** HIGH - Required for FUNC
**Syntax:**
```susa
FUNC calculate(x): START:
    RETURN x * 2 + 10
END:
```

**Implementation:**
- Add RETURN token (already exists)
- Set return_flag and return_value
- Exit function execution
- Return value to caller

**Complexity:** Low (50 lines)
**Why:** Essential for function declarations

---

### 3. Try-Catch (Error Handling) 🛡️
**Priority:** MEDIUM - Improves robustness
**Syntax:**
```susa
TRY: START:
    let result = 10 / 0
    PRINT result
END:
CATCH error: START:
    PRINT "Error: " + error
END:
```

**Implementation:**
- Parse TRY/CATCH blocks
- Wrap execution in try-catch
- Capture exceptions
- Execute catch block with error message

**Complexity:** Medium (150 lines)
**Why:** Professional error handling

---

### 4. Dictionary Literals {} 📦
**Priority:** MEDIUM - Enables object spread
**Syntax:**
```susa
let person = {"name": "John", "age": 25}
PRINT person["name"]

let config = {
    "host": "localhost",
    "port": 8080,
    "debug": true
}
```

**Implementation:**
- Parse {} syntax in evaluate_primary
- Support key-value pairs
- Handle string keys
- Support dict access with []
- Enable spread operator for dicts

**Complexity:** Medium (200 lines)
**Why:** Completes spread operator, enables data structures

---

### 5. List Methods (push, pop, append) 📋
**Priority:** MEDIUM - Improves usability
**Syntax:**
```susa
let arr = [1, 2, 3]
arr.push(4)          # [1, 2, 3, 4]
let last = arr.pop() # last = 4, arr = [1, 2, 3]
arr.append(5)        # [1, 2, 3, 5]
```

**Implementation:**
- Parse method call syntax: `arr.method()`
- Implement push (add to end)
- Implement pop (remove from end)
- Implement append (alias for push)
- Modify list in place

**Complexity:** Low (100 lines)
**Why:** Essential list operations

---

## Total Estimated Lines: ~800 lines

## Implementation Order

1. **RETURN statement** (prerequisite for FUNC)
2. **FUNC declarations** (enables proper functions)
3. **Dictionary literals** (completes data structures)
4. **List methods** (improves usability)
5. **Try-Catch** (adds robustness)

## Testing Strategy

Create `test_batch_4_features.susa`:
```susa
# 1. Functions with return
FUNC add(a, b): START:
    RETURN a + b
END:
PRINT "add(5, 3) = " + STR(add(5, 3))

# 2. Recursive function
FUNC factorial(n): START:
    IF n <= 1: START:
        RETURN 1
    END:
    RETURN n * factorial(n - 1)
END:
PRINT "factorial(5) = " + STR(factorial(5))

# 3. Dictionary literals
let person = {"name": "Alice", "age": 30}
PRINT "Name: " + person["name"]

# 4. List methods
let nums = [1, 2, 3]
nums.push(4)
PRINT "After push: " + STR(nums)
let last = nums.pop()
PRINT "Popped: " + STR(last)

# 5. Try-Catch
TRY: START:
    let x = 10 / 0
END:
CATCH error: START:
    PRINT "Caught error: " + error
END:
```

## Timeline

- **Day 1 (4 hours):** RETURN + FUNC
- **Day 2 (3 hours):** Dictionary literals + List methods
- **Day 3 (2 hours):** Try-Catch + Testing

Total: ~9 hours

## Benefits

After this batch:
- ✅ Proper function declarations
- ✅ Code organization and reusability
- ✅ Complete data structures (lists + dicts)
- ✅ Professional error handling
- ✅ Essential list operations
- ✅ Static variables work properly in functions

## Next Batch Preview (Batch 5)

After completing these, we can tackle:
1. Classes (OOP)
2. Recursion optimization
3. Multiple return values
4. Default parameters
5. Variable arguments (*args)

Ready to implement!
