import React, { useState } from 'react';

// Download links - UPDATE THESE WITH YOUR ACTUAL LINKS
const DOWNLOAD_LINKS = {
  cli: {
    windows: 'https://github.com/saketh-nandu/susa1/releases/download/v1.0.0/SUSA-CLI-Setup-1.0.0.exe',
    macos: 'https://github.com/saketh-nandu/susa1/releases/download/v1.0.0/SUSA-CLI-1.0.0.pkg',
    linux: 'https://github.com/saketh-nandu/susa1/releases/download/v1.0.0/susa-cli_1.0.0_amd64.deb'
  },
  ide: {
    windows: 'https://github.com/saketh-nandu/susa1/releases/download/v1.0.0/SUSA-IDE-Desktop-App-1.0.0.exe',
    macos: 'https://github.com/saketh-nandu/susa1/releases/download/v1.0.0/SUSA-IDE-1.0.0.pkg',
    linux: 'https://github.com/saketh-nandu/susa1/releases/download/v1.0.0/susa-ide_1.0.0_amd64.deb'
  },
  complete: {
    windows: 'https://github.com/saketh-nandu/susa1/releases/download/v1.0.0/SUSA-Complete-Setup-1.0.0.exe',
    macos: 'https://github.com/saketh-nandu/susa1/releases/download/v1.0.0/SUSA-Complete-1.0.0.pkg',
    linux: 'https://github.com/saketh-nandu/susa1/releases/download/v1.0.0/susa-complete_1.0.0_amd64.deb'
  }
};

type PackageType = 'cli' | 'ide' | 'complete';
type Platform = 'windows' | 'macos' | 'linux';

const DownloadPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);

  const openModal = (packageType: PackageType) => {
    setSelectedPackage(packageType);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPackage(null);
  };

  const handleDownload = (platform: Platform) => {
    if (selectedPackage) {
      const url = DOWNLOAD_LINKS[selectedPackage][platform];
      window.open(url, '_blank');
      closeModal();
    }
  };

  const getPackageInfo = (type: PackageType) => {
    const info = {
      cli: {
        title: 'CLI',
        subtitle: 'Command Line Interface',
        description: 'Lightweight interpreter for running SUSA programs from terminal',
        features: ['Fast C++ Interpreter', '9 Built-in Modules', 'All 40 Language Features', 'Perfect for Scripting'],
        icon: '⚡',
        size: '~2 MB'
      },
      ide: {
        title: 'Desktop IDE',
        subtitle: 'Integrated Development Environment',
        description: 'Full-featured desktop application with code editor and tools',
        features: ['Syntax Highlighting', 'Code Completion', 'Built-in Terminal', 'Project Management'],
        icon: '🖥️',
        size: '~150 MB'
      },
      complete: {
        title: 'Complete',
        subtitle: 'CLI + Desktop IDE',
        description: 'Everything you need - both CLI and IDE in one installer',
        features: ['CLI Interpreter', 'Desktop IDE', 'All Modules', 'Complete Toolchain'],
        icon: '📦',
        size: '~150 MB'
      }
    };
    return info[type];
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '60px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ 
            fontSize: '48px', 
            color: 'white', 
            marginBottom: '20px',
            fontWeight: 'bold'
          }}>
            Download SUSA v1.0.0
          </h1>
          <p style={{ 
            fontSize: '20px', 
            color: 'rgba(255,255,255,0.9)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Choose your installation package and platform
          </p>
        </div>

        {/* Download Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          marginBottom: '40px'
        }}>
          {(['cli', 'ide', 'complete'] as PackageType[]).map((type) => {
            const info = getPackageInfo(type);
            return (
              <div
                key={type}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '40px 30px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 30px 80px rgba(0,0,0,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.3)';
                }}
                onClick={() => openModal(type)}
              >
                {/* Icon */}
                <div style={{ 
                  fontSize: '64px', 
                  textAlign: 'center', 
                  marginBottom: '20px' 
                }}>
                  {info.icon}
                </div>

                {/* Title */}
                <h2 style={{ 
                  fontSize: '28px', 
                  color: '#2563eb', 
                  textAlign: 'center',
                  marginBottom: '8px',
                  fontWeight: 'bold'
                }}>
                  {info.title}
                </h2>

                {/* Subtitle */}
                <p style={{ 
                  fontSize: '14px', 
                  color: '#6b7280', 
                  textAlign: 'center',
                  marginBottom: '20px',
                  fontWeight: '500'
                }}>
                  {info.subtitle}
                </p>

                {/* Description */}
                <p style={{ 
                  fontSize: '15px', 
                  color: '#4b5563', 
                  textAlign: 'center',
                  marginBottom: '24px',
                  lineHeight: '1.6'
                }}>
                  {info.description}
                </p>

                {/* Features */}
                <div style={{ 
                  background: '#f3f4f6', 
                  padding: '20px', 
                  borderRadius: '8px',
                  marginBottom: '24px'
                }}>
                  {info.features.map((feature, idx) => (
                    <div key={idx} style={{ 
                      fontSize: '14px', 
                      color: '#374151',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Size */}
                <p style={{ 
                  fontSize: '13px', 
                  color: '#9ca3af', 
                  textAlign: 'center',
                  marginBottom: '20px'
                }}>
                  Download Size: {info.size}
                </p>

                {/* Download Button */}
                <button
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'opacity 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  Download {info.title}
                </button>
              </div>
            );
          })}
        </div>

        {/* Modal */}
        {showModal && selectedPackage && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}
            onClick={closeModal}
          >
            <div
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '40px',
                maxWidth: '600px',
                width: '100%',
                boxShadow: '0 30px 100px rgba(0,0,0,0.5)',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'transparent',
                  border: 'none',
                  fontSize: '28px',
                  cursor: 'pointer',
                  color: '#9ca3af',
                  lineHeight: '1'
                }}
              >
                ×
              </button>

              {/* Modal Header */}
              <h2 style={{ 
                fontSize: '32px', 
                color: '#2563eb', 
                marginBottom: '12px',
                textAlign: 'center'
              }}>
                Choose Your Platform
              </h2>
              <p style={{ 
                fontSize: '16px', 
                color: '#6b7280', 
                marginBottom: '40px',
                textAlign: 'center'
              }}>
                {getPackageInfo(selectedPackage).title} - {getPackageInfo(selectedPackage).subtitle}
              </p>

              {/* Platform Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Windows */}
                <button
                  onClick={() => handleDownload('windows')}
                  style={{
                    padding: '20px 30px',
                    background: 'linear-gradient(135deg, #0078d4 0%, #005a9e 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>🪟</span>
                    <span>Windows</span>
                  </span>
                  <span style={{ fontSize: '14px', opacity: 0.9 }}>.exe installer</span>
                </button>

                {/* macOS */}
                <button
                  onClick={() => handleDownload('macos')}
                  style={{
                    padding: '20px 30px',
                    background: 'linear-gradient(135deg, #000000 0%, #434343 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>🍎</span>
                    <span>macOS</span>
                  </span>
                  <span style={{ fontSize: '14px', opacity: 0.9 }}>.pkg installer</span>
                </button>

                {/* Linux */}
                <button
                  onClick={() => handleDownload('linux')}
                  style={{
                    padding: '20px 30px',
                    background: 'linear-gradient(135deg, #f7931e 0%, #d67d1a 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>🐧</span>
                    <span>Linux</span>
                  </span>
                  <span style={{ fontSize: '14px', opacity: 0.9 }}>.deb package</span>
                </button>
              </div>

              {/* Footer Note */}
              <p style={{ 
                fontSize: '13px', 
                color: '#9ca3af', 
                textAlign: 'center',
                marginTop: '24px'
              }}>
                All installers include wizard-style setup with SUSA branding
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadPage;
