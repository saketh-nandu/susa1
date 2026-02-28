@echo off
echo Building SUSA C++ Core (Final Version)...
echo.

g++ -std=c++17 -O2 main.cpp -o susa-cpp.exe

if %errorlevel% equ 0 (
    echo Build successful!
    move /Y susa-cpp.exe .. >nul
    echo.
    echo Testing...
    cd ..
    echo.
    echo Test 1: Version
    .\susa-cpp.exe --version
    echo.
    echo Test 2: Simple print
    .\susa-cpp.exe -e "print 'C++ Core Working!'"
    echo.
    echo Test 3: Math
    .\susa-cpp.exe -e "print 2 + 2"
    echo.
    echo Done! susa-cpp.exe is ready.
) else (
    echo Build failed!
)

pause
