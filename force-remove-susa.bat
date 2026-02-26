@echo off
echo ========================================
echo FORCE REMOVE SUSA - All Versions
echo ========================================
echo.

REM Kill all SUSA and related processes
echo Killing all SUSA processes...
taskkill /F /IM "SUSA IDE.exe" 2>nul
taskkill /F /IM "SUSA.exe" 2>nul
taskkill /F /IM electron.exe 2>nul
taskkill /F /IM node.exe 2>nul
taskkill /F /IM susa.exe 2>nul
taskkill /F /IM susa-cpp.exe 2>nul

echo Waiting 3 seconds...
timeout /t 3 /nobreak >nul

REM Remove installation directories
echo.
echo Removing installation directories...

if exist "C:\Program Files\SUSA" (
    echo Removing C:\Program Files\SUSA...
    rmdir /s /q "C:\Program Files\SUSA" 2>nul
)

if exist "C:\Program Files (x86)\SUSA" (
    echo Removing C:\Program Files (x86)\SUSA...
    rmdir /s /q "C:\Program Files (x86)\SUSA" 2>nul
)

if exist "%LOCALAPPDATA%\SUSA" (
    echo Removing %LOCALAPPDATA%\SUSA...
    rmdir /s /q "%LOCALAPPDATA%\SUSA" 2>nul
)

if exist "%LOCALAPPDATA%\Programs\SUSA" (
    echo Removing %LOCALAPPDATA%\Programs\SUSA...
    rmdir /s /q "%LOCALAPPDATA%\Programs\SUSA" 2>nul
)

if exist "%APPDATA%\SUSA" (
    echo Removing %APPDATA%\SUSA...
    rmdir /s /q "%APPDATA%\SUSA" 2>nul
)

REM Remove from PATH
echo.
echo Removing SUSA from PATH...
powershell -Command "$path = [Environment]::GetEnvironmentVariable('Path', 'User'); $newPath = ($path -split ';' | Where-Object { $_ -notlike '*SUSA*' }) -join ';'; [Environment]::SetEnvironmentVariable('Path', $newPath, 'User')"
powershell -Command "$path = [Environment]::GetEnvironmentVariable('Path', 'Machine'); $newPath = ($path -split ';' | Where-Object { $_ -notlike '*SUSA*' }) -join ';'; [Environment]::SetEnvironmentVariable('Path', $newPath, 'Machine')" 2>nul

REM Remove registry entries
echo.
echo Removing registry entries...
reg delete "HKCU\Software\SUSA" /f 2>nul
reg delete "HKLM\Software\SUSA" /f 2>nul
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA" /f 2>nul
reg delete "HKLM\Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA" /f 2>nul
reg delete "HKLM\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\SUSA" /f 2>nul

REM Remove Start Menu shortcuts
echo.
echo Removing shortcuts...
if exist "%APPDATA%\Microsoft\Windows\Start Menu\Programs\SUSA" (
    rmdir /s /q "%APPDATA%\Microsoft\Windows\Start Menu\Programs\SUSA" 2>nul
)
if exist "%ProgramData%\Microsoft\Windows\Start Menu\Programs\SUSA" (
    rmdir /s /q "%ProgramData%\Microsoft\Windows\Start Menu\Programs\SUSA" 2>nul
)

REM Remove Desktop shortcuts
del "%USERPROFILE%\Desktop\SUSA*.lnk" 2>nul
del "%PUBLIC%\Desktop\SUSA*.lnk" 2>nul

echo.
echo ========================================
echo SUSA removal complete!
echo ========================================
echo.
echo You can now:
echo 1. Close the stuck uninstaller window
echo 2. Restart your computer (recommended)
echo 3. Install the new version
echo.
pause
