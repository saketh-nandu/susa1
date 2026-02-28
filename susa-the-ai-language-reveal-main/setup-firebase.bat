@echo off
echo Setting up Firebase Hosting for SUSA Website...
echo.

echo Step 1: Installing Firebase CLI...
call npm install -g firebase-tools
if errorlevel 1 (
    echo ERROR: Failed to install Firebase CLI!
    echo Please run as administrator or install manually
    pause
    exit /b 1
)

echo.
echo Step 2: Logging in to Firebase...
echo This will open your browser for authentication...
call firebase login

echo.
echo Step 3: Creating Firebase project...
echo Please follow these steps:
echo 1. Go to https://console.firebase.google.com/
echo 2. Click "Create a project"
echo 3. Enter project name: susa-programming-language
echo 4. Continue through the setup
echo 5. Enable Firebase Hosting in the console
echo.
pause

echo Step 4: Initializing Firebase in this project...
call firebase init hosting

echo.
echo ✅ Firebase setup complete!
echo Now you can run deploy.bat to deploy your website
echo.
pause