# Math Utils Module

## Overview
The `math_utils` module provides comprehensive mathematical operations including basic arithmetic, trigonometry, logarithms, and advanced mathematical functions.

## Import
```susa
ADD math_utils
```

## Constants

### PI
- **Value:** 3.14159265358979323846
- **Description:** The mathematical constant π (pi)
- **Usage:**
```susa
ADD math_utils
PRINT "Circle circumference: " + str(2 * PI * 5)
```

### E
- **Value:** 2.71828182845904523536
- **Description:** Euler's number, the base of natural logarithms
- **Usage:**
```susa
ADD math_utils
PRINT "e^2 = " + str(math_utils.exp(2))
```

### GOLDEN_RATIO
- **Value:** 1.61803398874989484820
- **Description:** The golden ratio (φ), often found in nature and art
- **Usage:**
```susa
ADD math_utils
PRINT "Golden ratio: " + str(GOLDEN_RATIO)
```

---

## Basic Math Functions

### abs(x)
Returns the absolute value of a number.

**Parameters:**
- `x` (number): The number to get absolute value of

**Returns:** Absolute value of x

**Example:**
```susa
ADD math_utils
PRINT math_utils.abs(-5)      // Output: 5
PRINT math_utils.abs(3.14)    // Output: 3.14
PRINT math_utils.abs(-10.5)   // Output: 10.5
```

---

### max(x1, x2, ...)
Returns the largest of the given numbers.

**Parameters:**
- `x1, x2, ...` (numbers): Two or more numbers to compare

**Returns:** The largest number

**Example:**
```susa
ADD math_utils
PRINT math_utils.max(5, 10, 3)        // Output: 10
PRINT math_utils.max(-5, -10, -3)     // Output: -3
PRINT math_utils.max(1.5, 2.7, 1.9)   // Output: 2.7
```

---

### min(x1, x2, ...)
Returns the smallest of the given numbers.

**Parameters:**
- `x1, x2, ...` (numbers): Two or more numbers to compare

**Returns:** The smallest number

**Example:**
```susa
ADD math_utils
PRINT math_utils.min(5, 10, 3)        // Output: 3
PRINT math_utils.min(-5, -10, -3)     // Output: -10
PRINT math_utils.min(1.5, 2.7, 1.9)   // Output: 1.5
```

---

### pow(base, exponent)
Raises a number to a power.

**Parameters:**
- `base` (number): The base number
- `exponent` (number): The exponent

**Returns:** base raised to the power of exponent

**Example:**
```susa
ADD math_utils
PRINT math_utils.pow(2, 3)      // Output: 8
PRINT math_utils.pow(5, 2)      // Output: 25
PRINT math_utils.pow(10, -1)    // Output: 0.1
```

---

### sqrt(x)
Returns the square root of a number.

**Parameters:**
- `x` (number): The number to get square root of (must be non-negative)

**Returns:** Square root of x

**Example:**
```susa
ADD math_utils
PRINT math_utils.sqrt(16)       // Output: 4
PRINT math_utils.sqrt(2)        // Output: 1.414...
PRINT math_utils.sqrt(100)      // Output: 10
```

---

### cbrt(x)
Returns the cube root of a number.

**Parameters:**
- `x` (number): The number to get cube root of

**Returns:** Cube root of x

**Example:**
```susa
ADD math_utils
PRINT math_utils.cbrt(27)       // Output: 3
PRINT math_utils.cbrt(8)        // Output: 2
PRINT math_utils.cbrt(-8)       // Output: -2
```

---

## Rounding Functions

### ceil(x)
Rounds a number up to the nearest integer.

**Parameters:**
- `x` (number): The number to round up

**Returns:** Smallest integer greater than or equal to x

**Example:**
```susa
ADD math_utils
PRINT math_utils.ceil(4.2)      // Output: 5
PRINT math_utils.ceil(4.8)      // Output: 5
PRINT math_utils.ceil(-4.2)     // Output: -4
```

---

### floor(x)
Rounds a number down to the nearest integer.

**Parameters:**
- `x` (number): The number to round down

**Returns:** Largest integer less than or equal to x

**Example:**
```susa
ADD math_utils
PRINT math_utils.floor(4.2)     // Output: 4
PRINT math_utils.floor(4.8)     // Output: 4
PRINT math_utils.floor(-4.2)    // Output: -5
```

---

### round(x)
Rounds a number to the nearest integer.

**Parameters:**
- `x` (number): The number to round

**Returns:** Nearest integer to x

**Example:**
```susa
ADD math_utils
PRINT math_utils.round(4.2)     // Output: 4
PRINT math_utils.round(4.8)     // Output: 5
PRINT math_utils.round(4.5)     // Output: 5
```

---

### trunc(x)
Removes the decimal part of a number.

**Parameters:**
- `x` (number): The number to truncate

**Returns:** Integer part of x

**Example:**
```susa
ADD math_utils
PRINT math_utils.trunc(4.9)     // Output: 4
PRINT math_utils.trunc(-4.9)    // Output: -4
PRINT math_utils.trunc(10.1)    // Output: 10
```

---

## Trigonometric Functions

### sin(x)
Returns the sine of an angle (in radians).

**Parameters:**
- `x` (number): Angle in radians

**Returns:** Sine of x

**Example:**
```susa
ADD math_utils
PRINT math_utils.sin(0)                    // Output: 0
PRINT math_utils.sin(PI / 2)               // Output: 1
PRINT math_utils.sin(math_utils.radians(90))  // Output: 1
```

---

### cos(x)
Returns the cosine of an angle (in radians).

**Parameters:**
- `x` (number): Angle in radians

**Returns:** Cosine of x

**Example:**
```susa
ADD math_utils
PRINT math_utils.cos(0)                    // Output: 1
PRINT math_utils.cos(PI)                   // Output: -1
PRINT math_utils.cos(math_utils.radians(90))  // Output: 0
```

---

### tan(x)
Returns the tangent of an angle (in radians).

**Parameters:**
- `x` (number): Angle in radians

**Returns:** Tangent of x

**Example:**
```susa
ADD math_utils
PRINT math_utils.tan(0)                    // Output: 0
PRINT math_utils.tan(PI / 4)               // Output: 1
PRINT math_utils.tan(math_utils.radians(45))  // Output: 1
```

---

### asin(x)
Returns the arcsine (inverse sine) of a number.

**Parameters:**
- `x` (number): Value between -1 and 1

**Returns:** Arcsine of x in radians

**Example:**
```susa
ADD math_utils
PRINT math_utils.asin(0)        // Output: 0
PRINT math_utils.asin(1)        // Output: 1.5708 (π/2)
PRINT math_utils.asin(0.5)      // Output: 0.5236 (π/6)
```

---

### acos(x)
Returns the arccosine (inverse cosine) of a number.

**Parameters:**
- `x` (number): Value between -1 and 1

**Returns:** Arccosine of x in radians

**Example:**
```susa
ADD math_utils
PRINT math_utils.acos(1)        // Output: 0
PRINT math_utils.acos(0)        // Output: 1.5708 (π/2)
PRINT math_utils.acos(-1)       // Output: 3.1416 (π)
```

---

### atan(x)
Returns the arctangent (inverse tangent) of a number.

**Parameters:**
- `x` (number): Any number

**Returns:** Arctangent of x in radians

**Example:**
```susa
ADD math_utils
PRINT math_utils.atan(0)        // Output: 0
PRINT math_utils.atan(1)        // Output: 0.7854 (π/4)
PRINT math_utils.atan(-1)       // Output: -0.7854 (-π/4)
```

---

### atan2(y, x)
Returns the angle (in radians) from the X axis to a point (x, y).

**Parameters:**
- `y` (number): Y coordinate
- `x` (number): X coordinate

**Returns:** Angle in radians between -π and π

**Example:**
```susa
ADD math_utils
PRINT math_utils.atan2(1, 1)    // Output: 0.7854 (π/4, 45°)
PRINT math_utils.atan2(1, 0)    // Output: 1.5708 (π/2, 90°)
PRINT math_utils.atan2(0, -1)   // Output: 3.1416 (π, 180°)
```

---

## Logarithmic Functions

### log(x)
Returns the base-10 logarithm of a number.

**Parameters:**
- `x` (number): Positive number

**Returns:** Base-10 logarithm of x

**Example:**
```susa
ADD math_utils
PRINT math_utils.log(10)        // Output: 1
PRINT math_utils.log(100)       // Output: 2
PRINT math_utils.log(1000)      // Output: 3
```

---

### ln(x)
Returns the natural logarithm (base e) of a number.

**Parameters:**
- `x` (number): Positive number

**Returns:** Natural logarithm of x

**Example:**
```susa
ADD math_utils
PRINT math_utils.ln(E)          // Output: 1
PRINT math_utils.ln(1)          // Output: 0
PRINT math_utils.ln(2.718)      // Output: ~1
```

---

### log2(x)
Returns the base-2 logarithm of a number.

**Parameters:**
- `x` (number): Positive number

**Returns:** Base-2 logarithm of x

**Example:**
```susa
ADD math_utils
PRINT math_utils.log2(2)        // Output: 1
PRINT math_utils.log2(8)        // Output: 3
PRINT math_utils.log2(1024)     // Output: 10
```

---

### exp(x)
Returns e raised to the power of x.

**Parameters:**
- `x` (number): The exponent

**Returns:** e^x

**Example:**
```susa
ADD math_utils
PRINT math_utils.exp(0)         // Output: 1
PRINT math_utils.exp(1)         // Output: 2.718... (e)
PRINT math_utils.exp(2)         // Output: 7.389...
```

---

## Advanced Math Functions

### factorial(n)
Returns the factorial of a number (n!).

**Parameters:**
- `n` (integer): Non-negative integer

**Returns:** n! = n × (n-1) × (n-2) × ... × 1

**Example:**
```susa
ADD math_utils
PRINT math_utils.factorial(5)   // Output: 120
PRINT math_utils.factorial(0)   // Output: 1
PRINT math_utils.factorial(10)  // Output: 3628800
```

---

### gcd(a, b)
Returns the greatest common divisor of two numbers.

**Parameters:**
- `a` (integer): First number
- `b` (integer): Second number

**Returns:** Greatest common divisor of a and b

**Example:**
```susa
ADD math_utils
PRINT math_utils.gcd(12, 8)     // Output: 4
PRINT math_utils.gcd(15, 25)    // Output: 5
PRINT math_utils.gcd(7, 13)     // Output: 1
```

---

### lcm(a, b)
Returns the least common multiple of two numbers.

**Parameters:**
- `a` (integer): First number
- `b` (integer): Second number

**Returns:** Least common multiple of a and b

**Example:**
```susa
ADD math_utils
PRINT math_utils.lcm(4, 6)      // Output: 12
PRINT math_utils.lcm(3, 5)      // Output: 15
PRINT math_utils.lcm(12, 18)    // Output: 36
```

---

### is_prime(n)
Checks if a number is prime.

**Parameters:**
- `n` (integer): Number to check

**Returns:** true if n is prime, false otherwise

**Example:**
```susa
ADD math_utils
PRINT math_utils.is_prime(7)    // Output: true
PRINT math_utils.is_prime(10)   // Output: false
PRINT math_utils.is_prime(17)   // Output: true
```

---

### clamp(value, min, max)
Restricts a value to be within a specified range.

**Parameters:**
- `value` (number): The value to clamp
- `min` (number): Minimum allowed value
- `max` (number): Maximum allowed value

**Returns:** Value clamped between min and max

**Example:**
```susa
ADD math_utils
PRINT math_utils.clamp(5, 0, 10)    // Output: 5
PRINT math_utils.clamp(-5, 0, 10)   // Output: 0
PRINT math_utils.clamp(15, 0, 10)   // Output: 10
```

---

### lerp(a, b, t)
Linear interpolation between two values.

**Parameters:**
- `a` (number): Start value
- `b` (number): End value
- `t` (number): Interpolation factor (0 to 1)

**Returns:** Interpolated value between a and b

**Example:**
```susa
ADD math_utils
PRINT math_utils.lerp(0, 10, 0.5)   // Output: 5
PRINT math_utils.lerp(0, 10, 0.25)  // Output: 2.5
PRINT math_utils.lerp(10, 20, 0.75) // Output: 17.5
```

---

## Angle Conversion

### degrees(radians)
Converts radians to degrees.

**Parameters:**
- `radians` (number): Angle in radians

**Returns:** Angle in degrees

**Example:**
```susa
ADD math_utils
PRINT math_utils.degrees(PI)        // Output: 180
PRINT math_utils.degrees(PI / 2)    // Output: 90
PRINT math_utils.degrees(2 * PI)    // Output: 360
```

---

### radians(degrees)
Converts degrees to radians.

**Parameters:**
- `degrees` (number): Angle in degrees

**Returns:** Angle in radians

**Example:**
```susa
ADD math_utils
PRINT math_utils.radians(180)   // Output: 3.1416 (π)
PRINT math_utils.radians(90)    // Output: 1.5708 (π/2)
PRINT math_utils.radians(360)   // Output: 6.2832 (2π)
```

---

## Random Number Generation

### random()
Returns a random number between 0 and 1.

**Parameters:** None

**Returns:** Random number in range [0, 1)

**Example:**
```susa
ADD math_utils
PRINT math_utils.random()       // Output: 0.7234... (random)
PRINT math_utils.random()       // Output: 0.1892... (random)
PRINT math_utils.random()       // Output: 0.9456... (random)
```

---

### random_int(min, max)
Returns a random integer between min and max (inclusive).

**Parameters:**
- `min` (integer): Minimum value (inclusive)
- `max` (integer): Maximum value (inclusive)

**Returns:** Random integer in range [min, max]

**Example:**
```susa
ADD math_utils
PRINT math_utils.random_int(1, 10)      // Output: 7 (random)
PRINT math_utils.random_int(1, 6)       // Output: 4 (random, like dice)
PRINT math_utils.random_int(0, 100)     // Output: 42 (random)
```

---

## Complete Example

```susa
// Import the math_utils module
ADD math_utils

// Using constants
PRINT "Pi: " + str(PI)
PRINT "e: " + str(E)
PRINT "Golden Ratio: " + str(GOLDEN_RATIO)

// Basic math
let x = -15
PRINT "Absolute value of " + str(x) + ": " + str(math_utils.abs(x))

// Power and roots
PRINT "2^10 = " + str(math_utils.pow(2, 10))
PRINT "Square root of 144: " + str(math_utils.sqrt(144))

// Trigonometry
let angle = math_utils.radians(45)
PRINT "sin(45°) = " + str(math_utils.sin(angle))
PRINT "cos(45°) = " + str(math_utils.cos(angle))

// Rounding
let num = 3.7
PRINT "Floor: " + str(math_utils.floor(num))
PRINT "Ceil: " + str(math_utils.ceil(num))
PRINT "Round: " + str(math_utils.round(num))

// Advanced math
PRINT "5! = " + str(math_utils.factorial(5))
PRINT "GCD(12, 18) = " + str(math_utils.gcd(12, 18))
PRINT "Is 17 prime? " + str(math_utils.is_prime(17))

// Random numbers
PRINT "Random: " + str(math_utils.random())
PRINT "Random dice roll: " + str(math_utils.random_int(1, 6))
```

---

## Function Summary

| Category | Functions |
|----------|-----------|
| **Basic** | abs, max, min, pow, sqrt, cbrt |
| **Rounding** | ceil, floor, round, trunc |
| **Trigonometry** | sin, cos, tan, asin, acos, atan, atan2 |
| **Logarithms** | log, ln, log2, exp |
| **Advanced** | factorial, gcd, lcm, is_prime, clamp, lerp |
| **Angles** | degrees, radians |
| **Random** | random, random_int |
| **Constants** | PI, E, GOLDEN_RATIO |

**Total:** 40 functions + 3 constants

