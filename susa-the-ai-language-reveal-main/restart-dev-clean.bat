@echo off
echo ========================================
echo   SUSA Website - Clean Restart
echo ========================================
echo.

echo Stopping any running dev servers...
taskkill /F /IM node.exe 2>nul

echo.
echo Cleaning cache and build files...
if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite"
if exist "dist" rmdir /s /q "dist"

echo.
echo Starting fresh development server...
echo.
echo The website will open at: http://localhost:8080/
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev
