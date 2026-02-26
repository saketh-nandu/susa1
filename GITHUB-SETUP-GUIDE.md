# GitHub Setup Guide - Connect Git Bash to GitHub

## Step-by-Step Instructions

---

## Step 1: Configure Git (One-Time Setup)

Open Git Bash and run these commands:

```bash
# Set your name (will appear in commits)
git config --global user.name "Your Name"

# Set your email (use your GitHub email)
git config --global user.email "your.email@example.com"

# Verify settings
git config --list
```

---

## Step 2: Create GitHub Personal Access Token

Since GitHub no longer accepts passwords, you need a token:

### A. Go to GitHub Settings:
1. Go to https://github.com
2. Click your profile picture (top right)
3. Click "Settings"
4. Scroll down and click "Developer settings" (bottom left)
5. Click "Personal access tokens"
6. Click "Tokens (classic)"
7. Click "Generate new token" → "Generate new token (classic)"

### B. Configure Token:
- **Note:** "SUSA Project"
- **Expiration:** 90 days (or No expiration)
- **Select scopes:**
  - ✅ repo (all)
  - ✅ workflow
  - ✅ write:packages
  - ✅ delete:packages

### C. Generate and Copy:
1. Click "Generate token" (bottom)
2. **COPY THE TOKEN** (you won't see it again!)
3. Save it somewhere safe (Notepad)

---

## Step 3: Create GitHub Repository

### A. On GitHub Website:
1. Go to https://github.com
2. Click "+" (top right)
3. Click "New repository"

### B. Repository Settings:
- **Repository name:** `susa`
- **Description:** "SUSA Programming Language - Modern language with English-like syntax"
- **Public** (for free GitHub Actions)
- **DON'T** check "Add README" (we have one)
- **DON'T** check "Add .gitignore"
- **License:** MIT (optional)

### C. Create Repository:
- Click "Create repository"
- **COPY the repository URL** (looks like: `https://github.com/YOUR_USERNAME/susa.git`)

---

## Step 4: Initialize Git in SUSA Folder

Open Git Bash in your SUSA folder:

```bash
# Navigate to SUSA folder
cd /c/Users/Nandu/Downloads/SUSA

# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "SUSA v1.0.0 - Complete with all 40 features"
```

---

## Step 5: Connect to GitHub and Push

```bash
# Add GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/susa.git

# Rename branch to main
git branch -M main

# Push to GitHub (will ask for credentials)
git push -u origin main
```

### When Prompted:
- **Username:** Your GitHub username
- **Password:** Paste your Personal Access Token (NOT your GitHub password!)

---

## Step 6: Create Release Tag

```bash
# Create version tag
git tag -a v1.0.0 -m "SUSA v1.0.0 - First stable release with all 40 features"

# Push tag to GitHub
git push origin v1.0.0
```

---

## Step 7: Watch GitHub Actions Build

1. Go to your repository: `https://github.com/YOUR_USERNAME/susa`
2. Click "Actions" tab
3. You'll see "Build SUSA for All Platforms" running
4. Wait ~10-15 minutes
5. Check "Releases" tab for all binaries

---

## 🎯 Quick Reference Commands

### First Time Setup:
```bash
cd /c/Users/Nandu/Downloads/SUSA
git init
git add .
git commit -m "SUSA v1.0.0"
git remote add origin https://github.com/YOUR_USERNAME/susa.git
git branch -M main
git push -u origin main
git tag v1.0.0
git push origin v1.0.0
```

### Future Updates:
```bash
git add .
git commit -m "Update description"
git push
```

---

## 🔧 Troubleshooting

### "Permission denied" or "Authentication failed":
- Make sure you're using the Personal Access Token, not your password
- Token must have "repo" scope enabled

### "Repository not found":
- Check the repository URL is correct
- Make sure repository is created on GitHub

### "Failed to push":
- Check internet connection
- Verify token hasn't expired
- Try: `git push -u origin main --force` (first time only)

---

## 💡 Alternative: GitHub Desktop (Easier)

If Git Bash is confusing, use GitHub Desktop:

1. Download: https://desktop.github.com
2. Install and sign in
3. Click "Add" → "Add existing repository"
4. Select SUSA folder
5. Click "Publish repository"
6. Done!

---

## ✅ What Happens After Push

Once you push the tag `v1.0.0`:

1. GitHub Actions starts automatically
2. Builds for Windows, Linux, macOS
3. Creates all packages
4. Publishes to Releases
5. You download all binaries

**No Linux or macOS machine needed!** 🎉

---

## 📝 Summary

1. Configure Git (name and email)
2. Create Personal Access Token on GitHub
3. Create repository on GitHub
4. Initialize Git in SUSA folder
5. Push to GitHub
6. Create release tag
7. GitHub Actions builds everything!

---

**Ready to make SUSA global!** 🌍
