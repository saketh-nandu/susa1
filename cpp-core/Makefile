# SUSA Programming Language Makefile
# Simple build system for all platforms

CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra -O2
TARGET = susa
SOURCES = main.cpp

# Platform detection
ifeq ($(OS),Windows_NT)
    TARGET := $(TARGET).exe
    RM = del /Q
else
    UNAME_S := $(shell uname -s)
    ifeq ($(UNAME_S),Darwin)
        # macOS
        CXX = clang++
    endif
    RM = rm -f
endif

# Build target
all: $(TARGET)

$(TARGET): $(SOURCES)
	$(CXX) $(CXXFLAGS) -o $(TARGET) $(SOURCES)

# Clean build artifacts
clean:
	$(RM) $(TARGET)

# Install (Unix-like systems)
install: $(TARGET)
	install -m 0755 $(TARGET) /usr/local/bin/

# Uninstall
uninstall:
	$(RM) /usr/local/bin/$(TARGET)

.PHONY: all clean install uninstall
