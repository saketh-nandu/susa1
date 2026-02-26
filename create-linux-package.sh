#!/bin/bash
# SUSA Language - Linux Package Creator
# Creates distributable packages for Linux (.deb, .rpm, .tar.gz)

echo "========================================"
echo "SUSA v1.0 - Linux Package Creator"
echo "========================================"
echo ""

# Check if susa binary exists
if [ ! -f "cpp-core/susa" ]; then
    echo "ERROR: SUSA binary not found!"
    echo "Please run ./build-linux.sh first"
    exit 1
fi

VERSION="1.0.0"

# Create base package structure
echo "Creating package structure..."
PKG_ROOT="susa-linux-package"
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

# Check for sudo
if [ "$EUID" -ne 0 ]; then 
    echo "Please run with sudo: sudo ./install.sh"
    exit 1
fi

# Copy binary
cp usr/local/bin/susa /usr/local/bin/
chmod +x /usr/local/bin/susa

# Copy modules and examples
mkdir -p /usr/local/share/susa
cp -r usr/local/share/susa/* /usr/local/share/susa/

# Copy documentation
mkdir -p /usr/local/share/doc/susa
cp -r usr/local/share/doc/susa/* /usr/local/share/doc/susa/

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

if [ "$EUID" -ne 0 ]; then 
    echo "Please run with sudo: sudo ./uninstall.sh"
    exit 1
fi

rm -f /usr/local/bin/susa
rm -rf /usr/local/share/susa
rm -rf /usr/local/share/doc/susa

echo "✓ SUSA uninstalled"
EOF

chmod +x "$PKG_ROOT/uninstall.sh"

# Create README
cat > "$PKG_ROOT/README.txt" << 'EOF'
SUSA v1.0 - Linux Package
=========================

Installation:
1. Open Terminal
2. Navigate to this folder
3. Run: sudo ./install.sh

After Installation:
- Run SUSA programs: susa myfile.susa
- View examples: ls /usr/local/share/susa/examples/
- Read docs: cat /usr/local/share/doc/susa/README.md

Uninstallation:
- Run: sudo ./uninstall.sh

For more information: https://susastudio.online
EOF

# Create tarball
echo ""
echo "Creating tarball..."
tar -czf "SUSA-Linux-${VERSION}.tar.gz" "$PKG_ROOT"
echo "✓ Created: SUSA-Linux-${VERSION}.tar.gz"

# Create .deb package (Debian/Ubuntu)
if command -v dpkg-deb &> /dev/null; then
    echo ""
    echo "Creating .deb package..."
    
    DEB_ROOT="susa-deb"
    rm -rf "$DEB_ROOT"
    mkdir -p "$DEB_ROOT/DEBIAN"
    mkdir -p "$DEB_ROOT/usr/local/bin"
    mkdir -p "$DEB_ROOT/usr/local/share/susa"
    mkdir -p "$DEB_ROOT/usr/local/share/doc/susa"
    
    # Copy files
    cp cpp-core/susa "$DEB_ROOT/usr/local/bin/"
    cp -r modules "$DEB_ROOT/usr/local/share/susa/"
    cp -r examples "$DEB_ROOT/usr/local/share/susa/"
    cp README.md LICENSE "$DEB_ROOT/usr/local/share/doc/susa/"
    
    # Create control file
    cat > "$DEB_ROOT/DEBIAN/control" << EOF
Package: susa
Version: ${VERSION}
Section: devel
Priority: optional
Architecture: amd64
Maintainer: SUSA Team <contact@susastudio.online>
Description: SUSA Programming Language
 Modern programming language with English-like syntax.
 Includes 40 features, 9 built-in modules, and 290+ functions.
 Perfect for beginners and professionals.
Homepage: https://susastudio.online
EOF
    
    # Build .deb
    dpkg-deb --build "$DEB_ROOT" "susa_${VERSION}_amd64.deb"
    echo "✓ Created: susa_${VERSION}_amd64.deb"
    
    rm -rf "$DEB_ROOT"
fi

# Create .rpm package (Fedora/RHEL)
if command -v rpmbuild &> /dev/null; then
    echo ""
    echo "Creating .rpm package..."
    
    # Create RPM build structure
    RPM_ROOT="$HOME/rpmbuild"
    mkdir -p "$RPM_ROOT"/{BUILD,RPMS,SOURCES,SPECS,SRPMS}
    
    # Copy source tarball
    cp "SUSA-Linux-${VERSION}.tar.gz" "$RPM_ROOT/SOURCES/"
    
    # Create spec file
    cat > "$RPM_ROOT/SPECS/susa.spec" << EOF
Name:           susa
Version:        ${VERSION}
Release:        1%{?dist}
Summary:        SUSA Programming Language

License:        MIT
URL:            https://susastudio.online
Source0:        SUSA-Linux-%{version}.tar.gz

%description
Modern programming language with English-like syntax.
Includes 40 features, 9 built-in modules, and 290+ functions.

%prep
%setup -q -n susa-linux-package

%install
mkdir -p %{buildroot}/usr/local/bin
mkdir -p %{buildroot}/usr/local/share/susa
mkdir -p %{buildroot}/usr/local/share/doc/susa
cp usr/local/bin/susa %{buildroot}/usr/local/bin/
cp -r usr/local/share/susa/* %{buildroot}/usr/local/share/susa/
cp -r usr/local/share/doc/susa/* %{buildroot}/usr/local/share/doc/susa/

%files
/usr/local/bin/susa
/usr/local/share/susa/*
/usr/local/share/doc/susa/*

%changelog
* $(date "+%a %b %d %Y") SUSA Team <contact@susastudio.online> - ${VERSION}-1
- Initial release
EOF
    
    # Build RPM
    rpmbuild -ba "$RPM_ROOT/SPECS/susa.spec"
    
    # Copy RPM to current directory
    find "$RPM_ROOT/RPMS" -name "susa-*.rpm" -exec cp {} . \;
    echo "✓ Created: susa-${VERSION}-1.*.rpm"
fi

echo ""
echo "========================================"
echo "✓ Linux Packages Created!"
echo "========================================"
echo ""
echo "Distribution files:"
echo "  SUSA-Linux-${VERSION}.tar.gz (Universal)"
[ -f "susa_${VERSION}_amd64.deb" ] && echo "  susa_${VERSION}_amd64.deb (Debian/Ubuntu)"
[ -f "susa-${VERSION}-1.x86_64.rpm" ] && echo "  susa-${VERSION}-1.x86_64.rpm (Fedora/RHEL)"
echo ""
echo "Installation:"
echo "  Tarball: tar -xzf SUSA-Linux-${VERSION}.tar.gz && cd $PKG_ROOT && sudo ./install.sh"
echo "  Debian:  sudo dpkg -i susa_${VERSION}_amd64.deb"
echo "  Fedora:  sudo rpm -i susa-${VERSION}-1.x86_64.rpm"
echo ""
