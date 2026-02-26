#ifndef SUSA_INTERPRETER_V2_HPP
#define SUSA_INTERPRETER_V2_HPP

#include "susa_lexer.hpp"
#include "susa_value.hpp"
#include "susa_modules.hpp"
#include "susa_function.hpp"
#include "susa_error.hpp"
#include <map>
#include <stack>
#include <cmath>
#include <algorithm>
#include <sstream>

namespace susa {

class Environment {
public:
    std::map<std::string, ValuePtr> variables;
    std::map<std::string, bool> const_flags;  // Track which variables are const
    std::shared_ptr<Environment> parent;
    
    Environment(std::shared_ptr<Environment> p = nullptr) : parent(p) {}
    
    void set(const std::string& name, ValuePtr value, bool is_const = false) {
        // Check if variable is const
        if (const_flags.find(name) != const_flags.end() && const_flags[name]) {
            throw std::runtime_error("Cannot reassign const variable: " + name);
        }
        variables[name] = value;
        if (is_const) {
            const_flags[name] = true;
        }
    }
    
    ValuePtr get(const std::string& name) {
        auto it = variables.find(name);
        if (it != variables.end()) {
            return it->second;
        }
        if (parent) {
            return parent->get(name);
        }
        return nullptr;  // Return nullptr for undefined variables
    }
    
    bool has(const std::string& name) {
        if (variables.find(name) != variables.end()) {
            return true;
        }
        if (parent) {
            return parent->has(name);
        }
        return false;
    }
};

class Interpreter {
private:
    std::vector<Token> tokens;
    size_t current;
    std::shared_ptr<Environment> global_env;
    std::shared_ptr<Environment> current_env;
    std::ostringstream output_buffer;
    bool break_flag;
    bool continue_flag;
    bool return_flag;
    ValuePtr return_value;
    bool yield_flag;
    std::vector<ValuePtr> yielded_values;  // Collect all yielded values
    
    // Module system
    BuiltinModules builtin_modules;
    std::map<std::string, std::string> imported_modules;  // alias -> module_name
    ModuleRegistry module_registry;
    
    // Error handling
    ErrorHandler error_handler;
    std::string source_code;
    
    // Static variables storage (persists across function calls)
    std::map<std::string, ValuePtr> static_variables;
    
    // Enum storage
    std::map<std::string, std::map<std::string, ValuePtr>> enums;
    
    // Function storage
    struct Function {
        std::vector<std::string> params;
        std::map<std::string, ValuePtr> default_values;  // param_name -> default_value
        std::string varargs_param;  // Name of *args parameter (empty if none)
        bool is_generator;  // True if function contains YIELD
        bool is_async;  // True if function is ASYNC
        size_t body_start;
        size_t body_end;
    };
    std::map<std::string, Function> functions;
    
    // Class storage
    struct Class {
        std::string name;
        std::map<std::string, Function> methods;  // method_name -> Function
        std::string parent_class;  // For inheritance (empty if none)
    };
    std::map<std::string, Class> classes;
    
    Token& peek(int offset = 0) {
        size_t pos = current + offset;
        if (pos >= tokens.size()) {
            return tokens.back();
        }
        return tokens[pos];
    }
    
    Token& advance() {
        if (current < tokens.size() - 1) {
            current++;
        }
        return tokens[current];
    }
    
    void throw_error(ErrorType type, const std::string& message) {
        Token& token = peek();
        SUSAError error = error_handler.create_error(type, message, token.line, token.column);
        throw std::runtime_error(error_handler.format_error(error));
    }
    
    void throw_syntax_error(const std::string& message) {
        throw_error(ErrorType::SYNTAX_ERROR, message);
    }
    
    void throw_runtime_error(const std::string& message) {
        throw_error(ErrorType::RUNTIME_ERROR, message);
    }
    
    void throw_name_error(const std::string& name) {
        throw_error(ErrorType::NAME_ERROR, "Name '" + name + "' is not defined");
    }
    
    void throw_type_error(const std::string& message) {
        throw_error(ErrorType::TYPE_ERROR, message);
    }
    
    void throw_index_error(const std::string& message) {
        throw_error(ErrorType::INDEX_ERROR, message);
    }
    
    void throw_attribute_error(const std::string& obj, const std::string& attr) {
        throw_error(ErrorType::ATTRIBUTE_ERROR, "Object '" + obj + "' has no attribute '" + attr + "'");
    }
    
    void throw_value_error(const std::string& message) {
        throw_error(ErrorType::VALUE_ERROR, message);
    }
    
    void throw_zero_division_error() {
        throw_error(ErrorType::ZERO_DIVISION_ERROR, "Division by zero");
    }
    
    void throw_key_error(const std::string& key) {
        throw_error(ErrorType::KEY_ERROR, "Key '" + key + "' not found");
    }
    
    void throw_argument_error(const std::string& func, int expected, int got) {
        std::ostringstream oss;
        oss << "Function '" << func << "' expects " << expected << " argument(s), got " << got;
        throw_error(ErrorType::ARGUMENT_ERROR, oss.str());
    }
    
    void skip_newlines() {
        while (peek().type == TokenType::NEWLINE) {
            advance();
        }
    }
    
    // Expression evaluation
    ValuePtr evaluate_expression() {
        return evaluate_or();
    }
    
    ValuePtr process_template_string(const std::string& template_str) {
        std::string result;
        size_t i = 0;
        
        while (i < template_str.length()) {
            if (template_str[i] == '{') {
                // Find the closing brace
                size_t end = i + 1;
                int brace_count = 1;
                while (end < template_str.length() && brace_count > 0) {
                    if (template_str[end] == '{') brace_count++;
                    if (template_str[end] == '}') brace_count--;
                    end++;
                }
                
                if (brace_count == 0) {
                    // Extract variable name
                    std::string var_name = template_str.substr(i + 1, end - i - 2);
                    
                    // Trim whitespace
                    var_name.erase(0, var_name.find_first_not_of(" \t\n\r"));
                    var_name.erase(var_name.find_last_not_of(" \t\n\r") + 1);
                    
                    // Get variable value
                    ValuePtr var_value = current_env->get(var_name);
                    if (var_value == nullptr) {
                        throw_name_error(var_name);
                    }
                    result += var_value->to_string();
                    
                    i = end;
                } else {
                    result += template_str[i];
                    i++;
                }
            } else {
                result += template_str[i];
                i++;
            }
        }
        
        return Value::make_string(result);
    }
    
    ValuePtr evaluate_or() {
        ValuePtr left = evaluate_and();
        
        while (peek().type == TokenType::OR) {
            advance();
            ValuePtr right = evaluate_and();
            left = Value::make_bool(left->is_truthy() || right->is_truthy());
        }
        
        return left;
    }
    
    ValuePtr evaluate_and() {
        ValuePtr left = evaluate_not();
        
        while (peek().type == TokenType::AND) {
            advance();
            ValuePtr right = evaluate_not();
            left = Value::make_bool(left->is_truthy() && right->is_truthy());
        }
        
        return left;
    }
    
    ValuePtr evaluate_not() {
        if (peek().type == TokenType::NOT) {
            advance();
            ValuePtr value = evaluate_not();
            return Value::make_bool(!value->is_truthy());
        }
        return evaluate_comparison();
    }
    
    ValuePtr evaluate_comparison() {
        ValuePtr left = evaluate_bitwise_or();
        
        while (true) {
            TokenType op = peek().type;
            if (op == TokenType::EQUAL || op == TokenType::NOT_EQUAL ||
                op == TokenType::LESS || op == TokenType::GREATER ||
                op == TokenType::LESS_EQUAL || op == TokenType::GREATER_EQUAL) {
                advance();
                ValuePtr right = evaluate_bitwise_or();
                
                double left_num = left->to_number();
                double right_num = right->to_number();
                
                bool result = false;
                switch (op) {
                    case TokenType::EQUAL: result = (left_num == right_num); break;
                    case TokenType::NOT_EQUAL: result = (left_num != right_num); break;
                    case TokenType::LESS: result = (left_num < right_num); break;
                    case TokenType::GREATER: result = (left_num > right_num); break;
                    case TokenType::LESS_EQUAL: result = (left_num <= right_num); break;
                    case TokenType::GREATER_EQUAL: result = (left_num >= right_num); break;
                    default: break;
                }
                
                left = Value::make_bool(result);
            } else {
                break;
            }
        }
        
        return left;
    }
    
    ValuePtr evaluate_bitwise_or() {
        ValuePtr left = evaluate_bitwise_xor();
        
        while (peek().type == TokenType::BIT_OR) {
            advance();
            ValuePtr right = evaluate_bitwise_xor();
            int left_int = static_cast<int>(left->to_number());
            int right_int = static_cast<int>(right->to_number());
            left = Value::make_number(left_int | right_int);
        }
        
        return left;
    }
    
    ValuePtr evaluate_bitwise_xor() {
        ValuePtr left = evaluate_bitwise_and();
        
        while (peek().type == TokenType::BIT_XOR) {
            advance();
            ValuePtr right = evaluate_bitwise_and();
            int left_int = static_cast<int>(left->to_number());
            int right_int = static_cast<int>(right->to_number());
            left = Value::make_number(left_int ^ right_int);
        }
        
        return left;
    }
    
    ValuePtr evaluate_bitwise_and() {
        ValuePtr left = evaluate_shift();
        
        while (peek().type == TokenType::BIT_AND) {
            advance();
            ValuePtr right = evaluate_shift();
            int left_int = static_cast<int>(left->to_number());
            int right_int = static_cast<int>(right->to_number());
            left = Value::make_number(left_int & right_int);
        }
        
        return left;
    }
    
    ValuePtr evaluate_shift() {
        ValuePtr left = evaluate_addition();
        
        while (peek().type == TokenType::LEFT_SHIFT || peek().type == TokenType::RIGHT_SHIFT) {
            TokenType op = peek().type;
            advance();
            ValuePtr right = evaluate_addition();
            int left_int = static_cast<int>(left->to_number());
            int right_int = static_cast<int>(right->to_number());
            
            if (op == TokenType::LEFT_SHIFT) {
                left = Value::make_number(left_int << right_int);
            } else {
                left = Value::make_number(left_int >> right_int);
            }
        }
        
        return left;
    }
    
    ValuePtr evaluate_addition() {
        ValuePtr left = evaluate_multiplication();
        
        while (peek().type == TokenType::PLUS || peek().type == TokenType::MINUS) {
            TokenType op = peek().type;
            advance();
            ValuePtr right = evaluate_multiplication();
            
            if (op == TokenType::PLUS) {
                if (left->type == ValueType::STRING || right->type == ValueType::STRING) {
                    left = Value::make_string(left->to_string() + right->to_string());
                } else if (left->type == ValueType::NUMBER && right->type == ValueType::NUMBER) {
                    left = Value::make_number(left->to_number() + right->to_number());
                } else {
                    // Allow implicit conversion to number for addition
                    left = Value::make_number(left->to_number() + right->to_number());
                }
            } else {
                if (left->type == ValueType::STRING || right->type == ValueType::STRING) {
                    throw_type_error("Cannot subtract strings");
                }
                left = Value::make_number(left->to_number() - right->to_number());
            }
        }
        
        return left;
    }
    
    ValuePtr evaluate_multiplication() {
        ValuePtr left = evaluate_power();
        
        while (peek().type == TokenType::MULTIPLY || 
               peek().type == TokenType::DIVIDE || 
               peek().type == TokenType::MODULO) {
            TokenType op = peek().type;
            advance();
            ValuePtr right = evaluate_power();
            
            double left_num = left->to_number();
            double right_num = right->to_number();
            
            if (op == TokenType::MULTIPLY) {
                left = Value::make_number(left_num * right_num);
            } else if (op == TokenType::DIVIDE) {
                if (right_num == 0) {
                    throw_zero_division_error();
                }
                left = Value::make_number(left_num / right_num);
            } else {
                if (right_num == 0) {
                    throw_zero_division_error();
                }
                left = Value::make_number(std::fmod(left_num, right_num));
            }
        }
        
        return left;
    }
    
    ValuePtr evaluate_power() {
        ValuePtr left = evaluate_unary();
        
        if (peek().type == TokenType::POWER) {
            advance();
            ValuePtr right = evaluate_power();
            left = Value::make_number(std::pow(left->to_number(), right->to_number()));
        }
        
        return left;
    }
    
    ValuePtr evaluate_unary() {
        if (peek().type == TokenType::MINUS) {
            advance();
            ValuePtr value = evaluate_unary();
            return Value::make_number(-value->to_number());
        }
        if (peek().type == TokenType::BIT_NOT) {
            advance();
            ValuePtr value = evaluate_unary();
            int int_val = static_cast<int>(value->to_number());
            return Value::make_number(~int_val);
        }
        return evaluate_primary();
    }
    
    ValuePtr evaluate_primary() {
        Token& token = peek();
        
        // AWAIT expression
        if (token.type == TokenType::AWAIT) {
            advance(); // Skip 'AWAIT'
            // In our simplified implementation, just evaluate the expression
            // In a full implementation, this would suspend and resume
            return evaluate_expression();
        }
        
        if (token.type == TokenType::NUMBER) {
            advance();
            return Value::make_number(std::stod(token.value));
        }
        
        if (token.type == TokenType::STRING) {
            advance();
            std::string str_value = token.value;
            
            // Check if this is a template string
            if (str_value.length() > 10 && str_value.substr(0, 10) == "\x01TEMPLATE\x01") {
                // Remove the marker
                str_value = str_value.substr(10);
                // Process template string interpolation
                return process_template_string(str_value);
            }
            
            return Value::make_string(str_value);
        }
        
        if (token.type == TokenType::TRUE) {
            advance();
            return Value::make_bool(true);
        }
        
        if (token.type == TokenType::FALSE) {
            advance();
            return Value::make_bool(false);
        }
        
        if (token.type == TokenType::NULL_VALUE) {
            advance();
            return Value::make_null();
        }
        
        // LAMBDA function
        if (token.type == TokenType::LAMBDA) {
            advance();
            
            // Parse parameters
            std::vector<std::string> params;
            while (peek().type == TokenType::IDENTIFIER) {
                params.push_back(peek().value);
                advance();
                if (peek().type == TokenType::COMMA) {
                    advance();
                }
            }
            
            if (peek().type != TokenType::COLON) {
                throw_syntax_error("Expected ':' after lambda parameters");
            }
            advance();
            
            // Parse body - capture tokens properly
            size_t body_start = current;
            std::string body_str;
            
            // Capture the expression until newline or EOF
            while (peek().type != TokenType::NEWLINE && peek().type != TokenType::EOF_TOKEN) {
                Token& t = peek();
                // Preserve string literals with quotes
                if (t.type == TokenType::STRING) {
                    body_str += "\"" + t.value + "\" ";
                } else if (t.type == TokenType::PLUS) {
                    body_str += "+ ";
                } else if (t.type == TokenType::MINUS) {
                    body_str += "- ";
                } else if (t.type == TokenType::MULTIPLY) {
                    body_str += "* ";
                } else if (t.type == TokenType::DIVIDE) {
                    body_str += "/ ";
                } else {
                    body_str += t.value + " ";
                }
                advance();
            }
            
            return Value::make_lambda(params, body_str);
        }
        
        if (token.type == TokenType::IDENTIFIER) {
            std::string name = token.value;
            advance();
            
            // Check for enum.member or list.method() syntax
            if (peek().type == TokenType::DOT) {
                advance(); // Skip '.'
                if (peek().value.empty()) {
                    throw std::runtime_error("Expected identifier after '.'");
                }
                std::string member = peek().value;
                advance();
                
                // Check if it's an enum
                if (enums.find(name) != enums.end()) {
                    auto& enum_map = enums[name];
                    if (enum_map.find(member) != enum_map.end()) {
                        return enum_map[member];
                    }
                    throw_runtime_error("Enum '" + name + "' has no member '" + member + "'");
                }
                
                // Check for list/string/dict methods
                if (peek().type == TokenType::LPAREN) {
                    ValuePtr var = current_env->get(name);
                    
                    if (var == nullptr) {
                        throw_name_error(name);
                    }
                    
                    // INSTANCE METHODS
                    if (var->type == ValueType::INSTANCE) {
                        advance(); // Skip '('
                        
                        std::vector<ValuePtr> args;
                        args.push_back(var); // Add self as first argument
                        
                        while (peek().type != TokenType::RPAREN && peek().type != TokenType::EOF_TOKEN) {
                            args.push_back(evaluate_expression());
                            if (peek().type == TokenType::COMMA) {
                                advance();
                            }
                        }
                        
                        if (peek().type != TokenType::RPAREN) {
                            throw_syntax_error("Expected ')' after method arguments");
                        }
                        advance();
                        
                        return call_method(var, member, args);
                    }
                    
                    // LIST METHODS
                    if (var->type == ValueType::LIST) {
                        std::string method = member;
                        std::transform(method.begin(), method.end(), method.begin(), ::tolower);
                        
                        advance(); // Skip '('
                        
                        if (method == "push" || method == "append") {
                            if (peek().type == TokenType::RPAREN) {
                                throw_runtime_error("push() requires an argument");
                            }
                            ValuePtr value = evaluate_expression();
                            if (peek().type != TokenType::RPAREN) {
                                throw_syntax_error("Expected ')' after push argument");
                            }
                            advance();
                            var->list_value.push_back(value);
                            return Value::make_null();
                            
                        } else if (method == "pop") {
                            if (peek().type != TokenType::RPAREN) {
                                throw_syntax_error("Expected ')' after pop");
                            }
                            advance();
                            if (var->list_value.empty()) {
                                throw_runtime_error("Cannot pop from empty list");
                            }
                            ValuePtr last = var->list_value.back();
                            var->list_value.pop_back();
                            return last;
                            
                        } else if (method == "insert") {
                            // insert(index, value)
                            ValuePtr index_val = evaluate_expression();
                            if (peek().type != TokenType::COMMA) {
                                throw_syntax_error("Expected ',' after index");
                            }
                            advance();
                            ValuePtr value = evaluate_expression();
                            if (peek().type != TokenType::RPAREN) {
                                throw_syntax_error("Expected ')' after insert arguments");
                            }
                            advance();
                            
                            int index = static_cast<int>(index_val->to_number());
                            if (index < 0 || index > static_cast<int>(var->list_value.size())) {
                                throw_index_error("Insert index out of range");
                            }
                            var->list_value.insert(var->list_value.begin() + index, value);
                            return Value::make_null();
                            
                        } else if (method == "remove") {
                            // remove(value) - removes first occurrence
                            ValuePtr value = evaluate_expression();
                            if (peek().type != TokenType::RPAREN) {
                                throw_syntax_error("Expected ')' after remove argument");
                            }
                            advance();
                            
                            for (size_t i = 0; i < var->list_value.size(); i++) {
                                if (var->list_value[i]->to_number() == value->to_number()) {
                                    var->list_value.erase(var->list_value.begin() + i);
                                    return Value::make_null();
                                }
                            }
                            throw_value_error("Value not found in list");
                            
                        } else if (method == "clear") {
                            if (peek().type != TokenType::RPAREN) {
                                throw_syntax_error("Expected ')' after clear");
                            }
                            advance();
                            var->list_value.clear();
                            return Value::make_null();
                            
                        } else if (method == "reverse") {
                            if (peek().type != TokenType::RPAREN) {
                                throw_syntax_error("Expected ')' after reverse");
                            }
                            advance();
                            std::reverse(var->list_value.begin(), var->list_value.end());
                            return Value::make_null();
                            
                        } else if (method == "sort") {
                            if (peek().type != TokenType::RPAREN) {
                                throw_syntax_error("Expected ')' after sort");
                            }
                            advance();
                            std::sort(var->list_value.begin(), var->list_value.end(),
                                [](const ValuePtr& a, const ValuePtr& b) {
                                    return a->to_number() < b->to_number();
                                });
                            return Value::make_null();
                            
                        } else if (method == "indexof") {
                            ValuePtr value = evaluate_expression();
                            if (peek().type != TokenType::RPAREN) {
                                throw_syntax_error("Expected ')' after indexOf argument");
                            }
                            advance();
                            
                            for (size_t i = 0; i < var->list_value.size(); i++) {
                                if (var->list_value[i]->to_number() == value->to_number()) {
                                    return Value::make_number(i);
                                }
                            }
                            return Value::make_number(-1);
                            
                        } else {
                            throw_runtime_error("Unknown list method: " + member);
                        }
                    }
                    
                    // STRING METHODS
                    else if (var->type == ValueType::STRING) {
                        std::string method = member;
                        std::transform(method.begin(), method.end(), method.begin(), ::tolower);
                        
                        advance(); // Skip '('
                        
                        if (method == "split") {
                            // split(delimiter)
                            ValuePtr delim_val = evaluate_expression();
                            if (peek().type != TokenType::RPAREN) {
                                throw_syntax_error("Expected ')' after split argument");
                            }
                            advance();
                            
                            std::string str = var->string_value;
                            std::string delim = delim_val->to_string();
                            std::vector<ValuePtr> result;
                            
                            size_t start = 0;
                            size_t end = str.find(delim);
                            while (end != std::string::npos) {
                                result.push_back(Value::make_string(str.substr(start, end - start)));
                                start = end + delim.length();
                                end = str.find(delim, start);
                            }
                            result.push_back(Value::make_string(str.substr(start)));
                            
                            return Value::make_list(result);
                            
                        } else if (method == "replace") {
                            // replace(old, new)
                            ValuePtr old_val = evaluate_expression();
                            if (peek().type != TokenType::COMMA) {
                                throw_syntax_error("Expected ',' after old string");
                            }
                            advance();
                            ValuePtr new_val = evaluate_expression();
                            if (peek().type != TokenType::RPAREN) {
                                throw_syntax_error("Expected ')' after replace arguments");
                            }
                            advance();
                            
                            std::string str = var->string_value;
                            std::string old_str = old_val->to_string();
                            std::string new_str = new_val->to_string();
                            
                            size_t pos = 0;
                            while ((pos = str.find(old_str, pos)) != std::string::npos) {
                                str.replace(pos, old_str.length(), new_str);
                                pos += new_str.length();
                            }
                            
                            return Value::make_string(str);
                            
                        } else if (method == "trim") {
                            if (peek().type != TokenType::RPAREN) {
                                throw_syntax_error("Expected ')' after trim");
                            }
                            advance();
                            
                            std::string str = var->string_value;
                            // Trim left
                            str.erase(0, str.find_first_not_of(" \t\n\r"));
                            // Trim right
                            str.erase(str.find_last_not_of(" \t\n\r") + 1);
                            
                            return Value::make_string(str);
                            
                        } else if (method == "startswith") {
                            ValuePtr prefix_val = evaluate_expression();
                            if (peek().type != TokenType::RPAREN) {
                                throw_syntax_error("Expected ')' after startsWith argument");
                            }
                            advance();
                            
                            std::string str = var->string_value;
                            std::string prefix = prefix_val->to_string();
                            bool result = str.substr(0, prefix.length()) == prefix;
                            
                            return Value::make_bool(result);
                            
                        } else if (method == "endswith") {
                            ValuePtr suffix_val = evaluate_expression();
                            if (peek().type != TokenType::RPAREN) {
                                throw_syntax_error("Expected ')' after endsWith argument");
                            }
                            advance();
                            
                            std::string str = var->string_value;
                            std::string suffix = suffix_val->to_string();
                            if (suffix.length() > str.length()) {
                                return Value::make_bool(false);
                            }
                            bool result = str.substr(str.length() - suffix.length()) == suffix;
                            
                            return Value::make_bool(result);
                            
                        } else if (method == "indexof") {
                            ValuePtr search_val = evaluate_expression();
                            if (peek().type != TokenType::RPAREN) {
                                throw_syntax_error("Expected ')' after indexOf argument");
                            }
                            advance();
                            
                            std::string str = var->string_value;
                            std::string search = search_val->to_string();
                            size_t pos = str.find(search);
                            
                            if (pos == std::string::npos) {
                                return Value::make_number(-1);
                            }
                            return Value::make_number(pos);
                            
                        } else {
                            throw_runtime_error("Unknown string method: " + member);
                        }
                    }
                    
                    // DICT METHODS
                    else if (var->type == ValueType::DICT) {
                        std::string method = member;
                        std::transform(method.begin(), method.end(), method.begin(), ::tolower);
                        
                        advance(); // Skip '('
                        
                        if (method == "keys") {
                            if (peek().type != TokenType::RPAREN) {
                                throw_syntax_error("Expected ')' after keys");
                            }
                            advance();
                            
                            std::vector<ValuePtr> keys;
                            for (const auto& pair : var->dict_value) {
                                keys.push_back(Value::make_string(pair.first));
                            }
                            return Value::make_list(keys);
                            
                        } else if (method == "values") {
                            if (peek().type != TokenType::RPAREN) {
                                throw_syntax_error("Expected ')' after values");
                            }
                            advance();
                            
                            std::vector<ValuePtr> values;
                            for (const auto& pair : var->dict_value) {
                                values.push_back(pair.second);
                            }
                            return Value::make_list(values);
                            
                        } else if (method == "has_key" || method == "haskey") {
                            ValuePtr key_val = evaluate_expression();
                            if (peek().type != TokenType::RPAREN) {
                                throw_syntax_error("Expected ')' after has_key argument");
                            }
                            advance();
                            
                            std::string key = key_val->to_string();
                            bool has = var->dict_value.find(key) != var->dict_value.end();
                            return Value::make_bool(has);
                            
                        } else if (method == "clear") {
                            if (peek().type != TokenType::RPAREN) {
                                throw_syntax_error("Expected ')' after clear");
                            }
                            advance();
                            var->dict_value.clear();
                            return Value::make_null();
                            
                        } else {
                            throw_runtime_error("Unknown dict method: " + member);
                        }
                    }
                    
                    // Check for module.function() syntax
                    return evaluate_module_function_call(name, member);
                } else {
                    // Check for instance property access
                    ValuePtr var = current_env->get(name);
                    if (var != nullptr && var->type == ValueType::INSTANCE) {
                        // Get property from instance
                        if (var->instance_properties.find(member) != var->instance_properties.end()) {
                            return var->instance_properties[member];
                        }
                        throw_runtime_error("Instance has no property '" + member + "'");
                    }
                    
                    // Module constant access
                    return get_module_constant(name, member);
                }
            }
            
            if (peek().type == TokenType::LPAREN) {
                // Check if it's a lambda variable
                ValuePtr lambda_var = current_env->get(name);
                if (lambda_var != nullptr && lambda_var->type == ValueType::LAMBDA) {
                    return evaluate_lambda_call(lambda_var);
                }
                return evaluate_function_call(name);
            }
            
            // Check for array/dict indexing syntax: arr[index] or dict["key"]
            if (peek().type == TokenType::LBRACKET) {
                advance(); // Skip '['
                ValuePtr index_expr = evaluate_expression();
                
                if (peek().type != TokenType::RBRACKET) {
                    throw_syntax_error("Expected ']' after index");
                }
                advance(); // Skip ']'
                
                // Get the variable
                ValuePtr container = current_env->get(name);
                if (container == nullptr) {
                    throw_name_error(name);
                }
                
                if (container->type == ValueType::LIST) {
                    int index = static_cast<int>(index_expr->to_number());
                    
                    // Bounds checking
                    if (index < 0 || index >= static_cast<int>(container->list_value.size())) {
                        std::ostringstream oss;
                        oss << "List index out of range: " << index << " (size: " << container->list_value.size() << ")";
                        throw_index_error(oss.str());
                    }
                    
                    return container->list_value[index];
                } else if (container->type == ValueType::DICT) {
                    std::string key = index_expr->to_string();
                    
                    if (container->dict_value.find(key) == container->dict_value.end()) {
                        throw_key_error(key);
                    }
                    
                    return container->dict_value[key];
                } else {
                    throw_type_error("Cannot index non-list/dict type");
                }
            }
            
            // Check if it's a variable
            ValuePtr var_value = current_env->get(name);
            if (var_value != nullptr) {
                return var_value;
            }
            
            // Check if it's a constant from an imported module
            for (const auto& import : imported_modules) {
                ValuePtr const_value = builtin_modules.get_constant(import.second, name);
                if (const_value->type != ValueType::NULL_TYPE) {
                    return const_value;
                }
            }
            
            // Variable not found - throw error
            throw_name_error(name);
            return Value::make_null(); // Never reached, but keeps compiler happy
        }
        
        if (token.type == TokenType::LPAREN) {
            advance();
            ValuePtr value = evaluate_expression();
            if (peek().type != TokenType::RPAREN) {
                throw std::runtime_error("Expected ')' after expression");
            }
            advance();
            return value;
        }
        
        if (token.type == TokenType::LBRACKET) {
            advance();
            std::vector<ValuePtr> elements;
            
            // Check for list comprehension: [expr FOR var IN iterable]
            size_t saved_pos = current;
            
            // Try to detect comprehension pattern by looking ahead
            bool is_comprehension = false;
            size_t expr_start = current;
            
            if (peek().type != TokenType::RBRACKET) {
                // Skip the expression to check for FOR
                int depth = 0;
                while (current < tokens.size()) {
                    if (peek().type == TokenType::LBRACKET || peek().type == TokenType::LPAREN) {
                        depth++;
                    } else if (peek().type == TokenType::RBRACKET || peek().type == TokenType::RPAREN) {
                        if (depth == 0 && peek().type == TokenType::RBRACKET) break;
                        depth--;
                    } else if (peek().type == TokenType::FOR && depth == 0) {
                        is_comprehension = true;
                        break;
                    } else if (peek().type == TokenType::COMMA && depth == 0) {
                        break; // Regular list
                    }
                    advance();
                }
                
                // Restore position
                current = saved_pos;
            }
            
            if (is_comprehension) {
                // Parse comprehension: [expr FOR var IN iterable IF condition]
                size_t expr_end = current;
                
                // Skip to FOR
                while (peek().type != TokenType::FOR) {
                    advance();
                }
                size_t expr_tokens_end = current;
                
                advance(); // Skip FOR
                
                if (peek().type != TokenType::IDENTIFIER) {
                    throw_syntax_error("Expected variable name after FOR");
                }
                std::string loop_var = peek().value;
                advance();
                
                if (peek().type != TokenType::IN) {
                    throw_syntax_error("Expected IN after variable in comprehension");
                }
                advance(); // Skip IN
                
                ValuePtr iterable = evaluate_expression();
                
                // Check for optional IF condition
                size_t cond_start = 0;
                size_t cond_end = 0;
                bool has_condition = false;
                
                if (peek().type == TokenType::IF) {
                    advance(); // Skip IF
                    has_condition = true;
                    cond_start = current;
                    
                    // Parse condition
                    int depth = 0;
                    while (current < tokens.size()) {
                        if (peek().type == TokenType::LBRACKET || peek().type == TokenType::LPAREN) {
                            depth++;
                        } else if (peek().type == TokenType::RBRACKET || peek().type == TokenType::RPAREN) {
                            if (depth == 0 && peek().type == TokenType::RBRACKET) break;
                            depth--;
                        }
                        advance();
                    }
                    cond_end = current;
                }
                
                if (peek().type != TokenType::RBRACKET) {
                    throw_syntax_error("Expected ']' after comprehension");
                }
                advance(); // Skip ']'
                
                // Execute comprehension
                std::vector<ValuePtr> result;
                
                if (iterable->type != ValueType::LIST) {
                    throw_type_error("Can only iterate over lists in comprehension");
                }
                
                // Save current state
                auto saved_env = current_env;
                size_t final_pos = current;
                auto comp_env = std::make_shared<Environment>(current_env);
                current_env = comp_env;
                
                for (const auto& item : iterable->list_value) {
                    // Set loop variable
                    current_env->set(loop_var, item);
                    
                    // Check condition if present
                    bool include = true;
                    if (has_condition) {
                        current = cond_start;
                        ValuePtr cond_result = evaluate_expression();
                        include = cond_result->is_truthy();
                    }
                    
                    if (include) {
                        // Evaluate expression
                        current = saved_pos;
                        ValuePtr elem = evaluate_expression();
                        result.push_back(elem);
                    }
                }
                
                // Restore state
                current_env = saved_env;
                current = final_pos;
                
                return Value::make_list(result);
            }
            
            // Regular list literal
            while (peek().type != TokenType::RBRACKET && peek().type != TokenType::EOF_TOKEN) {
                // Check for spread operator
                if (peek().type == TokenType::SPREAD) {
                    advance(); // Skip '...'
                    ValuePtr spread_value = evaluate_expression();
                    
                    // Expand the array
                    if (spread_value->type == ValueType::LIST) {
                        for (const auto& item : spread_value->list_value) {
                            elements.push_back(item);
                        }
                    } else {
                        throw_type_error("Spread operator requires a list");
                    }
                } else {
                    elements.push_back(evaluate_expression());
                }
                
                if (peek().type == TokenType::COMMA) {
                    advance();
                }
            }
            
            if (peek().type != TokenType::RBRACKET) {
                throw std::runtime_error("Expected ']' after list");
            }
            advance();
            
            return Value::make_list(elements);
        }
        
        // Dictionary literal
        if (token.type == TokenType::LBRACE) {
            advance();
            std::map<std::string, ValuePtr> dict;
            
            while (peek().type != TokenType::RBRACE && peek().type != TokenType::EOF_TOKEN) {
                // Check for spread operator
                if (peek().type == TokenType::SPREAD) {
                    advance(); // Skip '...'
                    ValuePtr spread_value = evaluate_expression();
                    
                    // Expand the dict
                    if (spread_value->type == ValueType::DICT) {
                        for (const auto& pair : spread_value->dict_value) {
                            dict[pair.first] = pair.second;
                        }
                    } else {
                        throw_type_error("Spread operator requires a dict");
                    }
                } else {
                    // Parse key (must be string)
                    if (peek().type != TokenType::STRING) {
                        throw_syntax_error("Dictionary key must be a string");
                    }
                    std::string key = peek().value;
                    advance();
                    
                    if (peek().type != TokenType::COLON) {
                        throw_syntax_error("Expected ':' after dictionary key");
                    }
                    advance();
                    
                    // Parse value
                    ValuePtr value = evaluate_expression();
                    dict[key] = value;
                }
                
                if (peek().type == TokenType::COMMA) {
                    advance();
                }
            }
            
            if (peek().type != TokenType::RBRACE) {
                throw std::runtime_error("Expected '}' after dictionary");
            }
            advance();
            
            return Value::make_dict(dict);
        }
        
        throw std::runtime_error("Unexpected token: " + token.value);
    }
    
    ValuePtr evaluate_lambda_call(ValuePtr lambda) {
        advance(); // Skip '('
        
        std::vector<ValuePtr> args;
        while (peek().type != TokenType::RPAREN && peek().type != TokenType::EOF_TOKEN) {
            args.push_back(evaluate_expression());
            if (peek().type == TokenType::COMMA) {
                advance();
            }
        }
        
        if (peek().type != TokenType::RPAREN) {
            throw std::runtime_error("Expected ')' after lambda arguments");
        }
        advance();
        
        // Check argument count
        if (args.size() != lambda->lambda_params.size()) {
            std::ostringstream oss;
            oss << "Lambda expects " << lambda->lambda_params.size() 
                << " argument(s), got " << args.size();
            throw_runtime_error(oss.str());
        }
        
        // Create new environment for lambda execution
        auto lambda_env = std::make_shared<Environment>(current_env);
        
        // Bind parameters
        for (size_t i = 0; i < lambda->lambda_params.size(); i++) {
            lambda_env->set(lambda->lambda_params[i], args[i]);
        }
        
        // Execute lambda body (parse and evaluate the expression)
        auto saved_env = current_env;
        current_env = lambda_env;
        
        // Parse the lambda body
        Lexer body_lexer(lambda->lambda_body);
        auto body_tokens = body_lexer.tokenize();
        
        auto saved_tokens = tokens;
        auto saved_current = current;
        
        tokens = body_tokens;
        current = 0;
        
        ValuePtr result = evaluate_expression();
        
        tokens = saved_tokens;
        current = saved_current;
        current_env = saved_env;
        
        return result;
    }
    
    ValuePtr evaluate_module_function_call(const std::string& module_alias, const std::string& func_name) {
        advance(); // Skip '('
        
        std::vector<ValuePtr> args;
        while (peek().type != TokenType::RPAREN && peek().type != TokenType::EOF_TOKEN) {
            args.push_back(evaluate_expression());
            if (peek().type == TokenType::COMMA) {
                advance();
            }
        }
        
        if (peek().type != TokenType::RPAREN) {
            throw std::runtime_error("Expected ')' after function arguments");
        }
        advance();
        
        // Resolve module name from alias
        std::string module_name = module_alias;
        if (imported_modules.find(module_alias) != imported_modules.end()) {
            module_name = imported_modules[module_alias];
        }
        
        // Try to call builtin module function
        auto func = builtin_modules.get_function(module_name, func_name);
        if (func) {
            return func(args);
        }
        
        throw std::runtime_error("Unknown module function: " + module_name + "." + func_name);
    }
    
    ValuePtr get_module_constant(const std::string& module_alias, const std::string& const_name) {
        // Resolve module name from alias
        std::string module_name = module_alias;
        if (imported_modules.find(module_alias) != imported_modules.end()) {
            module_name = imported_modules[module_alias];
        }
        
        // Try to get builtin module constant
        ValuePtr constant = builtin_modules.get_constant(module_name, const_name);
        if (constant->type != ValueType::NULL_TYPE) {
            return constant;
        }
        
        throw std::runtime_error("Unknown module constant: " + module_name + "." + const_name);
    }
    
    ValuePtr evaluate_function_call(const std::string& name) {
        advance(); // Skip '('
        
        std::vector<ValuePtr> args;
        while (peek().type != TokenType::RPAREN && peek().type != TokenType::EOF_TOKEN) {
            args.push_back(evaluate_expression());
            if (peek().type == TokenType::COMMA) {
                advance();
            }
        }
        
        if (peek().type != TokenType::RPAREN) {
            throw std::runtime_error("Expected ')' after function arguments");
        }
        advance();
        
        // Check for class instantiation
        if (classes.find(name) != classes.end()) {
            return instantiate_class(name, args);
        }
        
        // Check for user-defined functions
        if (functions.find(name) != functions.end()) {
            return call_user_function(name, args);
        }
        
        return call_builtin_function(name, args);
    }
    
    ValuePtr call_builtin_function(const std::string& name, const std::vector<ValuePtr>& args) {
        std::string lower_name = name;
        std::transform(lower_name.begin(), lower_name.end(), lower_name.begin(), ::tolower);
        
        // Try builtin modules first (for direct function calls without module prefix)
        // Check math_utils
        auto math_func = builtin_modules.get_function("math_utils", lower_name);
        if (math_func) {
            return math_func(args);
        }
        
        // Check string_utils
        auto str_func = builtin_modules.get_function("string_utils", lower_name);
        if (str_func) {
            return str_func(args);
        }
        
        // Check array_utils
        auto arr_func = builtin_modules.get_function("array_utils", lower_name);
        if (arr_func) {
            return arr_func(args);
        }
        
        // Legacy built-in functions (for backward compatibility) with argument validation
        // Math functions
        if (lower_name == "sqrt") {
            if (args.size() != 1) throw_argument_error("sqrt", 1, args.size());
            return Value::make_number(std::sqrt(args[0]->to_number()));
        }
        if (lower_name == "pow") {
            if (args.size() != 2) throw_argument_error("pow", 2, args.size());
            return Value::make_number(std::pow(args[0]->to_number(), args[1]->to_number()));
        }
        if (lower_name == "abs") {
            if (args.size() != 1) throw_argument_error("abs", 1, args.size());
            return Value::make_number(std::abs(args[0]->to_number()));
        }
        if (lower_name == "max") {
            if (args.size() < 1) throw_argument_error("max", 1, args.size());
            double max_val = args[0]->to_number();
            for (size_t i = 1; i < args.size(); i++) {
                max_val = std::max(max_val, args[i]->to_number());
            }
            return Value::make_number(max_val);
        }
        if (lower_name == "min") {
            if (args.size() < 1) throw_argument_error("min", 1, args.size());
            double min_val = args[0]->to_number();
            for (size_t i = 1; i < args.size(); i++) {
                min_val = std::min(min_val, args[i]->to_number());
            }
            return Value::make_number(min_val);
        }
        
        // String functions
        if (lower_name == "len") {
            if (args.size() != 1) throw_argument_error("len", 1, args.size());
            if (args[0]->type == ValueType::STRING) {
                return Value::make_number(args[0]->string_value.length());
            } else if (args[0]->type == ValueType::LIST) {
                return Value::make_number(args[0]->list_value.size());
            }
            throw_type_error("len() requires a string or list");
        }
        if (lower_name == "upper") {
            if (args.size() != 1) throw_argument_error("upper", 1, args.size());
            if (args[0]->type != ValueType::STRING) {
                throw_type_error("upper() requires a string argument");
            }
            std::string str = args[0]->to_string();
            std::transform(str.begin(), str.end(), str.begin(), ::toupper);
            return Value::make_string(str);
        }
        if (lower_name == "lower") {
            if (args.size() != 1) throw_argument_error("lower", 1, args.size());
            if (args[0]->type != ValueType::STRING) {
                throw_type_error("lower() requires a string argument");
            }
            std::string str = args[0]->to_string();
            std::transform(str.begin(), str.end(), str.begin(), ::tolower);
            return Value::make_string(str);
        }
        
        // NUMBERS function - generates a sequence of numbers
        // NUMBERS(end) - from 0 to end-1
        // NUMBERS(start, end) - from start to end-1
        // NUMBERS(start, end, step) - from start to end-1 with step
        if (lower_name == "numbers" || lower_name == "sequence" || lower_name == "range") {
            int start = 0, end = 0, step = 1;
            
            if (args.size() == 1) {
                end = static_cast<int>(args[0]->to_number());
            } else if (args.size() == 2) {
                start = static_cast<int>(args[0]->to_number());
                end = static_cast<int>(args[1]->to_number());
            } else if (args.size() == 3) {
                start = static_cast<int>(args[0]->to_number());
                end = static_cast<int>(args[1]->to_number());
                step = static_cast<int>(args[2]->to_number());
            } else {
                throw_argument_error("NUMBERS", 1, args.size());
            }
            
            if (step == 0) {
                throw_runtime_error("NUMBERS() step cannot be zero");
            }
            
            std::vector<ValuePtr> result;
            if (step > 0) {
                for (int i = start; i < end; i += step) {
                    result.push_back(Value::make_number(i));
                }
            } else {
                for (int i = start; i > end; i += step) {
                    result.push_back(Value::make_number(i));
                }
            }
            
            return Value::make_list(result);
        }
        
        // Type conversion
        if (lower_name == "str") {
            if (args.size() != 1) throw_argument_error("str", 1, args.size());
            return Value::make_string(args[0]->to_string());
        }
        if (lower_name == "int") {
            if (args.size() != 1) throw_argument_error("int", 1, args.size());
            return Value::make_number(static_cast<int>(args[0]->to_number()));
        }
        if (lower_name == "float") {
            if (args.size() != 1) throw_argument_error("float", 1, args.size());
            return Value::make_number(args[0]->to_number());
        }
        
        throw std::runtime_error("Unknown function: " + name);
    }
    
    // Statement execution
    void execute_statement() {
        skip_newlines();
        
        if (peek().type == TokenType::EOF_TOKEN) {
            return;
        }
        
        Token& token = peek();
        
        // ADD statement (module import)
        if (token.type == TokenType::ADD) {
            execute_add_statement();
            return;
        }
        
        // STATIC variable declaration
        if (token.type == TokenType::STATIC) {
            execute_static_statement();
            return;
        }
        
        // ENUM declaration
        if (token.type == TokenType::ENUM) {
            execute_enum_statement();
            return;
        }
        
        // CLASS declaration
        if (token.type == TokenType::CLASS) {
            execute_class_statement();
            return;
        }
        
        // ASYNC FUNC declaration
        if (token.type == TokenType::ASYNC) {
            advance(); // Skip 'ASYNC'
            if (peek().type != TokenType::FUNC) {
                throw_syntax_error("Expected FUNC after ASYNC");
            }
            execute_func_statement(true);  // Pass true for is_async
            return;
        }
        
        // FUNC declaration
        if (token.type == TokenType::FUNC) {
            execute_func_statement(false);  // Pass false for is_async
            return;
        }
        
        // RETURN statement
        if (token.type == TokenType::RETURN) {
            advance();
            return_value = evaluate_expression();
            return_flag = true;
            skip_newlines();
            return;
        }
        
        // YIELD statement
        if (token.type == TokenType::YIELD) {
            advance();
            ValuePtr value = evaluate_expression();
            yielded_values.push_back(value);
            yield_flag = true;
            skip_newlines();
            return;
        }
        
        // WITH statement
        if (token.type == TokenType::WITH) {
            execute_with_statement();
            return;
        }
        
        // TRY-CATCH statement
        if (token.type == TokenType::TRY) {
            execute_try_catch();
            return;
        }
        
        // Print statement
        if (token.type == TokenType::PRINT) {
            advance();
            ValuePtr value = evaluate_expression();
            output_buffer << value->to_string() << "\n";
            skip_newlines();
            return;
        }
        
        // Variable assignment (including CONST and destructuring)
        if (token.type == TokenType::LET || token.type == TokenType::CONST_VAR ||
            token.type == TokenType::INT || token.type == TokenType::STRING_TYPE || 
            token.type == TokenType::BOOL || token.type == TokenType::FLOAT || 
            token.type == TokenType::DOUBLE || token.type == TokenType::CHAR || 
            token.type == TokenType::IDENTIFIER) {
            size_t saved_pos = current;
            bool is_const = false;
            
            if (token.type == TokenType::CONST_VAR) {
                is_const = true;
                advance(); // Skip CONST keyword
            } else if (token.type == TokenType::LET || token.type == TokenType::INT ||
                token.type == TokenType::STRING_TYPE || token.type == TokenType::BOOL ||
                token.type == TokenType::FLOAT || token.type == TokenType::DOUBLE ||
                token.type == TokenType::CHAR) {
                advance(); // Skip type keyword
            }
            
            // Check for destructuring: let [a, b, c] = [1, 2, 3]
            if (peek().type == TokenType::LBRACKET) {
                advance(); // Skip '['
                
                std::vector<std::string> var_names;
                while (peek().type != TokenType::RBRACKET && peek().type != TokenType::EOF_TOKEN) {
                    if (peek().type != TokenType::IDENTIFIER) {
                        throw_syntax_error("Expected variable name in destructuring");
                    }
                    var_names.push_back(peek().value);
                    advance();
                    
                    if (peek().type == TokenType::COMMA) {
                        advance();
                    }
                }
                
                if (peek().type != TokenType::RBRACKET) {
                    throw_syntax_error("Expected ']' in destructuring");
                }
                advance(); // Skip ']'
                
                if (peek().type != TokenType::ASSIGN) {
                    throw_syntax_error("Expected '=' after destructuring pattern");
                }
                advance(); // Skip '='
                
                ValuePtr value = evaluate_expression();
                
                if (value->type != ValueType::LIST) {
                    throw_type_error("Cannot destructure non-list value");
                }
                
                // Assign values to variables
                for (size_t i = 0; i < var_names.size(); i++) {
                    if (i < value->list_value.size()) {
                        current_env->set(var_names[i], value->list_value[i], is_const);
                    } else {
                        current_env->set(var_names[i], Value::make_null(), is_const);
                    }
                }
                
                skip_newlines();
                return;
            }
            
            // Check for multiple variable assignment: let x, y = func()
            if (peek().type == TokenType::IDENTIFIER) {
                std::vector<std::string> var_names;
                var_names.push_back(peek().value);
                advance();
                
                // Check if there are more variables (comma-separated)
                while (peek().type == TokenType::COMMA) {
                    advance(); // Skip ','
                    if (peek().type != TokenType::IDENTIFIER) {
                        throw_syntax_error("Expected variable name after ','");
                    }
                    var_names.push_back(peek().value);
                    advance();
                }
                
                // If multiple variables, expect assignment
                if (var_names.size() > 1) {
                    if (peek().type != TokenType::ASSIGN) {
                        throw_syntax_error("Expected '=' after variable names");
                    }
                    advance(); // Skip '='
                    
                    ValuePtr value = evaluate_expression();
                    
                    // If value is a list, destructure it
                    if (value->type == ValueType::LIST) {
                        for (size_t i = 0; i < var_names.size(); i++) {
                            if (i < value->list_value.size()) {
                                current_env->set(var_names[i], value->list_value[i], is_const);
                            } else {
                                current_env->set(var_names[i], Value::make_null(), is_const);
                            }
                        }
                    } else {
                        // Assign same value to all variables
                        for (const auto& var_name : var_names) {
                            current_env->set(var_name, value, is_const);
                        }
                    }
                    
                    skip_newlines();
                    return;
                }
                
                // Single variable - continue with normal assignment
                std::string var_name = var_names[0];
                
                // Check for property assignment: instance.property = value
                if (peek().type == TokenType::DOT) {
                    // Look ahead to see if this is an assignment or a method call
                    size_t saved_pos = current;
                    advance(); // Skip '.'
                    if (peek().type == TokenType::IDENTIFIER) {
                        advance(); // Skip property name
                        if (peek().type == TokenType::ASSIGN) {
                            // It's a property assignment
                            current = saved_pos;
                            advance(); // Skip '.'
                            std::string property_name = peek().value;
                            advance();
                            advance(); // Skip '='
                            
                            ValuePtr value = evaluate_expression();
                            
                            // Get the instance variable
                            ValuePtr instance = current_env->get(var_name);
                            if (instance == nullptr) {
                                throw_name_error(var_name);
                            }
                            
                            if (instance->type != ValueType::INSTANCE) {
                                throw_type_error("Cannot set property on non-instance type");
                            }
                            
                            // Set property
                            instance->instance_properties[property_name] = value;
                            skip_newlines();
                            return;
                        }
                    }
                    // Not a property assignment, restore position
                    current = saved_pos;
                }
                
                // Check for array index assignment: arr[index] = value
                if (peek().type == TokenType::LBRACKET) {
                    advance(); // Skip '['
                    ValuePtr index_expr = evaluate_expression();
                    
                    if (peek().type != TokenType::RBRACKET) {
                        throw_syntax_error("Expected ']' after array index");
                    }
                    advance(); // Skip ']'
                    
                    if (peek().type != TokenType::ASSIGN) {
                        throw_syntax_error("Expected '=' after array index");
                    }
                    advance(); // Skip '='
                    
                    ValuePtr value = evaluate_expression();
                    
                    // Get the array variable
                    ValuePtr arr = current_env->get(var_name);
                    if (arr == nullptr) {
                        throw_name_error(var_name);
                    }
                    
                    if (arr->type != ValueType::LIST) {
                        throw_type_error("Cannot index non-list type");
                    }
                    
                    int index = static_cast<int>(index_expr->to_number());
                    
                    // Bounds checking
                    if (index < 0 || index >= static_cast<int>(arr->list_value.size())) {
                        std::ostringstream oss;
                        oss << "List index out of range: " << index << " (size: " << arr->list_value.size() << ")";
                        throw_index_error(oss.str());
                    }
                    
                    arr->list_value[index] = value;
                    skip_newlines();
                    return;
                }
                
                if (peek().type == TokenType::ASSIGN) {
                    advance();
                    ValuePtr value = evaluate_expression();
                    current_env->set(var_name, value, is_const);  // Pass const flag
                    skip_newlines();
                    return;
                }
                
                // Compound assignment operators
                if (peek().type == TokenType::PLUS_ASSIGN || peek().type == TokenType::MINUS_ASSIGN ||
                    peek().type == TokenType::MULT_ASSIGN || peek().type == TokenType::DIV_ASSIGN ||
                    peek().type == TokenType::MOD_ASSIGN || peek().type == TokenType::POW_ASSIGN) {
                    TokenType op = peek().type;
                    advance();
                    ValuePtr right = evaluate_expression();
                    ValuePtr left = current_env->get(var_name);
                    
                    if (left == nullptr) {
                        throw_name_error(var_name);
                    }
                    
                    ValuePtr result;
                    double left_num = left->to_number();
                    double right_num = right->to_number();
                    
                    switch (op) {
                        case TokenType::PLUS_ASSIGN:
                            result = Value::make_number(left_num + right_num);
                            break;
                        case TokenType::MINUS_ASSIGN:
                            result = Value::make_number(left_num - right_num);
                            break;
                        case TokenType::MULT_ASSIGN:
                            result = Value::make_number(left_num * right_num);
                            break;
                        case TokenType::DIV_ASSIGN:
                            if (right_num == 0) throw_runtime_error("Division by zero");
                            result = Value::make_number(left_num / right_num);
                            break;
                        case TokenType::MOD_ASSIGN:
                            result = Value::make_number(std::fmod(left_num, right_num));
                            break;
                        case TokenType::POW_ASSIGN:
                            result = Value::make_number(std::pow(left_num, right_num));
                            break;
                        default:
                            result = left;
                    }
                    
                    current_env->set(var_name, result);
                    skip_newlines();
                    return;
                }
                
                // Increment/Decrement operators
                if (peek().type == TokenType::INCREMENT || peek().type == TokenType::DECREMENT) {
                    TokenType op = peek().type;
                    advance();
                    ValuePtr current_val = current_env->get(var_name);
                    
                    if (current_val == nullptr) {
                        throw_name_error(var_name);
                    }
                    
                    double num = current_val->to_number();
                    ValuePtr new_val = (op == TokenType::INCREMENT) ? 
                        Value::make_number(num + 1) : Value::make_number(num - 1);
                    
                    current_env->set(var_name, new_val);
                    skip_newlines();
                    return;
                }
            }
            
            // Not an assignment, restore position
            current = saved_pos;
        }
        
        // ASSERT statement
        if (token.type == TokenType::ASSERT) {
            advance();
            ValuePtr condition = evaluate_expression();
            std::string message = "Assertion failed";
            
            if (peek().type == TokenType::COMMA) {
                advance();
                ValuePtr msg_val = evaluate_expression();
                message = msg_val->to_string();
            }
            
            if (!condition->is_truthy()) {
                throw_runtime_error(message);
            }
            
            skip_newlines();
            return;
        }
        
        // Control flow
        if (token.type == TokenType::IF) {
            execute_if_statement();
            return;
        }
        
        if (token.type == TokenType::WHILE) {
            execute_while_loop();
            return;
        }
        
        if (token.type == TokenType::DO) {
            execute_do_while_loop();
            return;
        }
        
        if (token.type == TokenType::SWITCH) {
            execute_switch_statement();
            return;
        }
        
        if (token.type == TokenType::FOR) {
            execute_for_loop();
            return;
        }
        
        if (token.type == TokenType::LOOP) {
            execute_loop_statement();
            return;
        }
        
        if (token.type == TokenType::BREAK) {
            break_flag = true;
            advance();
            skip_newlines();
            return;
        }
        
        if (token.type == TokenType::CONTINUE) {
            continue_flag = true;
            advance();
            skip_newlines();
            return;
        }
        
        // Try to evaluate as expression statement (for method calls like nums.push(4))
        if (token.type == TokenType::IDENTIFIER) {
            evaluate_expression();
            skip_newlines();
            return;
        }
        
        // Skip unknown tokens
        advance();
        skip_newlines();
    }
    
    void execute_add_statement() {
        advance(); // Skip 'ADD'
        
        if (peek().type != TokenType::IDENTIFIER) {
            throw_syntax_error("Expected module name after ADD");
        }
        
        std::string module_name = peek().value;
        advance();
        
        // Check for AS alias
        std::string alias = module_name;
        if (peek().type == TokenType::AS) {
            advance();
            if (peek().type != TokenType::IDENTIFIER) {
                throw_syntax_error("Expected alias name after AS");
            }
            alias = peek().value;
            advance();
        }
        
        // Check if module exists in builtin modules
        if (builtin_modules.has_module(module_name)) {
            imported_modules[alias] = module_name;
            skip_newlines();
            return;
        }
        
        // Module not found
        throw_error(ErrorType::IMPORT_ERROR, "Module '" + module_name + "' not found");
    }
    
    void execute_if_statement() {
        advance(); // Skip 'if'
        ValuePtr condition = evaluate_expression();
        
        if (peek().type != TokenType::COLON) {
            throw std::runtime_error("Expected ':' after if condition");
        }
        advance();
        skip_newlines();
        
        // Find START: and END:
        if (peek().type != TokenType::START || peek(1).type != TokenType::COLON) {
            throw std::runtime_error("Expected 'START:' after if");
        }
        advance(); advance(); // Skip START:
        skip_newlines();
        
        size_t block_start = current;
        int depth = 1;
        
        while (depth > 0 && peek().type != TokenType::EOF_TOKEN) {
            if (peek().type == TokenType::START && peek(1).type == TokenType::COLON) {
                depth++;
                advance();
            } else if (peek().type == TokenType::END && peek(1).type == TokenType::COLON) {
                depth--;
                if (depth == 0) break;
                advance();
            } else {
                advance();
            }
        }
        
        size_t block_end = current;
        
        if (peek().type != TokenType::END || peek(1).type != TokenType::COLON) {
            throw std::runtime_error("Expected 'END:' to close if block");
        }
        
        size_t after_block = current;
        advance(); advance(); // Skip END:
        skip_newlines();
        
        // Execute block if condition is true
        if (condition->is_truthy()) {
            current = block_start;
            
            while (current < block_end && !break_flag && !continue_flag) {
                execute_statement();
            }
        }
        
        current = after_block + 2; // Move past END:
        skip_newlines();
    }
    
    void execute_while_loop() {
        advance(); // Skip 'while'
        size_t condition_start = current;
        
        // Parse condition once to skip past it
        ValuePtr dummy = evaluate_expression();
        
        if (peek().type != TokenType::COLON) {
            throw std::runtime_error("Expected ':' after while condition");
        }
        advance();
        skip_newlines();
        
        // Find START: and END:
        if (peek().type != TokenType::START || peek(1).type != TokenType::COLON) {
            throw std::runtime_error("Expected 'START:' after while");
        }
        advance(); advance();
        skip_newlines();
        
        size_t block_start = current;
        int depth = 1;
        
        while (depth > 0 && peek().type != TokenType::EOF_TOKEN) {
            if (peek().type == TokenType::START && peek(1).type == TokenType::COLON) {
                depth++;
                advance();
            } else if (peek().type == TokenType::END && peek(1).type == TokenType::COLON) {
                depth--;
                if (depth == 0) break;
                advance();
            } else {
                advance();
            }
        }
        
        size_t block_end = current;
        
        if (peek().type != TokenType::END || peek(1).type != TokenType::COLON) {
            throw std::runtime_error("Expected 'END:' to close while block");
        }
        
        size_t after_block = current;
        advance(); advance(); // Skip END:
        skip_newlines();
        
        // Execute loop
        int max_iterations = 100000;
        int iterations = 0;
        
        while (iterations < max_iterations) {
            // Evaluate condition
            current = condition_start;
            ValuePtr condition = evaluate_expression();
            
            if (!condition->is_truthy()) break;
            
            // Execute block
            current = block_start;
            break_flag = false;
            continue_flag = false;
            
            while (current < block_end) {
                execute_statement();
                if (break_flag) break;
                if (continue_flag) {
                    continue_flag = false;
                    break;
                }
            }
            
            if (break_flag) {
                break_flag = false;
                break;
            }
            
            iterations++;
        }
        
        current = after_block + 2;
        skip_newlines();
    }
    
    void execute_for_loop() {
        advance(); // Skip 'for'
        
        if (peek().type != TokenType::IDENTIFIER) {
            throw std::runtime_error("Expected variable name in for loop");
        }
        std::string var_name = peek().value;
        advance();
        
        if (peek().type != TokenType::IN) {
            throw std::runtime_error("Expected 'in' in for loop");
        }
        advance();
        
        ValuePtr iterable = evaluate_expression();
        
        if (peek().type != TokenType::COLON) {
            throw std::runtime_error("Expected ':' after for loop");
        }
        advance();
        skip_newlines();
        
        // Find block
        if (peek().type != TokenType::START || peek(1).type != TokenType::COLON) {
            throw std::runtime_error("Expected 'START:' after for");
        }
        advance(); advance();
        skip_newlines();
        
        size_t block_start = current;
        int depth = 1;
        
        while (depth > 0 && peek().type != TokenType::EOF_TOKEN) {
            if (peek().type == TokenType::START && peek(1).type == TokenType::COLON) {
                depth++;
                advance();
            } else if (peek().type == TokenType::END && peek(1).type == TokenType::COLON) {
                depth--;
                if (depth == 0) break;
                advance();
            } else {
                advance();
            }
        }
        
        size_t block_end = current;
        
        if (peek().type != TokenType::END || peek(1).type != TokenType::COLON) {
            throw std::runtime_error("Expected 'END:' to close for block");
        }
        
        size_t after_block = current;
        advance(); advance();
        skip_newlines();
        
        // Execute loop
        if (iterable->type == ValueType::LIST) {
            for (const auto& item : iterable->list_value) {
                current_env->set(var_name, item);
                current = block_start;
                break_flag = false;
                continue_flag = false;
                
                while (current < block_end) {
                    execute_statement();
                    if (break_flag) break;
                    if (continue_flag) {
                        continue_flag = false;
                        break;
                    }
                }
                
                if (break_flag) {
                    break_flag = false;
                    break;
                }
            }
        } else if (iterable->type == ValueType::GENERATOR) {
            // Iterate over generator values
            for (const auto& item : iterable->generator_values) {
                current_env->set(var_name, item);
                current = block_start;
                break_flag = false;
                continue_flag = false;
                
                while (current < block_end) {
                    execute_statement();
                    if (break_flag) break;
                    if (continue_flag) {
                        continue_flag = false;
                        break;
                    }
                }
                
                if (break_flag) {
                    break_flag = false;
                    break;
                }
            }
        }
        
        current = after_block + 2;
        skip_newlines();
    }
    
    void execute_loop_statement() {
        advance(); // Skip 'loop'
        
        // Check if it's LOOP WHILE syntax
        if (peek().type == TokenType::WHILE) {
            advance(); // Skip 'WHILE'
            
            size_t condition_start = current;
            
            // Parse condition once to skip past it
            ValuePtr dummy = evaluate_expression();
            
            if (peek().type != TokenType::COLON) {
                throw std::runtime_error("Expected ':' after LOOP WHILE condition");
            }
            advance();
            skip_newlines();
            
            // Find START: and END:
            if (peek().type != TokenType::START || peek(1).type != TokenType::COLON) {
                throw std::runtime_error("Expected 'START:' after LOOP WHILE");
            }
            advance(); advance();
            skip_newlines();
            
            size_t block_start = current;
            int depth = 1;
            
            while (depth > 0 && peek().type != TokenType::EOF_TOKEN) {
                if (peek().type == TokenType::START && peek(1).type == TokenType::COLON) {
                    depth++;
                    advance();
                } else if (peek().type == TokenType::END && peek(1).type == TokenType::COLON) {
                    depth--;
                    if (depth == 0) break;
                    advance();
                } else {
                    advance();
                }
            }
            
            size_t block_end = current;
            
            if (peek().type != TokenType::END || peek(1).type != TokenType::COLON) {
                throw std::runtime_error("Expected 'END:' to close LOOP WHILE block");
            }
            
            size_t after_block = current;
            advance(); advance(); // Skip END:
            skip_newlines();
            
            // Execute loop
            int max_iterations = 100000;
            int iterations = 0;
            
            while (iterations < max_iterations) {
                // Evaluate condition
                current = condition_start;
                ValuePtr condition = evaluate_expression();
                
                if (!condition->is_truthy()) break;
                
                // Execute block
                current = block_start;
                break_flag = false;
                continue_flag = false;
                
                while (current < block_end) {
                    execute_statement();
                    if (break_flag) break;
                    if (continue_flag) {
                        continue_flag = false;
                        break;
                    }
                }
                
                if (break_flag) {
                    break_flag = false;
                    break;
                }
                
                iterations++;
            }
            
            current = after_block + 2;
            skip_newlines();
            return;
        }
        
        // Otherwise, it's LOOP FOR X TIMES syntax
        std::string var_name;
        int start_val = 1;
        
        if (peek().type == TokenType::IDENTIFIER) {
            var_name = peek().value;
            advance();
            
            if (peek().type == TokenType::ASSIGN) {
                advance();
                if (peek().type == TokenType::NUMBER) {
                    start_val = static_cast<int>(std::stod(peek().value));
                    advance();
                }
            }
        }
        
        if (peek().type != TokenType::FOR) {
            throw std::runtime_error("Expected 'FOR' in loop statement (syntax: LOOP FOR X TIMES or LOOP WHILE condition)");
        }
        advance();
        
        if (peek().type != TokenType::NUMBER) {
            throw std::runtime_error("Expected number of iterations");
        }
        int iterations = static_cast<int>(std::stod(peek().value));
        advance();
        
        if (peek().type != TokenType::TIMES) {
            throw std::runtime_error("Expected 'times' in loop statement");
        }
        advance();
        
        if (peek().type != TokenType::COLON) {
            throw std::runtime_error("Expected ':' after loop statement");
        }
        advance();
        skip_newlines();
        
        // Find block
        if (peek().type != TokenType::START || peek(1).type != TokenType::COLON) {
            throw std::runtime_error("Expected 'START:' after loop");
        }
        advance(); advance();
        skip_newlines();
        
        size_t block_start = current;
        int depth = 1;
        
        while (depth > 0 && peek().type != TokenType::EOF_TOKEN) {
            if (peek().type == TokenType::START && peek(1).type == TokenType::COLON) {
                depth++;
                advance();
            } else if (peek().type == TokenType::END && peek(1).type == TokenType::COLON) {
                depth--;
                if (depth == 0) break;
                advance();
            } else {
                advance();
            }
        }
        
        size_t block_end = current;
        
        if (peek().type != TokenType::END || peek(1).type != TokenType::COLON) {
            throw std::runtime_error("Expected 'END:' to close loop block");
        }
        
        size_t after_block = current;
        advance(); advance();
        skip_newlines();
        
        // Execute loop
        for (int i = 0; i < iterations; i++) {
            if (!var_name.empty()) {
                current_env->set(var_name, Value::make_number(start_val + i));
            }
            
            current = block_start;
            break_flag = false;
            continue_flag = false;
            
            while (current < block_end) {
                execute_statement();
                if (break_flag) break;
                if (continue_flag) {
                    continue_flag = false;
                    break;
                }
            }
            
            if (break_flag) {
                break_flag = false;
                break;
            }
        }
        
        current = after_block + 2;
        skip_newlines();
    }
    
    // DO-WHILE loop (DO LOOP: ... WHILE(condition):)
    void execute_do_while_loop() {
        advance(); // Skip 'DO'
        
        // Expect LOOP keyword
        if (peek().type != TokenType::LOOP) {
            throw_syntax_error("Expected 'LOOP' after DO (syntax: DO LOOP: START: ... END: WHILE(condition):)");
        }
        advance(); // Skip 'LOOP'
        
        if (peek().type != TokenType::COLON) {
            throw_syntax_error("Expected ':' after DO LOOP");
        }
        advance();
        skip_newlines();
        
        if (peek().type != TokenType::START || peek(1).type != TokenType::COLON) {
            throw_syntax_error("Expected 'START:' after DO LOOP:");
        }
        advance(); advance(); // Skip START:
        skip_newlines();
        
        size_t block_start = current;
        int depth = 1;
        
        // Find block end
        while (depth > 0 && peek().type != TokenType::EOF_TOKEN) {
            if (peek().type == TokenType::START && peek(1).type == TokenType::COLON) {
                depth++;
                advance();
            } else if (peek().type == TokenType::END && peek(1).type == TokenType::COLON) {
                depth--;
                if (depth == 0) break;
                advance();
            } else {
                advance();
            }
        }
        
        size_t block_end = current;
        
        if (peek().type != TokenType::END || peek(1).type != TokenType::COLON) {
            throw_syntax_error("Expected 'END:' to close DO LOOP block");
        }
        advance(); advance(); // Skip END:
        skip_newlines();
        
        // Expect WHILE
        if (peek().type != TokenType::WHILE) {
            throw_syntax_error("Expected 'WHILE' after DO LOOP block (syntax: END: WHILE(condition):)");
        }
        advance(); // Skip 'WHILE'
        
        // Expect opening parenthesis
        if (peek().type != TokenType::LPAREN) {
            throw_syntax_error("Expected '(' after WHILE (syntax: WHILE(condition):)");
        }
        advance(); // Skip '('
        
        size_t condition_start = current;
        
        // Parse condition to find closing parenthesis
        int paren_depth = 1;
        while (paren_depth > 0 && peek().type != TokenType::EOF_TOKEN) {
            if (peek().type == TokenType::LPAREN) {
                paren_depth++;
            } else if (peek().type == TokenType::RPAREN) {
                paren_depth--;
                if (paren_depth == 0) break;
            }
            advance();
        }
        
        size_t condition_end = current;
        
        if (peek().type != TokenType::RPAREN) {
            throw_syntax_error("Expected ')' after condition");
        }
        advance(); // Skip ')'
        
        // Expect colon
        if (peek().type != TokenType::COLON) {
            throw_syntax_error("Expected ':' after WHILE(condition) (syntax: WHILE(condition):)");
        }
        advance(); // Skip ':'
        
        size_t after_condition = current;
        skip_newlines();
        
        // Execute loop (at least once)
        int max_iterations = 100000;
        int iterations = 0;
        
        do {
            // Execute block
            current = block_start;
            break_flag = false;
            continue_flag = false;
            
            while (current < block_end) {
                execute_statement();
                if (break_flag) break;
                if (continue_flag) {
                    continue_flag = false;
                    break;
                }
            }
            
            if (break_flag) {
                break_flag = false;
                break;
            }
            
            // Evaluate condition
            current = condition_start;
            ValuePtr condition = evaluate_expression();
            
            if (!condition->is_truthy()) break;
            
            iterations++;
        } while (iterations < max_iterations);
        
        current = after_condition;
        skip_newlines();
    }
    
    // SWITCH statement
    void execute_switch_statement() {
        advance(); // Skip 'SWITCH'
        
        ValuePtr switch_value = evaluate_expression();
        
        if (peek().type != TokenType::COLON) {
            throw_syntax_error("Expected ':' after switch expression");
        }
        advance();
        skip_newlines();
        
        if (peek().type != TokenType::START || peek(1).type != TokenType::COLON) {
            throw_syntax_error("Expected 'START:' after switch");
        }
        advance(); advance(); // Skip START:
        skip_newlines();
        
        bool executed = false;
        
        // Parse and execute cases
        while (peek().type != TokenType::END && peek().type != TokenType::EOF_TOKEN && !executed) {
            skip_newlines();
            
            if (peek().type == TokenType::END) break;
            
            if (peek().type == TokenType::CASE) {
                advance(); // Skip 'CASE'
                ValuePtr case_value = evaluate_expression();
                
                if (peek().type != TokenType::COLON) {
                    throw_syntax_error("Expected ':' after case value");
                }
                advance();
                skip_newlines();
                
                if (peek().type != TokenType::START || peek(1).type != TokenType::COLON) {
                    throw_syntax_error("Expected 'START:' after case");
                }
                advance(); advance(); // Skip START:
                skip_newlines();
                
                size_t case_start = current;
                
                // Find case block end
                int depth = 1;
                while (depth > 0 && peek().type != TokenType::EOF_TOKEN) {
                    if (peek().type == TokenType::START && peek(1).type == TokenType::COLON) {
                        depth++;
                        advance();
                    } else if (peek().type == TokenType::END && peek(1).type == TokenType::COLON) {
                        depth--;
                        if (depth == 0) break;
                        advance();
                    } else {
                        advance();
                    }
                }
                
                size_t case_end = current;
                
                if (peek().type != TokenType::END || peek(1).type != TokenType::COLON) {
                    throw_syntax_error("Expected 'END:' to close case block");
                }
                advance(); advance(); // Skip END:
                skip_newlines();
                
                // Check if this case matches and execute
                if (!executed && switch_value->to_number() == case_value->to_number()) {
                    executed = true;
                    
                    // Execute this case
                    size_t exec_start = current;
                    current = case_start;
                    while (current < case_end && !break_flag) {
                        execute_statement();
                    }
                    break_flag = false;
                    
                    // Set current to after this case's END: to skip remaining cases
                    current = case_end;
                    if (peek().type == TokenType::END && peek(1).type == TokenType::COLON) {
                        advance(); advance(); // Skip END:
                    }
                    
                    // Break out of the case parsing loop
                    break;
                }
                
            } else if (peek().type == TokenType::DEFAULT) {
                advance(); // Skip 'DEFAULT'
                
                if (peek().type != TokenType::COLON) {
                    throw_syntax_error("Expected ':' after DEFAULT");
                }
                advance();
                skip_newlines();
                
                if (peek().type != TokenType::START || peek(1).type != TokenType::COLON) {
                    throw_syntax_error("Expected 'START:' after DEFAULT");
                }
                advance(); advance(); // Skip START:
                skip_newlines();
                
                size_t default_start = current;
                
                // Find default block end
                int depth = 1;
                while (depth > 0 && peek().type != TokenType::EOF_TOKEN) {
                    if (peek().type == TokenType::START && peek(1).type == TokenType::COLON) {
                        depth++;
                        advance();
                    } else if (peek().type == TokenType::END && peek(1).type == TokenType::COLON) {
                        depth--;
                        if (depth == 0) break;
                        advance();
                    } else {
                        advance();
                    }
                }
                
                size_t default_end = current;
                
                if (peek().type != TokenType::END || peek(1).type != TokenType::COLON) {
                    throw_syntax_error("Expected 'END:' to close DEFAULT block");
                }
                advance(); advance(); // Skip END:
                skip_newlines();
                
                // Execute default ONLY if no case was executed
                if (!executed) {
                    executed = true;
                    
                    current = default_start;
                    while (current < default_end && !break_flag) {
                        execute_statement();
                    }
                    break_flag = false;
                }
                // Break out after handling default
                break;
                
            } else {
                advance();
            }
        }
        
        // Skip to END: of switch (just advance tokens, don't execute)
        int skip_depth = 0;
        while (peek().type != TokenType::EOF_TOKEN) {
            if (peek().type == TokenType::START && peek(1).type == TokenType::COLON) {
                skip_depth++;
            } else if (peek().type == TokenType::END && peek(1).type == TokenType::COLON) {
                if (skip_depth == 0) {
                    // Found the switch END:
                    break;
                }
                skip_depth--;
            }
            advance();
        }
        
        if (peek().type != TokenType::END || peek(1).type != TokenType::COLON) {
            throw_syntax_error("Expected 'END:' to close switch block");
        }
        advance(); advance(); // Skip END:
        skip_newlines();
    }
    
    // STATIC variable declaration
    void execute_static_statement() {
        advance(); // Skip 'STATIC'
        
        if (peek().type != TokenType::IDENTIFIER) {
            throw_syntax_error("Expected variable name after STATIC");
        }
        
        std::string var_name = peek().value;
        advance();
        
        if (peek().type != TokenType::ASSIGN) {
            throw_syntax_error("Expected '=' after static variable name");
        }
        advance();
        
        ValuePtr value = evaluate_expression();
        
        // Check if static variable already exists (already initialized)
        if (static_variables.find(var_name) == static_variables.end()) {
            // First time initialization
            static_variables[var_name] = value;
        }
        
        // Set in current environment (reference to static storage)
        current_env->set(var_name, static_variables[var_name]);
        skip_newlines();
    }
    
    // ENUM declaration
    void execute_enum_statement() {
        advance(); // Skip 'ENUM'
        
        if (peek().type != TokenType::IDENTIFIER) {
            throw_syntax_error("Expected enum name after ENUM");
        }
        
        std::string enum_name = peek().value;
        advance();
        
        if (peek().type != TokenType::COLON) {
            throw_syntax_error("Expected ':' after enum name");
        }
        advance();
        skip_newlines();
        
        if (peek().type != TokenType::START || peek(1).type != TokenType::COLON) {
            throw_syntax_error("Expected 'START:' after enum declaration");
        }
        advance(); advance(); // Skip START:
        skip_newlines();
        
        std::map<std::string, ValuePtr> enum_values;
        int auto_value = 0;
        
        // Parse enum members
        while (peek().type != TokenType::END && peek().type != TokenType::EOF_TOKEN) {
            skip_newlines();
            
            if (peek().type == TokenType::END) break;
            
            if (peek().type != TokenType::IDENTIFIER) {
                throw_syntax_error("Expected enum member name");
            }
            
            std::string member_name = peek().value;
            advance();
            
            ValuePtr member_value;
            if (peek().type == TokenType::ASSIGN) {
                advance();
                member_value = evaluate_expression();
                auto_value = static_cast<int>(member_value->to_number()) + 1;
            } else {
                member_value = Value::make_number(auto_value);
                auto_value++;
            }
            
            enum_values[member_name] = member_value;
            skip_newlines();
        }
        
        if (peek().type != TokenType::END || peek(1).type != TokenType::COLON) {
            throw_syntax_error("Expected 'END:' to close enum block");
        }
        advance(); advance(); // Skip END:
        skip_newlines();
        
        // Store enum
        enums[enum_name] = enum_values;
    }
    
    // FUNC declaration
    void execute_func_statement(bool is_async = false) {
        advance(); // Skip 'FUNC'
        
        if (peek().type != TokenType::IDENTIFIER) {
            throw_syntax_error("Expected function name after FUNC");
        }
        
        std::string func_name = peek().value;
        advance();
        
        if (peek().type != TokenType::LPAREN) {
            throw_syntax_error("Expected '(' after function name");
        }
        advance(); // Skip '('
        
        // Parse parameters with default values and varargs
        std::vector<std::string> params;
        std::map<std::string, ValuePtr> default_values;
        std::string varargs_param;
        
        while (peek().type != TokenType::RPAREN && peek().type != TokenType::EOF_TOKEN) {
            // Check for varargs (*args)
            if (peek().type == TokenType::MULTIPLY) {
                advance(); // Skip '*'
                if (peek().type != TokenType::IDENTIFIER) {
                    throw_syntax_error("Expected parameter name after '*'");
                }
                varargs_param = peek().value;
                advance();
                
                // Varargs must be last parameter
                if (peek().type == TokenType::COMMA) {
                    throw_syntax_error("Variable arguments (*args) must be the last parameter");
                }
                break;
            }
            
            if (peek().type != TokenType::IDENTIFIER) {
                throw_syntax_error("Expected parameter name");
            }
            std::string param_name = peek().value;
            params.push_back(param_name);
            advance();
            
            // Check for default value
            if (peek().type == TokenType::ASSIGN) {
                advance(); // Skip '='
                
                // Evaluate default value expression
                ValuePtr default_val = evaluate_expression();
                default_values[param_name] = default_val;
            }
            
            if (peek().type == TokenType::COMMA) {
                advance();
            }
        }
        
        if (peek().type != TokenType::RPAREN) {
            throw_syntax_error("Expected ')' after parameters");
        }
        advance(); // Skip ')'
        
        if (peek().type != TokenType::COLON) {
            throw_syntax_error("Expected ':' after function declaration");
        }
        advance();
        skip_newlines();
        
        if (peek().type != TokenType::START || peek(1).type != TokenType::COLON) {
            throw_syntax_error("Expected 'START:' after function declaration");
        }
        advance(); advance(); // Skip START:
        skip_newlines();
        
        size_t body_start = current;
        
        // Find function body end
        int depth = 1;
        while (depth > 0 && peek().type != TokenType::EOF_TOKEN) {
            if (peek().type == TokenType::START && peek(1).type == TokenType::COLON) {
                depth++;
                advance();
            } else if (peek().type == TokenType::END && peek(1).type == TokenType::COLON) {
                depth--;
                if (depth == 0) break;
                advance();
            } else {
                advance();
            }
        }
        
        size_t body_end = current;
        
        if (peek().type != TokenType::END || peek(1).type != TokenType::COLON) {
            throw_syntax_error("Expected 'END:' to close function");
        }
        advance(); advance(); // Skip END:
        skip_newlines();
        
        // Store function
        Function func;
        func.params = params;
        func.default_values = default_values;
        func.varargs_param = varargs_param;
        func.is_async = is_async;
        func.is_generator = false;  // Will be detected at runtime
        func.body_start = body_start;
        func.body_end = body_end;
        functions[func_name] = func;
    }
    
    // CLASS declaration
    void execute_class_statement() {
        advance(); // Skip 'CLASS'
        
        if (peek().type != TokenType::IDENTIFIER) {
            throw_syntax_error("Expected class name after CLASS");
        }
        
        std::string class_name = peek().value;
        advance();
        
        if (peek().type != TokenType::COLON) {
            throw_syntax_error("Expected ':' after class name");
        }
        advance();
        skip_newlines();
        
        if (peek().type != TokenType::START || peek(1).type != TokenType::COLON) {
            throw_syntax_error("Expected 'START:' after class declaration");
        }
        advance(); advance(); // Skip START:
        skip_newlines();
        
        // Parse class body (methods)
        Class cls;
        cls.name = class_name;
        
        while (peek().type != TokenType::END && peek().type != TokenType::EOF_TOKEN) {
            if (peek().type == TokenType::FUNC) {
                // Parse method
                advance(); // Skip 'FUNC'
                
                // Method name can be identifier or keyword (like 'add', 'multiply', etc.)
                if (peek().type != TokenType::IDENTIFIER && peek().value.empty()) {
                    throw_syntax_error("Expected method name after FUNC");
                }
                
                std::string method_name = peek().value;
                advance();
                
                if (peek().type != TokenType::LPAREN) {
                    throw_syntax_error("Expected '(' after method name");
                }
                advance(); // Skip '('
                
                // Parse parameters (first should be 'self' for instance methods)
                std::vector<std::string> params;
                std::map<std::string, ValuePtr> default_values;
                std::string varargs_param;
                
                while (peek().type != TokenType::RPAREN && peek().type != TokenType::EOF_TOKEN) {
                    // Check for varargs
                    if (peek().type == TokenType::MULTIPLY) {
                        advance(); // Skip '*'
                        if (peek().type != TokenType::IDENTIFIER) {
                            throw_syntax_error("Expected parameter name after '*'");
                        }
                        varargs_param = peek().value;
                        advance();
                        if (peek().type == TokenType::COMMA) {
                            throw_syntax_error("Variable arguments (*args) must be the last parameter");
                        }
                        break;
                    }
                    
                    if (peek().type != TokenType::IDENTIFIER) {
                        throw_syntax_error("Expected parameter name");
                    }
                    std::string param_name = peek().value;
                    params.push_back(param_name);
                    advance();
                    
                    // Check for default value
                    if (peek().type == TokenType::ASSIGN) {
                        advance(); // Skip '='
                        ValuePtr default_val = evaluate_expression();
                        default_values[param_name] = default_val;
                    }
                    
                    if (peek().type == TokenType::COMMA) {
                        advance();
                    }
                }
                
                if (peek().type != TokenType::RPAREN) {
                    throw_syntax_error("Expected ')' after parameters");
                }
                advance(); // Skip ')'
                
                if (peek().type != TokenType::COLON) {
                    throw_syntax_error("Expected ':' after method declaration");
                }
                advance();
                skip_newlines();
                
                if (peek().type != TokenType::START || peek(1).type != TokenType::COLON) {
                    throw_syntax_error("Expected 'START:' after method declaration");
                }
                advance(); advance(); // Skip START:
                skip_newlines();
                
                size_t body_start = current;
                
                // Find method body end
                int depth = 1;
                while (depth > 0 && peek().type != TokenType::EOF_TOKEN) {
                    if (peek().type == TokenType::START && peek(1).type == TokenType::COLON) {
                        depth++;
                        advance();
                    } else if (peek().type == TokenType::END && peek(1).type == TokenType::COLON) {
                        depth--;
                        if (depth == 0) break;
                        advance();
                    } else {
                        advance();
                    }
                }
                
                size_t body_end = current;
                
                if (peek().type != TokenType::END || peek(1).type != TokenType::COLON) {
                    throw_syntax_error("Expected 'END:' to close method");
                }
                advance(); advance(); // Skip END:
                skip_newlines();
                
                // Store method
                Function method;
                method.params = params;
                method.default_values = default_values;
                method.varargs_param = varargs_param;
                method.body_start = body_start;
                method.body_end = body_end;
                cls.methods[method_name] = method;
            } else {
                skip_newlines();
                if (peek().type != TokenType::END) {
                    advance(); // Skip unknown tokens
                }
            }
        }
        
        if (peek().type != TokenType::END || peek(1).type != TokenType::COLON) {
            throw_syntax_error("Expected 'END:' to close class");
        }
        advance(); advance(); // Skip END:
        skip_newlines();
        
        // Store class
        classes[class_name] = cls;
    }
    
    // Instantiate a class
    ValuePtr instantiate_class(const std::string& class_name, const std::vector<ValuePtr>& args) {
        if (classes.find(class_name) == classes.end()) {
            throw_runtime_error("Class '" + class_name + "' not defined");
        }
        
        Class& cls = classes[class_name];
        
        // Create instance
        ValuePtr instance = Value::make_instance(class_name);
        
        // Call __init__ if it exists
        if (cls.methods.find("__init__") != cls.methods.end()) {
            // Create arguments with self as first argument
            std::vector<ValuePtr> init_args;
            init_args.push_back(instance);
            for (const auto& arg : args) {
                init_args.push_back(arg);
            }
            
            call_method(instance, "__init__", init_args);
        }
        
        return instance;
    }
    
    // Call a method on an instance
    ValuePtr call_method(ValuePtr instance, const std::string& method_name, const std::vector<ValuePtr>& args) {
        if (instance->type != ValueType::INSTANCE) {
            throw_type_error("Cannot call method on non-instance");
        }
        
        if (classes.find(instance->class_name) == classes.end()) {
            throw_runtime_error("Class '" + instance->class_name + "' not found");
        }
        
        Class& cls = classes[instance->class_name];
        
        if (cls.methods.find(method_name) == cls.methods.end()) {
            throw_runtime_error("Method '" + method_name + "' not found in class '" + instance->class_name + "'");
        }
        
        Function& method = cls.methods[method_name];
        
        // Check argument count (first param should be 'self')
        size_t min_args = 0;
        for (const auto& param : method.params) {
            if (method.default_values.find(param) == method.default_values.end()) {
                min_args++;
            }
        }
        
        // args already includes self
        if (args.size() < min_args || (args.size() > method.params.size() && method.varargs_param.empty())) {
            std::ostringstream oss;
            oss << "Method '" << method_name << "' expects " << min_args << " argument(s), got " << args.size();
            throw_runtime_error(oss.str());
        }
        
        // Create new environment for method
        auto method_env = std::make_shared<Environment>(global_env);
        
        // Bind parameters (including self)
        for (size_t i = 0; i < method.params.size(); i++) {
            if (i < args.size()) {
                method_env->set(method.params[i], args[i]);
            } else {
                // Use default value
                if (method.default_values.find(method.params[i]) != method.default_values.end()) {
                    method_env->set(method.params[i], method.default_values[method.params[i]]);
                }
            }
        }
        
        // Bind varargs
        if (!method.varargs_param.empty()) {
            std::vector<ValuePtr> varargs;
            for (size_t i = method.params.size(); i < args.size(); i++) {
                varargs.push_back(args[i]);
            }
            method_env->set(method.varargs_param, Value::make_list(varargs));
        }
        
        // Save current state
        auto saved_env = current_env;
        auto saved_current = current;
        bool saved_return_flag = return_flag;
        ValuePtr saved_return_value = return_value;
        
        // Execute method body
        current_env = method_env;
        current = method.body_start;
        return_flag = false;
        return_value = Value::make_null();
        
        while (current < method.body_end && !return_flag) {
            execute_statement();
        }
        
        // Restore state
        ValuePtr result = return_value;
        current_env = saved_env;
        current = saved_current;
        return_flag = saved_return_flag;
        return_value = saved_return_value;
        
        return result;
    }
    
    // Call user-defined function
    ValuePtr call_user_function(const std::string& name, const std::vector<ValuePtr>& args) {
        if (functions.find(name) == functions.end()) {
            throw_runtime_error("Function '" + name + "' not defined");
        }
        
        Function& func = functions[name];
        
        // Check argument count (with varargs and defaults support)
        size_t min_args = 0;
        for (const auto& param : func.params) {
            if (func.default_values.find(param) == func.default_values.end()) {
                min_args++;
            }
        }
        
        size_t max_args = func.params.size();
        if (!func.varargs_param.empty()) {
            max_args = SIZE_MAX; // Unlimited with varargs
        }
        
        if (args.size() < min_args || args.size() > max_args) {
            std::ostringstream oss;
            oss << "Function '" << name << "' expects ";
            if (min_args == max_args) {
                oss << min_args;
            } else if (max_args == SIZE_MAX) {
                oss << "at least " << min_args;
            } else {
                oss << min_args << " to " << max_args;
            }
            oss << " argument(s), got " << args.size();
            throw_runtime_error(oss.str());
        }
        
        // Create new environment for function
        auto func_env = std::make_shared<Environment>(global_env);
        
        // Bind regular parameters
        for (size_t i = 0; i < func.params.size(); i++) {
            if (i < args.size()) {
                func_env->set(func.params[i], args[i]);
            } else {
                // Use default value
                if (func.default_values.find(func.params[i]) != func.default_values.end()) {
                    func_env->set(func.params[i], func.default_values[func.params[i]]);
                } else {
                    throw_runtime_error("Missing required argument: " + func.params[i]);
                }
            }
        }
        
        // Bind varargs parameter
        if (!func.varargs_param.empty()) {
            std::vector<ValuePtr> varargs;
            for (size_t i = func.params.size(); i < args.size(); i++) {
                varargs.push_back(args[i]);
            }
            func_env->set(func.varargs_param, Value::make_list(varargs));
        }
        
        // Save current state
        auto saved_env = current_env;
        auto saved_current = current;
        bool saved_return_flag = return_flag;
        ValuePtr saved_return_value = return_value;
        bool saved_yield_flag = yield_flag;
        std::vector<ValuePtr> saved_yielded_values = yielded_values;
        
        // Execute function body
        current_env = func_env;
        current = func.body_start;
        return_flag = false;
        return_value = Value::make_null();
        yield_flag = false;
        yielded_values.clear();
        
        while (current < func.body_end && !return_flag) {
            execute_statement();
            // Don't stop on yield, continue collecting
        }
        
        // Check if this was a generator function (had yields)
        ValuePtr result;
        if (!yielded_values.empty()) {
            // Return a generator object
            result = Value::make_generator(yielded_values);
        } else {
            result = return_value;
        }
        
        // Restore state
        current_env = saved_env;
        current = saved_current;
        return_flag = saved_return_flag;
        return_value = saved_return_value;
        yield_flag = saved_yield_flag;
        yielded_values = saved_yielded_values;
        
        return result;
    }
    
    // TRY-CATCH statement
    void execute_try_catch() {
        advance(); // Skip 'TRY'
        
        if (peek().type != TokenType::COLON) {
            throw_syntax_error("Expected ':' after TRY");
        }
        advance();
        skip_newlines();
        
        if (peek().type != TokenType::START || peek(1).type != TokenType::COLON) {
            throw_syntax_error("Expected 'START:' after TRY");
        }
        advance(); advance(); // Skip START:
        skip_newlines();
        
        size_t try_start = current;
        
        // Find try block end
        int depth = 1;
        while (depth > 0 && peek().type != TokenType::EOF_TOKEN) {
            if (peek().type == TokenType::START && peek(1).type == TokenType::COLON) {
                depth++;
                advance();
            } else if (peek().type == TokenType::END && peek(1).type == TokenType::COLON) {
                depth--;
                if (depth == 0) break;
                advance();
            } else {
                advance();
            }
        }
        
        size_t try_end = current;
        
        if (peek().type != TokenType::END || peek(1).type != TokenType::COLON) {
            throw_syntax_error("Expected 'END:' to close TRY block");
        }
        advance(); advance(); // Skip END:
        skip_newlines();
        
        // Parse CATCH
        if (peek().type != TokenType::CATCH) {
            throw_syntax_error("Expected CATCH after TRY block");
        }
        advance(); // Skip 'CATCH'
        
        std::string error_var = "error";
        if (peek().type == TokenType::IDENTIFIER) {
            error_var = peek().value;
            advance();
        }
        
        if (peek().type != TokenType::COLON) {
            throw_syntax_error("Expected ':' after CATCH");
        }
        advance();
        skip_newlines();
        
        if (peek().type != TokenType::START || peek(1).type != TokenType::COLON) {
            throw_syntax_error("Expected 'START:' after CATCH");
        }
        advance(); advance(); // Skip START:
        skip_newlines();
        
        size_t catch_start = current;
        
        // Find catch block end
        depth = 1;
        while (depth > 0 && peek().type != TokenType::EOF_TOKEN) {
            if (peek().type == TokenType::START && peek(1).type == TokenType::COLON) {
                depth++;
                advance();
            } else if (peek().type == TokenType::END && peek(1).type == TokenType::COLON) {
                depth--;
                if (depth == 0) break;
                advance();
            } else {
                advance();
            }
        }
        
        size_t catch_end = current;
        
        if (peek().type != TokenType::END || peek(1).type != TokenType::COLON) {
            throw_syntax_error("Expected 'END:' to close CATCH block");
        }
        
        size_t after_catch = current;
        advance(); advance(); // Skip END:
        skip_newlines();
        
        // Execute TRY block
        try {
            current = try_start;
            while (current < try_end && !break_flag && !continue_flag && !return_flag) {
                execute_statement();
            }
        } catch (const std::exception& e) {
            // Execute CATCH block
            current_env->set(error_var, Value::make_string(e.what()));
            current = catch_start;
            while (current < catch_end && !break_flag && !continue_flag && !return_flag) {
                execute_statement();
            }
        }
        
        current = after_catch + 2;
        skip_newlines();
    }
    
    // WITH statement (resource management)
    void execute_with_statement() {
        advance(); // Skip 'WITH'
        
        // Parse: WITH expression AS variable: START: ... END:
        ValuePtr resource = evaluate_expression();
        
        if (peek().type != TokenType::AS) {
            throw_syntax_error("Expected AS after WITH expression");
        }
        advance(); // Skip 'AS'
        
        if (peek().type != TokenType::IDENTIFIER && peek().value.empty()) {
            throw_syntax_error("Expected variable name after AS");
        }
        std::string var_name = peek().value;
        advance();
        
        if (peek().type != TokenType::COLON) {
            throw_syntax_error("Expected ':' after WITH variable");
        }
        advance();
        skip_newlines();
        
        if (peek().type != TokenType::START || peek(1).type != TokenType::COLON) {
            throw_syntax_error("Expected 'START:' after WITH statement");
        }
        advance(); advance(); // Skip START:
        skip_newlines();
        
        size_t body_start = current;
        
        // Find WITH body end
        int depth = 1;
        while (depth > 0 && peek().type != TokenType::EOF_TOKEN) {
            if (peek().type == TokenType::START && peek(1).type == TokenType::COLON) {
                depth++;
                advance();
            } else if (peek().type == TokenType::END && peek(1).type == TokenType::COLON) {
                depth--;
                if (depth == 0) break;
                advance();
            } else {
                advance();
            }
        }
        
        size_t body_end = current;
        
        if (peek().type != TokenType::END || peek(1).type != TokenType::COLON) {
            throw_syntax_error("Expected 'END:' to close WITH block");
        }
        advance(); advance(); // Skip END:
        skip_newlines();
        
        // Set the resource variable
        current_env->set(var_name, resource);
        
        // Execute WITH block
        current = body_start;
        while (current < body_end && !break_flag && !continue_flag && !return_flag) {
            execute_statement();
        }
        
        // Note: In a full implementation, we would call a cleanup method here
        // For now, the resource just goes out of scope
    }

public:
    Interpreter() : current(0), break_flag(false), continue_flag(false), return_flag(false) {
        global_env = std::make_shared<Environment>();
        current_env = global_env;
        return_value = Value::make_null();
    }
    
    std::string execute(const std::string& source) {
        output_buffer.str("");
        output_buffer.clear();
        source_code = source;
        
        // Initialize error handler with source code
        error_handler = ErrorHandler(source, "", true);
        
        try {
            Lexer lexer(source);
            tokens = lexer.tokenize();
            current = 0;
            
            while (peek().type != TokenType::EOF_TOKEN) {
                execute_statement();
            }
            
        } catch (const std::exception& e) {
            output_buffer << e.what() << "\n";
        }
        
        return output_buffer.str();
    }
};

} // namespace susa

#endif // SUSA_INTERPRETER_V2_HPP
