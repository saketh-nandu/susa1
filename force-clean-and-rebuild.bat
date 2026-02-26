@echo off
echo ========================================
echo FORCE CLEAN AND REBUILD
echo ========================================
echo.
echo IMPORTANT: Make sure you have closed:
echo - Task Manager and killed all electron.exe and node.exe
echo - Any SUSA IDE windows
echo - Any command prompts running npm/node
echo.
pause

echo.
echo Attempting force cleanup...
echo.

REM Use handle.exe if available, otherwise manual
powershell -Command "Get-Process | Where-Object {$_.ProcessName -match 'electron|node|SUSA'} | Stop-Process -Force -ErrorAction SilentlyContinue"

timeout /t 2 /nobreak >nul

REM Force delete with PowerShell
powershell -Command "if (Test-Path 'susa-ide\remix-of-susa-studio-ide-main\dist-electron') { Remove-Item -Path 'susa-ide\remix-of-susa-studio-ide-main\dist-electron' -Recurse -Force -ErrorAction SilentlyContinue }"
powershell -Command "if (Test-Path 'susa-ide\remix-of-susa-studio-ide-main\dist') { Remove-Item -Path 'susa-ide\remix-of-susa-studio-ide-main\dist' -Recurse -Force -ErrorAction SilentlyContinue }"

echo.
echo ========================================
echo Starting rebuild...
echo ========================================
echo.

call build-all-installers.bat
