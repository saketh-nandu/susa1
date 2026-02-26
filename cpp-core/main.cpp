#include "susa_interpreter_v2.hpp"
#include <iostream>
#include <fstream>
#include <sstream>
#include <chrono>

void print_banner() {
    std::cout << "\n";
    std::cout << "  ========================================\n";
    std::cout << "         SUSA Programming Language       \n";
    std::cout << "  ========================================\n";
    std::cout << "\n";
    std::cout << "  Version: 2.0 (C++ Core)\n";
    std::cout << "  High-Performance Native Interpreter\n";
    std::cout << "\n";
}

void print_help() {
    print_banner();
    std::cout << "Usage: susa [options] [file]\n\n";
    std::cout << "Options:\n";
    std::cout << "  -h, --help       Show this help message\n";
    std::cout << "  -v, --version    Show version information\n";
    std::cout << "  -e, --eval CODE  Execute SUSA code directly\n";
    std::cout << "  --benchmark      Show execution time\n";
    std::cout << "\n";
    std::cout << "Examples:\n";
    std::cout << "  susa script.susa              Run a SUSA file\n";
    std::cout << "  susa -e \"print 'Hello'\"        Execute code directly\n";
    std::cout << "  susa --benchmark script.susa  Run with timing\n";
    std::cout << "\n";
}

void print_version() {
    std::cout << "SUSA Programming Language v2.0\n";
    std::cout << "C++ Core Interpreter - High Performance Edition\n";
    std::cout << "Built with: C++17\n";
    std::cout << "Features:\n";
    std::cout << "  - Native compiled execution\n";
    std::cout << "  - 10-100x faster than Python interpreter\n";
    std::cout << "  - Zero-dependency runtime\n";
    std::cout << "  - Case-insensitive keywords\n";
    std::cout << "  - Indentation-independent syntax\n";
    std::cout << "\n";
}

std::string read_file(const std::string& filename) {
    std::ifstream file(filename);
    if (!file.is_open()) {
        throw std::runtime_error("Could not open file: " + filename);
    }
    
    std::stringstream buffer;
    buffer << file.rdbuf();
    return buffer.str();
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        print_help();
        return 0;
    }
    
    std::string arg1 = argv[1];
    bool benchmark = false;
    
    // Check for flags
    for (int i = 1; i < argc; i++) {
        std::string arg = argv[i];
        if (arg == "--benchmark") {
            benchmark = true;
        }
    }
    
    // Help
    if (arg1 == "-h" || arg1 == "--help") {
        print_help();
        return 0;
    }
    
    // Version
    if (arg1 == "-v" || arg1 == "--version") {
        print_version();
        return 0;
    }
    
    // Direct code execution
    if (arg1 == "-e" || arg1 == "--eval") {
        if (argc < 3) {
            std::cerr << "Error: No code provided for -e option\n";
            return 1;
        }
        
        std::string code = argv[2];
        susa::Interpreter interpreter;
        
        auto start = std::chrono::high_resolution_clock::now();
        std::string output = interpreter.execute(code);
        auto end = std::chrono::high_resolution_clock::now();
        
        std::cout << output;
        
        if (benchmark) {
            auto duration = std::chrono::duration_cast<std::chrono::microseconds>(end - start);
            std::cout << "\n[Execution time: " << duration.count() / 1000.0 << " ms]\n";
        }
        
        return 0;
    }
    
    // File execution
    std::string filename = arg1;
    
    try {
        std::string source = read_file(filename);
        susa::Interpreter interpreter;
        
        auto start = std::chrono::high_resolution_clock::now();
        std::string output = interpreter.execute(source);
        auto end = std::chrono::high_resolution_clock::now();
        
        std::cout << output;
        
        if (benchmark) {
            auto duration = std::chrono::duration_cast<std::chrono::microseconds>(end - start);
            std::cout << "\n[Execution time: " << duration.count() / 1000.0 << " ms]\n";
        }
        
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << "\n";
        return 1;
    }
    
    return 0;
}
