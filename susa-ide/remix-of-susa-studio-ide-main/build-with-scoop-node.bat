@echo off
echo ========================================
echo SUSA IDE - Build with Scoop Node.js
echo ========================================
echo.

echo Using Scoop Node.js installation...
set NODE_PATH=%USERPROFILE%\scoop\apps\nodejs-lts\current
set PATH=%NODE_PATH%;%NODE_PATH%\bin;%PATH%

echo Node.js version:
node --version
echo npm version:
npm --version
echo.

echo Step 1: Killing any running processes...
taskkill /F /IM electron.exe 2>nul
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo Done!
echo.

echo Step 2: Cleaning old build artifacts...
if exist dist rmdir /s /q dist
if exist dist-electron rmdir /s /q dist-electron
echo Done!
echo.

echo Step 3: Cleaning package lock...
if exist package-lock.json del /f package-lock.json
echo Done!
echo.

echo Step 4: Installing fresh dependencies...
echo This may take several minutes...
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo Done!
echo.

echo Step 5: Building React application...
call npm run build
if errorlevel 1 (
    echo ERROR: Failed to build React app
    pause
    exit /b 1
)
echo Done!
echo.

echo Step 6: Building Windows installer...
call npm run dist:win
if errorlevel 1 (
    echo ERROR: Failed to build installer
    pause
    exit /b 1
)
echo Done!
echo.

echo ========================================
echo BUILD COMPLETE!
echo ========================================
echo.
echo Your installer is ready in: dist-electron\
echo - SUSA IDE Setup 1.0.0.exe (Installer)
echo - SUSA-IDE-Portable-1.0.0.exe (Portable)
echo.
pause
