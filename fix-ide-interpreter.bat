@echo off
REM Quick fix for IDE interpreter to support susa.exe

echo ========================================
echo SUSA IDE Interpreter Fix
echo ========================================
echo.

echo Copying updated interpreter...
copy /Y "susa-ide\remix-of-susa-studio-ide-main\public\susa-interpreter.cjs" "susa-ide\remix-of-susa-studio-ide-main\dist\susa-interpreter.cjs"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS!
    echo ========================================
    echo.
    echo The IDE interpreter has been updated.
    echo.
    echo Next steps:
    echo 1. Close the SUSA IDE if it's running
    echo 2. Restart the IDE
    echo 3. Try running your code again
    echo.
    echo Or rebuild the IDE for a permanent fix:
    echo   cd susa-ide\remix-of-susa-studio-ide-main
    echo   npm run build
    echo   npm run dist:win
    echo.
) else (
    echo.
    echo ========================================
    echo FAILED!
    echo ========================================
    echo Could not copy interpreter file.
    echo.
)

pause
