#!/bin/bash
# SUSA Build Script
# Universal build script for all platforms

set -e  # Exit on error

echo "========================================="
echo "Building SUSA Programming Language"
echo "========================================="

# Detect platform
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    PLATFORM="Windows"
    TARGET="susa.exe"
    COMPILER="g++"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    PLATFORM="macOS"
    TARGET="susa"
    COMPILER="clang++"
else
    PLATFORM="Linux"
    TARGET="susa"
    COMPILER="g++"
fi

echo "Platform: $PLATFORM"
echo "Target: $TARGET"
echo "Compiler: $COMPILER"
echo ""

# Check if source file exists
if [ ! -f "main.cpp" ]; then
    echo "Error: main.cpp not found!"
    exit 1
fi

# Check if executable already exists
if [ -f "$TARGET" ]; then
    echo "Existing $TARGET found. Removing..."
    rm -f "$TARGET"
fi

# Build
echo "Compiling..."
$COMPILER -std=c++17 -Wall -Wextra -O2 -o "$TARGET" main.cpp

# Verify build
if [ -f "$TARGET" ]; then
    echo ""
    echo "========================================="
    echo "✅ Build successful!"
    echo "========================================="
    echo "Executable: $TARGET"
    ls -lh "$TARGET"
    echo ""
    echo "Run with: ./$TARGET"
else
    echo ""
    echo "========================================="
    echo "❌ Build failed!"
    echo "========================================="
    exit 1
fi
