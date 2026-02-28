# Next 5 Features Implementation Plan

## Features to Implement (Skipping do-while and switch)

### 1. Lambda Functions ✨
**Syntax:** `let add = LAMBDA x, y: x + y`

**Implementation:**
- Add LAMBDA token recognition
- Create Lambda value type
- Store parameters and body
- Execute when called

**Complexity:** Medium (200 lines)

### 2. Const Variables (Enforce Immutability) 🔒
**Syntax:** `CONST PI = 3.14159`

**Implementation:**
- Already have CONST token
- Add const flag to Environment
- Throw error on reassignment

**Complexity:** Low (50 lines)

### 3. Static Variables 📌
**Syntax:** 
```susa
FUNC counter(): START:
    STATIC count = 0
    count = count + 1
    RETURN count
END:
```

**Implementation:**
- Add STATIC token
- Create static variable storage
- Persist across function calls

**Complexity:** Medium (100 lines)

### 4. Enum Support 🎨
**Syntax:**
```susa
ENUM Color: START:
    RED = 1
    GREEN = 2
    BLUE = 3
END:
```

**Implementation:**
- Add ENUM token
- Create Enum value type
- Store name-value pairs
- Support auto-increment

**Complexity:** Medium (150 lines)

### 5. Spread Operator 📦
**Syntax:** `let combined = [...arr1, ...arr2]`

**Implementation:**
- Add SPREAD (...) token
- Handle in list/object literals
- Expand arrays/objects

**Complexity:** Medium (100 lines)

## Total Estimated Lines: ~600 lines

## Implementation Order

1. **Const enforcement** (easiest, builds on existing)
2. **Static variables** (moderate, new storage mechanism)
3. **Enum support** (moderate, new value type)
4. **Lambda functions** (harder, new callable type)
5. **Spread operator** (harder, expression-level feature)

## Testing Strategy

Create `test_next_batch_features.susa` with:
- Lambda function tests
- Const reassignment tests
- Static variable persistence tests
- Enum declaration and usage tests
- Spread operator tests

## Timeline

- **Day 1 (4 hours):** Const + Static + Enum
- **Day 2 (4 hours):** Lambda + Spread
- **Day 3 (2 hours):** Testing + Bug fixes

Total: ~10 hours of focused development

## Next Steps

1. Update lexer to recognize new tokens (if not already)
2. Implement features in order
3. Test each feature individually
4. Create comprehensive test file
5. Update documentation

Ready to implement!
