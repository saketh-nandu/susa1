# Algorithms Module

The Algorithms module provides implementations of common algorithms including sorting, searching, graph algorithms, dynamic programming, and more.

## Import

```susa
ADD algorithms
```

## Overview

This module includes:
- Sorting algorithms (bubble, quick, merge, insertion, selection, heap)
- Searching algorithms (binary, linear)
- Graph algorithms (BFS, DFS, Dijkstra)
- Dynamic programming (knapsack, fibonacci, LCS, edit distance)
- Array algorithms (Kadane, two sum, three sum)
- String algorithms (palindrome, anagram)
- Number theory (prime sieve, GCD)
- Matrix operations

---

## Sorting Algorithms

### bubble_sort(arr)

Sort array using bubble sort algorithm.

**Time Complexity:** O(n²)  
**Space Complexity:** O(1)

**Example:**
```susa
let numbers = [64, 34, 25, 12, 22, 11, 90]
let sorted = bubble_sort(numbers)
PRINT sorted  # Output: [11, 12, 22, 25, 34, 64, 90]
```

---

### quick_sort(arr)

Sort array using quick sort algorithm.

**Time Complexity:** O(n log n) average, O(n²) worst  
**Space Complexity:** O(log n)

**Example:**
```susa
let numbers = [64, 34, 25, 12, 22, 11, 90]
let sorted = quick_sort(numbers)
PRINT sorted  # Output: [11, 12, 22, 25, 34, 64, 90]
```

---

### merge_sort(arr)

Sort array using merge sort algorithm.

**Time Complexity:** O(n log n)  
**Space Complexity:** O(n)

**Example:**
```susa
let numbers = [64, 34, 25, 12, 22, 11, 90]
let sorted = merge_sort(numbers)
PRINT sorted  # Output: [11, 12, 22, 25, 34, 64, 90]
```

---

### insertion_sort(arr)

Sort array using insertion sort algorithm.

**Time Complexity:** O(n²)  
**Space Complexity:** O(1)

**Example:**
```susa
let numbers = [64, 34, 25, 12, 22, 11, 90]
let sorted = insertion_sort(numbers)
PRINT sorted  # Output: [11, 12, 22, 25, 34, 64, 90]
```

---

### selection_sort(arr)

Sort array using selection sort algorithm.

**Time Complexity:** O(n²)  
**Space Complexity:** O(1)

**Example:**
```susa
let numbers = [64, 34, 25, 12, 22, 11, 90]
let sorted = selection_sort(numbers)
PRINT sorted  # Output: [11, 12, 22, 25, 34, 64, 90]
```

---

### heap_sort(arr)

Sort array using heap sort algorithm.

**Time Complexity:** O(n log n)  
**Space Complexity:** O(1)

**Example:**
```susa
let numbers = [64, 34, 25, 12, 22, 11, 90]
let sorted = heap_sort(numbers)
PRINT sorted  # Output: [11, 12, 22, 25, 34, 64, 90]
```

---

## Searching Algorithms

### binary_search(arr, target)

Search for target in sorted array using binary search.

**Time Complexity:** O(log n)  
**Space Complexity:** O(1)

**Example:**
```susa
let numbers = [11, 12, 22, 25, 34, 64, 90]
let index = binary_search(numbers, 25)
PRINT index  # Output: 3

let not_found = binary_search(numbers, 50)
PRINT not_found  # Output: -1
```

---

### linear_search(arr, target)

Search for target in array using linear search.

**Time Complexity:** O(n)  
**Space Complexity:** O(1)

**Example:**
```susa
let numbers = [64, 34, 25, 12, 22, 11, 90]
let index = linear_search(numbers, 22)
PRINT index  # Output: 4
```

---

## Graph Algorithms

### bfs(graph, start)

Breadth-First Search traversal.

**Time Complexity:** O(V + E)  
**Space Complexity:** O(V)

**Example:**
```susa
let graph = {
    "A": ["B", "C"],
    "B": ["A", "D", "E"],
    "C": ["A", "F"],
    "D": ["B"],
    "E": ["B", "F"],
    "F": ["C", "E"]
}

let traversal = bfs(graph, "A")
PRINT traversal  # Output: ["A", "B", "C", "D", "E", "F"]
```

---

### dfs(graph, start)

Depth-First Search traversal.

**Time Complexity:** O(V + E)  
**Space Complexity:** O(V)

**Example:**
```susa
let graph = {
    "A": ["B", "C"],
    "B": ["A", "D", "E"],
    "C": ["A", "F"],
    "D": ["B"],
    "E": ["B", "F"],
    "F": ["C", "E"]
}

let traversal = dfs(graph, "A")
PRINT traversal  # Output: ["A", "B", "D", "E", "F", "C"]
```

---

### dijkstra(graph, start)

Find shortest paths from start vertex using Dijkstra's algorithm.

**Time Complexity:** O(V²)  
**Space Complexity:** O(V)

**Example:**
```susa
let graph = {
    "A": [["B", 4], ["C", 2]],
    "B": [["A", 4], ["C", 1], ["D", 5]],
    "C": [["A", 2], ["B", 1], ["D", 8]],
    "D": [["B", 5], ["C", 8]]
}

let result = dijkstra(graph, "A")
PRINT result["distances"]
# Output: {"A": 0, "B": 3, "C": 2, "D": 8}
```

---

## Dynamic Programming

### knapsack(weights, values, capacity)

Solve 0/1 knapsack problem.

**Time Complexity:** O(n × capacity)  
**Space Complexity:** O(n × capacity)

**Example:**
```susa
let weights = [2, 3, 4, 5]
let values = [3, 4, 5, 6]
let capacity = 8

let max_value = knapsack(weights, values, capacity)
PRINT max_value  # Output: 10
```

---

### fibonacci_dp(n)

Calculate nth Fibonacci number using dynamic programming.

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

**Example:**
```susa
PRINT fibonacci_dp(10)  # Output: 55
PRINT fibonacci_dp(20)  # Output: 6765
```

---

### longest_common_subsequence(text1, text2)

Find length of longest common subsequence.

**Time Complexity:** O(m × n)  
**Space Complexity:** O(m × n)

**Example:**
```susa
let lcs_length = longest_common_subsequence("ABCDGH", "AEDFHR")
PRINT lcs_length  # Output: 3 (ADH)
```

---

### edit_distance(str1, str2)

Calculate minimum edit distance (Levenshtein distance).

**Time Complexity:** O(m × n)  
**Space Complexity:** O(m × n)

**Example:**
```susa
let distance = edit_distance("kitten", "sitting")
PRINT distance  # Output: 3
```

---

## Array Algorithms

### kadane(arr)

Find maximum subarray sum using Kadane's algorithm.

**Time Complexity:** O(n)  
**Space Complexity:** O(1)

**Example:**
```susa
let numbers = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
let max_sum = kadane(numbers)
PRINT max_sum  # Output: 6 (subarray [4, -1, 2, 1])
```

---

### two_sum(arr, target)

Find two numbers that add up to target.

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

**Example:**
```susa
let numbers = [2, 7, 11, 15]
let indices = two_sum(numbers, 9)
PRINT indices  # Output: [0, 1] (2 + 7 = 9)
```

---

### three_sum(arr)

Find all unique triplets that sum to zero.

**Time Complexity:** O(n²)  
**Space Complexity:** O(1)

**Example:**
```susa
let numbers = [-1, 0, 1, 2, -1, -4]
let triplets = three_sum(numbers)
PRINT triplets  # Output: [[-1, -1, 2], [-1, 0, 1]]
```

---

## String Algorithms

### palindrome_check(text)

Check if string is a palindrome.

**Time Complexity:** O(n)  
**Space Complexity:** O(1)

**Example:**
```susa
PRINT palindrome_check("racecar")  # Output: true
PRINT palindrome_check("hello")    # Output: false
PRINT palindrome_check("A man a plan a canal Panama")  # Depends on implementation
```

---

### anagram_check(str1, str2)

Check if two strings are anagrams.

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

**Example:**
```susa
PRINT anagram_check("listen", "silent")  # Output: true
PRINT anagram_check("hello", "world")    # Output: false
```

---

## Number Theory

### prime_sieve(n)

Find all prime numbers up to n using Sieve of Eratosthenes.

**Time Complexity:** O(n log log n)  
**Space Complexity:** O(n)

**Example:**
```susa
let primes = prime_sieve(30)
PRINT primes  # Output: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
```

---

### gcd_extended(a, b)

Calculate GCD and coefficients using Extended Euclidean Algorithm.

**Time Complexity:** O(log min(a, b))  
**Space Complexity:** O(log min(a, b))

**Example:**
```susa
let result = gcd_extended(35, 15)
PRINT result["gcd"]  # Output: 5
PRINT result["x"]    # Coefficient x
PRINT result["y"]    # Coefficient y
```

---

## Matrix Operations

### matrix_multiply(matrix1, matrix2)

Multiply two matrices.

**Time Complexity:** O(n³)  
**Space Complexity:** O(n²)

**Example:**
```susa
let m1 = [[1, 2], [3, 4]]
let m2 = [[5, 6], [7, 8]]
let result = matrix_multiply(m1, m2)
PRINT result  # Output: [[19, 22], [43, 50]]
```

---

### transpose_matrix(matrix)

Transpose a matrix.

**Time Complexity:** O(m × n)  
**Space Complexity:** O(m × n)

**Example:**
```susa
let matrix = [[1, 2, 3], [4, 5, 6]]
let transposed = transpose_matrix(matrix)
PRINT transposed  # Output: [[1, 4], [2, 5], [3, 6]]
```

---

### determinant(matrix)

Calculate matrix determinant (2x2 and 3x3 only).

**Time Complexity:** O(1) for 2x2, O(n) for 3x3  
**Space Complexity:** O(1)

**Example:**
```susa
let matrix2x2 = [[4, 3], [6, 3]]
PRINT determinant(matrix2x2)  # Output: -6

let matrix3x3 = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
PRINT determinant(matrix3x3)  # Output: 0
```

---

## Miscellaneous

### factorial_iterative(n)

Calculate factorial iteratively.

**Time Complexity:** O(n)  
**Space Complexity:** O(1)

**Example:**
```susa
PRINT factorial_iterative(5)   # Output: 120
PRINT factorial_iterative(10)  # Output: 3628800
```

---

## Complete Example

```susa
ADD algorithms

# Sorting comparison
let unsorted = [64, 34, 25, 12, 22, 11, 90]

PRINT "=== Sorting Algorithms ==="
PRINT rt"Original: {unsorted}"
PRINT rt"Bubble Sort: {bubble_sort(unsorted)}"
PRINT rt"Quick Sort: {quick_sort(unsorted)}"
PRINT rt"Merge Sort: {merge_sort(unsorted)}"

# Searching
PRINT "\n=== Searching ==="
let sorted_arr = [11, 12, 22, 25, 34, 64, 90]
PRINT rt"Binary Search for 25: {binary_search(sorted_arr, 25)}"
PRINT rt"Linear Search for 22: {linear_search(unsorted, 22)}"

# Graph algorithms
PRINT "\n=== Graph Algorithms ==="
let graph = {
    "A": ["B", "C"],
    "B": ["D", "E"],
    "C": ["F"],
    "D": [],
    "E": ["F"],
    "F": []
}

PRINT rt"BFS from A: {bfs(graph, 'A')}"
PRINT rt"DFS from A: {dfs(graph, 'A')}"

# Dynamic programming
PRINT "\n=== Dynamic Programming ==="
PRINT rt"Fibonacci(10): {fibonacci_dp(10)}"
PRINT rt"Fibonacci(20): {fibonacci_dp(20)}"

let weights = [2, 3, 4, 5]
let values = [3, 4, 5, 6]
PRINT rt"Knapsack (capacity 8): {knapsack(weights, values, 8)}"

PRINT rt"LCS('ABCDGH', 'AEDFHR'): {longest_common_subsequence('ABCDGH', 'AEDFHR')}"
PRINT rt"Edit Distance('kitten', 'sitting'): {edit_distance('kitten', 'sitting')}"

# Array algorithms
PRINT "\n=== Array Algorithms ==="
let arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
PRINT rt"Max Subarray Sum: {kadane(arr)}"

let nums = [2, 7, 11, 15]
PRINT rt"Two Sum (target 9): {two_sum(nums, 9)}"

let three_sum_arr = [-1, 0, 1, 2, -1, -4]
PRINT rt"Three Sum: {three_sum(three_sum_arr)}"

# String algorithms
PRINT "\n=== String Algorithms ==="
PRINT rt"Is 'racecar' palindrome? {palindrome_check('racecar')}"
PRINT rt"Are 'listen' and 'silent' anagrams? {anagram_check('listen', 'silent')}"

# Number theory
PRINT "\n=== Number Theory ==="
let primes = prime_sieve(30)
PRINT rt"Primes up to 30: {primes}"

let gcd_result = gcd_extended(35, 15)
PRINT rt"GCD(35, 15): {gcd_result['gcd']}"

# Matrix operations
PRINT "\n=== Matrix Operations ==="
let m1 = [[1, 2], [3, 4]]
let m2 = [[5, 6], [7, 8]]
PRINT rt"Matrix Multiply: {matrix_multiply(m1, m2)}"

let matrix = [[1, 2, 3], [4, 5, 6]]
PRINT rt"Transpose: {transpose_matrix(matrix)}"

# Factorial
PRINT "\n=== Miscellaneous ==="
PRINT rt"Factorial(5): {factorial_iterative(5)}"
PRINT rt"Factorial(10): {factorial_iterative(10)}"
```

---

## Algorithm Complexity Summary

| Algorithm | Time Complexity | Space Complexity | Best For |
|-----------|----------------|------------------|----------|
| Bubble Sort | O(n²) | O(1) | Small datasets, educational |
| Quick Sort | O(n log n) avg | O(log n) | General purpose, fast average |
| Merge Sort | O(n log n) | O(n) | Stable sort, linked lists |
| Heap Sort | O(n log n) | O(1) | In-place sorting |
| Binary Search | O(log n) | O(1) | Sorted arrays |
| BFS | O(V + E) | O(V) | Shortest path, level-order |
| DFS | O(V + E) | O(V) | Topological sort, cycles |
| Dijkstra | O(V²) | O(V) | Shortest paths, weighted graphs |
| Kadane | O(n) | O(1) | Maximum subarray |
| Two Sum | O(n) | O(n) | Pair finding |

---

## When to Use Which Algorithm

**Sorting:**
- Small arrays (< 50 elements): Insertion Sort
- General purpose: Quick Sort or Merge Sort
- Stable sort needed: Merge Sort
- Memory constrained: Heap Sort

**Searching:**
- Sorted array: Binary Search
- Unsorted array: Linear Search
- String patterns: Use Trie

**Graph:**
- Shortest path (unweighted): BFS
- Shortest path (weighted): Dijkstra
- Detect cycles: DFS
- Topological sort: DFS

**Dynamic Programming:**
- Optimization problems: Knapsack, LCS
- Sequence problems: Fibonacci, Edit Distance
- Subarray problems: Kadane

---

## Related Modules

- [Data Structures](data_structures.md) - Data structures used by algorithms
- [Array Utils](array_utils.md) - Array manipulation utilities
- [Math Utils](math_utils.md) - Mathematical functions


