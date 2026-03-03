@echo off
REM Local NSIS Installer Build Script for SUSA

echo ========================================
echo SUSA Installer - Local Build
echo ========================================
echo.

REM Check if NSIS is installed
where makensis >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: NSIS not found!
    echo Please install NSIS from https://nsis.sourceforge.io/
    echo Or run: choco install nsis
    pause
    exit /b 1
)

REM Check if CLI exists
if not exist "..\cpp-core\build\Release\susa.exe" (
    if not exist "..\cpp-core\susa.exe" (
        echo ERROR: CLI not built!
        echo Please build the CLI first:
        echo   cd cpp-core
        echo   mkdir build
        echo   cd build
        echo   cmake .. -G "Visual Studio 17 2022" -A x64
        echo   cmake --build . --config Release
        pause
        exit /b 1
    )
)

REM Check if IDE exists
if not exist "..\susa-ide\remix-of-susa-studio-ide-main\dist-electron\win-unpacked" (
    echo ERROR: IDE not built!
    echo Please build the IDE first:
    echo   cd susa-ide\remix-of-susa-studio-ide-main
    echo   npm install
    echo   npm run dist:win
    pause
    exit /b 1
)

REM Create dist directory
if not exist "..\dist" mkdir "..\dist"

REM Build installer
echo Building NSIS installer...
makensis /V4 susa-installer.nsi

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS!
    echo ========================================
    echo Installer created: dist\SUSA-Setup.exe
    echo.
    
    REM Calculate size
    for %%A in ("..\dist\SUSA-Setup.exe") do echo Size: %%~zA bytes
    
    REM Calculate SHA256
    certutil -hashfile "..\dist\SUSA-Setup.exe" SHA256 > "..\dist\SUSA-Setup.exe.sha256"
    echo SHA256 checksum saved to: dist\SUSA-Setup.exe.sha256
    echo.
) else (
    echo.
    echo ========================================
    echo BUILD FAILED!
    echo ========================================
    echo Check the error messages above.
    pause
    exit /b 1
)

pause
