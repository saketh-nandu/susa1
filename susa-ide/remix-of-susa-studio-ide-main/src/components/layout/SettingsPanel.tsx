import React from 'react';
import { X, Moon, Sun, Monitor, Waves, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  useSettingsStore, 
  Theme, 
  themeOptions, 
  fontFamilyOptions 
} from '@/store/settingsStore';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export const SettingsPanel: React.FC = () => {
  const {
    settingsOpen,
    closeSettings,
    theme,
    setTheme,
    editorSettings,
    setEditorSettings,
  } = useSettingsStore();

  const getThemeIcon = (t: Theme) => {
    switch (t) {
      case 'light': return Sun;
      case 'dark': return Moon;
      case 'susa-midnight': return Sparkles;
      case 'susa-ocean': return Waves;
      default: return Monitor;
    }
  };

  return (
    <AnimatePresence>
      {settingsOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={closeSettings}
          />

          {/* Settings Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Settings</h2>
              <button
                onClick={closeSettings}
                className="p-2 rounded-md hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Theme Section */}
              <section>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Appearance
                </h3>

                <div className="space-y-4">
                  <Label className="text-foreground">Color Theme</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {themeOptions.map((option) => {
                      const Icon = getThemeIcon(option.value);
                      return (
                        <button
                          key={option.value}
                          onClick={() => setTheme(option.value)}
                          className={cn(
                            'flex items-center gap-3 p-3 rounded-lg border-2 transition-all',
                            theme === option.value
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50 hover:bg-secondary'
                          )}
                        >
                          <div className={cn(
                            'w-10 h-10 rounded-lg flex items-center justify-center',
                            theme === option.value ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                          )}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-sm">{option.label}</div>
                            <div className="text-xs text-muted-foreground">{option.description}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* Editor Section */}
              <section>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Editor
                </h3>

                <div className="space-y-6">
                  {/* Font Family */}
                  <div className="space-y-2">
                    <Label className="text-foreground">Font Family</Label>
                    <Select
                      value={editorSettings.fontFamily}
                      onValueChange={(value) => setEditorSettings({ fontFamily: value })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontFamilyOptions.map((font) => (
                          <SelectItem 
                            key={font.value} 
                            value={font.value}
                            style={{ fontFamily: font.value }}
                          >
                            {font.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Font Size */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground">Font Size</Label>
                      <span className="text-sm text-muted-foreground">{editorSettings.fontSize}px</span>
                    </div>
                    <Slider
                      value={[editorSettings.fontSize]}
                      onValueChange={([value]) => setEditorSettings({ fontSize: value })}
                      min={10}
                      max={24}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Line Height */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground">Line Height</Label>
                      <span className="text-sm text-muted-foreground">{editorSettings.lineHeight}px</span>
                    </div>
                    <Slider
                      value={[editorSettings.lineHeight]}
                      onValueChange={([value]) => setEditorSettings({ lineHeight: value })}
                      min={16}
                      max={36}
                      step={2}
                      className="w-full"
                    />
                  </div>

                  {/* Tab Size */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground">Tab Size</Label>
                      <span className="text-sm text-muted-foreground">{editorSettings.tabSize} spaces</span>
                    </div>
                    <Slider
                      value={[editorSettings.tabSize]}
                      onValueChange={([value]) => setEditorSettings({ tabSize: value })}
                      min={2}
                      max={8}
                      step={2}
                      className="w-full"
                    />
                  </div>

                  {/* Toggle Options */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="minimap" className="text-foreground cursor-pointer">
                        Show Minimap
                      </Label>
                      <Switch
                        id="minimap"
                        checked={editorSettings.minimap}
                        onCheckedChange={(checked) => setEditorSettings({ minimap: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="bracket" className="text-foreground cursor-pointer">
                        Bracket Pair Colorization
                      </Label>
                      <Switch
                        id="bracket"
                        checked={editorSettings.bracketPairColorization}
                        onCheckedChange={(checked) => setEditorSettings({ bracketPairColorization: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="wordwrap" className="text-foreground cursor-pointer">
                        Word Wrap
                      </Label>
                      <Switch
                        id="wordwrap"
                        checked={editorSettings.wordWrap === 'on'}
                        onCheckedChange={(checked) => setEditorSettings({ wordWrap: checked ? 'on' : 'off' })}
                      />
                    </div>
                  </div>

                  {/* Whitespace Rendering */}
                  <div className="space-y-2">
                    <Label className="text-foreground">Render Whitespace</Label>
                    <Select
                      value={editorSettings.renderWhitespace}
                      onValueChange={(value: 'none' | 'selection' | 'all') => 
                        setEditorSettings({ renderWhitespace: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="selection">Selection Only</SelectItem>
                        <SelectItem value="all">All</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Cursor Style */}
                  <div className="space-y-2">
                    <Label className="text-foreground">Cursor Animation</Label>
                    <Select
                      value={editorSettings.cursorBlinking}
                      onValueChange={(value: 'blink' | 'smooth' | 'phase' | 'expand' | 'solid') => 
                        setEditorSettings({ cursorBlinking: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blink">Blink</SelectItem>
                        <SelectItem value="smooth">Smooth</SelectItem>
                        <SelectItem value="phase">Phase</SelectItem>
                        <SelectItem value="expand">Expand</SelectItem>
                        <SelectItem value="solid">Solid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border text-center">
              <p className="text-xs text-muted-foreground">
                Settings are automatically saved
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
