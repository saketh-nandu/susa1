# SUSA IDE Build Instructions

## Current Status
✅ Node.js updated to v24.13.1 (via Scoop)
✅ npm updated to v11.8.0
✅ Marketplace updated (trending modules removed)
✅ electron-builder.json updated (modules directory included)
✅ package.json updated (latest dependency versions)

## Build Steps

### Step 1: Close All Running Applications
**IMPORTANT:** Close any running instances of:
- SUSA IDE
- Electron apps
- VS Code (if open in this project)
- Any terminal windows in this directory

### Step 2: Clean Node Modules (Manual)
Since there's a file lock, you need to manually delete the node_modules folder:

1. Open File Explorer
2. Navigate to: `susa-ide\remix-of-susa-studio-ide-main`
3. Delete the `node_modules` folder
4. If it says "file in use", restart your computer and try again

### Step 3: Run the Build Script
Once node_modules is deleted, run:
```batch
build-with-scoop-node.bat
```

This will:
1. Use the updated Node.js v24.13.1 from Scoop
2. Install all dependencies with latest versions
3. Build the React application
4. Create Windows installer and portable exe

### Alternative: Step-by-Step Manual Build

If the batch file doesn't work, run these commands one by one:

```batch
# Set Node.js path to use Scoop version
set NODE_PATH=%USERPROFILE%\scoop\apps\nodejs-lts\current
set PATH=%NODE_PATH%;%NODE_PATH%\bin;%PATH%

# Verify versions
node --version
npm --version

# Clean old builds
rmdir /s /q dist
rmdir /s /q dist-electron
del package-lock.json

# Install dependencies
npm install --legacy-peer-deps

# Build React app
npm run build

# Build Windows installer
npm run dist:win
```

## Output Location
After successful build, find your installers in:
- `dist-electron\SUSA IDE Setup 1.0.0.exe` (Full installer)
- `dist-electron\SUSA-IDE-Portable-1.0.0.exe` (Portable version)

## What's Included in This Build
- ✅ Updated Marketplace (only core utility modules)
- ✅ Modules directory bundled with app
- ✅ All 9 core modules:
  - Array Utils
  - String Utils
  - Math Utils
  - DateTime Utils
  - File Utils
  - JSON Utils
  - HTTP Client
  - Data Structures
  - Algorithms

## Troubleshooting

### "EBUSY: resource busy or locked"
- Close all applications
- Restart computer
- Manually delete node_modules folder
- Try build again

### "electron not found"
- Make sure npm install completed successfully
- Check that node_modules/electron exists

### Build takes too long
- Normal build time: 5-10 minutes
- First build with fresh dependencies: 10-15 minutes

## Updated Versions
- Node.js: v22.14.0 → v24.13.1 ✅
- npm: 11.6.0 → 11.8.0 ✅
- electron: v27.3.11 → v33.2.1
- electron-builder: v24.13.3 → v25.1.8
- vite: v5.4.19 → v6.0.11
- concurrently: v8.2.2 → v9.1.2
- wait-on: v7.2.0 → v8.0.1
