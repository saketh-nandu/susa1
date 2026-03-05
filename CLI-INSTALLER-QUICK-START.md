# SUSA CLI Installer - Quick Start

## 🚀 Build in 3 Steps

### 1. Install NSIS
```cmd
choco install nsis
```

### 2. Build CLI
```cmd
cd cpp-core
build.bat
```

### 3. Build Installer
```cmd
cd installer-cli
build-local.bat
```

**Done!** Installer is ready: `SUSA-CLI-Setup.exe`

---

## 📦 What You Get

- Professional Windows installer (~2.5 MB)
- Modern UI wizard with SUSA branding
- System PATH integration
- Start Menu shortcuts
- Automatic upgrades
- Clean uninstallation

---

## 🧪 Test It

```cmd
cd installer-cli
test-installer.bat
```

---

## 📤 Distribute

### Option 1: GitHub Release
```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```
Installer builds automatically!

### Option 2: Manual Upload
Upload `SUSA-CLI-Setup.exe` to:
- Dropbox (add `?dl=1`)
- Google Drive
- Your website

---

## 💻 Silent Install

```cmd
SUSA-CLI-Setup.exe /S
```

---

## 🎨 Customize

Edit `installer-cli/susa-cli-installer.nsi`:

```nsis
!define PRODUCT_VERSION "1.0.0"
!define PRODUCT_PUBLISHER "Your Name"
!define PRODUCT_WEB_SITE "https://yoursite.com"
```

Replace branding:
- `assets/susa.ico` - Installer icon
- `assets/susa-sidebar.bmp` - Sidebar image (164x314)
- `assets/susa-header.bmp` - Header image (150x57)

---

## 📁 Files

```
installer-cli/
├── susa-cli-installer.nsi    # Main script
├── build-local.bat            # Build script
├── test-installer.bat         # Test script
├── license.txt                # License
├── assets/                    # Branding
└── dist/cli/susa.exe         # CLI executable
```

---

## 🐛 Troubleshooting

**NSIS not found?**
```cmd
choco install nsis
```

**susa.exe not found?**
```cmd
cd cpp-core
build.bat
```

**PATH not working?**
- Restart command prompt
- Or restart PC

---

## 📚 Full Documentation

See: `CLI-INSTALLER-GUIDE.md`

---

**Ready to ship!** 🎉
