@echo off
title SUSA IDE - Production Build
color 0B

echo.
echo  ███████╗██╗   ██╗███████╗ █████╗     ██╗██████╗ ███████╗
echo  ██╔════╝██║   ██║██╔════╝██╔══██╗    ██║██╔══██╗██╔════╝
echo  ███████╗██║   ██║███████╗███████║    ██║██║  ██║█████╗  
echo  ╚════██║██║   ██║╚════██║██╔══██║    ██║██║  ██║██╔══╝  
echo  ███████║╚██████╔╝███████║██║  ██║    ██║██████╔╝███████╗
echo  ╚══════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝    ╚═╝╚═════╝ ╚══════╝
echo.
echo                Production Build Creator v1.0
echo                  Create Standalone Executable
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [INFO] Creating production build of SUSA IDE...
echo [INFO] This will create a standalone executable
echo.

REM Install dependencies
echo [STEP 1/4] Installing dependencies...
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo [SUCCESS] Dependencies installed!
echo.

REM Build React app
echo [STEP 2/4] Building React application...
call npm run build
if errorlevel 1 (
    echo [ERROR] Failed to build React app
    pause
    exit /b 1
)

echo [SUCCESS] React app built successfully!
echo.

REM Install electron-builder if not present
echo [STEP 3/4] Preparing Electron builder...
call npm list electron-builder >nul 2>&1
if errorlevel 1 (
    echo Installing electron-builder...
    call npm install --save-dev electron-builder
)

REM Create production build
echo [STEP 4/4] Creating production executable...
echo This may take several minutes...
call npm run dist:win
if errorlevel 1 (
    echo [ERROR] Failed to create production build
    echo Check the error messages above for details
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Production build created successfully!
echo.
echo The executable files are located in: dist-electron/
echo.
echo Files created:
if exist "dist-electron\*.exe" (
    dir /b "dist-electron\*.exe"
) else (
    echo No .exe files found in dist-electron folder
)
echo.
echo You can now distribute these files to users!
echo Users can run the .exe file directly without installing anything else.
echo.
pause