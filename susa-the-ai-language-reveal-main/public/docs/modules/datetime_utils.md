# DateTime Utils Module

The DateTime Utils module provides comprehensive date and time functions for working with timestamps, dates, and time calculations in SUSA.

## Import

```susa
ADD datetime_utils
```

## Overview

This module includes functions for:
- Getting current date and time
- Extracting date components (year, month, day, hour, etc.)
- Date formatting and conversion
- Date arithmetic (adding/subtracting time)
- Date validation and calculations
- Time utilities (sleep, delays)

---

## Current Time Functions

### now()

Get the current date and time.

**Returns:** String - Current date and time in format "YYYY-MM-DD HH:MM:SS"

**Example:**
```susa
let current = now()
PRINT current  # Output: "2024-02-20 14:30:45"
```

---

### today()

Get the current date only.

**Returns:** String - Current date in format "YYYY-MM-DD"

**Example:**
```susa
let date = today()
PRINT date  # Output: "2024-02-20"
```

---

### current_time()

Get the current time only.

**Returns:** String - Current time in format "HH:MM:SS"

**Example:**
```susa
let time = current_time()
PRINT time  # Output: "14:30:45"
```

---

### timestamp()

Get the current Unix timestamp.

**Returns:** Number - Unix timestamp (seconds since epoch)

**Example:**
```susa
let ts = timestamp()
PRINT ts  # Output: 1708441845
```

---

## Date Component Extraction

### get_year()

Get the current year.

**Returns:** Number - Current year

**Example:**
```susa
let year = get_year()
PRINT year  # Output: 2024
```

---

### get_month()

Get the current month (1-12).

**Returns:** Number - Current month

**Example:**
```susa
let month = get_month()
PRINT month  # Output: 2 (February)
```

---

### get_day()

Get the current day of month (1-31).

**Returns:** Number - Current day

**Example:**
```susa
let day = get_day()
PRINT day  # Output: 20
```

---

### get_hour()

Get the current hour (0-23).

**Returns:** Number - Current hour

**Example:**
```susa
let hour = get_hour()
PRINT hour  # Output: 14
```

---

### get_minute()

Get the current minute (0-59).

**Returns:** Number - Current minute

**Example:**
```susa
let minute = get_minute()
PRINT minute  # Output: 30
```

---

### get_second()

Get the current second (0-59).

**Returns:** Number - Current second

**Example:**
```susa
let second = get_second()
PRINT second  # Output: 45
```

---

### get_weekday()

Get the current day of week (0=Monday, 6=Sunday).

**Returns:** Number - Day of week

**Example:**
```susa
let weekday = get_weekday()
PRINT weekday  # Output: 1 (Tuesday)
```

---

### get_yearday()

Get the current day of year (1-366).

**Returns:** Number - Day of year

**Example:**
```susa
let yearday = get_yearday()
PRINT yearday  # Output: 51
```

---

## Day and Month Names

### get_day_name()

Get the name of the current day.

**Returns:** String - Day name (Monday, Tuesday, etc.)

**Example:**
```susa
let day_name = get_day_name()
PRINT day_name  # Output: "Tuesday"
```

---

### get_month_name()

Get the name of the current month.

**Returns:** String - Month name (January, February, etc.)

**Example:**
```susa
let month_name = get_month_name()
PRINT month_name  # Output: "February"
```

---

## Date Formatting

### format_date(format)

Format the current date/time with a custom format string.

**Parameters:**
- `format` (String) - Format string using codes:
  - `%Y` - Year (4 digits)
  - `%m` - Month (01-12)
  - `%d` - Day (01-31)
  - `%H` - Hour (00-23)
  - `%M` - Minute (00-59)
  - `%S` - Second (00-59)
  - `%A` - Full weekday name
  - `%B` - Full month name

**Returns:** String - Formatted date/time

**Example:**
```susa
let formatted = format_date("%Y-%m-%d %H:%M:%S")
PRINT formatted  # Output: "2024-02-20 14:30:45"

let readable = format_date("%A, %B %d, %Y")
PRINT readable  # Output: "Tuesday, February 20, 2024"

let time_only = format_date("%H:%M")
PRINT time_only  # Output: "14:30"
```

---

### to_iso()

Convert current date/time to ISO 8601 format.

**Returns:** String - ISO 8601 formatted date/time

**Example:**
```susa
let iso = to_iso()
PRINT iso  # Output: "2024-02-20T14:30:45.123456"
```

---

### from_timestamp(ts)

Convert Unix timestamp to date/time string.

**Parameters:**
- `ts` (Number) - Unix timestamp

**Returns:** String - Date/time in format "YYYY-MM-DD HH:MM:SS"

**Example:**
```susa
let ts = 1708441845
let date = from_timestamp(ts)
PRINT date  # Output: "2024-02-20 14:30:45"
```

---

## Date Arithmetic

### add_seconds(seconds)

Add seconds to the current time.

**Parameters:**
- `seconds` (Number) - Number of seconds to add

**Returns:** String - New date/time

**Example:**
```susa
let future = add_seconds(3600)  # Add 1 hour
PRINT future  # Output: "2024-02-20 15:30:45"
```

---

### add_minutes(minutes)

Add minutes to the current time.

**Parameters:**
- `minutes` (Number) - Number of minutes to add

**Returns:** String - New date/time

**Example:**
```susa
let future = add_minutes(30)
PRINT future  # Output: "2024-02-20 15:00:45"
```

---

### add_hours(hours)

Add hours to the current time.

**Parameters:**
- `hours` (Number) - Number of hours to add

**Returns:** String - New date/time

**Example:**
```susa
let future = add_hours(24)  # Add 1 day
PRINT future  # Output: "2024-02-21 14:30:45"
```

---

### add_days(days)

Add days to the current time.

**Parameters:**
- `days` (Number) - Number of days to add

**Returns:** String - New date/time

**Example:**
```susa
let future = add_days(7)  # Add 1 week
PRINT future  # Output: "2024-02-27 14:30:45"

let past = add_days(-7)  # Subtract 1 week
PRINT past  # Output: "2024-02-13 14:30:45"
```

---

## Date Validation

### is_leap_year(year)

Check if a year is a leap year.

**Parameters:**
- `year` (Number) - Year to check

**Returns:** Boolean - true if leap year, false otherwise

**Example:**
```susa
PRINT is_leap_year(2024)  # Output: true
PRINT is_leap_year(2023)  # Output: false
PRINT is_leap_year(2000)  # Output: true
PRINT is_leap_year(1900)  # Output: false
```

---

### days_in_month(month, year)

Get the number of days in a month.

**Parameters:**
- `month` (Number) - Month (1-12)
- `year` (Number) - Year

**Returns:** Number - Number of days in the month

**Example:**
```susa
PRINT days_in_month(2, 2024)  # Output: 29 (leap year)
PRINT days_in_month(2, 2023)  # Output: 28
PRINT days_in_month(4, 2024)  # Output: 30
PRINT days_in_month(1, 2024)  # Output: 31
```

---

## Time Difference

### diff_seconds(ts1, ts2)

Calculate difference in seconds between two timestamps.

**Parameters:**
- `ts1` (Number) - First timestamp
- `ts2` (Number) - Second timestamp

**Returns:** Number - Absolute difference in seconds

**Example:**
```susa
let ts1 = 1708441845
let ts2 = 1708445445
let diff = diff_seconds(ts1, ts2)
PRINT diff  # Output: 3600 (1 hour)
```

---

### diff_minutes(ts1, ts2)

Calculate difference in minutes between two timestamps.

**Parameters:**
- `ts1` (Number) - First timestamp
- `ts2` (Number) - Second timestamp

**Returns:** Number - Absolute difference in minutes

**Example:**
```susa
let ts1 = 1708441845
let ts2 = 1708445445
let diff = diff_minutes(ts1, ts2)
PRINT diff  # Output: 60 (1 hour)
```

---

### diff_hours(ts1, ts2)

Calculate difference in hours between two timestamps.

**Parameters:**
- `ts1` (Number) - First timestamp
- `ts2` (Number) - Second timestamp

**Returns:** Number - Absolute difference in hours

**Example:**
```susa
let ts1 = 1708441845
let ts2 = 1708528245
let diff = diff_hours(ts1, ts2)
PRINT diff  # Output: 24 (1 day)
```

---

### diff_days(ts1, ts2)

Calculate difference in days between two timestamps.

**Parameters:**
- `ts1` (Number) - First timestamp
- `ts2` (Number) - Second timestamp

**Returns:** Number - Absolute difference in days

**Example:**
```susa
let ts1 = 1708441845
let ts2 = 1709046645
let diff = diff_days(ts1, ts2)
PRINT diff  # Output: 7 (1 week)
```

---

## Utilities

### sleep(seconds)

Pause execution for specified seconds.

**Parameters:**
- `seconds` (Number) - Number of seconds to sleep

**Returns:** None

**Example:**
```susa
PRINT "Starting..."
sleep(2)  # Wait 2 seconds
PRINT "Done!"
```

---

### sleep_ms(milliseconds)

Pause execution for specified milliseconds.

**Parameters:**
- `milliseconds` (Number) - Number of milliseconds to sleep

**Returns:** None

**Example:**
```susa
PRINT "Starting..."
sleep_ms(500)  # Wait 0.5 seconds
PRINT "Done!"
```

---

### is_weekend()

Check if the current day is a weekend (Saturday or Sunday).

**Returns:** Boolean - true if weekend, false otherwise

**Example:**
```susa
IF is_weekend(): START:
    PRINT "It's the weekend!"
ELSE: START:
    PRINT "It's a weekday"
END:
```

---

### is_weekday()

Check if the current day is a weekday (Monday-Friday).

**Returns:** Boolean - true if weekday, false otherwise

**Example:**
```susa
IF is_weekday(): START:
    PRINT "Time to work!"
ELSE: START:
    PRINT "Enjoy your weekend!"
END:
```

---

## Complete Example

```susa
ADD datetime_utils

# Get current date and time
PRINT rt"Current date/time: {now()}"
PRINT rt"Today's date: {today()}"
PRINT rt"Current time: {current_time()}"

# Get date components
let year = get_year()
let month = get_month()
let day = get_day()
PRINT rt"Date: {year}-{month}-{day}"

# Get day and month names
PRINT rt"Day: {get_day_name()}"
PRINT rt"Month: {get_month_name()}"

# Format dates
let formatted = format_date("%A, %B %d, %Y at %H:%M")
PRINT rt"Formatted: {formatted}"

# Date arithmetic
let tomorrow = add_days(1)
let next_week = add_days(7)
let next_month = add_days(30)
PRINT rt"Tomorrow: {tomorrow}"
PRINT rt"Next week: {next_week}"

# Check leap year
let current_year = get_year()
IF is_leap_year(current_year): START:
    PRINT rt"{current_year} is a leap year"
ELSE: START:
    PRINT rt"{current_year} is not a leap year"
END:

# Days in current month
let current_month = get_month()
let days = days_in_month(current_month, current_year)
PRINT rt"Days in current month: {days}"

# Check if weekend
IF is_weekend(): START:
    PRINT "Enjoy your weekend!"
ELIF is_weekday(): START:
    PRINT "Have a productive day!"
END:

# Calculate time differences
let now_ts = timestamp()
let future_ts = now_ts + 86400  # Add 1 day
let diff = diff_hours(now_ts, future_ts)
PRINT rt"Hours difference: {diff}"

# Countdown timer
PRINT "Starting countdown..."
LOOP i = 3 FOR 3 TIMES: START:
    PRINT rt"{4 - i}..."
    sleep(1)
    i = i - 1
END:
PRINT "Go!"
```

---

## Function Summary

| Category | Functions |
|----------|-----------|
| Current Time | now, today, current_time, timestamp |
| Components | get_year, get_month, get_day, get_hour, get_minute, get_second, get_weekday, get_yearday |
| Names | get_day_name, get_month_name |
| Formatting | format_date, to_iso, from_timestamp |
| Arithmetic | add_seconds, add_minutes, add_hours, add_days |
| Validation | is_leap_year, days_in_month |
| Difference | diff_seconds, diff_minutes, diff_hours, diff_days |
| Utilities | sleep, sleep_ms, is_weekend, is_weekday |

---

## Related Modules

- [String Utils](string_utils.md) - String formatting and manipulation
- [Math Utils](math_utils.md) - Mathematical calculations
- [File Utils](file_utils.md) - File timestamp operations


