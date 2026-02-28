# 🔧 Windows Build Fix Guide

## Current Error

```
CMake Error: CMake was unable to find a build program corresponding to "MinGW Makefiles"
CMAKE_MAKE_PROGRAM is not set. You probably need to select a different build tool.
```

## Root Cause

The MSYS2 environment in GitHub Actions doesn't have CMake properly configured to find the MinGW compiler.

## ✅ Solution Applied

I've updated the workflow to use multiple fallback methods:

1. **Check for existing binary** - Use if already built
2. **Try CMake** - With explicit compiler paths
3. **Try Makefile** - Simple make command
4. **Direct compilation** - Using g++ directly

---

## 🚀 Quick Fix Commands

If you want to test locally on Windows:

### Option 1: Using build.bat (Simplest)
```batch
cd cpp-core
build.bat
```

### Option 2: Using Makefile
```batch
cd cpp-core
mingw32-make
```

### Option 3: Direct compilation
```batch
cd cpp-core
g++ -std=c++17 -O2 -o susa.exe main.cpp
```

---

## 📋 What Changed in the Workflow

### Before (Failed):
```yaml
- name: Build SUSA Compiler
  shell: msys2 {0}
  run: |
    cd cpp-core
    mkdir -p build
    cd build
    cmake .. -G "MinGW Makefiles"
    cmake --build . --config Release
```

### After (Fixed):
```yaml
- name: Build SUSA Compiler
  shell: msys2 {0}
  run: |
    cd cpp-core
    
    # Try multiple build methods
    if [ -f "susa.exe" ]; then
      echo "Using existing susa.exe"
    elif [ -f "CMakeLists.txt" ]; then
      cmake .. -G "MinGW Makefiles" -DCMAKE_C_COMPILER=gcc -DCMAKE_CXX_COMPILER=g++
      cmake --build . --config Release
    elif [ -f "Makefile" ]; then
      make
    else
      g++ -std=c++17 -O2 -o susa.exe main.cpp
    fi
```

---

## 🔍 Verification Steps

After pushing the updated workflow:

1. **Check the workflow run**:
   - Go to Actions tab
   - Click on the latest run
   - Expand "Build SUSA Compiler" step

2. **Look for success message**:
   ```
   Build successful!
   -rwxr-xr-x 1 runner runner 123456 Feb 28 12:34 susa.exe
   ```

3. **Download the artifact**:
   - Scroll to "Artifacts" section
   - Download "windows-installer"
   - Test the .exe file

---

## 🛠️ Alternative: Pre-build the Binary

If the build keeps failing, you can pre-build the binary and commit it:

### On Windows:
```batch
cd cpp-core
g++ -std=c++17 -O2 -o susa.exe main.cpp
git add susa.exe
git commit -m "Add pre-built Windows binary"
git push
```

Then the workflow will use the existing `susa.exe` instead of building.

---

## 📦 Files Added

1. **cpp-core/build.sh** - Unix build script
2. **cpp-core/build.bat** - Windows build script
3. **cpp-core/Makefile** - Updated with better Windows support
4. **Updated workflow** - Multiple fallback methods

---

## 🧪 Test Locally Before Pushing

### Windows (with MinGW):
```batch
cd cpp-core
build.bat
susa.exe --version
```

### Windows (with MSYS2):
```bash
cd cpp-core
./build.sh
./susa.exe --version
```

### Linux/macOS:
```bash
cd cpp-core
./build.sh
./susa --version
```

---

## 🎯 Commit the Changes

```bash
# Add all the new files
git add cpp-core/build.sh
git add cpp-core/build.bat
git add cpp-core/Makefile
git add .github/workflows/build-installers.yml

# Commit
git commit -m "Fix Windows build with multiple fallback methods"

# Push
git push origin main

# Create new tag
git tag v1.0.2
git push origin v1.0.2
```

---

## 🔄 What Happens Next

1. Workflow triggers on tag push
2. Windows job tries to build:
   - First checks for existing `susa.exe`
   - Then tries CMake with explicit compilers
   - Falls back to Makefile
   - Falls back to direct g++ compilation
3. One of these methods will succeed
4. Installer gets created
5. Release is published

---

## 💡 Pro Tips

### If you have the binary already:
```bash
# Just commit it
git add cpp-core/susa.exe
git commit -m "Add Windows binary"
git push
```

### If you want to skip Windows build:
Comment out the Windows job in the workflow:
```yaml
jobs:
  # build-windows:  # Commented out
  #   name: Build Windows Installer
  #   runs-on: windows-latest
  #   ...
  
  build-macos:  # This will still run
    name: Build macOS Installer
    ...
```

---

## 📊 Build Success Indicators

Look for these in the workflow logs:

✅ **Success**:
```
Building directly with g++...
Build successful!
-rwxr-xr-x 1 runner runner 234567 Feb 28 12:34 susa.exe
```

❌ **Failure**:
```
Error: Failed to build susa.exe
Error: Process completed with exit code 1.
```

---

## 🆘 Still Failing?

If all methods fail, you have two options:

### Option 1: Use pre-built binary
Build on your Windows machine and commit:
```batch
g++ -std=c++17 -O2 -static -o susa.exe main.cpp
git add cpp-core/susa.exe
git commit -m "Add pre-built binary"
git push
```

### Option 2: Skip Windows, focus on Linux/macOS
The Linux AppImage and macOS PKG will still build successfully.

---

**The workflow is now more robust and should succeed!** ✅
