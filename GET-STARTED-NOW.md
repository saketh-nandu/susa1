# 🚀 Get Started NOW - SUSA CLI Installer

## ⚡ 3-Minute Setup

### Step 1: Install NSIS (30 seconds)
```cmd
choco install nsis
```

### Step 2: Build CLI (1 minute)
```cmd
cd cpp-core
build.bat
```

### Step 3: Build Installer (1 minute)
```cmd
cd installer-cli
build-local.bat
```

**Done!** You now have `SUSA-CLI-Setup.exe` ready to distribute! 🎉

---

## 🧪 Test It (30 seconds)

```cmd
cd installer-cli
test-installer.bat
```

---

## 📤 Distribute It

### Option 1: GitHub Release (Automatic)
```bash
git add .
git commit -m "Add CLI installer"
git push

git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

Download from: **Actions → Artifacts** or **Releases**

### Option 2: Direct Upload
Upload `SUSA-CLI-Setup.exe` to:
- Dropbox (add `?dl=1` to URL)
- Google Drive
- Your website

---

## 🌐 Update Website

Edit `susa-the-ai-language-reveal-main/src/pages/Download.tsx`:

```typescript
cli: {
  windows: "YOUR_DOWNLOAD_URL_HERE",
  // ...
}
```

Deploy:
```cmd
cd susa-the-ai-language-reveal-main
npm install
npm run build
vercel --prod
```

---

## ✅ What You Get

- ✅ Professional Windows installer (~2.5 MB)
- ✅ Modern wizard interface
- ✅ System PATH integration
- ✅ Start Menu shortcuts
- ✅ Automatic upgrades
- ✅ Silent install support
- ✅ Clean uninstallation

---

## 📚 Need Help?

- **Quick Start**: `CLI-INSTALLER-QUICK-START.md`
- **Full Guide**: `CLI-INSTALLER-GUIDE.md`
- **Comparison**: `INSTALLER-COMPARISON.md`
- **Index**: `INSTALLER-INDEX.md`

---

## 🎯 What's Next?

1. ✅ Build installer
2. ✅ Test it
3. ✅ Distribute it
4. ✅ Update website
5. ✅ Share with users!

---

**Your professional CLI installer is ready!** 🚀

Start distributing SUSA now!
