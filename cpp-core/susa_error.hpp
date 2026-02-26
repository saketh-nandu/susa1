#ifndef SUSA_ERROR_HPP
#define SUSA_ERROR_HPP

#include <string>
#include <sstream>
#include <vector>

namespace susa {

enum class ErrorType {
    SYNTAX_ERROR,      // Invalid syntax
    RUNTIME_ERROR,     // General runtime errors
    TYPE_ERROR,        // Type mismatch operations
    NAME_ERROR,        // Undefined variable/function
    INDEX_ERROR,       // Array/list index out of bounds
    IMPORT_ERROR,      // Module import failures
    ATTRIBUTE_ERROR,   // Invalid attribute access
    VALUE_ERROR,       // Invalid value for operation
    ZERO_DIVISION_ERROR, // Division by zero
    KEY_ERROR,         // Dictionary key not found
    ARGUMENT_ERROR     // Wrong number of arguments
};

class SUSAError {
public:
    ErrorType type;
    std::string message;
    int line;
    int column;
    std::string source_line;
    std::string file_name;
    
    SUSAError(ErrorType t, const std::string& msg, int l = -1, int c = -1, 
              const std::string& src_line = "", const std::string& file = "")
        : type(t), message(msg), line(l), column(c), source_line(src_line), file_name(file) {}
    
    std::string get_type_name() const {
        switch (type) {
            case ErrorType::SYNTAX_ERROR: return "SyntaxError";
            case ErrorType::RUNTIME_ERROR: return "RuntimeError";
            case ErrorType::TYPE_ERROR: return "TypeError";
            case ErrorType::NAME_ERROR: return "NameError";
            case ErrorType::INDEX_ERROR: return "IndexError";
            case ErrorType::IMPORT_ERROR: return "ImportError";
            case ErrorType::ATTRIBUTE_ERROR: return "AttributeError";
            case ErrorType::VALUE_ERROR: return "ValueError";
            case ErrorType::ZERO_DIVISION_ERROR: return "ZeroDivisionError";
            case ErrorType::KEY_ERROR: return "KeyError";
            case ErrorType::ARGUMENT_ERROR: return "ArgumentError";
            default: return "Error";
        }
    }
    
    std::string format_cli() const {
        std::ostringstream oss;
        
        // Error header with ANSI colors (red)
        oss << "\033[1;31m" << get_type_name() << "\033[0m";
        
        if (line > 0) {
            oss << " at line " << line;
            if (column > 0) {
                oss << ", column " << column;
            }
        }
        
        if (!file_name.empty()) {
            oss << " in " << file_name;
        }
        
        oss << ":\n";
        oss << "  \033[1;31m" << message << "\033[0m\n";
        
        // Show source line with error pointer
        if (!source_line.empty() && line > 0) {
            oss << "\n";
            oss << "  " << line << " | " << source_line << "\n";
            
            if (column > 0) {
                oss << "  " << std::string(std::to_string(line).length(), ' ') << " | ";
                oss << std::string(column - 1, ' ');
                oss << "\033[1;31m^\033[0m\n";
            }
        }
        
        return oss.str();
    }
    
    std::string format_ide() const {
        std::ostringstream oss;
        
        // IDE format (no ANSI colors, structured)
        oss << "[" << get_type_name() << "]";
        
        if (line > 0) {
            oss << " Line " << line;
            if (column > 0) {
                oss << ", Col " << column;
            }
        }
        
        oss << ": " << message;
        
        if (!source_line.empty()) {
            oss << "\n  > " << source_line;
            if (column > 0) {
                oss << "\n  > " << std::string(column - 1, ' ') << "^";
            }
        }
        
        return oss.str();
    }
};

class ErrorHandler {
private:
    std::vector<std::string> source_lines;
    std::string file_name;
    bool use_colors;
    
public:
    ErrorHandler(const std::string& source = "", const std::string& file = "", bool colors = true)
        : file_name(file), use_colors(colors) {
        // Split source into lines
        std::istringstream iss(source);
        std::string line;
        while (std::getline(iss, line)) {
            source_lines.push_back(line);
        }
    }
    
    std::string get_source_line(int line_num) const {
        if (line_num > 0 && line_num <= static_cast<int>(source_lines.size())) {
            return source_lines[line_num - 1];
        }
        return "";
    }
    
    SUSAError create_error(ErrorType type, const std::string& message, 
                          int line = -1, int column = -1) const {
        std::string src_line = get_source_line(line);
        return SUSAError(type, message, line, column, src_line, file_name);
    }
    
    std::string format_error(const SUSAError& error) const {
        if (use_colors) {
            return error.format_cli();
        } else {
            return error.format_ide();
        }
    }
};

} // namespace susa

#endif // SUSA_ERROR_HPP
