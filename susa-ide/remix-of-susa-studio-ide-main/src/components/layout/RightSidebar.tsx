/**
 * Right Sidebar Component for SUSA IDE
 * Contains useful panels like Outline, Search, Extensions, and Git
 */

import React, { useState } from 'react';
import { 
  Search, 
  FileText, 
  GitBranch, 
  Package, 
  Settings,
  ChevronDown,
  ChevronRight,
  File,
  Zap,
  Variable,
  Hash,
  Type,
  Download,
  Star,
  Eye,
  Code,
  BookOpen,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEditorStore } from '@/store/editorStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

type RightSidebarTab = 'outline' | 'search' | 'extensions' | 'git' | 'help';

export const RightSidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<RightSidebarTab>('outline');
  const { currentContent, tabs, activeTabId } = useEditorStore();

  const tabs_config = [
    { id: 'outline' as const, icon: FileText, label: 'Outline', tooltip: 'Code Outline' },
    { id: 'search' as const, icon: Search, label: 'Search', tooltip: 'Search & Replace' },
    { id: 'extensions' as const, icon: Package, label: 'Extensions', tooltip: 'Extensions' },
    { id: 'git' as const, icon: GitBranch, label: 'Git', tooltip: 'Source Control' },
    { id: 'help' as const, icon: HelpCircle, label: 'Help', tooltip: 'Help & Documentation' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'outline':
        return <OutlinePanel content={currentContent} />;
      case 'search':
        return <SearchPanel />;
      case 'extensions':
        return <ExtensionsPanel />;
      case 'git':
        return <GitPanel />;
      case 'help':
        return <HelpPanel />;
      default:
        return <OutlinePanel content={currentContent} />;
    }
  };

  return (
    <div className="h-full bg-sidebar flex flex-col border-l border-sidebar-border">
      {/* Tab Bar */}
      <div className="flex border-b border-sidebar-border bg-muted/50">
        {tabs_config.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 p-2 flex items-center justify-center hover:bg-muted/70 transition-colors',
                activeTab === tab.id && 'bg-background border-b-2 border-primary'
              )}
              title={tab.tooltip}
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {renderTabContent()}
      </div>
    </div>
  );
};

// Outline Panel Component
const OutlinePanel: React.FC<{ content: string }> = ({ content }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['variables', 'functions']));
  
  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // Parse SUSA code to extract outline information
  const parseOutline = (code: string) => {
    const lines = code.split('\n');
    const variables: Array<{ name: string; type: string; line: number }> = [];
    const functions: Array<{ name: string; line: number }> = [];
    const loops: Array<{ type: string; line: number }> = [];
    const conditions: Array<{ type: string; line: number }> = [];

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      const lineNumber = index + 1;

      // Variables (let, int, string, bool, etc.)
      const varMatch = trimmed.match(/^(let|int|string|bool|float|double)\s+(\w+)/);
      if (varMatch) {
        variables.push({
          name: varMatch[2],
          type: varMatch[1],
          line: lineNumber
        });
      }

      // Functions (FUNCTION keyword)
      const funcMatch = trimmed.match(/^FUNCTION\s+(\w+)/);
      if (funcMatch) {
        functions.push({
          name: funcMatch[1],
          line: lineNumber
        });
      }

      // Loops
      if (trimmed.startsWith('LOOP') || trimmed.startsWith('FOR') || trimmed.startsWith('WHILE')) {
        loops.push({
          type: trimmed.split(' ')[0],
          line: lineNumber
        });
      }

      // Conditions
      if (trimmed.startsWith('IF') || trimmed.startsWith('ELSE')) {
        conditions.push({
          type: trimmed.split(' ')[0],
          line: lineNumber
        });
      }
    });

    return { variables, functions, loops, conditions };
  };

  const outline = parseOutline(content);

  const OutlineSection: React.FC<{
    title: string;
    icon: React.ComponentType<any>;
    items: Array<{ name?: string; type?: string; line: number }>;
    sectionKey: string;
  }> = ({ title, icon: Icon, items, sectionKey }) => {
    const isExpanded = expandedSections.has(sectionKey);
    
    return (
      <div className="mb-2">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center gap-2 p-2 hover:bg-muted/50 text-sm font-medium"
        >
          {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          <Icon className="w-4 h-4" />
          <span>{title}</span>
          <Badge variant="secondary" className="ml-auto text-xs">
            {items.length}
          </Badge>
        </button>
        
        {isExpanded && (
          <div className="ml-4 space-y-1">
            {items.length === 0 ? (
              <div className="text-xs text-muted-foreground p-2">No {title.toLowerCase()} found</div>
            ) : (
              items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-1 hover:bg-muted/30 rounded text-xs cursor-pointer"
                  onClick={() => {
                    // TODO: Jump to line functionality
                    console.log(`Jump to line ${item.line}`);
                  }}
                >
                  <span className="w-4 text-center text-muted-foreground">{item.line}</span>
                  <span className="flex-1">{item.name || item.type}</span>
                  {item.type && <Badge variant="outline" className="text-xs">{item.type}</Badge>}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-sidebar-border">
        <h3 className="text-sm font-semibold">OUTLINE</h3>
      </div>
      
      <ScrollArea className="flex-1 p-2">
        {content.trim() ? (
          <>
            <OutlineSection
              title="Variables"
              icon={Variable}
              items={outline.variables}
              sectionKey="variables"
            />
            <OutlineSection
              title="Functions"
              icon={Code}
              items={outline.functions}
              sectionKey="functions"
            />
            <OutlineSection
              title="Loops"
              icon={Zap}
              items={outline.loops}
              sectionKey="loops"
            />
            <OutlineSection
              title="Conditions"
              icon={Hash}
              items={outline.conditions}
              sectionKey="conditions"
            />
          </>
        ) : (
          <div className="text-center text-muted-foreground text-sm p-4">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No file open</p>
            <p className="text-xs">Open a SUSA file to see its outline</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

// Search Panel Component
const SearchPanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-sidebar-border">
        <h3 className="text-sm font-semibold">SEARCH</h3>
      </div>
      
      <div className="p-3 space-y-3">
        <div>
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-sm"
          />
        </div>
        
        <div>
          <Input
            placeholder="Replace"
            value={replaceQuery}
            onChange={(e) => setReplaceQuery(e.target.value)}
            className="text-sm"
          />
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1">
            Replace
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            Replace All
          </Button>
        </div>
        
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="rounded"
            />
            Case sensitive
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={wholeWord}
              onChange={(e) => setWholeWord(e.target.checked)}
              className="rounded"
            />
            Whole word
          </label>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-3">
        <div className="text-center text-muted-foreground text-sm">
          <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No results</p>
          <p className="text-xs">Enter search terms to find matches</p>
        </div>
      </ScrollArea>
    </div>
  );
};

// Extensions Panel Component
const ExtensionsPanel: React.FC = () => {
  const extensions = [
    {
      name: 'SUSA Language Support',
      description: 'Syntax highlighting and IntelliSense for SUSA',
      installed: true,
      enabled: true
    },
    {
      name: 'SUSA Debugger',
      description: 'Advanced debugging capabilities for SUSA code',
      installed: true,
      enabled: true
    },
    {
      name: 'SUSA Formatter',
      description: 'Code formatting and beautification',
      installed: true,
      enabled: true
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-sidebar-border">
        <h3 className="text-sm font-semibold">EXTENSIONS</h3>
      </div>
      
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-3">
          {extensions.map((ext, index) => (
            <div key={index} className="p-3 border border-border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-medium">{ext.name}</h4>
                <Badge variant={ext.enabled ? "default" : "secondary"} className="text-xs">
                  {ext.enabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{ext.description}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-xs">
                  {ext.enabled ? 'Disable' : 'Enable'}
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  Settings
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

// Git Panel Component
const GitPanel: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-sidebar-border">
        <h3 className="text-sm font-semibold">SOURCE CONTROL</h3>
      </div>
      
      <div className="flex-1 p-3">
        <div className="text-center text-muted-foreground text-sm">
          <GitBranch className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No repository</p>
          <p className="text-xs">Initialize a git repository to use source control features</p>
          <Button size="sm" variant="outline" className="mt-3">
            Initialize Repository
          </Button>
        </div>
      </div>
    </div>
  );
};

// Help Panel Component
const HelpPanel: React.FC = () => {
  const helpSections = [
    {
      title: 'Getting Started',
      icon: BookOpen,
      items: [
        'SUSA Language Basics',
        'Creating Your First Program',
        'Using the IDE',
        'Debugging Code'
      ]
    },
    {
      title: 'Language Reference',
      icon: Code,
      items: [
        'Variables and Types',
        'Control Flow',
        'Functions',
        'Built-in Functions'
      ]
    },
    {
      title: 'Examples',
      icon: Eye,
      items: [
        'Hello World',
        'Loops and Conditions',
        'Working with Lists',
        'Object-Oriented Programming'
      ]
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-sidebar-border">
        <h3 className="text-sm font-semibold">HELP & DOCS</h3>
      </div>
      
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-4">
          {helpSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div key={index}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4" />
                  <h4 className="text-sm font-medium">{section.title}</h4>
                </div>
                <div className="ml-6 space-y-1">
                  {section.items.map((item, itemIndex) => (
                    <button
                      key={itemIndex}
                      className="block text-xs text-muted-foreground hover:text-foreground hover:underline"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
          
          <div className="pt-4 border-t border-border">
            <Button size="sm" variant="outline" className="w-full">
              <HelpCircle className="w-4 h-4 mr-2" />
              Open Documentation
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};