@echo off
echo Adding Custom Domain to Firebase Hosting...
echo.

set /p DOMAIN="Enter your domain name (e.g., susaprogramming.com): "

if "%DOMAIN%"=="" (
    echo Error: Domain name is required!
    pause
    exit /b 1
)

echo.
echo Adding domain: %DOMAIN%
echo.

echo Step 1: Adding custom domain to Firebase Hosting...
npx firebase-tools hosting:channel:deploy live --project susa-programming-language

echo.
echo Step 2: Adding custom domain...
echo Note: This will provide DNS configuration instructions
npx firebase-tools hosting:sites:create %DOMAIN% --project susa-programming-language

echo.
echo ✅ Domain setup initiated!
echo.
echo NEXT STEPS:
echo 1. Go to Firebase Console: https://console.firebase.google.com/project/susa-programming-language/hosting
echo 2. Click "Add custom domain"
echo 3. Enter your domain: %DOMAIN%
echo 4. Follow DNS configuration instructions
echo 5. Wait for SSL certificate provisioning (can take up to 24 hours)
echo.
echo Your SUSA website will then be available at: https://%DOMAIN%
echo.
pause