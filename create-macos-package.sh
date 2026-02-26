#!/bin/bash
# SUSA Language - macOS Package Creator
# Creates a distributable .pkg installer for macOS

echo "========================================"
echo "SUSA v1.0 - macOS Package Creator"
echo "========================================"
echo ""

# Check if susa binary exists
if [ ! -f "cpp-core/susa" ]; then
    echo "ERROR: SUSA binary not found!"
    echo "Please run ./build-macos.sh first"
    exit 1
fi

# Create package structure
echo "Creating package structure..."
PKG_ROOT="susa-macos-package"
rm -rf "$PKG_ROOT"
mkdir -p "$PKG_ROOT/usr/local/bin"
mkdir -p "$PKG_ROOT/usr/local/share/susa/modules"
mkdir -p "$PKG_ROOT/usr/local/share/susa/examples"
mkdir -p "$PKG_ROOT/usr/local/share/doc/susa"

# Copy binary
echo "Copying SUSA binary..."
cp cpp-core/susa "$PKG_ROOT/usr/local/bin/"
chmod +x "$PKG_ROOT/usr/local/bin/susa"

# Copy modules
echo "Copying modules..."
cp -r modules/* "$PKG_ROOT/usr/local/share/susa/modules/"

# Copy examples
echo "Copying examples..."
cp -r examples/* "$PKG_ROOT/usr/local/share/susa/examples/"

# Copy documentation
echo "Copying documentation..."
cp README.md "$PKG_ROOT/usr/local/share/doc/susa/"
cp LICENSE "$PKG_ROOT/usr/local/share/doc/susa/"
[ -f cpp-core/100_PERCENT_COMPLETE.md ] && cp cpp-core/100_PERCENT_COMPLETE.md "$PKG_ROOT/usr/local/share/doc/susa/FEATURES.md"

# Create installation script
echo "Creating installation script..."
cat > "$PKG_ROOT/install.sh" << 'EOF'
#!/bin/bash
echo "Installing SUSA v1.0..."

# Copy binary
sudo cp usr/local/bin/susa /usr/local/bin/
sudo chmod +x /usr/local/bin/susa

# Copy modules and examples
sudo mkdir -p /usr/local/share/susa
sudo cp -r usr/local/share/susa/* /usr/local/share/susa/

# Copy documentation
sudo mkdir -p /usr/local/share/doc/susa
sudo cp -r usr/local/share/doc/susa/* /usr/local/share/doc/susa/

echo ""
echo "✓ SUSA installed successfully!"
echo ""
echo "Test installation:"
echo "  susa --version"
echo ""
echo "Run examples:"
echo "  susa /usr/local/share/susa/examples/01_basics.susa"
echo ""
EOF

chmod +x "$PKG_ROOT/install.sh"

# Create uninstall script
cat > "$PKG_ROOT/uninstall.sh" << 'EOF'
#!/bin/bash
echo "Uninstalling SUSA v1.0..."

sudo rm -f /usr/local/bin/susa
sudo rm -rf /usr/local/share/susa
sudo rm -rf /usr/local/share/doc/susa

echo "✓ SUSA uninstalled"
EOF

chmod +x "$PKG_ROOT/uninstall.sh"

# Create README
cat > "$PKG_ROOT/README.txt" << 'EOF'
SUSA v1.0 - macOS Package
=========================

Installation:
1. Open Terminal
2. Navigate to this folder
3. Run: ./install.sh
4. Enter your password when prompted

After Installation:
- Run SUSA programs: susa myfile.susa
- View examples: ls /usr/local/share/susa/examples/
- Read docs: cat /usr/local/share/doc/susa/README.md

Uninstallation:
- Run: ./uninstall.sh

For more information: https://susastudio.online
EOF

# Create tarball
echo ""
echo "Creating distribution package..."
tar -czf "SUSA-macOS-1.0.0.tar.gz" "$PKG_ROOT"

# Create DMG if possible (requires macOS)
if command -v hdiutil &> /dev/null; then
    echo "Creating DMG installer..."
    
    # Create temporary DMG folder
    DMG_FOLDER="susa-dmg-temp"
    rm -rf "$DMG_FOLDER"
    mkdir -p "$DMG_FOLDER"
    
    # Copy package
    cp -r "$PKG_ROOT" "$DMG_FOLDER/SUSA-Installer"
    
    # Create DMG
    hdiutil create -volname "SUSA v1.0" -srcfolder "$DMG_FOLDER" -ov -format UDZO "SUSA-macOS-1.0.0.dmg"
    
    rm -rf "$DMG_FOLDER"
    
    echo "✓ DMG created: SUSA-macOS-1.0.0.dmg"
fi

echo ""
echo "========================================"
echo "✓ macOS Package Created!"
echo "========================================"
echo ""
echo "Distribution files:"
echo "  SUSA-macOS-1.0.0.tar.gz (Tarball)"
if [ -f "SUSA-macOS-1.0.0.dmg" ]; then
    echo "  SUSA-macOS-1.0.0.dmg (DMG Installer)"
fi
echo ""
echo "Package folder: $PKG_ROOT/"
echo ""
echo "Installation instructions:"
echo "1. Extract: tar -xzf SUSA-macOS-1.0.0.tar.gz"
echo "2. Install: cd $PKG_ROOT && ./install.sh"
echo ""
echo "Or mount DMG and run install.sh"
echo ""
