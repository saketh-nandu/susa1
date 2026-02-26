@echo off
echo ========================================
echo SUSA - Push to GitHub Helper
echo ========================================
echo.
echo This script will help you push SUSA to GitHub
echo.

REM Check if git is installed
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Git is not installed or not in PATH!
    echo Please install Git from: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo Git is installed: 
git --version
echo.

REM Check if already initialized
if exist ".git" (
    echo Git repository already initialized.
    echo.
) else (
    echo Initializing Git repository...
    git init
    echo.
)

REM Get GitHub username
set /p GITHUB_USER="Enter your GitHub username: "
echo.

REM Get repository name (default: susa)
set /p REPO_NAME="Enter repository name (default: susa): "
if "%REPO_NAME%"=="" set REPO_NAME=susa
echo.

echo ========================================
echo IMPORTANT: Personal Access Token
echo ========================================
echo.
echo You need a GitHub Personal Access Token to push.
echo.
echo To create one:
echo 1. Go to: https://github.com/settings/tokens
echo 2. Click "Generate new token (classic)"
echo 3. Select scopes: repo, workflow
echo 4. Copy the token
echo.
echo When prompted for password, paste your token!
echo.
pause

REM Configure git user (if not already configured)
git config user.name >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Configuring Git user...
    set /p GIT_NAME="Enter your name: "
    set /p GIT_EMAIL="Enter your email: "
    git config --global user.name "%GIT_NAME%"
    git config --global user.email "%GIT_EMAIL%"
    echo.
)

echo ========================================
echo Step 1: Adding files to Git
echo ========================================
echo.

git add .
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to add files
    pause
    exit /b 1
)
echo ✓ Files added
echo.

echo ========================================
echo Step 2: Creating commit
echo ========================================
echo.

git commit -m "SUSA v1.0.0 - Complete with all 40 features"
if %ERRORLEVEL% NEQ 0 (
    echo Note: No changes to commit or already committed
)
echo.

echo ========================================
echo Step 3: Adding GitHub remote
echo ========================================
echo.

REM Remove existing remote if any
git remote remove origin >nul 2>&1

REM Add new remote
git remote add origin https://github.com/%GITHUB_USER%/%REPO_NAME%.git
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to add remote
    pause
    exit /b 1
)
echo ✓ Remote added: https://github.com/%GITHUB_USER%/%REPO_NAME%.git
echo.

echo ========================================
echo Step 4: Pushing to GitHub
echo ========================================
echo.
echo When prompted:
echo   Username: %GITHUB_USER%
echo   Password: [Paste your Personal Access Token]
echo.
pause

git branch -M main
git push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Push failed!
    echo.
    echo Common issues:
    echo 1. Wrong username or token
    echo 2. Repository doesn't exist on GitHub
    echo 3. Token doesn't have correct permissions
    echo.
    echo Please:
    echo 1. Create repository on GitHub: https://github.com/new
    echo 2. Name it: %REPO_NAME%
    echo 3. Make it Public
    echo 4. Run this script again
    echo.
    pause
    exit /b 1
)

echo.
echo ✓ Successfully pushed to GitHub!
echo.

echo ========================================
echo Step 5: Creating release tag
echo ========================================
echo.

git tag -a v1.0.0 -m "SUSA v1.0.0 - First stable release"
git push origin v1.0.0

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✓ SUCCESS!
    echo ========================================
    echo.
    echo Your code is now on GitHub!
    echo Repository: https://github.com/%GITHUB_USER%/%REPO_NAME%
    echo.
    echo GitHub Actions will now:
    echo 1. Build for Windows, Linux, macOS
    echo 2. Create all packages
    echo 3. Publish to Releases
    echo.
    echo Check progress:
    echo https://github.com/%GITHUB_USER%/%REPO_NAME%/actions
    echo.
    echo Download binaries (in ~15 minutes):
    echo https://github.com/%GITHUB_USER%/%REPO_NAME%/releases
    echo.
) else (
    echo.
    echo Tag creation failed, but code is pushed!
    echo You can create the tag manually later.
    echo.
)

pause
