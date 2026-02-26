@echo off
echo ========================================
echo FRESH REBUILD - Complete Process
echo ========================================
echo.

REM Create Output directory
if not exist "Output" mkdir "Output"

REM Step 1: Reinstall IDE dependencies
echo ========================================
echo Step 1: Installing IDE dependencies...
echo ========================================
cd susa-ide\remix-of-susa-studio-ide-main
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm install failed!
    cd ..\..
    pause
    exit /b 1
)
cd ..\..

echo.
echo ✓ Dependencies installed!
echo.

REM Step 2: Build IDE with electron-builder
echo ========================================
echo Step 2: Building IDE Desktop App...
echo ========================================
cd susa-ide\remix-of-susa-studio-ide-main
call npm run dist:win
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: IDE build failed!
    cd ..\..
    pause
    exit /b 1
)
cd ..\..

REM Copy IDE installer to Output
echo Copying IDE installer...
copy "susa-ide\remix-of-susa-studio-ide-main\dist-electron\SUSA-IDE-Desktop-App-1.0.0.exe" "Output\" >nul

echo.
echo ✓ IDE Desktop App created!
echo.

REM Step 3: Create Complete Setup
echo ========================================
echo Step 3: Building Complete Setup...
echo ========================================
call create-complete-installer.bat
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Complete Setup build failed!
    pause
    exit /b 1
)

echo.
echo ✓ Complete Setup created!
echo.

REM Step 4: Create CLI installer
echo ========================================
echo Step 4: Building CLI Installer...
echo ========================================
call create-cli-installer-nsis.bat
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: CLI installer build failed!
    pause
    exit /b 1
)

echo.
echo ✓ CLI Installer created!
echo.

REM Show results
echo ========================================
echo ALL INSTALLERS CREATED SUCCESSFULLY!
echo ========================================
echo.
echo Output folder contents:
dir Output\*.exe /b
echo.
echo ========================================
echo Ready for deployment!
echo ========================================
echo.
pause
