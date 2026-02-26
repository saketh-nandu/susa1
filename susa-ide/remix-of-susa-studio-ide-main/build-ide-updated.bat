@echo off
echo ========================================
echo BUILDING SUSA IDE - UPDATED VERSION
echo With C++ Core Integration
echo ========================================
echo.

echo Step 1: Building React app...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Creating portable version...
echo Copying files to dist-electron...

REM Create output directory
if not exist "dist-electron\SUSA-IDE-Portable" mkdir "dist-electron\SUSA-IDE-Portable"

REM Copy dist folder
xcopy /E /I /Y "dist" "dist-electron\SUSA-IDE-Portable\dist"

REM Copy public files
copy /Y "public\electron.cjs" "dist-electron\SUSA-IDE-Portable\"
copy /Y "public\preload.cjs" "dist-electron\SUSA-IDE-Portable\"
copy /Y "public\susa-interpreter.cjs" "dist-electron\SUSA-IDE-Portable\"
copy /Y "susa-ide.config.json" "dist-electron\SUSA-IDE-Portable\"

REM Copy package.json
copy /Y "package.json" "dist-electron\SUSA-IDE-Portable\"

echo.
echo ========================================
echo BUILD COMPLETE!
echo ========================================
echo.
echo Portable IDE created in:
echo dist-electron\SUSA-IDE-Portable
echo.
echo To run the IDE:
echo 1. Install dependencies: cd dist-electron\SUSA-IDE-Portable && npm install --production
echo 2. Run: electron .
echo.
pause
