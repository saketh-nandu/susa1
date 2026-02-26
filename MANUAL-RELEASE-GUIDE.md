# Manual Release Upload Guide

## The Problem
GitHub has a 100 MB file size limit for Git repositories, but your IDE installers are larger.

## The Solution
Upload installers manually to GitHub Releases (supports files up to 2 GB).

---

## 📂 Your Windows Installers

Located in: `C:\Users\Nandu\Downloads\SUSA\Output\`

1. **SUSA-CLI-Only-1.0.0.exe** (691 KB) ✅ Small enough
2. **SUSA-IDE-Desktop-App-1.0.0.exe** (105 MB) ❌ Too big for Git
3. **SUSA-Complete-Setup-1.0.0.exe** (147 MB) ❌ Too big for Git

---

## 🚀 Step-by-Step Upload Process

### Step 1: Push Source Code (Without Installers)

Run in Git Bash:
```bash
# Remove large files from Git
git rm -r --cached Output
git rm -r --cached susa-ide/remix-of-susa-studio-ide-main/dist-electron
git rm -r --cached susa-setup

# Add .gitignore and source files
git add .gitignore
git add cpp-core/ modules/ examples/ docs/ *.md *.sh .github/

# Commit and push
git commit -m "SUSA v1.0.0 - Source code only"
git push -u origin main --force
```

### Step 2: Create Release on GitHub

1. Go to: https://github.com/saketh-nandu/susa1
2. Click "Releases" (right sidebar)
3. Click "Create a new release"

### Step 3: Configure Release

**Tag version:** `v1.0.0`
**Release title:** `SUSA v1.0.0 - First Stable Release`

**Description:**
```markdown
# SUSA v1.0.0 - First Stable Release

Modern programming language with English-like syntax.

## 🎉 Features
- 40 complete language features
- Object-oriented programming
- Functional programming
- Async/await support
- Generators and yield
- 9 built-in modules (290+ functions)
- Fast C++ interpreter

## 📦 Downloads

### Windows
- **SUSA-CLI-Only-1.0.0.exe** - Command-line interface (691 KB)
- **SUSA-IDE-Desktop-App-1.0.0.exe** - Desktop IDE (105 MB)
- **SUSA-Complete-Setup-1.0.0.exe** - Complete package (147 MB)

### Linux & macOS
Building automatically via GitHub Actions...
Check back in 15 minutes for Linux and macOS binaries.

## 📚 Documentation
- [Getting Started](https://susastudio.online/docs)
- [Language Reference](https://github.com/saketh-nandu/susa1/blob/main/README.md)
- [Examples](https://github.com/saketh-nandu/susa1/tree/main/examples)

## 🔗 Links
- Website: https://susastudio.online
- Repository: https://github.com/saketh-nandu/susa1
```

### Step 4: Upload Windows Installers

1. Scroll down to "Attach binaries"
2. Drag and drop these files from `Output\` folder:
   - `SUSA-CLI-Only-1.0.0.exe`
   - `SUSA-IDE-Desktop-App-1.0.0.exe`
   - `SUSA-Complete-Setup-1.0.0.exe`

3. Wait for upload to complete

### Step 5: Publish Release

1. Check "Set as the latest release"
2. Click "Publish release"

---

## ✅ What Happens Next

### Immediately:
- Windows installers are available for download
- Users can download and install SUSA on Windows

### In ~15 minutes:
- GitHub Actions builds Linux binaries
- GitHub Actions builds macOS binaries
- All platform binaries appear in the same release

---

## 🔄 Alternative: Use GitHub CLI

If you have GitHub CLI installed:

```bash
# Install GitHub CLI (if not installed)
# Download from: https://cli.github.com/

# Login
gh auth login

# Create release and upload files
gh release create v1.0.0 \
  Output/SUSA-CLI-Only-1.0.0.exe \
  Output/SUSA-IDE-Desktop-App-1.0.0.exe \
  Output/SUSA-Complete-Setup-1.0.0.exe \
  --title "SUSA v1.0.0 - First Stable Release" \
  --notes "Modern programming language with English-like syntax"
```

---

## 📊 Final Structure

After everything is done:

```
GitHub Release v1.0.0
├── Windows (Manual Upload)
│   ├── SUSA-CLI-Only-1.0.0.exe
│   ├── SUSA-IDE-Desktop-App-1.0.0.exe
│   └── SUSA-Complete-Setup-1.0.0.exe
├── Linux (GitHub Actions)
│   ├── susa (binary)
│   ├── SUSA-Linux-1.0.0.tar.gz
│   ├── susa_1.0.0_amd64.deb
│   └── susa-1.0.0-1.x86_64.rpm
└── macOS (GitHub Actions)
    ├── susa (universal binary)
    ├── SUSA-macOS-1.0.0.tar.gz
    └── SUSA-macOS-1.0.0.dmg
```

---

## 🎯 Quick Summary

1. ✅ Push source code to GitHub (without large installers)
2. ✅ Create release v1.0.0 on GitHub
3. ✅ Manually upload Windows installers to release
4. ⏳ Wait for GitHub Actions to build Linux/macOS
5. ✅ All platforms available in one release!

---

**Your Windows installers are safe in `Output\` folder - just upload them to GitHub Releases!** 🚀
