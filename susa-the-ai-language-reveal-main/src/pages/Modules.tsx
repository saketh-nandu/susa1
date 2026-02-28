import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Copy, Search, Package, ArrowLeft, Star, Code, Zap, CheckCircle,
  Book, FileText, ChevronRight, Home, X
} from "lucide-react";
import { toast } from "sonner";
import { modulesDocs, type ModuleDoc } from "@/data/modulesDocs";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

const Modules = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedModule, setSelectedModule] = useState<ModuleDoc | null>(null);
  const [markdownContent, setMarkdownContent] = useState<string>("");
  const [isLoadingMarkdown, setIsLoadingMarkdown] = useState(false);

  const modules = Object.values(modulesDocs);
  const categories = ["All", "Core", "System", "Data", "Network", "Advanced"];

  // Load markdown content when a module is selected
  useEffect(() => {
    if (selectedModule) {
      setIsLoadingMarkdown(true);
      fetch(`/docs/modules/${selectedModule.name}.md`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Markdown file not found');
          }
          return response.text();
        })
        .then(text => {
          setMarkdownContent(text);
          setIsLoadingMarkdown(false);
        })
        .catch(error => {
          console.error('Error loading markdown:', error);
          setMarkdownContent('# Documentation Not Available\n\nThe documentation for this module could not be loaded.');
          setIsLoadingMarkdown(false);
        });
    }
  }, [selectedModule]);

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || module.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  // If a module is selected, show detailed documentation from markdown
  if (selectedModule) {
    return (
      <div className="h-screen overflow-y-auto bg-background text-foreground transition-colors duration-500">
        {/* Header */}
        <header className="border-b border-primary/20 bg-background/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => setSelectedModule(null)}
                className="text-primary hover:text-primary/80 hover:bg-primary/10"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Modules
              </Button>
              <div className="flex items-center gap-2">
                <Package className="w-6 h-6 text-primary" />
                <h1 className="text-2xl font-bold">{selectedModule.displayName}</h1>
                <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
                  v{selectedModule.version}
                </Badge>
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedModule(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8 max-w-6xl">
          {/* Module Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary rounded-lg text-primary-foreground shadow-glow">
                <Package className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{selectedModule.displayName}</h2>
                <p className="text-muted-foreground">{selectedModule.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Code className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">{selectedModule.functions} functions</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-muted-foreground">{selectedModule.performance}</span>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                {selectedModule.category}
              </Badge>
            </div>
          </div>

          {/* Markdown Documentation */}
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardContent className="p-8">
              {isLoadingMarkdown ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading documentation...</p>
                </div>
              ) : (
                <div className="prose dark:prose-invert prose-cyan max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      h1: ({ node, ...props }) => <h1 className="text-4xl font-bold text-foreground mb-6 mt-8 first:mt-0" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-3xl font-bold text-foreground mb-4 mt-8 border-b border-primary/20 pb-2" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-2xl font-semibold text-foreground mb-3 mt-6" {...props} />,
                      h4: ({ node, ...props }) => <h4 className="text-xl font-semibold text-primary mb-2 mt-4" {...props} />,
                      p: ({ node, ...props }) => <p className="text-muted-foreground mb-4 leading-relaxed" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal list-inside text-muted-foreground mb-4 space-y-2" {...props} />,
                      li: ({ node, ...props }) => <li className="text-muted-foreground ml-4" {...props} />,
                      code: ({ node, inline, ...props }: any) =>
                        inline ? (
                          <code className="bg-muted text-primary px-2 py-1 rounded text-sm font-mono" {...props} />
                        ) : (
                          <code className="block bg-muted text-primary p-4 rounded overflow-x-auto text-sm font-mono" {...props} />
                        ),
                      pre: ({ node, ...props }) => <pre className="bg-muted border border-primary/20 rounded p-4 overflow-x-auto mb-4" {...props} />,
                      blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4" {...props} />,
                      a: ({ node, ...props }) => <a className="text-primary hover:text-primary/80 underline" {...props} />,
                      table: ({ node, ...props }) => <div className="overflow-x-auto mb-4"><table className="min-w-full border border-primary/20" {...props} /></div>,
                      th: ({ node, ...props }) => <th className="border border-primary/20 px-4 py-2 bg-primary/10 text-foreground font-semibold text-left" {...props} />,
                      td: ({ node, ...props }) => <td className="border border-primary/20 px-4 py-2 text-muted-foreground" {...props} />,
                      strong: ({ node, ...props }) => <strong className="text-foreground font-semibold" {...props} />,
                      em: ({ node, ...props }) => <em className="text-primary italic" {...props} />,
                    }}
                  >
                    {markdownContent}
                  </ReactMarkdown>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Related Modules */}
          {selectedModule.relatedModules.length > 0 && (
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20 mt-8">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Related Modules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {selectedModule.relatedModules.map((moduleName, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedModule(modulesDocs[moduleName])}
                      className="border-primary/20 text-muted-foreground hover:text-foreground hover:bg-primary/10"
                    >
                      {modulesDocs[moduleName].displayName}
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Main modules list view
  return (
    <div className="h-screen overflow-y-auto bg-background text-foreground transition-colors duration-500">
      {/* Header */}
      <header className="border-b border-primary/20 bg-background/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" state={{ fromPage: 'modules' }} className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Home</span>
            </Link>
            <div className="flex items-center gap-2">
              <Package className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">SUSA Modules</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            200+ Functions Across 9 Modules
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            All built into the C++ core for maximum performance. Zero external dependencies.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            {[
              { label: "Modules", value: "9" },
              { label: "Functions", value: "200+" },
              { label: "Performance", value: "10-100x" },
              { label: "Dependencies", value: "0" }
            ].map((stat, index) => (
              <div key={index} className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg p-4 hover:border-primary transition-all hover:shadow-glow">
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Search and Filter */}
          <div className="max-w-2xl mx-auto">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card/50 border-primary/20 text-foreground placeholder-muted-foreground focus-visible:ring-primary"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-glow"
                    : "border-primary/20 text-muted-foreground hover:text-foreground hover:bg-primary/10"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredModules.map((module, index) => (
            <Card
              key={index}
              className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary transition-all hover:shadow-glow hover:scale-105 duration-300 cursor-pointer"
              onClick={() => setSelectedModule(module)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary rounded-lg text-primary-foreground shadow-glow">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-foreground">{module.displayName}</CardTitle>
                      <p className="text-sm text-muted-foreground">v{module.version}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">{module.category}</Badge>
                </div>
                <p className="text-muted-foreground text-sm line-clamp-2">{module.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Code className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">{module.functions} functions</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className="text-muted-foreground">{module.performance}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-foreground font-medium mb-2 text-sm">Quick Functions:</h4>
                  <div className="flex flex-wrap gap-1">
                    {module.quickFunctions.slice(0, 4).map((func, idx) => (
                      <Badge key={idx} variant="outline" className="border-primary/20 text-muted-foreground text-xs">
                        {func}
                      </Badge>
                    ))}
                    {module.quickFunctions.length > 4 && (
                      <Badge variant="outline" className="border-primary/20 text-muted-foreground text-xs">
                        +{module.quickFunctions.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-glow"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedModule(module);
                  }}
                >
                  <Book className="w-4 h-4 mr-2" />
                  View Documentation
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredModules.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No modules found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms or category filter.</p>
          </div>
        )}

        {/* Info Card */}
        <Card className="bg-card/50 backdrop-blur-sm border-primary/20 max-w-4xl mx-auto">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Star className="w-6 h-6 text-yellow-500" />
              <h3 className="text-2xl font-bold text-foreground">All Modules Built-In</h3>
            </div>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
              All 9 modules with 200+ functions are built directly into the SUSA C++ core.
              No installation, no dependencies, just pure performance.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/docs">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-glow">
                  <Code className="w-4 h-4 mr-2" />
                  View Full Docs
                </Button>
              </Link>
              <Link to="/examples">
                <Button variant="outline" className="border-primary/20 text-muted-foreground hover:text-foreground hover:bg-primary/10">
                  <Package className="w-4 h-4 mr-2" />
                  See Examples
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Modules;
