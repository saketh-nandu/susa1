# 🚀 SUSA Installer Build Guide

Complete guide for building professional installers for all platforms using GitHub Actions.

---

## 📦 What Gets Built

### Windows Installer (.exe)
- **Tool**: NSIS (Nullsoft Scriptable Install System)
- **Features**:
  - MIT License agreement page
  - Custom install location
  - Component selection (Core, Desktop Shortcuts)
  - Automatic PATH configuration
  - Desktop shortcuts
  - Start menu shortcuts
  - Proper uninstall wizard
  - Kills running SUSA processes before install/uninstall
  - Registry entries for Add/Remove Programs

### macOS Installer (.pkg)
- **Tool**: pkgbuild + productbuild
- **Features**:
  - Welcome page with branding
  - MIT License display
  - Automatic PATH configuration (bash/zsh)
  - Post-install scripts
  - Conclusion page with getting started guide
  - Kills running processes before install
  - Native macOS installer experience

### Linux Installer (.deb)
- **Tool**: dpkg-deb
- **Features**:
  - Debian package format
  - Automatic PATH configuration
  - Desktop entry file
  - Pre/post install scripts
  - Proper removal scripts
  - Kills running processes before install/uninstall
  - Copyright and license files

---

## 🔧 How to Use

### Method 1: Automatic Build on Tag

1. **Create a new tag**:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **GitHub Actions will automatically**:
   - Build all three installers
   - Create a GitHub Release
   - Upload installers as release assets

### Method 2: Manual Trigger

1. Go to **Actions** tab in GitHub
2. Select **Build SUSA Installers** workflow
3. Click **Run workflow**
4. Download artifacts from the workflow run

### Method 3: On Every Push

The workflow runs automatically on every push to `main` branch.

---

## 📁 File Structure

```
your-repo/
├── .github/
│   └── workflows/
│       └── build-installers.yml    # Main workflow file
├── cpp-core/
│   ├── susa.exe                    # Windows binary
│   ├── susa                        # macOS/Linux binary
│   ├── main.cpp                    # Source code
│   └── CMakeLists.txt              # Build configuration
├── LICENSE.txt                     # MIT License (auto-generated)
├── README.txt                      # Getting started (auto-generated)
└── INSTALLER-GUIDE.md              # This file
```

---

## 🎯 Installer Features

### Windows

**Installation Process**:
1. Welcome screen
2. MIT License agreement (checkbox)
3. Choose install location (default: C:\Program Files\SUSA)
4. Select components:
   - SUSA Core (required)
   - Desktop Shortcuts (optional)
5. Installation progress
6. Finish screen

**What Gets Installed**:
- `C:\Program Files\SUSA\susa.exe` - Compiler
- `C:\Program Files\SUSA\LICENSE.txt` - License
- `C:\Program Files\SUSA\README.txt` - Documentation
- Desktop shortcut (if selected)
- Start menu shortcuts
- PATH environment variable updated

**Uninstallation**:
- Kills all running SUSA processes
- Removes all files
- Removes PATH entry
- Removes shortcuts
- Removes registry entries
- Clean uninstall wizard

### macOS

**Installation Process**:
1. Welcome page with SUSA branding
2. MIT License display
3. Installation type (standard)
4. Installation progress
5. Conclusion page with getting started guide

**What Gets Installed**:
- `/usr/local/bin/susa` - Compiler
- PATH added to `.bash_profile` and `.zshrc`
- Permissions set correctly

**Uninstallation**:
```bash
sudo pkgutil --forget com.susa.pkg
sudo rm /usr/local/bin/susa
```

### Linux (Debian/Ubuntu)

**Installation**:
```bash
sudo dpkg -i susa-complete_1.0.0_amd64.deb
```

**What Gets Installed**:
- `/usr/local/bin/susa` - Compiler
- `/usr/bin/susa` - Symlink
- `/etc/profile.d/susa.sh` - PATH configuration
- `/usr/share/applications/susa.desktop` - Desktop entry
- `/usr/share/doc/susa/copyright` - License

**Uninstallation**:
```bash
sudo apt remove susa
```
or
```bash
sudo dpkg -r susa
```

---

## 🔐 Security Features

### Process Management

All installers include scripts to:
- Kill running SUSA processes before installation
- Kill running SUSA processes before uninstallation
- Prevent file-in-use errors
- Ensure clean installation/removal

**Windows**:
```batch
taskkill /F /IM susa.exe /T
```

**macOS/Linux**:
```bash
pkill -9 susa
```

### Permissions

- **Windows**: Requires administrator privileges
- **macOS**: Requires sudo for installation
- **Linux**: Requires sudo for dpkg

---

## 🎨 Branding

### Windows
- Uses default NSIS icons (can be customized)
- Product name: "SUSA Programming Language"
- Publisher: "SUSA Team"
- Website: https://susastudio.online

### macOS
- Custom welcome HTML with SUSA logo
- Branded conclusion page
- Professional installer appearance

### Linux
- Desktop entry with terminal icon
- Proper package metadata
- Copyright file with MIT license

---

## 📝 Customization

### Change Version

Edit the workflow file:
```yaml
env:
  SUSA_VERSION: "1.0.0"  # Change this
```

### Add Custom Icons (Windows)

1. Create `susa-logo.ico` file
2. Update NSIS script:
   ```nsis
   !define MUI_ICON "susa-logo.ico"
   !define MUI_UNICON "susa-logo.ico"
   ```

### Add More Components

Edit the NSIS script in the workflow:
```nsis
Section "SUSA IDE" SEC03
  File "susa-ide.exe"
  CreateShortCut "$DESKTOP\SUSA IDE.lnk" "$INSTDIR\susa-ide.exe"
SectionEnd
```

---

## 🧪 Testing

### Windows
1. Download the .exe installer
2. Run as administrator
3. Verify installation in `C:\Program Files\SUSA`
4. Open Command Prompt: `susa --version`
5. Test uninstall from Control Panel

### macOS
1. Download the .pkg installer
2. Run the installer
3. Open Terminal: `susa --version`
4. Check PATH: `echo $PATH`
5. Test uninstall: `sudo pkgutil --forget com.susa.pkg`

### Linux
1. Download the .deb package
2. Install: `sudo dpkg -i susa-complete_1.0.0_amd64.deb`
3. Verify: `susa --version`
4. Check PATH: `echo $PATH`
5. Test uninstall: `sudo apt remove susa`

---

## 🐛 Troubleshooting

### Windows

**Issue**: "NSIS Error: Error launching installer"
- **Solution**: Re-download the installer, file may be corrupted

**Issue**: PATH not updated
- **Solution**: Restart Command Prompt or log out/in

**Issue**: "Access Denied"
- **Solution**: Run installer as administrator

### macOS

**Issue**: "Package is damaged"
- **Solution**: Right-click → Open, or allow in Security preferences

**Issue**: PATH not working
- **Solution**: Restart Terminal or run `source ~/.zshrc`

**Issue**: Permission denied
- **Solution**: Run with sudo: `sudo installer -pkg SUSA-Complete-1.0.0.pkg -target /`

### Linux

**Issue**: "dpkg: dependency problems"
- **Solution**: Run `sudo apt-get install -f`

**Issue**: Command not found
- **Solution**: Restart terminal or run `source /etc/profile.d/susa.sh`

**Issue**: Permission denied
- **Solution**: Use sudo for installation

---

## 📊 Build Matrix

| Platform | OS Version | Compiler | Installer Format | Size |
|----------|-----------|----------|------------------|------|
| Windows  | Latest    | MinGW GCC | NSIS (.exe)     | ~5MB |
| macOS    | Latest    | Clang     | PKG (.pkg)      | ~3MB |
| Linux    | Ubuntu    | GCC       | DEB (.deb)      | ~2MB |

---

## 🚀 Deployment

### GitHub Releases

When you push a tag (e.g., `v1.0.0`), the workflow automatically:

1. Builds all installers
2. Creates a GitHub Release
3. Uploads installers as assets
4. Generates release notes

### Manual Upload

Download artifacts from workflow run and upload to:
- GitHub Releases
- Your website
- Dropbox/Google Drive
- Package managers

---

## 📚 Additional Resources

- **NSIS Documentation**: https://nsis.sourceforge.io/Docs/
- **macOS Packaging**: https://developer.apple.com/library/archive/documentation/DeveloperTools/Reference/DistributionDefinitionRef/
- **Debian Packaging**: https://www.debian.org/doc/manuals/maint-guide/

---

## ✅ Checklist

Before releasing:

- [ ] Update version number in workflow
- [ ] Test on all platforms
- [ ] Verify PATH configuration works
- [ ] Test uninstall process
- [ ] Check desktop shortcuts (Windows)
- [ ] Verify license display
- [ ] Test with antivirus software
- [ ] Create release notes
- [ ] Tag the release
- [ ] Announce on website

---

## 📞 Support

For issues or questions:
- Website: https://susastudio.online
- GitHub Issues: https://github.com/your-repo/issues
- Email: team@susastudio.online

---

**Built with ❤️ by the SUSA Team**
