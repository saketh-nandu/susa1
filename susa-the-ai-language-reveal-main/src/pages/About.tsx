import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Code,
  Zap,
  Users,
  Target,
  Lightbulb,
  Rocket,
  Star,
  Terminal,
  Cpu,
  Globe,
  BookOpen,
  User,
  GraduationCap,
  Github,
  Linkedin,
  Twitter,
  Mail,
  ArrowLeft
} from "lucide-react";

const About = () => {
  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Generated",
      description: "First programming language created entirely using artificial intelligence tools and methodologies."
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Modern Syntax",
      description: "Clean, readable syntax designed for both beginners and experienced developers."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Fast Execution",
      description: "Optimized interpreter with efficient runtime performance for quick development cycles."
    },
    {
      icon: <Terminal className="w-6 h-6" />,
      title: "Interactive REPL",
      description: "Built-in Read-Eval-Print Loop for interactive programming and rapid prototyping."
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "Cross-Platform",
      description: "Runs on Windows, macOS, and Linux with consistent behavior across all platforms."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Module System",
      description: "Comprehensive module system with built-in libraries for common programming tasks."
    }
  ];

  const timeline = [
    {
      year: "2025 Q1",
      title: "Phase 1: Core Development",
      description: "Initial language design, syntax definition, and core interpreter development using AI tools."
    },
    {
      year: "2025 Q2",
      title: "Phase 2: Feature Expansion",
      description: "Module system implementation, standard library development, and language feature refinement."
    },
    {
      year: "2025 Q3",
      title: "Phase 3: IDE & Tooling",
      description: "Full-featured IDE creation, debugging tools, and comprehensive documentation."
    },
    {
      year: "2026",
      title: "Public Release",
      description: "SUSA officially released to the public as the first AI-made programming language."
    }
  ];

  const stats = [
    { label: "Lines of Code", value: "10,000+" },
    { label: "Built-in Functions", value: "50+" },
    { label: "Example Programs", value: "33" },
    { label: "Development Time", value: "9 months" }
  ];

  return (
    <div className="h-screen overflow-y-auto bg-background text-foreground transition-colors duration-500">
      {/* Header */}
      <header className="border-b border-primary/20 bg-background/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" state={{ fromPage: 'about' }} className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Home</span>
            </Link>
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">About SUSA</h1>
            </div>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary text-primary-foreground font-semibold">
            The First AI-Made Programming Language
          </Badge>
          <h1 className="text-5xl font-bold mb-6">
            About SUSA
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            SUSA (Simple Universal Scripting Architecture) is a groundbreaking programming language
            that represents the first successful attempt at creating a complete programming language
            using artificial intelligence tools. Born from innovation and powered by AI, SUSA combines
            modern programming concepts with intuitive syntax to create a language that's both
            powerful and accessible.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-card/50 border-primary/20 text-center hover:border-primary transition-all">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* What Makes SUSA Special */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Makes SUSA Special?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card/50 border-primary/20 hover:border-primary transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary rounded-lg text-primary-foreground">
                      {feature.icon}
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Language Philosophy */}
        <Card className="bg-card/50 border-primary/20 mb-16">
          <CardHeader>
            <CardTitle className="text-foreground text-2xl flex items-center gap-3">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              Language Philosophy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-lg leading-relaxed">
              SUSA was designed with the philosophy that programming languages should be intuitive,
              powerful, and accessible to developers of all skill levels. By leveraging AI in its
              creation, SUSA incorporates best practices from multiple programming paradigms while
              maintaining simplicity and readability.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <Target className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="text-foreground font-semibold mb-2">Simplicity First</h3>
                <p className="text-muted-foreground text-sm">Clean syntax that's easy to read and write</p>
              </div>
              <div className="text-center">
                <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="text-foreground font-semibold mb-2">Developer Friendly</h3>
                <p className="text-muted-foreground text-sm">Built with developer experience in mind</p>
              </div>
              <div className="text-center">
                <Rocket className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="text-foreground font-semibold mb-2">Future Ready</h3>
                <p className="text-muted-foreground text-sm">Designed for modern development needs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Development Timeline */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Development Journey
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary/50"></div>
              {timeline.map((item, index) => (
                <div key={index} className={`relative flex items-center mb-8 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <Card className={`bg-card/50 border-primary/20 w-80 ${index % 2 === 0 ? 'mr-8' : 'ml-8'}`}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-primary text-primary-foreground font-semibold">{item.year}</Badge>
                        <CardTitle className="text-foreground">{item.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <Card className="bg-card/50 border-primary/20 mb-16">
          <CardHeader>
            <CardTitle className="text-foreground text-2xl flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary" />
              Technical Specifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-foreground font-semibold mb-4">Language Features</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Dynamic typing with type inference
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Object-oriented programming support
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Functional programming constructs
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Built-in error handling
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Memory management
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-foreground font-semibold mb-4">Implementation</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Written in C++
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Native compiled performance
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Recursive descent parser
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    AST-based execution
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Zero external dependencies
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mb-16">
          <Card className="bg-card/50 border-primary/20 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Ready to Experience SUSA?
              </h3>
              <p className="text-muted-foreground mb-6">
                Join the revolution in programming language design. Try SUSA today and
                experience the future of AI-assisted language development.
              </p>
              <div className="flex justify-center gap-4">
                <Link to="/try-online">
                  <Button className="bg-primary hover:bg-primary/80 text-primary-foreground font-semibold">
                    Try Online
                  </Button>
                </Link>
                <Link to="/download">
                  <Button variant="outline" className="border-primary/30 text-muted-foreground hover:text-foreground hover:bg-primary/20">
                    Download SUSA
                  </Button>
                </Link>
                <Link to="/examples">
                  <Button variant="outline" className="border-primary/30 text-muted-foreground hover:text-foreground hover:bg-primary/20">
                    View Examples
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Developer Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Meet the Developer
          </h2>

          <Card className="bg-card/50 border-primary/20 max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-32 h-32 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-16 h-16 text-primary-foreground" />
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-foreground mb-2">Saketh Nandu</h3>
                  <p className="text-primary mb-4">Creator of SUSA Programming Language</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-5 h-5 text-primary" />
                      <span className="text-muted-foreground">Student - Diploma in Artificial Intelligence</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Brain className="w-5 h-5 text-primary" />
                      <span className="text-muted-foreground">AI-Assisted Development Pioneer</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Passionate student pursuing a Diploma in Artificial Intelligence, dedicated to pushing
                    the boundaries of AI-assisted development. Created SUSA using cutting-edge AI tools
                    including Kiro, Trea, and ChatGPT, pioneering a new approach to programming language design.
                  </p>

                  <div className="mb-6">
                    <h4 className="text-foreground font-semibold mb-3">AI Tools Used in Development:</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-primary text-primary-foreground font-semibold">Kiro</Badge>
                      <Badge className="bg-primary text-primary-foreground font-semibold">Trea</Badge>
                      <Badge className="bg-primary text-primary-foreground font-semibold">ChatGPT</Badge>
                    </div>
                  </div>

                  <div className="flex justify-center md:justify-start gap-3">
                    <a href="https://github.com/saketh-nandu" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="border-primary/30 text-muted-foreground hover:text-foreground hover:bg-primary/20" size="sm">
                        <Github className="w-4 h-4 mr-2" />
                        GitHub
                      </Button>
                    </a>
                    <a href="https://www.linkedin.com/in/saketh-mantol-31990a351" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="border-primary/30 text-muted-foreground hover:text-foreground hover:bg-primary/20" size="sm">
                        <Linkedin className="w-4 h-4 mr-2" />
                        LinkedIn
                      </Button>
                    </a>
                    <a href="https://x.com/saketh_mantol" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="border-primary/30 text-muted-foreground hover:text-foreground hover:bg-primary/20" size="sm">
                        <Twitter className="w-4 h-4 mr-2" />
                        Twitter
                      </Button>
                    </a>
                    <a href="mailto:mantolsaketh@gmail.com">
                      <Button variant="outline" className="border-primary/30 text-muted-foreground hover:text-foreground hover:bg-primary/20" size="sm">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </Button>
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-primary/20">
                <blockquote className="text-center">
                  <p className="text-lg text-muted-foreground italic mb-4">
                    "The future of programming lies in the collaboration between human creativity and artificial intelligence."
                  </p>
                  <footer className="text-primary font-semibold">— Saketh Nandu</footer>
                </blockquote>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;