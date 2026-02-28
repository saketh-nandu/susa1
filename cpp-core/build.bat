@echo off
REM SUSA Build Script for Windows
REM Simple build script using MinGW

echo =========================================
echo Building SUSA Programming Language
echo =========================================
echo.

REM Check if main.cpp exists
if not exist "main.cpp" (
    echo Error: main.cpp not found!
    exit /b 1
)

REM Remove old executable
if exist "susa.exe" (
    echo Removing old susa.exe...
    del /F /Q susa.exe
)

REM Build
echo Compiling with g++...
g++ -std=c++17 -Wall -Wextra -O2 -o susa.exe main.cpp

REM Check if build succeeded
if exist "susa.exe" (
    echo.
    echo =========================================
    echo Build successful!
    echo =========================================
    echo Executable: susa.exe
    dir susa.exe
    echo.
    echo Run with: susa.exe
) else (
    echo.
    echo =========================================
    echo Build failed!
    echo =========================================
    exit /b 1
)
