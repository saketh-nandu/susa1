# Convert Markdown Documentation to Website Format

## Smart Solution

Instead of rewriting all documentation, we should:
1. Read the existing detailed markdown files from `docs/modules/`
2. Extract the content
3. Convert to TypeScript format for `modulesDocs.ts`
4. Use the existing comprehensive documentation

## Available Markdown Files

All 9 modules have detailed markdown documentation:
- ✅ `docs/modules/math_utils.md`
- ✅ `docs/modules/string_utils.md`
- ✅ `docs/modules/array_utils.md`
- ✅ `docs/modules/datetime_utils.md`
- ✅ `docs/modules/file_utils.md`
- ✅ `docs/modules/json_utils.md`
- ✅ `docs/modules/http_client.md`
- ✅ `docs/modules/data_structures.md`
- ✅ `docs/modules/algorithms.md`

## What Each MD File Contains

Each markdown file has:
- Overview section
- Import instructions
- Detailed function documentation
- Parameters and returns
- Code examples
- Complete examples

## Conversion Strategy

For each module:

### 1. Extract Overview
From the markdown "Overview" section → Use for `overview` field

### 2. Extract Functions
From each function section → Create `detailedFunctions` array entries:
- Function name and signature
- Description
- Parameters
- Returns
- Example code

### 3. Extract Complete Example
From markdown examples → Use for `completeExample` field

### 4. Format for TypeScript
Convert markdown format to TypeScript string format:
- Escape backticks if needed
- Preserve code formatting
- Keep all examples

## Next Steps

I will:
1. Read each markdown file
2. Extract the relevant sections
3. Format them for the website's `modulesDocs.ts`
4. Update the remaining 5 modules (file_utils, json_utils, http_client, data_structures, algorithms)

This way we use the existing comprehensive documentation instead of rewriting!

---

*Smart solution: Reuse existing MD files*  
*Action: Convert MD → Website format*
