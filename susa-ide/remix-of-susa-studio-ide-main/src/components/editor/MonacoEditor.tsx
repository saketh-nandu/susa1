import React, { useRef, useEffect, useCallback } from 'react';
import Editor, { OnMount, OnChange } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { useEditorStore } from '@/store/editorStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useDebuggerStore } from '@/store/debuggerStore';
import { registerSUSALanguage, SUSA_LANGUAGE_ID, getMonacoTheme } from '@/language/monacoConfig';

interface MonacoEditorProps {
  className?: string;
}

export const MonacoEditor: React.FC<MonacoEditorProps> = ({ className }) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof monaco | null>(null);
  
  const {
    currentContent,
    activeTabId,
    updateTabContent,
    setCursorPosition,
    setProblems,
  } = useEditorStore();

  const { theme, editorSettings } = useSettingsStore();
  
  const { 
    breakpoints, 
    toggleBreakpoint, 
    currentLine: debugCurrentLine,
    state: debugState,
  } = useDebuggerStore();

  // Decoration IDs for line highlighting
  const decorationsRef = useRef<string[]>([]);

  const handleEditorMount: OnMount = useCallback((editor, monacoInstance) => {
    editorRef.current = editor;
    monacoRef.current = monacoInstance;

    // Register SUSA language
    registerSUSALanguage(monacoInstance, theme);

    // Set theme
    monacoInstance.editor.setTheme(getMonacoTheme(theme));

    // Configure editor
    editor.updateOptions({
      fontSize: editorSettings.fontSize,
      fontFamily: editorSettings.fontFamily,
      lineHeight: editorSettings.lineHeight,
      tabSize: editorSettings.tabSize,
      wordWrap: editorSettings.wordWrap,
      minimap: { enabled: false }, // Disable for performance
      renderWhitespace: 'none', // Disable for performance
      cursorBlinking: 'solid', // Reduce animation
      bracketPairColorization: { enabled: false }, // Disable for performance
      scrollBeyondLastLine: false,
      renderLineHighlight: 'line',
      cursorSmoothCaretAnimation: 'off',
      smoothScrolling: false,
      guides: {
        bracketPairs: false, // Disable for performance
        indentation: true,
      },
      padding: { top: 8, bottom: 8 },
      folding: true,
      foldingHighlight: false, // Disable for performance
      lineNumbers: 'on',
      glyphMargin: true,
      // Performance optimizations
      quickSuggestions: false,
      parameterHints: { enabled: false },
      suggestOnTriggerCharacters: false,
      acceptSuggestionOnEnter: 'off',
      tabCompletion: 'off',
      wordBasedSuggestions: 'off',
      occurrencesHighlight: 'off',
      selectionHighlight: false,
      codeLens: false,
      colorDecorators: false,
      lightbulb: { enabled: 'off' },
      links: false,
    });

    // Handle cursor position changes
    editor.onDidChangeCursorPosition((e) => {
      setCursorPosition({
        line: e.position.lineNumber,
        column: e.position.column,
      });
    });

    // Handle glyph margin clicks for breakpoints
    editor.onMouseDown((e) => {
      if (e.target.type === monacoInstance.editor.MouseTargetType.GUTTER_GLYPH_MARGIN) {
        const lineNumber = e.target.position?.lineNumber;
        if (lineNumber) {
          toggleBreakpoint(lineNumber);
        }
      }
    });

    // Remove validation for better performance
    const model = editor.getModel();
    if (model) {
      // Clear any existing markers
      monacoInstance.editor.setModelMarkers(model, 'susa', []);
    }
  }, [setCursorPosition, toggleBreakpoint, theme, editorSettings]);

  // Update editor options when settings change
  useEffect(() => {
    if (!editorRef.current) return;

    editorRef.current.updateOptions({
      fontSize: editorSettings.fontSize,
      fontFamily: editorSettings.fontFamily,
      lineHeight: editorSettings.lineHeight,
      tabSize: editorSettings.tabSize,
      wordWrap: editorSettings.wordWrap,
      minimap: { enabled: editorSettings.minimap },
      renderWhitespace: editorSettings.renderWhitespace,
      cursorBlinking: editorSettings.cursorBlinking,
      bracketPairColorization: { enabled: editorSettings.bracketPairColorization },
    });
  }, [editorSettings]);

  // Update theme when it changes
  useEffect(() => {
    if (!monacoRef.current) return;
    monacoRef.current.editor.setTheme(getMonacoTheme(theme));
  }, [theme]);

  const validateContent = useCallback((content: string) => {
    // Temporarily disable validation to remove red/yellow lines
    // TODO: Implement proper SUSA validation
    setProblems([]);
  }, [setProblems]);

  const handleChange: OnChange = useCallback((value) => {
    if (activeTabId && value !== undefined) {
      updateTabContent(activeTabId, value);
    }
  }, [activeTabId, updateTabContent]);

  // Update decorations for breakpoints and current executing line
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;

    const newDecorations: monaco.editor.IModelDeltaDecoration[] = [];

    // Breakpoint decorations
    breakpoints.forEach((line) => {
      newDecorations.push({
        range: new monacoRef.current!.Range(line, 1, line, 1),
        options: {
          isWholeLine: false,
          glyphMarginClassName: 'breakpoint-glyph',
          glyphMarginHoverMessage: { value: 'Breakpoint' },
        },
      });
    });

    // Current executing line decoration (from debugger)
    if (debugCurrentLine !== null && debugState !== 'idle') {
      newDecorations.push({
        range: new monacoRef.current!.Range(debugCurrentLine, 1, debugCurrentLine, 1),
        options: {
          isWholeLine: true,
          className: 'executing-line',
          glyphMarginClassName: 'executing-line-glyph',
        },
      });

      // Reveal the line in the editor
      editorRef.current.revealLineInCenter(debugCurrentLine);
    }

    decorationsRef.current = editorRef.current.deltaDecorations(
      decorationsRef.current,
      newDecorations
    );
  }, [breakpoints, debugCurrentLine, debugState]);

  return (
    <div className={`relative h-full ${className}`}>
      <style>{`
        .breakpoint-glyph {
          background-color: hsl(0 72% 51%);
          border-radius: 50%;
          width: 10px !important;
          height: 10px !important;
          margin-left: 5px;
          margin-top: 6px;
        }
        .executing-line {
          background-color: hsl(35 95% 58% / 0.2) !important;
          border-left: 3px solid hsl(35 95% 58%) !important;
        }
        .executing-line-glyph {
          width: 0 !important;
          height: 0 !important;
          border-left: 8px solid hsl(35 95% 58%) !important;
          border-top: 5px solid transparent !important;
          border-bottom: 5px solid transparent !important;
          margin-left: 3px !important;
          margin-top: 5px !important;
        }
      `}</style>
      <Editor
        height="100%"
        defaultLanguage={SUSA_LANGUAGE_ID}
        language={SUSA_LANGUAGE_ID}
        value={currentContent}
        onChange={handleChange}
        onMount={handleEditorMount}
        theme={getMonacoTheme(theme)}
        loading={<div />} // Remove loading screen
        options={{
          automaticLayout: true,
          // Performance optimizations
          scrollBeyondLastLine: false,
          renderLineHighlight: 'line',
          cursorSmoothCaretAnimation: 'off', // Disable for better performance
          smoothScrolling: false, // Disable for better performance
          minimap: { enabled: false }, // Disable minimap for better performance
          wordWrap: 'on',
          lineNumbers: 'on',
          glyphMargin: true,
          folding: true,
          // Reduce validation frequency
          quickSuggestions: false,
          parameterHints: { enabled: false },
          suggestOnTriggerCharacters: false,
          acceptSuggestionOnEnter: 'off',
          tabCompletion: 'off',
          wordBasedSuggestions: 'off',
          // Improve rendering performance
          disableLayerHinting: true,
          fontLigatures: false,
        }}
      />
    </div>
  );
};
