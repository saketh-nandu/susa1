#include "cpp-core/susa_lexer.hpp"
#include <iostream>

int main() {
    std::string code = R"(let name = "John"
PRINT rt"Hello {name}!")";
    
    susa::Lexer lexer(code);
    auto tokens = lexer.tokenize();
    
    for (const auto& token : tokens) {
        std::cout << "Type: " << static_cast<int>(token.type) 
                  << " Value: [" << token.value << "]" << std::endl;
    }
    
    return 0;
}
