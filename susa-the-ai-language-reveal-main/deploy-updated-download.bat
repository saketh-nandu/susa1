@echo off
echo ========================================
echo  SUSA Website - Deploy Updated Download
echo ========================================
echo.

echo [1/3] Building website...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo [2/3] Deploying to Firebase...
call firebase deploy --only hosting
if errorlevel 1 (
    echo ERROR: Deploy failed!
    pause
    exit /b 1
)

echo.
echo [3/3] Done!
echo.
echo ========================================
echo  Website deployed successfully!
echo  URL: https://susastudio.online
echo ========================================
echo.
pause
