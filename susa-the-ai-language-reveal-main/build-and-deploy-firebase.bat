@echo off
echo ========================================
echo SUSA Website - Build and Deploy
echo ========================================
echo.
echo This script will:
echo 1. Install dependencies
echo 2. Build the website
echo 3. Deploy to Firebase
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause >nul
echo.

echo ========================================
echo Step 1: Installing Dependencies
echo ========================================
call npm install
if errorlevel 1 (
    echo.
    echo ERROR: Failed to install dependencies!
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)
echo ✓ Dependencies installed successfully
echo.

echo ========================================
echo Step 2: Building Website
echo ========================================
call npm run build
if errorlevel 1 (
    echo.
    echo ERROR: Build failed!
    echo Please check the error messages above.
    echo Common issues:
    echo - TypeScript errors in code
    echo - Missing dependencies
    echo - Syntax errors
    pause
    exit /b 1
)
echo ✓ Build completed successfully
echo.

echo ========================================
echo Step 3: Verifying Build Output
echo ========================================
if not exist "dist\" (
    echo ERROR: dist folder not found!
    echo The build may have failed silently.
    pause
    exit /b 1
)
if not exist "dist\index.html" (
    echo ERROR: index.html not found in dist folder!
    pause
    exit /b 1
)
echo ✓ Build output verified
echo.

echo ========================================
echo Step 4: Deploying to Firebase
echo ========================================
echo.
echo Checking Firebase CLI...
firebase --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo WARNING: Firebase CLI not found!
    echo.
    echo Please install Firebase CLI first:
    echo   npm install -g firebase-tools
    echo.
    echo Then login:
    echo   firebase login
    echo.
    echo Then run this script again.
    pause
    exit /b 1
)
echo ✓ Firebase CLI found
echo.

echo Deploying to Firebase Hosting...
call firebase deploy --only hosting
if errorlevel 1 (
    echo.
    echo ERROR: Deployment failed!
    echo.
    echo Common issues:
    echo - Not logged in: Run 'firebase login'
    echo - Wrong project: Run 'firebase use --add'
    echo - Permission denied: Check Firebase project settings
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✓ DEPLOYMENT SUCCESSFUL!
echo ========================================
echo.
echo Your website has been deployed!
echo.
echo Next steps:
echo 1. Visit your Firebase Console to get the URL
echo 2. Test the deployed website
echo 3. Verify all modules display correctly
echo 4. Check that examples use correct ADD syntax
echo.
echo Firebase Console:
echo https://console.firebase.google.com
echo.
pause
