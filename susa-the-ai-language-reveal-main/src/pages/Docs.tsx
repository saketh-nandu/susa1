import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Book } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

const Docs = () => {
  const [markdownContent, setMarkdownContent] = useState<string>("");
  const [isLoadingMarkdown, setIsLoadingMarkdown] = useState(true);

  // Load markdown documentation on component mount
  useEffect(() => {
    setIsLoadingMarkdown(true);
    fetch('/docs/SUSA-DOCUMENTATION.md')
      .then(response => {
        if (!response.ok) {
          throw new Error('Documentation file not found');
        }
        return response.text();
      })
      .then(text => {
        setMarkdownContent(text);
        setIsLoadingMarkdown(false);
      })
      .catch(error => {
        console.error('Error loading documentation:', error);
        setMarkdownContent('# Documentation Not Available\n\nThe documentation could not be loaded.');
        setIsLoadingMarkdown(false);
      });
  }, []);

  return (
    <div className="h-screen overflow-y-auto bg-background text-foreground transition-colors duration-500 scroll-smooth">
      {/* Header */}
      <header className="border-b border-primary/20 bg-background/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" state={{ fromPage: 'docs' }} className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Home</span>
            </Link>
            <div className="flex items-center gap-2">
              <Book className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">SUSA Documentation</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Main Content - Full Width */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg p-8">
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
                    hr: ({ node, ...props }) => <hr className="border-t border-primary/20 my-8" {...props} />,
                  }}
                >
                  {markdownContent}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;

