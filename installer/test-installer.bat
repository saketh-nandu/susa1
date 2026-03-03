@echo off
REM Test SUSA Installer

echo ========================================
echo SUSA Installer - Test Script
echo ========================================
echo.

if not exist "..\dist\SUSA-Setup.exe" (
    echo ERROR: Installer not found!
    echo Please build the installer first.
    pause
    exit /b 1
)

echo This script will:
echo 1. Install SUSA silently
echo 2. Verify installation
echo 3. Test CLI
echo 4. Uninstall SUSA
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause >nul

echo.
echo [1/4] Installing SUSA...
start /wait "" "..\dist\SUSA-Setup.exe" /S

timeout /t 3 >nul

echo [2/4] Verifying installation...
if exist "C:\Program Files\SUSA\cli\cpp-core.exe" (
    echo   [OK] CLI installed
) else (
    echo   [FAIL] CLI not found
)

if exist "C:\Program Files\SUSA\ide\SUSA-IDE.exe" (
    echo   [OK] IDE installed
) else (
    echo   [FAIL] IDE not found
)

echo [3/4] Testing CLI...
"C:\Program Files\SUSA\cli\cpp-core.exe" --version
if %ERRORLEVEL% EQU 0 (
    echo   [OK] CLI works
) else (
    echo   [FAIL] CLI error
)

echo.
echo Press any key to uninstall...
pause >nul

echo [4/4] Uninstalling SUSA...
if exist "C:\Program Files\SUSA\uninst.exe" (
    start /wait "" "C:\Program Files\SUSA\uninst.exe" /S
    timeout /t 3 >nul
    
    if not exist "C:\Program Files\SUSA" (
        echo   [OK] Uninstall successful
    ) else (
        echo   [FAIL] Files still present
    )
) else (
    echo   [FAIL] Uninstaller not found
)

echo.
echo ========================================
echo Test complete!
echo ========================================
pause
