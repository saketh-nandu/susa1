# Array Utils Module

The Array Utils module provides comprehensive array manipulation and utility functions for working with lists and arrays in SUSA.

## Import

```susa
ADD array_utils
```

## Overview

This module includes 50+ functions for array operations including:
- Basic operations (push, pop, shift, unshift)
- Array manipulation (slice, splice, concat, reverse)
- Sorting and searching
- Functional programming (map, filter, reduce)
- Set operations (union, intersection, difference)
- Advanced utilities (chunk, zip, partition, group_by)

---

## Basic Array Operations

### push(array, element)

Add an element to the end of an array.

**Parameters:**
- `array` (Array) - The array to modify
- `element` (Any) - The element to add

**Returns:** Array - The modified array

**Example:**
```susa
let numbers = [1, 2, 3]
push(numbers, 4)
PRINT numbers  # Output: [1, 2, 3, 4]
```

---

### pop(array)

Remove and return the last element from an array.

**Parameters:**
- `array` (Array) - The array to modify

**Returns:** Any - The removed element, or null if array is empty

**Example:**
```susa
let numbers = [1, 2, 3, 4]
let last = pop(numbers)
PRINT last      # Output: 4
PRINT numbers   # Output: [1, 2, 3]
```

---

### shift(array)

Remove and return the first element from an array.

**Parameters:**
- `array` (Array) - The array to modify

**Returns:** Any - The removed element, or null if array is empty

**Example:**
```susa
let numbers = [1, 2, 3, 4]
let first = shift(numbers)
PRINT first     # Output: 1
PRINT numbers   # Output: [2, 3, 4]
```

---

### unshift(array, element)

Add an element to the beginning of an array.

**Parameters:**
- `array` (Array) - The array to modify
- `element` (Any) - The element to add

**Returns:** Array - New array with element prepended

**Example:**
```susa
let numbers = [2, 3, 4]
let result = unshift(numbers, 1)
PRINT result  # Output: [1, 2, 3, 4]
```

---

## Array Slicing and Splicing

### slice(array, start, end)

Extract a section of an array.

**Parameters:**
- `array` (Array) - The source array
- `start` (Number) - Starting index (inclusive)
- `end` (Number) - Ending index (exclusive)

**Returns:** Array - New array containing extracted elements

**Example:**
```susa
let numbers = [1, 2, 3, 4, 5]
let subset = slice(numbers, 1, 4)
PRINT subset  # Output: [2, 3, 4]

# Negative indices work from the end
let last_two = slice(numbers, -2, 5)
PRINT last_two  # Output: [4, 5]
```

---

### splice(array, start, delete_count, ...items)

Remove or insert elements at a specific position.

**Parameters:**
- `array` (Array) - The array to modify
- `start` (Number) - Starting index
- `delete_count` (Number) - Number of elements to remove
- `items` (Any...) - Elements to insert

**Returns:** Array - Array of removed elements

**Example:**
```susa
let numbers = [1, 2, 3, 4, 5]
let removed = splice(numbers, 2, 2, 10, 20)
PRINT removed   # Output: [3, 4]
PRINT numbers   # Output: [1, 2, 10, 20, 5]
```

---

### concat(array1, array2)

Concatenate two arrays.

**Parameters:**
- `array1` (Array) - First array
- `array2` (Array) - Second array

**Returns:** Array - New array containing all elements

**Example:**
```susa
let arr1 = [1, 2, 3]
let arr2 = [4, 5, 6]
let combined = concat(arr1, arr2)
PRINT combined  # Output: [1, 2, 3, 4, 5, 6]
```

---

## Sorting and Reversing

### sort_array(array)

Sort an array in ascending order using bubble sort.

**Parameters:**
- `array` (Array) - The array to sort

**Returns:** Array - Sorted array

**Example:**
```susa
let numbers = [5, 2, 8, 1, 9]
let sorted = sort_array(numbers)
PRINT sorted  # Output: [1, 2, 5, 8, 9]
```

---

### reverse_array(array)

Reverse the order of elements in an array.

**Parameters:**
- `array` (Array) - The array to reverse

**Returns:** Array - Reversed array

**Example:**
```susa
let numbers = [1, 2, 3, 4, 5]
let reversed = reverse_array(numbers)
PRINT reversed  # Output: [5, 4, 3, 2, 1]
```

---

## Functional Programming

### map_array(array, transform_func)

Transform each element in an array using a function.

**Parameters:**
- `array` (Array) - The source array
- `transform_func` (Function) - Function to apply to each element

**Returns:** Array - New array with transformed elements

**Example:**
```susa
FUNC double(x): START:
    RETURN x * 2
END:

let numbers = [1, 2, 3, 4]
let doubled = map_array(numbers, double)
PRINT doubled  # Output: [2, 4, 6, 8]
```

---

### filter_array(array, condition_func)

Filter array elements based on a condition.

**Parameters:**
- `array` (Array) - The source array
- `condition_func` (Function) - Function that returns true/false

**Returns:** Array - New array with filtered elements

**Example:**
```susa
FUNC is_even(x): START:
    RETURN x % 2 == 0
END:

let numbers = [1, 2, 3, 4, 5, 6]
let evens = filter_array(numbers, is_even)
PRINT evens  # Output: [2, 4, 6]
```

---

### reduce_array(array, reducer_func, initial_value)

Reduce an array to a single value.

**Parameters:**
- `array` (Array) - The source array
- `reducer_func` (Function) - Function(accumulator, current, index)
- `initial_value` (Any) - Starting value for accumulator

**Returns:** Any - The reduced value

**Example:**
```susa
FUNC sum(acc, val, idx): START:
    RETURN acc + val
END:

let numbers = [1, 2, 3, 4, 5]
let total = reduce_array(numbers, sum, 0)
PRINT total  # Output: 15
```

---

## Searching

### find(array, condition_func)

Find the first element matching a condition.

**Parameters:**
- `array` (Array) - The array to search
- `condition_func` (Function) - Condition function

**Returns:** Any - First matching element, or null

**Example:**
```susa
FUNC greater_than_5(x): START:
    RETURN x > 5
END:

let numbers = [1, 3, 6, 8, 2]
let result = find(numbers, greater_than_5)
PRINT result  # Output: 6
```

---

### find_index(array, condition_func)

Find the index of the first element matching a condition.

**Parameters:**
- `array` (Array) - The array to search
- `condition_func` (Function) - Condition function

**Returns:** Number - Index of first match, or -1

**Example:**
```susa
FUNC is_negative(x): START:
    RETURN x < 0
END:

let numbers = [1, 3, -5, 8, 2]
let idx = find_index(numbers, is_negative)
PRINT idx  # Output: 2
```

---

### includes(array, element)

Check if an array contains an element.

**Parameters:**
- `array` (Array) - The array to search
- `element` (Any) - Element to find

**Returns:** Boolean - true if found, false otherwise

**Example:**
```susa
let fruits = ["apple", "banana", "orange"]
PRINT includes(fruits, "banana")  # Output: true
PRINT includes(fruits, "grape")   # Output: false
```

---

### index_of_array(array, element)

Find the first index of an element.

**Parameters:**
- `array` (Array) - The array to search
- `element` (Any) - Element to find

**Returns:** Number - Index of element, or -1 if not found

**Example:**
```susa
let numbers = [10, 20, 30, 20, 40]
PRINT index_of_array(numbers, 20)  # Output: 1
PRINT index_of_array(numbers, 50)  # Output: -1
```

---

### last_index_of_array(array, element)

Find the last index of an element.

**Parameters:**
- `array` (Array) - The array to search
- `element` (Any) - Element to find

**Returns:** Number - Last index of element, or -1

**Example:**
```susa
let numbers = [10, 20, 30, 20, 40]
PRINT last_index_of_array(numbers, 20)  # Output: 3
```

---

## Array Testing

### every(array, condition_func)

Check if all elements match a condition.

**Parameters:**
- `array` (Array) - The array to test
- `condition_func` (Function) - Condition function

**Returns:** Boolean - true if all match, false otherwise

**Example:**
```susa
FUNC is_positive(x): START:
    RETURN x > 0
END:

let numbers = [1, 2, 3, 4, 5]
PRINT every(numbers, is_positive)  # Output: true

let mixed = [1, -2, 3]
PRINT every(mixed, is_positive)    # Output: false
```

---

### some(array, condition_func)

Check if any element matches a condition.

**Parameters:**
- `array` (Array) - The array to test
- `condition_func` (Function) - Condition function

**Returns:** Boolean - true if any match, false otherwise

**Example:**
```susa
FUNC is_even(x): START:
    RETURN x % 2 == 0
END:

let numbers = [1, 3, 5, 7]
PRINT some(numbers, is_even)  # Output: false

let mixed = [1, 3, 4, 7]
PRINT some(mixed, is_even)    # Output: true
```

---

## Array Transformation

### flatten(array)

Flatten nested arrays into a single array.

**Parameters:**
- `array` (Array) - Array with nested arrays

**Returns:** Array - Flattened array

**Example:**
```susa
let nested = [1, [2, 3], [4, [5, 6]]]
let flat = flatten(nested)
PRINT flat  # Output: [1, 2, 3, 4, 5, 6]
```

---

### unique(array)

Get unique elements from an array.

**Parameters:**
- `array` (Array) - The source array

**Returns:** Array - Array with duplicates removed

**Example:**
```susa
let numbers = [1, 2, 2, 3, 4, 3, 5]
let uniq = unique(numbers)
PRINT uniq  # Output: [1, 2, 3, 4, 5]
```

---

### chunk(array, size)

Split an array into chunks of specified size.

**Parameters:**
- `array` (Array) - The source array
- `size` (Number) - Size of each chunk

**Returns:** Array - Array of chunks

**Example:**
```susa
let numbers = [1, 2, 3, 4, 5, 6, 7]
let chunks = chunk(numbers, 3)
PRINT chunks  # Output: [[1, 2, 3], [4, 5, 6], [7]]
```

---

### zip(array1, array2)

Combine two arrays into pairs.

**Parameters:**
- `array1` (Array) - First array
- `array2` (Array) - Second array

**Returns:** Array - Array of pairs

**Example:**
```susa
let names = ["Alice", "Bob", "Charlie"]
let ages = [25, 30, 35]
let paired = zip(names, ages)
PRINT paired  # Output: [["Alice", 25], ["Bob", 30], ["Charlie", 35]]
```

---

### unzip(array)

Separate an array of pairs into two arrays.

**Parameters:**
- `array` (Array) - Array of pairs

**Returns:** Array - Array containing two arrays

**Example:**
```susa
let pairs = [["Alice", 25], ["Bob", 30]]
let separated = unzip(pairs)
PRINT separated  # Output: [["Alice", "Bob"], [25, 30]]
```

---

## Array Manipulation

### rotate(array, positions)

Rotate array elements by specified positions.

**Parameters:**
- `array` (Array) - The array to rotate
- `positions` (Number) - Number of positions (positive = right, negative = left)

**Returns:** Array - Rotated array

**Example:**
```susa
let numbers = [1, 2, 3, 4, 5]
let rotated = rotate(numbers, 2)
PRINT rotated  # Output: [3, 4, 5, 1, 2]
```

---

### shuffle(array)

Randomly shuffle array elements.

**Parameters:**
- `array` (Array) - The array to shuffle

**Returns:** Array - Shuffled array

**Example:**
```susa
let numbers = [1, 2, 3, 4, 5]
let shuffled = shuffle(numbers)
PRINT shuffled  # Output: [3, 1, 5, 2, 4] (random)
```

---

### sample(array, count)

Get random samples from an array.

**Parameters:**
- `array` (Array) - The source array
- `count` (Number) - Number of samples

**Returns:** Array - Array of random samples

**Example:**
```susa
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
let samples = sample(numbers, 3)
PRINT samples  # Output: [7, 2, 9] (random)
```

---

## Advanced Operations

### partition(array, condition_func)

Partition array into two arrays based on condition.

**Parameters:**
- `array` (Array) - The source array
- `condition_func` (Function) - Condition function

**Returns:** Array - [true_array, false_array]

**Example:**
```susa
FUNC is_even(x): START:
    RETURN x % 2 == 0
END:

let numbers = [1, 2, 3, 4, 5, 6]
let parts = partition(numbers, is_even)
PRINT parts  # Output: [[2, 4, 6], [1, 3, 5]]
```

---

### group_by(array, key_func)

Group elements by a key function.

**Parameters:**
- `array` (Array) - The source array
- `key_func` (Function) - Function to generate keys

**Returns:** Object - Object with grouped arrays

**Example:**
```susa
FUNC get_length(str): START:
    RETURN length(str)
END:

let words = ["a", "bb", "ccc", "dd", "e"]
let grouped = group_by(words, get_length)
PRINT grouped  # Output: {1: ["a", "e"], 2: ["bb", "dd"], 3: ["ccc"]}
```

---

### count_by(array, key_func)

Count elements by a key function.

**Parameters:**
- `array` (Array) - The source array
- `key_func` (Function) - Function to generate keys

**Returns:** Object - Object with counts

**Example:**
```susa
FUNC is_even(x): START:
    IF x % 2 == 0: START:
        RETURN "even"
    END:
    RETURN "odd"
END:

let numbers = [1, 2, 3, 4, 5, 6]
let counts = count_by(numbers, is_even)
PRINT counts  # Output: {"even": 3, "odd": 3}
```

---

### max_by(array, key_func)

Find element with maximum value by key function.

**Parameters:**
- `array` (Array) - The source array
- `key_func` (Function) - Function to extract comparison value

**Returns:** Any - Element with maximum value

**Example:**
```susa
FUNC get_age(person): START:
    RETURN person["age"]
END:

let people = [
    {"name": "Alice", "age": 25},
    {"name": "Bob", "age": 30},
    {"name": "Charlie", "age": 28}
]
let oldest = max_by(people, get_age)
PRINT oldest  # Output: {"name": "Bob", "age": 30}
```

---

### min_by(array, key_func)

Find element with minimum value by key function.

**Parameters:**
- `array` (Array) - The source array
- `key_func` (Function) - Function to extract comparison value

**Returns:** Any - Element with minimum value

**Example:**
```susa
FUNC get_price(item): START:
    RETURN item["price"]
END:

let items = [
    {"name": "Apple", "price": 1.50},
    {"name": "Banana", "price": 0.75},
    {"name": "Orange", "price": 1.25}
]
let cheapest = min_by(items, get_price)
PRINT cheapest  # Output: {"name": "Banana", "price": 0.75}
```

---

### sum_by(array, key_func)

Sum elements by a key function.

**Parameters:**
- `array` (Array) - The source array
- `key_func` (Function) - Function to extract values

**Returns:** Number - Sum of extracted values

**Example:**
```susa
FUNC get_quantity(item): START:
    RETURN item["quantity"]
END:

let cart = [
    {"item": "Apple", "quantity": 3},
    {"item": "Banana", "quantity": 5},
    {"item": "Orange", "quantity": 2}
]
let total = sum_by(cart, get_quantity)
PRINT total  # Output: 10
```

---

### sort_by(array, key_func)

Sort array by a key function.

**Parameters:**
- `array` (Array) - The array to sort
- `key_func` (Function) - Function to extract sort key

**Returns:** Array - Sorted array

**Example:**
```susa
FUNC get_name(person): START:
    RETURN person["name"]
END:

let people = [
    {"name": "Charlie", "age": 28},
    {"name": "Alice", "age": 25},
    {"name": "Bob", "age": 30}
]
let sorted = sort_by(people, get_name)
# Output: [{"name": "Alice", ...}, {"name": "Bob", ...}, {"name": "Charlie", ...}]
```

---

## Element Modification

### remove_at(array, index)

Remove element at specific index.

**Parameters:**
- `array` (Array) - The source array
- `index` (Number) - Index to remove

**Returns:** Array - New array without element

**Example:**
```susa
let numbers = [10, 20, 30, 40, 50]
let result = remove_at(numbers, 2)
PRINT result  # Output: [10, 20, 40, 50]
```

---

### remove_value(array, value)

Remove all occurrences of a value.

**Parameters:**
- `array` (Array) - The source array
- `value` (Any) - Value to remove

**Returns:** Array - New array without value

**Example:**
```susa
let numbers = [1, 2, 3, 2, 4, 2, 5]
let result = remove_value(numbers, 2)
PRINT result  # Output: [1, 3, 4, 5]
```

---

### insert_at(array, index, element)

Insert element at specific index.

**Parameters:**
- `array` (Array) - The source array
- `index` (Number) - Index to insert at
- `element` (Any) - Element to insert

**Returns:** Array - New array with element inserted

**Example:**
```susa
let numbers = [1, 2, 4, 5]
let result = insert_at(numbers, 2, 3)
PRINT result  # Output: [1, 2, 3, 4, 5]
```

---

### replace_at(array, index, element)

Replace element at specific index.

**Parameters:**
- `array` (Array) - The array to modify
- `index` (Number) - Index to replace
- `element` (Any) - New element

**Returns:** Array - Modified array

**Example:**
```susa
let numbers = [1, 2, 3, 4, 5]
let result = replace_at(numbers, 2, 99)
PRINT result  # Output: [1, 2, 99, 4, 5]
```

---

### fill(array, value, start, end)

Fill array with a value.

**Parameters:**
- `array` (Array) - The array to fill
- `value` (Any) - Value to fill with
- `start` (Number) - Start index
- `end` (Number) - End index

**Returns:** Array - Filled array

**Example:**
```susa
let numbers = [1, 2, 3, 4, 5]
let result = fill(numbers, 0, 1, 4)
PRINT result  # Output: [1, 0, 0, 0, 5]
```

---

## Array Generation

### range(start, end, step)

Create a range of numbers.

**Parameters:**
- `start` (Number) - Starting number
- `end` (Number) - Ending number (exclusive)
- `step` (Number) - Step size

**Returns:** Array - Array of numbers

**Example:**
```susa
let numbers = range(0, 10, 2)
PRINT numbers  # Output: [0, 2, 4, 6, 8]

let countdown = range(10, 0, -1)
PRINT countdown  # Output: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
```

---

### repeat_array(array, count)

Repeat array elements multiple times.

**Parameters:**
- `array` (Array) - The array to repeat
- `count` (Number) - Number of repetitions

**Returns:** Array - Repeated array

**Example:**
```susa
let pattern = [1, 2, 3]
let repeated = repeat_array(pattern, 3)
PRINT repeated  # Output: [1, 2, 3, 1, 2, 3, 1, 2, 3]
```

---

## Set Operations

### intersection(array1, array2)

Get common elements between two arrays.

**Parameters:**
- `array1` (Array) - First array
- `array2` (Array) - Second array

**Returns:** Array - Array of common elements

**Example:**
```susa
let arr1 = [1, 2, 3, 4, 5]
let arr2 = [3, 4, 5, 6, 7]
let common = intersection(arr1, arr2)
PRINT common  # Output: [3, 4, 5]
```

---

### union(array1, array2)

Get all unique elements from both arrays.

**Parameters:**
- `array1` (Array) - First array
- `array2` (Array) - Second array

**Returns:** Array - Array of all unique elements

**Example:**
```susa
let arr1 = [1, 2, 3]
let arr2 = [3, 4, 5]
let all = union(arr1, arr2)
PRINT all  # Output: [1, 2, 3, 4, 5]
```

---

### difference(array1, array2)

Get elements in array1 that are not in array2.

**Parameters:**
- `array1` (Array) - First array
- `array2` (Array) - Second array

**Returns:** Array - Array of different elements

**Example:**
```susa
let arr1 = [1, 2, 3, 4, 5]
let arr2 = [3, 4, 5, 6, 7]
let diff = difference(arr1, arr2)
PRINT diff  # Output: [1, 2]
```

---

### symmetric_difference(array1, array2)

Get elements that are in either array but not both.

**Parameters:**
- `array1` (Array) - First array
- `array2` (Array) - Second array

**Returns:** Array - Array of symmetric difference

**Example:**
```susa
let arr1 = [1, 2, 3, 4]
let arr2 = [3, 4, 5, 6]
let sym_diff = symmetric_difference(arr1, arr2)
PRINT sym_diff  # Output: [1, 2, 5, 6]
```

---

### is_subset(array1, array2)

Check if array1 is a subset of array2.

**Parameters:**
- `array1` (Array) - Potential subset
- `array2` (Array) - Potential superset

**Returns:** Boolean - true if array1 is subset of array2

**Example:**
```susa
let small = [2, 3]
let large = [1, 2, 3, 4, 5]
PRINT is_subset(small, large)  # Output: true
PRINT is_subset(large, small)  # Output: false
```

---

### is_superset(array1, array2)

Check if array1 is a superset of array2.

**Parameters:**
- `array1` (Array) - Potential superset
- `array2` (Array) - Potential subset

**Returns:** Boolean - true if array1 is superset of array2

**Example:**
```susa
let large = [1, 2, 3, 4, 5]
let small = [2, 3]
PRINT is_superset(large, small)  # Output: true
```

---

## Complete Example

```susa
ADD array_utils

# Create and manipulate arrays
let numbers = [5, 2, 8, 1, 9, 3]

# Sort and filter
let sorted = sort_array(numbers)
PRINT rt"Sorted: {sorted}"

FUNC is_even(x): START:
    RETURN x % 2 == 0
END:

let evens = filter_array(numbers, is_even)
PRINT rt"Even numbers: {evens}"

# Transform data
FUNC square(x): START:
    RETURN x * x
END:

let squared = map_array(numbers, square)
PRINT rt"Squared: {squared}"

# Advanced operations
let chunks = chunk(numbers, 2)
PRINT rt"Chunks of 2: {chunks}"

let unique_nums = unique([1, 2, 2, 3, 3, 3, 4])
PRINT rt"Unique: {unique_nums}"

# Set operations
let set1 = [1, 2, 3, 4]
let set2 = [3, 4, 5, 6]
let common = intersection(set1, set2)
PRINT rt"Intersection: {common}"

# Group and aggregate
let words = ["a", "bb", "ccc", "dd", "e", "fff"]
FUNC word_length(w): START:
    RETURN length(w)
END:

let grouped = group_by(words, word_length)
PRINT rt"Grouped by length: {grouped}"
```

---

## Function Summary

| Category | Functions |
|----------|-----------|
| Basic Operations | push, pop, shift, unshift, slice, splice, concat |
| Sorting | sort_array, reverse_array, sort_by |
| Searching | find, find_index, includes, index_of_array, last_index_of_array |
| Functional | map_array, filter_array, reduce_array, every, some |
| Transformation | flatten, unique, chunk, zip, unzip, rotate, shuffle, sample |
| Advanced | partition, group_by, count_by, max_by, min_by, sum_by |
| Modification | remove_at, remove_value, insert_at, replace_at, fill |
| Generation | range, repeat_array |
| Set Operations | intersection, union, difference, symmetric_difference, is_subset, is_superset |

---

## Related Modules

- [String Utils](string_utils.md) - String manipulation functions
- [Math Utils](math_utils.md) - Mathematical operations
- [Algorithms](algorithms.md) - Sorting and searching algorithms


