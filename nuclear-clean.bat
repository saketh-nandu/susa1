@echo off
echo ========================================
echo NUCLEAR CLEAN - Kill Everything
echo ========================================
echo.

REM Kill ALL node and electron processes
echo Killing ALL processes...
taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM electron.exe /T 2>nul
taskkill /F /IM "SUSA IDE.exe" /T 2>nul
taskkill /F /IM susa.exe /T 2>nul
taskkill /F /IM app-builder.exe /T 2>nul

echo Waiting 5 seconds...
timeout /t 5 /nobreak >nul

REM Force delete the locked directory
echo.
echo Force deleting build directories...
powershell -Command "Get-Process | Where-Object {$_.Path -like '*susa-ide*'} | Stop-Process -Force -ErrorAction SilentlyContinue"

timeout /t 2 /nobreak >nul

REM Delete with PowerShell force
powershell -Command "if (Test-Path 'susa-ide\remix-of-susa-studio-ide-main\dist-electron') { Remove-Item -Path 'susa-ide\remix-of-susa-studio-ide-main\dist-electron' -Recurse -Force -ErrorAction SilentlyContinue }"
powershell -Command "if (Test-Path 'susa-ide\remix-of-susa-studio-ide-main\dist') { Remove-Item -Path 'susa-ide\remix-of-susa-studio-ide-main\dist' -Recurse -Force -ErrorAction SilentlyContinue }"

echo.
echo ========================================
echo Cleanup complete!
echo ========================================
echo.
echo IMPORTANT: Close this window and restart your computer
echo Then run: build-all-installers-auto.bat
echo.
pause
