#!/usr/bin/env python3
"""
SUSA Web Executor - Direct integration with SUSA interpreter
This module provides a web-compatible interface to execute SUSA code
using the existing SUSA Python implementation.
"""

import sys
import os
import io
import contextlib
import tempfile
import json
from pathlib import Path

# Add the parent directory to Python path to import SUSA modules
parent_dir = Path(__file__).parent.parent
sys.path.insert(0, str(parent_dir))

try:
    # Import SUSA components
    from lexer import tokenize
    from parser import Parser
    from interpreter import Interpreter
    from error_handler import SUSAError
    SUSA_AVAILABLE = True
    print("✓ SUSA modules imported successfully")
except ImportError as e:
    SUSA_AVAILABLE = False
    print(f"⚠ SUSA modules not available: {e}")

class SUSAWebExecutor:
    """Web-compatible SUSA code executor"""
    
    def __init__(self):
        self.susa_available = SUSA_AVAILABLE
    
    def execute_code(self, code, timeout=10):
        """
        Execute SUSA code and return results
        
        Args:
            code (str): SUSA source code to execute
            timeout (int): Execution timeout in seconds
            
        Returns:
            dict: Execution result with success, output, error info
        """
        if not self.susa_available:
            return self._simulate_execution(code)
        
        try:
            # Capture stdout to get PRINT output
            output_buffer = io.StringIO()
            
            with contextlib.redirect_stdout(output_buffer):
                # Create SUSA interpreter instance
                interpreter = Interpreter()
                
                # Tokenize the code
                tokens = tokenize(code)
                
                # Parse the code into AST
                parser = Parser(tokens)
                ast = parser.parse()
                
                # Execute the AST
                for statement in ast:
                    interpreter.visit(statement)
            
            # Get the captured output
            output = output_buffer.getvalue()
            
            return {
                'success': True,
                'output': output.strip() if output.strip() else 'Code executed successfully!',
                'method': 'direct_susa_interpreter',
                'error': None
            }
            
        except Exception as e:
            # Handle SUSA-specific errors
            error_msg = str(e)
            if hasattr(e, 'susa_line'):
                error_msg = f"Line {e.susa_line}: {error_msg}"
            
            return {
                'success': False,
                'output': '',
                'method': 'direct_susa_interpreter',
                'error': error_msg
            }
    
    def _simulate_execution(self, code):
        """
        Enhanced simulation when SUSA interpreter is not available
        """
        try:
            output = []
            variables = {}
            
            lines = code.split('\n')
            for line_num, line in enumerate(lines, 1):
                line = line.strip()
                
                # Skip comments and empty lines
                if not line or line.startswith('#'):
                    if line.startswith('#') and '===' in line:
                        output.append(line[1:].strip())
                    continue
                
                # Handle variable declarations
                if line.startswith('let '):
                    try:
                        parts = line[4:].split('=', 1)
                        if len(parts) == 2:
                            var_name = parts[0].strip()
                            value = parts[1].strip()
                            
                            # Parse different value types
                            if value.startswith('"') and value.endswith('"'):
                                variables[var_name] = value[1:-1]
                            elif value.startswith('rt"') and value.endswith('"'):
                                variables[var_name] = value[3:-1]
                            elif value.startswith('[') and value.endswith(']'):
                                # Simple list parsing
                                list_content = value[1:-1]
                                if list_content:
                                    items = [item.strip().strip('"') for item in list_content.split(',')]
                                    variables[var_name] = items
                                else:
                                    variables[var_name] = []
                            elif value.replace('.', '').replace('-', '').isdigit():
                                variables[var_name] = float(value) if '.' in value else int(value)
                            elif value.lower() in ['true', 'false']:
                                variables[var_name] = value.lower() == 'true'
                            elif value.lower() == 'null':
                                variables[var_name] = None
                            else:
                                variables[var_name] = value
                    except Exception:
                        pass  # Skip malformed variable declarations
                
                # Handle PRINT statements
                elif line.startswith('PRINT '):
                    try:
                        content = line[6:].strip()
                        
                        # Handle rt"..." template strings
                        if content.startswith('rt"') and content.endswith('"'):
                            template = content[3:-1]
                            # Replace variables in template
                            for var_name, value in variables.items():
                                template = template.replace(f'{{{var_name}}}', str(value))
                            # Handle simple expressions
                            import re
                            # Replace {var + var} patterns
                            def replace_expr(match):
                                expr = match.group(1)
                                try:
                                    # Simple arithmetic evaluation
                                    for var_name, value in variables.items():
                                        if isinstance(value, (int, float)):
                                            expr = expr.replace(var_name, str(value))
                                    # Evaluate simple arithmetic
                                    if all(c in '0123456789+-*/.() ' for c in expr):
                                        return str(eval(expr))
                                except:
                                    pass
                                return match.group(0)
                            
                            template = re.sub(r'\{([^}]+)\}', replace_expr, template)
                            output.append(template)
                        
                        # Handle regular strings
                        elif content.startswith('"') and content.endswith('"'):
                            output.append(content[1:-1])
                        
                        # Handle string concatenation
                        elif '+' in content:
                            # Simple string concatenation simulation
                            parts = content.split('+')
                            result_parts = []
                            for part in parts:
                                part = part.strip()
                                if part.startswith('"') and part.endswith('"'):
                                    result_parts.append(part[1:-1])
                                elif part in variables:
                                    result_parts.append(str(variables[part]))
                                else:
                                    result_parts.append(part)
                            output.append(''.join(result_parts))
                        
                        # Handle variable references
                        elif content in variables:
                            value = variables[content]
                            if isinstance(value, list):
                                output.append(f"[{', '.join(map(str, value))}]")
                            else:
                                output.append(str(value))
                        
                        # Handle literal content
                        else:
                            output.append(content)
                            
                    except Exception:
                        output.append(f"Error processing PRINT at line {line_num}")
                
                # Handle function calls (basic simulation)
                elif line.startswith('FUNC ') and line.endswith(':'):
                    # Skip function definitions in simulation
                    continue
                elif line in ['START:', 'END:']:
                    # Skip block markers
                    continue
            
            result_output = '\n'.join(output) if output else 'Code executed successfully!'
            
            return {
                'success': True,
                'output': result_output,
                'method': 'enhanced_simulation',
                'error': None,
                'note': 'Enhanced simulation - install SUSA interpreter for full functionality'
            }
            
        except Exception as e:
            return {
                'success': False,
                'output': '',
                'method': 'enhanced_simulation',
                'error': f"Simulation error: {str(e)}"
            }

def execute_susa_code(code, timeout=10):
    """
    Main function to execute SUSA code
    
    Args:
        code (str): SUSA source code
        timeout (int): Execution timeout
        
    Returns:
        dict: Execution result
    """
    executor = SUSAWebExecutor()
    return executor.execute_code(code, timeout)

def main():
    """Command line interface for testing"""
    if len(sys.argv) < 2:
        print("Usage: python susa-web-executor.py <code>")
        print("   or: python susa-web-executor.py --test")
        return
    
    if sys.argv[1] == '--test':
        # Test with sample SUSA code
        test_code = '''
# Test SUSA code
let name = "SUSA"
let version = 1.0
PRINT rt"Language: {name} v{version}"

let numbers = [1, 2, 3, 4, 5]
PRINT "Numbers: " + numbers

PRINT "Hello from SUSA!"
'''
        result = execute_susa_code(test_code)
        print("Execution Result:")
        print(json.dumps(result, indent=2))
    else:
        # Execute provided code
        code = ' '.join(sys.argv[1:])
        result = execute_susa_code(code)
        
        if result['success']:
            print(result['output'])
        else:
            print(f"Error: {result['error']}", file=sys.stderr)
            sys.exit(1)

if __name__ == '__main__':
    main()