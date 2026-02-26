# HTTP Client Module

The HTTP Client module provides comprehensive HTTP request and response handling for making API calls and web requests in SUSA.

## Import

```susa
ADD http_client
```

## Overview

This module includes functions for:
- HTTP methods (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS)
- File upload and download
- Authentication (Bearer, Basic, API Key)
- URL encoding and parsing
- Cookie management
- Request retrying with backoff
- Custom headers and timeouts

---

## HTTP Methods

### get(url, headers, params, timeout)

Make an HTTP GET request.

**Parameters:**
- `url` (String) - Request URL
- `headers` (Object/null) - Custom headers
- `params` (Object/null) - Query parameters
- `timeout` (Number/null) - Timeout in seconds

**Returns:** Object - Response object

**Example:**
```susa
let response = get("https://api.example.com/users", null, null, null)
IF response["ok"]: START:
    PRINT response["data"]
END:
```

---

### post(url, data, headers, timeout)

Make an HTTP POST request.

**Parameters:**
- `url` (String) - Request URL
- `data` (Object/String) - Request body
- `headers` (Object/null) - Custom headers
- `timeout` (Number/null) - Timeout in seconds

**Returns:** Object - Response object

**Example:**
```susa
let user_data = {"name": "Alice", "email": "alice@example.com"}
let response = post("https://api.example.com/users", user_data, null, null)
PRINT response["status_code"]
```

---

### put(url, data, headers, timeout)

Make an HTTP PUT request.

**Parameters:**
- `url` (String) - Request URL
- `data` (Object/String) - Request body
- `headers` (Object/null) - Custom headers
- `timeout` (Number/null) - Timeout in seconds

**Returns:** Object - Response object

**Example:**
```susa
let updated_data = {"name": "Alice Smith"}
let response = put("https://api.example.com/users/1", updated_data, null, null)
```

---

### delete(url, headers, timeout)

Make an HTTP DELETE request.

**Parameters:**
- `url` (String) - Request URL
- `headers` (Object/null) - Custom headers
- `timeout` (Number/null) - Timeout in seconds

**Returns:** Object - Response object

**Example:**
```susa
let response = delete("https://api.example.com/users/1", null, null)
IF response["ok"]: START:
    PRINT "User deleted successfully"
END:
```

---

### patch(url, data, headers, timeout)

Make an HTTP PATCH request.

**Parameters:**
- `url` (String) - Request URL
- `data` (Object/String) - Request body
- `headers` (Object/null) - Custom headers
- `timeout` (Number/null) - Timeout in seconds

**Returns:** Object - Response object

**Example:**
```susa
let patch_data = {"email": "newemail@example.com"}
let response = patch("https://api.example.com/users/1", patch_data, null, null)
```

---

### head(url, headers, timeout)

Make an HTTP HEAD request (get headers only).

**Parameters:**
- `url` (String) - Request URL
- `headers` (Object/null) - Custom headers
- `timeout` (Number/null) - Timeout in seconds

**Returns:** Object - Response object

**Example:**
```susa
let response = head("https://api.example.com/users/1", null, null)
PRINT response["headers"]
```

---

### options(url, headers, timeout)

Make an HTTP OPTIONS request.

**Parameters:**
- `url` (String) - Request URL
- `headers` (Object/null) - Custom headers
- `timeout` (Number/null) - Timeout in seconds

**Returns:** Object - Response object

**Example:**
```susa
let response = options("https://api.example.com/users", null, null)
PRINT response["headers"]["Allow"]
```

---

## Generic Request

### request(method, url, data, headers, params, timeout)

Make a generic HTTP request with full control.

**Parameters:**
- `method` (String) - HTTP method (GET, POST, etc.)
- `url` (String) - Request URL
- `data` (Object/String/null) - Request body
- `headers` (Object/null) - Custom headers
- `params` (Object/null) - Query parameters
- `timeout` (Number/null) - Timeout in seconds

**Returns:** Object - Response object with:
  - `status_code` (Number) - HTTP status code
  - `ok` (Boolean) - true if status 200-299
  - `headers` (Object) - Response headers
  - `data` (Object/String) - Response body
  - `content_type` (String) - "json" or "text"
  - `url` (String) - Final URL (after redirects)
  - `elapsed` (Number) - Request duration in seconds

**Example:**
```susa
let response = request("GET", "https://api.example.com/data", null, null, {"page": 1}, 30)

PRINT rt"Status: {response['status_code']}"
PRINT rt"OK: {response['ok']}"
PRINT rt"Time: {response['elapsed']}s"
PRINT rt"Data: {response['data']}"
```

---

## File Operations

### download_file(url, file_path, headers, chunk_size)

Download a file from URL.

**Parameters:**
- `url` (String) - File URL
- `file_path` (String) - Local path to save file
- `headers` (Object/null) - Custom headers
- `chunk_size` (Number/null) - Download chunk size (default: 8192)

**Returns:** Object - Result with success, file_path, size, content_type

**Example:**
```susa
let result = download_file(
    "https://example.com/file.pdf",
    "downloads/file.pdf",
    null,
    null
)

IF result["success"]: START:
    PRINT rt"Downloaded {result['size']} bytes"
ELSE: START:
    PRINT rt"Error: {result['error']}"
END:
```

---

### upload_file(url, file_path, field_name, headers, additional_data)

Upload a file to URL.

**Parameters:**
- `url` (String) - Upload URL
- `file_path` (String) - Local file path
- `field_name` (String/null) - Form field name (default: "file")
- `headers` (Object/null) - Custom headers
- `additional_data` (Object/null) - Additional form data

**Returns:** Object - Response object

**Example:**
```susa
let response = upload_file(
    "https://api.example.com/upload",
    "document.pdf",
    "file",
    null,
    {"description": "Important document"}
)

IF response["ok"]: START:
    PRINT "File uploaded successfully"
END:
```

---

## Configuration

### set_default_headers(headers)

Set default headers for all requests.

**Parameters:**
- `headers` (Object) - Headers to add/update

**Returns:** Object - Updated default headers

**Example:**
```susa
set_default_headers({
    "X-API-Key": "your-api-key",
    "X-Client-Version": "1.0.0"
})
```

---

### set_timeout(timeout)

Set default timeout for all requests.

**Parameters:**
- `timeout` (Number) - Timeout in seconds

**Returns:** Number - New default timeout

**Example:**
```susa
set_timeout(60)  # 60 seconds
```

---

### set_user_agent(user_agent)

Set custom User-Agent header.

**Parameters:**
- `user_agent` (String) - User agent string

**Returns:** String - New user agent

**Example:**
```susa
set_user_agent("MyApp/1.0.0")
```

---

## Authentication

### add_bearer_token(headers, token)

Add Bearer token authentication.

**Parameters:**
- `headers` (Object/null) - Existing headers
- `token` (String) - Bearer token

**Returns:** Object - Headers with Authorization

**Example:**
```susa
let headers = add_bearer_token(null, "your-jwt-token")
let response = get("https://api.example.com/protected", headers, null, null)
```

---

### add_basic_auth(headers, username, password)

Add Basic authentication.

**Parameters:**
- `headers` (Object/null) - Existing headers
- `username` (String) - Username
- `password` (String) - Password

**Returns:** Object - Headers with Authorization

**Example:**
```susa
let headers = add_basic_auth(null, "user", "pass123")
let response = get("https://api.example.com/data", headers, null, null)
```

---

### add_auth(headers, auth_type, credentials)

Add authentication of any type.

**Parameters:**
- `headers` (Object/null) - Existing headers
- `auth_type` (String) - "bearer", "basic", or "api_key"
- `credentials` (String/Object) - Credentials

**Returns:** Object - Headers with authentication

**Example:**
```susa
# Bearer token
let headers1 = add_auth(null, "bearer", "token123")

# Basic auth
let headers2 = add_auth(null, "basic", {"username": "user", "password": "pass"})

# API Key
let headers3 = add_auth(null, "api_key", {"header": "X-API-Key", "key": "key123"})
```

---

## URL Utilities

### url_encode(text)

URL encode a string.

**Parameters:**
- `text` (String) - Text to encode

**Returns:** String - URL encoded text

**Example:**
```susa
let encoded = url_encode("Hello World!")
PRINT encoded  # Output: "Hello%20World%21"
```

---

### url_decode(text)

URL decode a string.

**Parameters:**
- `text` (String) - Text to decode

**Returns:** String - Decoded text

**Example:**
```susa
let decoded = url_decode("Hello%20World%21")
PRINT decoded  # Output: "Hello World!"
```

---

### parse_url(url)

Parse URL into components.

**Parameters:**
- `url` (String) - URL to parse

**Returns:** Object - URL components (scheme, hostname, port, path, query, etc.)

**Example:**
```susa
let parts = parse_url("https://api.example.com:8080/users?page=1#top")

PRINT parts["scheme"]    # Output: "https"
PRINT parts["hostname"]  # Output: "api.example.com"
PRINT parts["port"]      # Output: 8080
PRINT parts["path"]      # Output: "/users"
PRINT parts["query"]     # Output: "page=1"
PRINT parts["fragment"]  # Output: "top"
```

---

### build_query_string(params)

Build query string from parameters.

**Parameters:**
- `params` (Object) - Query parameters

**Returns:** String - Query string

**Example:**
```susa
let params = {"page": 1, "limit": 10, "sort": "name"}
let query = build_query_string(params)
PRINT query  # Output: "page=1&limit=10&sort=name"
```

---

## Cookie Management

### parse_cookies(response)

Parse cookies from response.

**Parameters:**
- `response` (Object) - HTTP response object

**Returns:** Object - Parsed cookies

**Example:**
```susa
let response = get("https://example.com", null, null, null)
let cookies = parse_cookies(response)
PRINT cookies
```

---

### set_cookies(headers, cookies)

Add cookies to request headers.

**Parameters:**
- `headers` (Object/null) - Existing headers
- `cookies` (Object) - Cookies to add

**Returns:** Object - Headers with cookies

**Example:**
```susa
let cookies = {"session_id": "abc123", "user_pref": "dark"}
let headers = set_cookies(null, cookies)
let response = get("https://example.com", headers, null, null)
```

---

## Advanced Features

### retry_request(method, url, data, headers, max_retries, backoff_factor)

Retry request with exponential backoff.

**Parameters:**
- `method` (String) - HTTP method
- `url` (String) - Request URL
- `data` (Object/null) - Request body
- `headers` (Object/null) - Custom headers
- `max_retries` (Number/null) - Max retry attempts (default: 3)
- `backoff_factor` (Number/null) - Backoff multiplier (default: 1)

**Returns:** Object - Response object

**Example:**
```susa
# Retry up to 5 times with exponential backoff
let response = retry_request(
    "GET",
    "https://api.example.com/data",
    null,
    null,
    5,
    2
)
```

---

### follow_redirects(url, max_redirects, headers)

Manually follow HTTP redirects.

**Parameters:**
- `url` (String) - Starting URL
- `max_redirects` (Number/null) - Max redirects to follow (default: 5)
- `headers` (Object/null) - Custom headers

**Returns:** Object - Final response with redirect_count and final_url

**Example:**
```susa
let result = follow_redirects("https://short.url/abc", 10, null)
PRINT rt"Final URL: {result['final_url']}"
PRINT rt"Redirects: {result['redirect_count']}"
```

---

## Complete Example

```susa
ADD http_client
ADD json_utils"

# Configure defaults
set_timeout(30)
set_user_agent("SUSA-App/1.0")

# Simple GET request
let response = get("https://jsonplaceholder.typicode.com/users/1", null, null, null)

IF response["ok"]: START:
    let user = response["data"]
    PRINT rt"User: {user['name']}"
    PRINT rt"Email: {user['email']}"
END:

# GET with query parameters
let params = {"page": 1, "limit": 5}
let users_response = get(
    "https://jsonplaceholder.typicode.com/users",
    null,
    params,
    null
)

PRINT rt"Found {length(users_response['data'])} users"

# POST request with JSON data
let new_post = {
    "title": "My Post",
    "body": "This is the content",
    "userId": 1
}

let post_response = post(
    "https://jsonplaceholder.typicode.com/posts",
    new_post,
    null,
    null
)

IF post_response["ok"]: START:
    PRINT rt"Created post with ID: {post_response['data']['id']}"
END:

# Authenticated request
let token = "your-jwt-token-here"
let auth_headers = add_bearer_token(null, token)

let protected_response = get(
    "https://api.example.com/protected",
    auth_headers,
    null,
    null
)

# PUT request to update data
let updated_data = {"title": "Updated Title"}
let update_response = put(
    "https://jsonplaceholder.typicode.com/posts/1",
    updated_data,
    null,
    null
)

# DELETE request
let delete_response = delete(
    "https://jsonplaceholder.typicode.com/posts/1",
    null,
    null
)

IF delete_response["ok"]: START:
    PRINT "Resource deleted successfully"
END:

# Download file
let download_result = download_file(
    "https://example.com/sample.pdf",
    "downloads/sample.pdf",
    null,
    null
)

IF download_result["success"]: START:
    PRINT rt"Downloaded {download_result['size']} bytes"
END:

# Retry with backoff
let unreliable_response = retry_request(
    "GET",
    "https://api.example.com/sometimes-fails",
    null,
    null,
    5,
    2
)

# URL utilities
let encoded = url_encode("Hello World!")
PRINT rt"Encoded: {encoded}"

let url_parts = parse_url("https://api.example.com:8080/users?page=1")
PRINT rt"Host: {url_parts['hostname']}"
PRINT rt"Port: {url_parts['port']}"

# Build query string
let query_params = {"search": "SUSA", "category": "programming"}
let query_string = build_query_string(query_params)
PRINT rt"Query: {query_string}"

# Error handling
let error_response = get("https://api.example.com/not-found", null, null, null)

IF NOT error_response["ok"]: START:
    PRINT rt"Error: Status {error_response['status_code']}"
    PRINT rt"Reason: {error_response['reason']}"
END:
```

---

## Response Object Structure

All HTTP methods return a response object with:

```susa
{
    "status_code": 200,           # HTTP status code
    "ok": true,                   # true if 200-299
    "reason": "OK",               # Status reason phrase
    "headers": {...},             # Response headers
    "data": {...},                # Response body (parsed JSON or text)
    "content_type": "json",       # "json" or "text"
    "url": "https://...",         # Final URL
    "elapsed": 0.523,             # Request duration in seconds
    "encoding": "utf-8"           # Response encoding
}
```

For errors:
```susa
{
    "error": "Connection error",  # Error message
    "status_code": 0,             # 0 for network errors
    "ok": false
}
```

---

## Function Summary

| Category | Functions |
|----------|-----------|
| HTTP Methods | get, post, put, delete, patch, head, options, request |
| Files | download_file, upload_file |
| Configuration | set_default_headers, set_timeout, set_user_agent |
| Authentication | add_bearer_token, add_basic_auth, add_auth |
| URL Utils | url_encode, url_decode, parse_url, build_query_string |
| Cookies | parse_cookies, set_cookies |
| Advanced | retry_request, follow_redirects |

---

## Related Modules

- [JSON Utils](json_utils.md) - Parse and manipulate JSON responses
- [File Utils](file_utils.md) - Save downloaded files
- [String Utils](string_utils.md) - Process response text


