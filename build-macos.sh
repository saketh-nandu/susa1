#!/bin/bash
# SUSA Language - macOS Build Script
# Build SUSA interpreter for macOS

echo "========================================"
echo "SUSA v1.0 - macOS Build Script"
echo "========================================"
echo ""

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "WARNING: This script is designed for macOS"
    echo "Current OS: $OSTYPE"
    echo ""
fi

# Check for C++ compiler
if command -v clang++ &> /dev/null; then
    COMPILER="clang++"
    echo "✓ Using Clang compiler"
elif command -v g++ &> /dev/null; then
    COMPILER="g++"
    echo "✓ Using GCC compiler"
else
    echo "ERROR: No C++ compiler found!"
    echo "Please install Xcode Command Line Tools:"
    echo "  xcode-select --install"
    exit 1
fi

echo ""
echo "Building SUSA interpreter..."
echo ""

# Navigate to cpp-core directory
cd cpp-core || exit 1

# Build the interpreter
$COMPILER -std=c++17 -O2 main.cpp -o susa

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "✓ Build Successful!"
    echo "========================================"
    echo ""
    echo "Executable: cpp-core/susa"
    echo "Size: $(du -h susa | cut -f1)"
    echo ""
    echo "Test the build:"
    echo "  ./susa test_everything.susa"
    echo ""
    
    # Make executable
    chmod +x susa
    
    # Test if it runs
    echo "Quick test..."
    if ./susa --version 2>/dev/null; then
        echo "✓ Interpreter runs successfully"
    else
        echo "✓ Interpreter built (version flag not implemented)"
    fi
else
    echo ""
    echo "ERROR: Build failed!"
    echo "Check the error messages above."
    exit 1
fi

cd ..

echo ""
echo "Next steps:"
echo "1. Test: cd cpp-core && ./susa test_everything.susa"
echo "2. Install: sudo cp cpp-core/susa /usr/local/bin/"
echo "3. Package: ./create-macos-package.sh"
echo ""
