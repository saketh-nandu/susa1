# SUSA Programming Language - Professional Installer System

## Overview

This directory contains the complete cross-platform installer infrastructure for SUSA Programming Language, designed to match the quality of Python, Node.js, and Java installers.

## Structure

```
installers/
├── windows/          # Windows NSIS installers
│   ├── cli/         # CLI-only installer
│   ├── ide/         # IDE-only installer
│   └── complete/    # CLI + IDE installer
├── macos/           # macOS PKG installers
│   ├── cli/
│   ├── ide/
│   └── complete/
├── linux-deb/       # Debian/Ubuntu DEB packages
│   ├── cli/
│   ├── ide/
│   └── complete/
├── linux-rpm/       # RedHat/Fedora RPM packages
│   ├── cli/
│   ├── ide/
│   └── complete/
├── common/          # Shared resources
│   ├── branding/    # Logos and images
│   └── scripts/     # Common build scripts
└── docs/            # Documentation

```

## Installer Editions

### 1. CLI Installer
- SUSA compiler binary
- Command-line tools
- Adds to system PATH
- File: `susa-cli-{version}-{platform}`

### 2. IDE Installer
- SUSA Desktop IDE
- Desktop shortcuts
- File associations (.susa files)
- File: `susa-ide-{version}-{platform}`

### 3. Complete Installer
- CLI + IDE combined
- All features from both
- File: `susa-complete-{version}-{platform}`

## Platform Support

| Platform | Format | Editions | Total |
|----------|--------|----------|-------|
| Windows | .exe (NSIS) | CLI, IDE, Complete | 3 |
| macOS | .pkg | CLI, IDE, Complete | 3 |
| Linux Debian | .deb | CLI, IDE, Complete | 3 |
| Linux RedHat | .rpm | CLI, IDE, Complete | 3 |
| **TOTAL** | | | **12 installers** |

## Installer Features

### Wizard Flow
1. Welcome Screen (branded)
2. License Agreement (MIT)
3. Installation Location
4. Component Selection
5. Permissions Summary
6. Installation Progress
7. Launch Options
8. Finish Screen

### Branding
- SUSA logo on header
- Side panel image (cinematic theme)
- Dark modern UI
- Professional styling

### Functionality
- PATH environment configuration
- Desktop shortcuts
- File associations (.susa)
- Silent install mode
- Upgrade detection
- Process management (kill before install/uninstall)

## Building Installers

### Prerequisites
- **Windows**: NSIS 3.x, MSYS2 (for CLI build)
- **macOS**: Xcode Command Line Tools, Node.js 20+
- **Linux**: dpkg-deb, rpmbuild, g++, Node.js 20+

### Local Build
```bash
# Windows
cd installers/windows/cli
makensis susa-cli.nsi

# macOS
cd installers/macos/cli
./build.sh

# Linux DEB
cd installers/linux-deb/cli
./build.sh

# Linux RPM
cd installers/linux-rpm/cli
./build.sh
```

### CI/CD Build
Push a tag to trigger automated builds:
```bash
git tag v1.0.0
git push origin v1.0.0
```

GitHub Actions will build all 12 installers automatically.

## CI/CD Workflows

- `build-windows.yml` - Builds 3 Windows installers
- `build-macos.yml` - Builds 3 macOS installers
- `build-linux-deb.yml` - Builds 3 Debian installers
- `build-linux-rpm.yml` - Builds 3 RedHat installers

## Version Management

Version is automatically pulled from:
- Git tags (e.g., v1.0.0)
- `VERSION` file in repository root
- Package.json for IDE builds

## Security

- Binary verification before packaging
- Checksum validation
- Proper permission handling
- Signed installers (when certificates available)

## Testing

Test each installer on target platform:
```bash
# Windows
susa-cli-1.0.0-windows.exe /S  # Silent install
susa --version

# macOS
sudo installer -pkg susa-cli-1.0.0-macos.pkg -target /
susa --version

# Linux DEB
sudo dpkg -i susa-cli_1.0.0_amd64.deb
susa --version

# Linux RPM
sudo rpm -i susa-cli-1.0.0-1.x86_64.rpm
susa --version
```

## Uninstallation

All installers include professional uninstallers:
- Windows: Programs & Features
- macOS: Manual uninstall script
- Linux: `dpkg -r` or `rpm -e`

## Support

- Repository: https://github.com/saketh-nandu/susa1
- Website: https://susastudio.online
- Documentation: https://susastudio.online/docs

---

**Built with ❤️ by SUSA Labs**
