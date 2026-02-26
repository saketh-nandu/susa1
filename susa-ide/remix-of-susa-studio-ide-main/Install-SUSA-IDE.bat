@echo off
title SUSA IDE - Easy Installer
color 0E

echo.
echo  ███████╗██╗   ██╗███████╗ █████╗     ██╗██████╗ ███████╗
echo  ██╔════╝██║   ██║██╔════╝██╔══██╗    ██║██╔══██╗██╔════╝
echo  ███████╗██║   ██║███████╗███████║    ██║██║  ██║█████╗  
echo  ╚════██║██║   ██║╚════██║██╔══██║    ██║██║  ██║██╔══╝  
echo  ███████║╚██████╔╝███████║██║  ██║    ██║██████╔╝███████╗
echo  ╚══════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝    ╚═╝╚═════╝ ╚══════╝
echo.
echo                    Easy Installer v1.0
echo              Set up SUSA IDE in one click!
echo.

echo [INFO] Welcome to SUSA IDE Easy Installer!
echo [INFO] This will set up everything you need to run SUSA IDE
echo.

REM Check if Node.js is installed
echo [CHECK] Checking for Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Node.js is not installed
    echo.
    echo SUSA IDE requires Node.js to run.
    echo.
    echo Option 1: Download and install Node.js manually
    echo   - Go to: https://nodejs.org/
    echo   - Download the LTS version
    echo   - Install it and restart this installer
    echo.
    echo Option 2: Continue with portable version (if available)
    echo.
    choice /c 12 /m "Choose option (1=Install Node.js manually, 2=Continue anyway)"
    if errorlevel 2 goto :check_portable
    if errorlevel 1 goto :install_nodejs
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo [SUCCESS] Node.js found: !NODE_VERSION!
    goto :setup_ide
)

:install_nodejs
echo [INFO] Opening Node.js download page...
start https://nodejs.org/
echo.
echo Please:
echo 1. Download and install Node.js LTS version
echo 2. Restart your computer (or at least this command prompt)
echo 3. Run this installer again
echo.
pause
exit /b 0

:check_portable
echo [INFO] Checking for portable version...
if exist "SUSA-IDE-Portable*.exe" (
    echo [SUCCESS] Found portable version!
    echo You can run the portable .exe file directly
    echo No installation needed!
    echo.
    for %%f in (SUSA-IDE-Portable*.exe) do (
        echo Starting: %%f
        start "" "%%f"
    )
    echo.
    pause
    exit /b 0
) else (
    echo [ERROR] No portable version found and Node.js is not installed
    echo Please install Node.js first
    pause
    exit /b 1
)

:setup_ide
echo [INFO] Setting up SUSA IDE...
echo.

REM Install dependencies
echo [STEP 1/2] Installing dependencies...
echo This may take a few minutes on first run...
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    echo Please check your internet connection and try again
    pause
    exit /b 1
)

echo [SUCCESS] Dependencies installed!
echo.

REM Create desktop shortcut
echo [STEP 2/2] Creating desktop shortcut...
set DESKTOP=%USERPROFILE%\Desktop
set SHORTCUT_PATH=%DESKTOP%\SUSA IDE.lnk
set TARGET_PATH=%CD%\SUSA-IDE-Launcher.bat
set ICON_PATH=%CD%\public\favicon.ico

REM Create shortcut using PowerShell
powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%SHORTCUT_PATH%'); $Shortcut.TargetPath = '%TARGET_PATH%'; $Shortcut.WorkingDirectory = '%CD%'; $Shortcut.IconLocation = '%ICON_PATH%'; $Shortcut.Description = 'SUSA IDE - Professional Development Environment'; $Shortcut.Save()"

if exist "%SHORTCUT_PATH%" (
    echo [SUCCESS] Desktop shortcut created!
) else (
    echo [WARNING] Could not create desktop shortcut
)

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    INSTALLATION COMPLETE!                   ║
echo ╠══════════════════════════════════════════════════════════════╣
echo ║                                                              ║
echo ║  SUSA IDE is now ready to use!                              ║
echo ║                                                              ║
echo ║  How to start SUSA IDE:                                     ║
echo ║  • Double-click "SUSA IDE" shortcut on your desktop         ║
echo ║  • Or run "SUSA-IDE-Launcher.bat" in this folder           ║
echo ║                                                              ║
echo ║  Features included:                                          ║
echo ║  ✓ Complete SUSA programming language support               ║
echo ║  ✓ 283+ built-in functions across 10 modules               ║
echo ║  ✓ Professional code editor with syntax highlighting        ║
echo ║  ✓ Integrated debugger and code execution                   ║
echo ║  ✓ Module marketplace with coming soon features             ║
echo ║  ✓ File management and project workspace                    ║
echo ║                                                              ║
echo ║  Need help? Check the examples in the modules/ folder       ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

choice /c YN /m "Would you like to start SUSA IDE now"
if errorlevel 2 goto :end
if errorlevel 1 goto :start_ide

:start_ide
echo [INFO] Starting SUSA IDE...
start "" "%TARGET_PATH%"
goto :end

:end
echo.
echo Thank you for installing SUSA IDE!
echo Happy coding! 🚀
echo.
pause