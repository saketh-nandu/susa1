# File Utils Module

The File Utils module provides comprehensive file and directory operations for reading, writing, and managing files in SUSA.

## Import

```susa
ADD file_utils
```

## Overview

This module includes functions for:
- Reading and writing files
- File and directory management
- Path manipulation
- File searching and backup
- JSON and CSV file operations
- File compression

---

## Basic File Operations

### read_file(file_path)

Read entire file content as a string.

**Parameters:**
- `file_path` (String) - Path to the file

**Returns:** String - File content

**Example:**
```susa
let content = read_file("data.txt")
PRINT content
```

---

### write_file(file_path, content)

Write content to a file (overwrites existing content).

**Parameters:**
- `file_path` (String) - Path to the file
- `content` (String) - Content to write

**Returns:** Boolean - true if successful

**Example:**
```susa
write_file("output.txt", "Hello, World!")
```

---

### append_file(file_path, content)

Append content to the end of a file.

**Parameters:**
- `file_path` (String) - Path to the file
- `content` (String) - Content to append

**Returns:** Boolean - true if successful

**Example:**
```susa
append_file("log.txt", "New log entry\n")
```

---

### delete_file(file_path)

Delete a file.

**Parameters:**
- `file_path` (String) - Path to the file

**Returns:** Boolean - true if successful

**Example:**
```susa
delete_file("temp.txt")
```

---

### copy_file(source_path, destination_path)

Copy a file to a new location.

**Parameters:**
- `source_path` (String) - Source file path
- `destination_path` (String) - Destination file path

**Returns:** Boolean - true if successful

**Example:**
```susa
copy_file("original.txt", "backup.txt")
```

---

### move_file(source_path, destination_path)

Move or rename a file.

**Parameters:**
- `source_path` (String) - Source file path
- `destination_path` (String) - Destination file path

**Returns:** Boolean - true if successful

**Example:**
```susa
move_file("old_name.txt", "new_name.txt")
```

---

## File and Directory Checks

### exists(path)

Check if a file or directory exists.

**Parameters:**
- `path` (String) - Path to check

**Returns:** Boolean - true if exists

**Example:**
```susa
IF exists("data.txt"): START:
    PRINT "File exists"
END:
```

---

### is_file(path)

Check if path is a file.

**Parameters:**
- `path` (String) - Path to check

**Returns:** Boolean - true if it's a file

**Example:**
```susa
IF is_file("data.txt"): START:
    PRINT "It's a file"
END:
```

---

### is_directory(path)

Check if path is a directory.

**Parameters:**
- `path` (String) - Path to check

**Returns:** Boolean - true if it's a directory

**Example:**
```susa
IF is_directory("folder"): START:
    PRINT "It's a directory"
END:
```

---

## Directory Operations

### create_directory(directory_path)

Create a directory (creates parent directories if needed).

**Parameters:**
- `directory_path` (String) - Path to create

**Returns:** Boolean - true if successful

**Example:**
```susa
create_directory("data/logs")
```

---

### delete_directory(directory_path)

Delete a directory and all its contents.

**Parameters:**
- `directory_path` (String) - Path to delete

**Returns:** Boolean - true if successful

**Example:**
```susa
delete_directory("temp_folder")
```

---

### list_directory(directory_path)

List all files and directories in a directory.

**Parameters:**
- `directory_path` (String) - Directory path

**Returns:** Array - List of file/directory names

**Example:**
```susa
let files = list_directory(".")
LOOP i = 0 FOR length(files) TIMES: START:
    PRINT files[i]
END:
```

---

## File Information

### get_file_size(file_path)

Get file size in bytes.

**Parameters:**
- `file_path` (String) - Path to file

**Returns:** Number - File size in bytes

**Example:**
```susa
let size = get_file_size("data.txt")
PRINT rt"File size: {size} bytes"
```

---

### get_file_extension(file_path)

Get file extension.

**Parameters:**
- `file_path` (String) - File path

**Returns:** String - File extension (including dot)

**Example:**
```susa
let ext = get_file_extension("document.pdf")
PRINT ext  # Output: ".pdf"
```

---

### get_file_name(file_path)

Get filename without directory path.

**Parameters:**
- `file_path` (String) - File path

**Returns:** String - Filename

**Example:**
```susa
let name = get_file_name("/path/to/file.txt")
PRINT name  # Output: "file.txt"
```

---

### get_directory_name(file_path)

Get directory path without filename.

**Parameters:**
- `file_path` (String) - File path

**Returns:** String - Directory path

**Example:**
```susa
let dir = get_directory_name("/path/to/file.txt")
PRINT dir  # Output: "/path/to"
```

---

## Path Manipulation

### join_path(path1, path2)

Join two path components.

**Parameters:**
- `path1` (String) - First path component
- `path2` (String) - Second path component

**Returns:** String - Combined path

**Example:**
```susa
let path = join_path("folder", "file.txt")
PRINT path  # Output: "folder/file.txt" or "folder\file.txt" on Windows
```

---

### split_path(file_path)

Split path into directory and filename.

**Parameters:**
- `file_path` (String) - File path

**Returns:** Array - [directory, filename]

**Example:**
```susa
let parts = split_path("/path/to/file.txt")
PRINT parts  # Output: ["/path/to", "file.txt"]
```

---

### normalize_path(path)

Normalize a path (resolve . and ..).

**Parameters:**
- `path` (String) - Path to normalize

**Returns:** String - Normalized path

**Example:**
```susa
let normalized = normalize_path("folder/../file.txt")
PRINT normalized  # Output: "file.txt"
```

---

### absolute_path(path)

Get absolute path from relative path.

**Parameters:**
- `path` (String) - Relative path

**Returns:** String - Absolute path

**Example:**
```susa
let abs = absolute_path("file.txt")
PRINT abs  # Output: "/full/path/to/file.txt"
```

---

### relative_path(path, start)

Get relative path from one path to another.

**Parameters:**
- `path` (String) - Target path
- `start` (String) - Starting path

**Returns:** String - Relative path

**Example:**
```susa
let rel = relative_path("/a/b/c/file.txt", "/a/b")
PRINT rel  # Output: "c/file.txt"
```

---

## Directory Navigation

### get_current_directory()

Get current working directory.

**Returns:** String - Current directory path

**Example:**
```susa
let cwd = get_current_directory()
PRINT rt"Current directory: {cwd}"
```

---

### change_directory(directory_path)

Change current working directory.

**Parameters:**
- `directory_path` (String) - New directory path

**Returns:** Boolean - true if successful

**Example:**
```susa
change_directory("subfolder")
```

---

### get_home_directory()

Get user's home directory.

**Returns:** String - Home directory path

**Example:**
```susa
let home = get_home_directory()
PRINT rt"Home: {home}"
```

---

### get_temp_directory()

Get system temporary directory.

**Returns:** String - Temp directory path

**Example:**
```susa
let temp = get_temp_directory()
PRINT rt"Temp: {temp}"
```

---

## Line-Based File Operations

### read_lines(file_path)

Read file as array of lines.

**Parameters:**
- `file_path` (String) - Path to file

**Returns:** Array - Array of lines

**Example:**
```susa
let lines = read_lines("data.txt")
LOOP i = 0 FOR length(lines) TIMES: START:
    PRINT rt"Line {i + 1}: {lines[i]}"
END:
```

---

### write_lines(file_path, lines)

Write array of lines to file.

**Parameters:**
- `file_path` (String) - Path to file
- `lines` (Array) - Array of lines

**Returns:** Boolean - true if successful

**Example:**
```susa
let lines = ["Line 1", "Line 2", "Line 3"]
write_lines("output.txt", lines)
```

---

## JSON File Operations

### read_json(file_path)

Read and parse JSON file.

**Parameters:**
- `file_path` (String) - Path to JSON file

**Returns:** Object/Array - Parsed JSON data

**Example:**
```susa
let data = read_json("config.json")
PRINT data["name"]
```

---

### write_json(file_path, data)

Write data to JSON file with formatting.

**Parameters:**
- `file_path` (String) - Path to JSON file
- `data` (Object/Array) - Data to write

**Returns:** Boolean - true if successful

**Example:**
```susa
let config = {"name": "MyApp", "version": "1.0"}
write_json("config.json", config)
```

---

## CSV File Operations

### read_csv(file_path)

Read CSV file as array of arrays.

**Parameters:**
- `file_path` (String) - Path to CSV file

**Returns:** Array - Array of rows (each row is an array)

**Example:**
```susa
let data = read_csv("data.csv")
LOOP i = 0 FOR length(data) TIMES: START:
    PRINT data[i]
END:
```

---

### write_csv(file_path, data)

Write array of arrays to CSV file.

**Parameters:**
- `file_path` (String) - Path to CSV file
- `data` (Array) - Array of rows

**Returns:** Boolean - true if successful

**Example:**
```susa
let data = [
    ["Name", "Age", "City"],
    ["Alice", "25", "NYC"],
    ["Bob", "30", "LA"]
]
write_csv("people.csv", data)
```

---

## File Searching

### find_files(directory, pattern)

Find files matching a pattern.

**Parameters:**
- `directory` (String) - Directory to search
- `pattern` (String) - Glob pattern (e.g., "*.txt", "**/*.py")

**Returns:** Array - Array of matching file paths

**Example:**
```susa
let txt_files = find_files(".", "*.txt")
PRINT rt"Found {length(txt_files)} text files"
```

---

### search_in_files(directory, search_text, file_pattern)

Search for text in files.

**Parameters:**
- `directory` (String) - Directory to search
- `search_text` (String) - Text to find
- `file_pattern` (String) - File pattern

**Returns:** Array - Array of matches with file, line number, and content

**Example:**
```susa
let results = search_in_files(".", "TODO", "*.susa")
LOOP i = 0 FOR length(results) TIMES: START:
    let match = results[i]
    PRINT rt"{match['file']}:{match['line']} - {match['content']}"
END:
```

---

## File Backup and Compression

### backup_file(file_path)

Create a timestamped backup of a file.

**Parameters:**
- `file_path` (String) - File to backup

**Returns:** String - Path to backup file

**Example:**
```susa
let backup_path = backup_file("important.txt")
PRINT rt"Backup created: {backup_path}"
```

---

### compress_file(file_path, archive_path)

Compress a file to ZIP archive.

**Parameters:**
- `file_path` (String) - File to compress
- `archive_path` (String) - Output ZIP file path

**Returns:** Boolean - true if successful

**Example:**
```susa
compress_file("data.txt", "data.zip")
```

---

### decompress_file(archive_path, extract_path)

Extract files from ZIP archive.

**Parameters:**
- `archive_path` (String) - ZIP file path
- `extract_path` (String) - Directory to extract to

**Returns:** Boolean - true if successful

**Example:**
```susa
decompress_file("data.zip", "extracted")
```

---

## Complete Example

```susa
ADD file_utils

# Create directory structure
create_directory("data/logs")
create_directory("data/backups")

# Write data to file
let content = "Hello, SUSA!\nThis is a test file."
write_file("data/test.txt", content)

# Read and display
let read_content = read_file("data/test.txt")
PRINT rt"File content:\n{read_content}"

# Get file info
let size = get_file_size("data/test.txt")
let ext = get_file_extension("data/test.txt")
PRINT rt"Size: {size} bytes, Extension: {ext}"

# Work with JSON
let config = {
    "app_name": "MyApp",
    "version": "1.0.0",
    "settings": {
        "debug": true,
        "port": 8080
    }
}
write_json("data/config.json", config)

let loaded_config = read_json("data/config.json")
PRINT rt"App: {loaded_config['app_name']}"

# Work with CSV
let csv_data = [
    ["Name", "Age", "City"],
    ["Alice", "25", "New York"],
    ["Bob", "30", "Los Angeles"],
    ["Charlie", "35", "Chicago"]
]
write_csv("data/people.csv", csv_data)

let people = read_csv("data/people.csv")
PRINT rt"Loaded {length(people)} rows"

# List directory contents
let files = list_directory("data")
PRINT "Files in data directory:"
LOOP i = 0 FOR length(files) TIMES: START:
    PRINT rt"  - {files[i]}"
END:

# Create backup
let backup_path = backup_file("data/test.txt")
PRINT rt"Backup created: {backup_path}"

# Find all text files
let txt_files = find_files("data", "*.txt")
PRINT rt"Found {length(txt_files)} text files"

# Search in files
let results = search_in_files("data", "SUSA", "*.txt")
IF length(results) > 0: START:
    PRINT "Search results:"
    LOOP i = 0 FOR length(results) TIMES: START:
        let match = results[i]
        PRINT rt"  {match['file']}:{match['line']}"
    END:
END:

# Compress file
compress_file("data/test.txt", "data/test.zip")
PRINT "File compressed"

# Clean up
delete_file("data/test.txt")
PRINT "Cleanup complete"
```

---

## Function Summary

| Category | Functions |
|----------|-----------|
| Basic Operations | read_file, write_file, append_file, delete_file, copy_file, move_file |
| Checks | exists, is_file, is_directory |
| Directory Ops | create_directory, delete_directory, list_directory |
| File Info | get_file_size, get_file_extension, get_file_name, get_directory_name |
| Path Manipulation | join_path, split_path, normalize_path, absolute_path, relative_path |
| Navigation | get_current_directory, change_directory, get_home_directory, get_temp_directory |
| Line Operations | read_lines, write_lines |
| JSON | read_json, write_json |
| CSV | read_csv, write_csv |
| Searching | find_files, search_in_files |
| Backup/Compress | backup_file, compress_file, decompress_file |

---

## Related Modules

- [JSON Utils](json_utils.md) - Advanced JSON manipulation
- [String Utils](string_utils.md) - String processing for file content
- [DateTime Utils](datetime_utils.md) - File timestamp operations


