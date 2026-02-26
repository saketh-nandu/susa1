#ifndef SUSA_FUNCTION_HPP
#define SUSA_FUNCTION_HPP

#include "susa_value.hpp"
#include <string>
#include <vector>
#include <map>
#include <memory>

namespace susa {

// Forward declarations
class Environment;
class Interpreter;

// Function definition structure
struct FunctionDef {
    std::string name;
    std::vector<std::string> parameters;
    std::vector<size_t> body_tokens;  // Token indices for function body
    size_t body_start;
    size_t body_end;
    bool is_builtin;
    
    FunctionDef() : body_start(0), body_end(0), is_builtin(false) {}
};

// Module structure
struct Module {
    std::string name;
    std::string file_path;
    std::map<std::string, FunctionDef> functions;
    std::map<std::string, ValuePtr> constants;
    std::vector<std::string> exports;  // SHARE list
    bool loaded;
    
    Module() : loaded(false) {}
};

// Module registry
class ModuleRegistry {
private:
    std::map<std::string, Module> modules;
    std::vector<std::string> search_paths;
    
public:
    ModuleRegistry() {
        // Add default search paths
        search_paths.push_back("modules/");
        search_paths.push_back("./");
    }
    
    void add_search_path(const std::string& path) {
        search_paths.push_back(path);
    }
    
    bool has_module(const std::string& name) {
        return modules.find(name) != modules.end();
    }
    
    Module& get_module(const std::string& name) {
        return modules[name];
    }
    
    void register_module(const std::string& name, const Module& module) {
        modules[name] = module;
    }
    
    std::string find_module_file(const std::string& name) {
        for (const auto& path : search_paths) {
            std::string full_path = path + name + ".susa";
            // Check if file exists (simplified - would need actual file check)
            return full_path;
        }
        return "";
    }
};

} // namespace susa

#endif // SUSA_FUNCTION_HPP
