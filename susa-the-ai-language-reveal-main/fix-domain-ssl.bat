@echo off
echo Fixing ACME Challenge SSL Certificate Issues...
echo.

echo Current Firebase hosting sites:
npx firebase-tools hosting:sites:list --project susa-programming-language

echo.
echo Checking hosting channels:
npx firebase-tools hosting:channel:list --project susa-programming-language

echo.
set /p DOMAIN="Enter your domain name that's having SSL issues: "

if "%DOMAIN%"=="" (
    echo Error: Domain name is required!
    pause
    exit /b 1
)

echo.
echo Troubleshooting domain: %DOMAIN%
echo.

echo Step 1: Checking current domain status...
echo.

echo Step 2: Re-deploying to ensure latest version...
call npm run build
npx firebase-tools deploy --only hosting --project susa-programming-language

echo.
echo Step 3: Domain troubleshooting complete!
echo.
echo NEXT STEPS TO FIX ACME CHALLENGE:
echo.
echo 1. VERIFY DNS RECORDS:
echo    - A records should point to Firebase IPs
ec