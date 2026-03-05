@echo off
REM SUSA Website Deployment Script

echo ========================================
echo SUSA Website Deployment
echo ========================================
echo.

cd susa-the-ai-language-reveal-main

echo [1/4] Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: npm install failed!
    pause
    exit /b 1
)

echo.
echo [2/4] Building website...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo [3/4] Testing build...
echo Build output is in: dist/
dir dist

echo.
echo [4/4] Ready to deploy!
echo.
echo ========================================
echo Choose deployment method:
echo ========================================
echo.
echo 1. Vercel (Recommended - Fast & Free)
echo 2. Firebase (Current hosting)
echo 3. Netlify (Alternative)
echo 4. Manual (Copy dist/ folder)
echo.
set /p choice="Enter choice (1-4): "

if "%choice%"=="1" (
    echo.
    echo Deploying to Vercel...
    echo.
    echo Run: vercel --prod
    echo.
    echo If you don't have Vercel CLI:
    echo   npm install -g vercel
    echo   vercel login
    echo   vercel --prod
    echo.
    pause
    vercel --prod
)

if "%choice%"=="2" (
    echo.
    echo Deploying to Firebase...
    echo.
    echo Run: firebase deploy
    echo.
    echo If you don't have Firebase CLI:
    echo   npm install -g firebase-tools
    echo   firebase login
    echo   firebase deploy
    echo.
    pause
    firebase deploy
)

if "%choice%"=="3" (
    echo.
    echo Deploying to Netlify...
    echo.
    echo Run: netlify deploy --prod --dir=dist
    echo.
    echo If you don't have Netlify CLI:
    echo   npm install -g netlify-cli
    echo   netlify login
    echo   netlify deploy --prod --dir=dist
    echo.
    pause
    netlify deploy --prod --dir=dist
)

if "%choice%"=="4" (
    echo.
    echo Manual deployment:
    echo.
    echo 1. Copy the dist/ folder to your web server
    echo 2. Upload to your hosting provider
    echo 3. Point your domain to the dist/ folder
    echo.
    echo The dist/ folder contains all website files.
    echo.
    explorer dist
)

echo.
echo ========================================
echo Deployment process complete!
echo ========================================
echo.
echo Website updated with new installer link:
echo https://www.dropbox.com/scl/fi/9fbeezjwdqed7kzfvh72d/SUSA-Setup.exe
echo.
echo Test the download link after deployment!
echo.

pause
