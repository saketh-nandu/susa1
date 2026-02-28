@echo off
echo Building SUSA Website for Firebase Hosting...
echo.

echo Step 1: Building the project...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Deploying to Firebase Hosting...
echo Make sure you're logged in to Firebase CLI first!
echo.

echo If you haven't logged in yet, run: firebase login
echo If you haven't initialized the project, run: firebase init hosting
echo.

firebase deploy --only hosting

if errorlevel 1 (
    echo ERROR: Deployment failed!
    echo Make sure you have:
    echo 1. Firebase CLI installed: npm install -g firebase-tools
    echo 2. Logged in: firebase login
    echo 3. Project initialized: firebase init hosting
    pause
    exit /b 1
)

echo.
echo ✅ SUSA Website deployed successfully!
echo Your website is now live on Firebase Hosting!
echo.
pause