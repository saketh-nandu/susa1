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
powershell.exe -ExecutionPolicy Bypass -Fi