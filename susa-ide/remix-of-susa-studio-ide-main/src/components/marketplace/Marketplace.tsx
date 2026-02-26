import React, { useState, useEffect } from 'react';
import {
  Package,
  Download,
  Star,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Code,
  Users,
  Calendar,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { fileSystemService } from '@/services/fileSystemService';
import { useEditorStore } from '@/store/editorStore';

interface SUSAModule {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  downloads: number;
  rating: number;
  tags: string[];
  category: 'utility' | 'math' | 'web' | 'data';
  size: string;
  lastUpdated: string;
  documentation?: string;
  repository?: string;
  installed: boolean;
  code: string; // SUSA module code
}

const SAMPLE_MODULES: SUSAModule[] = [
  {
    id: 'array-utils',
    name: 'Array Utils',
    description: 'Comprehensive array manipulation with 50+ functions including map, filter, reduce, sort, and set operations',
    version: '1.0.0',
    author: 'SUSA Team',
    downloads: 2500,
    rating: 4.9,
    tags: ['arrays', 'utility', 'functional', 'collections'],
    category: 'utility',
    size: '45 KB',
    lastUpdated: '2024-12-22',
    installed: false,
    code: `# Array/List Utilities Module for SUSA
# Comprehensive array manipulation and utility functions

SHARE push, pop, shift, unshift, slice, splice, concat, reverse_array, sort_array,
      filter_array, map_array, reduce_array, find, find_index, includes, unique,
      flatten, chunk, zip, intersection, union, difference, shuffle, sample

# Add element to end of array
FUNC push(array, element): START:
    append(array, element)
    RETURN array
END:

# Filter array based on condition
FUNC filter_array(array, condition_func): START:
    let result = []
    LOOP i = 0 FOR length(array) TIMES: START:
        IF condition_func(array[i]): START:
            append(result, array[i])
        END:
    END:
    RETURN result
END:

# Map array elements
FUNC map_array(array, transform_func): START:
    let result = []
    LOOP i = 0 FOR length(array) TIMES: START:
        append(result, transform_func(array[i]))
    END:
    RETURN result
END:

# Get unique elements
FUNC unique(array): START:
    let result = []
    LOOP i = 0 FOR length(array) TIMES: START:
        IF NOT includes(result, array[i]): START:
            append(result, array[i])
        END:
    END:
    RETURN result
END:`
  },
  {
    id: 'string-utils',
    name: 'String Utils',
    description: 'Powerful string manipulation with 30+ functions for formatting, validation, and text processing',
    version: '1.0.0',
    author: 'SUSA Team',
    downloads: 2100,
    rating: 4.8,
    tags: ['string', 'text', 'formatting', 'validation'],
    category: 'utility',
    size: '32 KB',
    lastUpdated: '2024-12-22',
    installed: false,
    code: `# String Utilities Module for SUSA
# Comprehensive string manipulation functions

SHARE capitalize, reverse, trim, split, join, replace_all, contains, starts_with,
      ends_with, to_upper, to_lower, word_count, camel_case, snake_case, kebab_case

# Capitalize first letter of string
FUNC capitalize(text): START:
    IF is_empty(text): START:
        RETURN ""
    END:
    RETURN text[0].upper() + text[1:].lower()
END:

# Split string by delimiter
FUNC split(text, delimiter): START:
    IF is_empty(text): START:
        RETURN []
    END:
    
    let result = []
    let current = ""
    let i = 0
    
    WHILE i < text.length: START:
        IF text[i:i + delimiter.length] == delimiter: START:
            append(result, current)
            current = ""
            i = i + delimiter.length
        ELSE: START:
            current = current + text[i]
            i = i + 1
        END:
    END:
    
    append(result, current)
    RETURN result
END:

# Convert to camelCase
FUNC camel_case(text): START:
    let words = split(to_lower(text), " ")
    IF words.length == 0: START:
        RETURN ""
    END:
    
    let result = words[0]
    LOOP i = 1 FOR words.length - 1 TIMES: START:
        result = result + capitalize(words[i])
    END:
    
    RETURN result
END:`
  },
  {
    id: 'math-utils',
    name: 'Math Utils',
    description: 'Advanced mathematical functions including trigonometry, statistics, and number theory with constants',
    version: '1.0.0',
    author: 'SUSA Team',
    downloads: 1800,
    rating: 4.9,
    tags: ['math', 'statistics', 'trigonometry', 'algorithms'],
    category: 'math',
    size: '38 KB',
    lastUpdated: '2024-12-22',
    installed: false,
    code: `# Math Utilities Module for SUSA
# Comprehensive mathematical functions and constants

SHARE abs, max, min, pow, sqrt, factorial, fibonacci, gcd, lcm, is_prime,
      sin, cos, tan, average, median, standard_deviation, PI, E, GOLDEN_RATIO

# Mathematical constants
let PI = 3.14159265358979323846
let E = 2.71828182845904523536
let GOLDEN_RATIO = 1.61803398874989484820

# Factorial
FUNC factorial(n): START:
    IF n < 0: START:
        THROW "Factorial is not defined for negative numbers"
    END:
    IF n <= 1: START:
        RETURN 1
    END:
    RETURN n * factorial(n - 1)
END:

# Check if number is prime
FUNC is_prime(n): START:
    IF n <= 1: START:
        RETURN false
    END:
    IF n <= 3: START:
        RETURN true
    END:
    IF n % 2 == 0 OR n % 3 == 0: START:
        RETURN false
    END:
    
    let i = 5
    WHILE i * i <= n: START:
        IF n % i == 0 OR n % (i + 2) == 0: START:
            RETURN false
        END:
        i = i + 6
    END:
    
    RETURN true
END:

# Average of array elements
FUNC average(array): START:
    IF array.length == 0: START:
        THROW "Cannot calculate average of empty array"
    END:
    
    let total = 0
    LOOP i = 0 FOR array.length TIMES: START:
        total = total + array[i]
    END:
    
    RETURN total / array.length
END:`
  },
  {
    id: 'datetime-utils',
    name: 'DateTime Utils',
    description: 'Complete date and time manipulation with formatting, parsing, arithmetic, and timezone support',
    version: '1.0.0',
    author: 'SUSA Team',
    downloads: 1600,
    rating: 4.7,
    tags: ['date', 'time', 'formatting', 'timezone'],
    category: 'utility',
    size: '42 KB',
    lastUpdated: '2024-12-22',
    installed: false,
    code: `# DateTime Utilities Module for SUSA
# Comprehensive date and time manipulation functions

SHARE now, format_date, parse_date, add_days, add_months, days_between,
      is_leap_year, start_of_day, end_of_day, timestamp, from_timestamp

# Get current date and time
FUNC now(): START:
    USE PYTHON: START:
    "
    from datetime import datetime
    return datetime.now()
    "
    END:
END:

# Format date to string
FUNC format_date(date, format_string): START:
    USE PYTHON: START:
    "
    return date.strftime(format_string)
    "
    END:
END:

# Add days to date
FUNC add_days(date, days): START:
    USE PYTHON: START:
    "
    from datetime import timedelta
    return date + timedelta(days=days)
    "
    END:
END:

# Check if year is leap year
FUNC is_leap_year(year): START:
    RETURN (year % 4 == 0 AND year % 100 != 0) OR (year % 400 == 0)
END:

# Get start of day (00:00:00)
FUNC start_of_day(date): START:
    USE PYTHON: START:
    "
    return date.replace(hour=0, minute=0, second=0, microsecond=0)
    "
    END:
END:`
  },
  {
    id: 'file-utils',
    name: 'File Utils',
    description: 'Complete file system operations including read/write, JSON/CSV support, and advanced file management',
    version: '1.0.0',
    author: 'SUSA Team',
    downloads: 1400,
    rating: 4.8,
    tags: ['files', 'io', 'json', 'csv', 'filesystem'],
    category: 'utility',
    size: '35 KB',
    lastUpdated: '2024-12-22',
    installed: false,
    code: `# File Utilities Module for SUSA
# Comprehensive file and directory operations

SHARE read_file, write_file, append_file, delete_file, copy_file, exists,
      create_directory, list_directory, read_json, write_json, read_csv, write_csv

# Read entire file content
FUNC read_file(file_path): START:
    USE PYTHON: START:
    "
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except Exception as e:
        raise Exception(f'Error reading file: {str(e)}')
    "
    END:
END:

# Write content to file
FUNC write_file(file_path, content): START:
    USE PYTHON: START:
    "
    try:
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(content)
        return True
    except Exception as e:
        raise Exception(f'Error writing file: {str(e)}')
    "
    END:
END:

# Read JSON file
FUNC read_json(file_path): START:
    USE PYTHON: START:
    "
    import json
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return json.load(file)
    except Exception as e:
        raise Exception(f'Error reading JSON file: {str(e)}')
    "
    END:
END:

# Write JSON file
FUNC write_json(file_path, data): START:
    USE PYTHON: START:
    "
    import json
    try:
        with open(file_path, 'w', encoding='utf-8') as file:
            json.dump(data, file, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        raise Exception(f'Error writing JSON file: {str(e)}')
    "
    END:
END:`
  },
  {
    id: 'json-utils',
    name: 'JSON Utils',
    description: 'Advanced JSON processing with parsing, validation, schema support, and transformation utilities',
    version: '1.0.0',
    author: 'SUSA Team',
    downloads: 1200,
    rating: 4.6,
    tags: ['json', 'parsing', 'validation', 'schema'],
    category: 'data',
    size: '28 KB',
    lastUpdated: '2024-12-22',
    installed: false,
    code: `# JSON Utilities Module for SUSA
# Comprehensive JSON parsing and manipulation functions

SHARE parse, stringify, validate, pretty_print, minify, merge, deep_merge,
      get_value, set_value, flatten_json, json_schema_validate, json_diff

# Parse JSON string to object
FUNC parse(json_string): START:
    USE PYTHON: START:
    "
    import json
    try:
        return json.loads(json_string)
    except json.JSONDecodeError as e:
        raise Exception(f'Invalid JSON: {str(e)}')
    "
    END:
END:

# Convert object to JSON string
FUNC stringify(obj, indent): START:
    USE PYTHON: START:
    "
    import json
    try:
        if indent is None:
            return json.dumps(obj, ensure_ascii=False)
        else:
            return json.dumps(obj, indent=indent, ensure_ascii=False)
    except Exception as e:
        raise Exception(f'Error converting to JSON: {str(e)}')
    "
    END:
END:

# Deep merge two JSON objects
FUNC deep_merge(obj1, obj2): START:
    USE PYTHON: START:
    "
    def deep_merge_dicts(dict1, dict2):
        result = dict1.copy()
        for key, value in dict2.items():
            if key in result and isinstance(result[key], dict) and isinstance(value, dict):
                result[key] = deep_merge_dicts(result[key], value)
            else:
                result[key] = value
        return result
    
    if isinstance(obj1, dict) and isinstance(obj2, dict):
        return deep_merge_dicts(obj1, obj2)
    else:
        return obj2
    "
    END:
END:`
  },
  {
    id: 'http-client',
    name: 'HTTP Client',
    description: 'Full-featured HTTP client with all methods, authentication, file upload/download, and retry logic',
    version: '1.0.0',
    author: 'SUSA Team',
    downloads: 1900,
    rating: 4.9,
    tags: ['http', 'api', 'web', 'requests', 'client'],
    category: 'web',
    size: '40 KB',
    lastUpdated: '2024-12-22',
    installed: false,
    code: `# HTTP Client Module for SUSA
# Comprehensive HTTP request and response handling

SHARE get, post, put, delete, patch, download_file, upload_file, add_bearer_token,
      add_basic_auth, url_encode, url_decode, retry_request, create_session

# HTTP GET request
FUNC get(url, headers, params, timeout): START:
    RETURN request("GET", url, null, headers, params, timeout)
END:

# HTTP POST request
FUNC post(url, data, headers, timeout): START:
    RETURN request("POST", url, data, headers, null, timeout)
END:

# Generic HTTP request
FUNC request(method, url, data, headers, params, timeout): START:
    USE PYTHON: START:
    "
    import requests
    import json
    
    try:
        request_args = {
            'method': method,
            'url': url,
            'headers': headers or {},
            'timeout': timeout or 30
        }
        
        if params:
            request_args['params'] = params
        
        if data is not None:
            if isinstance(data, dict):
                request_args['json'] = data
            else:
                request_args['data'] = data
        
        response = requests.request(**request_args)
        
        result = {
            'status_code': response.status_code,
            'headers': dict(response.headers),
            'ok': response.ok,
            'url': response.url
        }
        
        try:
            result['data'] = response.json()
        except:
            result['data'] = response.text
        
        return result
        
    except Exception as e:
        return {
            'error': str(e),
            'status_code': 0,
            'ok': False
        }
    "
    END:
END:

# Add Bearer token authentication
FUNC add_bearer_token(headers, token): START:
    IF headers == null: START:
        headers = {}
    END:
    headers['Authorization'] = rt"Bearer {token}"
    RETURN headers
END:`
  },
  {
    id: 'data-structures',
    name: 'Data Structures',
    description: 'Complete implementation of essential data structures: Stack, Queue, LinkedList, BinaryTree, HashMap, Set, and more',
    version: '1.0.0',
    author: 'SUSA Team',
    downloads: 1300,
    rating: 4.8,
    tags: ['data-structures', 'algorithms', 'collections', 'oop'],
    category: 'data',
    size: '55 KB',
    lastUpdated: '2024-12-22',
    installed: false,
    code: `# Data Structures Module for SUSA
# Implementation of common data structures

SHARE Stack, Queue, LinkedList, BinaryTree, HashMap, Set, PriorityQueue, Graph

# Stack implementation
CLASS Stack: START:
    FUNC init(): START:
        self.items = []
        self.size = 0
    END:
    
    FUNC push(item): START:
        append(self.items, item)
        self.size = self.size + 1
    END:
    
    FUNC pop(): START:
        IF self.is_empty(): START:
            THROW "Stack is empty"
        END:
        
        let item = self.items[self.size - 1]
        self.items = slice(self.items, 0, self.size - 1)
        self.size = self.size - 1
        RETURN item
    END:
    
    FUNC peek(): START:
        IF self.is_empty(): START:
            THROW "Stack is empty"
        END:
        RETURN self.items[self.size - 1]
    END:
    
    FUNC is_empty(): START:
        RETURN self.size == 0
    END:
    
    FUNC get_size(): START:
        RETURN self.size
    END:
END:

# Queue implementation
CLASS Queue: START:
    FUNC init(): START:
        self.items = []
        self.front = 0
        self.rear = 0
    END:
    
    FUNC enqueue(item): START:
        append(self.items, item)
        self.rear = self.rear + 1
    END:
    
    FUNC dequeue(): START:
        IF self.is_empty(): START:
            THROW "Queue is empty"
        END:
        
        let item = self.items[self.front]
        self.front = self.front + 1
        RETURN item
    END:
    
    FUNC is_empty(): START:
        RETURN self.front == self.rear
    END:
END:`
  },
  {
    id: 'algorithms',
    name: 'Algorithms',
    description: 'Comprehensive algorithm library with sorting, searching, graph algorithms, dynamic programming, and more',
    version: '1.0.0',
    author: 'SUSA Team',
    downloads: 1100,
    rating: 4.9,
    tags: ['algorithms', 'sorting', 'searching', 'graph', 'dynamic-programming'],
    category: 'utility',
    size: '65 KB',
    lastUpdated: '2024-12-22',
    installed: false,
    code: `# Algorithms Module for SUSA
# Implementation of common algorithms

SHARE bubble_sort, quick_sort, merge_sort, binary_search, bfs, dfs, dijkstra,
      knapsack, fibonacci_dp, kadane, two_sum, palindrome_check, prime_sieve

# Quick Sort
FUNC quick_sort(arr): START:
    IF length(arr) <= 1: START:
        RETURN arr
    END:
    
    let pivot = arr[length(arr) / 2]
    let left = []
    let middle = []
    let right = []
    
    LOOP i = 0 FOR length(arr) TIMES: START:
        IF arr[i] < pivot: START:
            append(left, arr[i])
        ELIF arr[i] == pivot: START:
            append(middle, arr[i])
        ELSE: START:
            append(right, arr[i])
        END:
    END:
    
    let sorted_left = quick_sort(left)
    let sorted_right = quick_sort(right)
    
    let result = []
    LOOP i = 0 FOR length(sorted_left) TIMES: START:
        append(result, sorted_left[i])
    END:
    LOOP i = 0 FOR length(middle) TIMES: START:
        append(result, middle[i])
    END:
    LOOP i = 0 FOR length(sorted_right) TIMES: START:
        append(result, sorted_right[i])
    END:
    
    RETURN result
END:

# Binary Search
FUNC binary_search(arr, target): START:
    let left = 0
    let right = length(arr) - 1
    
    WHILE left <= right: START:
        let mid = (left + right) / 2
        
        IF arr[mid] == target: START:
            RETURN mid
        ELIF arr[mid] < target: START:
            left = mid + 1
        ELSE: START:
            right = mid - 1
        END:
    END:
    
    RETURN -1
END:

# Kadane's Algorithm (Maximum Subarray Sum)
FUNC kadane(arr): START:
    let max_ending_here = 0
    let max_so_far = arr[0]
    
    LOOP i = 0 FOR length(arr) TIMES: START:
        max_ending_here = max_ending_here + arr[i]
        
        IF max_so_far < max_ending_here: START:
            max_so_far = max_ending_here
        END:
        
        IF max_ending_here < 0: START:
            max_ending_here = 0
        END:
    END:
    
    RETURN max_so_far
END:`
  }
];

interface MarketplaceProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ isOpen, onClose }) => {
  const [modules, setModules] = useState<SUSAModule[]>(SAMPLE_MODULES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedModule, setSelectedModule] = useState<SUSAModule | null>(null);

  const categories = [
    { id: 'all', name: 'All Categories', icon: Package },
    { id: 'utility', name: 'Utilities', icon: Code },
    { id: 'math', name: 'Mathematics', icon: Package },
    { id: 'web', name: 'Web & API', icon: ExternalLink },
    { id: 'data', name: 'Data Structures', icon: Package },
  ];

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleInstall = async (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;

    try {
      // Simulate installation process
      toast.info(`Installing ${module.name}...`);
      
      if (fileSystemService.isElectronApp()) {
        const { workspacePath, refreshFiles } = useEditorStore.getState();
        if (workspacePath) {
          const modulePath = `${workspacePath}/modules/${module.id}.susa`;
          
          // Create modules directory if it doesn't exist
          await fileSystemService.createDirectory(`${workspacePath}/modules`);
          
          // Write module code to file
          const result = await fileSystemService.writeFile(modulePath, module.code);
          
          if (result.success) {
            // Update module status
            setModules(prev => prev.map(m => 
              m.id === moduleId ? { ...m, installed: true } : m
            ));
            
            await refreshFiles();
            toast.success(`${module.name} installed successfully!`);
          } else {
            throw new Error(result.error);
          }
        }
      } else {
        // For web version, just mark as installed
        setModules(prev => prev.map(m => 
          m.id === moduleId ? { ...m, installed: true } : m
        ));
        toast.success(`${module.name} installed successfully!`);
      }
    } catch (error) {
      toast.error(`Failed to install ${module.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleUninstall = async (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;

    try {
      toast.info(`Uninstalling ${module.name}...`);
      
      if (fileSystemService.isElectronApp()) {
        const { workspacePath, refreshFiles } = useEditorStore.getState();
        if (workspacePath) {
          const modulePath = `${workspacePath}/modules/${module.id}.susa`;
          
          const result = await fileSystemService.deleteFile(modulePath);
          
          if (result.success) {
            setModules(prev => prev.map(m => 
              m.id === moduleId ? { ...m, installed: false } : m
            ));
            
            await refreshFiles();
            toast.success(`${module.name} uninstalled successfully!`);
          } else {
            throw new Error(result.error);
          }
        }
      } else {
        setModules(prev => prev.map(m => 
          m.id === moduleId ? { ...m, installed: false } : m
        ));
        toast.success(`${module.name} uninstalled successfully!`);
      }
    } catch (error) {
      toast.error(`Failed to uninstall ${module.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-background border border-border rounded-lg shadow-xl w-full max-w-6xl h-[80vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">SUSA Marketplace</h2>
              <p className="text-sm text-muted-foreground">Discover and install SUSA modules</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-border p-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Categories */}
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Categories</h3>
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-left",
                      selectedCategory === category.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex">
            {/* Module List */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid gap-4">
                {filteredModules.map((module) => (
                  <div
                    key={module.id}
                    className="border border-border rounded-lg p-4 hover:bg-secondary/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedModule(module)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{module.name}</h3>
                          <span className="text-xs bg-secondary px-2 py-1 rounded">
                            v{module.version}
                          </span>
                          {module.installed && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {module.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {module.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            {module.downloads.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {module.rating}
                          </span>
                        </div>
                        <div className="flex gap-1 mt-2">
                          {module.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="ml-4">
                        {module.installed ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUninstall(module.id);
                            }}
                            className="px-3 py-1 text-sm bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors"
                          >
                            Uninstall
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInstall(module.id);
                            }}
                            className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                          >
                            Install
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Module Details */}
            {selectedModule && (
              <div className="w-96 border-l border-border p-6 overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{selectedModule.name}</h3>
                      {selectedModule.installed && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedModule.description}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Version:</span>
                      <span>{selectedModule.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Author:</span>
                      <span>{selectedModule.author}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Downloads:</span>
                      <span>{selectedModule.downloads.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span>{selectedModule.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Updated:</span>
                      <span>{selectedModule.lastUpdated}</span>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {selectedModule.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {selectedModule.installed ? (
                    <button
                      onClick={() => handleUninstall(selectedModule.id)}
                      className="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors"
                    >
                      Uninstall Module
                    </button>
                  ) : (
                    <button
                      onClick={() => handleInstall(selectedModule.id)}
                      className="w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                    >
                      Install Module
                    </button>
                  )}

                  {(selectedModule.documentation || selectedModule.repository) && (
                    <div className="space-y-2">
                      {selectedModule.documentation && (
                        <a
                          href={selectedModule.documentation}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Documentation
                        </a>
                      )}
                      {selectedModule.repository && (
                        <a
                          href={selectedModule.repository}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Repository
                        </a>
                      )}
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium mb-2">Preview Code:</h4>
                    <pre className="text-xs bg-secondary p-3 rounded border overflow-x-auto">
                      <code>{selectedModule.code.substring(0, 300)}...</code>
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};