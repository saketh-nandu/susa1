# SUSA Installer Directory

## 📁 Contents

```
installer/
├── susa-installer.nsi               # Main NSIS installer script
├── license.txt                      # License agreement text
├── build-local.bat                  # Local build script
├── test-installer.bat               # Automated test script
├── create-placeholder-assets.ps1    # Asset generator script
├── README.md                        # This file
├── .gitignore                       # Git ignore rules
└── assets/                          # Branding assets
    ├── susa_icon.ico                # Installer icon (256x256)
    ├── susa_header.bmp              # Header image (150x57)
    └── susa_sidebar.bmp             # Sidebar image (164x314)
```

## 🚀 Quick Start

### 1. Create Assets (First Time Only)

Run the PowerShell script to create placeholder assets:

```powershell
.\create-placeholder-assets.ps1
```

Or manually create professional assets (see Asset Requirements below).

### 2. Build Installer Locally

```cmd
build-local.bat
```

This will:
- Check prerequisites (NSIS, CLI, IDE)
- Build the installer
- Generate SHA256 checksum
- Output to `../dist/SUSA-Setup.exe`

### 3. Test Installer

```cmd
test-installer.bat
```

This will:
- Install SUSA silently
- Verify installation
- Test CLI execution
- Uninstall SUSA

## 📋 Asset Requirements

### Required Files in `assets/` Directory

#### 1. susa_icon.ico
- **Size:** 256x256 pixels (can include multiple sizes)
- **Format:** ICO
- **Purpose:** Installer icon and Programs & Features icon
- **Design:** Your SUSA logo on transparent background

#### 2. susa_header.bmp
- **Size:** 150x57 pixels
- **Format:** 24-bit BMP (no alpha channel)
- **Purpose:** Header image on installer pages
- **Design:** Horizontal banner with logo/text

#### 3. susa_sidebar.bmp
- **Size:** 164x314 pixels
- **Format:** 24-bit BMP (no alpha channel)
- **Purpose:** Sidebar on Welcome and Finish pages
- **Design:** Vertical banner with branding

## 🎨 Creating Professional Assets

### Option 1: Using PowerShell Script (Quick)

```powershell
.\create-placeholder-assets.ps1
```

Creates basic colored placeholders for testing.

### Option 2: Using ImageMagick (Better)

```powershell
# Install ImageMagick
choco install imagemagick -y

# Create icon
magick -size 256x256 xc:blue -fill white -pointsize 72 -gravity center -annotate +0+0 "SUSA" assets/susa_icon.ico

# Create header
magick -size 150x57 xc:lightblue -fill darkblue -pointsize 20 -gravity center -annotate +0+0 "SUSA" assets/susa_header.bmp

# Create sidebar
magick -size 164x314 gradient:blue-lightblue -fill white -pointsize 36 -gravity center -annotate +0+0 "SUSA" assets/susa_sidebar.bmp
```

### Option 3: Using Design Tools (Professional)

1. **Create designs:**
   - Canva: https://www.canva.com
   - Photopea: https://www.photopea.com
   - Figma: https://www.figma.com

2. **Export as PNG** (high resolution)

3. **Convert to required formats:**
   - ICO: https://convertio.co/png-ico/
   - BMP: https://convertio.co/png-bmp/

### Design Guidelines

- Use your brand colors consistently
- Keep text readable on both light and dark backgrounds
- Test on Windows 10 and 11
- Sidebar should be vertically oriented
- Header should be horizontally oriented
- Avoid gradients in BMP files (can cause banding)
- Use high contrast for better visibility

## 🔧 Customization

### Modify Installer Script

Edit `susa-installer.nsi` to customize:

```nsis
; Product information
!define PRODUCT_NAME "SUSA Programming Language"
!define PRODUCT_VERSION "1.0.0"
!define PRODUCT_PUBLISHER "SUSA Development Team"
!define PRODUCT_WEB_SITE "https://github.com/yourusername/susa"

; Installation directory
InstallDir "$PROGRAMFILES64\SUSA"

; Branding
BrandingText "${PRODUCT_NAME} Installer"
```

### Modify License

Edit `license.txt` with your license terms.

### Add Components

Add new sections to `susa-installer.nsi`:

```nsis
Section "Documentation" SecDocs
  SetOutPath "$INSTDIR\docs"
  File /r "..\docs\*.*"
SectionEnd
```

## 📦 Build Requirements

### Prerequisites

- **NSIS 3.x:** Install from https://nsis.sourceforge.io/
  ```cmd
  choco install nsis -y
  ```

- **Built CLI:** `../cpp-core/build/Release/cpp-core.exe`
- **Built IDE:** `../ide/dist/win-unpacked/SUSA-IDE.exe`

### Build Process

1. **Manual build:**
   ```cmd
   "C:\Program Files (x86)\NSIS\makensis.exe" susa-installer.nsi
   ```

2. **Using script:**
   ```cmd
   build-local.bat
   ```

3. **Output:**
   - `../dist/SUSA-Setup.exe`
   - `../dist/SUSA-Setup.exe.sha256`

## 🧪 Testing

### Automated Testing

```cmd
test-installer.bat
```

### Manual Testing Checklist

- [ ] Install on clean Windows 10
- [ ] Install on clean Windows 11
- [ ] Silent install: `SUSA-Setup.exe /S`
- [ ] Custom directory: `SUSA-Setup.exe /D=C:\Custom`
- [ ] Verify CLI in PATH (if selected)
- [ ] Verify desktop shortcut (if selected)
- [ ] Launch IDE from Start Menu
- [ ] Run CLI from command line
- [ ] Uninstall from Control Panel
- [ ] Verify all files removed
- [ ] Verify PATH cleaned
- [ ] Verify registry cleaned

## 🐛 Troubleshooting

### Error: NSIS not found

```cmd
choco install nsis -y
# Or add to PATH manually
set PATH=%PATH%;C:\Program Files (x86)\NSIS
```

### Error: CLI not built

```cmd
cd ../cpp-core
mkdir build && cd build
cmake .. -G "Visual Studio 17 2022" -A x64
cmake --build . --config Release
```

### Error: IDE not built

```cmd
cd ../ide
npm install
npm run build
```

### Error: Assets not found

```powershell
cd installer
.\create-placeholder-assets.ps1
```

## 📚 Documentation

- **Complete Guide:** `../INSTALLER-DOCUMENTATION.md`
- **Quick Start:** `../QUICK-START.md`
- **Project Structure:** `../PROJECT-STRUCTURE.md`
- **Package Overview:** `../INSTALLER-COMPLETE-PACKAGE.md`

## 🚀 CI/CD

GitHub Actions automatically builds the installer on:
- Push to main/develop
- Pull requests
- Tag creation (creates release)

See `.github/workflows/build-installer.yml` for details.

## 📝 Notes

- Installer requires admin privileges
- Supports Windows 10/11 (64-bit)
- Silent install flag: `/S`
- Custom directory flag: `/D=path`
- Uninstaller: `C:\Program Files\SUSA\uninst.exe`

---

**Ready to build a professional Windows installer for SUSA!**
