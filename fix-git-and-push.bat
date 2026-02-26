@echo off
echo ========================================
echo Fixing Git Repository - Removing Large Files
echo ========================================
echo.

echo Step 1: Removing large files from Git cache...
git rm -r --cached Output >nul 2>&1
git rm -r --cached susa-ide/remix-of-susa-studio-ide-main/dist-electron >nul 2>&1
git rm -r --cached susa-ide/remix-of-susa-studio-ide-main/node_modules >nul 2>&1
git rm -r --cached susa-setup >nul 2>&1
git rm -r --cached SUSA-CLI-Package >nul 2>&1
git rm -r --cached temp-complete-installer >nul 2>&1
git rm --cached *.exe >nul 2>&1
git rm --cached *.zip >nul 2>&1

echo ✓ Large files removed from Git
echo.

echo Step 2: Adding .gitignore...
git add .gitignore

echo Step 3: Adding source files only...
git add cpp-core/*.cpp cpp-core/*.hpp cpp-core/*.h
git add modules/
git add examples/
git add docs/
git add *.md
git add *.sh
git add *.bat
git add .github/

echo ✓ Source files added
echo.

echo Step 4: Creating new commit...
git commit -m "SUSA v1.0.0 - Source code only (installers built by GitHub Actions)"

echo.
echo Step 5: Force pushing to GitHub...
git push -u origin main --force

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Successfully pushed!
    echo.
    echo Step 6: Creating release tag...
    git tag -a v1.0.0 -m "SUSA v1.0.0 - First stable release"
    git push origin v1.0.0
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ========================================
        echo ✓ SUCCESS!
        echo ========================================
        echo.
        echo Repository: https://github.com/saketh-nandu/susa1
        echo.
        echo GitHub Actions will now build:
        echo   • Windows binaries
        echo   • Linux binaries and packages
        echo   • macOS binaries and packages
        echo.
        echo Check progress:
        echo   https://github.com/saketh-nandu/susa1/actions
        echo.
        echo Download binaries (in ~15 minutes):
        echo   https://github.com/saketh-nandu/susa1/releases
        echo.
    )
) else (
    echo.
    echo ERROR: Push failed!
    echo Please check the error message above.
    echo.
)

pause
