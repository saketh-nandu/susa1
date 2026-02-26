# SUSA v1.0 - Package Manager Setup Guide

## Setting Up SUSA on Package Managers

This guide shows how to publish SUSA to various package managers for easy installation.

---

## 🍺 Homebrew (macOS/Linux)

### 1. Create Tap Repository

```bash
# Create a new GitHub repository: homebrew-susa
# URL: https://github.com/susa-lang/homebrew-susa
```

### 2. Add Formula

```bash
# Clone the tap repository
git clone https://github.com/susa-lang/homebrew-susa.git
cd homebrew-susa

# Create Formula directory
mkdir -p Formula

# Copy the formula
cp /path/to/susa.rb Formula/susa.rb

# Commit and push
git add Formula/susa.rb
git commit -m "Add SUSA formula"
git push
```

### 3. Calculate SHA256

```bash
# For the source tarball
shasum -a 256 SUSA-v1.0.0.tar.gz

# Update susa.rb with the actual SHA256
```

### 4. Test Installation

```bash
# Install from tap
brew tap susa-lang/susa
brew install susa

# Test
susa --version
```

### 5. Users Install With:

```bash
brew tap susa-lang/susa
brew install susa
```

---

## 📦 Debian/Ubuntu (APT)

### 1. Create PPA

```bash
# On Launchpad.net
# Create account
# Create PPA: ppa:susa-lang/susa
```

### 2. Build .deb Package

```bash
# On Ubuntu machine
./build-linux.sh
./create-linux-package.sh

# This creates: susa_1.0.0_amd64.deb
```

### 3. Upload to PPA

```bash
# Install packaging tools
sudo apt-get install devscripts dput

# Create source package
cd susa-deb
debuild -S -sa

# Upload to PPA
dput ppa:susa-lang/susa ../susa_1.0.0_source.changes
```

### 4. Users Install With:

```bash
sudo add-apt-repository ppa:susa-lang/susa
sudo apt-get update
sudo apt-get install susa
```

---

## 🎩 Fedora/RHEL (DNF/YUM)

### 1. Create COPR Repository

```bash
# On copr.fedorainfracloud.org
# Create account
# Create project: susa-lang/susa
```

### 2. Build .rpm Package

```bash
# On Fedora machine
./build-linux.sh
./create-linux-package.sh

# This creates: susa-1.0.0-1.x86_64.rpm
```

### 3. Upload to COPR

```bash
# Install COPR CLI
sudo dnf install copr-cli

# Configure COPR
copr-cli create susa --chroot fedora-39-x86_64

# Build package
copr-cli build susa SUSA-Linux-1.0.0.tar.gz
```

### 4. Users Install With:

```bash
sudo dnf copr enable susa-lang/susa
sudo dnf install susa
```

---

## 📸 Snap (Universal Linux)

### 1. Create snapcraft.yaml

```yaml
name: susa
version: '1.0.0'
summary: Modern programming language with English-like syntax
description: |
  SUSA is a modern programming language designed for beginners and
  professionals. Features 40 language features, 9 built-in modules,
  and 290+ functions.

grade: stable
confinement: strict
base: core22

apps:
  susa:
    command: bin/susa
    plugs: [home, network]

parts:
  susa:
    plugin: make
    source: .
    build-packages:
      - g++
    override-build: |
      cd cpp-core
      g++ -std=c++17 -O2 main.cpp -o susa
      mkdir -p $SNAPCRAFT_PART_INSTALL/bin
      cp susa $SNAPCRAFT_PART_INSTALL/bin/
      mkdir -p $SNAPCRAFT_PART_INSTALL/share/susa
      cp -r ../modules $SNAPCRAFT_PART_INSTALL/share/susa/
      cp -r ../examples $SNAPCRAFT_PART_INSTALL/share/susa/
```

### 2. Build and Publish

```bash
# Install snapcraft
sudo snap install snapcraft --classic

# Build snap
snapcraft

# Test locally
sudo snap install susa_1.0.0_amd64.snap --dangerous

# Publish to Snap Store
snapcraft login
snapcraft upload susa_1.0.0_amd64.snap --release=stable
```

### 3. Users Install With:

```bash
sudo snap install susa
```

---

## 🍫 Chocolatey (Windows)

### 1. Create Package Files

Create `susa.nuspec`:
```xml
<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://schemas.microsoft.com/packaging/2015/06/nuspec.xsd">
  <metadata>
    <id>susa</id>
    <version>1.0.0</version>
    <title>SUSA Programming Language</title>
    <authors>SUSA Team</authors>
    <projectUrl>https://susastudio.online</projectUrl>
    <licenseUrl>https://github.com/susa-lang/susa/blob/main/LICENSE</licenseUrl>
    <requireLicenseAcceptance>false</requireLicenseAcceptance>
    <description>Modern programming language with English-like syntax. Includes 40 features, 9 built-in modules, and 290+ functions.</description>
    <summary>SUSA Programming Language</summary>
    <tags>programming language compiler interpreter susa</tags>
  </metadata>
  <files>
    <file src="tools\**" target="tools" />
  </files>
</package>
```

Create `tools/chocolateyinstall.ps1`:
```powershell
$ErrorActionPreference = 'Stop'
$packageName = 'susa'
$url = 'https://github.com/susa-lang/susa/releases/download/v1.0.0/SUSA-CLI-Only-1.0.0.exe'
$checksum = 'REPLACE_WITH_ACTUAL_CHECKSUM'
$checksumType = 'sha256'

$packageArgs = @{
  packageName   = $packageName
  fileType      = 'exe'
  url           = $url
  silentArgs    = '/S'
  validExitCodes= @(0)
  checksum      = $checksum
  checksumType  = $checksumType
}

Install-ChocolateyPackage @packageArgs
```

### 2. Build and Test

```powershell
# Pack the package
choco pack

# Test locally
choco install susa -s . -y

# Test uninstall
choco uninstall susa -y
```

### 3. Publish

```powershell
# Get API key from chocolatey.org
choco apikey --key YOUR_API_KEY --source https://push.chocolatey.org/

# Push package
choco push susa.1.0.0.nupkg --source https://push.chocolatey.org/
```

### 4. Users Install With:

```powershell
choco install susa
```

---

## 🪣 Scoop (Windows)

### 1. Create Bucket Repository

```bash
# Create GitHub repository: scoop-bucket
# URL: https://github.com/susa-lang/scoop-bucket
```

### 2. Create Manifest

Create `susa.json`:
```json
{
    "version": "1.0.0",
    "description": "Modern programming language with English-like syntax",
    "homepage": "https://susastudio.online",
    "license": "MIT",
    "url": "https://github.com/susa-lang/susa/releases/download/v1.0.0/SUSA-CLI-Only-1.0.0.exe#/susa-installer.exe",
    "hash": "REPLACE_WITH_ACTUAL_HASH",
    "installer": {
        "script": [
            "Start-Process \"$dir\\susa-installer.exe\" -ArgumentList '/S' -Wait",
            "Remove-Item \"$dir\\susa-installer.exe\""
        ]
    },
    "bin": "susa.exe",
    "checkver": {
        "github": "https://github.com/susa-lang/susa"
    },
    "autoupdate": {
        "url": "https://github.com/susa-lang/susa/releases/download/v$version/SUSA-CLI-Only-$version.exe#/susa-installer.exe"
    }
}
```

### 3. Publish

```bash
# Commit and push to bucket repository
git add susa.json
git commit -m "Add SUSA v1.0.0"
git push
```

### 4. Users Install With:

```powershell
scoop bucket add susa https://github.com/susa-lang/scoop-bucket
scoop install susa
```

---

## 🐋 Docker

### Create Dockerfile

```dockerfile
FROM gcc:latest

# Install SUSA
WORKDIR /tmp
COPY cpp-core/main.cpp .
COPY cpp-core/*.hpp .
RUN g++ -std=c++17 -O2 main.cpp -o /usr/local/bin/susa

# Copy modules and examples
COPY modules /usr/local/share/susa/modules
COPY examples /usr/local/share/susa/examples

# Set working directory
WORKDIR /workspace

# Default command
CMD ["susa"]
```

### Build and Publish

```bash
# Build image
docker build -t susalang/susa:1.0.0 .
docker tag susalang/susa:1.0.0 susalang/susa:latest

# Test
docker run -it susalang/susa:1.0.0 susa /usr/local/share/susa/examples/01_basics.susa

# Publish to Docker Hub
docker login
docker push susalang/susa:1.0.0
docker push susalang/susa:latest
```

### Users Run With:

```bash
docker run -v $(pwd):/workspace susalang/susa susa myfile.susa
```

---

## 📊 Package Manager Priority

### High Priority (Do First):
1. ✅ **GitHub Releases** - Direct downloads
2. 🍺 **Homebrew** - macOS/Linux users
3. 🍫 **Chocolatey** - Windows users
4. 🪣 **Scoop** - Windows power users

### Medium Priority:
5. 📦 **APT (Ubuntu PPA)** - Ubuntu/Debian users
6. 📸 **Snap** - Universal Linux
7. 🎩 **DNF (COPR)** - Fedora/RHEL users

### Lower Priority:
8. 🐋 **Docker** - Containerized environments
9. 📦 **Flatpak** - Linux desktop apps
10. 🍎 **Mac App Store** - macOS users (requires Apple Developer account)

---

## 🚀 Quick Start Checklist

### Week 1:
- [x] Windows installers complete
- [ ] Create GitHub release v1.0.0
- [ ] Upload Windows installers
- [ ] Create Homebrew tap
- [ ] Create Chocolatey package

### Week 2:
- [ ] Build on Linux machine
- [ ] Create .deb and .rpm packages
- [ ] Set up Ubuntu PPA
- [ ] Set up Fedora COPR

### Week 3:
- [ ] Build on macOS machine
- [ ] Create .dmg installer
- [ ] Publish Homebrew formula
- [ ] Create Snap package

### Week 4:
- [ ] Create Scoop bucket
- [ ] Create Docker image
- [ ] Set up CI/CD for automated builds
- [ ] Documentation updates

---

## 📝 Notes

### Checksums:
Always calculate and include checksums for security:
```bash
# SHA256
shasum -a 256 file.exe

# MD5
md5sum file.exe
```

### Versioning:
Use semantic versioning: `MAJOR.MINOR.PATCH`
- v1.0.0 - Initial release
- v1.0.1 - Bug fixes
- v1.1.0 - New features
- v2.0.0 - Breaking changes

### Testing:
Test each package manager installation before publishing:
1. Install in clean environment
2. Run `susa --version`
3. Run example programs
4. Verify all features work
5. Test uninstallation

---

**Making SUSA available everywhere!** 🌍
