import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  GraduationCap,
  Brain,
  Code,
  Github,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  Calendar,
  Award,
  Lightbulb,
  Rocket,
  Star,
  BookOpen,
  Zap
} from "lucide-react";

const Developer = () => {
  const aiTools = [
    {
      name: "Kiro",
      description: "AI-powered development assistant used for code generation and debugging",
      role: "Primary development tool"
    },
    {
      name: "Trea",
      description: "AI tool for language design and syntax optimization",
      role: "Language architecture"
    },
    {
      name: "ChatGPT",
      description: "AI assistant for problem-solving and documentation",
      role: "Research and documentation"
    }
  ];

  const achievements = [
    {
      title: "First AI-Made Programming Language",
      description: "Created SUSA, the world's first programming language developed entirely using AI tools",
      year: "2024"
    },
    {
      title: "Complete Development Environment",
      description: "Built a full IDE, compiler, and development tools ecosystem for SUSA",
      year: "2024"
    },
    {
      title: "AI-Assisted Development Pioneer",
      description: "Pioneered new methodologies for using AI in programming language development",
      year: "2024"
    }
  ];

  const skills = [
    { category: "AI Tools", items: ["Kiro", "Trea", "ChatGPT", "Claude", "GitHub Copilot"] },
    { category: "Programming", items: ["C++", "JavaScript", "TypeScript", "React", "Node.js"] },
    { category: "AI/ML", items: ["Machine Learning", "Natural Language Processing", "AI Development", "Prompt Engineering"] },
    { category: "Tools", items: ["Git", "VS Code", "Electron", "Vite", "Tailwind CSS"] }
  ];

  const projects = [
    {
      name: "SUSA Programming Language",
      description: "The first AI-made programming language with complete development environment",
      tech: ["C++", "AI Tools", "Electron", "React"],
      status: "Active"
    },
    {
      name: "SUSA IDE",
      description: "Full-featured IDE for SUSA programming language development",
      tech: ["Electron", "React", "TypeScript", "Monaco Editor"],
      status: "Active"
    },
    {
      name: "SUSA Website",
      description: "Interactive website with online code editor and documentation",
      tech: ["React", "TypeScript", "Tailwind CSS", "Vite"],
      status: "Active"
    }
  ];

  return (
    <div className="h-screen overflow-y-auto bg-background text-foreground transition-colors duration-500">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-32 h-32 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
            <User className="w-16 h-16 text-primary-foreground" />
          </div>
          <h1 className="text-5xl font-bold mb-4">
            Saketh Nandu
          </h1>
          <p className="text-xl text-primary mb-4">
            Developer of SUSA Programming Language
          </p>
          <Badge className="mb-6 bg-primary text-primary-foreground font-semibold">
            AI-Assisted Development Pioneer
          </Badge>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Student pursuing Diploma in Artificial Intelligence, passionate about pushing the boundaries
            of what's possible with AI-assisted development. Creator of SUSA, the world's first
            programming language developed entirely using artificial intelligence tools.
          </p>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <Card className="bg-card border-primary/20 text-center hover:border-primary transition-all">
            <CardContent className="p-6">
              <GraduationCap className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-foreground font-semibold">Education</div>
              <div className="text-muted-foreground text-sm">Diploma in AI</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-primary/20 text-center hover:border-primary transition-all">
            <CardContent className="p-6">
              <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-foreground font-semibold">Location</div>
              <div className="text-muted-foreground text-sm">India</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-primary/20 text-center hover:border-primary transition-all">
            <CardContent className="p-6">
              <Calendar className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-foreground font-semibold">Experience</div>
              <div className="text-muted-foreground text-sm">AI Development</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-primary/20 text-center hover:border-primary transition-all">
            <CardContent className="p-6">
              <Award className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-foreground font-semibold">Specialty</div>
              <div className="text-muted-foreground text-sm">AI-Assisted Dev</div>
            </CardContent>
          </Card>
        </div>

        {/* About Section */}
        <Card className="bg-card/50 border-primary/20 mb-16">
          <CardHeader>
            <CardTitle className="text-foreground text-2xl flex items-center gap-3">
              <Brain className="w-6 h-6 text-primary" />
              About Me
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-lg leading-relaxed">
              I'm Saketh Nandu, a passionate student currently pursuing a Diploma in Artificial Intelligence.
              My journey in technology has been driven by curiosity about the intersection of AI and software development.
              I believe in the transformative power of artificial intelligence to revolutionize how we create and interact with technology.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              My most significant achievement has been creating SUSA, the world's first programming language
              developed entirely using AI tools. This project represents not just a technical accomplishment,
              but a new paradigm in software development where human creativity and AI capabilities work together
              to create something entirely new.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <Lightbulb className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                <h3 className="text-foreground font-semibold mb-2">Innovation</h3>
                <p className="text-muted-foreground text-sm">Pushing boundaries with AI-assisted development</p>
              </div>
              <div className="text-center">
                <Rocket className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="text-foreground font-semibold mb-2">Vision</h3>
                <p className="text-muted-foreground text-sm">Creating the future of programming languages</p>
              </div>
              <div className="text-center">
                <BookOpen className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="text-foreground font-semibold mb-2">Learning</h3>
                <p className="text-muted-foreground text-sm">Continuously exploring AI and development</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Tools Used */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            AI Tools & Technologies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aiTools.map((tool, index) => (
              <Card key={index} className="bg-card border-primary/20 hover:border-primary transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary rounded-lg text-primary-foreground">
                      <Zap className="w-5 h-5" />
                    </div>
                    <CardTitle>{tool.name}</CardTitle>
                  </div>
                  <Badge variant="outline" className="w-fit">{tool.role}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{tool.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Skills */}
        <Card className="bg-card/50 border-primary/20 mb-16">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <Code className="w-6 h-6 text-primary" />
              Skills & Technologies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {skills.map((skillGroup, index) => (
                <div key={index}>
                  <h3 className="font-semibold mb-3">{skillGroup.category}</h3>
                  <div className="space-y-2">
                    {skillGroup.items.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="outline" className="mr-2 mb-2">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Projects */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card key={index} className="bg-card border-primary/20 hover:border-primary transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{project.name}</CardTitle>
                    <Badge className={`${project.status === 'Active' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} font-semibold`}>
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <Card className="bg-card/50 border-primary/20 mb-16">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <Star className="w-6 h-6 text-yellow-500" />
              Key Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0 shadow-glow">
                    <Award className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <Badge variant="outline">{achievement.year}</Badge>
                    </div>
                    <p className="text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <div className="text-center">
          <Card className="bg-card border-primary/20 max-w-2xl mx-auto hover:border-primary transition-all">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Connect With Me
              </h3>
              <p className="text-muted-foreground mb-6">
                Let's connect and discuss AI, programming languages, and the future of development!
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Button variant="outline" className="border-primary/20 hover:bg-primary/10">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
                <Button variant="outline" className="border-primary/20 hover:bg-primary/10">
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
                <Button variant="outline" className="border-primary/20 hover:bg-primary/10">
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </Button>
                <Button variant="outline" className="border-primary/20 hover:bg-primary/10">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
              </div>
              <p className="text-muted-foreground text-sm mt-6 italic">
                "The future of programming lies in the collaboration between human creativity and artificial intelligence."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Developer;