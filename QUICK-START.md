# SUSA Installer - Quick Start Guide

## Prerequisites

### Required Software
- Windows 10/11 (64-bit)
- Git
- Visual Studio 2022 (with C++ workload) OR MinGW-w64
- Node.js 20+ and npm
- NSIS 3.x

### Install Prerequisites

```powershell
# Using Chocolatey (recommended)
choco install git visualstudio2022buildtools nodejs nsis -y

# Or download manually:
# - Visual Studio: https://visualstudio.microsoft.com/downloads/
# - Node.js: https://nodejs.org/
# - NSIS: https://nsis.sourceforge.io/Download
```

## Step 1: Setup Project Structure

```bash
# Clone your repository
git clone https://github.com/yourusername/susa.git
cd susa

# Create required directories
mkdir -p installer/assets
mkdir -p cli/build
mkdir -p ide/dist
```

## Step 2: Create Placeholder Assets

Run this PowerShell script to create basic assets:

```powershell
# Create simple colored placeholders
$iconPath = "installer/assets/susa_icon.ico"
$headerPath = "installer/assets/susa_header.bmp"
$sidebarPath = "installer/assets/susa_sidebar.bmp"

# You can use ImageMagick or create manually
# For now, copy any .ico and .bmp files as placeholders
```

Or download free assets from:
- Icons: https://www.flaticon.com
- Images: https://www.canva.com

## Step 3: Build CLI

```bash
cd cpp-core
mkdir build
cd build

# Using Visual Studio
cmake .. -G "Visual Studio 17 2022" -A x64
cmake --build . --config Release

# OR using MinGW
cmake .. -G "MinGW Makefiles" -DCMAKE_BUILD_TYPE=Release
cmake --build .

cd ../..
```

Verify: `cpp-core/build/Release/cpp-core.exe` exists

## Step 4: Build IDE

```bash
cd ide

# Install dependencies
npm install

# Build Electron app
npm run build

cd ..
```

Verify: `ide/dist/win-unpacked/SUSA-IDE.exe` exists

## Step 5: Build Installer Locally

```bash
cd installer

# Run build script
build-local.bat

# Or manually
"C:\Program Files (x86)\NSIS\makensis.exe" susa-installer.nsi
```

Output: `dist/SUSA-Setup.exe`

## Step 6: Test Installer

```bash
# Run test script
cd installer
test-installer.bat

# Or test manually
cd ../dist
SUSA-Setup.exe
```

## Step 7: Setup GitHub Actions

1. Commit all files:
```bash
git add .
git commit -m "Add NSIS installer and CI/CD"
git push
```

2. GitHub Actions will automatically:
   - Build CLI
   - Build IDE
   - Create installer
   - Upload artifacts

3. Create a release:
```bash
git tag v1.0.0
git push origin v1.0.0
```

4. Download installer from GitHub Releases

## Common Issues

### Issue: NSIS not found
```bash
# Install NSIS
choco install nsis -y

# Or add to PATH manually
set PATH=%PATH%;C:\Program Files (x86)\NSIS
```

### Issue: CMake not found
```bash
# Install CMake
choco install cmake -y
```

### Issue: Node modules error
```bash
cd ide
rm -rf node_modules package-lock.json
npm install
```

### Issue: Assets not found
Create placeholder files in `installer/assets/`:
- susa_icon.ico (any .ico file)
- susa_header.bmp (150x57 pixels)
- susa_sidebar.bmp (164x314 pixels)

## Next Steps

1. Customize branding assets
2. Update license.txt
3. Configure code signing
4. Test on clean Windows VM
5. Create documentation
6. Announce release!

## File Checklist

Before building, ensure these exist:

- [ ] `cpp-core/CMakeLists.txt`
- [ ] `ide/package.json`
- [ ] `installer/susa-installer.nsi`
- [ ] `installer/license.txt`
- [ ] `installer/assets/susa_icon.ico`
- [ ] `installer/assets/susa_header.bmp`
- [ ] `installer/assets/susa_sidebar.bmp`
- [ ] `.github/workflows/build-installer.yml`

## Testing Checklist

- [ ] CLI builds successfully
- [ ] IDE builds successfully
- [ ] Installer creates without errors
- [ ] Silent install works: `SUSA-Setup.exe /S`
- [ ] CLI accessible from command line (if PATH selected)
- [ ] IDE launches from Start Menu
- [ ] Desktop shortcut works (if selected)
- [ ] Uninstaller removes everything
- [ ] No processes left running after uninstall

## Support

- Documentation: `INSTALLER-DOCUMENTATION.md`
- Issues: https://github.com/yourusername/susa/issues
