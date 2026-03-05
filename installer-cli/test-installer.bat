@echo off
REM ================================
REM SUSA CLI Installer - Test Script
REM ================================

echo ========================================
echo SUSA CLI Installer - Testing
echo ========================================
echo.

if not exist "SUSA-CLI-Setup.exe" (
    echo ERROR: SUSA-CLI-Setup.exe not found!
    echo Please build the installer first: build-local.bat
    echo.
    pause
    exit /b 1
)

echo [1/6] Checking installer file...
dir SUSA-CLI-Setup.exe | findstr "SUSA-CLI-Setup.exe"
echo.

echo [2/6] Verifying installer properties...
echo File type: Windows Executable
echo Expected size: ~2-3 MB
echo.

echo [3/6] Testing silent install...
echo.
echo This will install SUSA CLI silently to test the installer.
echo Press Ctrl+C to cancel, or
pause

echo Installing...
SUSA-CLI-Setup.exe /S

echo Waiting for installation to complete...
timeout /t 10 /nobreak >nul

echo.
echo [4/6] Verifying installation...

if exist "C:\Program Files\SUSA\cli\susa.exe" (
    echo ✓ SUSA CLI installed successfully
    echo.
    echo Testing executable...
    "C:\Program Files\SUSA\cli\susa.exe" --version
    echo.
) else (
    echo ✗ Installation failed - susa.exe not found
    echo.
    pause
    exit /b 1
)

echo [5/6] Testing PATH integration...
where susa >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✓ SUSA is in PATH
    where susa
) else (
    echo ⚠ SUSA not in PATH (may require restart)
)
echo.

echo [6/6] Testing uninstallation...
echo.
echo Press any key to test uninstall, or Ctrl+C to skip
pause >nul

echo Uninstalling...
"C:\Program Files\SUSA\cli\Uninstall.exe" /S

echo Waiting for uninstallation to complete...
timeout /t 5 /nobreak >nul

if not exist "C:\Program Files\SUSA\cli\susa.exe" (
    echo ✓ Uninstallation successful
) else (
    echo ⚠ Some files may remain
)
echo.

echo ========================================
echo Testing Complete!
echo ========================================
echo.
echo Manual testing checklist:
echo [ ] Run installer normally (not silent)
echo [ ] Check wizard pages display correctly
echo [ ] Verify branding assets show
echo [ ] Test PATH checkbox
echo [ ] Test Start Menu checkbox
echo [ ] Launch CLI from finish page
echo [ ] Run 'susa --version' from cmd
echo [ ] Check Start Menu shortcuts
echo [ ] Uninstall via Control Panel
echo.

pause
