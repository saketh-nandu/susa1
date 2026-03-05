@echo off
REM ================================
REM SUSA CLI Installer - Local Build
REM ================================

echo ========================================
echo SUSA CLI Installer - Local Build
echo ========================================
echo.

REM Check if NSIS is installed
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

echo [1/5] Checking NSIS installation...
makensis /VERSION
echo.

REM Navigate to installer directory
cd /d "%~dp0"

echo [2/5] Preparing directories...
if not exist "dist\cli" mkdir dist\cli
if not exist "assets" mkdir assets
echo.

echo [3/5] Copying SUSA CLI executable...
if exist "..\cpp-core\build\susa.exe" (
    copy "..\cpp-core\build\susa.exe" "dist\cli\susa.exe"
    echo ✓ Copied from cpp-core\build\susa.exe
) else if exist "..\cpp-core\susa.exe" (
    copy "..\cpp-core\susa.exe" "dist\cli\susa.exe"
    echo ✓ Copied from cpp-core\susa.exe
) else (
    echo ERROR: susa.exe not found!
    echo.
    echo Please build SUSA CLI first:
    echo   cd cpp-core
    echo   build.bat
    echo.
    pause
    exit /b 1
)
echo.

echo [4/5] Checking branding assets...

REM Check for icon
if exist "..\susa logo.ico" (
    copy "..\susa logo.ico" "assets\susa.ico"
    echo ✓ Copied susa.ico
) else if not exist "assets\susa.ico" (
    echo ⚠ Warning: susa.ico not found, using placeholder
)

REM Check for sidebar
if exist "..\susa-sidebar.bmp" (
    copy "..\susa-sidebar.bmp" "assets\susa-sidebar.bmp"
    echo ✓ Copied susa-sidebar.bmp
) else if not exist "assets\susa-sidebar.bmp" (
    echo ⚠ Warning: susa-sidebar.bmp not found, using placeholder
)

REM Create header if missing
if not exist "assets\susa-header.bmp" (
    echo ⚠ Creating placeholder header image
)

REM Create license if missing
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

echo [5/5] Building installer with NSIS...
echo.
makensis /V4 susa-cli-installer.nsi

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✓ BUILD SUCCESSFUL!
    echo ========================================
    echo.
    echo Installer: SUSA-CLI-Setup.exe
    dir SUSA-CLI-Setup.exe | findstr "SUSA-CLI-Setup.exe"
    echo.
    echo You can now distribute this installer!
    echo.
) else (
    echo.
    echo ========================================
    echo ✗ BUILD FAILED!
    echo ========================================
    echo.
    echo Check the error messages above.
    echo.
    pause
    exit /b 1
)

pause
