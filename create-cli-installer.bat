@echo off
echo ========================================
echo Creating SUSA CLI Installer
echo ========================================

REM Check if 7-Zip is available
where 7z >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo 7-Zip not found. Creating simple ZIP package instead...
    powershell -Command "Compress-Archive -Path 'SUSA-CLI-Package\*' -DestinationPath 'Output\SUSA-CLI-Only-1.0.0.zip' -Force"
    echo.
    echo CLI package created: Output\SUSA-CLI-Only-1.0.0.zip
    goto :end
)

REM Create Output directory if it doesn't exist
if not exist "Output" mkdir "Output"

REM Create self-extracting archive with 7-Zip
echo Creating self-extracting installer...
7z a -sfx7z.sfx "Output\SUSA-CLI-Only-1.0.0.exe" "SUSA-CLI-Package\*" -mx9

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo CLI Installer created successfully!
    echo ========================================
    echo Location: Output\SUSA-CLI-Only-1.0.0.exe
    echo Size:
    dir "Output\SUSA-CLI-Only-1.0.0.exe" | find "SUSA-CLI"
) else (
    echo.
    echo Failed to create installer. Creating ZIP instead...
    powershell -Command "Compress-Archive -Path 'SUSA-CLI-Package\*' -DestinationPath 'Output\SUSA-CLI-Only-1.0.0.zip' -Force"
    echo CLI package created: Output\SUSA-CLI-Only-1.0.0.zip
)

:end
echo.
pause
