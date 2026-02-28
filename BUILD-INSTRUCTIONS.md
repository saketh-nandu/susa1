# 🔨 SUSA Build Instructions

Complete guide for building SUSA installers using GitHub Actions.

---

## 📋 Prerequisites

Your repository needs these files in the `cpp-core` directory:

1. **main.cpp** - Your SUSA compiler source code
2. **CMakeLists.txt** - CMake build configuration (provided)
3. **Makefile** - Simple makefile fallback (provided)

---

## 🚀 Quick Start

### Option 1: Automatic Build (Recommended)

1. **Commit the build files**:
   ```bash
   git add cpp-core/CMakeLists.txt cpp-core/Makefile .github/workflows/build-installers.yml
   git commit -m "Add installer build system"
   git push origin main
   ```

2. **Create a release tag**:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

3. **Download installers**:
   - Go to GitHub → Releases
   - Download the installers for your platform

### Option 2: Manual Trigger

1. Go to your GitHub repository
2. Click **Actions** tab
3. Select **Build SUSA Installers**
4. Click **Run workflow**
5. Download artifacts from the workflow run

---

## 📁 Required File Structure

```
your-repo/
├── .github/
│   └── workflows/
│       └── build-installers.yml    ✅ Workflow file
├── cpp-core/
│   ├── main.cpp                    ✅ Your source code
│   ├── CMakeLists.txt              ✅ CMake config (provided)
│   ├── Makefile                    ✅ Makefile (provided)
│   └── susa.exe                    ⚠️  Generated after build
└── BUILD-INSTRUCTIONS.md           📖 This file
```

---

## 🔧 Build System Details

The workflow tries multiple build methods in order:

### 1. CMake (Preferred)
```bash
cd cpp-core
mkdir -p build
cd build
cmake ..
make
```

### 2. Makefile (Fallback)
```bash
cd cpp-core
make
```

### 3. Direct Compilation (Last Resort)
```bash
cd cpp-core
g++ -std=c++17 -O2 -o susa main.cpp
```

---

## 🐛 Troubleshooting

### Error: "CMakeLists.txt not found"

**Solution**: Make sure you've added the CMakeLists.txt file:
```bash
git add cpp-core/CMakeLists.txt
git commit -m "Add CMakeLists.txt"
git push
```

### Error: "main.cpp not found"

**Solution**: Your source code should be in `cpp-core/main.cpp`:
```bash
# Check if file exists
ls cpp-core/main.cpp

# If not, move it there
mv your-source.cpp cpp-core/main.cpp
git add cpp-core/main.cpp
git commit -m "Add main.cpp"
git push
```

### Error: "Build failed"

**Solution**: Test the build locally first:

**On Linux/macOS**:
```bash
cd cpp-core
make
./susa --version
```

**On Windows** (with MinGW):
```bash
cd cpp-core
mingw32-make
susa.exe --version
```

### Workflow doesn't trigger

**Solution**: Check your workflow file location:
```bash
# Should be exactly here:
.github/workflows/build-installers.yml

# Not here:
.github/workflow/build-installers.yml  ❌ (wrong)
github/workflows/build-installers.yml  ❌ (wrong)
```

---

## 📦 What Gets Built

| Job | Platform | Output | Size |
|-----|----------|--------|------|
| build-windows | Windows | SUSA-Complete-Setup-1.0.0.exe | ~5MB |
| build-macos | macOS | SUSA-Complete-1.0.0.pkg | ~3MB |
| build-linux-universal | All Linux | SUSA-1.0.0-x86_64.AppImage | ~2MB |
| build-linux-deb | Debian/Ubuntu | susa-complete_1.0.0_amd64.deb | ~2MB |
| build-linux-rpm | RedHat/Fedora | susa-complete-1.0.0-1.x86_64.rpm | ~2MB |

---

## ✅ Verification Steps

After the workflow completes:

### 1. Check Artifacts
- Go to Actions → Your workflow run
- Scroll to "Artifacts" section
- Download and test each installer

### 2. Test Windows Installer
```powershell
# Run the installer
SUSA-Complete-Setup-1.0.0.exe

# After installation
susa --version
```

### 3. Test macOS Installer
```bash
# Run the installer
sudo installer -pkg SUSA-Complete-1.0.0.pkg -target /

# Verify
susa --version
```

### 4. Test Linux AppImage
```bash
chmod +x SUSA-1.0.0-x86_64.AppImage
./SUSA-1.0.0-x86_64.AppImage --version
```

### 5. Test Linux DEB
```bash
sudo dpkg -i susa-complete_1.0.0_amd64.deb
susa --version
```

### 6. Test Linux RPM
```bash
sudo rpm -i susa-complete-1.0.0-1.x86_64.rpm
susa --version
```

---

## 🎯 Customization

### Change Version Number

Edit `.github/workflows/build-installers.yml`:
```yaml
env:
  SUSA_VERSION: "1.0.0"  # Change this
```

### Add More Source Files

Edit `cpp-core/CMakeLists.txt`:
```cmake
set(SOURCES
    main.cpp
    lexer.cpp      # Add more files
    parser.cpp
    interpreter.cpp
)
```

### Change Compiler Flags

Edit `cpp-core/CMakeLists.txt`:
```cmake
if(MSVC)
    add_compile_options(/W4 /O2)  # Add flags
else()
    add_compile_options(-Wall -Wextra -O3)  # Add flags
endif()
```

---

## 📊 Build Matrix

| OS | Compiler | C++ Standard | Optimization |
|----|----------|--------------|--------------|
| Windows | MinGW GCC | C++17 | -O2 |
| macOS | Clang | C++17 | -O2 |
| Linux | GCC | C++17 | -O2 |

---

## 🔐 Security Notes

### Code Signing (Optional)

For production releases, consider code signing:

**Windows**: Use SignTool
```powershell
signtool sign /f certificate.pfx /p password SUSA-Setup.exe
```

**macOS**: Use codesign
```bash
codesign --sign "Developer ID" SUSA-Complete.pkg
```

**Linux**: AppImage supports signing
```bash
gpg --detach-sign SUSA.AppImage
```

---

## 📝 Checklist Before Release

- [ ] All source files in `cpp-core/`
- [ ] CMakeLists.txt present
- [ ] Makefile present
- [ ] Workflow file in `.github/workflows/`
- [ ] Version number updated
- [ ] Local build tested
- [ ] Committed and pushed to GitHub
- [ ] Tag created and pushed
- [ ] Workflow completed successfully
- [ ] All installers downloaded
- [ ] Each installer tested on target platform
- [ ] Release notes written
- [ ] Website updated

---

## 🆘 Getting Help

If you encounter issues:

1. **Check workflow logs**: Actions → Your run → Click on failed job
2. **Verify file structure**: Make sure all files are in correct locations
3. **Test locally**: Build on your machine first
4. **Check permissions**: Workflow needs write access to create releases

---

## 📚 Additional Resources

- **CMake Documentation**: https://cmake.org/documentation/
- **NSIS Documentation**: https://nsis.sourceforge.io/Docs/
- **AppImage Documentation**: https://docs.appimage.org/
- **GitHub Actions**: https://docs.github.com/en/actions

---

**Built with ❤️ for SUSA Programming Language**
