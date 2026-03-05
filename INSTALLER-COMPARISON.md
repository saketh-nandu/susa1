# SUSA Installer Comparison

## 📦 Available Installers

| Feature | CLI Only | Complete (CLI + IDE) |
|---------|----------|---------------------|
| **File** | `SUSA-CLI-Setup.exe` | `SUSA-Setup.exe` |
| **Size** | ~2.5 MB | ~150 MB |
| **Components** | CLI compiler only | CLI + Desktop IDE |
| **Installation Time** | ~10 seconds | ~30 seconds |
| **Disk Space** | ~2 MB | ~150 MB |
| **Best For** | Developers, servers, CI/CD | Desktop users, beginners |

---

## 🎯 CLI Only Installer

### What's Included
- ✅ SUSA CLI compiler (`susa.exe`)
- ✅ Command-line interpreter
- ✅ System PATH integration
- ✅ Start Menu shortcuts

### What's NOT Included
- ❌ Desktop IDE
- ❌ GUI editor
- ❌ Visual debugger

### Use Cases
- Server deployments
- CI/CD pipelines
- Docker containers
- Developers who prefer terminal
- Minimal installations
- Scripting and automation

### Installation
```cmd
SUSA-CLI-Setup.exe
```

### Silent Install
```cmd
SUSA-CLI-Setup.exe /S
```

### After Install
```cmd
susa --version
susa myprogram.susa
```

---

## 🖥️ Complete Installer (CLI + IDE)

### What's Included
- ✅ SUSA CLI compiler (`susa.exe`)
- ✅ Desktop IDE (Electron app)
- ✅ Monaco code editor
- ✅ Visual debugger
- ✅ File explorer
- ✅ System PATH integration
- ✅ Start Menu shortcuts
- ✅ Desktop shortcut
- ✅ File associations (`.susa`)

### Use Cases
- Desktop development
- Beginners learning SUSA
- Visual debugging
- Project management
- Full development environment

### Installation
```cmd
SUSA-Setup.exe
```

### Silent Install
```cmd
SUSA-Setup.exe /S
```

### After Install
- Launch "SUSA IDE" from Start Menu
- Or use CLI: `susa myprogram.susa`

---

## 🤔 Which Should I Choose?

### Choose CLI Only If:
- ✅ You prefer command-line tools
- ✅ You use your own editor (VS Code, Vim, etc.)
- ✅ You're deploying to servers
- ✅ You need minimal installation
- ✅ You're setting up CI/CD
- ✅ You want fast installation

### Choose Complete If:
- ✅ You want a full IDE
- ✅ You're new to SUSA
- ✅ You prefer visual tools
- ✅ You want integrated debugging
- ✅ You need project management
- ✅ You want everything in one package

---

## 📊 Technical Comparison

### CLI Only
```
Installation:
├── C:\Program Files\SUSA\cli\
│   ├── susa.exe (2 MB)
│   └── Uninstall.exe
└── Start Menu\SUSA\
    └── SUSA CLI.lnk

Registry:
└── HKLM\...\Uninstall\SUSA CLI

PATH:
└── C:\Program Files\SUSA\cli
```

### Complete
```
Installation:
├── C:\Program Files\SUSA\
│   ├── cli\
│   │   └── susa.exe (2 MB)
│   └── ide\
│       └── SUSA IDE.exe (148 MB)
├── Desktop\
│   └── SUSA IDE.lnk
└── Start Menu\SUSA\
    ├── SUSA IDE.lnk
    └── SUSA CLI.lnk

Registry:
├── HKLM\...\Uninstall\SUSA
└── HKCR\.susa (file association)

PATH:
└── C:\Program Files\SUSA\cli
```

---

## 🔄 Can I Install Both?

**No need!** The Complete installer includes everything from CLI installer.

If you have CLI installed:
- Installing Complete will upgrade and add IDE
- Your CLI installation will be preserved

If you have Complete installed:
- You already have CLI
- No need to install CLI separately

---

## 🚀 Installation Comparison

### CLI Only
```
1. Welcome
2. License
3. Directory
4. Options (PATH, Start Menu)
5. Install
6. Finish

Time: ~10 seconds
```

### Complete
```
1. Welcome
2. License
3. Directory
4. Components (CLI, IDE, PATH, Shortcuts)
5. Install
6. Finish

Time: ~30 seconds
```

---

## 💾 Download Links

### CLI Only
```
https://github.com/user/repo/releases/latest/download/SUSA-CLI-Setup.exe
```

### Complete
```
https://www.dropbox.com/scl/fi/9fbeezjwdqed7kzfvh72d/SUSA-Setup.exe?rlkey=wokbdpw1v8mr8yetjwcl2flfv&st=y9zefma7&dl=1
```

---

## 🔧 Upgrade Paths

### From CLI to Complete
1. Run Complete installer
2. It will detect CLI installation
3. Upgrades CLI and adds IDE
4. Everything preserved

### From Complete to CLI Only
1. Uninstall Complete
2. Install CLI Only
3. Fresh CLI installation

### Upgrade CLI Only
1. Run new CLI installer
2. Detects old version
3. Prompts for upgrade
4. Upgrades automatically

### Upgrade Complete
1. Run new Complete installer
2. Detects old version
3. Uninstalls old version
4. Installs new version

---

## 📦 Deployment Scenarios

### Scenario 1: Developer Workstation
**Recommendation**: Complete Installer
- Full IDE for development
- CLI for terminal work
- Visual debugging
- One-click install

### Scenario 2: Build Server
**Recommendation**: CLI Only
- Minimal footprint
- Fast installation
- No GUI needed
- Silent install support

### Scenario 3: Docker Container
**Recommendation**: CLI Only (or just `susa.exe`)
- Smallest size
- No installer needed
- Just copy executable

### Scenario 4: Enterprise Deployment
**Recommendation**: Both available
- CLI for servers
- Complete for developers
- Silent install scripts
- Group Policy deployment

### Scenario 5: Student Lab
**Recommendation**: Complete Installer
- Easy to use IDE
- Visual learning
- All-in-one package
- Consistent environment

---

## 🎓 Learning Path

### Beginners
1. Install: **Complete**
2. Use: SUSA IDE
3. Learn: Visual interface
4. Progress: CLI when comfortable

### Experienced Developers
1. Install: **CLI Only**
2. Use: Your preferred editor
3. Run: `susa` from terminal
4. Optional: Install Complete for IDE

---

## 🔐 Security Comparison

Both installers:
- ✅ Require admin rights
- ✅ Signed with same certificate (if signed)
- ✅ Same security model
- ✅ Clean uninstallation
- ✅ No telemetry
- ✅ Open source

---

## 📈 Performance

### CLI Only
- **Startup**: Instant
- **Memory**: ~5 MB
- **CPU**: Minimal
- **Disk I/O**: Low

### Complete (IDE)
- **Startup**: ~2-3 seconds
- **Memory**: ~100-150 MB
- **CPU**: Moderate
- **Disk I/O**: Moderate

---

## 🌐 Platform Support

### CLI Only
- ✅ Windows 10/11
- 🚧 macOS (coming soon)
- 🚧 Linux (coming soon)

### Complete
- ✅ Windows 10/11
- 🚧 macOS (coming soon)
- 🚧 Linux (coming soon)

---

## 💡 Recommendations

### For Most Users
**→ Complete Installer**
- Best overall experience
- Everything included
- Easy to use

### For Developers
**→ CLI Only**
- Lightweight
- Fast
- Flexible

### For Servers
**→ CLI Only**
- Minimal footprint
- No GUI
- Scriptable

### For CI/CD
**→ CLI Only (Silent)**
```cmd
SUSA-CLI-Setup.exe /S
```

---

## 📞 Support

Both installers have:
- Same support channels
- Same documentation
- Same update mechanism
- Same uninstall process

**Questions?**
- GitHub: https://github.com/saketh-nandu/susa
- Email: mantolsaketh@gmail.com
- Website: https://susa-programming-language.web.app

---

**Choose the installer that fits your needs!** 🚀
