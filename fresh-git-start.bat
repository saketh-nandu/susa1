@echo off
echo ========================================
echo SUSA - Fresh Git Start (Clean)
echo ========================================
echo.
echo This will create a completely fresh Git repository
echo with ONLY source code (no large files).
echo.
pause

echo Step 1: Backing up .git folder...
if exist ".git" (
    if exist ".git.backup" rmdir /s /q ".git.backup"
    move ".git" ".git.backup" >nul
    echo ✓ Backup created
) else (
    echo No existing .git folder
)
echo.

echo Step 2: Creating fresh Git repository...
git init
git branch -M main
echo ✓ Fresh repository created
echo.

echo Step 3: Adding ONLY source files...
git add .gitignore
git add cpp-core/*.cpp cpp-core/*.hpp cpp-core/*.h
git add modules/
git add examples/
git add docs/
git add *.md
git add *.sh
git add *.bat
git add .github/
git add LICENSE
git add susa.rb
echo ✓ Source files added
echo.

echo Step 4: Creating commit...
git commit -m "SUSA v1.0.0 - Source code only (clean start)"
echo ✓ Commit created
echo.

echo Step 5: Adding GitHub remote...
git remote add origin https://github.com/saketh-nandu/susa1.git
echo ✓ Remote added
echo.

echo Step 6: Pushing to GitHub...
git push -u origin main --force

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✓ SUCCESS!
    echo ========================================
    echo.
    echo Source code pushed successfully!
    echo Repository size: ~50 MB (source only)
    echo.
    echo Next steps:
    echo 1. Go to: https://github.com/saketh-nandu/susa1/releases
    echo 2. Click "Create a new release"
    echo 3. Tag: v1.0.0
    echo 4. Upload Windows installers from Output folder
    echo 5. Publish release
    echo.
    echo GitHub Actions will build Linux and macOS versions!
    echo.
    
    REM Clean up backup
    if exist ".git.backup" (
        echo Cleaning up backup...
        rmdir /s /q ".git.backup"
    )
) else (
    echo.
    echo ERROR: Push failed!
    echo.
    echo Restoring backup...
    if exist ".git.backup" (
        if exist ".git" rmdir /s /q ".git"
        move ".git.backup" ".git" >nul
        echo ✓ Backup restored
    )
    echo.
)

pause
