# 🚀 Get Started NOW - 5 Minute Setup

## Your Mission: Build Your First SUSA Installer

Follow these exact steps. Copy and paste each command.

---

## ⚡ Step 1: Create Assets (30 seconds)

```bash
cd installer
powershell.exe -ExecutionPolicy Bypass -File create-placeholder-assets.ps1
cd ..
```

**What this does:** Creates basic icon and images for the installer.

**Expected output:**
```
Creating placeholder assets for SUSA installer...
Creating header image (150x57)...
Creating sidebar image (164x314)...
Creating icon (32x32)...
Placeholder assets created successfully!
```

---

## ⚡ Step 2: Verify Prerequisites (30 seconds)

```bash
# Check NSIS
which makensis || echo "NSIS not found"

# Check CMake
which cmake || echo "CMake not found"

# Check Node
node --version

# Check npm
npm --version
```

**If any command fails:**

```bash
# Install everything at once (run in PowerShell as admin)
choco install nsis cmake nodejs visualstudio2022buildtools -y
```

---

## ⚡ Step 3: Build CLI (2-5 minutes)

```bash
cd cpp-core
mkdir build
cd build
cmake .. -G "Visual Studio 17 2022" -A x64
cmake --build . --config Release
cd ../..
```

**Expected output:**
```
-- Build files have been written to: ...
Microsoft (R) Build Engine version ...
Build succeeded.
```

**Verify:**
```bash
ls cpp-core/build/Release/cpp-core.exe
```

---

## ⚡ Step 4: Build IDE (5-10 minutes)

```bash
cd ide
npm install
npm run build
cd ..
```

**Expected output:**
```
added XXX packages
> build
> electron-builder --win --x64
```

**Verify:**
```bash
ls ide/dist/win-unpacked/SUSA-IDE.exe
```

---

## ⚡ Step 5: Build Installer (1 minute)

```bash
cd installer
cmd //c build-local.bat
# Or directly:
# "/c/Program Files (x86)/NSIS/makensis.exe" susa-installer.nsi
```

**Expected output:**
```
========================================
SUSA Installer - Local Build
========================================

Building NSIS installer...
MakeNSIS v3.x
...
Install: 7 pages (448 bytes), 4 sections (4160 bytes)
...
Output: "SUSA-Setup.exe"
Install: 85 MB

========================================
SUCCESS!
========================================
Installer created: dist\SUSA-Setup.exe
Size: XXXXXXXX bytes
```

**Verify:**
```bash
ls -lh ../dist/SUSA-Setup.exe
```

---

## ⚡ Step 6: Test Installer (2 minutes)

```bash
cmd //c test-installer.bat
```

**Expected output:**
```
========================================
SUSA Installer - Test Script
========================================

[1/4] Installing SUSA...
[2/4] Verifying installation...
  [OK] CLI installed
  [OK] IDE installed
[3/4] Testing CLI...
  [OK] CLI works
[4/4] Uninstalling SUSA...
  [OK] Uninstall successful

========================================
Test complete!
========================================
```

---

## ⚡ Step 7: Deploy to GitHub (1 minute)

```bash
cd ..
git add .
git commit -m "Add professional Windows installer"
git push
```

**Create a release:**
```bash
git tag v1.0.0
git push origin v1.0.0
```

**Wait 10-15 minutes for GitHub Actions to complete.**

**Then download from:**
```
https://github.com/yourusername/susa/releases/tag/v1.0.0
```

---

## ✅ Success Checklist

After completing all steps, you should have:

- [x] Assets created in `installer/assets/`
- [x] CLI built: `cpp-core/build/Release/cpp-core.exe`
- [x] IDE built: `ide/dist/win-unpacked/SUSA-IDE.exe`
- [x] Installer created: `dist/SUSA-Setup.exe`
- [x] Installer tested successfully
- [x] Code committed to GitHub
- [x] Release tag created
- [x] GitHub Actions running

---

## 🎯 What You Just Built

A professional Windows installer that:

1. **Installs** SUSA CLI and IDE
2. **Adds** CLI to PATH (optional)
3. **Creates** desktop shortcut (optional)
4. **Creates** Start Menu shortcuts
5. **Uninstalls** cleanly
6. **Supports** silent install
7. **Integrates** with Windows properly
8. **Builds** automatically via GitHub Actions

---

## 🐛 Quick Troubleshooting

### Problem: NSIS not found
```bash
# Run in PowerShell as admin
choco install nsis -y
# Or add to PATH in Git Bash
export PATH="$PATH:/c/Program Files (x86)/NSIS"
```

### Problem: CMake fails
```bash
# Run in PowerShell as admin
choco install cmake visualstudio2022buildtools -y
```

### Problem: npm install fails
```bash
cd ide
rm -rf node_modules package-lock.json
npm install
```

### Problem: Assets not found
```bash
cd installer
powershell.exe -ExecutionPolicy Bypass -File create-placeholder-assets.ps1
```

### Problem: Build fails
Check that these files exist:
- `cpp-core/CMakeLists.txt`
- `ide/package.json`
- `installer/susa-installer.nsi`

---

## 📚 What to Read Next

1. **`DELIVERY-SUMMARY.md`** - See what you got
2. **`INSTALLER-MASTER-README.md`** - Complete overview
3. **`INSTALLER-DOCUMENTATION.md`** - Technical reference
4. **`PROJECT-STRUCTURE.md`** - Visual diagrams

---

## 🎨 Customize Your Installer

### Replace Placeholder Assets

Create professional versions of:
- `installer/assets/susa_icon.ico` (256x256)
- `installer/assets/susa_header.bmp` (150x57)
- `installer/assets/susa_sidebar.bmp` (164x314)

Use:
- Canva: https://www.canva.com
- Photopea: https://www.photopea.com
- Figma: https://www.figma.com

### Update Product Info

Edit `installer/susa-installer.nsi`:

```nsis
!define PRODUCT_NAME "Your Product Name"
!define PRODUCT_VERSION "1.0.0"
!define PRODUCT_PUBLISHER "Your Company"
!define PRODUCT_WEB_SITE "https://yoursite.com"
```

### Update License

Edit `installer/license.txt` with your license terms.

---

## 🚀 Ship It!

You're ready to distribute SUSA to the world!

1. ✅ Installer builds successfully
2. ✅ Tests pass
3. ✅ GitHub Actions configured
4. ✅ Documentation complete

**Just replace the placeholder assets and you're production-ready!**

---

## 🎉 Congratulations!

You now have a professional Windows installer system comparable to:
- Node.js installer
- Python installer
- Rust installer
- Go installer

**Time to celebrate and share with your users! 🎊**

---

## 📞 Need Help?

- **Documentation:** Read the 6 comprehensive guides
- **Issues:** Check troubleshooting sections
- **GitHub:** Create an issue if stuck

---

**Total Time: 11-19 minutes from zero to deployed installer!**

**You did it! 🚀**
