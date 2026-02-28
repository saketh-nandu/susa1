#!/usr/bin/env python3
"""
SUSA Direct Integration Server
Uses the existing SUSA Python interpreter directly without subprocess calls
"""

import sys
import os
import json
import io
import contextlib
from http.server import HTTPServer, BaseHTTPRequestHandler
from pathlib import Path
import time

# Add the parent directory to Python path to import SUSA modules
parent_dir = Path(__file__).parent.parent
sys.path.insert(0, str(parent_dir))

try:
    # Import SUSA components directly
    from lexer import tokenize
    from parser import Parser
    from interpreter import Interpreter
    from error_handler import SUSAError
    SUSA_AVAILABLE = True
    print("✓ SUSA interpreter modules loaded successfully")
except ImportError as e:
    SUSA_AVAILABLE = False
    print(f"⚠ SUSA interpreter not available: {e}")

class SUSADirectHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        """Handle SUSA code execution requests"""
        try:
            # Parse the request
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            code = data.get('code', '')
            timeout = data.get('timeout', 10)
            
            if not code:
                self.send_error_response("No code provided")
                return
            
            print(f"Executing SUSA code directly: {code[:50]}...")
            
            # Execute SUSA code using direct interpreter
            result = self.execute_susa_direct(code)
            
            # Send response
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = json.dumps(result)
            self.wfile.write(response.encode('utf-8'))
            
        except Exception as e:
            print(f"Error handling request: {e}")
            self.send_error_response(str(e))

    def execute_susa_direct(self, code):
        """Execute SUSA code using the direct interpreter"""
        
        if not SUSA_AVAILABLE:
            return self.simulate_susa_execution(code)
        
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
                'method': 'direct_susa_interpreter'
            }
            
        except Exception as e:
            # Handle SUSA-specific errors
            error_msg = str(e)
            if hasattr(e, 'susa_line'):
                error_msg = f"Line {e.susa_line}: {error_msg}"
            
            return {
                'success': False,
                'error': error_msg,
                'method': 'direct_susa_interpreter'
            }

    def simulate_susa_execution(self, code):
        """Enhanced simulation when SUSA interpreter is not available"""
        try:
            output = []
            variables = {}
            
            lines = code.split('\n')
            for line in lines:
                line = line.strip()
                
                # Skip comments and empty lines
                if not line or line.startswith('#'):
                    if line.startswith('#') and '===' in line:
                        output.append(line[1:].strip())
                    continue
                
                # Handle variable declarations
                if line.startswith('let '):
                    parts = line[4:].split('=', 1)
                    if len(parts) == 2:
                        var_name = parts[0].strip()
                        value = parts[1].strip()
                        
                        # Parse different value types
                        if value.startswith('"') and value.endswith('"'):
                            variables[var_name] = value[1:-1]
                        elif value.startswith('rt"') and value.endswith('"'):
                            variables[var_name] = value[3:-1]
                        elif value.replace('.', '').replace('-', '').isdigit():
                            variables[var_name] = float(value) if '.' in value else int(value)
                        elif value.lower() in ['true', 'false']:
                            variables[var_name] = value.lower() == 'true'
                        elif value.lower() == 'null':
                            variables[var_name] = None
                        else:
                            variables[var_name] = value
                
                # Handle PRINT statements
                elif line.startswith('PRINT '):
                    content = line[6:].strip()
                    
                    # Handle rt"..." template strings
                    if content.startswith('rt"') and content.endswith('"'):
                        template = content[3:-1]
                        # Replace variables in template
                        for var_name, value in variables.items():
                            template = template.replace(f'{{{var_name}}}', str(value))
                        output.append(template)
                    
                    # Handle regular strings
                    elif content.startswith('"') and content.endswith('"'):
                        output.append(content[1:-1])
                    
                    # Handle variable references
                    elif content in variables:
                        output.append(str(variables[content]))
                    
                    # Handle literal content
                    else:
                        output.append(content)
            
            result_output = '\n'.join(output) if output else 'Code executed successfully!'
            
            return {
                'success': True,
                'output': result_output,
                'method': 'enhanced_simulation',
                'note': 'Enhanced simulation - SUSA interpreter not available'
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f"Simulation error: {str(e)}",
                'method': 'enhanced_simulation'
            }

    def send_error_response(self, error_message):
        """Send an error response"""
        self.send_response(500)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        response = json.dumps({
            'success': False,
            'error': error_message
        })
        self.wfile.write(response.encode('utf-8'))

    def log_message(self, format, *args):
        """Override to customize logging"""
        print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {format % args}")

def start_server(port=8765):
    """Start the SUSA direct integration server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, SUSADirectHandler)
    
    print(f"🚀 SUSA Direct Integration Server starting on port {port}")
    print(f"📁 Working directory: {os.getcwd()}")
    print(f"🐍 Python executable: {sys.executable}")
    
    if SUSA_AVAILABLE:
        print("✅ SUSA interpreter ready for direct execution")
    else:
        print("⚠️  SUSA interpreter not available - using enhanced simulation")
    
    print(f"🌐 Server ready at http://localhost:{port}")
    print("📝 Send POST requests with JSON: {'code': 'SUSA code here'}")
    print("🛑 Press Ctrl+C to stop the server")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
        httpd.server_close()

if __name__ == '__main__':
    port = 8765
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print("Invalid port number, using default 8765")
    
    start_server(port)