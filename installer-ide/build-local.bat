@echo off
REM ================================
REM SUSA IDE Installer - Local Build
REM ================================

echo ========================================
echo SUSA IDE Installer - Local Build
echo ========================================
echo.

where makensis >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: NSIS is not installed or not in PATH
    echo.
    echo Please install NSIS from: https://nsis.sourceforge.io/Download
    echo Or install via Chocolatey: choco install nsis
    echo.
    pause
    exit /b 1
)

echo [1/4] Checking NSIS installation...
makensis /VERSION
echo.

cd /d "%~dp0"

echo [2/4] Preparing directories...
if not exist "dist\ide" mkdir dist\ide
if not exist "assets" mkdir assets
echo.

echo [3/4] Copying SUSA IDE files...
if exist "..\susa-ide\remix-of-susa-studio-ide-main\dist-electron\win-unpacked" (
    xcopy /E /I /Y "..\susa-ide\remix-of-susa-studio-ide-main\dist-electron\win-unpacked\*" "dist\ide\"
    echo ✓ Copied IDE files
) else (
    echo ERROR: IDE build not found!
    echo.
    echo Please build SUSA IDE first:
    echo   cd susa-ide/remix-of-susa-studio-ide-main
    echo   npm install
    echo   npm run build
    echo   npm run dist:win
    echo.
    pause
    exit /b 1
)
echo.

echo [4/4] Checking branding assets...

if exist "..\susa logo.ico" (
    copy "..\susa logo.ico" "assets\susa.ico"
    echo ✓ Copied susa.ico
) else if not exist "assets\susa.ico" (
    echo ⚠ Warning: susa.ico not found
)

if exist "..\susa-sidebar.bmp" (
    copy "..\susa-sidebar.bmp" "assets\susa-sidebar.bmp"
    echo ✓ Copied susa-sidebar.bmp
) else if not exist "assets\susa-sidebar.bmp" (
    echo ⚠ Warning: susa-sidebar.bmp not found
)

if not exist "license.txt" (
    echo Creating license.txt...
    (
        echo MIT License
        echo.
        echo Copyright ^(c^) 2024 SUSA Programming Language
        echo.
        echo Permission is hereby granted, free of charge, to any person obtaining a copy
        echo of this software and associated documentation files ^(the "Software"^), to deal
        echo in the Software without restriction, including without limitation the rights
        echo to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
        echo copies of the Software, and to permit persons to whom the Software is
        echo furnished to do so, subject to the following conditions:
        echo.
        echo The above copyright notice and this permission notice shall be included in all
        echo copies or substantial portions of the Software.
        echo.
        echo THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        echo IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        echo FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        echo AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        echo LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
        echo OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
        echo SOFTWARE.
    ) > license.txt
    echo ✓ Created license.txt
)
echo.

echo Building installer with NSIS...
echo.
makensis /V4 susa-ide-installer.nsi

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✓ BUILD SUCCESSFUL!
    echo ========================================
    echo.
    echo Installer: SUSA-IDE-Setup.exe
    dir SUSA-IDE-Setup.exe | findstr "SUSA-IDE-Setup.exe"
    echo.
    echo You can now distribute this installer!
    echo.
) else (
    echo.
    echo ========================================
    echo ✗ BUILD FAILED!
    echo ========================================
    echo.
    pause
    exit /b 1
)

pause
