#ifndef SUSA_INTERPRETER_HPP
#define SUSA_INTERPRETER_HPP

#include "susa_lexer.hpp"
#include "susa_value.hpp"
#include <map>
#include <stack>
#include <cmath>
#include <algorithm>

namespace susa {

class Environment {
public:
    std::map<std::string, ValuePtr> variables;
    std::shared_ptr<Environment> parent;
    
    Environment(std::shared_ptr<Environment> p = nullptr) : parent(p) {}
    
    void set(const std::string& name, ValuePtr value) {
        variables[name] = value;
    }
    
    ValuePtr get(const std::string& name) {
        auto it = variables.find(name);
        if (it != variables.end()) {
            return it->second;
        }
        if (parent) {
            return parent->get(name);
        }
        return Value::make_null();
    }
    
    bool exists(const std::string& name) {
        if (variables.find(name) != variables.end()) {
            return true;
        }
        if (parent) {
            return parent->exists(name);
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
    std::string output_buffer;
    
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
    
    bool match(TokenType type) {
        if (peek().type == type) {
            advance();
            return true;
        }
        return false;
    }
    
    void skip_newlines() {
        while (peek().type == TokenType::NEWLINE) {
            advance();
        }
    }
    
    ValuePtr evaluate_expression() {
        return evaluate_or();
    }
    
    ValuePtr evaluate_or() {
        ValuePtr left = evaluate_ternary();
        
        while (peek().type == TokenType::OR) {
            advance();
            ValuePtr right = evaluate_ternary();
            bool result = left->is_truthy() || right->is_truthy();
            left = Value::make_bool(result);
        }
        
        return left;
    }
    
    ValuePtr evaluate_ternary() {
        ValuePtr condition = evaluate_and();
        
        // Check for ternary operator: condition ? true_val : false_val
        if (peek().type == TokenType::IDENTIFIER && peek().value == "?") {
            advance(); // Skip '?'
            ValuePtr true_val = evaluate_and();
            
            if (peek().type != TokenType::COLON) {
                throw std::runtime_error("Expected ':' in ternary operator");
            }
            advance(); // Skip ':'
            
            ValuePtr false_val = evaluate_and();
            
            return condition->is_truthy() ? true_val : false_val;
        }
        
        return condition;
    }
    
    ValuePtr evaluate_and() {
        ValuePtr left = evaluate_not();
        
        while (peek().type == TokenType::AND) {
            advance();
            ValuePtr right = evaluate_not();
            bool result = left->is_truthy() && right->is_truthy();
            left = Value::make_bool(result);
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
        ValuePtr left = evaluate_addition();
        
        while (true) {
            TokenType op = peek().type;
            if (op == TokenType::EQUAL || op == TokenType::NOT_EQUAL ||
                op == TokenType::LESS || op == TokenType::GREATER ||
                op == TokenType::LESS_EQUAL || op == TokenType::GREATER_EQUAL) {
                advance();
                ValuePtr right = evaluate_addition();
                
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
    
    ValuePtr evaluate_addition() {
        ValuePtr left = evaluate_multiplication();
        
        while (peek().type == TokenType::PLUS || peek().type == TokenType::MINUS) {
            TokenType op = peek().type;
            advance();
            ValuePtr right = evaluate_multiplication();
            
            if (op == TokenType::PLUS) {
                if (left->type == ValueType::STRING || right->type == ValueType::STRING) {
                    left = Value::make_string(left->to_string() + right->to_string());
                } else {
                    left = Value::make_number(left->to_number() + right->to_number());
                }
            } else {
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
                    throw std::runtime_error("Division by zero");
                }
                left = Value::make_number(left_num / right_num);
            } else {
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
        return evaluate_primary();
    }
    
    ValuePtr evaluate_primary() {
        Token& token = peek();
        
        // Numbers
        if (token.type == TokenType::NUMBER) {
            advance();
            return Value::make_number(std::stod(token.value));
        }
        
        // Strings
        if (token.type == TokenType::STRING) {
            advance();
            std::string str_val = token.value;
            
            // Check if it's a template string
            if (str_val.find("\x01TEMPLATE\x01") == 0) {
                // Remove the marker
                str_val = str_val.substr(11);
                
                // Process template string interpolation
                std::string result;
                size_t pos = 0;
                while (pos < str_val.length()) {
                    size_t start = str_val.find('{', pos);
                    if (start == std::string::npos) {
                        result += str_val.substr(pos);
                        break;
                    }
                    
                    result += str_val.substr(pos, start - pos);
                    
                    size_t end = str_val.find('}', start);
                    if (end == std::string::npos) {
                        result += str_val.substr(start);
                        break;
                    }
                    
                    std::string expr_str = str_val.substr(start + 1, end - start - 1);
                    
                    // Parse and evaluate the expression
                    try {
                        // Simple variable lookup
                        ValuePtr var_value = current_env->get(expr_str);
                        if (var_value->type != ValueType::NULL_TYPE) {
                            result += var_value->to_string();
                        } else {
                            // Try to evaluate as expression (for now, just use variable)
                            result += "{" + expr_str + "}";
                        }
                    } catch (...) {
                        result += "{" + expr_str + "}";
                    }
                    
                    pos = end + 1;
                }
                
                return Value::make_string(result);
            }
            
            return Value::make_string(str_val);
        }
        
        // Booleans
        if (token.type == TokenType::TRUE) {
            advance();
            return Value::make_bool(true);
        }
        if (token.type == TokenType::FALSE) {
            advance();
            return Value::make_bool(false);
        }
        
        // Null
        if (token.type == TokenType::NULL_VALUE) {
            advance();
            return Value::make_null();
        }
        
        // Identifiers (variables)
        if (token.type == TokenType::IDENTIFIER) {
            std::string name = token.value;
            advance();
            
            // Function call
            if (peek().type == TokenType::LPAREN) {
                return evaluate_function_call(name);
            }
            
            // Variable access
            return current_env->get(name);
        }
        
        // Parentheses
        if (token.type == TokenType::LPAREN) {
            advance();
            ValuePtr value = evaluate_expression();
            if (peek().type != TokenType::RPAREN) {
                throw std::runtime_error("Expected ')' after expression");
            }
            advance();
            return value;
        }
        
        // Lists
        if (token.type == TokenType::LBRACKET) {
            advance();
            std::vector<ValuePtr> elements;
            
            while (peek().type != TokenType::RBRACKET && peek().type != TokenType::EOF_TOKEN) {
                elements.push_back(evaluate_expression());
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
        
        throw std::runtime_error("Unexpected token: " + token.value);
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
        
        // Built-in functions
        return call_builtin_function(name, args);
    }
    
    ValuePtr call_builtin_function(const std::string& name, const std::vector<ValuePtr>& args) {
        std::string lower_name = name;
        std::transform(lower_name.begin(), lower_name.end(), lower_name.begin(), ::tolower);
        
        // Math functions
        if (lower_name == "sqrt" && args.size() == 1) {
            return Value::make_number(std::sqrt(args[0]->to_number()));
        }
        if (lower_name == "pow" && args.size() == 2) {
            return Value::make_number(std::pow(args[0]->to_number(), args[1]->to_number()));
        }
        if (lower_name == "abs" && args.size() == 1) {
            return Value::make_number(std::abs(args[0]->to_number()));
        }
        if (lower_name == "max" && args.size() >= 1) {
            double max_val = args[0]->to_number();
            for (size_t i = 1; i < args.size(); i++) {
                max_val = std::max(max_val, args[i]->to_number());
            }
            return Value::make_number(max_val);
        }
        if (lower_name == "min" && args.size() >= 1) {
            double min_val = args[0]->to_number();
            for (size_t i = 1; i < args.size(); i++) {
                min_val = std::min(min_val, args[i]->to_number());
            }
            return Value::make_number(min_val);
        }
        
        // String functions
        if (lower_name == "len" && args.size() == 1) {
            if (args[0]->type == ValueType::STRING) {
                return Value::make_number(args[0]->string_value.length());
            } else if (args[0]->type == ValueType::LIST) {
                return Value::make_number(args[0]->list_value.size());
            }
        }
        if (lower_name == "upper" && args.size() == 1) {
            std::string str = args[0]->to_string();
            std::transform(str.begin(), str.end(), str.begin(), ::toupper);
            return Value::make_string(str);
        }
        if (lower_name == "lower" && args.size() == 1) {
            std::string str = args[0]->to_string();
            std::transform(str.begin(), str.end(), str.begin(), ::tolower);
            return Value::make_string(str);
        }
        
        // Type conversion
        if (lower_name == "str" && args.size() == 1) {
            return Value::make_string(args[0]->to_string());
        }
        if (lower_name == "int" && args.size() == 1) {
            return Value::make_number(static_cast<int>(args[0]->to_number()));
        }
        if (lower_name == "float" && args.size() == 1) {
            return Value::make_number(args[0]->to_number());
        }
        
        throw std::runtime_error("Unknown function: " + name);
    }
    
    void execute_statement() {
        skip_newlines();
        
        Token& token = peek();
        
        // Print statement
        if (token.type == TokenType::PRINT) {
            advance();
            ValuePtr value = evaluate_expression();
            output_buffer += value->to_string() + "\n";
            skip_newlines();
            return;
        }
        
        // Type declarations (int, string, bool, float, double, char)
        if (token.type == TokenType::INT || token.type == TokenType::STRING_TYPE || 
            token.type == TokenType::BOOL || token.type == TokenType::FLOAT ||
            token.type == TokenType::DOUBLE || token.type == TokenType::CHAR) {
            advance(); // Skip type keyword
            
            if (peek().type != TokenType::IDENTIFIER) {
                throw std::runtime_error("Expected variable name after type declaration");
            }
            
            std::string var_name = peek().value;
            advance();
            
            if (peek().type != TokenType::ASSIGN) {
                throw std::runtime_error("Expected '=' in type declaration");
            }
            advance();
            
            ValuePtr value = evaluate_expression();
            current_env->set(var_name, value);
            skip_newlines();
            return;
        }
        
        // Variable assignment (with LET or direct)
        if (token.type == TokenType::IDENTIFIER || token.type == TokenType::LET || token.type == TokenType::CONST) {
            bool is_const = (token.type == TokenType::CONST);
            
            if (token.type == TokenType::LET || token.type == TokenType::CONST) {
                advance();
            }
            
            if (peek().type != TokenType::IDENTIFIER) {
                throw std::runtime_error("Expected variable name");
            }
            
            std::string var_name = peek().value;
            advance();
            
            // Check for compound assignment operators
            TokenType op_type = peek().type;
            if (op_type == TokenType::PLUS_ASSIGN || op_type == TokenType::MINUS_ASSIGN ||
                op_type == TokenType::MULT_ASSIGN || op_type == TokenType::DIV_ASSIGN ||
                op_type == TokenType::MOD_ASSIGN || op_type == TokenType::POW_ASSIGN) {
                advance();
                ValuePtr current_val = current_env->get(var_name);
                ValuePtr new_val = evaluate_expression();
                
                double result = 0;
                if (op_type == TokenType::PLUS_ASSIGN) {
                    result = current_val->to_number() + new_val->to_number();
                } else if (op_type == TokenType::MINUS_ASSIGN) {
                    result = current_val->to_number() - new_val->to_number();
                } else if (op_type == TokenType::MULT_ASSIGN) {
                    result = current_val->to_number() * new_val->to_number();
                } else if (op_type == TokenType::DIV_ASSIGN) {
                    result = current_val->to_number() / new_val->to_number();
                } else if (op_type == TokenType::MOD_ASSIGN) {
                    result = std::fmod(current_val->to_number(), new_val->to_number());
                } else if (op_type == TokenType::POW_ASSIGN) {
                    result = std::pow(current_val->to_number(), new_val->to_number());
                }
                
                current_env->set(var_name, Value::make_number(result));
                skip_newlines();
                return;
            }
            
            // Check for increment/decrement
            if (op_type == TokenType::INCREMENT) {
                advance();
                ValuePtr current_val = current_env->get(var_name);
                current_env->set(var_name, Value::make_number(current_val->to_number() + 1));
                skip_newlines();
                return;
            }
            
            if (op_type == TokenType::DECREMENT) {
                advance();
                ValuePtr current_val = current_env->get(var_name);
                current_env->set(var_name, Value::make_number(current_val->to_number() - 1));
                skip_newlines();
                return;
            }
            
            if (peek().type != TokenType::ASSIGN) {
                throw std::runtime_error("Expected '=' in assignment");
            }
            advance();
            
            ValuePtr value = evaluate_expression();
            current_env->set(var_name, value);
            skip_newlines();
            return;
        }
        
        // If statement
        if (token.type == TokenType::IF) {
            execute_if_statement();
            return;
        }
        
        // Switch statement
        if (token.type == TokenType::SWITCH) {
            execute_switch_statement();
            return;
        }
        
        // While loop
        if (token.type == TokenType::WHILE) {
            execute_while_loop();
            return;
        }
        
        // Do-While loop
        if (token.type == TokenType::DO) {
            execute_do_while_loop();
            return;
        }
        
        // For loop
        if (token.type == TokenType::FOR) {
            execute_for_loop();
            return;
        }
        
        // Loop statement
        if (token.type == TokenType::LOOP) {
            execute_loop_statement();
            return;
        }
        
        // Assert statement
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
                throw std::runtime_error(message);
            }
            
            skip_newlines();
            return;
        }
        
        skip_newlines();
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
            } else if (peek().type == TokenType::END && peek(1).type == TokenType::COLON) {
                depth--;
                if (depth == 0) break;
            }
            advance();
        }
        
        size_t block_end = current;
        
        if (peek().type != TokenType::END || peek(1).type != TokenType::COLON) {
            throw std::runtime_error("Expected 'END:' to close if block");
        }
        advance(); advance(); // Skip END:
        skip_newlines();
        
        // Execute block if condition is true
        if (condition->is_truthy()) {
            size_t saved_pos = current;
            current = block_start;
            
            while (current < block_end) {
                execute_statement();
            }
            
            current = saved_pos;
        }
    }
    
    void execute_while_loop() {
        advance(); // Skip 'while'
        size_t condition_start = current;
        ValuePtr condition = evaluate_expression();
        
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
            } else if (peek().type == TokenType::END && peek(1).type == TokenType::COLON) {
                depth--;
                if (depth == 0) break;
            }
            advance();
        }
        
        size_t block_end = current;
        
        if (peek().type != TokenType::END || peek(1).type != TokenType::COLON) {
            throw std::runtime_error("Expected 'END:' to close while block");
        }
        advance(); advance();
        skip_newlines();
        
        // Execute loop
        int max_iterations = 10000;
        int iterations = 0;
        
        while (iterations < max_iterations) {
            current = condition_start;
            condition = evaluate_expression();
            
            if (!condition->is_truthy()) break;
            
            current = block_start;
            while (current < block_end) {
                execute_statement();
            }
            
            iterations++;
        }
    }
    
    void execute_switch_statement() {
        advance(); // Skip 'switch'
        ValuePtr switch_value = evaluate_expression();
        double switch_num = switch_value->to_number();
        
        if (peek().type != TokenType::COLON) {
            throw std::runtime_error("Expected ':' after switch expression");
        }
        advance();
        skip_newlines();
        
        if (peek().type != TokenType::START || peek(1).type != TokenType::COLON) {
            throw std::runtime_error("Expected 'START:' after switch");
        }
        advance(); advance();
        skip_newlines();
        
        bool case_executed = false;
        
        while (peek().type != TokenType::END && peek().type != TokenType::EOF_TOKEN) {
            skip_newlines();
            
            if (peek().type == TokenType::CASE) {
                advance(); // Skip CASE
                ValuePtr case_value = evaluate_expression();
                double case_num = case_value->to_number();
                
                if (peek().type != TokenType::COLON) {
                    throw std::runtime_error("Expected ':' after case value");
                }
                advance(); // Skip colon
                skip_newlines();
                
                // Check if this case matches
                bool matches = (case_num == switch_num) && !case_executed;
                
                if (matches) {
                    // Execute this case
                    while (peek().type != TokenType::CASE && 
                           peek().type != TokenType::DEFAULT &&
                           peek().type != TokenType::END &&
                           peek().type != TokenType::EOF_TOKEN) {
                        if (peek().type == TokenType::NEWLINE) {
                            advance();
                        } else {
                            execute_statement();
                        }
                    }
                    case_executed = true;
                    // Skip remaining cases
                    while (peek().type != TokenType::END && peek().type != TokenType::EOF_TOKEN) {
                        advance();
                    }
                    break;
                } else {
                    // Skip this case
                    while (peek().type != TokenType::CASE && 
                           peek().type != TokenType::DEFAULT &&
                           peek().type != TokenType::END &&
                           peek().type != TokenType::EOF_TOKEN) {
                        advance();
                    }
                }
                
            } else if (peek().type == TokenType::DEFAULT) {
                advance(); // Skip DEFAULT
                
                if (peek().type != TokenType::COLON) {
                    throw std::runtime_error("Expected ':' after default");
                }
                advance(); // Skip colon
                skip_newlines();
                
                // Execute default only if no case matched
                if (!case_executed) {
                    while (peek().type != TokenType::END && peek().type != TokenType::EOF_TOKEN) {
                        if (peek().type == TokenType::NEWLINE) {
                            advance();
                        } else {
                            execute_statement();
                        }
                    }
                    case_executed = true;
                }
                break;
                
            } else {
                advance();
            }
        }
        
        // Make sure we're at END:
        while (peek().type != TokenType::END && peek().type != TokenType::EOF_TOKEN) {
            advance();
        }
        
        if (peek().type != TokenType::END || peek(1).type != TokenType::COLON) {
            throw std::runtime_error("Expected 'END:' to close switch block");
        }
        advance(); advance();
        skip_newlines();
    }
    
    void execute_do_while_loop() {
        advance(); // Skip 'do'
        
        if (peek().type != TokenType::COLON) {
            throw std::runtime_error("Expected ':' after do");
        }
        advance();
        skip_newlines();
        
        if (peek().type != TokenType::START || peek(1).type != TokenType::COLON) {
            throw std::runtime_error("Expected 'START:' after do");
        }
        advance(); advance();
        skip_newlines();
        
        // Collect all tokens in the do block
        std::vector<Token> loop_tokens;
        int depth = 1;
        
        while (depth > 0 && peek().type != TokenType::EOF_TOKEN) {
            if (peek().type == TokenType::START && peek(1).type == TokenType::COLON) {
                depth++;
            } else if (peek().type == TokenType::END && peek(1).type == TokenType::COLON) {
                depth--;
                if (depth == 0) break;
            }
            loop_tokens.push_back(peek());
            advance();
        }
        
        if (peek().type != TokenType::END || peek(1).type != TokenType::COLON) {
            throw std::runtime_error("Expected 'END:' to close do block");
        }
        advance(); advance();
        skip_newlines();
        
        if (peek().type != TokenType::WHILE) {
            throw std::runtime_error("Expected 'WHILE' after do-end block");
        }
        advance();
        
        // Collect condition tokens
        std::vector<Token> condition_tokens;
        while (peek().type != TokenType::NEWLINE && 
               peek().type != TokenType::EOF_TOKEN &&
               peek().type != TokenType::SEMICOLON) {
            condition_tokens.push_back(peek());
            advance();
        }
        condition_tokens.push_back(Token(TokenType::EOF_TOKEN, "", 0, 0));
        
        skip_newlines();
        
        // Execute loop: at least once, then check condition
        int max_iterations = 10000;
        int iterations = 0;
        
        do {
            // Execute loop body
            size_t saved_current = current;
            std::vector<Token> saved_tokens = tokens;
            
            std::vector<Token> exec_tokens = loop_tokens;
            exec_tokens.push_back(Token(TokenType::EOF_TOKEN, "", 0, 0));
            
            tokens = exec_tokens;
            current = 0;
            
            while (peek().type != TokenType::EOF_TOKEN) {
                execute_statement();
            }
            
            tokens = saved_tokens;
            current = saved_current;
            
            // Evaluate condition
            saved_current = current;
            saved_tokens = tokens;
            
            tokens = condition_tokens;
            current = 0;
            
            ValuePtr condition = evaluate_expression();
            
            tokens = saved_tokens;
            current = saved_current;
            
            iterations++;
            
            if (!condition->is_truthy()) break;
            
        } while (iterations < max_iterations);
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
            } else if (peek().type == TokenType::END && peek(1).type == TokenType::COLON) {
                depth--;
                if (depth == 0) break;
            }
            advance();
        }
        
        size_t block_end = current;
        
        if (peek().type != TokenType::END || peek(1).type != TokenType::COLON) {
            throw std::runtime_error("Expected 'END:' to close for block");
        }
        advance(); advance();
        skip_newlines();
        
        // Execute loop
        if (iterable->type == ValueType::LIST) {
            for (const auto& item : iterable->list_value) {
                current_env->set(var_name, item);
                current = block_start;
                while (current < block_end) {
                    execute_statement();
                }
            }
        }
    }
    
    void execute_loop_statement() {
        advance(); // Skip 'loop'
        
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
            throw std::runtime_error("Expected 'for' in loop statement");
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
            } else if (peek().type == TokenType::END && peek(1).type == TokenType::COLON) {
                depth--;
                if (depth == 0) break;
            }
            advance();
        }
        
        size_t block_end = current;
        
        if (peek().type != TokenType::END || peek(1).type != TokenType::COLON) {
            throw std::runtime_error("Expected 'END:' to close loop block");
        }
        advance(); advance();
        skip_newlines();
        
        // Execute loop
        for (int i = 0; i < iterations; i++) {
            if (!var_name.empty()) {
                current_env->set(var_name, Value::make_number(start_val + i));
            }
            current = block_start;
            while (current < block_end) {
                execute_statement();
            }
        }
    }

public:
    Interpreter() : current(0) {
        global_env = std::make_shared<Environment>();
        current_env = global_env;
    }
    
    std::string execute(const std::string& source) {
        output_buffer.clear();
        
        try {
            Lexer lexer(source);
            tokens = lexer.tokenize();
            current = 0;
            
            while (peek().type != TokenType::EOF_TOKEN) {
                execute_statement();
            }
            
        } catch (const std::exception& e) {
            output_buffer += "Error: " + std::string(e.what()) + "\n";
        }
        
        return output_buffer;
    }
};

} // namespace susa

#endif // SUSA_INTERPRETER_HPP
