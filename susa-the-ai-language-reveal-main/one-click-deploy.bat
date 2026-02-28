@echo off
title SUSA Website - Firebase Deployment
color 0A

echo.
echo  ███████╗██╗   ██╗███████╗ █████╗ 
echo  ██╔════╝██║   ██║██╔════╝██╔══██╗
echo  ███████╗██║   ██║███████╗███████║
echo  ╚════██║██║   ██║╚════██║██╔══██║
echo  ███████║╚██████╔╝███████║██║  ██║
echo  ╚══════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝
echo.
echo  Firebase Hosting Deployment
echo  ═══════════════════════════════════
echo.

echo Checking Firebase CLI installation...
firebase --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Firebase CLI not found!
    echo.
    echo Installing Firebase CLI...
    call npm install -g firebase-tools
    if errorlevel 1 (
        echo ❌ Failed to install Firebase CLI
        echo Please run as administrator
        pause
        exit /b 1
    )
    echo ✅ Firebase CLI installed successfully!
    echo.
)

echo ✅ Firebase CLI is ready!
echo.

echo Checking if you're logged in to Firebase...
firebase projects:list >nul 2>&1
if errorlevel 1 (
    echo ❌ Not logged in to Firebase
    echo.
    echo Opening browser for Firebase login...
    call firebase login
    if errorlevel 1 (
        echo ❌ Login failed
        pause
        exit /b 1
    )
    echo ✅ Successfully logged in!
    echo.
)

echo ✅ Firebase authentication verified!
echo.

echo Building SUSA website...
call npm run build
if errorlevel 1 (
    echo ❌ Build failed!
    echo Please check for errors and try again
    pause
    exit /b 1
)

echo ✅ Build completed successfully!
echo.

echo Deploying to Firebase Hosting...
call firebase deploy --only hosting
if errorlevel 1 (
    echo ❌ Deployment failed!
    echo.
    echo This might be because:
    echo 1. Project doesn't exist - create it at https://console.firebase.google.com/
    echo 2. Hosting not initialized - run: firebase init hosting
    echo 3. No permission - check project access
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ 🎉 SUSA Website deployed successfully! 🎉
echo.
echo Your website is now live at:
echo 🌐 https://susa-programming-language.web.app
echo 🌐 https://susa-programming-language.firebaseapp.com
echo.
echo Share your amazing SUSA programming language with the world!
echo.
pause