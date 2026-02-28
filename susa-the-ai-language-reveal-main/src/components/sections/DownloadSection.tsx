import { Download as DownloadIcon, Terminal, BookOpen, Github } from 'lucide-react';

export default function DownloadSection() {
  return (
    <div className="max-w-4xl mx-auto text-foreground space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-bold tracking-tight">Download SUSA</h2>
        <p className="text-muted-foreground text-lg">
          Get started with the AI-native programming language
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="p-8 bg-gradient-to-br from-card to-card/50 border-2 border-primary hover:border-primary/80 transition-all hover:scale-105 group rounded-lg">
          <DownloadIcon className="w-12 h-12 text-primary mx-auto mb-4 group-hover:animate-bounce" />
          <h3 className="text-xl font-bold mb-2">macOS</h3>
          <p className="text-sm text-muted-foreground mb-4">Apple Silicon & Intel</p>
          <span className="text-xs text-muted-foreground">susa-v1.0.0-darwin.pkg</span>
        </button>

        <button className="p-8 bg-gradient-to-br from-card to-card/50 border-2 border-accent hover:border-accent/80 transition-all hover:scale-105 group rounded-lg">
          <DownloadIcon className="w-12 h-12 text-accent mx-auto mb-4 group-hover:animate-bounce" />
          <h3 className="text-xl font-bold mb-2">Linux</h3>
          <p className="text-sm text-muted-foreground mb-4">Ubuntu, Debian, Arch</p>
          <span className="text-xs text-muted-foreground">susa-v1.0.0-linux.tar.gz</span>
        </button>

        <button className="p-8 bg-gradient-to-br from-card to-card/50 border-2 border-secondary hover:border-secondary/80 transition-all hover:scale-105 group rounded-lg">
          <DownloadIcon className="w-12 h-12 text-secondary mx-auto mb-4 group-hover:animate-bounce" />
          <h3 className="text-xl font-bold mb-2">Windows</h3>
          <p className="text-sm text-muted-foreground mb-4">Windows 10/11</p>
          <span className="text-xs text-muted-foreground">susa-v1.0.0-win64.exe</span>
        </button>
      </div>

      <div className="mt-12 p-8 bg-muted border border-border rounded-lg">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Terminal className="w-6 h-6 text-primary" />
          Quick Start
        </h3>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Install via package manager:</p>
            <code className="block bg-background p-4 text-primary font-mono text-sm border border-border rounded-md">
              curl -sSL https://get.susa.dev | sh
            </code>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Create your first program:</p>
            <code className="block bg-background p-4 text-primary font-mono text-sm border border-border rounded-md">
              susa new my-project && cd my-project
            </code>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Run your code:</p>
            <code className="block bg-background p-4 text-primary font-mono text-sm border border-border rounded-md">
              susa run main.susa
            </code>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <a
          href="#"
          className="flex items-center gap-4 p-6 bg-card/50 border border-border hover:border-primary/50 transition-colors group rounded-lg"
        >
          <BookOpen className="w-8 h-8 text-primary" />
          <div>
            <h4 className="font-bold group-hover:text-primary transition-colors">Documentation</h4>
            <p className="text-sm text-muted-foreground">Learn SUSA from the ground up</p>
          </div>
        </a>

        <a
          href="#"
          className="flex items-center gap-4 p-6 bg-card/50 border border-border hover:border-primary/50 transition-colors group rounded-lg"
        >
          <Github className="w-8 h-8 text-muted-foreground" />
          <div>
            <h4 className="font-bold group-hover:text-foreground transition-colors">GitHub</h4>
            <p className="text-sm text-muted-foreground">View source code & contribute</p>
          </div>
        </a>
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 border border-border rounded-lg">
        <h4 className="font-bold mb-2">System Requirements</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• 4GB RAM minimum (8GB recommended)</li>
          <li>• 500MB disk space for compiler and runtime</li>
          <li>• Internet connection for AI model downloads</li>
          <li>• Modern CPU with AVX2 support for optimal performance</li>
        </ul>
      </div>
    </div>
  );
}