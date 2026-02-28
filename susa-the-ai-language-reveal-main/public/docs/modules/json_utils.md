# JSON Utils Module

The JSON Utils module provides comprehensive JSON parsing, manipulation, and transformation functions for SUSA.

## Import

```susa
ADD json_utils
```

## Overview

This module includes functions for:
- JSON parsing and stringification
- JSON validation and formatting
- Deep merging and manipulation
- Path-based access (dot notation)
- JSON schema validation
- JSON/CSV conversion
- JSON comparison and patching

---

## Basic JSON Operations

### parse(json_string)

Parse JSON string to object.

**Parameters:**
- `json_string` (String) - JSON string to parse

**Returns:** Object/Array - Parsed JSON data

**Example:**
```susa
let json_str = '{"name": "Alice", "age": 25}'
let obj = parse(json_str)
PRINT obj["name"]  # Output: "Alice"
```

---

### stringify(obj, indent)

Convert object to JSON string.

**Parameters:**
- `obj` (Object/Array) - Object to convert
- `indent` (Number/null) - Indentation spaces (null for compact)

**Returns:** String - JSON string

**Example:**
```susa
let obj = {"name": "Alice", "age": 25}
let json = stringify(obj, 2)
PRINT json
# Output:
# {
#   "name": "Alice",
#   "age": 25
# }
```

---

### validate(json_string)

Check if a string is valid JSON.

**Parameters:**
- `json_string` (String) - String to validate

**Returns:** Boolean - true if valid JSON

**Example:**
```susa
PRINT validate('{"name": "Alice"}')  # Output: true
PRINT validate('{invalid}')          # Output: false
```

---

### pretty_print(obj)

Format JSON with indentation.

**Parameters:**
- `obj` (Object/Array) - Object to format

**Returns:** String - Formatted JSON string

**Example:**
```susa
let obj = {"name": "Alice", "age": 25, "city": "NYC"}
let formatted = pretty_print(obj)
PRINT formatted
```

---

### minify(json_string)

Remove whitespace from JSON string.

**Parameters:**
- `json_string` (String) - JSON string to minify

**Returns:** String - Minified JSON string

**Example:**
```susa
let json = '{\n  "name": "Alice",\n  "age": 25\n}'
let minified = minify(json)
PRINT minified  # Output: {"name":"Alice","age":25}
```

---

## JSON Merging

### merge(obj1, obj2)

Shallow merge two JSON objects.

**Parameters:**
- `obj1` (Object) - First object
- `obj2` (Object) - Second object (overwrites obj1)

**Returns:** Object - Merged object

**Example:**
```susa
let obj1 = {"a": 1, "b": 2}
let obj2 = {"b": 3, "c": 4}
let merged = merge(obj1, obj2)
PRINT merged  # Output: {"a": 1, "b": 3, "c": 4}
```

---

### deep_merge(obj1, obj2)

Deep merge two JSON objects (recursive).

**Parameters:**
- `obj1` (Object) - First object
- `obj2` (Object) - Second object

**Returns:** Object - Deep merged object

**Example:**
```susa
let obj1 = {"a": {"x": 1, "y": 2}, "b": 3}
let obj2 = {"a": {"y": 5, "z": 6}, "c": 7}
let merged = deep_merge(obj1, obj2)
PRINT merged  # Output: {"a": {"x": 1, "y": 5, "z": 6}, "b": 3, "c": 7}
```

---

## Path-Based Access

### get_value(obj, path)

Get value from JSON using dot notation path.

**Parameters:**
- `obj` (Object) - JSON object
- `path` (String) - Dot notation path (e.g., "user.address.city")

**Returns:** Any - Value at path, or null if not found

**Example:**
```susa
let data = {
    "user": {
        "name": "Alice",
        "address": {
            "city": "NYC",
            "zip": "10001"
        }
    }
}

let city = get_value(data, "user.address.city")
PRINT city  # Output: "NYC"

let zip = get_value(data, "user.address.zip")
PRINT zip  # Output: "10001"
```

---

### set_value(obj, path, value)

Set value in JSON using dot notation path.

**Parameters:**
- `obj` (Object) - JSON object
- `path` (String) - Dot notation path
- `value` (Any) - Value to set

**Returns:** Object - Modified object

**Example:**
```susa
let data = {"user": {"name": "Alice"}}
set_value(data, "user.age", 25)
set_value(data, "user.address.city", "NYC")
PRINT data
# Output: {"user": {"name": "Alice", "age": 25, "address": {"city": "NYC"}}}
```

---

## Object Operations

### has_key(obj, key)

Check if object has a key.

**Parameters:**
- `obj` (Object) - JSON object
- `key` (String) - Key to check

**Returns:** Boolean - true if key exists

**Example:**
```susa
let obj = {"name": "Alice", "age": 25}
PRINT has_key(obj, "name")   # Output: true
PRINT has_key(obj, "email")  # Output: false
```

---

### remove_key(obj, key)

Remove a key from object.

**Parameters:**
- `obj` (Object) - JSON object
- `key` (String) - Key to remove

**Returns:** Object - Modified object

**Example:**
```susa
let obj = {"name": "Alice", "age": 25, "city": "NYC"}
remove_key(obj, "age")
PRINT obj  # Output: {"name": "Alice", "city": "NYC"}
```

---

### get_keys(obj)

Get all keys from object.

**Parameters:**
- `obj` (Object) - JSON object

**Returns:** Array - Array of keys

**Example:**
```susa
let obj = {"name": "Alice", "age": 25, "city": "NYC"}
let keys = get_keys(obj)
PRINT keys  # Output: ["name", "age", "city"]
```

---

### get_values(obj)

Get all values from object.

**Parameters:**
- `obj` (Object) - JSON object

**Returns:** Array - Array of values

**Example:**
```susa
let obj = {"name": "Alice", "age": 25, "city": "NYC"}
let values = get_values(obj)
PRINT values  # Output: ["Alice", 25, "NYC"]
```

---

## JSON Transformation

### flatten_json(obj, separator)

Flatten nested JSON object.

**Parameters:**
- `obj` (Object) - Nested JSON object
- `separator` (String) - Separator for keys (default: ".")

**Returns:** Object - Flattened object

**Example:**
```susa
let nested = {
    "user": {
        "name": "Alice",
        "address": {
            "city": "NYC",
            "zip": "10001"
        }
    }
}

let flat = flatten_json(nested, ".")
PRINT flat
# Output: {
#   "user.name": "Alice",
#   "user.address.city": "NYC",
#   "user.address.zip": "10001"
# }
```

---

### unflatten_json(obj, separator)

Unflatten JSON object back to nested structure.

**Parameters:**
- `obj` (Object) - Flattened JSON object
- `separator` (String) - Key separator

**Returns:** Object - Nested object

**Example:**
```susa
let flat = {
    "user.name": "Alice",
    "user.address.city": "NYC",
    "user.address.zip": "10001"
}

let nested = unflatten_json(flat, ".")
PRINT nested
# Output: {
#   "user": {
#     "name": "Alice",
#     "address": {"city": "NYC", "zip": "10001"}
#   }
# }
```

---

## JSON/CSV Conversion

### json_to_csv(json_array)

Convert JSON array to CSV string.

**Parameters:**
- `json_array` (Array) - Array of objects

**Returns:** String - CSV string

**Example:**
```susa
let data = [
    {"name": "Alice", "age": 25, "city": "NYC"},
    {"name": "Bob", "age": 30, "city": "LA"},
    {"name": "Charlie", "age": 35, "city": "Chicago"}
]

let csv = json_to_csv(data)
PRINT csv
# Output:
# name,age,city
# Alice,25,NYC
# Bob,30,LA
# Charlie,35,Chicago
```

---

### csv_to_json(csv_string)

Convert CSV string to JSON array.

**Parameters:**
- `csv_string` (String) - CSV string

**Returns:** Array - Array of objects

**Example:**
```susa
let csv = "name,age,city\nAlice,25,NYC\nBob,30,LA"
let data = csv_to_json(csv)
PRINT data
# Output: [
#   {"name": "Alice", "age": "25", "city": "NYC"},
#   {"name": "Bob", "age": "30", "city": "LA"}
# ]
```

---

## JSON Schema

### json_schema_validate(obj, schema)

Validate JSON against a schema.

**Parameters:**
- `obj` (Object) - JSON object to validate
- `schema` (Object) - JSON schema

**Returns:** Boolean - true if valid

**Example:**
```susa
let schema = {
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "age": {"type": "integer"}
    },
    "required": ["name", "age"]
}

let valid_obj = {"name": "Alice", "age": 25}
let invalid_obj = {"name": "Bob"}

PRINT json_schema_validate(valid_obj, schema)    # Output: true
PRINT json_schema_validate(invalid_obj, schema)  # Output: false
```

---

### create_schema(obj)

Generate JSON schema from an object.

**Parameters:**
- `obj` (Object) - Sample JSON object

**Returns:** Object - Generated schema

**Example:**
```susa
let sample = {
    "name": "Alice",
    "age": 25,
    "active": true,
    "tags": ["user", "admin"]
}

let schema = create_schema(sample)
PRINT pretty_print(schema)
```

---

## Advanced Operations

### filter_json(obj, condition_func)

Filter JSON object based on condition.

**Parameters:**
- `obj` (Object) - JSON object
- `condition_func` (Function) - Filter function(key, value)

**Returns:** Object - Filtered object

**Example:**
```susa
FUNC keep_numbers(key, value): START:
    RETURN typeof(value) == "number"
END:

let data = {"name": "Alice", "age": 25, "city": "NYC", "score": 95}
let filtered = filter_json(data, keep_numbers)
PRINT filtered  # Output: {"age": 25, "score": 95}
```

---

### transform_json(obj, transform_func)

Transform JSON object values.

**Parameters:**
- `obj` (Object) - JSON object
- `transform_func` (Function) - Transform function(key, value)

**Returns:** Object - Transformed object

**Example:**
```susa
FUNC double_numbers(key, value): START:
    IF typeof(value) == "number": START:
        RETURN value * 2
    END:
    RETURN value
END:

let data = {"a": 10, "b": 20, "c": "text"}
let transformed = transform_json(data, double_numbers)
PRINT transformed  # Output: {"a": 20, "b": 40, "c": "text"}
```

---

### sort_json(obj, reverse)

Sort JSON object by keys.

**Parameters:**
- `obj` (Object) - JSON object
- `reverse` (Boolean) - Sort in reverse order

**Returns:** Object - Sorted object

**Example:**
```susa
let obj = {"z": 1, "a": 2, "m": 3}
let sorted = sort_json(obj, false)
PRINT sorted  # Output: {"a": 2, "m": 3, "z": 1}
```

---

### search_json(obj, search_value)

Search for values in JSON and return paths.

**Parameters:**
- `obj` (Object) - JSON object
- `search_value` (Any) - Value to search for

**Returns:** Array - Array of paths where value was found

**Example:**
```susa
let data = {
    "user": {
        "name": "Alice",
        "age": 25,
        "settings": {
            "theme": "dark",
            "notifications": 25
        }
    }
}

let paths = search_json(data, 25)
PRINT paths  # Output: ["user.age", "user.settings.notifications"]
```

---

### json_diff(obj1, obj2)

Compare two JSON objects and find differences.

**Parameters:**
- `obj1` (Object) - First object
- `obj2` (Object) - Second object

**Returns:** Array - Array of differences

**Example:**
```susa
let obj1 = {"name": "Alice", "age": 25, "city": "NYC"}
let obj2 = {"name": "Alice", "age": 26, "country": "USA"}

let differences = json_diff(obj1, obj2)
PRINT differences
# Output: [
#   {"path": "age", "type": "changed", "old_value": 25, "new_value": 26},
#   {"path": "city", "type": "removed", "value": "NYC"},
#   {"path": "country", "type": "added", "value": "USA"}
# ]
```

---

### json_patch(obj, patch)

Apply JSON patch operations to an object.

**Parameters:**
- `obj` (Object) - JSON object
- `patch` (Array) - Array of patch operations

**Returns:** Object - Patched object

**Example:**
```susa
let obj = {"name": "Alice", "age": 25}

let patch = [
    {"op": "replace", "path": "/age", "value": 26},
    {"op": "add", "path": "/city", "value": "NYC"},
    {"op": "remove", "path": "/name"}
]

let patched = json_patch(obj, patch)
PRINT patched  # Output: {"age": 26, "city": "NYC"}
```

---

## Complete Example

```susa
ADD json_utils

# Parse and stringify
let json_str = '{"name": "Alice", "age": 25, "skills": ["Python", "JavaScript"]}'
let user = parse(json_str)
PRINT rt"Name: {user['name']}, Age: {user['age']}"

# Pretty print
let formatted = pretty_print(user)
PRINT rt"Formatted:\n{formatted}"

# Deep merge
let defaults = {"theme": "light", "notifications": true, "language": "en"}
let user_prefs = {"theme": "dark", "fontSize": 14}
let settings = deep_merge(defaults, user_prefs)
PRINT rt"Settings: {stringify(settings, 2)}"

# Path-based access
let data = {
    "company": {
        "name": "TechCorp",
        "employees": [
            {"name": "Alice", "role": "Developer"},
            {"name": "Bob", "role": "Designer"}
        ]
    }
}

let company_name = get_value(data, "company.name")
PRINT rt"Company: {company_name}"

set_value(data, "company.location", "San Francisco")
PRINT rt"Updated: {stringify(data, 2)}"

# Flatten and unflatten
let nested = {
    "user": {
        "profile": {
            "name": "Alice",
            "age": 25
        }
    }
}

let flat = flatten_json(nested, ".")
PRINT rt"Flattened: {stringify(flat, 2)}"

let unflat = unflatten_json(flat, ".")
PRINT rt"Unflattened: {stringify(unflat, 2)}"

# JSON to CSV
let users = [
    {"name": "Alice", "age": 25, "city": "NYC"},
    {"name": "Bob", "age": 30, "city": "LA"}
]

let csv = json_to_csv(users)
PRINT rt"CSV:\n{csv}"

# Schema validation
let schema = {
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "age": {"type": "integer"}
    },
    "required": ["name"]
}

let valid = {"name": "Alice", "age": 25}
let invalid = {"age": 25}

PRINT rt"Valid: {json_schema_validate(valid, schema)}"
PRINT rt"Invalid: {json_schema_validate(invalid, schema)}"

# Search in JSON
let search_data = {
    "users": [
        {"id": 1, "name": "Alice"},
        {"id": 2, "name": "Bob"},
        {"id": 1, "name": "Charlie"}
    ]
}

let paths = search_json(search_data, 1)
PRINT rt"Found value 1 at: {stringify(paths, null)}"

# Compare JSON objects
let old_config = {"version": "1.0", "debug": true, "port": 8080}
let new_config = {"version": "1.1", "debug": false, "host": "localhost"}

let diff = json_diff(old_config, new_config)
PRINT rt"Differences: {stringify(diff, 2)}"
```

---

## Function Summary

| Category | Functions |
|----------|-----------|
| Basic | parse, stringify, validate, pretty_print, minify |
| Merging | merge, deep_merge |
| Path Access | get_value, set_value |
| Object Ops | has_key, remove_key, get_keys, get_values |
| Transform | flatten_json, unflatten_json, filter_json, transform_json, sort_json |
| Conversion | json_to_csv, csv_to_json |
| Schema | json_schema_validate, create_schema |
| Advanced | search_json, json_diff, json_patch |

---

## Related Modules

- [File Utils](file_utils.md) - Read/write JSON files
- [String Utils](string_utils.md) - String manipulation
- [HTTP Client](http_client.md) - Send/receive JSON over HTTP


