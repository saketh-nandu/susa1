import { motion } from "framer-motion";
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

const DeveloperSection = () => {
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

  return (
    <motion.div
      className="w-full max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div 
          className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <User className="w-12 h-12 text-white" />
        </motion.div>
        
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Saketh Nandu
        </motion.h1>
        
        <motion.p 
          className="text-xl text-purple-400 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Developer of SUSA Programming Language
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Badge className="mb-6 bg-purple-600 text-white">
            AI-Assisted Development Pioneer
          </Badge>
        </motion.div>
        
        <motion.p 
          className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          Student pursuing Diploma in Artificial Intelligence, passionate about pushing the boundaries 
          of what's possible with AI-assisted development. Creator of SUSA, the world's first 
          programming language developed entirely using artificial intelligence tools.
        </motion.p>
      </div>

      {/* Quick Info */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="bg-slate-800/50 border-slate-700 text-center backdrop-blur-sm">
          <CardContent className="p-4">
            <GraduationCap className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-white font-semibold text-sm">Education</div>
            <div className="text-gray-300 text-xs">Diploma in AI</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700 text-center backdrop-blur-sm">
          <CardContent className="p-4">
            <MapPin className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-white font-semibold text-sm">Location</div>
            <div className="text-gray-300 text-xs">India</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700 text-center backdrop-blur-sm">
          <CardContent className="p-4">
            <Calendar className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-white font-semibold text-sm">Experience</div>
            <div className="text-gray-300 text-xs">AI Development</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700 text-center backdrop-blur-sm">
          <CardContent className="p-4">
            <Award className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-white font-semibold text-sm">Specialty</div>
            <div className="text-gray-300 text-xs">AI-Assisted Dev</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* About Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mb-12"
      >
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-xl flex items-center gap-3">
              <Brain className="w-5 h-5 text-purple-400" />
              About Me
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300 leading-relaxed">
              I'm Saketh Nandu, a passionate student currently pursuing a Diploma in Artificial Intelligence. 
              My journey in technology has been driven by curiosity about the intersection of AI and software development. 
              I believe in the transformative power of artificial intelligence to revolutionize how we create and interact with technology.
            </p>
            <p className="text-gray-300 leading-relaxed">
              My most significant achievement has been creating SUSA, the world's first programming language 
              developed entirely using AI tools. This project represents not just a technical accomplishment, 
              but a new paradigm in software development where human creativity and AI capabilities work together 
              to create something entirely new.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="text-center">
                <Lightbulb className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <h3 className="text-white font-semibold mb-1 text-sm">Innovation</h3>
                <p className="text-gray-400 text-xs">Pushing boundaries with AI-assisted development</p>
              </div>
              <div className="text-center">
                <Rocket className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <h3 className="text-white font-semibold mb-1 text-sm">Vision</h3>
                <p className="text-gray-400 text-xs">Creating the future of programming languages</p>
              </div>
              <div className="text-center">
                <BookOpen className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <h3 className="text-white font-semibold mb-1 text-sm">Learning</h3>
                <p className="text-gray-400 text-xs">Continuously exploring AI and development</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Tools Used */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-8">
          AI Tools & Technologies
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aiTools.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500 transition-colors backdrop-blur-sm h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-600 rounded-lg">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <CardTitle className="text-white text-lg">{tool.name}</CardTitle>
                  </div>
                  <Badge className="w-fit bg-slate-700 text-gray-300 text-xs">{tool.role}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm">{tool.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Skills */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="mb-12"
      >
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-xl flex items-center gap-3">
              <Code className="w-5 h-5 text-blue-500" />
              Skills & Technologies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {skills.map((skillGroup, index) => (
                <div key={index}>
                  <h3 className="text-white font-semibold mb-3 text-sm">{skillGroup.category}</h3>
                  <div className="space-y-2">
                    {skillGroup.items.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="outline" className="mr-2 mb-2 border-slate-600 text-gray-300 text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="mb-12"
      >
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-xl flex items-center gap-3">
              <Star className="w-5 h-5 text-yellow-500" />
              Key Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-semibold text-sm">{achievement.title}</h3>
                      <Badge className="bg-slate-700 text-gray-300 text-xs">{achievement.year}</Badge>
                    </div>
                    <p className="text-gray-300 text-sm">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Social Links */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="text-center"
      >
        <Card className="bg-slate-800/50 border-slate-700 max-w-2xl mx-auto backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">
              Connect With Me
            </h3>
            <p className="text-gray-300 mb-6 text-sm">
              Let's connect and discuss AI, programming languages, and the future of development!
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Button variant="outline" className="border-slate-600 text-gray-300 hover:text-white text-xs" size="sm">
                <Github className="w-3 h-3 mr-2" />
                GitHub
              </Button>
              <Button variant="outline" className="border-slate-600 text-gray-300 hover:text-white text-xs" size="sm">
                <Linkedin className="w-3 h-3 mr-2" />
                LinkedIn
              </Button>
              <Button variant="outline" className="border-slate-600 text-gray-300 hover:text-white text-xs" size="sm">
                <Twitter className="w-3 h-3 mr-2" />
                Twitter
              </Button>
              <Button variant="outline" className="border-slate-600 text-gray-300 hover:text-white text-xs" size="sm">
                <Mail className="w-3 h-3 mr-2" />
                Email
              </Button>
            </div>
            <p className="text-gray-400 text-xs mt-4 italic">
              "The future of programming lies in the collaboration between human creativity and artificial intelligence."
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default DeveloperSection;