cmake_minimum_required(VERSION 3.10)
project(SUSA VERSION 1.0.0 LANGUAGES CXX)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Compiler flags
if(MSVC)
    add_compile_options(/W4)
else()
    add_compile_options(-Wall -Wextra -pedantic)
endif()

# Source files
set(SOURCES
    main.cpp
)

# Create executable
add_executable(susa ${SOURCES})

# Set output directory
set_target_properties(susa PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}"
)

# Installation rules
install(TARGETS susa
    RUNTIME DESTINATION bin
)
