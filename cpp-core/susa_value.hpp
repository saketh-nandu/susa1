#ifndef SUSA_VALUE_HPP
#define SUSA_VALUE_HPP

#include <string>
#include <vector>
#include <map>
#include <memory>
#include <iostream>

namespace susa {

class Value;
using ValuePtr = std::shared_ptr<Value>;

enum class ValueType {
    NULL_TYPE,
    BOOLEAN,
    NUMBER,
    STRING,
    LIST,
    DICT,
    FUNCTION,
    LAMBDA,
    INSTANCE,  // Class instance
    GENERATOR  // Generator instance
};

class Value {
public:
    ValueType type;
    
    // Data storage
    bool bool_value;
    double number_value;
    std::string string_value;
    std::vector<ValuePtr> list_value;
    std::map<std::string, ValuePtr> dict_value;
    
    // Lambda function storage
    std::vector<std::string> lambda_params;
    std::string lambda_body;  // Store as source code string
    
    // Instance storage
    std::string class_name;  // Name of the class
    std::map<std::string, ValuePtr> instance_properties;  // Instance variables
    
    // Generator storage
    std::vector<ValuePtr> generator_values;  // Pre-computed values for simple generators
    size_t generator_index;  // Current position in generator
    
    Value() : type(ValueType::NULL_TYPE), bool_value(false), number_value(0.0), generator_index(0) {}
    
    static ValuePtr make_null() {
        return std::make_shared<Value>();
    }
    
    static ValuePtr make_bool(bool val) {
        auto v = std::make_shared<Value>();
        v->type = ValueType::BOOLEAN;
        v->bool_value = val;
        return v;
    }
    
    static ValuePtr make_number(double val) {
        auto v = std::make_shared<Value>();
        v->type = ValueType::NUMBER;
        v->number_value = val;
        return v;
    }
    
    static ValuePtr make_string(const std::string& val) {
        auto v = std::make_shared<Value>();
        v->type = ValueType::STRING;
        v->string_value = val;
        return v;
    }
    
    static ValuePtr make_list(const std::vector<ValuePtr>& val = {}) {
        auto v = std::make_shared<Value>();
        v->type = ValueType::LIST;
        v->list_value = val;
        return v;
    }
    
    static ValuePtr make_dict(const std::map<std::string, ValuePtr>& val = {}) {
        auto v = std::make_shared<Value>();
        v->type = ValueType::DICT;
        v->dict_value = val;
        return v;
    }
    
    static ValuePtr make_lambda(const std::vector<std::string>& params, const std::string& body) {
        auto v = std::make_shared<Value>();
        v->type = ValueType::LAMBDA;
        v->lambda_params = params;
        v->lambda_body = body;
        return v;
    }
    
    static ValuePtr make_instance(const std::string& class_name) {
        auto v = std::make_shared<Value>();
        v->type = ValueType::INSTANCE;
        v->class_name = class_name;
        return v;
    }
    
    static ValuePtr make_generator(const std::vector<ValuePtr>& values) {
        auto v = std::make_shared<Value>();
        v->type = ValueType::GENERATOR;
        v->generator_values = values;
        v->generator_index = 0;
        return v;
    }
    
    bool is_truthy() const {
        switch (type) {
            case ValueType::NULL_TYPE:
                return false;
            case ValueType::BOOLEAN:
                return bool_value;
            case ValueType::NUMBER:
                return number_value != 0.0;
            case ValueType::STRING:
                return !string_value.empty();
            case ValueType::LIST:
                return !list_value.empty();
            case ValueType::DICT:
                return !dict_value.empty();
            default:
                return false;
        }
    }
    
    double to_number() const {
        switch (type) {
            case ValueType::NUMBER:
                return number_value;
            case ValueType::BOOLEAN:
                return bool_value ? 1.0 : 0.0;
            case ValueType::STRING:
                try {
                    return std::stod(string_value);
                } catch (...) {
                    return 0.0;
                }
            default:
                return 0.0;
        }
    }
    
    std::string to_string() const {
        switch (type) {
            case ValueType::NULL_TYPE:
                return "null";
            case ValueType::BOOLEAN:
                return bool_value ? "true" : "false";
            case ValueType::NUMBER: {
                // Format number nicely
                if (number_value == static_cast<int>(number_value)) {
                    return std::to_string(static_cast<int>(number_value));
                }
                return std::to_string(number_value);
            }
            case ValueType::STRING:
                return string_value;
            case ValueType::LIST: {
                std::string result = "[";
                for (size_t i = 0; i < list_value.size(); i++) {
                    if (i > 0) result += ", ";
                    result += list_value[i]->to_string();
                }
                result += "]";
                return result;
            }
            case ValueType::DICT: {
                std::string result = "{";
                bool first = true;
                for (const auto& pair : dict_value) {
                    if (!first) result += ", ";
                    first = false;
                    result += pair.first + ": " + pair.second->to_string();
                }
                result += "}";
                return result;
            }
            case ValueType::LAMBDA:
                return "<lambda function>";
            case ValueType::INSTANCE:
                return "<" + class_name + " instance>";
            case ValueType::GENERATOR:
                return "<generator>";
            default:
                return "";
        }
    }
    
    ValuePtr clone() const {
        auto v = std::make_shared<Value>();
        v->type = type;
        v->bool_value = bool_value;
        v->number_value = number_value;
        v->string_value = string_value;
        
        // Deep copy lists
        for (const auto& item : list_value) {
            v->list_value.push_back(item->clone());
        }
        
        // Deep copy dicts
        for (const auto& pair : dict_value) {
            v->dict_value[pair.first] = pair.second->clone();
        }
        
        return v;
    }
};

} // namespace susa

#endif // SUSA_VALUE_HPP
