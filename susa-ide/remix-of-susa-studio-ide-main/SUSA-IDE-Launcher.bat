@echo off
title SUSA IDE - Professional Development Environment
color 0A

echo.
echo  ███████╗██╗   ██╗███████╗ █████╗     ██╗██████╗ ███████╗
echo  ██╔════╝██║   ██║██╔════╝██╔══██╗    ██║██╔══██╗██╔════╝
echo  ███████╗██║   ██║███████╗███████║    ██║██║  ██║█████╗  
echo  ╚════██║██║   ██║╚════██║██╔══██║    ██║██║  ██║██╔══╝  
echo  ███████║╚██████╔╝███████║██║  ██║    ██║██████╔╝███████╗
echo  ╚══════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝    ╚═╝╚═════╝ ╚══════╝
echo.
echo                Professional Development Environment v1.0
echo                     Modern React TypeScript IDE
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

REM Check if npm is available
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not available
    echo Please ensure Node.js is properly installed
    echo.
    pause
    exit /b 1
)

echo [INFO] Starting SUSA IDE...
echo [INFO] Initializing development environment...
echo.

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo [INFO] Installing dependencies for first-time setup...
    echo This may take a few minutes...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
    echo [SUCCESS] Dependencies installed successfully!
    echo.
)

REM Start the development server and Electron app
echo [INFO] Launching SUSA IDE...
echo [INFO] The IDE will open in a new window shortly...
echo.
echo [TIP] You can close this window after the IDE opens
echo [TIP] To stop the IDE, close the IDE window or press Ctrl+C here
echo.

start /min cmd /c "npm run dev"
timeout /t 3 /nobreak >nul
npm run electron

echo.
echo [INFO] SUSA IDE has been closed
echo Thank you for using SUSA IDE!
pause