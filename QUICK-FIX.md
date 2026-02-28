# 🔧 Quick Fix for GitHub Actions Build Error

## The Problem

Your workflow failed with:
```
CMake Error: The source directory "/home/runner/work/susa1/susa1/cpp-core" does not appear to contain CMakeLists.txt
```

## The Solution

You need to add the build configuration files to your repository.

---

## Step 1: Add CMakeLists.txt

Create `cpp-core/CMakeLists.txt`:

```cmake
cmake_minimum_required(VERSION 3.10)
project(SUSA VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

if(MSVC)
    add_compile_options(/W4)
else()
    add_compile_options(-Wall -Wextra -pedantic)
endif()

set(SOURCES main.cpp)

add_executable(susa ${SOURCES})

set_target_properties(susa PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}"
)

install(TARGETS susa RUNTIME DESTINATION bin)
```

---

## Step 2: Add Makefile (Fallback)

Create `cpp-core/Makefile`:

```makefile
CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra -O2
TARGET = susa
SOURCES = main.cpp

ifeq ($(OS),Windows_NT)
    TARGET := $(TARGET).exe
endif

all: $(TARGET)

$(TARGET): $(SOURCES)
	$(CXX) $(CXXFLAGS) -o $(TARGET) $(SOURCES)

clean:
	rm -f $(TARGET)

.PHONY: all clean
```

---

## Step 3: Commit and Push

```bash
# Add the files
git add cpp-core/CMakeLists.txt
git add cpp-core/Makefile

# Commit
git commit -m "Add build configuration files"

# Push
git push origin main
```

---

## Step 4: Retry the Workflow

### Option A: Push a new tag
```bash
git tag v1.0.1
git push origin v1.0.1
```

### Option B: Re-run the workflow
1. Go to GitHub → Actions
2. Click on the failed workflow
3. Click "Re-run all jobs"

---

## Verify Your File Structure

Make sure you have:

```
your-repo/
├── .github/
│   └── workflows/
│       └── build-installers.yml
├── cpp-core/
│   ├── main.cpp              ✅ Your source code
│   ├── CMakeLists.txt        ✅ NEW - Add this
│   └── Makefile              ✅ NEW - Add this
```

---

## Alternative: Simple Build Script

If CMake is too complex, you can modify the workflow to use direct compilation.

Edit `.github/workflows/build-installers.yml`, find the "Build SUSA Compiler" step and replace with:

```yaml
- name: Build SUSA Compiler
  run: |
    cd cpp-core
    g++ -std=c++17 -O2 -o susa main.cpp
```

---

## Test Locally First

Before pushing, test the build on your machine:

### Linux/macOS:
```bash
cd cpp-core
make
./susa --version
```

### Windows (with MinGW):
```bash
cd cpp-core
g++ -std=c++17 -O2 -o susa.exe main.cpp
susa.exe --version
```

---

## Still Having Issues?

### Check if main.cpp exists:
```bash
ls -la cpp-core/main.cpp
```

### Check if it compiles:
```bash
cd cpp-core
g++ -std=c++17 -o susa main.cpp
```

### Check workflow file location:
```bash
ls -la .github/workflows/build-installers.yml
```

---

## Quick Commands

Copy and paste these commands:

```bash
# Create CMakeLists.txt
cat > cpp-core/CMakeLists.txt << 'EOF'
cmake_minimum_required(VERSION 3.10)
project(SUSA VERSION 1.0.0 LANGUAGES CXX)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(SOURCES main.cpp)
add_executable(susa ${SOURCES})
EOF

# Create Makefile
cat > cpp-core/Makefile << 'EOF'
CXX = g++
CXXFLAGS = -std=c++17 -Wall -O2
TARGET = susa
SOURCES = main.cpp
all: $(TARGET)
$(TARGET): $(SOURCES)
	$(CXX) $(CXXFLAGS) -o $(TARGET) $(SOURCES)
clean:
	rm -f $(TARGET)
.PHONY: all clean
EOF

# Commit and push
git add cpp-core/CMakeLists.txt cpp-core/Makefile
git commit -m "Add build files"
git push origin main

# Create new tag
git tag v1.0.1
git push origin v1.0.1
```

---

**That's it! Your workflow should now build successfully.** ✅
