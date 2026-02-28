import { Sparkles, User, Zap, Shield } from 'lucide-react';

export default function AboutSection() {
  return (
    <div className="max-w-4xl mx-auto text-foreground space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-bold tracking-tight">About SUSA</h2>
        <p className="text-muted-foreground text-lg">
          The world's first AI-made programming language
        </p>
      </div>

      <div className="space-y-8">
        <div className="prose prose-invert max-w-none">
          <p className="text-xl text-muted-foreground leading-relaxed">
            SUSA represents a paradigm shift in programming language design. Created entirely by artificial intelligence,
            it combines the expressiveness of high-level languages with native AI integration, making intelligent applications
            accessible to every developer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="p-6 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-lg">
            <Sparkles className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-3">AI-First Design</h3>
            <p className="text-muted-foreground">
              Every aspect of SUSA was designed by AI to be intuitive for both humans and machines.
              Built-in neural inference, natural language processing, and intelligent code generation.
            </p>
          </div>

          <div className="p-6 bg-gradient-to-br from-accent/10 to-transparent border border-accent/20 rounded-lg">
            <Zap className="w-8 h-8 text-accent mb-4" />
            <h3 className="text-xl font-bold mb-3">High Performance</h3>
            <p className="text-muted-foreground">
              Compiles to optimized machine code with zero-cost abstractions. AI models run directly
              in the runtime without external dependencies or network calls.
            </p>
          </div>

          <div className="p-6 bg-gradient-to-br from-secondary/10 to-transparent border border-secondary/20 rounded-lg">
            <Shield className="w-8 h-8 text-secondary mb-4" />
            <h3 className="text-xl font-bold mb-3">Memory Safe</h3>
            <p className="text-muted-foreground">
              Advanced type system and ownership model prevent common bugs like null pointers,
              data races, and memory leaks at compile time.
            </p>
          </div>

          <div className="p-6 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-lg">
            <User className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-3">Developer Experience</h3>
            <p className="text-muted-foreground">
              Intelligent autocomplete, instant error detection, and AI-powered suggestions
              make coding faster and more enjoyable than ever before.
            </p>
          </div>
        </div>

        <div className="mt-12 p-8 bg-card/50 border border-border rounded-lg">
          <h3 className="text-2xl font-bold mb-4">The Creator</h3>
          <p className="text-muted-foreground mb-4">
            SUSA was conceived and developed by an advanced AI system over the course of 18 months.
            The language specification, compiler, runtime, and standard library were all generated
            through iterative AI-driven development.
          </p>
          <p className="text-muted-foreground">
            This project demonstrates that AI can not only assist in programming but can architect
            entire systems from the ground up, opening new possibilities for the future of software development.
          </p>
        </div>

        <div className="mt-8 p-8 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg">
          <h3 className="text-2xl font-bold mb-4 text-cyan-400">About the Developer</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-cyan-300 mb-2">Saketh Nandu</h4>
                <p className="text-muted-foreground mb-3">
                  Student pursuing Diploma in Artificial Intelligence
                </p>
                <p className="text-muted-foreground mb-4">
                  SUSA represents the culmination of extensive research and development in AI-driven programming languages. 
                  This project showcases the potential of artificial intelligence in creating innovative solutions for 
                  software development and demonstrates how AI can be leveraged to build complex systems from the ground up.
                </p>
                <div className="space-y-2">
                  <h5 className="font-semibold text-cyan-400">Development Tools Used:</h5>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm border border-cyan-500/30">
                      Kiro AI Assistant
                    </span>
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm border border-cyan-500/30">
                      Trea AI
                    </span>
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm border border-cyan-500/30">
                      ChatGPT
                    </span>
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm border border-cyan-500/30">
                      C++
                    </span>
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm border border-cyan-500/30">
                      React/TypeScript
                    </span>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-black/20 rounded-lg border border-cyan-500/20">
                  <p className="text-sm text-cyan-300/80 italic">
                    "SUSA is more than just a programming language - it's a vision of how AI and human creativity 
                    can collaborate to build the future of software development. This project demonstrates that 
                    with the right tools and determination, students can create innovative solutions that push 
                    the boundaries of what's possible."
                  </p>
                  <p className="text-right text-cyan-400 mt-2 font-semibold">- Saketh Nandu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}