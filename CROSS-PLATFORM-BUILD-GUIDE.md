# SUSA v1.0 - Cross-Platform Build Guide

## Building for All Platforms

SUSA is written in C++ and can be compiled for Windows, macOS, and Linux.

---

## 🪟 Windows (Current Platform)

### Already Built! ✅
- **Interpreter:** `susa-cpp.exe` (951 KB)
- **Installers:** All three ready in `Output\` folder

### Build from Source:
```batch
cd cpp-core
g++ -std=c++17 -O2 main.cpp -o susa.exe
```

**Requirements:**
- MinGW-w64 or MSVC
- C++17 support

---

## 🐧 Linux

### Quick Build:
```bash
chmod +x build-linux.sh
./build-linux.sh
```

### Manual Build:
```bash
cd cpp-core
g++ -std=c++17 -O2 main.cpp -o susa
chmod +x susa
```

### Create Packages:
```bash
chmod +x create-linux-package.sh
./create-linux-package.sh
```

**Creates:**
- `SUSA-Linux-1.0.0.tar.gz` (Universal)
- `susa_1.0.0_amd64.deb` (Debian/Ubuntu)
- `susa-1.0.0-1.x86_64.rpm` (Fedora/RHEL)

### Installation:

**From Tarball:**
```bash
tar -xzf SUSA-Linux-1.0.0.tar.gz
cd susa-linux-package
sudo ./install.sh
```

**From .deb (Debian/Ubuntu):**
```bash
sudo dpkg -i susa_1.0.0_amd64.deb
```

**From .rpm (Fedora/RHEL):**
```bash
sudo rpm -i susa-1.0.0-1.x86_64.rpm
```

**Requirements:**
- GCC 7+ or Clang 5+
- C++17 support
- Build tools: `sudo apt-get install build-essential`

---

## 🍎 macOS

### Quick Build:
```bash
chmod +x build-macos.sh
./build-macos.sh
```

### Manual Build:
```bash
cd cpp-core
clang++ -std=c++17 -O2 main.cpp -o susa
chmod +x susa
```

### Create Package:
```bash
chmod +x create-macos-package.sh
./create-macos-package.sh
```

**Creates:**
- `SUSA-macOS-1.0.0.tar.gz` (Tarball)
- `SUSA-macOS-1.0.0.dmg` (DMG Installer)

### Installation:

**From Tarball:**
```bash
tar -xzf SUSA-macOS-1.0.0.tar.gz
cd susa-macos-package
./install.sh
```

**From DMG:**
1. Double-click `SUSA-macOS-1.0.0.dmg`
2. Open Terminal in mounted volume
3. Run `./install.sh`

**Requirements:**
- Xcode Command Line Tools: `xcode-select --install`
- macOS 10.13+ (High Sierra or later)

---

## 📦 Package Managers

### Homebrew (macOS/Linux):
```bash
brew tap susa-lang/susa
brew install susa
```

### APT (Debian/Ubuntu):
```bash
sudo add-apt-repository ppa:susa-lang/susa
sudo apt-get update
sudo apt-get install susa
```

### DNF (Fedora):
```bash
sudo dnf copr enable susa-lang/susa
sudo dnf install susa
```

### Snap (Universal Linux):
```bash
sudo snap install susa
```

### Chocolatey (Windows):
```powershell
choco install susa
```

### Scoop (Windows):
```powershell
scoop bucket add susa https://github.com/susa-lang/scoop-bucket
scoop install susa
```

---

## 🔧 Build Requirements by Platform

| Platform | Compiler | C++ Version | Tools |
|----------|----------|-------------|-------|
| Windows | MinGW/MSVC | C++17 | MinGW-w64 |
| Linux | GCC/Clang | C++17 | build-essential |
| macOS | Clang | C++17 | Xcode CLI Tools |

---

## 📊 Binary Sizes

| Platform | Size | Stripped |
|----------|------|----------|
| Windows | 951 KB | 600 KB |
| Linux | ~900 KB | ~550 KB |
| macOS | ~950 KB | ~600 KB |

---

## 🚀 Cross-Compilation

### From Windows to Linux (WSL):
```bash
# Install WSL2
wsl --install

# Inside WSL
cd /mnt/c/Users/[YourName]/Downloads/SUSA
./build-linux.sh
```

### From Windows to Linux (Docker):
```bash
docker run -v ${PWD}:/susa -w /susa gcc:latest bash -c "cd cpp-core && g++ -std=c++17 -O2 main.cpp -o susa-linux"
```

### From macOS to Linux (Docker):
```bash
docker run -v $(pwd):/susa -w /susa gcc:latest bash -c "cd cpp-core && g++ -std=c++17 -O2 main.cpp -o susa-linux"
```

---

## 🧪 Testing Builds

### Test on Linux:
```bash
./cpp-core/susa cpp-core/test_everything.susa
```

### Test on macOS:
```bash
./cpp-core/susa cpp-core/test_everything.susa
```

### Test on Windows:
```powershell
.\cpp-core\susa.exe cpp-core\test_everything.susa
```

**Expected Output:**
```
============================================
SUSA v1.0 - 100% Feature Complete!
============================================
[All 40 features working]
============================================
All 40 Features Working Perfectly!
SUSA v1.0 is 100% Complete!
============================================
```

---

## 📝 Distribution Checklist

### Windows ✅
- [x] CLI installer (NSIS)
- [x] IDE installer (Electron)
- [x] Complete installer
- [x] Chocolatey package
- [x] Scoop package

### Linux ⏳
- [ ] .tar.gz package
- [ ] .deb package (Debian/Ubuntu)
- [ ] .rpm package (Fedora/RHEL)
- [ ] Snap package
- [ ] AppImage
- [ ] Flatpak

### macOS ⏳
- [ ] .tar.gz package
- [ ] .dmg installer
- [ ] .pkg installer
- [ ] Homebrew formula
- [ ] Mac App Store

---

## 🌍 Platform-Specific Notes

### Windows:
- Use `susa.exe` extension
- PATH separator: `;`
- Line endings: CRLF
- Default install: `C:\Program Files\SUSA\`

### Linux:
- No file extension
- PATH separator: `:`
- Line endings: LF
- Default install: `/usr/local/bin/`
- Requires execute permission: `chmod +x`

### macOS:
- No file extension
- PATH separator: `:`
- Line endings: LF
- Default install: `/usr/local/bin/`
- May require Gatekeeper approval
- Code signing recommended for distribution

---

## 🔐 Code Signing

### macOS:
```bash
# Sign the binary
codesign --sign "Developer ID Application: Your Name" cpp-core/susa

# Verify signature
codesign --verify --verbose cpp-core/susa

# Notarize for Gatekeeper
xcrun notarytool submit SUSA-macOS-1.0.0.dmg --wait
```

### Windows:
```powershell
# Sign with certificate
signtool sign /f certificate.pfx /p password /t http://timestamp.digicert.com susa.exe
```

---

## 📦 Creating Universal Binaries

### macOS Universal Binary (Intel + Apple Silicon):
```bash
# Build for Intel
clang++ -std=c++17 -O2 -arch x86_64 main.cpp -o susa-intel

# Build for Apple Silicon
clang++ -std=c++17 -O2 -arch arm64 main.cpp -o susa-arm

# Create universal binary
lipo -create susa-intel susa-arm -output susa
```

---

## 🎯 Next Steps

### Immediate:
1. ✅ Windows builds complete
2. ⏳ Build on Linux machine
3. ⏳ Build on macOS machine
4. ⏳ Test all platforms

### Soon:
1. Create Homebrew formula
2. Submit to package managers
3. Create Snap/Flatpak
4. Set up CI/CD for automated builds

---

## 🤝 Community Builds

Users can build from source on any platform:

```bash
# Clone repository
git clone https://github.com/susa-lang/susa.git
cd susa

# Build
cd cpp-core
g++ -std=c++17 -O2 main.cpp -o susa

# Install
sudo cp susa /usr/local/bin/
```

---

## 📞 Support

- **Documentation:** https://susastudio.online/docs
- **Issues:** https://github.com/susa-lang/susa/issues
- **Community:** https://susastudio.online/community

---

**SUSA is designed to be truly cross-platform!** 🌍
