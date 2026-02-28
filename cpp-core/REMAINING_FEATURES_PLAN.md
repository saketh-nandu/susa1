# Remaining Features Implementation Plan

## Features to Implement (Priority Order)

### 1. Fix Switch/Case Statement 🔧
**Status:** Has bugs - multiple cases execute all statements
**Priority:** HIGH
**Effort:** 2 hours

**Current Issue:** Boundary detection bug
**Fix:** Properly track case boundaries and break execution

---

### 2. Fix Do-While Loop 🔧
**Status:** 90% complete - needs condition parsing
**Priority:** MEDIUM
**Effort:** 1 hour

**Current Issue:** Condition parsing needs refinement
**Fix:** Parse condition after WHILE keyword

---

### 3. Bitwise Operators ⚡
**Status:** Not implemented
**Priority:** MEDIUM
**Effort:** 1 hour

**Operators:**
- `&` (AND)
- `|` (OR)
- `^` (XOR)
- `~` (NOT)
- `<<` (LEFT SHIFT)
- `>>` (RIGHT SHIFT)

**Implementation:**
- Add tokens to lexer
- Add evaluation in interpreter
- Integer operations only

---

### 4. Destructuring Assignment 📦
**Status:** Not implemented
**Priority:** MEDIUM
**Effort:** 2 hours

**Syntax:**
```susa
let [a, b, c] = [1, 2, 3]
let [first, ...rest] = [1, 2, 3, 4, 5]
```

**Implementation:**
- Parse array destructuring pattern
- Assign values to multiple variables
- Support spread in destructuring

---

### 5. With Statement (Resource Management) 🔒
**Status:** Not implemented
**Priority:** LOW
**Effort:** 2 hours

**Syntax:**
```susa
WITH resource AS var: START:
    # use var
END:
# resource automatically cleaned up
```

**Implementation:**
- Parse WITH statement
- Execute resource acquisition
- Ensure cleanup on exit

---

## Implementation Order

1. **Bitwise Operators** (easiest, 1 hour)
2. **Fix Do-While** (almost done, 1 hour)
3. **Fix Switch/Case** (important, 2 hours)
4. **Destructuring** (useful, 2 hours)
5. **With Statement** (nice to have, 2 hours)

**Total Time:** ~8 hours

---

## Test File

Create `test_remaining_features.susa`:

```susa
# 1. Bitwise Operators
PRINT "=== Bitwise Operators ==="
let a = 12  # 1100 in binary
let b = 10  # 1010 in binary
PRINT "a & b = " + STR(a & b)   # 8 (1000)
PRINT "a | b = " + STR(a | b)   # 14 (1110)
PRINT "a ^ b = " + STR(a ^ b)   # 6 (0110)
PRINT "~a = " + STR(~a)         # -13
PRINT "a << 1 = " + STR(a << 1) # 24
PRINT "a >> 1 = " + STR(a >> 1) # 6

# 2. Do-While Loop
PRINT "=== Do-While Loop ==="
let count = 0
DO: START:
    PRINT "Count: " + STR(count)
    count = count + 1
END: WHILE count < 3

# 3. Switch/Case
PRINT "=== Switch/Case ==="
let value = 2
SWITCH value: START:
    CASE 1: START:
        PRINT "One"
    END:
    CASE 2: START:
        PRINT "Two"
    END:
    CASE 3: START:
        PRINT "Three"
    END:
    DEFAULT: START:
        PRINT "Other"
    END:
END:

# 4. Destructuring
PRINT "=== Destructuring ==="
let [x, y, z] = [10, 20, 30]
PRINT "x = " + STR(x)
PRINT "y = " + STR(y)
PRINT "z = " + STR(z)

let [first, ...rest] = [1, 2, 3, 4, 5]
PRINT "first = " + STR(first)
PRINT "rest = " + STR(rest)

# 5. With Statement
PRINT "=== With Statement ==="
WITH "test.txt" AS file: START:
    PRINT "File opened: " + file
END:
PRINT "File automatically closed"
```

---

## After Implementation

This will bring us to:
- **18/20 features implemented (90%)**
- Only missing: Async/Await, Generators (very complex)

The SUSA language will be feature-complete for most use cases!
