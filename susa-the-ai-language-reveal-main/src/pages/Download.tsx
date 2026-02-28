import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download as DownloadIcon, Monitor, Code, Terminal, Zap, Shield, Users, Star, ArrowLeft, Github, Linkedin, Twitter, Mail } from "lucide-react";
import { getDownloadUrl, trackDownload } from "@/lib/supabase";

const Download = () => {
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [platformDialogOpen, setPlatformDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<'cli' | 'ide' | 'complete' | null>(null);
  const [downloadUrls, setDownloadUrls] = useState<Record<string, string>>({});

  // All Download URLs - Windows, macOS, Linux
  const DOWNLOAD_LINKS = {
    cli: {
      windows: "https://www.dropbox.com/scl/fi/ee1g0bx5sb75t4irnr1at/SUSA-CLI-Only-1.0.0.exe?rlkey=qhbanp18md2tev15i7pyxwsqh&st=ihkng9d0&dl=1",
      macos: "https://www.dropbox.com/scl/fi/knc0mvp787vi0jabr8d2s/SUSA-CLI-1.0.0.pkg?rlkey=74ucxhmcew3e284wy58jtrqse&st=l1yt34s2&dl=1",
      linux: "https://www.dropbox.com/scl/fi/to6gulagycyqze9a3ik0q/susa-cli_1.0.0_amd64.deb?rlkey=cb7v199jnne7chl9xtaj8a8oy&st=umwxxusd&dl=1"
    },
    ide: {
      windows: "https://www.dropbox.com/scl/fi/yy0upub46go0h330hasmg/SUSA-IDE-Desktop-App-1.0.0.exe?rlkey=fwum4u73hso434kfcqetc7mth&st=ibfviu0v&dl=1",
      macos: "https://www.dropbox.com/scl/fi/w8howunbunird8ic4977h/SUSA-IDE-1.0.0.pkg?rlkey=z430wjx5rb6jgekynfc9eqbsc&st=buom59ac&dl=1",
      linux: "https://www.dropbox.com/scl/fi/4xoc3dgplxq6j5cdkr11z/susa-ide_1.0.0_amd64.deb?rlkey=jo0xknm5ivdndnw9bcq34eb7w&st=29vpfr2s&dl=1"
    },
    complete: {
      windows: "https://www.dropbox.com/scl/fi/h6bszksoi1l8nf7ruzyel/SUSA-Complete-Setup-1.0.0.exe?rlkey=gooxjdfphkefg6ed1emer7a0r&st=8oax4vx4&dl=1",
      macos: "https://www.dropbox.com/scl/fi/kdc835w57ero4whgc7hdr/SUSA-Complete-1.0.0.pkg?rlkey=onun45hzwddqnuwsayqtp76oy&st=a8ojsge1&dl=1",
      linux: "https://www.dropbox.com/scl/fi/pgohm89sr8y8e7uq8cuie/susa-complete_1.0.0_amd64.deb?rlkey=i4r95hv1t04zy72umzp9q186z&st=07whtdm3&dl=1"
    }
  };

  const openPlatformDialog = (packageType: 'cli' | 'ide' | 'complete') => {
    setSelectedPackage(packageType);
    setPlatformDialogOpen(true);
  };

  const handlePlatformDownload = async (platform: 'windows' | 'macos' | 'linux') => {
    if (!selectedPackage) return;
    
    const url = DOWNLOAD_LINKS[selectedPackage][platform];
    const fileName = `SUSA-${selectedPackage.toUpperCase()}-${platform}`;
    
    // Track the download
    await trackDownload(fileName, "1.0.0");

    // Direct download
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);

    setPlatformDialogOpen(false);
  };

  const downloadOptions = [
    {
      title: "SUSA CLI",
      description: "Lightweight command-line compiler and interpreter for all platforms",
      version: "1.0.0",
      size: "~2 MB",
      platform: "Windows, macOS, Linux",
      packageType: "cli" as const,
      features: [
        "Fast C++ interpreter",
        "All 40 language features",
        "9 built-in modules (290+ functions)",
        "Cross-platform support",
        "Perfect for scripting"
      ],
      recommended: false
    },
    {
      title: "SUSA Desktop IDE",
      description: "Modern desktop IDE with Monaco editor, debugger, and live execution",
      version: "1.0.0",
      size: "~150 MB",
      platform: "Windows, macOS, Linux",
      packageType: "ide" as const,
      features: [
        "Monaco-based code editor",
        "Syntax highlighting & completion",
        "Built-in debugger",
        "Live code execution",
        "File explorer & project management",
        "Dark theme optimized"
      ],
      recommended: true,
      badge: "POPULAR"
    },
    {
      title: "SUSA Complete",
      description: "Full development environment with CLI + IDE in one installer",
      version: "1.0.0",
      size: "~150 MB",
      platform: "Windows, macOS, Linux",
      packageType: "complete" as const,
      features: [
        "Desktop IDE (Electron-based)",
        "CLI interpreter included",
        "All 9 standard modules",
        "33 example programs",
        "Complete toolchain",
        "File association (.susa)"
      ],
      recommended: true,
      badge: "BEST VALUE"
    }
  ];

  const systemRequirements = {
    minimum: [
      "Windows 10 or later",
      "2 GB RAM",
      "500 MB free disk space",
      "C++ compiler (for building from source)"
    ],
    recommended: [
      "Windows 11",
      "4 GB RAM or more",
      "1 GB free disk space",
      "Visual Studio 2019+ or GCC 9+",
      "Visual Studio Code (optional)"
    ]
  };

  return (
    <div className="h-screen overflow-y-auto bg-background text-foreground transition-colors duration-500">
      {/* Header */}
      <header className="border-b border-primary/20 bg-background/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" state={{ fromPage: 'download' }} className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Home</span>
            </Link>
            <div className="flex items-center gap-2">
              <DownloadIcon className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">Download SUSA</h1>
            </div>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6">
            Download SUSA
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Get started with SUSA - the first AI-made programming language.
            Choose the package that best fits your needs. Now featuring a modern desktop IDE built with Electron!
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Virus-free & Safe</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>Open Source</span>
            </div>
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-primary" />
              <span>Desktop IDE Available</span>
            </div>
          </div>
        </div>

        {/* Download Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
          {downloadOptions.map((option, index) => (
            <Card key={index} className={`bg-card/50 border-primary/20 relative hover:border-primary transition-all hover:shadow-lg hover:scale-105 duration-300 shadow-glow ${option.recommended ? 'ring-2 ring-primary' : ''}`}>
              {option.recommended && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground font-semibold">
                  Recommended
                </Badge>
              )}
              {option.badge && (
                <Badge className="absolute -top-3 right-4 bg-green-600 text-white">
                  {option.badge}
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2 text-lg">
                  {option.title.includes("IDE") && <Monitor className="w-5 h-5 text-primary" />}
                  {option.title.includes("Complete") && <Monitor className="w-5 h-5 text-primary" />}
                  {option.title === "SUSA CLI Only" && <Terminal className="w-5 h-5 text-primary" />}
                  {option.title === "SUSA Source Code" && <Code className="w-5 h-5 text-primary" />}
                  {option.title}
                </CardTitle>
                <p className="text-muted-foreground text-sm">{option.description}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Version:</span>
                  <span className="text-foreground font-medium">{option.version}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Size:</span>
                  <span className="text-foreground font-medium">{option.size}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform:</span>
                  <span className="text-foreground text-xs font-medium">{option.platform}</span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-foreground font-medium text-sm">Features:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {option.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Zap className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  className={`w-full font-semibold ${option.recommended ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                  onClick={() => openPlatformDialog(option.packageType)}
                >
                  <DownloadIcon className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* System Requirements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="bg-card/50 border-primary/20">
            <CardHeader>
              <CardTitle>Minimum Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {systemRequirements.minimum.map((req, index) => (
                  <li key={index} className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    {req}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-primary/20">
            <CardHeader>
              <CardTitle>Recommended Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {systemRequirements.recommended.map((req, index) => (
                  <li key={index} className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    {req}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Installation Guide */}
        <Card className="bg-card/50 border-primary/20 mb-12">
          <CardHeader>
            <CardTitle>Quick Installation Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3 shadow-glow">
                  <span className="font-bold">1</span>
                </div>
                <h3 className="font-medium mb-2">Download</h3>
                <p className="text-muted-foreground text-sm">Choose and download the SUSA package that fits your needs</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3 shadow-glow">
                  <span className="font-bold">2</span>
                </div>
                <h3 className="font-medium mb-2">Install</h3>
                <p className="text-muted-foreground text-sm">Run the installer as Administrator and follow the setup wizard</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3 shadow-glow">
                  <span className="font-bold">3</span>
                </div>
                <h3 className="font-medium mb-2">Code</h3>
                <p className="text-muted-foreground text-sm">Start coding with SUSA IDE or use the command-line interface</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Section */}
        <div className="text-center">
          <Card className="bg-card/50 border-primary/20 max-w-2xl mx-auto">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-foreground">Need Help?</h3>
              <p className="text-muted-foreground mb-6">
                Having trouble with installation or need support? We're here to help!
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Link to="/docs">
                  <Button variant="outline" className="border-primary/20 hover:bg-primary/10">
                    View Documentation
                  </Button>
                </Link>
                <a href="https://github.com/saketh-nandu/susa/issues" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-primary/20 hover:bg-primary/10">
                    Report Issues
                  </Button>
                </a>
                <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-glow">
                      Contact Support
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-background border-primary/20 max-w-md w-[90vw] rounded-xl">
                    <DialogHeader>
                      <DialogTitle className="text-foreground text-2xl">Contact Support</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <p className="text-muted-foreground">
                        Get in touch with the SUSA development team:
                      </p>

                      <div className="space-y-3">
                        <a
                          href="mailto:mantolsaketh@gmail.com"
                          className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-primary/10 border border-border hover:border-primary transition-all group"
                        >
                          <Mail className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                          <div>
                            <div className="text-foreground font-semibold">Email</div>
                            <div className="text-muted-foreground text-sm">mantolsaketh@gmail.com</div>
                          </div>
                        </a>

                        <a
                          href="https://github.com/saketh-nandu"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-primary/10 border border-border hover:border-primary transition-all group"
                        >
                          <Github className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                          <div>
                            <div className="text-foreground font-semibold">GitHub</div>
                            <div className="text-muted-foreground text-sm">@saketh-nandu</div>
                          </div>
                        </a>

                        <a
                          href="https://www.linkedin.com/in/saketh-mantol-31990a351"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-primary/10 border border-border hover:border-primary transition-all group"
                        >
                          <Linkedin className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                          <div>
                            <div className="text-foreground font-semibold">LinkedIn</div>
                            <div className="text-muted-foreground text-sm">Saketh Mantol</div>
                          </div>
                        </a>

                        <a
                          href="https://x.com/saketh_mantol"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-primary/10 border border-border hover:border-primary transition-all group"
                        >
                          <Twitter className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                          <div>
                            <div className="text-foreground font-semibold">Twitter (X)</div>
                            <div className="text-muted-foreground text-sm">@saketh_mantol</div>
                          </div>
                        </a>
                      </div>

                      <div className="pt-4 border-t border-border">
                        <p className="text-muted-foreground text-sm text-center">
                          We typically respond within 24-48 hours
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Selection Dialog */}
        <Dialog open={platformDialogOpen} onOpenChange={setPlatformDialogOpen}>
          <DialogContent className="bg-background border-primary/20 max-w-lg w-[90vw] rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-foreground text-2xl text-center font-bold">Choose Your Platform</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-muted-foreground text-center mb-6">
                {selectedPackage && `SUSA ${selectedPackage.toUpperCase()} - Available for all platforms`}
              </p>

              <div className="space-y-3">
                {/* Windows */}
                <button
                  onClick={() => handlePlatformDownload('windows')}
                  className="w-full flex items-center justify-between p-5 rounded-xl bg-primary/10 hover:bg-primary/20 border-2 border-primary/30 hover:border-primary transition-all transform hover:scale-[1.02] group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                      <svg className="w-7 h-7 text-primary" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-lg text-foreground">Windows</div>
                      <div className="text-sm text-muted-foreground">Windows 10/11</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">.exe installer</span>
                    <DownloadIcon className="w-5 h-5 text-primary" />
                  </div>
                </button>

                {/* macOS */}
                <button
                  onClick={() => handlePlatformDownload('macos')}
                  className="w-full flex items-center justify-between p-5 rounded-xl bg-primary/10 hover:bg-primary/20 border-2 border-primary/30 hover:border-primary transition-all transform hover:scale-[1.02] group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                      <svg className="w-7 h-7 text-primary" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-lg text-foreground">macOS</div>
                      <div className="text-sm text-muted-foreground">macOS 10.15+</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">.pkg installer</span>
                    <DownloadIcon className="w-5 h-5 text-primary" />
                  </div>
                </button>

                {/* Linux */}
                <button
                  onClick={() => handlePlatformDownload('linux')}
                  className="w-full flex items-center justify-between p-5 rounded-xl bg-primary/10 hover:bg-primary/20 border-2 border-primary/30 hover:border-primary transition-all transform hover:scale-[1.02] group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                      <svg className="w-7 h-7 text-primary" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.84-.41 1.684-.287 2.489.845 5.331 6.608 6.261 10.537 5.784 3.93-.477 9.68-2.191 11.134-6.818.686-2.184.536-4.929-.736-6.934-1.235-1.949-3.525-3.695-5.756-4.678C18.65.731 15.662 0 12.504 0zm-.005 4.021c.5.007.996.138 1.461.39 1.016.554 1.557 1.729 1.212 2.623-.345.894-1.474 1.298-2.491.743-1.017-.555-1.558-1.73-1.213-2.624.257-.666.865-1.115 1.553-1.131.058-.001.116-.003.174-.001h.304zm-7.706 5.626c.882-.03 1.677.53 1.937 1.378.347.896-.164 1.938-1.141 2.327-.977.389-2.086-.19-2.433-1.086-.347-.896.164-1.938 1.141-2.327.244-.097.5-.141.753-.146.248-.007.496.007.743.054zm15.416 0c.882-.03 1.677.53 1.937 1.378.347.896-.164 1.938-1.141 2.327-.977.389-2.086-.19-2.433-1.086-.347-.896.164-1.938 1.141-2.327.244-.097.5-.141.753-.146.248-.007.496.007.743.054zM12 7.93c-.552 0-1 .448-1 1s.448 1 1 1 1-.448 1-1-.448-1-1-1z"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-lg text-foreground">Linux</div>
                      <div className="text-sm text-muted-foreground">Ubuntu/Debian</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">.deb package</span>
                    <DownloadIcon className="w-5 h-5 text-primary" />
                  </div>
                </button>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-muted-foreground text-sm text-center">
                  ✨ All installers include wizard-style setup with SUSA branding
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Download;