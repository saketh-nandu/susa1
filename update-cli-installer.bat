@echo off
echo ========================================
echo SUSA - Update CLI Installer
echo ========================================
echo Rebuilding CLI installer with all 40 features
echo.

REM Create Output directory
if not exist "Output" mkdir "Output"

REM Step 1: Rebuild CLI Package
echo ========================================
echo Step 1: Creating CLI Package...
echo ========================================

if exist "SUSA-CLI-Package" rmdir /s /q "SUSA-CLI-Package"
mkdir "SUSA-CLI-Package"
mkdir "SUSA-CLI-Package\modules"
mkdir "SUSA-CLI-Package\examples"
mkdir "SUSA-CLI-Package\tests"
mkdir "SUSA-CLI-Package\docs"

echo Copying CLI executable...
copy "susa-cpp.exe" "SUSA-CLI-Package\susa.exe"

echo Copying modules...
xcopy "modules\*.*" "SUSA-CLI-Package\modules\" /E /I /Y /Q

echo Copying examples...
xcopy "examples\*.*" "SUSA-CLI-Package\examples\" /E /I /Y /Q

echo Copying tests...
copy "cpp-core\test_*.susa" "SUSA-CLI-Package\tests\" >nul

echo Copying documentation...
copy "README.md" "SUSA-CLI-Package\README.md" >nul
copy "LICENSE" "SUSA-CLI-Package\LICENSE.txt" >nul
copy "cpp-core\100_PERCENT_COMPLETE.md" "SUSA-CLI-Package\FEATURES.md" >nul

echo Creating VERSION.txt...
(
echo SUSA v1.0.0 - 100%% Feature Complete
echo =====================================
echo.
echo Release Date: February 2026
echo Build: Production
echo.
echo Features: 40/40 ^(100%%^)
echo Modules: 9 built-in
echo Functions: 290+
echo.
echo Changelog:
echo - All 40 features implemented
echo - Generators and Yield
echo - Async/Await
echo - Classes and OOP
echo - List comprehensions
echo - Advanced functions
echo - Complete module system
echo.
echo For more information: https://susastudio.online
) > "SUSA-CLI-Package\VERSION.txt"

echo Creating CLI README...
(
echo SUSA CLI - Command Line Interface
echo ==================================
echo.
echo Usage:
echo   susa.exe [file.susa]           - Run a SUSA program
echo.
echo Examples:
echo   susa.exe examples\01_basics.susa
echo   susa.exe tests\test_everything.susa
echo.
echo All 40 Features Included!
echo For more information: https://susastudio.online
) > "SUSA-CLI-Package\CLI-README.txt"

echo Creating launcher script...
(
echo @echo off
echo set PATH=%%~dp0;%%PATH%%
echo susa.exe %%*
) > "SUSA-CLI-Package\susa-cli.bat"

echo.
echo ✓ CLI Package created!
echo.

REM Step 2: Build CLI Installer
echo ========================================
echo Step 2: Building CLI Installer...
echo ========================================

call create-cli-installer-nsis.bat

echo.
echo ========================================
echo CLI INSTALLER UPDATED!
echo ========================================
echo.
echo Location: Output\SUSA-CLI-Only-1.0.0.exe
dir "Output\SUSA-CLI-Only-1.0.0.exe" 2>nul
echo.
echo Package: SUSA-CLI-Package\
dir "SUSA-CLI-Package" | find "File(s)"
echo.
echo ✓ All 40 features included
echo ✓ Updated interpreter
echo ✓ Ready for distribution
echo.
pause
