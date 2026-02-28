# 🧹 Cleanup Old Files and Deploy New Installer System

## Step 1: Remove Old Documentation Files

```bash
# Remove old installer documentation
git rm -f DEPLOY-ALL-12-INSTALLERS.md
git rm -f DEPLOY-INSTALLERS.md
git rm -f DEPLOY-3-WORKFLOWS.md
git rm -f FIXED-WORKFLOW-SUMMARY.md
git rm -f BUILD-INSTRUCTIONS.md
git rm -f QUICK-FIX.md
git rm -f WINDOWS-BUILD-FIX.md
git rm -f USE-SIMPLE-WORKFLOW.md
git rm -f COMMIT-AND-PUSH.md
git rm -f ALL-INSTALLERS-READY.md
git rm -f AUTOMATED-BUILD-SETUP.md
git rm -f COMPLETE-INSTALLER-CONTENTS.md
git rm -f COMPLETE_IMPLEMENTATION_GUIDE.md
git rm -f DISTRIBUTION-READY.md
git rm -f FINAL-DISTRIBUTION-READY.md
git rm -f FINAL-STATUS-SUMMARY.md
git rm -f GITHUB-SETUP-GUIDE.md
git rm -f GLOBAL-DISTRIBUTION-PLAN.md
git rm -f INSTALLER-GUIDE.md
git rm -f INSTALLER-READY.md
git rm -f INSTALLER-STATUS.md
git rm -f MANUAL-RELEASE-GUIDE.md
git rm -f PACKAGE-MANAGER-SETUP.md
git rm -f READY-TO-DEPLOY.md

# Remove old workflow file if it exists (it doesn't, but just in case)
git rm -f .github/workflows/build-all-installers.yml
git rm -f .github/workflows/build-installers.yml
git rm -f .github/workflows/build-installers-simple.yml
git rm -f .github/workflows/build-linux-macos.yml
git rm -f .github/workflows/build-macos-only.yml
git rm -f .github/workflows/build-wizard-installers.yml
git rm -f .github/workflows/build-ide-all-platforms.yml
git rm -f .github/workflows/build-windows-installers.yml
git rm -f .github/workflows/build-macos-installers.yml
git rm -f .github/workflows/build-linux-installers.yml

# Commit the cleanup
git commit -m "Clean up old installer documentation and workflows"
```

## Step 2: Add New Professional Installer System

```bash
# Add the new installer system
git add installers/
git add .github/workflows/build-windows.yml
git add CLEANUP-AND-DEPLOY.md

# Commit
git commit -m "Add professional Windows installer system (CLI, IDE, Complete)"

# Push
git push origin main
```

## Step 3: Create Release Tag

```bash
# Create and push tag to trigger builds
git tag v1.0.0
git push origin v1.0.0
```

## Step 4: Watch the Build

Go to: https://github.com/saketh-nandu/susa1/actions

You should see:
- ✅ Build Windows Installers workflow running
- ✅ 3 jobs: CLI, IDE, Complete
- ✅ Artifacts uploaded after ~15-20 minutes

## Step 5: Download Installers

After the workflow completes:
1. Go to the Actions tab
2. Click on the workflow run
3. Scroll to "Artifacts" section
4. Download:
   - `susa-cli-windows`
   - `susa-ide-windows`
   - `susa-complete-windows`

## Step 6: Test Installers

```powershell
# Test CLI
.\susa-cli-1.0.0-windows.exe
# After install: susa --version

# Test IDE
.\susa-ide-1.0.0-windows.exe
# After install: Launch from Desktop

# Test Complete
.\susa-complete-1.0.0-windows.exe
# After install: Both CLI and IDE work
```

---

## 🎯 One-Command Cleanup and Deploy

```bash
# Copy and paste this entire block:
git rm -f DEPLOY-ALL-12-INSTALLERS.md DEPLOY-INSTALLERS.md DEPLOY-3-WORKFLOWS.md FIXED-WORKFLOW-SUMMARY.md BUILD-INSTRUCTIONS.md QUICK-FIX.md WINDOWS-BUILD-FIX.md USE-SIMPLE-WORKFLOW.md COMMIT-AND-PUSH.md ALL-INSTALLERS-READY.md AUTOMATED-BUILD-SETUP.md COMPLETE-INSTALLER-CONTENTS.md COMPLETE_IMPLEMENTATION_GUIDE.md DISTRIBUTION-READY.md FINAL-DISTRIBUTION-READY.md FINAL-STATUS-SUMMARY.md GITHUB-SETUP-GUIDE.md GLOBAL-DISTRIBUTION-PLAN.md INSTALLER-GUIDE.md INSTALLER-READY.md INSTALLER-STATUS.md MANUAL-RELEASE-GUIDE.md PACKAGE-MANAGER-SETUP.md READY-TO-DEPLOY.md 2>/dev/null; git add installers/ .github/workflows/build-windows.yml CLEANUP-AND-DEPLOY.md; git commit -m "Clean up old files and add professional installer system"; git push origin main; git tag v1.0.0; git push origin v1.0.0
```

---

## ✅ What You'll Get

After running these commands:

1. **Clean Repository**
   - All old documentation removed
   - Only new professional installer system

2. **3 Windows Installers**
   - `susa-cli-1.0.0-windows.exe` (~5 MB)
   - `susa-ide-1.0.0-windows.exe` (~150 MB)
   - `susa-complete-1.0.0-windows.exe` (~155 MB)

3. **Professional Features**
   - Wizard-based installation
   - SUSA branding
   - PATH configuration
   - Desktop shortcuts
   - File associations
   - Uninstaller

4. **GitHub Release**
   - Automatic release creation
   - All 3 installers attached
   - Professional release notes

---

## 🐛 If Something Goes Wrong

### If git rm fails for a file:
```bash
# Just skip it, the file doesn't exist
# Continue with the next command
```

### If you want to see what will be deleted first:
```bash
# List files that will be deleted
ls -la *.md | grep -E "(DEPLOY|BUILD|INSTALLER|READY|GUIDE|STATUS)"
```

### If you want to do it step by step:
```bash
# Step 1: Clean up
git rm -f DEPLOY-ALL-12-INSTALLERS.md
git rm -f DEPLOY-INSTALLERS.md
# ... (continue with each file)

# Step 2: Commit cleanup
git commit -m "Clean up old files"

# Step 3: Add new system
git add installers/
git add .github/workflows/build-windows.yml

# Step 4: Commit new system
git commit -m "Add professional installer system"

# Step 5: Push
git push origin main

# Step 6: Tag and push
git tag v1.0.0
git push origin v1.0.0
```

---

**Ready to deploy! Use the one-command option above for fastest deployment.** 🚀
