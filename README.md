# SUSA Programming Language

<div align="center">

![SUSA Logo](susa%20logo.png)

**The First AI-Made Programming Language**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](https://github.com/saketh-nandu/susa)
[![Website](https://img.shields.io/badge/website-live-brightgreen.svg)](https://susa-programming-language.web.app)
[![C++](https://img.shields.io/badge/Built%20with-C++-00599C.svg)](https://isocpp.org/)

[Website](https://susa-programming-language.web.app) • [Try Online](https://susa-programming-language.web.app/try-online) • [Documentation](https://susa-programming-language.web.app/docs) • [Examples](https://susa-programming-language.web.app/examples) • [Download](https://susa-programming-language.web.app/download)

</div>

---

## 🌟 What is SUSA?

**SUSA** (Simple Universal Scripting Architecture) is a groundbreaking programming language that represents the first successful attempt at creating a complete programming language using artificial intelligence tools. Born from innovation and powered by AI, SUSA combines modern programming concepts with intuitive syntax to create a language that's both powerful and accessible.

### Key Features

- 🤖 **AI-Generated**: First programming language created entirely using AI tools (Kiro, Trea, ChatGPT)
- ⚡ **Fast Execution**: Built with C++ for native compiled performance
- 🎯 **Modern Syntax**: Clean, readable syntax designed for both beginners and experts
- 🔧 **Zero Dependencies**: No external dependencies required
- 🌐 **Cross-Platform**: Runs on Windows, macOS, and Linux
- 📦 **Rich Module System**: 9 core modules with 290+ built-in functions
- 🎨 **Desktop IDE**: Full-featured IDE with Monaco editor, debugger, and live execution
- 🌍 **Multi-Language Support**: Write code in English, Hindi, Telugu, Tamil, and more

---

## 🚀 Quick Start

### Installation

#### Option 1: Complete Installer (Recommended)
Download the complete SUSA installer with IDE, compiler, and all tools:
```bash
# Download from: https://susa-programming-language.web.app/download
# Run: SUSA-Complete-Setup-1.0.0.exe
```

#### Option 2: CLI Only
For command-line usage only:
```bash
# Download susa-cpp.exe
# Add to PATH or use directly
```

#### Option 3: Build from Source
```bash
# Clone the repository
git clone https://github.com/saketh-nandu/susa.git
cd susa/cpp-core

# Build with CMake
mkdir build && cd build
cmake ..
cmake --build .
```

### Your First SUSA Program

```susa
LET name = INPUT("What's your name? ")
PRINT("Hello, " + name + "!")
PRINT("Welcome to SUSA Programming Language!")
```

Run it:
```bash
susa run hello.susa
```

---

## 📚 Language Features

### Variables and Data Types
```susa
LET number = 42
LET text = "Hello, SUSA!"
LET decimal = 3.14
LET flag = TRUE
LET items = [1, 2, 3, 4, 5]
```

### Control Flow
```susa
IF x > 10 START
    PRINT("x is greater than 10")
ELSE START
    PRINT("x is 10 or less")
END

FOR i IN RANGE(1, 5) START
    PRINT(i)
END

WHILE count < 10 START
    count = count + 1
END
```

### Functions
```susa
FUNCTION greet(name) START
    RETURN "Hello, " + name + "!"
END

LET message = greet("World")
PRINT(message)
```

### Classes
```susa
CLASS Person START
    FUNCTION __init__(name, age) START
        THIS.name = name
        THIS.age = age
    END
    
    FUNCTION introduce() START
        PRINT("Hi, I'm " + THIS.name)
    END
END

LET person = Person("Alice", 25)
person.introduce()
```

### Modules
```susa
ADD math_utils
ADD string_utils
ADD array_utils

LET result = math_utils.sqrt(16)
LET upper = string_utils.upper("hello")
LET sorted = array_utils.sort_array([3, 1, 4, 1, 5])
```

---

## 🎨 SUSA Desktop IDE

The SUSA IDE provides a complete development environment:

- **Monaco Editor**: Professional code editor with syntax highlighting
- **Live Execution**: Run code instantly and see results
- **Built-in Debugger**: Set breakpoints and step through code
- **File Explorer**: Manage your SUSA projects
- **Console Output**: Interactive console with command history
- **Dark Theme**: Optimized for comfortable coding

![SUSA IDE Screenshot](https://susa-programming-language.web.app/assets/susa-logo.png)

---

## 📦 Core Modules

SUSA comes with 9 powerful core modules:

| Module | Functions | Description |
|--------|-----------|-------------|
| **array_utils** | 35 | Array manipulation, sorting, filtering |
| **string_utils** | 40 | String operations, formatting, parsing |
| **math_utils** | 45 | Mathematical operations, trigonometry |
| **datetime_utils** | 30 | Date/time handling and formatting |
| **file_utils** | 25 | File I/O operations |
| **json_utils** | 20 | JSON parsing and serialization |
| **http_client** | 25 | HTTP requests and API calls |
| **data_structures** | 35 | Stacks, queues, trees, graphs |
| **algorithms** | 35 | Sorting, searching, algorithms |

**Total: 290 built-in functions**

---

## 📖 Examples

Explore 33+ example programs covering:

- Basic syntax and variables
- Control flow and loops
- Functions and classes
- List operations
- Module usage
- Algorithms and data structures
- Web development
- Data science
- AI/ML applications
- Game development
- And much more!

View all examples: [Examples Directory](examples/)

---

## 🌐 Try Online

Experience SUSA directly in your browser without any installation:

👉 [Try SUSA Online](https://susa-programming-language.web.app/try-online)

---

## 📋 System Requirements

### Minimum
- Windows 10 or later / Linux / macOS
- 2 GB RAM
- 500 MB free disk space

### Recommended
- Windows 11 / Latest Linux / macOS
- 4 GB RAM or more
- 1 GB free disk space
- Visual Studio 2019+ or GCC 9+ (for building from source)

---

## 🛠️ Development

### Project Structure
```
susa/
├── cpp-core/              # C++ interpreter and compiler
│   ├── main.cpp          # Main entry point
│   ├── susa_lexer.hpp    # Lexical analyzer
│   ├── susa_interpreter.hpp  # Interpreter
│   ├── susa_modules.hpp  # Module system
│   └── CMakeLists.txt    # Build configuration
├── susa-ide/             # Desktop IDE (Electron + React)
├── susa-the-ai-language-reveal-main/  # Official website
├── examples/             # 33+ example programs
├── modules/              # Core module implementations
└── Output/               # Compiled executables
```

### Building from Source

#### C++ Core
```bash
cd cpp-core
mkdir build && cd build
cmake ..
cmake --build .
```

#### Desktop IDE
```bash
cd susa-ide/remix-of-susa-studio-ide-main
npm install
npm run build
npm run create-app
```

#### Website
```bash
cd susa-the-ai-language-reveal-main
npm install
npm run build
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Report Bugs**: Open an issue on GitHub
2. **Suggest Features**: Share your ideas
3. **Submit Pull Requests**: Contribute code improvements
4. **Write Documentation**: Help improve our docs
5. **Create Examples**: Share your SUSA programs

### Development Guidelines
- Follow existing code style
- Write clear commit messages
- Add tests for new features
- Update documentation

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Creator

**Saketh Nandu**
- Student - Diploma in Artificial Intelligence
- Creator of SUSA Programming Language
- AI-Assisted Development Pioneer

### Connect
- 📧 Email: [mantolsaketh@gmail.com](mailto:mantolsaketh@gmail.com)
- 🐙 GitHub: [@saketh-nandu](https://github.com/saketh-nandu)
- 💼 LinkedIn: [Saketh Mantol](https://www.linkedin.com/in/saketh-mantol-31990a351)
- 🐦 Twitter: [@saketh_mantol](https://x.com/saketh_mantol)

### AI Tools Used
- **Kiro**: AI-powered IDE and development assistant
- **Trea**: AI code generation and optimization
- **ChatGPT**: Language design and documentation

---

## 🌟 Acknowledgments

Special thanks to:
- The AI development community
- All contributors and testers
- Open source projects that inspired SUSA
- Everyone who believed in this AI-made language

---

## 📊 Statistics

- **Lines of Code**: 10,000+
- **Built-in Functions**: 290+
- **Example Programs**: 33+
- **Development Time**: 6 months
- **Downloads**: 2000+
- **Supported Languages**: 10+

---

## 🔗 Links

- **Official Website**: https://susa-programming-language.web.app
- **Try Online**: https://susa-programming-language.web.app/try-online
- **Documentation**: https://susa-programming-language.web.app/docs
- **Examples**: https://susa-programming-language.web.app/examples
- **Download**: https://susa-programming-language.web.app/download
- **GitHub**: https://github.com/saketh-nandu/susa

---

## 💬 Support

Need help? Have questions?

- 📖 Check the [Documentation](https://susa-programming-language.web.app/docs)
- 💡 Browse [Examples](https://susa-programming-language.web.app/examples)
- 🐛 Report issues on [GitHub](https://github.com/saketh-nandu/susa/issues)
- 📧 Email: mantolsaketh@gmail.com

---

<div align="center">

**Made with ❤️ and AI**

*"The future of programming lies in the collaboration between human creativity and artificial intelligence."*

— Saketh Nandu

</div>
