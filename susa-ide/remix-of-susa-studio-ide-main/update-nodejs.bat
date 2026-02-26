@echo off
echo ========================================
echo Node.js Update Guide
echo ========================================
echo.
echo Current versions:
node --version
npm --version
echo.
echo Latest available versions:
echo - Node.js v24.13.1 (LTS) - Recommended
echo - Node.js v25.6.0 (Current) - Latest features
echo.
echo ========================================
echo Update Instructions:
echo ========================================
echo.
echo Option 1: Using Node Version Manager (NVM) - Recommended
echo   1. Install NVM for Windows from: https://github.com/coreybutler/nvm-windows/releases
echo   2. Run: nvm install 24.13.1
echo   3. Run: nvm use 24.13.1
echo.
echo Option 2: Direct Download
echo   1. Visit: https://nodejs.org/
echo   2. Download Node.js v24.13.1 LTS installer
echo   3. Run the installer (it will update your current installation)
echo.
echo Option 3: Using Winget (Windows Package Manager)
echo   Run: winget upgrade OpenJS.NodeJS.LTS
echo.
echo After updating Node.js, npm will also be updated automatically.
echo Then you can run kill-and-build.bat to build SUSA IDE.
echo.
pause
