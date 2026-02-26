import React, { useEffect, useState, useMemo } from 'react';
import { Command, Search, FileCode, Play, Settings, Palette, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditorStore } from '@/store/editorStore';
import { cn } from '@/lib/utils';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  shortcut?: string;
  action: () => void;
  category: string;
}

export const CommandPalette: React.FC = () => {
  const {
    commandPaletteOpen,
    toggleCommandPalette,
    addFile,
    toggleSidebar,
    toggleBottomPanel,
    setActiveBottomTab,
  } = useEditorStore();

  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: CommandItem[] = useMemo(() => [
    {
      id: 'new-file',
      label: 'New File',
      description: 'Create a new SUSA file',
      icon: FileCode,
      shortcut: 'Ctrl+N',
      action: () => addFile(null, `untitled-${Date.now()}`, 'file'),
      category: 'File',
    },
    {
      id: 'run',
      label: 'Run Program',
      description: 'Execute the current SUSA program',
      icon: Play,
      shortcut: 'F5',
      action: () => {},
      category: 'Run',
    },
    {
      id: 'toggle-sidebar',
      label: 'Toggle Sidebar',
      description: 'Show or hide the file explorer',
      icon: Command,
      shortcut: 'Ctrl+B',
      action: toggleSidebar,
      category: 'View',
    },
    {
      id: 'toggle-panel',
      label: 'Toggle Panel',
      description: 'Show or hide the bottom panel',
      icon: Terminal,
      shortcut: 'Ctrl+J',
      action: toggleBottomPanel,
      category: 'View',
    },
    {
      id: 'show-output',
      label: 'Show Output',
      description: 'Open the output panel',
      icon: Terminal,
      action: () => setActiveBottomTab('output'),
      category: 'View',
    },
    {
      id: 'show-problems',
      label: 'Show Problems',
      description: 'Open the problems panel',
      icon: Terminal,
      action: () => setActiveBottomTab('problems'),
      category: 'View',
    },
    {
      id: 'settings',
      label: 'Open Settings',
      description: 'Configure SUSA Studio',
      icon: Settings,
      shortcut: 'Ctrl+,',
      action: () => {},
      category: 'Preferences',
    },
    {
      id: 'theme',
      label: 'Change Theme',
      description: 'Switch between light and dark themes',
      icon: Palette,
      action: () => {},
      category: 'Preferences',
    },
  ], [addFile, toggleSidebar, toggleBottomPanel, setActiveBottomTab]);

  const filteredCommands = useMemo(() => {
    if (!search) return commands;
    const lower = search.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(lower) ||
        cmd.description?.toLowerCase().includes(lower) ||
        cmd.category.toLowerCase().includes(lower)
    );
  }, [commands, search]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open command palette
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        toggleCommandPalette();
      }

      if (!commandPaletteOpen) return;

      // Close on escape
      if (e.key === 'Escape') {
        e.preventDefault();
        toggleCommandPalette();
      }

      // Navigate
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      }

      // Execute
      if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = filteredCommands[selectedIndex];
        if (cmd) {
          cmd.action();
          toggleCommandPalette();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, toggleCommandPalette, filteredCommands, selectedIndex]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  useEffect(() => {
    if (commandPaletteOpen) {
      setSearch('');
      setSelectedIndex(0);
    }
  }, [commandPaletteOpen]);

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="command-palette-overlay"
            onClick={toggleCommandPalette}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="command-palette"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                autoFocus
              />
              <kbd className="px-2 py-1 text-xs bg-secondary rounded">Esc</kbd>
            </div>

            {/* Commands list */}
            <div className="max-h-80 overflow-y-auto py-2">
              {filteredCommands.length === 0 ? (
                <div className="px-4 py-8 text-center text-muted-foreground">
                  No commands found
                </div>
              ) : (
                filteredCommands.map((cmd, index) => (
                  <div
                    key={cmd.id}
                    onClick={() => {
                      cmd.action();
                      toggleCommandPalette();
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors',
                      index === selectedIndex
                        ? 'bg-primary/10 text-foreground'
                        : 'text-muted-foreground hover:bg-secondary'
                    )}
                  >
                    <cmd.icon className="w-4 h-4 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{cmd.label}</div>
                      {cmd.description && (
                        <div className="text-xs text-muted-foreground truncate">
                          {cmd.description}
                        </div>
                      )}
                    </div>
                    {cmd.shortcut && (
                      <kbd className="px-2 py-0.5 text-xs bg-secondary rounded shrink-0">
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
