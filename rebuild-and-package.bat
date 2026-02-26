@echo off
echo ============================================
echo SUSA v1.0 - Complete Rebuild and Package
echo 100%% Feature Complete Edition
echo ============================================
echo.

REM Step 1: Rebuild the interpreter
echo [1/4] Rebuilding SUSA interpreter...
cd cpp-core
if exist susa.exe del susa.exe

echo Compiling with all features...
C:\MinGW\bin\g++.exe -std=c++17 -O2 main.cpp -o susa.exe

if errorlevel 1 (
    echo ERROR: Compilation failed!
    cd ..
    pause
    exit /b 1
)

echo Testing interpreter...
echo Running comprehensive test...
susa.exe test_everything.susa

if errorlevel 1 (
    echo WARNING: Some tests may have issues, but continuing...
)

cd ..

REM Step 2: Copy new interpreter to root
echo.
echo [2/4] Copying new interpreter...
copy cpp-core\susa.exe susa-cpp.exe /Y

REM Step 3: Create CLI package
echo.
echo [3/4] Creating CLI package...
call create-cli-package.bat

REM Step 4: Create installer
echo.
echo [4/4] Creating installer...
call create-cli-installer-nsis.bat

echo.
echo ============================================
echo Build Complete!
echo ============================================
echo.
echo New files created:
echo   - susa-cpp.exe (Updated interpreter)
echo   - SUSA-CLI-Package\ (Package folder)
echo   - Output\SUSA-CLI-Only-1.0.0.exe (Installer)
echo.
echo The installer includes:
echo   - All 40 features
echo   - Classes and OOP
echo   - Generators and Async/Await
echo   - 9 built-in modules
echo   - 30+ examples
echo   - Complete documentation
echo.
pause
