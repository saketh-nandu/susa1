@echo off
echo Building SUSA C++ Core (Static - No DLL Dependencies)...
echo.

REM Build with static linking to avoid DLL dependencies
g++ -std=c++17 -O2 -static-libgcc -static-libstdc++ main.cpp -o susa.exe

if %errorlevel% equ 0 (
    echo Build successful!
    echo.
    echo Testing...
    echo.
    echo Test 1: Version
    .\susa.exe --version
    echo.
    echo Test 2: Help
    .\susa.exe --help
    echo.
    echo Test 3: Simple print
    .\susa.exe -e "PRINT 'SUSA is working!'"
    echo.
    echo Done! susa.exe is ready (no DLL dependencies).
    echo.
    echo You can now use: susa --version, susa --help, susa run file.susa
) else (
    echo Build failed!
    echo Make sure MinGW is installed and in your PATH.
)

pause
