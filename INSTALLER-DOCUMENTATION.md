# SUSA Programming Language - Professional Windows Installer

## Complete Production-Ready Setup

This documentation covers the complete NSIS installer and GitHub Actions CI/CD workflow for SUSA.

## Directory Structure

```
project-root/
├── .github/
│   └── workflows/
│       └── build-installer.yml          # CI/CD workflow
├── cli/
│   ├── src/                             # C++ source files
│   ├── CMakeLists.txt                   # CMake configuration
│   └── build/                           # Build output (generated)
│       └── cpp-core.exe
├── ide/
│   ├── package.json                     # Electron app config
│   ├── src/                             # React source
│   └── dist/                            # Build output (generated)
│       └── win-unpacked/
│           └── SUSA-IDE.exe
├── installer/
│   ├── susa-installer.nsi               # Main NSIS script
│   ├── license.txt                      # License agreement
│   └── assets/
│       ├── susa_icon.ico                # Installer icon
│       ├── susa_header.bmp              # Header image (150x57)
│       └── susa_sidebar.bmp             # Sidebar image (164x314)
└── dist/
    └── SUSA-Setup.exe                   # Final installer (generated)
```

## Features Implemented

### Installer Features
- Modern UI 2 with custom branding
- Welcome page with custom logo and sidebar
- License agreement page
- Installation directory selection
- Component selection (CLI, IDE, PATH, Desktop shortcut)
- Progress page with detailed logging
- Finish page with launch options
- Complete uninstaller with process termination
- PATH environment variable management
- Registry integration
- Silent install support (/S flag)
- Admin privilege enforcement

### CI/CD Features
- Automated C++ CLI build using MSVC
- Automated Electron IDE build
- NSIS installer generation
- Artifact management
- GitHub Release creation on tags
- SHA256 checksum generation
- Automated testing of installer
- Multi-stage build pipeline

## Build Commands

### Local Development

#### Build CLI manually:
```bash
cd cpp-core
mkdir build
cd build
cmake .. -G "Visual Studio 17 2022" -A x64
cmake --build . --config Release
```

#### Build IDE manually:
```bash
cd ide
npm install
npm run build
```

#### Build installer manually:
```bash
"C:\Program Files (x86)\NSIS\makensis.exe" installer/susa-installer.nsi
```

### GitHub Actions

Push to trigger build:
```bash
git add .
git commit -m "Build installer"
git push
```

Create release:
```bash
git tag v1.0.0
git push origin v1.0.0
```

## Installation Behavior

### User Selections

1. **SUSA CLI Compiler** (Required)
   - Installs to: `C:\Program Files\SUSA\cli\cpp-core.exe`
   - Creates registry entry

2. **SUSA IDE** (Required)
   - Installs to: `C:\Program Files\SUSA\ide\`
   - Creates Start Menu shortcuts

3. **Add CLI to PATH** (Optional)
   - Adds `C:\Program Files\SUSA\cli` to system PATH
   - Broadcasts environment change
   - Allows `cpp-core` command from any terminal

4. **Create Desktop Shortcut** (Optional)
   - Creates `SUSA IDE.lnk` on desktop

### Registry Entries

```
HKLM\Software\Microsoft\Windows\CurrentVersion\App Paths\cpp-core.exe
HKLM\Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA Programming Language
```

### Start Menu Structure

```
Start Menu\Programs\SUSA\
├── SUSA IDE.lnk
├── SUSA CLI.lnk
└── Uninstall SUSA.lnk
```

## Uninstallation Process

### Automatic Steps

1. **Kill Running Processes**
   ```
   taskkill /F /IM cpp-core.exe /T
   taskkill /F /IM SUSA-IDE.exe /T
   ```

2. **Remove PATH Entry**
   - Safely removes `C:\Program Files\SUSA\cli` from PATH
   - Broadcasts environment change

3. **Delete Files**
   - Removes all installed files
   - Removes installation directory

4. **Clean Shortcuts**
   - Removes desktop shortcut
   - Removes Start Menu folder

5. **Clean Registry**
   - Removes all SUSA registry entries
   - Removes from Programs and Features

## Silent Installation

### Install silently:
```cmd
SUSA-Setup.exe /S
```

### Install with custom directory:
```cmd
SUSA-Setup.exe /S /D=C:\CustomPath\SUSA
```

### Uninstall silently:
```cmd
"C:\Program Files\SUSA\uninst.exe" /S
```

## Branding Customization

### Required Assets

Create these images in `installer/assets/`:

1. **susa_icon.ico** (256x256)
   - Installer icon
   - Shown in Programs and Features

2. **susa_header.bmp** (150x57 pixels, 24-bit)
   - Header image on installer pages
   - Use your logo with transparent/white background

3. **susa_sidebar.bmp** (164x314 pixels, 24-bit)
   - Sidebar on Welcome and Finish pages
   - Vertical banner design

### Creating Placeholder Assets

```powershell
# Create placeholder icon (requires ImageMagick)
magick -size 256x256 xc:blue -fill white -pointsize 72 -gravity center -annotate +0+0 "SUSA" installer/assets/susa_icon.ico

# Create placeholder header
magick -size 150x57 xc:lightblue -fill darkblue -pointsize 20 -gravity center -annotate +0+0 "SUSA" installer/assets/susa_header.bmp

# Create placeholder sidebar
magick -size 164x314 gradient:blue-lightblue -fill white -pointsize 36 -gravity center -annotate +0+0 "SUSA" installer/assets/susa_sidebar.bmp
```

## Version Upgrade Handling

The installer automatically detects previous installations:

1. Prompts user to uninstall old version
2. Runs uninstaller silently
3. Proceeds with new installation
4. Preserves user settings if needed

## Code Signing (Optional)

Add to NSIS script after `OutFile`:

```nsis
!finalize 'signtool sign /f "cert.pfx" /p "password" /t http://timestamp.digicert.com "%1"'
```

Or sign after build:

```cmd
signtool sign /f cert.pfx /p password /t http://timestamp.digicert.com dist/SUSA-Setup.exe
```

## Testing Checklist

- [ ] Fresh install on clean Windows 10/11
- [ ] Upgrade from previous version
- [ ] Silent install: `SUSA-Setup.exe /S`
- [ ] Custom directory install
- [ ] PATH addition works
- [ ] Desktop shortcut created
- [ ] Start Menu shortcuts work
- [ ] CLI runs from command line
- [ ] IDE launches successfully
- [ ] Uninstall removes all files
- [ ] Uninstall removes PATH entry
- [ ] Uninstall kills running processes
- [ ] Appears correctly in Programs and Features

## Troubleshooting

### Build fails in GitHub Actions

Check:
- CMakeLists.txt exists in cpp-core/
- package.json exists in ide/
- All dependencies are specified

### Installer creation fails

Check:
- NSIS is installed
- All paths in .nsi file are correct
- Assets exist in installer/assets/

### PATH not added

- Requires admin privileges
- Check Windows environment variables manually
- Restart terminal after installation

### Processes not killed during uninstall

- Uninstaller requires admin privileges
- Manually close SUSA processes before uninstalling

## Advanced Customization

### Add more components:

```nsis
Section "Documentation" SecDocs
  SetOutPath "$INSTDIR\docs"
  File /r "..\docs\*.*"
SectionEnd
```

### Add file associations:

```nsis
WriteRegStr HKCR ".susa" "" "SUSAFile"
WriteRegStr HKCR "SUSAFile\shell\open\command" "" '"$INSTDIR\ide\SUSA-IDE.exe" "%1"'
```

### Custom finish page actions:

```nsis
!define MUI_FINISHPAGE_RUN_FUNCTION CustomFinishAction

Function CustomFinishAction
  ExecShell "open" "https://susa-lang.org/getting-started"
FunctionEnd
```

## Production Deployment

1. Update version in:
   - `installer/susa-installer.nsi` (PRODUCT_VERSION)
   - `.github/workflows/build-installer.yml` (PRODUCT_VERSION)
   - `ide/package.json` (version)

2. Create and push tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

3. GitHub Actions will:
   - Build CLI and IDE
   - Create installer
   - Upload to GitHub Releases

4. Download from Releases page

## Support

For issues or questions:
- GitHub Issues: https://github.com/yourusername/susa/issues
- Documentation: https://susa-lang.org/docs
