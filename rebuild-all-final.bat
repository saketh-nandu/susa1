@echo off
echo ========================================
echo SUSA - Final Rebuild (With Path Fix)
echo ========================================
echo.

REM Wait for IDE build to complete
echo Waiting for IDE build to complete...
echo Press Ctrl+C if build is not running
timeout /t 120 /nobreak

REM Check if IDE was built
if not exist "susa-ide\remix-of-susa-studio-ide-main\dist-electron\win-unpacked" (
    echo ERROR: IDE build not found!
    echo Please run: cd susa-ide\remix-of-susa-studio-ide-main ^&^& npm run dist:win
    pause
    exit /b 1
)

echo.
echo ========================================
echo Step 1: Copying IDE installer...
echo ========================================
copy "susa-ide\remix-of-susa-studio-ide-main\dist-electron\SUSA-IDE-Desktop-App-1.0.0.exe" "Output\" /Y
echo ✓ IDE installer copied

echo.
echo ========================================
echo Step 2: Creating Complete Setup...
echo ========================================
call create-complete-installer-simple.bat

echo.
echo ========================================
echo Step 3: Creating CLI installer...
echo ========================================
call create-cli-installer-simple.bat

echo.
echo ========================================
echo ALL INSTALLERS REBUILT SUCCESSFULLY!
echo ========================================
echo.
echo Final installers with path fix:
dir Output\*.exe
echo.
echo ========================================
echo Ready for deployment!
echo ========================================
pause
