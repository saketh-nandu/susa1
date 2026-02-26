@echo off
echo Adding MinGW to System PATH...
echo.

REM Add MinGW to PATH permanently (requires admin)
setx PATH "%PATH%;C:\MinGW\bin" /M

if %errorlevel% equ 0 (
    echo Success! MinGW has been added to your system PATH.
    echo.
    echo Please restart your terminal for changes to take effect.
    echo.
    echo After restarting, you can use:
    echo   - g++ --version
    echo   - susa --version
    echo   - susa --help
) else (
    echo Failed! You may need to run this as Administrator.
    echo.
    echo Alternative: Add manually
    echo 1. Press Win + X, select System
    echo 2. Click "Advanced system settings"
    echo 3. Click "Environment Variables"
    echo 4. Edit PATH variable
    echo 5. Add: C:\MinGW\bin
)

pause
