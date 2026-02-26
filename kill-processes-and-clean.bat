@echo off
echo ========================================
echo Killing all SUSA and Electron processes
echo ========================================

taskkill /F /IM "SUSA IDE.exe" 2>nul
taskkill /F /IM electron.exe 2>nul
taskkill /F /IM node.exe 2>nul

echo Waiting 3 seconds...
timeout /t 3 /nobreak >nul

echo ========================================
echo Cleaning build directories
echo ========================================

if exist "susa-ide\remix-of-susa-studio-ide-main\dist-electron" (
    echo Removing dist-electron...
    rmdir /s /q "susa-ide\remix-of-susa-studio-ide-main\dist-electron"
)

if exist "susa-ide\remix-of-susa-studio-ide-main\dist" (
    echo Removing dist...
    rmdir /s /q "susa-ide\remix-of-susa-studio-ide-main\dist"
)

if exist "Output\SUSA-IDE-Desktop-App-1.0.0.exe" (
    echo Removing old IDE installer...
    del /f /q "Output\SUSA-IDE-Desktop-App-1.0.0.exe"
)

if exist "Output\SUSA-Complete-Setup-1.0.0.exe" (
    echo Removing old Complete installer...
    del /f /q "Output\SUSA-Complete-Setup-1.0.0.exe"
)

if exist "Output\SUSA-CLI-Only-1.0.0.exe" (
    echo Removing old CLI installer...
    del /f /q "Output\SUSA-CLI-Only-1.0.0.exe"
)

echo ========================================
echo Cleanup complete!
echo ========================================
echo.
echo Now you can run: build-all-installers.bat
echo.
pause
