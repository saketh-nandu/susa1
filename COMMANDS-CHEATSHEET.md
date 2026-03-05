# 🚀 SUSA Installer - Commands Cheatsheet

Quick reference for all commands needed to build and deploy the SUSA installer.

---

## 📋 Prerequisites Check

```bash
# Check all tools
which makensis && echo "✓ NSIS" || echo "✗ NSIS missing"
which cmake && echo "✓ CMake" || echo "✗ CMake missing"
which node && echo "✓ Node.js" || echo "✗ Node.js missing"
which git && echo "✓ Git" || echo "✗ Git missing"

# Show versions
node --version
npm --version
git --version
cmake --version
```

---

## 🎨 Create Assets

```bash
# Using PowerShell script
cd installer
powershell.exe -ExecutionPolicy Bypass -File create-placeholder-assets.ps1
cd ..

# Verify assets created
ls -lh installer/assets/
```

---

## 🔨 Build CLI

```bash
# Navigate and create build directory
cd cpp-core
mkdir -p build
cd build

# Configure with CMake
cmake .. -G "Visual Studio 17 2022" -A x64

# Build
cmake --build . --config Release

# Return to root
cd ../..

# Verify
ls -lh cpp-core/build/Release/cpp-core.exe
```

---

## 💻 Build IDE

```bash
# Navigate to IDE directory
cd ide

# Install dependencies
npm install

# Build Electron app
npm run build

# Return to root
cd ..

# Verify
ls -lh ide/dist/win-unpacked/SUSA-IDE.exe
```

---

## 📦 Build Installer

### Method 1: Using batch file (recommended)
```bash
cd installer
cmd //c build-local.bat
cd ..
```

### Method 2: Direct NSIS call
```bash
cd installer
"/c/Program Files (x86)/NSIS/makensis.exe" susa-installer.nsi
cd ..
```

### Verify
```bash
ls -lh dist/SUSA-Setup.exe
cat dist/SUSA-Setup.exe.sha256
```

---

## 🧪 Test Installer

```bash
# Run automated test
cd installer
cmd //c test-installer.bat
cd ..

# Manual test (installs SUSA)
./dist/SUSA-Setup.exe

# Silent install test
./dist/SUSA-Setup.exe //S
```

---

## 🚀 Git Commands

### Initial commit
```bash
git add .
git commit -m "Add professional Windows installer"
git push origin main
```

### Create release
```bash
# Create and push tag
git tag v1.0.0
git push origin v1.0.0

# Or with annotation
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### View status
```bash
git status
git log --oneline -10
git tag -l
```

---

## 🔄 Complete Build Pipeline

### One-liner (all steps)
```bash
cd installer && powershell.exe -ExecutionPolicy Bypass -File create-placeholder-assets.ps1 && cd ../cpp-core/build && cmake --build . --config Release && cd ../../ide && npm run build && cd ../installer && cmd //c build-local.bat && cd ..
```

### Readable version
```bash
# Step 1: Assets
cd installer && powershell.exe -ExecutionPolicy Bypass -File create-placeholder-assets.ps1 && cd ..

# Step 2: CLI
cd cpp-core/build && cmake --build . --config Release && cd ../..

# Step 3: IDE
cd ide && npm run build && cd ..

# Step 4: Installer
cd installer && cmd //c build-local.bat && cd ..

# Step 5: Verify
ls -lh dist/SUSA-Setup.exe
```

---

## 🛠️ Maintenance Commands

### Clean build
```bash
# Clean CLI
rm -rf cpp-core/build
cd cpp-core && mkdir build && cd build && cmake .. -G "Visual Studio 17 2022" -A x64 && cd ../..

# Clean IDE
rm -rf ide/node_modules ide/dist
cd ide && npm install && cd ..

# Clean installer output
rm -rf dist
```

### Rebuild everything
```bash
# Full clean rebuild
rm -rf cpp-core/build ide/node_modules ide/dist dist
cd cpp-core && mkdir build && cd build && cmake .. -G "Visual Studio 17 2022" -A x64 && cmake --build . --config Release && cd ../../ide && npm install && npm run build && cd ../installer && cmd //c build-local.bat && cd ..
```

---

## 📝 File Operations

### View files
```bash
# List installer files
ls -lh installer/

# View NSIS script
cat installer/susa-installer.nsi

# View license
cat installer/license.txt

# View workflow
cat .github/workflows/build-installer.yml
```

### Edit files
```bash
# Using nano
nano installer/susa-installer.nsi

# Using vim
vim installer/susa-installer.nsi

# Using VS Code
code installer/susa-installer.nsi
```

### Search files
```bash
# Find all NSIS files
find . -name "*.nsi"

# Search for text in files
grep -r "PRODUCT_VERSION" installer/

# Search with line numbers
grep -rn "PRODUCT_VERSION" installer/
```

---

## 🔍 Verification Commands

### Check file existence
```bash
# Check all required files
test -f cpp-core/build/Release/cpp-core.exe && echo "✓ CLI" || echo "✗ CLI missing"
test -f ide/dist/win-unpacked/SUSA-IDE.exe && echo "✓ IDE" || echo "✗ IDE missing"
test -f dist/SUSA-Setup.exe && echo "✓ Installer" || echo "✗ Installer missing"
test -f installer/assets/susa_icon.ico && echo "✓ Icon" || echo "✗ Icon missing"
```

### Check file sizes
```bash
# Show sizes
du -sh cpp-core/build/Release/cpp-core.exe
du -sh ide/dist/win-unpacked/
du -sh dist/SUSA-Setup.exe

# Detailed listing
ls -lh cpp-core/build/Release/cpp-core.exe
ls -lh dist/SUSA-Setup.exe
```

---

## 🌐 GitHub Actions

### Trigger workflow manually
```bash
# Push to trigger
git push origin main

# Or use GitHub CLI
gh workflow run build-installer.yml
```

### View workflow status
```bash
# Using GitHub CLI
gh run list
gh run view
gh run watch
```

### Download artifacts
```bash
# Using GitHub CLI
gh release list
gh release download v1.0.0
```

---

## 🎯 Quick Tasks

### Update version
```bash
# Update in NSIS script
sed -i 's/PRODUCT_VERSION "1.0.0"/PRODUCT_VERSION "1.1.0"/' installer/susa-installer.nsi

# Update in workflow
sed -i 's/PRODUCT_VERSION: 1.0.0/PRODUCT_VERSION: 1.1.0/' .github/workflows/build-installer.yml

# Update in IDE
sed -i 's/"version": "1.0.0"/"version": "1.1.0"/' ide/package.json
```

### Create backup
```bash
# Backup installer
cp dist/SUSA-Setup.exe dist/SUSA-Setup-backup-$(date +%Y%m%d).exe

# Backup entire project
tar -czf ../susa-backup-$(date +%Y%m%d).tar.gz .
```

### Generate checksums
```bash
# SHA256
sha256sum dist/SUSA-Setup.exe > dist/SUSA-Setup.exe.sha256

# MD5
md5sum dist/SUSA-Setup.exe > dist/SUSA-Setup.exe.md5
```

---

## 🐛 Troubleshooting Commands

### Check PATH
```bash
echo $PATH
which makensis
which cmake
which node
```

### Add to PATH temporarily
```bash
export PATH="$PATH:/c/Program Files (x86)/NSIS"
export PATH="$PATH:/c/Program Files/CMake/bin"
```

### Check processes
```bash
# Check if SUSA is running
tasklist | grep -i susa

# Kill processes
taskkill //F //IM cpp-core.exe
taskkill //F //IM SUSA-IDE.exe
```

### View logs
```bash
# Build logs
cat cpp-core/build/CMakeFiles/CMakeOutput.log

# npm logs
cat ide/npm-debug.log

# Git logs
git log --oneline -20
```

---

## 📊 Statistics

### Count lines of code
```bash
# NSIS script
wc -l installer/susa-installer.nsi

# All documentation
wc -l *.md

# All code
find . -name "*.nsi" -o -name "*.bat" -o -name "*.ps1" | xargs wc -l
```

### Disk usage
```bash
# Project size
du -sh .

# Build outputs
du -sh cpp-core/build
du -sh ide/dist
du -sh dist
```

---

## 🎨 Customization Commands

### Replace product name
```bash
# In NSIS script
sed -i 's/SUSA Programming Language/Your Product Name/g' installer/susa-installer.nsi

# In all markdown files
find . -name "*.md" -exec sed -i 's/SUSA/YourProduct/g' {} +
```

### Update URLs
```bash
# Update GitHub URL
sed -i 's|github.com/yourusername/susa|github.com/yourname/yourrepo|g' installer/susa-installer.nsi
```

---

## 🚀 Deployment Checklist

```bash
# 1. Update version
sed -i 's/1.0.0/1.1.0/' installer/susa-installer.nsi .github/workflows/build-installer.yml ide/package.json

# 2. Build everything
cd installer && cmd //c build-local.bat && cd ..

# 3. Test
cd installer && cmd //c test-installer.bat && cd ..

# 4. Commit
git add .
git commit -m "Release v1.1.0"
git push

# 5. Tag and release
git tag v1.1.0
git push origin v1.1.0

# 6. Wait for GitHub Actions
gh run watch

# 7. Download and verify
gh release download v1.1.0
```

---

## 💡 Pro Tips

### Create aliases (add to ~/.bashrc)
```bash
alias cdins='cd /c/path/to/susa/installer'
alias build-all='cd installer && cmd //c build-local.bat && cd ..'
alias test-ins='cd installer && cmd //c test-installer.bat && cd ..'
alias makensis='"/c/Program Files (x86)/NSIS/makensis.exe"'
```

### Reload bash config
```bash
source ~/.bashrc
```

### Quick navigation
```bash
# Jump to project root
cd $(git rev-parse --show-toplevel)

# Jump to installer
cd $(git rev-parse --show-toplevel)/installer
```

---

**Save this file for quick reference!**

For detailed guides, see:
- `GIT-BASH-QUICK-START.md` - Complete Git Bash guide
- `INSTALLER-INDEX.md` - Documentation navigator
- `INSTALLER-MASTER-README.md` - Master guide
