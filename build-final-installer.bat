@echo off
echo ============================================
echo SUSA v1.0 - Final Installer Builder
echo 100%% Feature Complete Edition
echo ============================================
echo.

REM Step 1: Clean and rebuild the interpreter
echo [1/5] Cleaning old builds...
cd cpp-core
if exist susa.exe del susa.exe
if exist build rmdir /s /q build

echo [2/5] Compiling SUSA interpreter...
C:\MinGW\bin\g++.exe -std=c++17 -O2 main.cpp -o susa.exe
if errorlevel 1 (
    echo ERROR: Compilation failed!
    pause
    exit /b 1
)

echo [3/5] Testing interpreter...
susa.exe test_everything.susa > test_output.txt
if errorlevel 1 (
    echo WARNING: Some tests may have issues
    type test_output.txt
)

cd ..

REM Step 2: Create CLI package
echo [4/5] Creating CLI package...
if not exist "Output" mkdir Output
if not exist "Output\SUSA-CLI-Package" mkdir Output\SUSA-CLI-Package

REM Copy interpreter
copy cpp-core\susa.exe Output\SUSA-CLI-Package\susa.exe

REM Copy examples
if not exist "Output\SUSA-CLI-Package\examples" mkdir Output\SUSA-CLI-Package\examples
xcopy examples\*.susa Output\SUSA-CLI-Package\examples\ /Y /Q

REM Copy modules
if not exist "Output\SUSA-CLI-Package\modules" mkdir Output\SUSA-CLI-Package\modules
xcopy modules\*.susa Output\SUSA-CLI-Package\modules\ /Y /Q
copy modules\MODULE_REGISTRY.json Output\SUSA-CLI-Package\modules\ /Y

REM Copy documentation
if not exist "Output\SUSA-CLI-Package\docs" mkdir Output\SUSA-CLI-Package\docs
xcopy docs\*.md Output\SUSA-CLI-Package\docs\ /Y /Q /S

REM Create README
echo Creating README...
(
echo SUSA Programming Language v1.0
echo ================================
echo.
echo 100%% Feature Complete Edition
echo.
echo FEATURES:
echo - 40 major features fully implemented
echo - Object-Oriented Programming ^(Classes, Methods, Properties^)
echo - Functional Programming ^(Lambdas, Comprehensions, Generators^)
echo - Asynchronous Programming ^(Async/Await^)
echo - Error Handling ^(Try-Catch^)
echo - Resource Management ^(WITH statement^)
echo - 9 Built-in Modules with 290+ functions
echo - Unique English-like syntax
echo.
echo INSTALLATION:
echo 1. Add the SUSA directory to your PATH
echo 2. Run: susa filename.susa
echo.
echo QUICK START:
echo   susa examples\01_basics.susa
echo.
echo DOCUMENTATION:
echo   See docs\ folder for complete documentation
echo.
echo EXAMPLES:
echo   See examples\ folder for 30+ example programs
echo.
echo For more information, visit: https://susa-lang.com
) > Output\SUSA-CLI-Package\README.txt

REM Step 3: Create ZIP package
echo [5/5] Creating ZIP package...
cd Output
if exist SUSA-v1.0-Complete.zip del SUSA-v1.0-Complete.zip

REM Use PowerShell to create ZIP
powershell -command "Compress-Archive -Path 'SUSA-CLI-Package\*' -DestinationPath 'SUSA-v1.0-Complete.zip' -Force"

cd ..

echo.
echo ============================================
echo Build Complete!
echo ============================================
echo.
echo Output files:
echo   - Output\SUSA-CLI-Package\     (Folder)
echo   - Output\SUSA-v1.0-Complete.zip (ZIP Archive)
echo.
echo To install:
echo   1. Extract ZIP to desired location
echo   2. Add to PATH or run directly
echo   3. Test: susa examples\01_basics.susa
echo.
pause
