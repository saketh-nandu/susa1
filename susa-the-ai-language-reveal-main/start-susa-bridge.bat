@echo off
echo Starting SUSA Direct Integration Server...
echo This connects your website directly to the SUSA Python interpreter
echo.

cd /d "%~dp0"

echo Checking Python installation...
python --version
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python and try again
    pause
    exit /b 1
)

echo.
echo Checking SUSA interpreter modules...
python -c "import sys; sys.path.append('..'); from lexer import tokenize; from parser import Parser; from interpreter import Interpreter; print('✓ SUSA modules loaded successfully')" 2>nul
if errorlevel 1 (
    echo ⚠️  SUSA interpreter modules not found - will use enhanced simulation
) else (
    echo ✅ SUSA interpreter ready for direct execution
)

echo.
echo Starting SUSA Direct Integration Server on port 8765...
echo This server uses your SUSA Python code directly (no subprocess calls)
echo.
echo Press Ctrl+C to stop the server
echo.

python susa-bridge.py 8765

pause