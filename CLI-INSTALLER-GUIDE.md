# SUSA CLI Professional Installer - Complete Guide

## 🎯 Overview

Professional Windows installer for SUSA CLI compiler, built with NSIS Modern UI 2. Provides a wizard-style installation experience similar to Node.js and Python installers.

## ✨ Features

### Installer Features
- ✅ Modern UI 2 wizard interface
- ✅ SUSA branded graphics and icons
- ✅ Professional installation flow
- ✅ System PATH integration
- ✅ Start Menu shortcuts
- ✅ Automatic upgrade handling
- ✅ Silent installation support
- ✅ Clean uninstallation
- ✅ Windows Search integration
- ✅ Registry integration

### Installation Options
- Add SUSA to system PATH (recommended)
- Create Start Menu shortcuts
- Launch CLI terminal after installation

## 📦 What Gets Installed

```
C:\Program Files\SUSA\cli\
├── susa.exe          # CLI compiler/interpreter
└── Uninstall.exe     # Uninstaller
```

### System Integration
- **PATH**: `C:\Program Files\SUSA\cli` added to system PATH
- **Start Menu**: `SUSA` folder with CLI shortcut
- **Registry**: Uninstall entry in Programs & Features
- **App Paths**: Windows Search integration

## 🚀 Building the Installer

### Prerequisites

1. **Windows 10/11**
2. **NSIS 3.x** - Install via:
   ```cmd
   choco install nsis
   ```
   Or download from: https://nsis.sourceforge.io/Download

3. **SUSA CLI built** - Ensure `susa.exe` exists:
   ```cmd
   cd cpp-core
   build.bat
   ```

### Method 1: Local Build (Recommended for Testing)

```cmd
cd installer-cli
build-local.bat
```

This will:
1. Check NSIS installation
2. Copy `susa.exe` from cpp-core
3. Prepare branding assets
4. Build `SUSA-CLI-Setup.exe`

### Method 2: GitHub Actions (Automated)

Push to repository:
```bash
git add .
git commit -m "Build CLI installer"
git push
```

Download from: **Actions → Build SUSA CLI Installer → Artifacts**

### Method 3: Manual Build

```cmd
cd installer-cli

REM Prepare files
mkdir dist\cli
copy ..\cpp-core\build\susa.exe dist\cli\

REM Build installer
"C:\Program Files (x86)\NSIS\makensis.exe" susa-cli-installer.nsi
```

## 📁 Project Structure

```
installer-cli/
├── susa-cli-installer.nsi     # Main NSIS script (1000+ lines)
├── license.txt                 # MIT License
├── README.md                   # Documentation
├── build-local.bat             # Local build script
├── test-installer.bat          # Testing script
├── assets/                     # Branding assets
│   ├── susa.ico               # Installer icon (16x16, 32x32, 48x48)
│   ├── susa-header.bmp        # Header image (150x57)
│   └── susa-sidebar.bmp       # Sidebar image (164x314)
├── dist/                       # Build artifacts
│   └── cli/
│       └── susa.exe           # CLI executable
└── SUSA-CLI-Setup.exe         # Output installer (~2.5 MB)
```

## 🎨 Branding Customization

### Update Branding Assets

Replace these files in `installer-cli/assets/`:

| File | Size | Format | Purpose |
|------|------|--------|---------|
| `susa.ico` | 16x16, 32x32, 48x48 | ICO | Installer icon |
| `susa-header.bmp` | 150x57 | BMP | Wizard header |
| `susa-sidebar.bmp` | 164x314 | BMP | Welcome/Finish page |

### Update Product Information

Edit `susa-cli-installer.nsi`:

```nsis
!define PRODUCT_NAME "SUSA CLI"
!define PRODUCT_VERSION "1.0.0"
!define PRODUCT_PUBLISHER "SUSA Programming Language"
!define PRODUCT_WEB_SITE "https://susa-programming-language.web.app"
```

### Update Version

```nsis
!define PRODUCT_VERSION "1.0.0"

VIProductVersion "1.0.0.0"  # Must be X.X.X.X format
```

## 💻 Installation Wizard Flow

### Page 1: Welcome
- SUSA logo and branding
- Welcome message
- "Next" to continue

### Page 2: License Agreement
- MIT License text
- "I Agree" to accept
- Must accept to continue

### Page 3: Installation Directory
- Default: `C:\Program Files\SUSA\cli`
- "Browse" to change location
- Shows required space

### Page 4: Installation Options
```
Select additional tasks to perform:

☑ Add SUSA to system PATH (recommended)
  Allows you to run 'susa' from any command prompt

☑ Create Start Menu shortcut
  Adds 'SUSA CLI' to your Start Menu

Installation will include:
• SUSA CLI Compiler (susa.exe)
• Command-line interpreter
• Standard library modules
```

### Page 5: Installation Progress
- Real-time progress bar
- Detailed status messages:
  - Checking for running processes
  - Installing CLI compiler
  - Creating uninstaller
  - Adding to PATH
  - Creating shortcuts

### Page 6: Finish
- Success message
- Options:
  - ☐ Open SUSA CLI Terminal
  - Visit SUSA Website (link)
- "Finish" to close

## 🔧 Installation Behavior

### What Happens During Install

1. **Process Check**
   - Terminates running `susa.exe` and `cpp-core.exe`
   - Ensures clean installation

2. **File Installation**
   - Copies `susa.exe` to install directory
   - Creates uninstaller

3. **Registry Setup**
   ```
   HKLM\Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA CLI
   ├── DisplayName = "SUSA CLI"
   ├── DisplayVersion = "1.0.0"
   ├── Publisher = "SUSA Programming Language"
   ├── UninstallString = "C:\Program Files\SUSA\cli\Uninstall.exe"
   ├── DisplayIcon = "C:\Program Files\SUSA\cli\susa.exe"
   └── EstimatedSize = (calculated)
   
   HKLM\Software\Microsoft\Windows\CurrentVersion\App Paths\susa.exe
   ├── (Default) = "C:\Program Files\SUSA\cli\susa.exe"
   └── Path = "C:\Program Files\SUSA\cli"
   ```

4. **PATH Integration** (if selected)
   - Reads current system PATH
   - Checks if already present (prevents duplicates)
   - Appends install directory
   - Broadcasts environment change

5. **Start Menu** (if selected)
   ```
   Start Menu\Programs\SUSA\
   ├── SUSA CLI.lnk
   └── Uninstall SUSA CLI.lnk
   ```

### Upgrade Handling

When existing installation detected:
1. Prompts: "SUSA CLI is already installed. Upgrade to version X.X.X?"
2. If Yes: Runs silent uninstall of old version
3. Installs new version
4. Preserves user PATH settings

## 🗑️ Uninstallation

### Methods

1. **Control Panel**
   - Settings → Apps → SUSA CLI → Uninstall

2. **Start Menu**
   - Start → SUSA → Uninstall SUSA CLI

3. **Command Line**
   ```cmd
   "C:\Program Files\SUSA\cli\Uninstall.exe"
   ```

4. **Silent Uninstall**
   ```cmd
   "C:\Program Files\SUSA\cli\Uninstall.exe" /S
   ```

### What Gets Removed

- ✅ All installed files (`susa.exe`, `Uninstall.exe`)
- ✅ Installation directory
- ✅ System PATH entry
- ✅ Start Menu shortcuts
- ✅ Registry entries
- ✅ App Paths registration

### Process Termination

Before uninstall, automatically terminates:
- `susa.exe`
- `cpp-core.exe`

## 🤫 Silent Installation

### Silent Install

```cmd
SUSA-CLI-Setup.exe /S
```

Installs with default options:
- Location: `C:\Program Files\SUSA\cli`
- Adds to PATH: Yes
- Creates Start Menu: Yes

### Silent Install to Custom Directory

```cmd
SUSA-CLI-Setup.exe /S /D=C:\MyApps\SUSA
```

**Note**: `/D` must be the last parameter!

### Silent Uninstall

```cmd
"C:\Program Files\SUSA\cli\Uninstall.exe" /S
```

### Deployment Script Example

```cmd
@echo off
REM Deploy SUSA CLI to multiple machines

echo Downloading installer...
curl -L -o SUSA-CLI-Setup.exe https://github.com/user/repo/releases/latest/download/SUSA-CLI-Setup.exe

echo Installing SUSA CLI...
SUSA-CLI-Setup.exe /S

echo Waiting for installation...
timeout /t 10 /nobreak

echo Verifying installation...
susa --version

echo Done!
```

## 🧪 Testing

### Automated Testing

```cmd
cd installer-cli
test-installer.bat
```

This will:
1. Check installer exists
2. Run silent install
3. Verify installation
4. Test PATH integration
5. Run silent uninstall
6. Verify cleanup

### Manual Testing Checklist

- [ ] **Fresh Install**
  - [ ] Installer launches
  - [ ] All wizard pages display
  - [ ] Branding assets show correctly
  - [ ] License page works
  - [ ] Directory selection works
  - [ ] Options page displays
  - [ ] Installation completes
  - [ ] Finish page shows

- [ ] **PATH Integration**
  - [ ] Open new cmd prompt
  - [ ] Run `susa --version`
  - [ ] Works from any directory

- [ ] **Start Menu**
  - [ ] SUSA folder exists
  - [ ] CLI shortcut works
  - [ ] Opens terminal with SUSA

- [ ] **Upgrade**
  - [ ] Install version 1.0.0
  - [ ] Install version 1.0.1
  - [ ] Prompts for upgrade
  - [ ] Upgrades successfully

- [ ] **Uninstall**
  - [ ] Via Control Panel
  - [ ] Via Start Menu
  - [ ] All files removed
  - [ ] PATH entry removed
  - [ ] Shortcuts removed

- [ ] **Silent Install**
  - [ ] `/S` flag works
  - [ ] Installs without UI
  - [ ] PATH added automatically

- [ ] **Windows Versions**
  - [ ] Windows 10
  - [ ] Windows 11

## 🔐 Code Signing (Optional)

### Why Sign?

- Removes "Unknown Publisher" warning
- Builds user trust
- Required for some enterprise deployments

### Signing Process

1. **Get Certificate**
   - Purchase from: DigiCert, Sectigo, etc.
   - Or use self-signed for testing

2. **Sign Installer**
   ```cmd
   signtool sign /f certificate.pfx /p password /t http://timestamp.digicert.com SUSA-CLI-Setup.exe
   ```

3. **Verify Signature**
   ```cmd
   signtool verify /pa SUSA-CLI-Setup.exe
   ```

### Auto-Sign in NSIS

Add to `susa-cli-installer.nsi`:

```nsis
!finalize 'signtool sign /f "certificate.pfx" /p "password" /t "http://timestamp.digicert.com" "%1"'
```

## 📊 Installer Analytics

### File Size Breakdown

| Component | Size |
|-----------|------|
| SUSA CLI (`susa.exe`) | ~2.0 MB |
| NSIS overhead | ~400 KB |
| Branding assets | ~100 KB |
| **Total Installer** | **~2.5 MB** |

### Installation Time

- Fresh install: ~5-10 seconds
- Upgrade: ~10-15 seconds
- Uninstall: ~3-5 seconds

## 🐛 Troubleshooting

### Build Issues

**Problem**: NSIS not found
```
Solution: Install NSIS or add to PATH
choco install nsis
```

**Problem**: `susa.exe` not found
```
Solution: Build CLI first
cd cpp-core
build.bat
```

**Problem**: Branding assets missing
```
Solution: Assets are optional, installer will use placeholders
Or copy: susa logo.ico → installer-cli/assets/susa.ico
```

### Installation Issues

**Problem**: "Access denied" during install
```
Solution: Run installer as Administrator
Right-click → Run as administrator
```

**Problem**: PATH not working after install
```
Solution: Restart command prompt
Or restart Windows Explorer:
taskkill /f /im explorer.exe
start explorer.exe
```

**Problem**: Installer won't launch
```
Solution: Check Windows SmartScreen
Click "More info" → "Run anyway"
Or sign the installer with code signing certificate
```

### Runtime Issues

**Problem**: `susa` command not found
```
Solution: Check PATH
echo %PATH%
where susa

If not in PATH, add manually:
setx PATH "%PATH%;C:\Program Files\SUSA\cli"
```

**Problem**: "VCRUNTIME140.dll missing"
```
Solution: Install Visual C++ Redistributable
https://aka.ms/vs/17/release/vc_redist.x64.exe
```

### Uninstall Issues

**Problem**: Uninstaller leaves files
```
Solution: Close all SUSA processes
taskkill /f /im susa.exe
Then run uninstaller again
```

**Problem**: Can't remove from PATH
```
Solution: Remove manually
System Properties → Environment Variables → Path
Remove: C:\Program Files\SUSA\cli
```

## 📝 Version Management

### Updating Version

1. Edit `susa-cli-installer.nsi`:
   ```nsis
   !define PRODUCT_VERSION "1.1.0"
   VIProductVersion "1.1.0.0"
   ```

2. Rebuild installer:
   ```cmd
   build-local.bat
   ```

3. Test upgrade:
   ```cmd
   REM Install old version
   SUSA-CLI-Setup-1.0.0.exe
   
   REM Install new version
   SUSA-CLI-Setup-1.1.0.exe
   
   REM Should prompt for upgrade
   ```

### Version Numbering

Format: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes
- **MINOR**: New features
- **PATCH**: Bug fixes

Example: `1.2.3`

## 🚀 Distribution

### GitHub Releases

1. **Create Tag**
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0"
   git push origin v1.0.0
   ```

2. **Automatic Build**
   - GitHub Actions builds installer
   - Creates release automatically
   - Uploads `SUSA-CLI-Setup.exe`

3. **Download Link**
   ```
   https://github.com/user/repo/releases/latest/download/SUSA-CLI-Setup.exe
   ```

### Direct Download

Host on:
- **GitHub Releases** (recommended)
- **Dropbox** with `?dl=1`
- **Google Drive** (public link)
- **Your website**

### Update Website

Update download link in `Download.tsx`:

```typescript
const DOWNLOAD_LINKS = {
  cli: {
    windows: "https://github.com/user/repo/releases/latest/download/SUSA-CLI-Setup.exe",
    // ...
  }
};
```

## 📚 Advanced Topics

### Custom Install Directory

Users can change via:
1. Wizard: Browse button on directory page
2. Silent: `/D=C:\Custom\Path` parameter

### Multi-User vs Single-User

Current: **Multi-user** (all users)
- Installs to `Program Files`
- Requires admin rights
- Modifies system PATH

To make single-user:
```nsis
InstallDir "$LOCALAPPDATA\SUSA\cli"
RequestExecutionLevel user
```

### Portable Version

To create portable (no install):
1. Just distribute `susa.exe`
2. No installer needed
3. Users add to PATH manually

### Custom Actions

Add to installer:

```nsis
Section "Install Examples"
  SetOutPath "$INSTDIR\examples"
  File /r "examples\*.susa"
SectionEnd
```

### Localization

Add languages:

```nsis
!insertmacro MUI_LANGUAGE "English"
!insertmacro MUI_LANGUAGE "Spanish"
!insertmacro MUI_LANGUAGE "French"

LangString WelcomeText ${LANG_ENGLISH} "Welcome to SUSA CLI Setup"
LangString WelcomeText ${LANG_SPANISH} "Bienvenido a la instalación de SUSA CLI"
```

## 📞 Support

### Documentation
- [NSIS Documentation](https://nsis.sourceforge.io/Docs/)
- [Modern UI 2 Guide](https://nsis.sourceforge.io/Docs/Modern%20UI%202/Readme.html)
- [NSIS Examples](https://nsis.sourceforge.io/Category:Code_Examples)

### SUSA Support
- **GitHub**: https://github.com/saketh-nandu/susa
- **Issues**: https://github.com/saketh-nandu/susa/issues
- **Email**: mantolsaketh@gmail.com
- **Website**: https://susa-programming-language.web.app

---

**Professional CLI installer for the SUSA Programming Language** 🚀
