# SUSA CLI Professional Installer

Professional Windows installer for SUSA CLI compiler - built with NSIS Modern UI 2.

## 📦 What's Included

- SUSA CLI Compiler (`susa.exe`)
- Command-line interpreter
- System PATH integration
- Start Menu shortcuts
- Professional wizard-style installer
- Automatic upgrade handling
- Clean uninstallation

## 🎯 Installer Features

### Wizard Flow
1. **Welcome Page** - SUSA branded introduction
2. **License Agreement** - MIT License acceptance
3. **Installation Location** - Choose install directory
4. **Installation Options** - Configure PATH and shortcuts
5. **Installation Progress** - Real-time installation status
6. **Finish Page** - Launch CLI or visit website

### Installation Options
- ✅ Add SUSA to system PATH (recommended)
- ✅ Create Start Menu shortcut
- ✅ Launch CLI terminal after installation

### Professional Features
- Modern UI 2 with SUSA branding
- Custom installer icon and graphics
- Upgrade detection and handling
- Silent install support (`/S`)
- Admin privilege request
- Process termination before uninstall
- Safe PATH modification
- Registry integration
- Windows Search integration

## 🚀 Building the Installer

### Prerequisites
- Windows 10/11
- NSIS 3.x installed
- SUSA CLI built (`susa.exe`)

### Manual Build

```cmd
cd installer-cli

REM Ensure susa.exe is in dist/cli/
mkdir dist\cli
copy ..\cpp-core\build\susa.exe dist\cli\

REM Build installer
"C:\Program Files (x86)\NSIS\makensis.exe" susa-cli-installer.nsi
```

### Automated Build (GitHub Actions)

The installer builds automatically on push:

```bash
git add .
git commit -m "Update CLI installer"
git push
```

Download from: **Actions → Build SUSA CLI Installer → Artifacts**

## 📁 Directory Structure

```
installer-cli/
├── susa-cli-installer.nsi    # Main NSIS script
├── license.txt                # MIT License
├── assets/
│   ├── susa.ico              # Installer icon
│   ├── susa-header.bmp       # Header image (150x57)
│   └── susa-sidebar.bmp      # Sidebar image (164x314)
├── dist/
│   └── cli/
│       └── susa.exe          # CLI executable
└── SUSA-CLI-Setup.exe        # Output installer
```

## 🎨 Branding Assets

### Required Images

| Asset | Size | Format | Purpose |
|-------|------|--------|---------|
| `susa.ico` | 16x16, 32x32, 48x48 | ICO | Installer icon |
| `susa-header.bmp` | 150x57 | BMP | Wizard header |
| `susa-sidebar.bmp` | 164x314 | BMP | Welcome/Finish sidebar |

### Customization

Edit `susa-cli-installer.nsi`:

```nsis
!define PRODUCT_NAME "SUSA CLI"
!define PRODUCT_VERSION "1.0.0"
!define PRODUCT_PUBLISHER "SUSA Programming Language"
!define PRODUCT_WEB_SITE "https://susa-programming-language.web.app"
```

## 💻 Installation Behavior

### Default Installation
- **Location**: `C:\Program Files\SUSA\cli\`
- **Executable**: `susa.exe`
- **Uninstaller**: `Uninstall.exe`

### System Integration
- Adds to system PATH (optional)
- Creates Start Menu folder: `SUSA`
- Registers in Programs & Features
- Creates App Paths registry key
- Enables Windows Search integration

### Registry Keys
```
HKLM\Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA CLI
HKLM\Software\Microsoft\Windows\CurrentVersion\App Paths\susa.exe
```

## 🔧 Silent Installation

### Silent Install
```cmd
SUSA-CLI-Setup.exe /S
```

### Silent Install with Options
```cmd
REM Install to custom directory
SUSA-CLI-Setup.exe /S /D=C:\MyApps\SUSA

REM The installer will:
REM - Install silently
REM - Add to PATH (default)
REM - Create Start Menu shortcuts (default)
```

### Silent Uninstall
```cmd
"C:\Program Files\SUSA\cli\Uninstall.exe" /S
```

## 🔄 Upgrade Handling

The installer automatically:
1. Detects existing installations
2. Prompts user to upgrade
3. Runs silent uninstall of old version
4. Installs new version
5. Preserves user settings

## 🗑️ Uninstallation

### Via Control Panel
1. Open Settings → Apps
2. Find "SUSA CLI"
3. Click Uninstall

### Via Start Menu
1. Open Start Menu
2. Navigate to SUSA folder
3. Click "Uninstall SUSA CLI"

### What Gets Removed
- ✅ All installed files
- ✅ System PATH entry
- ✅ Start Menu shortcuts
- ✅ Registry entries
- ✅ Uninstaller itself

### Process Termination
Before uninstall, the installer automatically terminates:
- `susa.exe`
- `cpp-core.exe`

## 📊 Installer Size

| Component | Size |
|-----------|------|
| SUSA CLI | ~2 MB |
| Installer overhead | ~500 KB |
| **Total** | **~2.5 MB** |

## 🧪 Testing Checklist

Before release, test:

- [ ] Fresh installation
- [ ] Upgrade from previous version
- [ ] PATH integration works
- [ ] Start Menu shortcuts work
- [ ] CLI launches correctly
- [ ] `susa --version` works from any directory
- [ ] Uninstallation removes everything
- [ ] Silent install works
- [ ] Silent uninstall works
- [ ] Installer runs on Windows 10
- [ ] Installer runs on Windows 11

## 🔐 Code Signing (Optional)

To sign the installer:

```cmd
signtool sign /f certificate.pfx /p password /t http://timestamp.digicert.com SUSA-CLI-Setup.exe
```

Add to NSIS script:
```nsis
!finalize 'signtool sign /f certificate.pfx /p password /t http://timestamp.digicert.com "%1"'
```

## 📝 Version Management

Update version in `susa-cli-installer.nsi`:

```nsis
!define PRODUCT_VERSION "1.0.0"

VIProductVersion "1.0.0.0"
```

## 🐛 Troubleshooting

### Installer won't build
- Check NSIS is installed: `makensis /VERSION`
- Verify `susa.exe` exists in `dist/cli/`
- Check all asset files exist

### PATH not working after install
- Restart command prompt
- Check: `echo %PATH%`
- Verify: `where susa`

### Uninstaller leaves files
- Check if processes are running
- Run as Administrator
- Manually delete: `C:\Program Files\SUSA\cli\`

## 📚 Resources

- [NSIS Documentation](https://nsis.sourceforge.io/Docs/)
- [Modern UI 2 Guide](https://nsis.sourceforge.io/Docs/Modern%20UI%202/Readme.html)
- [NSIS Examples](https://nsis.sourceforge.io/Category:Code_Examples)

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/saketh-nandu/susa/issues)
- **Email**: mantolsaketh@gmail.com
- **Website**: https://susa-programming-language.web.app

---

**Built with ❤️ for the SUSA Programming Language**
