import React from 'react';
import { FileCode } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { motion } from 'framer-motion';

export const WelcomeScreen: React.FC = () => {
  const { files, selectFile, tabs } = useEditorStore();

  // Flatten file tree to get all files
  const getAllFiles = (nodes: typeof files): typeof files => {
    const result: typeof files = [];
    for (const node of nodes) {
      if (node.type === 'file') {
        result.push(node);
      }
      if (node.children) {
        result.push(...getAllFiles(node.children));
      }
    }
    return result;
  };

  const allFiles = getAllFiles(files);

  if (tabs.length > 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center h-full bg-editor-bg"
    >
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="text-3xl font-bold text-primary-foreground">S</span>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">
          Welcome to SUSA Studio
        </h1>
        <p className="text-muted-foreground mb-8">
          A professional IDE for the SUSA programming language
        </p>

        {/* Recent files */}
        <div className="text-left">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Open a file to get started
          </h2>
          <div className="space-y-1">
            {allFiles.slice(0, 5).map((file) => (
              <button
                key={file.id}
                onClick={() => selectFile(file.id)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors hover:bg-secondary group"
              >
                <FileCode className="w-4 h-4 text-primary" />
                <span className="text-foreground group-hover:text-primary transition-colors">
                  {file.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Keyboard shortcuts */}
        <div className="mt-8 pt-8 border-t border-border">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Quick shortcuts
          </h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <ShortcutItem keys="Ctrl+Shift+P" label="Command Palette" />
            <ShortcutItem keys="F5" label="Run Program" />
            <ShortcutItem keys="Ctrl+N" label="New File" />
            <ShortcutItem keys="Ctrl+S" label="Save" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ShortcutItem: React.FC<{ keys: string; label: string }> = ({ keys, label }) => (
  <div className="flex items-center gap-2 text-muted-foreground">
    <kbd className="px-2 py-0.5 text-xs bg-secondary rounded">{keys}</kbd>
    <span>{label}</span>
  </div>
);
