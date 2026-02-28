# SUSA Programming Language Makefile
# Simple build system for all platforms

# Compiler settings
CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra -O2
TARGET = susa
SOURCES = main.cpp

# Platform detection
ifeq ($(OS),Windows_NT)
    TARGET := susa.exe
    RM = del /Q /F
    RMDIR = rmdir /S /Q
else
    UNAME_S := $(shell uname -s)
    ifeq ($(UNAME_S),Darwin)
        CXX = clang++
    endif
    RM = rm -f
    RMDIR = rm -rf
endif

# Default target
.DEFAULT_GOAL := all

# Build target
all: $(TARGET)

$(TARGET): $(SOURCES)
	@echo "Building SUSA compiler..."
	$(CXX) $(CXXFLAGS) -o $(TARGET) $(SOURCES)
	@echo "Build complete: $(TARGET)"

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	-$(RM) $(TARGET)
	@echo "Clean complete"

# Install (Unix-like systems only)
install: $(TARGET)
	@echo "Installing SUSA..."
	install -m 0755 $(TARGET) /usr/local/bin/
	@echo "Installation complete"

# Uninstall
uninstall:
	@echo "Uninstalling SUSA..."
	-$(RM) /usr/local/bin/$(TARGET)
	@echo "Uninstall complete"

# Help target
help:
	@echo "SUSA Makefile targets:"
	@echo "  all       - Build the SUSA compiler (default)"
	@echo "  clean     - Remove build artifacts"
	@echo "  install   - Install SUSA (Unix/Linux/macOS only)"
	@echo "  uninstall - Uninstall SUSA"
	@echo "  help      - Show this help message"

.PHONY: all clean install uninstall help
