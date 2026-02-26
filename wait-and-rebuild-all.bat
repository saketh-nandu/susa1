@echo off
echo ========================================
echo Waiting for IDE build to complete...
echo ========================================
echo.

:wait_loop
if not exist "susa-ide\remix-of-susa-studio-ide-main\dist-electron\SUSA-IDE-Desktop-App-1.0.0.exe" (
    echo Waiting... (checking every 10 seconds)
    timeout /t 10 /nobreak >nul
    goto wait_loop
)

echo.
echo ✓ IDE build completed!
echo.

echo ========================================
echo Rebuilding all installers...
echo ========================================
echo.

REM Step 1: Copy IDE installer
echo [1/3] Copying IDE installer...
copy "susa-ide\remix-of-susa-studio-ide-main\dist-electron\SUSA-IDE-Desktop-App-1.0.0.exe" "Output\" /Y >nul
echo ✓ Done

echo.
echo [2/3] Creating Complete Setup installer...
call create-complete-installer-simple.bat

echo.
echo [3/3] Creating CLI installer...
call create-cli-installer-simple.bat

echo.
echo ========================================
echo ALL INSTALLERS UPDATED!
echo ========================================
echo.
dir Output\*.exe
echo.
echo ========================================
echo Ready for deployment!
echo ========================================
pause
