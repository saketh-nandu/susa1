@echo off
echo Building SUSA IDE for Production...
echo.

echo Step 1: Installing dependencies...
call npm install

echo.
echo Step 2: Building React app...
call npm run build

echo.
echo Step 3: Building Electron app...
call npm run dist

echo.
echo Production build complete!
echo Check the dist-electron folder for the installer.
pause