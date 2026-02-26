@echo off
echo ========================================
echo SUSA IDE - Fresh Build Script
echo ========================================
echo.

echo Step 1: Cleaning old build artifacts...
if exist dist rmdir /s /q dist
if exist dist-electron rmdir /s /q dist-electron
echo Done!
echo.

echo Step 2: Cleaning package lock...
if exist package-lock.json del /f package-lock.json
echo Done!
echo.

echo Step 3: Installing fresh dependencies...
echo This may take a few minutes...
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo Done!
echo.

echo Step 4: Building React application...
call npm run build
if errorlevel 1 (
    echo ERROR: Failed to build React app
    pause
    exit /b 1
)
echo Done!
echo.

echo Step 5: Building Windows installer...
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
