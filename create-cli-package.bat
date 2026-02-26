@echo off
echo ========================================
echo Creating SUSA CLI Package v1.0
echo 100%% Feature Complete Edition
echo ========================================

REM Create CLI package directory
if exist "SUSA-CLI-Package" rmdir /s /q "SUSA-CLI-Package"
mkdir "SUSA-CLI-Package"

REM Copy CLI executable
echo Copying CLI executable...
copy "susa-cpp.exe" "SUSA-CLI-Package\susa.exe"

REM Copy modules
echo Copying modules...
xcopy "modules" "SUSA-CLI-Package\modules\" /E /I /Y

REM Copy examples
echo Copying examples...
xcopy "examples" "SUSA-CLI-Package\examples\" /E /I /Y

REM Copy test files from cpp-core
echo Copying test files...
if not exist "SUSA-CLI-Package\tests" mkdir "SUSA-CLI-Package\tests"
copy "cpp-core\test_classes.susa" "SUSA-CLI-Package\tests\" /Y
copy "cpp-core\test_generators.susa" "SUSA-CLI-Package\tests\" /Y
copy "cpp-core\test_async.susa" "SUSA-CLI-Package\tests\" /Y
copy "cpp-core\test_with_statement.susa" "SUSA-CLI-Package\tests\" /Y
copy "cpp-core\test_everything.susa" "SUSA-CLI-Package\tests\" /Y
copy "cpp-core\test_comprehensions.susa" "SUSA-CLI-Package\tests\" /Y
copy "cpp-core\test_batch_5_features.susa" "SUSA-CLI-Package\tests\" /Y

REM Copy documentation
echo Copying documentation...
xcopy "docs" "SUSA-CLI-Package\docs\" /E /I /Y
copy "README.md" "SUSA-CLI-Package\README.md"
copy "LICENSE" "SUSA-CLI-Package\LICENSE.txt"

REM Copy feature documentation
copy "cpp-core\100_PERCENT_COMPLETE.md" "SUSA-CLI-Package\FEATURES.md" /Y
copy "cpp-core\ALL_FEATURES_COMPLETE.md" "SUSA-CLI-Package\docs\" /Y

REM Create a comprehensive README for CLI
echo Creating CLI README...
(
echo SUSA Programming Language v1.0
echo ================================
echo 100%% Feature Complete Edition
echo.
echo WHAT'S NEW IN v1.0:
echo   - 40 major features fully implemented
echo   - Object-Oriented Programming ^(Classes, Methods, Properties^)
echo   - Functional Programming ^(Lambdas, Comprehensions, Generators^)
echo   - Asynchronous Programming ^(Async/Await^)
echo   - Error Handling ^(Try-Catch, Assertions^)
echo   - Resource Management ^(WITH statement^)
echo   - Advanced Functions ^(Defaults, Varargs, Multiple Returns^)
echo   - Destructuring Assignment
echo   - List Comprehensions
echo   - 9 Built-in Modules with 290+ functions
echo   - Unique English-like syntax
echo.
echo USAGE:
echo   susa.exe [file.susa]           - Run a SUSA program
echo   susa.exe --version             - Show version
echo   susa.exe --help                - Show help
echo.
echo QUICK START:
echo   susa.exe examples\01_basics.susa
echo   susa.exe examples\05_classes.susa
echo   susa.exe tests\test_everything.susa
echo.
echo EXAMPLES:
echo   examples\     - 30+ example programs
echo   tests\        - Feature test files
echo.
echo MODULES:
echo   All 9 core modules are included in the modules\ directory:
echo   - math_utils       - Mathematical functions
echo   - string_utils     - String manipulation
echo   - array_utils      - Array operations
echo   - datetime_utils   - Date and time
echo   - file_utils       - File operations
echo   - json_utils       - JSON parsing
echo   - http_client      - HTTP requests
echo   - data_structures  - Advanced data structures
echo   - algorithms       - Common algorithms
echo.
echo DOCUMENTATION:
echo   docs\              - Complete documentation
echo   FEATURES.md        - All 40 features explained
echo   README.md          - Getting started guide
echo.
echo For more information, visit: https://susastudio.online
echo.
echo ================================
echo SUSA v1.0 - Production Ready!
echo ================================
) > "SUSA-CLI-Package\CLI-README.txt"

REM Create batch file for easy access
echo Creating launcher script...
(
echo @echo off
echo set PATH=%%~dp0;%%PATH%%
echo susa.exe %%*
) > "SUSA-CLI-Package\susa-cli.bat"

REM Create version file
echo Creating version file...
(
echo SUSA Programming Language
echo Version: 1.0.0
echo Build: Final Release
echo Date: 2024
echo Features: 40/40 ^(100%% Complete^)
echo.
echo Changelog:
echo - All 40 features implemented
echo - Classes and OOP support
echo - Generators with YIELD
echo - Async/Await support
echo - List comprehensions
echo - Destructuring
echo - Default parameters
echo - Variable arguments
echo - Multiple return values
echo - WITH statement
echo - 9 built-in modules
echo - 290+ functions
echo.
echo Status: Production Ready
) > "SUSA-CLI-Package\VERSION.txt"

echo.
echo ========================================
echo CLI Package created successfully!
echo ========================================
echo Location: SUSA-CLI-Package\
echo.
echo Contents:
echo   - susa.exe (Interpreter)
echo   - modules\ (9 modules)
echo   - examples\ (30+ examples)
echo   - tests\ (Feature tests)
echo   - docs\ (Documentation)
echo   - CLI-README.txt
echo   - VERSION.txt
echo.
echo To create installer, run:
echo   create-cli-installer-nsis.bat
echo.
pause
