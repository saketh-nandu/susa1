# Data Structures Module

The Data Structures module provides implementations of common data structures including Stack, Queue, LinkedList, BinaryTree, HashMap, Set, PriorityQueue, Graph, and Trie.

## Import

```susa
ADD data_structures
```

## Overview

This module includes:
- Stack (LIFO)
- Queue (FIFO)
- LinkedList
- BinaryTree (Binary Search Tree)
- HashMap (Hash Table)
- Set
- PriorityQueue (Min-Heap)
- Graph (Adjacency List)
- Trie (Prefix Tree)

---

## Stack

Last-In-First-Out (LIFO) data structure.

### Methods

- `init()` - Initialize empty stack
- `push(item)` - Add item to top
- `pop()` - Remove and return top item
- `peek()` - View top item without removing
- `is_empty()` - Check if stack is empty
- `get_size()` - Get number of items
- `clear()` - Remove all items

### Example

```susa
let stack = Stack()
stack.push(10)
stack.push(20)
stack.push(30)

PRINT stack.peek()      # Output: 30
PRINT stack.pop()       # Output: 30
PRINT stack.get_size()  # Output: 2
```

---

## Queue

First-In-First-Out (FIFO) data structure.

### Methods

- `init()` - Initialize empty queue
- `enqueue(item)` - Add item to rear
- `dequeue()` - Remove and return front item
- `peek()` - View front item without removing
- `is_empty()` - Check if queue is empty
- `get_size()` - Get number of items
- `clear()` - Remove all items

### Example

```susa
let queue = Queue()
queue.enqueue("First")
queue.enqueue("Second")
queue.enqueue("Third")

PRINT queue.dequeue()   # Output: "First"
PRINT queue.peek()      # Output: "Second"
PRINT queue.get_size()  # Output: 2
```

---

## LinkedList

Singly linked list implementation.

### Methods

- `init()` - Initialize empty list
- `append(data)` - Add to end
- `prepend(data)` - Add to beginning
- `insert_at(index, data)` - Insert at position
- `remove_at(index)` - Remove at position
- `find(data)` - Find index of data
- `get_at(index)` - Get data at index
- `to_array()` - Convert to array
- `get_size()` - Get number of nodes
- `is_empty()` - Check if empty

### Example

```susa
let list = LinkedList()
list.append(10)
list.append(20)
list.append(30)
list.prepend(5)

PRINT list.to_array()   # Output: [5, 10, 20, 30]
PRINT list.get_at(2)    # Output: 20
PRINT list.find(20)     # Output: 2

list.remove_at(1)
PRINT list.to_array()   # Output: [5, 20, 30]
```

---

## BinaryTree

Binary Search Tree implementation.

### Methods

- `init()` - Initialize empty tree
- `insert(data)` - Insert value
- `search(data)` - Check if value exists
- `inorder_traversal()` - Get sorted values
- `preorder_traversal()` - Get preorder values
- `postorder_traversal()` - Get postorder values
- `get_height()` - Get tree height
- `get_size()` - Get number of nodes

### Example

```susa
let tree = BinaryTree()
tree.insert(50)
tree.insert(30)
tree.insert(70)
tree.insert(20)
tree.insert(40)
tree.insert(60)
tree.insert(80)

PRINT tree.search(40)           # Output: true
PRINT tree.search(100)          # Output: false

let sorted = tree.inorder_traversal()
PRINT sorted                    # Output: [20, 30, 40, 50, 60, 70, 80]

PRINT tree.get_height()         # Output: 3
```

---

## HashMap

Hash table implementation with collision handling.

### Methods

- `init(capacity)` - Initialize with capacity (default: 16)
- `put(key, value)` - Add/update key-value pair
- `get(key)` - Get value by key
- `has_key(key)` - Check if key exists
- `remove_key(key)` - Remove key-value pair
- `keys()` - Get all keys
- `values()` - Get all values
- `get_size()` - Get number of pairs

### Example

```susa
let map = HashMap(16)
map.put("name", "Alice")
map.put("age", 25)
map.put("city", "NYC")

PRINT map.get("name")       # Output: "Alice"
PRINT map.has_key("age")    # Output: true

let all_keys = map.keys()
PRINT all_keys              # Output: ["name", "age", "city"]

map.remove_key("age")
PRINT map.get_size()        # Output: 2
```

---

## Set

Set implementation (unique elements).

### Methods

- `init()` - Initialize empty set
- `add_item(item)` - Add item (no duplicates)
- `remove_item(item)` - Remove item
- `contains(item)` - Check if item exists
- `union(other_set)` - Union with another set
- `intersection(other_set)` - Intersection with another set
- `difference(other_set)` - Difference from another set
- `to_array()` - Convert to array
- `get_size()` - Get number of items
- `is_empty()` - Check if empty

### Example

```susa
let set1 = Set()
set1.add_item(1)
set1.add_item(2)
set1.add_item(3)
set1.add_item(2)  # Duplicate, won't be added

PRINT set1.to_array()       # Output: [1, 2, 3]
PRINT set1.contains(2)      # Output: true

let set2 = Set()
set2.add_item(2)
set2.add_item(3)
set2.add_item(4)

let union_set = set1.union(set2)
PRINT union_set.to_array()  # Output: [1, 2, 3, 4]

let inter_set = set1.intersection(set2)
PRINT inter_set.to_array()  # Output: [2, 3]
```

---

## PriorityQueue

Min-heap priority queue implementation.

### Methods

- `init()` - Initialize empty queue
- `enqueue(item, priority)` - Add item with priority
- `dequeue()` - Remove and return item with lowest priority
- `peek()` - View item with lowest priority
- `is_empty()` - Check if empty
- `get_size()` - Get number of items

### Example

```susa
let pq = PriorityQueue()
pq.enqueue("Low priority task", 10)
pq.enqueue("High priority task", 1)
pq.enqueue("Medium priority task", 5)

PRINT pq.dequeue()  # Output: "High priority task" (priority 1)
PRINT pq.dequeue()  # Output: "Medium priority task" (priority 5)
PRINT pq.dequeue()  # Output: "Low priority task" (priority 10)
```

---

## Graph

Graph implementation using adjacency list.

### Methods

- `init(directed)` - Initialize graph (directed=true/false)
- `insert_vertex(vertex)` - Add vertex
- `insert_edge(from, to, weight)` - Add edge
- `has_vertex(vertex)` - Check if vertex exists
- `has_edge(from, to)` - Check if edge exists
- `get_neighbors(vertex)` - Get adjacent vertices
- `get_vertices()` - Get all vertices
- `get_vertex_count()` - Get number of vertices

### Example

```susa
let graph = Graph(false)  # Undirected graph

# Add vertices and edges
graph.insert_edge("A", "B", 1)
graph.insert_edge("A", "C", 2)
graph.insert_edge("B", "D", 3)
graph.insert_edge("C", "D", 1)

PRINT graph.has_vertex("A")     # Output: true
PRINT graph.has_edge("A", "B")  # Output: true

let neighbors = graph.get_neighbors("A")
PRINT neighbors                 # Output: ["B", "C"]

let all_vertices = graph.get_vertices()
PRINT all_vertices              # Output: ["A", "B", "C", "D"]
```

---

## Trie

Prefix tree implementation for string storage and search.

### Methods

- `init()` - Initialize empty trie
- `insert(word)` - Insert word
- `search(word)` - Check if word exists
- `starts_with(prefix)` - Check if prefix exists
- `get_words_with_prefix(prefix)` - Get all words with prefix

### Example

```susa
let trie = Trie()
trie.insert("apple")
trie.insert("app")
trie.insert("application")
trie.insert("apply")
trie.insert("banana")

PRINT trie.search("app")            # Output: true
PRINT trie.search("appl")           # Output: false
PRINT trie.starts_with("app")       # Output: true

let words = trie.get_words_with_prefix("app")
PRINT words  # Output: ["app", "apple", "application", "apply"]
```

---

## Complete Example

```susa
ADD data_structures

# Stack example
PRINT "=== Stack ==="
let stack = Stack()
stack.push(1)
stack.push(2)
stack.push(3)
PRINT rt"Stack size: {stack.get_size()}"
PRINT rt"Top: {stack.pop()}"

# Queue example
PRINT "\n=== Queue ==="
let queue = Queue()
queue.enqueue("Task 1")
queue.enqueue("Task 2")
queue.enqueue("Task 3")
PRINT rt"Processing: {queue.dequeue()}"
PRINT rt"Next: {queue.peek()}"

# LinkedList example
PRINT "\n=== LinkedList ==="
let list = LinkedList()
list.append(10)
list.append(20)
list.append(30)
list.prepend(5)
PRINT rt"List: {list.to_array()}"
PRINT rt"Element at index 2: {list.get_at(2)}"

# BinaryTree example
PRINT "\n=== BinaryTree ==="
let tree = BinaryTree()
let values = [50, 30, 70, 20, 40, 60, 80]
LOOP i = 0 FOR length(values) TIMES: START:
    tree.insert(values[i])
END:
PRINT rt"Sorted: {tree.inorder_traversal()}"
PRINT rt"Height: {tree.get_height()}"

# HashMap example
PRINT "\n=== HashMap ==="
let map = HashMap(16)
map.put("name", "Alice")
map.put("age", 25)
map.put("city", "NYC")
PRINT rt"Name: {map.get('name')}"
PRINT rt"Keys: {map.keys()}"

# Set example
PRINT "\n=== Set ==="
let set1 = Set()
set1.add_item(1)
set1.add_item(2)
set1.add_item(3)

let set2 = Set()
set2.add_item(2)
set2.add_item(3)
set2.add_item(4)

let union = set1.union(set2)
PRINT rt"Union: {union.to_array()}"

let intersection = set1.intersection(set2)
PRINT rt"Intersection: {intersection.to_array()}"

# PriorityQueue example
PRINT "\n=== PriorityQueue ==="
let pq = PriorityQueue()
pq.enqueue("Low", 10)
pq.enqueue("High", 1)
pq.enqueue("Medium", 5)
PRINT rt"Highest priority: {pq.dequeue()}"

# Graph example
PRINT "\n=== Graph ==="
let graph = Graph(false)
graph.insert_edge("A", "B", 1)
graph.insert_edge("A", "C", 2)
graph.insert_edge("B", "D", 3)
PRINT rt"Vertices: {graph.get_vertices()}"
PRINT rt"Neighbors of A: {graph.get_neighbors('A')}"

# Trie example
PRINT "\n=== Trie ==="
let trie = Trie()
trie.insert("apple")
trie.insert("app")
trie.insert("application")
PRINT rt"Search 'app': {trie.search('app')}"
PRINT rt"Words with 'app': {trie.get_words_with_prefix('app')}"
```

---

## Use Cases

| Data Structure | Best For |
|----------------|----------|
| Stack | Undo/redo, expression evaluation, backtracking |
| Queue | Task scheduling, BFS, message queues |
| LinkedList | Dynamic lists, insertion/deletion heavy operations |
| BinaryTree | Sorted data, fast search/insert/delete |
| HashMap | Key-value storage, fast lookups |
| Set | Unique elements, membership testing |
| PriorityQueue | Task scheduling, Dijkstra's algorithm |
| Graph | Networks, relationships, pathfinding |
| Trie | Autocomplete, spell checking, prefix search |

---

## Performance

| Operation | Stack | Queue | LinkedList | BinaryTree | HashMap | Set | PriorityQueue |
|-----------|-------|-------|------------|------------|---------|-----|---------------|
| Insert | O(1) | O(1) | O(1) | O(log n) | O(1) | O(n) | O(log n) |
| Delete | O(1) | O(1) | O(n) | O(log n) | O(1) | O(n) | O(log n) |
| Search | O(n) | O(n) | O(n) | O(log n) | O(1) | O(n) | O(n) |
| Access | O(n) | O(n) | O(n) | O(log n) | O(1) | - | O(1) |

---

## Related Modules

- [Algorithms](algorithms.md) - Algorithms that use these data structures
- [Array Utils](array_utils.md) - Array manipulation functions


