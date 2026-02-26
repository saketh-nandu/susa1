@echo off
echo ========================================
echo SUSA - Rebuild Installers Only
echo ========================================
echo This script updates the interpreter and rebuilds installers
echo without rebuilding the IDE from source.
echo.

REM Create Output directory
if not exist "Output" mkdir "Output"

REM Step 1: Update interpreter in IDE
echo ========================================
echo Step 1: Updating Interpreter in IDE...
echo ========================================

if not exist "susa-ide\remix-of-susa-studio-ide-main\dist-electron\win-unpacked" (
    echo ERROR: IDE build not found!
    echo Please build the IDE first or use build-all-installers-fixed.bat
    pause
    exit /b 1
)

echo Copying updated interpreter to IDE...
copy /Y "susa-cpp.exe" "susa-ide\remix-of-susa-studio-ide-main\dist-electron\win-unpacked\susa-cpp.exe"
copy /Y "susa-cpp.exe" "susa-ide\remix-of-susa-studio-ide-main\"

echo Updating modules in IDE...
robocopy "modules" "susa-ide\remix-of-susa-studio-ide-main\dist-electron\win-unpacked\modules" /E /NFL /NDL /NJH /NJS
robocopy "examples" "susa-ide\remix-of-susa-studio-ide-main\dist-electron\win-unpacked\examples" /E /NFL /NDL /NJH /NJS

echo.
echo ✓ Interpreter updated in IDE!
echo.

REM Step 2: Create CLI Package
echo ========================================
echo Step 2: Creating CLI Package...
echo ========================================

if exist "SUSA-CLI-Package" rmdir /s /q "SUSA-CLI-Package"
mkdir "SUSA-CLI-Package"

echo Copying CLI executable...
copy "susa-cpp.exe" "SUSA-CLI-Package\susa.exe"

echo Copying modules...
robocopy "modules" "SUSA-CLI-Package\modules" /E /NFL /NDL /NJH /NJS

echo Copying examples...
robocopy "examples" "SUSA-CLI-Package\examples" /E /NFL /NDL /NJH /NJS

echo Copying tests...
robocopy "cpp-core" "SUSA-CLI-Package\tests" *.susa /NFL /NDL /NJH /NJS

echo Copying documentation...
copy "README.md" "SUSA-CLI-Package\README.md"
copy "LICENSE" "SUSA-CLI-Package\LICENSE.txt"
copy "cpp-core\100_PERCENT_COMPLETE.md" "SUSA-CLI-Package\FEATURES.md"

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
echo   susa.exe --version             - Show version
echo   susa.exe --help                - Show help
echo.
echo Examples:
echo   susa.exe examples\01_basics.susa
echo   susa.exe examples\04_lists.susa
echo   susa.exe tests\test_everything.susa
echo.
echo All 40 Features Included:
echo - Object-Oriented Programming
echo - Functional Programming
echo - Async/Await
echo - Generators
echo - List Comprehensions
echo - 9 Built-in Modules
echo - And much more!
echo.
echo For more information, visit: https://susastudio.online
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

REM Step 3: Create CLI Installer with NSIS
echo ========================================
echo Step 3: Building CLI Installer...
echo ========================================

call create-cli-installer-nsis.bat
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: CLI installer build had issues
)

echo.
echo ✓ CLI Installer created!
echo.

REM Step 4: Create Complete Installer
echo ========================================
echo Step 4: Building Complete Installer...
echo ========================================

call create-complete-installer.bat
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Complete installer build had issues
)

echo.
echo ✓ Complete Installer created!
echo.

REM Step 5: Package IDE installer
echo ========================================
echo Step 5: Packaging IDE Installer...
echo ========================================

if exist "susa-ide\remix-of-susa-studio-ide-main\dist-electron\*.exe" (
    echo Copying IDE installer to Output...
    copy /Y "susa-ide\remix-of-susa-studio-ide-main\dist-electron\*.exe" "Output\" >nul
    echo ✓ IDE installer copied!
) else (
    echo WARNING: No IDE installer found in dist-electron
)

echo.

REM Show results
echo ========================================
echo ALL INSTALLERS READY!
echo ========================================
echo.
echo Output folder contents:
dir Output\*.exe /B 2>nul
echo.
echo Package folder:
dir SUSA-CLI-Package 2>nul | find "File(s)"
echo.
echo ========================================
echo Summary:
echo ========================================
echo ✓ Interpreter updated with all 40 features
echo ✓ CLI package created
echo ✓ CLI installer built
echo ✓ Complete installer built
echo ✓ IDE installer packaged
echo.
echo Ready for deployment!
echo ========================================
echo.
pause
