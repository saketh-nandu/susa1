@echo off
echo ========================================
echo SUSA - Push Source Code to GitHub
echo ========================================
echo.
echo This will push ONLY source code (no large installers)
echo You'll upload installers manually to GitHub Releases
echo.
pause

echo Step 1: Removing large files from Git...
git rm -r --cached Output 2>nul
git rm -r --cached susa-ide/remix-of-susa-studio-ide-main/dist-electron 2>nul
git rm -r --cached susa-ide/remix-of-susa-studio-ide-main/node_modules 2>nul
git rm -r --cached susa-setup 2>nul
git rm -r --cached SUSA-CLI-Package 2>nul
git rm --cached *.exe 2>nul
git rm --cached *.zip 2>nul
echo ✓ Done
echo.

echo Step 2: Adding .gitignore...
git add .gitignore
echo ✓ Done
echo.

echo Step 3: Adding source files...
git add cpp-core/*.cpp cpp-core/*.hpp cpp-core/*.h 2>nul
git add modules/ 2>nul
git add examples/ 2>nul
git add docs/ 2>nul
git add *.md 2>nul
git add *.sh 2>nul
git add *.bat 2>nul
git add .github/ 2>nul
git add LICENSE 2>nul
git add susa.rb 2>nul
echo ✓ Done
echo.

echo Step 4: Creating commit...
git commit -m "SUSA v1.0.0 - Source code (installers uploaded to Releases)"
echo.

echo Step 5: Pushing to GitHub...
git push -u origin main --force

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✓ Source Code Pushed Successfully!
    echo ========================================
    echo.
    echo Next Steps:
    echo.
    echo 1. Go to: https://github.com/saketh-nandu/susa1
    echo 2. Click "Releases" (right sidebar)
    echo 3. Click "Create a new release"
    echo 4. Tag: v1.0.0
    echo 5. Title: SUSA v1.0.0 - First Stable Release
    echo 6. Upload these files from Output folder:
    echo    - SUSA-CLI-Only-1.0.0.exe
    echo    - SUSA-IDE-Desktop-App-1.0.0.exe
    echo    - SUSA-Complete-Setup-1.0.0.exe
    echo 7. Click "Publish release"
    echo.
    echo GitHub Actions will then build Linux and macOS versions!
    echo.
    echo See MANUAL-RELEASE-GUIDE.md for detailed instructions.
    echo.
) else (
    echo.
    echo ERROR: Push failed!
    echo Please check the error message above.
    echo.
)

pause
