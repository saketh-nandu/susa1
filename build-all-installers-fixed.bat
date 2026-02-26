@echo off
echo ========================================
echo SUSA - Build All Installers (Fixed)
echo ========================================
echo.

REM Create Output directory
if not exist "Output" mkdir "Output"

REM Step 1: Build CLI Package
echo ========================================
echo Step 1: Creating CLI Package...
echo ========================================

if exist "SUSA-CLI-Package" rmdir /s /q "SUSA-CLI-Package"
mkdir "SUSA-CLI-Package"

echo Copying CLI executable...
copy "susa-cpp.exe" "SUSA-CLI-Package\susa.exe"

echo Copying modules...
robocopy "modules" "SUSA-CLI-Package\modules" /E /NFL /NDL /NJH /NJS

echo Copying examples...
robocopy "examples" "SUSA-CLI-Package\examples" /E /NFL /NDL /NJH /NJS

echo Copying documentation...
copy "README.md" "SUSA-CLI-Package\README.md"
copy "LICENSE" "SUSA-CLI-Package\LICENSE.txt"

echo Creating CLI README...
(
echo SUSA CLI - Command Line Interface
echo ==================================
echo.
echo Usage:
echo   susa.exe [file.susa]           - Run a SUSA program
echo   susa.exe --version             - Show version
echo   susa.exe --help                - Show help
echo.
echo Examples:
echo   susa.exe examples\01_basics.susa
echo   susa.exe examples\04_lists.susa
echo.
echo For more information, visit: https://susastudio.online
) > "SUSA-CLI-Package\CLI-README.txt"

echo Creating launcher script...
(
echo @echo off
echo set PATH=%%~dp0;%%PATH%%
echo susa.exe %%*
) > "SUSA-CLI-Package\susa-cli.bat"

echo.
echo ✓ CLI Package created!
echo.

REM Step 2: Build IDE
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
copy "susa-ide\remix-of-susa-studio-ide-main\dist-electron\*.exe" "Output\" >nul

echo.
echo ✓ IDE Desktop App created!
echo.

REM Step 3: Create CLI installer with NSIS
echo ========================================
echo Step 3: Building CLI Installer...
echo ========================================

makensis /V2 susa-cli-installer.nsi
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
dir Output\*.exe /B
echo.
echo ========================================
echo Ready for deployment!
echo ========================================
echo.
pause
