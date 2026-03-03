# 🚀 SUSA Installer - Git Bash Quick Start

## For Windows Users with Git Bash

This guide is optimized for Git Bash on Windows. All commands work in your bash shell.

---

## ⚡ Step 1: Create Assets (30 seconds)

```bash
cd installer
powershell.exe -ExecutionPolicy Bypass -File create-placeholder-assets.ps1
cd ..
```

**What this does:** Creates basic icon and images for the installer.

---

## ⚡ Step 2: Verify Prerequisites (30 seconds)

```bash
# Check NSIS
which makensis || echo "NSIS not found - install with: choco install nsis"

# Check CMake
which cmake || echo "CMake not found - install with: choco install cmake"

# Check Node
node --version

# Check npm
npm --version

# Check Git
git --version
```

**If any tool is missing, install via PowerShell (as admin):**

```bash
# Open PowerShell as admin and run:
# choco install nsis cmake nodejs visualstudio2022buildtools -y
```

---

## ⚡ Step 3: Build CLI (2-5 minutes)

```bash
cd cpp-core
mkdir -p build
cd build

# Using CMake with Visual Studio
cmake .. -G "Visual Studio 17 2022" -A x64
cmake --build . --config Release

cd ../..
```

**Verify:**
```bash
ls -lh cpp-core/build/Release/cpp-core.exe
```

---

## ⚡ Step 4: Build IDE (5-10 minutes)

```bash
cd susa-ide/remix-of-susa-studio-ide-main
npm install
npm run dist:win
cd ../..
```

**Verify:**
```bash
ls -lh susa-ide/remix-of-susa-studio-ide-main/dist-electron/win-unpacked/
```

---

## ⚡ Step 5: Build Installer (1 minute)

### Option A: Using batch file
```bash
cd installer
cmd //c build-local.bat
cd ..
```

### Option B: Direct NSIS call
```bash
cd installer
"/c/Program Files (x86)/NSIS/makensis.exe" susa-installer.nsi
cd ..
```

**Verify:**
```bash
ls -lh dist/SUSA-Setup.exe
```

---

## ⚡ Step 6: Test Installer (2 minutes)

```bash
cd installer
cmd //c test-installer.bat
cd ..
```

---

## ⚡ Step 7: Deploy to GitHub (1 minute)

```bash
# Add all files
git add .

# Commit
git commit -m "Add professional Windows installer"

# Push
git push origin main

# Create release tag
git tag v1.0.0
git push origin v1.0.0
```

**GitHub Actions will automatically:**
- Build CLI and IDE
- Create installer
- Upload to Releases

**Download from:**
```
https://github.com/yourusername/susa/releases/tag/v1.0.0
```

---

## 🔧 Git Bash Specific Commands

### Running Windows Commands from Git Bash

```bash
# Run batch files
cmd //c build-local.bat

# Run PowerShell scripts
powershell.exe -ExecutionPolicy Bypass -File script.ps1

# Run NSIS directly
"/c/Program Files (x86)/NSIS/makensis.exe" installer.nsi

# Open Windows Explorer
explorer.exe .

# Open file in default app
start installer.exe
```

### Path Conversions

```bash
# Windows path to Git Bash path
# C:\Program Files\NSIS → /c/Program Files/NSIS

# Git Bash path to Windows path
# /c/Users/name → C:\Users\name

# Use in commands
"/c/Program Files (x86)/NSIS/makensis.exe" susa-installer.nsi
```

### Environment Variables

```bash
# Access Windows environment variables
echo $PROGRAMFILES
echo $USERPROFILE
echo $PATH

# Set temporary variable
export MY_VAR="value"

# Add to PATH temporarily
export PATH="$PATH:/c/Program Files (x86)/NSIS"
```

---

## 🐛 Git Bash Troubleshooting

### Problem: Command not found

```bash
# Find where program is installed
which cmake
which node
which git

# Add to PATH temporarily
export PATH="$PATH:/c/Program Files/CMake/bin"
export PATH="$PATH:/c/Program Files (x86)/NSIS"

# Add to PATH permanently (add to ~/.bashrc)
echo 'export PATH="$PATH:/c/Program Files (x86)/NSIS"' >> ~/.bashrc
source ~/.bashrc
```

### Problem: Permission denied

```bash
# Make script executable
chmod +x script.sh

# Run with explicit bash
bash script.sh

# Run PowerShell as admin
powershell.exe -Command "Start-Process powershell -Verb RunAs"
```

### Problem: Line endings (CRLF vs LF)

```bash
# Convert Windows line endings to Unix
dos2unix file.sh

# Or use sed
sed -i 's/\r$//' file.sh

# Configure Git to handle line endings
git config --global core.autocrlf true
```

### Problem: Spaces in paths

```bash
# Use quotes
"/c/Program Files (x86)/NSIS/makensis.exe" installer.nsi

# Or escape spaces
/c/Program\ Files\ \(x86\)/NSIS/makensis.exe installer.nsi
```

### Problem: Batch file won't run

```bash
# Use cmd //c (double slash)
cmd //c build-local.bat

# Not cmd /c (single slash - Git Bash interprets it)
```

---

## 📝 Useful Git Bash Aliases

Add these to `~/.bashrc`:

```bash
# Quick navigation
alias cdproj='cd /c/path/to/susa'
alias cdins='cd /c/path/to/susa/installer'

# Build shortcuts
alias build-cli='cd cpp-core/build && cmake --build . --config Release && cd ../..'
alias build-ide='cd ide && npm run build && cd ..'
alias build-installer='cd installer && cmd //c build-local.bat && cd ..'

# NSIS shortcut
alias makensis='"/c/Program Files (x86)/NSIS/makensis.exe"'

# Git shortcuts
alias gs='git status'
alias ga='git add'
alias gc='git commit -m'
alias gp='git push'
alias gl='git log --oneline -10'

# List files with details
alias ll='ls -lah'

# Open in Explorer
alias open='explorer.exe'
```

**Reload aliases:**
```bash
source ~/.bashrc
```

---

## 🎯 Complete Build Script for Git Bash

Save as `build-all.sh`:

```bash
#!/bin/bash
set -e  # Exit on error

echo "========================================="
echo "Building SUSA Complete Installer"
echo "========================================="

# Step 1: Create assets
echo "[1/5] Creating assets..."
cd installer
powershell.exe -ExecutionPolicy Bypass -File create-placeholder-assets.ps1
cd ..

# Step 2: Build CLI
echo "[2/5] Building CLI..."
cd cpp-core
mkdir -p build
cd build
cmake .. -G "Visual Studio 17 2022" -A x64
cmake --build . --config Release
cd ../..

# Step 3: Build IDE
echo "[3/5] Building IDE..."
cd ide
npm install
npm run build
cd ..

# Step 4: Build installer
echo "[4/5] Building installer..."
cd installer
cmd //c build-local.bat
cd ..

# Step 5: Verify
echo "[5/5] Verifying..."
if [ -f "dist/SUSA-Setup.exe" ]; then
    echo "✓ Success! Installer created:"
    ls -lh dist/SUSA-Setup.exe
else
    echo "✗ Error: Installer not found"
    exit 1
fi

echo "========================================="
echo "Build complete!"
echo "========================================="
```

**Make executable and run:**
```bash
chmod +x build-all.sh
./build-all.sh
```

---

## 🚀 Quick Commands Reference

```bash
# Create assets
cd installer && powershell.exe -ExecutionPolicy Bypass -File create-placeholder-assets.ps1 && cd ..

# Build CLI
cd cpp-core/build && cmake --build . --config Release && cd ../..

# Build IDE
cd susa-ide/remix-of-susa-studio-ide-main && npm run dist:win && cd ../..

# Build installer
cd installer && cmd //c build-local.bat && cd ..

# Test installer
cd installer && cmd //c test-installer.bat && cd ..

# Deploy
git add . && git commit -m "Update installer" && git push

# Create release
git tag v1.0.0 && git push origin v1.0.0

# Check status
git status

# View recent commits
git log --oneline -5

# View file
cat installer/susa-installer.nsi

# Edit file
nano installer/susa-installer.nsi
# or
vim installer/susa-installer.nsi

# Find files
find . -name "*.nsi"

# Search in files
grep -r "PRODUCT_VERSION" installer/

# Disk usage
du -sh dist/
```

---

## ✅ Success Checklist

After completing all steps:

```bash
# Verify all files exist
ls -lh cpp-core/build/Release/cpp-core.exe
ls -lh ide/dist/win-unpacked/SUSA-IDE.exe
ls -lh dist/SUSA-Setup.exe
ls -lh installer/assets/susa_icon.ico
ls -lh installer/assets/susa_header.bmp
ls -lh installer/assets/susa_sidebar.bmp

# Check Git status
git status

# View recent tags
git tag -l

# Check remote
git remote -v
```

---

## 📚 Next Steps

1. **Customize branding:** Replace assets in `installer/assets/`
2. **Test installer:** Run on clean Windows VM
3. **Create release:** `git tag v1.0.0 && git push origin v1.0.0`
4. **Share:** Download from GitHub Releases

---

## 🎉 You're Done!

Your SUSA installer is ready to build and deploy using Git Bash!

**For more details, read:**
- `INSTALLER-MASTER-README.md` - Complete guide
- `INSTALLER-DOCUMENTATION.md` - Technical reference
- `INSTALLER-INDEX.md` - Documentation navigator
