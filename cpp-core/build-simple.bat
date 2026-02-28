@echo off
REM Simple SUSA C++ Core Build Script (No CMake Required)
REM Uses g++ directly

echo ========================================
echo SUSA C++ Core - Simple Build
echo ========================================
echo.

REM Check if g++ is available
where g++ >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: g++ compiler not found
    echo.
    echo Please install MinGW-w64 from:
    echo https://sourceforge.net/projects/mingw-w64/
    echo.
    pause
    exit /b 1
)

echo Found g++ compiler:
g++ --version | findstr "g++"
echo.

echo [1/2] Compiling SUSA C++ interpreter...
g++ -std=c++17 -O3 -march=native -DNDEBUG main.cpp -o susa-cpp.exe

if %errorlevel% neq 0 (
    echo.
    echo Error: Compilation failed
    echo.
    pause
    exit /b 1
)

echo [2/2] Moving executable to parent directory...
if exist susa-cpp.exe (
    move /Y susa-cpp.exe .. >nul
    echo.
    echo ========================================
    echo Build completed successfully!
    echo ========================================
    echo.
    echo Executable: ..\susa-cpp.exe
    echo Size: 
    dir ..\susa-cpp.exe | findstr "susa-cpp.exe"
    echo.
    echo Test it with:
    echo   cd ..
    echo   .\susa-cpp.exe --version
    echo   .\susa-cpp.exe cpp-core\test.susa
    echo.
) else (
    echo Error: Executable not created
    pause
    exit /b 1
)

pause
