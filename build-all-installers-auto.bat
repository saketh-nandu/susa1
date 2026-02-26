@echo off
echo ========================================
echo SUSA - Build All Installers (Automated)
echo ========================================
echo.
echo This script will create three installers:
echo 1. SUSA IDE Desktop App (NSIS installer)
echo 2. SUSA Complete Setup (IDE + CLI with PATH)
echo 3. SUSA CLI Only (CLI installer with PATH)
echo.

REM Create Output directory
if not exist "Output" mkdir "Output"

REM Step 1: Build IDE with electron-builder
echo.
echo ========================================
echo Step 1: Building IDE Desktop App...
echo ========================================
cd susa-ide\remix-of-susa-studio-ide-main
call npm run dist:win
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: IDE build failed!
    cd ..\..
    exit /b 1
)
cd ..\..

REM Copy IDE installer to Output
echo Copying IDE installer...
copy "susa-ide\remix-of-susa-studio-ide-main\dist-electron\SUSA-IDE-Desktop-App-1.0.0.exe" "Output\" >nul

echo.
echo ✓ IDE Desktop App created!
echo.

REM Step 2: Create Complete Setup
echo ========================================
echo Step 2: Building Complete Setup...
echo ========================================
call create-complete-installer.bat
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Complete Setup build failed!
    exit /b 1
)

echo.
echo ✓ Complete Setup created!
echo.

REM Step 3: Create CLI installer
echo ========================================
echo Step 3: Building CLI Installer...
echo ========================================
call create-cli-installer-nsis.bat
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: CLI installer build failed!
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
