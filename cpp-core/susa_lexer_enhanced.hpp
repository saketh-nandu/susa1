#ifndef SUSA_LEXER_ENHANCED_HPP
#define SUSA_LEXER_ENHANCED_HPP

#include <string>
#include <vector>
#include <unordered_set>
#include <cctype>
#include <stdexcept>
#include <sstream>

namespace susa {

enum class TokenType {
    // Literals
    NUMBER,
    STRING,
    IDENTIFIER,
    
    // Keywords (case-insensitive)
    PRINT,
    LET,
    CONST,          // NEW: const variables
    INT,
    STRING_TYPE,
    BOOL,
    FLOAT,
    DOUBLE,
    CHAR,
    IF,
    ELSE,
    ELIF,
    WHILE,
    FOR,
    IN,
    DO,             // NEW: do-while
    FUNC,
    RETURN,
    CLASS,
    STATIC,         // NEW: static members
    START,
    END,
    LOOP,
    TIMES,
    BREAK,
    CONTINUE,
    TRY,
    CATCH,
    INSTALL,
    FROM,
    ADD,
    SHARE,
    AS,
    USE,
    TRUE,
    FALSE,
    NULL_VALUE,
    SWITCH,         // NEW: switch statement
    CASE,           // NEW: case clause
    DEFAULT,        // NEW: default clause
    LAMBDA,         // NEW: lambda functions
    ASYNC,          // NEW: async functions
    AWAIT,          // NEW: await keyword
    YIELD,          // NEW: generators
    WITH,           // NEW: with statement
    ASSERT,         // NEW: assertions
    ENUM,           // NEW: enumerations
    
    // Operators
    PLUS,
    MINUS,
    MULTIPLY,
    DIVIDE,
    MODULO,
    POWER,
    ASSIGN,
    PLUS_ASSIGN,    // NEW: +=
    MINUS_ASSIGN,   // NEW: -=
    MULT_ASSIGN,    // NEW: *=
    DIV_ASSIGN,     // NEW: /=
    MOD_ASSIGN,     // NEW: %=
    POW_ASSIGN,     // NEW: **=
    INCREMENT,      // NEW: ++
    DECREMENT,      // NEW: --
    EQUAL,
    NOT_EQUAL,
    LESS,
    GREATER,
    LESS_EQUAL,
    GREATER_EQUAL,
    AND,
    OR,
    NOT,
    QUESTION,       // NEW: ? (ternary)
    BIT_AND,        // NEW: & (bitwise)
    BIT_OR,         // NEW: | (bitwise)
    BIT_XOR,        // NEW: ^ (bitwise)
    BIT_NOT,        // NEW: ~ (bitwise)
    LEFT_SHIFT,     // NEW: <<
    RIGHT_SHIFT,    // NEW: >>
    SPREAD,         // NEW: ... (spread operator)
    
    // Delimiters
    LPAREN,
    RPAREN,
    LBRACKET,
    RBRACKET,
    LBRACE,
    RBRACE,
    COMMA,
    COLON,
    DOT,
    SEMICOLON,
    
    // Special
    NEWLINE,
    EOF_TOKEN,
    COMMENT
};

struct Token {
    TokenType type;
    std::string value;
    int line;
    int column;
    
    Token(TokenType t, const std::string& v, int l, int c)
        : type(t), value(v), line(l), column(c) {}
};

class Lexer {
private:
    std::string source;
    size_t position;
    int line;
    int column;
    char current_char;
    
    std::unordered_set<std::string> keywords = {
        "print", "let", "const", "if", "else", "elif", "while", "for", "in", "do",
        "func", "return", "class", "static", "start", "end", "loop", "times",
        "break", "continue", "try", "catch", "install", "from", "add",
        "share", "as", "use", "python",
        "true", "false", "null", "and", "or", "not",
        "int", "string", "bool", "float", "double", "char",
        "switch", "case", "default", "lambda", "async", "await", "yield",
        "with", "assert", "enum"
    };
    
    void advance() {
        if (position < source.length()) {
            if (current_char == '\n') {
                line++;
                column = 0;
            }
            position++;
            column++;
            current_char = (position < source.length()) ? source[position] : '\0';
        }
    }
    
    char peek(int offset = 1) const {
        size_t pos = position + offset;
        return (pos < source.length()) ? source[pos] : '\0';
    }
    
    void skip_whitespace() {
        while (current_char != '\0' && std::isspace(current_char) && current_char != '\n') {
            advance();
        }
    }
    
    void skip_comment() {
        if (current_char == '#') {
            while (current_char != '\0' && current_char != '\n') {
                advance();
            }
        }
    }
    
    Token make_number() {
        std::string num_str;
        int start_col = column;
        bool has_dot = false;
        
        while (current_char != '\0' && (std::isdigit(current_char) || current_char == '.')) {
            if (current_char == '.') {
                if (has_dot) break;
                has_dot = true;
            }
            num_str += current_char;
            advance();
        }
        
        return Token(TokenType::NUMBER, num_str, line, start_col);
    }
    
    Token make_string(char quote) {
        std::string str;
        int start_col = column;
        advance(); // Skip opening quote
        
        while (current_char != '\0' && current_char != quote) {
            if (current_char == '\\') {
                advance();
                switch (current_char) {
                    case 'n': str += '\n'; break;
                    case 't': str += '\t'; break;
                    case 'r': str += '\r'; break;
                    case '\\': str += '\\'; break;
                    case '"': str += '"'; break;
                    case '\'': str += '\''; break;
                    default: str += current_char;
                }
            } else {
                str += current_char;
            }
            advance();
        }
        
        if (current_char == quote) {
            advance(); // Skip closing quote
        }
        
        return Token(TokenType::STRING, str, line, start_col);
    }
    
    Token make_multiline_string() {
        std::string str;
        int start_col = column;
        advance(); advance(); advance(); // Skip """
        
        while (current_char != '\0') {
            if (current_char == '"' && peek() == '"' && peek(2) == '"') {
                advance(); advance(); advance();
                break;
            }
            str += current_char;
            advance();
        }
        
        return Token(TokenType::STRING, str, line, start_col);
    }
    
    Token make_template_string() {
        std::string str;
        int start_col = column;
        advance(); // Skip opening quote
        
        str = "\x01TEMPLATE\x01";
        
        while (current_char != '\0' && current_char != '"') {
            if (current_char == '\\') {
                advance();
                switch (current_char) {
                    case 'n': str += '\n'; break;
                    case 't': str += '\t'; break;
                    case 'r': str += '\r'; break;
                    case '\\': str += '\\'; break;
                    case '"': str += '"'; break;
                    case '\'': str += '\''; break;
                    default: str += current_char;
                }
            } else {
                str += current_char;
            }
            advance();
        }
        
        if (current_char == '"') {
            advance();
        }
        
        return Token(TokenType::STRING, str, line, start_col);
    }
    
    Token make_identifier() {
        std::string id_str;
        int start_col = column;
        
        while (current_char != '\0' && (std::isalnum(current_char) || current_char == '_')) {
            id_str += current_char;
            advance();
        }
        
        std::string lower_id = id_str;
        for (char& c : lower_id) {
            c = std::tolower(c);
        }
        
        if (keywords.find(lower_id) != keywords.end()) {
            TokenType type = get_keyword_type(lower_id);
            return Token(type, id_str, line, start_col);
        }
        
        return Token(TokenType::IDENTIFIER, id_str, line, start_col);
    }
    
    TokenType get_keyword_type(const std::string& keyword) {
        if (keyword == "print") return TokenType::PRINT;
        if (keyword == "let") return TokenType::LET;
        if (keyword == "const") return TokenType::CONST;
        if (keyword == "int") return TokenType::INT;
        if (keyword == "string") return TokenType::STRING_TYPE;
        if (keyword == "bool") return TokenType::BOOL;
        if (keyword == "float") return TokenType::FLOAT;
        if (keyword == "double") return TokenType::DOUBLE;
        if (keyword == "char") return TokenType::CHAR;
        if (keyword == "if") return TokenType::IF;
        if (keyword == "else") return TokenType::ELSE;
        if (keyword == "elif") return TokenType::ELIF;
        if (keyword == "while") return TokenType::WHILE;
        if (keyword == "for") return TokenType::FOR;
        if (keyword == "in") return TokenType::IN;
        if (keyword == "do") return TokenType::DO;
        if (keyword == "func") return TokenType::FUNC;
        if (keyword == "return") return TokenType::RETURN;
        if (keyword == "class") return TokenType::CLASS;
        if (keyword == "static") return TokenType::STATIC;
        if (keyword == "start") return TokenType::START;
        if (keyword == "end") return TokenType::END;
        if (keyword == "loop") return TokenType::LOOP;
        if (keyword == "times") return TokenType::TIMES;
        if (keyword == "break") return TokenType::BREAK;
        if (keyword == "continue") return TokenType::CONTINUE;
        if (keyword == "try") return TokenType::TRY;
        if (keyword == "catch") return TokenType::CATCH;
        if (keyword == "install") return TokenType::INSTALL;
        if (keyword == "from") return TokenType::FROM;
        if (keyword == "add") return TokenType::ADD;
        if (keyword == "share") return TokenType::SHARE;
        if (keyword == "as") return TokenType::AS;
        if (keyword == "use") return TokenType::USE;
        if (keyword == "true") return TokenType::TRUE;
        if (keyword == "false") return TokenType::FALSE;
        if (keyword == "null") return TokenType::NULL_VALUE;
        if (keyword == "and") return TokenType::AND;
        if (keyword == "or") return TokenType::OR;
        if (keyword == "not") return TokenType::NOT;
        if (keyword == "switch") return TokenType::SWITCH;
        if (keyword == "case") return TokenType::CASE;
        if (keyword == "default") return TokenType::DEFAULT;
        if (keyword == "lambda") return TokenType::LAMBDA;
        if (keyword == "async") return TokenType::ASYNC;
        if (keyword == "await") return TokenType::AWAIT;
        if (keyword == "yield") return TokenType::YIELD;
        if (keyword == "with") return TokenType::WITH;
        if (keyword == "assert") return TokenType::ASSERT;
        if (keyword == "enum") return TokenType::ENUM;
        return TokenType::IDENTIFIER;
    }

public:
    Lexer(const std::string& src) 
        : source(src), position(0), line(1), column(0) {
        current_char = source.empty() ? '\0' : source[0];
    }
    
    std::vector<Token> tokenize() {
        std::vector<Token> tokens;
        
        while (current_char != '\0') {
            skip_whitespace();
            
            if (current_char == '\0') break;
            
            if (current_char == '#') {
                skip_comment();
                continue;
            }
            
            if (current_char == '\n') {
                tokens.push_back(Token(TokenType::NEWLINE, "\\n", line, column));
                advance();
                continue;
            }
            
            if (std::isdigit(current_char)) {
                tokens.push_back(make_number());
                continue;
            }
            
            // Multi-line strings
            if (current_char == '"' && peek() == '"' && peek(2) == '"') {
                tokens.push_back(make_multiline_string());
                continue;
            }
            
            // Template strings
            if (current_char == 'r' && peek() == 't' && (peek(2) == '"' || peek(2) == '\'')) {
                advance(); advance();
                tokens.push_back(make_template_string());
                continue;
            }
            
            if (current_char == '"' || current_char == '\'') {
                char quote = current_char;
                tokens.push_back(make_string(quote));
                continue;
            }
            
            if (std::isalpha(current_char) || current_char == '_') {
                tokens.push_back(make_identifier());
                continue;
            }
            
            int start_col = column;
            
            switch (current_char) {
                case '+':
                    if (peek() == '+') {
                        advance(); advance();
                        tokens.push_back(Token(TokenType::INCREMENT, "++", line, start_col));
                    } else if (peek() == '=') {
                        advance(); advance();
                        tokens.push_back(Token(TokenType::PLUS_ASSIGN, "+=", line, start_col));
                    } else {
                        tokens.push_back(Token(TokenType::PLUS, "+", line, start_col));
                        advance();
                    }
                    break;
                case '-':
                    if (peek() == '-') {
                        advance(); advance();
                        tokens.push_back(Token(TokenType::DECREMENT, "--", line, start_col));
                    } else if (peek() == '=') {
                        advance(); advance();
                        tokens.push_back(Token(TokenType::MINUS_ASSIGN, "-=", line, start_col));
                    } else {
                        tokens.push_back(Token(TokenType::MINUS, "-", line, start_col));
                        advance();
                    }
                    break;
                case '*':
                    if (peek() == '*') {
                        advance();
                        if (peek() == '=') {
                            advance(); advance();
                            tokens.push_back(Token(TokenType::POW_ASSIGN, "**=", line, start_col));
                        } else {
                            advance();
                            tokens.push_back(Token(TokenType::POWER, "**", line, start_col));
                        }
                    } else if (peek() == '=') {
                        advance(); advance();
                        tokens.push_back(Token(TokenType::MULT_ASSIGN, "*=", line, start_col));
                    } else {
                        tokens.push_back(Token(TokenType::MULTIPLY, "*", line, start_col));
                        advance();
                    }
                    break;
                case '/':
                    if (peek() == '=') {
                        advance(); advance();
                        tokens.push_back(Token(TokenType::DIV_ASSIGN, "/=", line, start_col));
                    } else {
                        tokens.push_back(Token(TokenType::DIVIDE, "/", line, start_col));
                        advance();
                    }
                    break;
                case '%':
                    if (peek() == '=') {
                        advance(); advance();
                        tokens.push_back(Token(TokenType::MOD_ASSIGN, "%=", line, start_col));
                    } else {
                        tokens.push_back(Token(TokenType::MODULO, "%", line, start_col));
                        advance();
                    }
                    break;
                case '=':
                    if (peek() == '=') {
                        advance(); advance();
                        tokens.push_back(Token(TokenType::EQUAL, "==", line, start_col));
                    } else {
                        tokens.push_back(Token(TokenType::ASSIGN, "=", line, start_col));
                        advance();
                    }
                    break;
                case '!':
                    if (peek() == '=') {
                        advance(); advance();
                        tokens.push_back(Token(TokenType::NOT_EQUAL, "!=", line, start_col));
                    } else {
                        advance();
                    }
                    break;
                case '<':
                    if (peek() == '<') {
                        advance(); advance();
                        tokens.push_back(Token(TokenType::LEFT_SHIFT, "<<", line, start_col));
                    } else if (peek() == '=') {
                        advance(); advance();
                        tokens.push_back(Token(TokenType::LESS_EQUAL, "<=", line, start_col));
                    } else {
                        tokens.push_back(Token(TokenType::LESS, "<", line, start_col));
                        advance();
                    }
                    break;
                case '>':
                    if (peek() == '>') {
                        advance(); advance();
                        tokens.push_back(Token(TokenType::RIGHT_SHIFT, ">>", line, start_col));
                    } else if (peek() == '=') {
                        advance(); advance();
                        tokens.push_back(Token(TokenType::GREATER_EQUAL, ">=", line, start_col));
                    } else {
                        tokens.push_back(Token(TokenType::GREATER, ">", line, start_col));
                        advance();
                    }
                    break;
                case '&':
                    tokens.push_back(Token(TokenType::BIT_AND, "&", line, start_col));
                    advance();
                    break;
                case '|':
                    tokens.push_back(Token(TokenType::BIT_OR, "|", line, start_col));
                    advance();
                    break;
                case '^':
                    tokens.push_back(Token(TokenType::BIT_XOR, "^", line, start_col));
                    advance();
                    break;
                case '~':
                    tokens.push_back(Token(TokenType::BIT_NOT, "~", line, start_col));
                    advance();
                    break;
                case '?':
                    tokens.push_back(Token(TokenType::QUESTION, "?", line, start_col));
                    advance();
                    break;
                case '(':
                    tokens.push_back(Token(TokenType::LPAREN, "(", line, start_col));
                    advance();
                    break;
                case ')':
                    tokens.push_back(Token(TokenType::RPAREN, ")", line, start_col));
                    advance();
                    break;
                case '[':
                    tokens.push_back(Token(TokenType::LBRACKET, "[", line, start_col));
                    advance();
                    break;
                case ']':
                    tokens.push_back(Token(TokenType::RBRACKET, "]", line, start_col));
                    advance();
                    break;
                case '{':
                    tokens.push_back(Token(TokenType::LBRACE, "{", line, start_col));
                    advance();
                    break;
                case '}':
                    tokens.push_back(Token(TokenType::RBRACE, "}", line, start_col));
                    advance();
                    break;
                case ',':
                    tokens.push_back(Token(TokenType::COMMA, ",", line, start_col));
                    advance();
                    break;
                case ':':
                    tokens.push_back(Token(TokenType::COLON, ":", line, start_col));
                    advance();
                    break;
                case '.':
                    if (peek() == '.' && peek(2) == '.') {
                        advance(); advance(); advance();
                        tokens.push_back(Token(TokenType::SPREAD, "...", line, start_col));
                    } else {
                        tokens.push_back(Token(TokenType::DOT, ".", line, start_col));
                        advance();
                    }
                    break;
                case ';':
                    tokens.push_back(Token(TokenType::SEMICOLON, ";", line, start_col));
                    advance();
                    break;
                default:
                    {
                        std::ostringstream err;
                        err << "Unexpected character '" << current_char << "' (ASCII " << (int)current_char << ")";
                        throw std::runtime_error(err.str());
                    }
            }
        }
        
        tokens.push_back(Token(TokenType::EOF_TOKEN, "", line, column));
        return tokens;
    }
};

} // namespace susa

#endif // SUSA_LEXER_ENHANCED_HPP
