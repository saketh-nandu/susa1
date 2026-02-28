@echo off
echo ========================================
echo SUSA Website - Rebuild and Deploy
echo ========================================
echo.

echo [1/6] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js found
echo.

echo [2/6] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed
echo.

echo [3/6] Building website for production...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed!
    echo Please check the error messages above.
    pause
    exit /b 1
)
echo ✓ Build completed successfully
echo.

echo [4/6] Checking build output...
if not exist "dist\" (
    echo ERROR: dist folder not found!
    pause
    exit /b 1
)
echo ✓ Build output verified
echo.

echo [5/6] Starting preview server...
echo.
echo ========================================
echo Preview your website at:
echo http://localhost:4173
echo.
echo Press Ctrl+C to stop the preview
echo ========================================
echo.
call npm run preview

pause
