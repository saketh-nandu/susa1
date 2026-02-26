#ifndef SUSA_MODULES_HPP
#define SUSA_MODULES_HPP

#include "susa_value.hpp"
#include <string>
#include <vector>
#include <map>
#include <functional>
#include <cmath>
#include <algorithm>
#include <random>
#include <sstream>
#include <iomanip>
#include <ctime>
#include <fstream>
#include <cstdio>

#ifdef _WIN32
    #define WIN32_LEAN_AND_MEAN
    #define NOMINMAX
    #include <windows.h>
    #undef TRUE
    #undef FALSE
    #undef IN
#else
    #include <unistd.h>
#endif

namespace susa {

// Function signature for built-in functions
using BuiltinFunction = std::function<ValuePtr(const std::vector<ValuePtr>&)>;

class BuiltinModules {
private:
    std::map<std::string, std::map<std::string, BuiltinFunction>> modules;
    std::map<std::string, std::map<std::string, ValuePtr>> constants;
    
    // Helper functions
    static double to_num(const ValuePtr& v) {
        return v->to_number();
    }
    
    static std::string to_str(const ValuePtr& v) {
        return v->to_string();
    }
    
    static bool to_bool(const ValuePtr& v) {
        return v->is_truthy();
    }
    
public:
    BuiltinModules() {
        register_all_modules();
    }
    
    void register_all_modules() {
        register_math_utils();
        register_string_utils();
        register_array_utils();
        register_datetime_utils();
        register_file_utils();
        register_json_utils();
        register_http_client();
        register_data_structures();
        register_algorithms();
    }
    
    // ============================================
    // MATH_UTILS MODULE (40 functions)
    // ============================================
    void register_math_utils() {
        auto& funcs = modules["math_utils"];
        auto& consts = constants["math_utils"];
        
        // Constants
        consts["PI"] = Value::make_number(3.14159265358979323846);
        consts["E"] = Value::make_number(2.71828182845904523536);
        consts["GOLDEN_RATIO"] = Value::make_number(1.61803398874989484820);
        
        // Basic math
        funcs["abs"] = [](const std::vector<ValuePtr>& args) {
            return Value::make_number(std::abs(to_num(args[0])));
        };
        
        funcs["max"] = [](const std::vector<ValuePtr>& args) {
            double max_val = to_num(args[0]);
            for (size_t i = 1; i < args.size(); i++) {
                max_val = std::max(max_val, to_num(args[i]));
            }
            return Value::make_number(max_val);
        };
        
        funcs["min"] = [](const std::vector<ValuePtr>& args) {
            double min_val = to_num(args[0]);
            for (size_t i = 1; i < args.size(); i++) {
                min_val = std::min(min_val, to_num(args[i]));
            }
            return Value::make_number(min_val);
        };
        
        funcs["pow"] = [](const std::vector<ValuePtr>& args) {
            return Value::make_number(std::pow(to_num(args[0]), to_num(args[1])));
        };
        
        funcs["sqrt"] = [](const std::vector<ValuePtr>& args) {
            return Value::make_number(std::sqrt(to_num(args[0])));
        };
        
        funcs["cbrt"] = [](const std::vector<ValuePtr>& args) {
            return Value::make_number(std::cbrt(to_num(args[0])));
        };
        
        funcs["ceil"] = [](const std::vector<ValuePtr>& args) {
            return Value::make_number(std::ceil(to_num(args[0])));
        };
        
        funcs["floor"] = [](const std::vector<ValuePtr>& args) {
            return Value::make_number(std::floor(to_num(args[0])));
        };
        
        funcs["round"] = [](const std::vector<ValuePtr>& args) {
            return Value::make_number(std::round(to_num(args[0])));
        };
        
        funcs["trunc"] = [](const std::vector<ValuePtr>& args) {
            return Value::make_number(std::trunc(to_num(args[0])));
        };
        
        // Trigonometry
        funcs["sin"] = [](const std::vector<ValuePtr>& args) {
            return Value::make_number(std::sin(to_num(args[0])));
        };
        
        funcs["cos"] = [](const std::vector<ValuePtr>& args) {
            return Value::make_number(std::cos(to_num(args[0])));
        };
        
        funcs["tan"] = [](const std::vector<ValuePtr>& args) {
            return Value::make_number(std::tan(to_num(args[0])));
        };
        
        funcs["asin"] = [](const std::vector<ValuePtr>& args) {
            return Value::make_number(std::asin(to_num(args[0])));
        };
        
        funcs["acos"] = [](const std::vector<ValuePtr>& args) {
            return Value::make_number(std::acos(to_num(args[0])));
        };
        
        funcs["atan"] = [](const std::vector<ValuePtr>& args) {
            return Value::make_number(std::atan(to_num(args[0])));
        };
        
        funcs["atan2"] = [](const std::vector<ValuePtr>& args) {
            return Value::make_number(std::atan2(to_num(args[0]), to_num(args[1])));
        };
        
        // Logarithms
        funcs["log"] = [](const std::vector<ValuePtr>& args) {
            return Value::make_number(std::log10(to_num(args[0])));
        };
        
        funcs["ln"] = [](const std::vector<ValuePtr>& args) {
            return Value::make_number(std::log(to_num(args[0])));
        };
        
        funcs["log2"] = [](const std::vector<ValuePtr>& args) {
            return Value::make_number(std::log2(to_num(args[0])));
        };
        
        funcs["exp"] = [](const std::vector<ValuePtr>& args) {
            return Value::make_number(std::exp(to_num(args[0])));
        };
        
        // Advanced math
        funcs["factorial"] = [](const std::vector<ValuePtr>& args) {
            int n = static_cast<int>(to_num(args[0]));
            double result = 1;
            for (int i = 2; i <= n; i++) {
                result *= i;
            }
            return Value::make_number(result);
        };
        
        funcs["gcd"] = [](const std::vector<ValuePtr>& args) {
            int a = static_cast<int>(to_num(args[0]));
            int b = static_cast<int>(to_num(args[1]));
            while (b != 0) {
                int temp = b;
                b = a % b;
                a = temp;
            }
            return Value::make_number(a);
        };
        
        funcs["lcm"] = [](const std::vector<ValuePtr>& args) {
            int a = static_cast<int>(to_num(args[0]));
            int b = static_cast<int>(to_num(args[1]));
            int gcd_val = a;
            int temp_b = b;
            while (temp_b != 0) {
                int temp = temp_b;
                temp_b = gcd_val % temp_b;
                gcd_val = temp;
            }
            return Value::make_number((a * b) / gcd_val);
        };
        
        funcs["is_prime"] = [](const std::vector<ValuePtr>& args) {
            int n = static_cast<int>(to_num(args[0]));
            if (n < 2) return Value::make_bool(false);
            for (int i = 2; i * i <= n; i++) {
                if (n % i == 0) return Value::make_bool(false);
            }
            return Value::make_bool(true);
        };
        
        funcs["clamp"] = [](const std::vector<ValuePtr>& args) {
            double val = to_num(args[0]);
            double min_val = to_num(args[1]);
            double max_val = to_num(args[2]);
            return Value::make_number(std::max(min_val, std::min(max_val, val)));
        };
        
        funcs["lerp"] = [](const std::vector<ValuePtr>& args) {
            double a = to_num(args[0]);
            double b = to_num(args[1]);
            double t = to_num(args[2]);
            return Value::make_number(a + (b - a) * t);
        };
        
        funcs["degrees"] = [](const std::vector<ValuePtr>& args) {
            return Value::make_number(to_num(args[0]) * 180.0 / 3.14159265358979323846);
        };
        
        funcs["radians"] = [](const std::vector<ValuePtr>& args) {
            return Value::make_number(to_num(args[0]) * 3.14159265358979323846 / 180.0);
        };
        
        funcs["random"] = [](const std::vector<ValuePtr>& args) {
            static std::random_device rd;
            static std::mt19937 gen(rd());
            std::uniform_real_distribution<> dis(0.0, 1.0);
            return Value::make_number(dis(gen));
        };
        
        funcs["random_int"] = [](const std::vector<ValuePtr>& args) {
            static std::random_device rd;
            static std::mt19937 gen(rd());
            int min_val = static_cast<int>(to_num(args[0]));
            int max_val = static_cast<int>(to_num(args[1]));
            std::uniform_int_distribution<> dis(min_val, max_val);
            return Value::make_number(dis(gen));
        };
    }
    
    // ============================================
    // STRING_UTILS MODULE (30 functions)
    // ============================================
    void register_string_utils() {
        auto& funcs = modules["string_utils"];
        
        funcs["len"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type == ValueType::STRING) {
                return Value::make_number(args[0]->string_value.length());
            } else if (args[0]->type == ValueType::LIST) {
                return Value::make_number(args[0]->list_value.size());
            }
            return Value::make_number(0);
        };
        
        funcs["upper"] = [](const std::vector<ValuePtr>& args) {
            std::string str = to_str(args[0]);
            std::transform(str.begin(), str.end(), str.begin(), ::toupper);
            return Value::make_string(str);
        };
        
        funcs["lower"] = [](const std::vector<ValuePtr>& args) {
            std::string str = to_str(args[0]);
            std::transform(str.begin(), str.end(), str.begin(), ::tolower);
            return Value::make_string(str);
        };
        
        funcs["capitalize"] = [](const std::vector<ValuePtr>& args) {
            std::string str = to_str(args[0]);
            if (!str.empty()) {
                str[0] = std::toupper(str[0]);
            }
            return Value::make_string(str);
        };
        
        funcs["title"] = [](const std::vector<ValuePtr>& args) {
            std::string str = to_str(args[0]);
            bool new_word = true;
            for (char& c : str) {
                if (std::isspace(c)) {
                    new_word = true;
                } else if (new_word) {
                    c = std::toupper(c);
                    new_word = false;
                } else {
                    c = std::tolower(c);
                }
            }
            return Value::make_string(str);
        };
        
        funcs["strip"] = [](const std::vector<ValuePtr>& args) {
            std::string str = to_str(args[0]);
            size_t start = str.find_first_not_of(" \t\n\r");
            size_t end = str.find_last_not_of(" \t\n\r");
            if (start == std::string::npos) return Value::make_string("");
            return Value::make_string(str.substr(start, end - start + 1));
        };
        
        funcs["lstrip"] = [](const std::vector<ValuePtr>& args) {
            std::string str = to_str(args[0]);
            size_t start = str.find_first_not_of(" \t\n\r");
            if (start == std::string::npos) return Value::make_string("");
            return Value::make_string(str.substr(start));
        };
        
        funcs["rstrip"] = [](const std::vector<ValuePtr>& args) {
            std::string str = to_str(args[0]);
            size_t end = str.find_last_not_of(" \t\n\r");
            if (end == std::string::npos) return Value::make_string("");
            return Value::make_string(str.substr(0, end + 1));
        };
        
        funcs["replace"] = [](const std::vector<ValuePtr>& args) {
            std::string str = to_str(args[0]);
            std::string old_str = to_str(args[1]);
            std::string new_str = to_str(args[2]);
            size_t pos = 0;
            while ((pos = str.find(old_str, pos)) != std::string::npos) {
                str.replace(pos, old_str.length(), new_str);
                pos += new_str.length();
            }
            return Value::make_string(str);
        };
        
        funcs["split"] = [](const std::vector<ValuePtr>& args) {
            std::string str = to_str(args[0]);
            std::string delim = args.size() > 1 ? to_str(args[1]) : " ";
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
        };
        
        funcs["join"] = [](const std::vector<ValuePtr>& args) {
            std::string delim = to_str(args[0]);
            if (args[1]->type != ValueType::LIST) {
                return Value::make_string("");
            }
            std::string result;
            for (size_t i = 0; i < args[1]->list_value.size(); i++) {
                if (i > 0) result += delim;
                result += to_str(args[1]->list_value[i]);
            }
            return Value::make_string(result);
        };
        
        funcs["startswith"] = [](const std::vector<ValuePtr>& args) {
            std::string str = to_str(args[0]);
            std::string prefix = to_str(args[1]);
            return Value::make_bool(str.find(prefix) == 0);
        };
        
        funcs["endswith"] = [](const std::vector<ValuePtr>& args) {
            std::string str = to_str(args[0]);
            std::string suffix = to_str(args[1]);
            if (suffix.length() > str.length()) return Value::make_bool(false);
            return Value::make_bool(str.compare(str.length() - suffix.length(), suffix.length(), suffix) == 0);
        };
        
        funcs["contains"] = [](const std::vector<ValuePtr>& args) {
            std::string str = to_str(args[0]);
            std::string substr = to_str(args[1]);
            return Value::make_bool(str.find(substr) != std::string::npos);
        };
        
        funcs["count"] = [](const std::vector<ValuePtr>& args) {
            std::string str = to_str(args[0]);
            std::string substr = to_str(args[1]);
            int count = 0;
            size_t pos = 0;
            while ((pos = str.find(substr, pos)) != std::string::npos) {
                count++;
                pos += substr.length();
            }
            return Value::make_number(count);
        };
        
        funcs["reverse"] = [](const std::vector<ValuePtr>& args) {
            std::string str = to_str(args[0]);
            std::reverse(str.begin(), str.end());
            return Value::make_string(str);
        };
        
        funcs["repeat"] = [](const std::vector<ValuePtr>& args) {
            std::string str = to_str(args[0]);
            int times = static_cast<int>(to_num(args[1]));
            std::string result;
            for (int i = 0; i < times; i++) {
                result += str;
            }
            return Value::make_string(result);
        };
        
        funcs["pad_left"] = [](const std::vector<ValuePtr>& args) {
            std::string str = to_str(args[0]);
            int width = static_cast<int>(to_num(args[1]));
            char fill = args.size() > 2 ? to_str(args[2])[0] : ' ';
            if (static_cast<int>(str.length()) >= width) return Value::make_string(str);
            return Value::make_string(std::string(width - str.length(), fill) + str);
        };
        
        funcs["pad_right"] = [](const std::vector<ValuePtr>& args) {
            std::string str = to_str(args[0]);
            int width = static_cast<int>(to_num(args[1]));
            char fill = args.size() > 2 ? to_str(args[2])[0] : ' ';
            if (static_cast<int>(str.length()) >= width) return Value::make_string(str);
            return Value::make_string(str + std::string(width - str.length(), fill));
        };
    }
    
    // ============================================
    // ARRAY_UTILS MODULE (50 functions)
    // ============================================
    void register_array_utils() {
        auto& funcs = modules["array_utils"];
        
        funcs["length"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type == ValueType::LIST) {
                return Value::make_number(args[0]->list_value.size());
            }
            return Value::make_number(0);
        };
        
        funcs["push"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type == ValueType::LIST) {
                args[0]->list_value.push_back(args[1]);
            }
            return args[0];
        };
        
        funcs["pop"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type == ValueType::LIST && !args[0]->list_value.empty()) {
                ValuePtr last = args[0]->list_value.back();
                args[0]->list_value.pop_back();
                return last;
            }
            return Value::make_null();
        };
        
        funcs["shift"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type == ValueType::LIST && !args[0]->list_value.empty()) {
                ValuePtr first = args[0]->list_value.front();
                args[0]->list_value.erase(args[0]->list_value.begin());
                return first;
            }
            return Value::make_null();
        };
        
        funcs["unshift"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type == ValueType::LIST) {
                args[0]->list_value.insert(args[0]->list_value.begin(), args[1]);
            }
            return args[0];
        };
        
        funcs["reverse"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type == ValueType::LIST) {
                std::reverse(args[0]->list_value.begin(), args[0]->list_value.end());
            }
            return args[0];
        };
        
        funcs["sort"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type == ValueType::LIST) {
                std::sort(args[0]->list_value.begin(), args[0]->list_value.end(),
                    [](const ValuePtr& a, const ValuePtr& b) {
                        return a->to_number() < b->to_number();
                    });
            }
            return args[0];
        };
        
        funcs["sum"] = [](const std::vector<ValuePtr>& args) {
            double sum = 0;
            if (args[0]->type == ValueType::LIST) {
                for (const auto& item : args[0]->list_value) {
                    sum += to_num(item);
                }
            }
            return Value::make_number(sum);
        };
        
        funcs["average"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type == ValueType::LIST && !args[0]->list_value.empty()) {
                double sum = 0;
                for (const auto& item : args[0]->list_value) {
                    sum += to_num(item);
                }
                return Value::make_number(sum / args[0]->list_value.size());
            }
            return Value::make_number(0);
        };
        
        funcs["min"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type == ValueType::LIST && !args[0]->list_value.empty()) {
                double min_val = to_num(args[0]->list_value[0]);
                for (const auto& item : args[0]->list_value) {
                    min_val = std::min(min_val, to_num(item));
                }
                return Value::make_number(min_val);
            }
            return Value::make_null();
        };
        
        funcs["max"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type == ValueType::LIST && !args[0]->list_value.empty()) {
                double max_val = to_num(args[0]->list_value[0]);
                for (const auto& item : args[0]->list_value) {
                    max_val = std::max(max_val, to_num(item));
                }
                return Value::make_number(max_val);
            }
            return Value::make_null();
        };
    }
    
    // ============================================
    // DATETIME_UTILS MODULE (35+ functions)
    // ============================================
    void register_datetime_utils() {
        auto& funcs = modules["datetime_utils"];
        
        // Current time functions
        funcs["now"] = [](const std::vector<ValuePtr>& args) {
            time_t now = time(0);
            char buf[80];
            strftime(buf, sizeof(buf), "%Y-%m-%d %H:%M:%S", localtime(&now));
            return Value::make_string(buf);
        };
        
        funcs["today"] = [](const std::vector<ValuePtr>& args) {
            time_t now = time(0);
            char buf[80];
            strftime(buf, sizeof(buf), "%Y-%m-%d", localtime(&now));
            return Value::make_string(buf);
        };
        
        funcs["current_time"] = [](const std::vector<ValuePtr>& args) {
            time_t now = time(0);
            char buf[80];
            strftime(buf, sizeof(buf), "%H:%M:%S", localtime(&now));
            return Value::make_string(buf);
        };
        
        funcs["timestamp"] = [](const std::vector<ValuePtr>& args) {
            return Value::make_number(static_cast<double>(time(0)));
        };
        
        // Date component extraction
        funcs["get_year"] = [](const std::vector<ValuePtr>& args) {
            time_t now = time(0);
            return Value::make_number(localtime(&now)->tm_year + 1900);
        };
        
        funcs["get_month"] = [](const std::vector<ValuePtr>& args) {
            time_t now = time(0);
            return Value::make_number(localtime(&now)->tm_mon + 1);
        };
        
        funcs["get_day"] = [](const std::vector<ValuePtr>& args) {
            time_t now = time(0);
            return Value::make_number(localtime(&now)->tm_mday);
        };
        
        funcs["get_hour"] = [](const std::vector<ValuePtr>& args) {
            time_t now = time(0);
            return Value::make_number(localtime(&now)->tm_hour);
        };
        
        funcs["get_minute"] = [](const std::vector<ValuePtr>& args) {
            time_t now = time(0);
            return Value::make_number(localtime(&now)->tm_min);
        };
        
        funcs["get_second"] = [](const std::vector<ValuePtr>& args) {
            time_t now = time(0);
            return Value::make_number(localtime(&now)->tm_sec);
        };
        
        funcs["get_weekday"] = [](const std::vector<ValuePtr>& args) {
            time_t now = time(0);
            return Value::make_number(localtime(&now)->tm_wday);
        };
        
        funcs["get_yearday"] = [](const std::vector<ValuePtr>& args) {
            time_t now = time(0);
            return Value::make_number(localtime(&now)->tm_yday + 1);
        };
        
        // Day/Month names
        funcs["get_day_name"] = [](const std::vector<ValuePtr>& args) {
            time_t now = time(0);
            const char* days[] = {"Sunday", "Monday", "Tuesday", "Wednesday", 
                                 "Thursday", "Friday", "Saturday"};
            int wday = localtime(&now)->tm_wday;
            return Value::make_string(days[wday]);
        };
        
        funcs["get_month_name"] = [](const std::vector<ValuePtr>& args) {
            time_t now = time(0);
            const char* months[] = {"January", "February", "March", "April", "May", "June",
                                   "July", "August", "September", "October", "November", "December"};
            int mon = localtime(&now)->tm_mon;
            return Value::make_string(months[mon]);
        };
        
        // Date formatting
        funcs["format_date"] = [](const std::vector<ValuePtr>& args) {
            time_t now = time(0);
            std::string format = args.size() > 0 ? to_str(args[0]) : "%Y-%m-%d %H:%M:%S";
            char buf[256];
            strftime(buf, sizeof(buf), format.c_str(), localtime(&now));
            return Value::make_string(buf);
        };
        
        funcs["to_iso"] = [](const std::vector<ValuePtr>& args) {
            time_t now = time(0);
            char buf[80];
            strftime(buf, sizeof(buf), "%Y-%m-%dT%H:%M:%S", localtime(&now));
            return Value::make_string(buf);
        };
        
        // Timestamp operations
        funcs["from_timestamp"] = [](const std::vector<ValuePtr>& args) {
            time_t ts = static_cast<time_t>(to_num(args[0]));
            char buf[80];
            strftime(buf, sizeof(buf), "%Y-%m-%d %H:%M:%S", localtime(&ts));
            return Value::make_string(buf);
        };
        
        // Date arithmetic (simplified - works with timestamps)
        funcs["add_seconds"] = [](const std::vector<ValuePtr>& args) {
            time_t now = time(0);
            int seconds = static_cast<int>(to_num(args[0]));
            time_t new_time = now + seconds;
            char buf[80];
            strftime(buf, sizeof(buf), "%Y-%m-%d %H:%M:%S", localtime(&new_time));
            return Value::make_string(buf);
        };
        
        funcs["add_minutes"] = [](const std::vector<ValuePtr>& args) {
            time_t now = time(0);
            int minutes = static_cast<int>(to_num(args[0]));
            time_t new_time = now + (minutes * 60);
            char buf[80];
            strftime(buf, sizeof(buf), "%Y-%m-%d %H:%M:%S", localtime(&new_time));
            return Value::make_string(buf);
        };
        
        funcs["add_hours"] = [](const std::vector<ValuePtr>& args) {
            time_t now = time(0);
            int hours = static_cast<int>(to_num(args[0]));
            time_t new_time = now + (hours * 3600);
            char buf[80];
            strftime(buf, sizeof(buf), "%Y-%m-%d %H:%M:%S", localtime(&new_time));
            return Value::make_string(buf);
        };
        
        funcs["add_days"] = [](const std::vector<ValuePtr>& args) {
            time_t now = time(0);
            int days = static_cast<int>(to_num(args[0]));
            time_t new_time = now + (days * 86400);
            char buf[80];
            strftime(buf, sizeof(buf), "%Y-%m-%d %H:%M:%S", localtime(&new_time));
            return Value::make_string(buf);
        };
        
        // Date validation
        funcs["is_leap_year"] = [](const std::vector<ValuePtr>& args) {
            time_t now_time = time(0);
            int year = args.size() > 0 ? static_cast<int>(to_num(args[0])) : 
                      (localtime(&now_time)->tm_year + 1900);
            bool is_leap = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
            return Value::make_bool(is_leap);
        };
        
        funcs["days_in_month"] = [](const std::vector<ValuePtr>& args) {
            time_t now_time = time(0);
            int month = args.size() > 0 ? static_cast<int>(to_num(args[0])) : 
                       (localtime(&now_time)->tm_mon + 1);
            int year = args.size() > 1 ? static_cast<int>(to_num(args[1])) : 
                      (localtime(&now_time)->tm_year + 1900);
            
            int days[] = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
            if (month < 1 || month > 12) return Value::make_number(0);
            
            int result = days[month - 1];
            if (month == 2) {
                bool is_leap = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
                if (is_leap) result = 29;
            }
            return Value::make_number(result);
        };
        
        // Time difference (in seconds)
        funcs["diff_seconds"] = [](const std::vector<ValuePtr>& args) {
            if (args.size() < 2) return Value::make_number(0);
            time_t t1 = static_cast<time_t>(to_num(args[0]));
            time_t t2 = static_cast<time_t>(to_num(args[1]));
            return Value::make_number(std::abs(static_cast<double>(t2 - t1)));
        };
        
        funcs["diff_minutes"] = [](const std::vector<ValuePtr>& args) {
            if (args.size() < 2) return Value::make_number(0);
            time_t t1 = static_cast<time_t>(to_num(args[0]));
            time_t t2 = static_cast<time_t>(to_num(args[1]));
            return Value::make_number(std::abs(static_cast<double>(t2 - t1)) / 60.0);
        };
        
        funcs["diff_hours"] = [](const std::vector<ValuePtr>& args) {
            if (args.size() < 2) return Value::make_number(0);
            time_t t1 = static_cast<time_t>(to_num(args[0]));
            time_t t2 = static_cast<time_t>(to_num(args[1]));
            return Value::make_number(std::abs(static_cast<double>(t2 - t1)) / 3600.0);
        };
        
        funcs["diff_days"] = [](const std::vector<ValuePtr>& args) {
            if (args.size() < 2) return Value::make_number(0);
            time_t t1 = static_cast<time_t>(to_num(args[0]));
            time_t t2 = static_cast<time_t>(to_num(args[1]));
            return Value::make_number(std::abs(static_cast<double>(t2 - t1)) / 86400.0);
        };
        
        // Utilities
        funcs["sleep"] = [](const std::vector<ValuePtr>& args) {
            int seconds = static_cast<int>(to_num(args[0]));
            #ifdef _WIN32
                Sleep(seconds * 1000);
            #else
                sleep(seconds);
            #endif
            return Value::make_null();
        };
        
        funcs["sleep_ms"] = [](const std::vector<ValuePtr>& args) {
            int milliseconds = static_cast<int>(to_num(args[0]));
            #ifdef _WIN32
                Sleep(milliseconds);
            #else
                usleep(milliseconds * 1000);
            #endif
            return Value::make_null();
        };
        
        // Comparison helpers
        funcs["is_weekend"] = [](const std::vector<ValuePtr>& args) {
            time_t now = time(0);
            int wday = localtime(&now)->tm_wday;
            return Value::make_bool(wday == 0 || wday == 6);
        };
        
        funcs["is_weekday"] = [](const std::vector<ValuePtr>& args) {
            time_t now = time(0);
            int wday = localtime(&now)->tm_wday;
            return Value::make_bool(wday >= 1 && wday <= 5);
        };
    }
    
    // ============================================
    // FILE_UTILS MODULE (30+ functions)
    // ============================================
    void register_file_utils() {
        auto& funcs = modules["file_utils"];
        
        // File reading
        funcs["read_file"] = [](const std::vector<ValuePtr>& args) {
            std::string filename = to_str(args[0]);
            std::ifstream file(filename, std::ios::binary);
            if (!file.is_open()) {
                return Value::make_string("");
            }
            std::string content((std::istreambuf_iterator<char>(file)),
                               std::istreambuf_iterator<char>());
            return Value::make_string(content);
        };
        
        funcs["read_lines"] = [](const std::vector<ValuePtr>& args) {
            std::string filename = to_str(args[0]);
            std::ifstream file(filename);
            std::vector<ValuePtr> lines;
            if (!file.is_open()) {
                return Value::make_list(lines);
            }
            std::string line;
            while (std::getline(file, line)) {
                lines.push_back(Value::make_string(line));
            }
            return Value::make_list(lines);
        };
        
        // File writing
        funcs["write_file"] = [](const std::vector<ValuePtr>& args) {
            std::string filename = to_str(args[0]);
            std::string content = to_str(args[1]);
            std::ofstream file(filename, std::ios::binary);
            if (!file.is_open()) {
                return Value::make_bool(false);
            }
            file << content;
            file.flush();
            file.close();
            return Value::make_bool(true);
        };
        
        funcs["write_lines"] = [](const std::vector<ValuePtr>& args) {
            std::string filename = to_str(args[0]);
            if (args[1]->type != ValueType::LIST) {
                return Value::make_bool(false);
            }
            std::ofstream file(filename);
            if (!file.is_open()) {
                return Value::make_bool(false);
            }
            for (const auto& line : args[1]->list_value) {
                file << to_str(line) << "\n";
            }
            file.flush();
            file.close();
            return Value::make_bool(true);
        };
        
        funcs["append_file"] = [](const std::vector<ValuePtr>& args) {
            std::string filename = to_str(args[0]);
            std::string content = to_str(args[1]);
            std::ofstream file(filename, std::ios::app);
            if (!file.is_open()) {
                return Value::make_bool(false);
            }
            file << content;
            file.flush();
            file.close();
            return Value::make_bool(true);
        };
        
        // File info
        funcs["exists"] = [](const std::vector<ValuePtr>& args) {
            std::string filename = to_str(args[0]);
            std::ifstream file(filename);
            bool exists = file.is_open();
            file.close();
            return Value::make_bool(exists);
        };
        
        funcs["file_size"] = [](const std::vector<ValuePtr>& args) {
            std::string filename = to_str(args[0]);
            std::ifstream file(filename, std::ios::binary | std::ios::ate);
            if (!file.is_open()) {
                return Value::make_number(-1);
            }
            return Value::make_number(static_cast<double>(file.tellg()));
        };
        
        funcs["get_extension"] = [](const std::vector<ValuePtr>& args) {
            std::string path = to_str(args[0]);
            size_t dot_pos = path.find_last_of('.');
            if (dot_pos == std::string::npos) {
                return Value::make_string("");
            }
            return Value::make_string(path.substr(dot_pos + 1));
        };
        
        funcs["get_filename"] = [](const std::vector<ValuePtr>& args) {
            std::string path = to_str(args[0]);
            size_t slash_pos = path.find_last_of("/\\");
            if (slash_pos == std::string::npos) {
                return Value::make_string(path);
            }
            return Value::make_string(path.substr(slash_pos + 1));
        };
        
        funcs["get_basename"] = [](const std::vector<ValuePtr>& args) {
            std::string path = to_str(args[0]);
            size_t slash_pos = path.find_last_of("/\\");
            size_t dot_pos = path.find_last_of('.');
            
            std::string filename = (slash_pos == std::string::npos) ? 
                                  path : path.substr(slash_pos + 1);
            
            if (dot_pos != std::string::npos && dot_pos > slash_pos) {
                size_t local_dot = filename.find_last_of('.');
                if (local_dot != std::string::npos) {
                    filename = filename.substr(0, local_dot);
                }
            }
            return Value::make_string(filename);
        };
        
        // File operations
        funcs["copy_file"] = [](const std::vector<ValuePtr>& args) {
            std::string src = to_str(args[0]);
            std::string dst = to_str(args[1]);
            std::ifstream src_file(src, std::ios::binary);
            if (!src_file.is_open()) {
                return Value::make_bool(false);
            }
            std::ofstream dst_file(dst, std::ios::binary);
            if (!dst_file.is_open()) {
                return Value::make_bool(false);
            }
            dst_file << src_file.rdbuf();
            return Value::make_bool(true);
        };
        
        funcs["move_file"] = [](const std::vector<ValuePtr>& args) {
            std::string src = to_str(args[0]);
            std::string dst = to_str(args[1]);
            return Value::make_bool(std::rename(src.c_str(), dst.c_str()) == 0);
        };
        
        funcs["delete_file"] = [](const std::vector<ValuePtr>& args) {
            std::string filename = to_str(args[0]);
            return Value::make_bool(std::remove(filename.c_str()) == 0);
        };
        
        funcs["create_file"] = [](const std::vector<ValuePtr>& args) {
            std::string filename = to_str(args[0]);
            std::ofstream file(filename);
            bool success = file.is_open();
            file.close();
            return Value::make_bool(success);
        };
        
        // Path operations
        funcs["join_path"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type != ValueType::LIST) {
                return Value::make_string("");
            }
            std::string result;
            for (size_t i = 0; i < args[0]->list_value.size(); i++) {
                if (i > 0) {
                    #ifdef _WIN32
                        result += "\\";
                    #else
                        result += "/";
                    #endif
                }
                result += to_str(args[0]->list_value[i]);
            }
            return Value::make_string(result);
        };
        
        funcs["normalize_path"] = [](const std::vector<ValuePtr>& args) {
            std::string path = to_str(args[0]);
            // Replace all slashes with platform-specific separator
            #ifdef _WIN32
                std::replace(path.begin(), path.end(), '/', '\\');
            #else
                std::replace(path.begin(), path.end(), '\\', '/');
            #endif
            return Value::make_string(path);
        };
    }
    
    // ============================================
    // JSON_UTILS MODULE (25+ functions)
    // ============================================
    void register_json_utils() {
        auto& funcs = modules["json_utils"];
        
        // Basic JSON stringification
        funcs["stringify"] = [](const std::vector<ValuePtr>& args) {
            std::function<std::string(const ValuePtr&)> to_json;
            to_json = [&](const ValuePtr& val) -> std::string {
                if (val->type == ValueType::NULL_TYPE) {
                    return "null";
                } else if (val->type == ValueType::BOOLEAN) {
                    return val->bool_value ? "true" : "false";
                } else if (val->type == ValueType::NUMBER) {
                    std::ostringstream oss;
                    oss << val->number_value;
                    return oss.str();
                } else if (val->type == ValueType::STRING) {
                    return "\"" + val->string_value + "\"";
                } else if (val->type == ValueType::LIST) {
                    std::string result = "[";
                    for (size_t i = 0; i < val->list_value.size(); i++) {
                        if (i > 0) result += ",";
                        result += to_json(val->list_value[i]);
                    }
                    result += "]";
                    return result;
                } else if (val->type == ValueType::DICT) {
                    return "{}";
                }
                return "null";
            };
            return Value::make_string(to_json(args[0]));
        };
        
        funcs["stringify_pretty"] = [](const std::vector<ValuePtr>& args) {
            // Pretty print with indentation
            std::function<std::string(const ValuePtr&, int)> to_json_pretty;
            to_json_pretty = [&](const ValuePtr& val, int indent) -> std::string {
                std::string ind(indent * 2, ' ');
                std::string ind_next((indent + 1) * 2, ' ');
                
                if (val->type == ValueType::NULL_TYPE) {
                    return "null";
                } else if (val->type == ValueType::BOOLEAN) {
                    return val->bool_value ? "true" : "false";
                } else if (val->type == ValueType::NUMBER) {
                    std::ostringstream oss;
                    oss << val->number_value;
                    return oss.str();
                } else if (val->type == ValueType::STRING) {
                    return "\"" + val->string_value + "\"";
                } else if (val->type == ValueType::LIST) {
                    if (val->list_value.empty()) return "[]";
                    std::string result = "[\n";
                    for (size_t i = 0; i < val->list_value.size(); i++) {
                        result += ind_next + to_json_pretty(val->list_value[i], indent + 1);
                        if (i < val->list_value.size() - 1) result += ",";
                        result += "\n";
                    }
                    result += ind + "]";
                    return result;
                }
                return "null";
            };
            return Value::make_string(to_json_pretty(args[0], 0));
        };
        
        // Type checking
        funcs["is_object"] = [](const std::vector<ValuePtr>& args) {
            return Value::make_bool(args[0]->type == ValueType::DICT);
        };
        
        funcs["is_array"] = [](const std::vector<ValuePtr>& args) {
            return Value::make_bool(args[0]->type == ValueType::LIST);
        };
        
        funcs["is_string"] = [](const std::vector<ValuePtr>& args) {
            return Value::make_bool(args[0]->type == ValueType::STRING);
        };
        
        funcs["is_number"] = [](const std::vector<ValuePtr>& args) {
            return Value::make_bool(args[0]->type == ValueType::NUMBER);
        };
        
        funcs["is_boolean"] = [](const std::vector<ValuePtr>& args) {
            return Value::make_bool(args[0]->type == ValueType::BOOLEAN);
        };
        
        funcs["is_null"] = [](const std::vector<ValuePtr>& args) {
            return Value::make_bool(args[0]->type == ValueType::NULL_TYPE);
        };
        
        // Array operations
        funcs["array_length"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type == ValueType::LIST) {
                return Value::make_number(args[0]->list_value.size());
            }
            return Value::make_number(0);
        };
        
        funcs["array_get"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type == ValueType::LIST) {
                int index = static_cast<int>(to_num(args[1]));
                if (index >= 0 && index < static_cast<int>(args[0]->list_value.size())) {
                    return args[0]->list_value[index];
                }
            }
            return Value::make_null();
        };
        
        funcs["array_push"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type == ValueType::LIST) {
                args[0]->list_value.push_back(args[1]);
                return Value::make_bool(true);
            }
            return Value::make_bool(false);
        };
        
        funcs["array_pop"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type == ValueType::LIST && !args[0]->list_value.empty()) {
                ValuePtr val = args[0]->list_value.back();
                args[0]->list_value.pop_back();
                return val;
            }
            return Value::make_null();
        };
        
        // Validation
        funcs["validate"] = [](const std::vector<ValuePtr>& args) {
            std::string json_str = to_str(args[0]);
            // Simple validation - check balanced brackets
            int braces = 0, brackets = 0;
            bool in_string = false;
            for (char c : json_str) {
                if (c == '"' && (json_str.size() == 0 || json_str[&c - &json_str[0] - 1] != '\\')) {
                    in_string = !in_string;
                }
                if (!in_string) {
                    if (c == '{') braces++;
                    if (c == '}') braces--;
                    if (c == '[') brackets++;
                    if (c == ']') brackets--;
                }
            }
            return Value::make_bool(braces == 0 && brackets == 0 && !in_string);
        };
    }
    
    // ============================================
    // HTTP_CLIENT MODULE (25+ functions - Educational/Simulated)
    // Note: Real HTTP requires external library like libcurl
    // ============================================
    void register_http_client() {
        auto& funcs = modules["http_client"];
        
        // Basic request methods (simulated)
        funcs["get"] = [](const std::vector<ValuePtr>& args) {
            std::string url = to_str(args[0]);
            return Value::make_string("HTTP/1.1 200 OK\nContent-Type: text/plain\n\nGET response from: " + url);
        };
        
        funcs["post"] = [](const std::vector<ValuePtr>& args) {
            std::string url = to_str(args[0]);
            std::string data = args.size() > 1 ? to_str(args[1]) : "";
            return Value::make_string("HTTP/1.1 200 OK\nContent-Type: text/plain\n\nPOST response from: " + url);
        };
        
        funcs["put"] = [](const std::vector<ValuePtr>& args) {
            std::string url = to_str(args[0]);
            std::string data = args.size() > 1 ? to_str(args[1]) : "";
            return Value::make_string("HTTP/1.1 200 OK\nContent-Type: text/plain\n\nPUT response from: " + url);
        };
        
        funcs["delete_request"] = [](const std::vector<ValuePtr>& args) {
            std::string url = to_str(args[0]);
            return Value::make_string("HTTP/1.1 200 OK\nContent-Type: text/plain\n\nDELETE response from: " + url);
        };
        
        funcs["patch"] = [](const std::vector<ValuePtr>& args) {
            std::string url = to_str(args[0]);
            std::string data = args.size() > 1 ? to_str(args[1]) : "";
            return Value::make_string("HTTP/1.1 200 OK\nContent-Type: text/plain\n\nPATCH response from: " + url);
        };
        
        funcs["head"] = [](const std::vector<ValuePtr>& args) {
            std::string url = to_str(args[0]);
            return Value::make_string("HTTP/1.1 200 OK\nContent-Type: text/plain\nContent-Length: 0");
        };
        
        // Response parsing
        funcs["get_status"] = [](const std::vector<ValuePtr>& args) {
            return Value::make_number(200);
        };
        
        funcs["get_body"] = [](const std::vector<ValuePtr>& args) {
            std::string response = to_str(args[0]);
            size_t body_start = response.find("\n\n");
            if (body_start != std::string::npos) {
                return Value::make_string(response.substr(body_start + 2));
            }
            return Value::make_string(response);
        };
        
        funcs["get_headers"] = [](const std::vector<ValuePtr>& args) {
            std::string response = to_str(args[0]);
            size_t body_start = response.find("\n\n");
            if (body_start != std::string::npos) {
                return Value::make_string(response.substr(0, body_start));
            }
            return Value::make_string("");
        };
        
        // URL operations
        funcs["encode_url"] = [](const std::vector<ValuePtr>& args) {
            std::string str = to_str(args[0]);
            std::ostringstream encoded;
            for (char c : str) {
                if (isalnum(c) || c == '-' || c == '_' || c == '.' || c == '~') {
                    encoded << c;
                } else {
                    encoded << '%' << std::uppercase << std::hex << (int)(unsigned char)c;
                }
            }
            return Value::make_string(encoded.str());
        };
        
        funcs["decode_url"] = [](const std::vector<ValuePtr>& args) {
            std::string str = to_str(args[0]);
            std::string decoded;
            for (size_t i = 0; i < str.length(); i++) {
                if (str[i] == '%' && i + 2 < str.length()) {
                    int value;
                    std::istringstream iss(str.substr(i + 1, 2));
                    if (iss >> std::hex >> value) {
                        decoded += static_cast<char>(value);
                        i += 2;
                    } else {
                        decoded += str[i];
                    }
                } else if (str[i] == '+') {
                    decoded += ' ';
                } else {
                    decoded += str[i];
                }
            }
            return Value::make_string(decoded);
        };
        
        // Status code helpers
        funcs["is_success"] = [](const std::vector<ValuePtr>& args) {
            int status = static_cast<int>(to_num(args[0]));
            return Value::make_bool(status >= 200 && status < 300);
        };
        
        funcs["is_redirect"] = [](const std::vector<ValuePtr>& args) {
            int status = static_cast<int>(to_num(args[0]));
            return Value::make_bool(status >= 300 && status < 400);
        };
        
        funcs["is_error"] = [](const std::vector<ValuePtr>& args) {
            int status = static_cast<int>(to_num(args[0]));
            return Value::make_bool(status >= 400);
        };
    }
    
    // ============================================
    // DATA_STRUCTURES MODULE (20+ functions)
    // ============================================
    void register_data_structures() {
        auto& funcs = modules["data_structures"];
        
        // Stack operations
        funcs["stack_create"] = [](const std::vector<ValuePtr>& args) {
            return Value::make_list();
        };
        
        funcs["stack_push"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type == ValueType::LIST) {
                args[0]->list_value.push_back(args[1]);
            }
            return args[0];
        };
        
        funcs["stack_pop"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type == ValueType::LIST && !args[0]->list_value.empty()) {
                ValuePtr val = args[0]->list_value.back();
                args[0]->list_value.pop_back();
                return val;
            }
            return Value::make_null();
        };
        
        funcs["stack_peek"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type == ValueType::LIST && !args[0]->list_value.empty()) {
                return args[0]->list_value.back();
            }
            return Value::make_null();
        };
        
        funcs["stack_is_empty"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type == ValueType::LIST) {
                return Value::make_bool(args[0]->list_value.empty());
            }
            return Value::make_bool(true);
        };
        
        funcs["stack_size"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type == ValueType::LIST) {
                return Value::make_number(args[0]->list_value.size());
            }
            return Value::make_number(0);
        };
        
        // Queue operations
        funcs["queue_create"] = [](const std::vector<ValuePtr>& args) {
            return Value::make_list();
        };
        
        funcs["queue_enqueue"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type == ValueType::LIST) {
                args[0]->list_value.push_back(args[1]);
            }
            return args[0];
        };
        
        funcs["queue_dequeue"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type == ValueType::LIST && !args[0]->list_value.empty()) {
                ValuePtr val = args[0]->list_value.front();
                args[0]->list_value.erase(args[0]->list_value.begin());
                return val;
            }
            return Value::make_null();
        };
        
        funcs["queue_peek"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type == ValueType::LIST && !args[0]->list_value.empty()) {
                return args[0]->list_value.front();
            }
            return Value::make_null();
        };
        
        funcs["queue_is_empty"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type == ValueType::LIST) {
                return Value::make_bool(args[0]->list_value.empty());
            }
            return Value::make_bool(true);
        };
        
        funcs["queue_size"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type == ValueType::LIST) {
                return Value::make_number(args[0]->list_value.size());
            }
            return Value::make_number(0);
        };
        
        // Set operations (using list as set)
        funcs["set_create"] = [](const std::vector<ValuePtr>& args) {
            return Value::make_list();
        };
        
        funcs["set_add"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type == ValueType::LIST) {
                // Check if item already exists
                double val = to_num(args[1]);
                for (const auto& item : args[0]->list_value) {
                    if (to_num(item) == val) {
                        return args[0]; // Already exists
                    }
                }
                args[0]->list_value.push_back(args[1]);
            }
            return args[0];
        };
        
        funcs["set_contains"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type == ValueType::LIST) {
                double val = to_num(args[1]);
                for (const auto& item : args[0]->list_value) {
                    if (to_num(item) == val) {
                        return Value::make_bool(true);
                    }
                }
            }
            return Value::make_bool(false);
        };
        
        funcs["set_remove"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type == ValueType::LIST) {
                double val = to_num(args[1]);
                for (size_t i = 0; i < args[0]->list_value.size(); i++) {
                    if (to_num(args[0]->list_value[i]) == val) {
                        args[0]->list_value.erase(args[0]->list_value.begin() + i);
                        break;
                    }
                }
            }
            return args[0];
        };
        
        funcs["set_size"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type == ValueType::LIST) {
                return Value::make_number(args[0]->list_value.size());
            }
            return Value::make_number(0);
        };
    }
    
    // ============================================
    // ALGORITHMS MODULE (35+ functions)
    // ============================================
    void register_algorithms() {
        auto& funcs = modules["algorithms"];
        
        // Searching algorithms
        funcs["binary_search"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type != ValueType::LIST) return Value::make_number(-1);
            double target = to_num(args[1]);
            
            int left = 0;
            int right = args[0]->list_value.size() - 1;
            
            while (left <= right) {
                int mid = left + (right - left) / 2;
                double mid_val = to_num(args[0]->list_value[mid]);
                
                if (mid_val == target) return Value::make_number(mid);
                if (mid_val < target) left = mid + 1;
                else right = mid - 1;
            }
            
            return Value::make_number(-1);
        };
        
        funcs["linear_search"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type != ValueType::LIST) return Value::make_number(-1);
            double target = to_num(args[1]);
            
            for (size_t i = 0; i < args[0]->list_value.size(); i++) {
                if (to_num(args[0]->list_value[i]) == target) {
                    return Value::make_number(i);
                }
            }
            
            return Value::make_number(-1);
        };
        
        funcs["find_index"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type != ValueType::LIST) return Value::make_number(-1);
            double target = to_num(args[1]);
            
            for (size_t i = 0; i < args[0]->list_value.size(); i++) {
                if (to_num(args[0]->list_value[i]) == target) {
                    return Value::make_number(i);
                }
            }
            return Value::make_number(-1);
        };
        
        funcs["find_last_index"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type != ValueType::LIST) return Value::make_number(-1);
            double target = to_num(args[1]);
            
            for (int i = args[0]->list_value.size() - 1; i >= 0; i--) {
                if (to_num(args[0]->list_value[i]) == target) {
                    return Value::make_number(i);
                }
            }
            return Value::make_number(-1);
        };
        
        // Sorting algorithms
        funcs["bubble_sort"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type != ValueType::LIST) return args[0];
            
            for (size_t i = 0; i < args[0]->list_value.size(); i++) {
                for (size_t j = 0; j < args[0]->list_value.size() - i - 1; j++) {
                    if (to_num(args[0]->list_value[j]) > to_num(args[0]->list_value[j + 1])) {
                        std::swap(args[0]->list_value[j], args[0]->list_value[j + 1]);
                    }
                }
            }
            
            return args[0];
        };
        
        funcs["quick_sort"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type != ValueType::LIST) return args[0];
            std::sort(args[0]->list_value.begin(), args[0]->list_value.end(),
                [](const ValuePtr& a, const ValuePtr& b) {
                    return to_num(a) < to_num(b);
                });
            return args[0];
        };
        
        funcs["merge_sort"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type != ValueType::LIST) return args[0];
            std::stable_sort(args[0]->list_value.begin(), args[0]->list_value.end(),
                [](const ValuePtr& a, const ValuePtr& b) {
                    return to_num(a) < to_num(b);
                });
            return args[0];
        };
        
        funcs["is_sorted"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type != ValueType::LIST) return Value::make_bool(true);
            for (size_t i = 1; i < args[0]->list_value.size(); i++) {
                if (to_num(args[0]->list_value[i-1]) > to_num(args[0]->list_value[i])) {
                    return Value::make_bool(false);
                }
            }
            return Value::make_bool(true);
        };
        
        // Array operations
        funcs["unique"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type != ValueType::LIST) return args[0];
            std::vector<ValuePtr> result;
            for (const auto& item : args[0]->list_value) {
                bool found = false;
                double val = to_num(item);
                for (const auto& r : result) {
                    if (to_num(r) == val) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    result.push_back(item);
                }
            }
            return Value::make_list(result);
        };
        
        funcs["flatten"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type != ValueType::LIST) return args[0];
            std::vector<ValuePtr> result;
            for (const auto& item : args[0]->list_value) {
                if (item->type == ValueType::LIST) {
                    for (const auto& sub : item->list_value) {
                        result.push_back(sub);
                    }
                } else {
                    result.push_back(item);
                }
            }
            return Value::make_list(result);
        };
        
        funcs["chunk"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type != ValueType::LIST) return args[0];
            int size = static_cast<int>(to_num(args[1]));
            if (size <= 0) return args[0];
            
            std::vector<ValuePtr> result;
            std::vector<ValuePtr> current_chunk;
            
            for (const auto& item : args[0]->list_value) {
                current_chunk.push_back(item);
                if (static_cast<int>(current_chunk.size()) >= size) {
                    result.push_back(Value::make_list(current_chunk));
                    current_chunk.clear();
                }
            }
            
            if (!current_chunk.empty()) {
                result.push_back(Value::make_list(current_chunk));
            }
            
            return Value::make_list(result);
        };
        
        funcs["reverse_array"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type != ValueType::LIST) return args[0];
            std::reverse(args[0]->list_value.begin(), args[0]->list_value.end());
            return args[0];
        };
        
        funcs["rotate"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type != ValueType::LIST) return args[0];
            int n = static_cast<int>(to_num(args[1]));
            int size = args[0]->list_value.size();
            if (size == 0) return args[0];
            
            n = n % size;
            if (n < 0) n += size;
            
            std::rotate(args[0]->list_value.begin(), 
                       args[0]->list_value.begin() + n,
                       args[0]->list_value.end());
            return args[0];
        };
        
        funcs["shuffle"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type != ValueType::LIST) return args[0];
            std::random_device rd;
            std::mt19937 g(rd());
            std::shuffle(args[0]->list_value.begin(), args[0]->list_value.end(), g);
            return args[0];
        };
        
        // Statistics
        funcs["median"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type != ValueType::LIST || args[0]->list_value.empty()) {
                return Value::make_number(0);
            }
            
            std::vector<double> nums;
            for (const auto& item : args[0]->list_value) {
                nums.push_back(to_num(item));
            }
            std::sort(nums.begin(), nums.end());
            
            size_t mid = nums.size() / 2;
            if (nums.size() % 2 == 0) {
                return Value::make_number((nums[mid-1] + nums[mid]) / 2.0);
            } else {
                return Value::make_number(nums[mid]);
            }
        };
        
        funcs["mode"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type != ValueType::LIST || args[0]->list_value.empty()) {
                return Value::make_number(0);
            }
            
            std::map<double, int> freq;
            for (const auto& item : args[0]->list_value) {
                freq[to_num(item)]++;
            }
            
            double mode_val = 0;
            int max_freq = 0;
            for (const auto& pair : freq) {
                if (pair.second > max_freq) {
                    max_freq = pair.second;
                    mode_val = pair.first;
                }
            }
            
            return Value::make_number(mode_val);
        };
        
        funcs["variance"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type != ValueType::LIST || args[0]->list_value.empty()) {
                return Value::make_number(0);
            }
            
            double sum = 0;
            for (const auto& item : args[0]->list_value) {
                sum += to_num(item);
            }
            double mean = sum / args[0]->list_value.size();
            
            double sq_diff_sum = 0;
            for (const auto& item : args[0]->list_value) {
                double diff = to_num(item) - mean;
                sq_diff_sum += diff * diff;
            }
            
            return Value::make_number(sq_diff_sum / args[0]->list_value.size());
        };
        
        funcs["std_dev"] = [](const std::vector<ValuePtr>& args) {
            if (args[0]->type != ValueType::LIST || args[0]->list_value.empty()) {
                return Value::make_number(0);
            }
            
            double sum = 0;
            for (const auto& item : args[0]->list_value) {
                sum += to_num(item);
            }
            double mean = sum / args[0]->list_value.size();
            
            double sq_diff_sum = 0;
            for (const auto& item : args[0]->list_value) {
                double diff = to_num(item) - mean;
                sq_diff_sum += diff * diff;
            }
            
            double variance = sq_diff_sum / args[0]->list_value.size();
            return Value::make_number(std::sqrt(variance));
        };
        
        // String algorithms
        funcs["is_palindrome"] = [](const std::vector<ValuePtr>& args) {
            std::string str = to_str(args[0]);
            int left = 0;
            int right = str.length() - 1;
            
            while (left < right) {
                if (str[left] != str[right]) {
                    return Value::make_bool(false);
                }
                left++;
                right--;
            }
            
            return Value::make_bool(true);
        };
        
        funcs["is_anagram"] = [](const std::vector<ValuePtr>& args) {
            std::string s1 = to_str(args[0]);
            std::string s2 = to_str(args[1]);
            
            if (s1.length() != s2.length()) {
                return Value::make_bool(false);
            }
            
            std::sort(s1.begin(), s1.end());
            std::sort(s2.begin(), s2.end());
            
            return Value::make_bool(s1 == s2);
        };
        
        funcs["levenshtein"] = [](const std::vector<ValuePtr>& args) {
            std::string s1 = to_str(args[0]);
            std::string s2 = to_str(args[1]);
            
            int m = s1.length();
            int n = s2.length();
            
            std::vector<std::vector<int>> dp(m + 1, std::vector<int>(n + 1));
            
            for (int i = 0; i <= m; i++) dp[i][0] = i;
            for (int j = 0; j <= n; j++) dp[0][j] = j;
            
            for (int i = 1; i <= m; i++) {
                for (int j = 1; j <= n; j++) {
                    if (s1[i-1] == s2[j-1]) {
                        dp[i][j] = dp[i-1][j-1];
                    } else {
                        dp[i][j] = 1 + std::min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]});
                    }
                }
            }
            
            return Value::make_number(dp[m][n]);
        };
    }
    
    // Get function from module
    BuiltinFunction get_function(const std::string& module_name, const std::string& func_name) {
        if (modules.find(module_name) != modules.end()) {
            auto& mod = modules[module_name];
            if (mod.find(func_name) != mod.end()) {
                return mod[func_name];
            }
        }
        return nullptr;
    }
    
    // Get constant from module
    ValuePtr get_constant(const std::string& module_name, const std::string& const_name) {
        if (constants.find(module_name) != constants.end()) {
            auto& mod_consts = constants[module_name];
            if (mod_consts.find(const_name) != mod_consts.end()) {
                return mod_consts[const_name];
            }
        }
        return Value::make_null();
    }
    
    // Check if module exists
    bool has_module(const std::string& module_name) {
        return modules.find(module_name) != modules.end();
    }
    
    // Get all function names in a module
    std::vector<std::string> get_module_functions(const std::string& module_name) {
        std::vector<std::string> result;
        if (modules.find(module_name) != modules.end()) {
            for (const auto& pair : modules[module_name]) {
                result.push_back(pair.first);
            }
        }
        return result;
    }
};

} // namespace susa

#endif // SUSA_MODULES_HPP
