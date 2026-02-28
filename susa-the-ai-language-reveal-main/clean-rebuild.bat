@echo off
echo ========================================
echo SUSA Website - Clean Rebuild
echo ========================================
echo.

echo [1/4] Cleaning old build...
if exist "dist" (
    rmdir /s /q dist
    echo ✓ Removed dist folder
) else (
    echo ✓ No dist folder to remove
)

if exist ".vite" (
    rmdir /s /q .vite
    echo ✓ Removed .vite cache
) else (
    echo ✓ No .vite cache to remove
)
echo.

echo [2/4] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed
echo.

echo [3/4] Building website...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo ✓ Build completed
echo.

echo [4/4] Starting preview server...
echo.
echo ========================================
echo Website ready at: http://localhost:4173
echo.
echo Press Ctrl+C to stop
echo ========================================
echo.
call npm run preview

pause
