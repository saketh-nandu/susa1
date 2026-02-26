import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'dark' | 'light' | 'susa-midnight' | 'susa-ocean';

export interface EditorSettings {
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  tabSize: number;
  wordWrap: 'on' | 'off' | 'wordWrapColumn';
  minimap: boolean;
  renderWhitespace: 'none' | 'selection' | 'all';
  cursorBlinking: 'blink' | 'smooth' | 'phase' | 'expand' | 'solid';
  bracketPairColorization: boolean;
}

interface SettingsState {
  theme: Theme;
  editorSettings: EditorSettings;
  settingsOpen: boolean;
  
  setTheme: (theme: Theme) => void;
  setEditorSettings: (settings: Partial<EditorSettings>) => void;
  toggleSettings: () => void;
  closeSettings: () => void;
}

const defaultEditorSettings: EditorSettings = {
  fontSize: 14,
  fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
  lineHeight: 22,
  tabSize: 2,
  wordWrap: 'off',
  minimap: true,
  renderWhitespace: 'selection',
  cursorBlinking: 'smooth',
  bracketPairColorization: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      editorSettings: defaultEditorSettings,
      settingsOpen: false,

      setTheme: (theme) => {
        set({ theme });
        // Apply theme class to document
        document.documentElement.classList.remove('dark', 'light', 'susa-midnight', 'susa-ocean');
        document.documentElement.classList.add(theme);
      },

      setEditorSettings: (settings) =>
        set((state) => ({
          editorSettings: { ...state.editorSettings, ...settings },
        })),

      toggleSettings: () => set((state) => ({ settingsOpen: !state.settingsOpen })),
      closeSettings: () => set({ settingsOpen: false }),
    }),
    {
      name: 'susa-settings',
      partialize: (state) => ({
        theme: state.theme,
        editorSettings: state.editorSettings,
      }),
      onRehydrateStorage: () => (state) => {
        // Apply theme on load
        if (state?.theme) {
          document.documentElement.classList.remove('dark', 'light', 'susa-midnight', 'susa-ocean');
          document.documentElement.classList.add(state.theme);
        }
      },
    }
  )
);

// Font family options
export const fontFamilyOptions = [
  { value: "'JetBrains Mono', 'Fira Code', Consolas, monospace", label: 'JetBrains Mono' },
  { value: "'Fira Code', Consolas, monospace", label: 'Fira Code' },
  { value: "'Cascadia Code', Consolas, monospace", label: 'Cascadia Code' },
  { value: "'Source Code Pro', Consolas, monospace", label: 'Source Code Pro' },
  { value: "Consolas, 'Courier New', monospace", label: 'Consolas' },
  { value: "'Monaco', monospace", label: 'Monaco' },
];

// Theme options with descriptions
export const themeOptions: { value: Theme; label: string; description: string }[] = [
  { value: 'dark', label: 'Dark', description: 'Default dark theme' },
  { value: 'light', label: 'Light', description: 'Clean light theme' },
  { value: 'susa-midnight', label: 'SUSA Midnight', description: 'Deep purple accents' },
  { value: 'susa-ocean', label: 'SUSA Ocean', description: 'Ocean blue tones' },
];
