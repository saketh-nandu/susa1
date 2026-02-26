import React from 'react';
import { useEditorStore } from '@/store/editorStore';
import { cn } from '@/lib/utils';

export const StatusBar: React.FC = () => {
  const { 
    cursorPosition, 
    isRunning, 
    problems,
    activeTabId,
    tabs 
  } = useEditorStore();

  const activeTab = tabs.find(t => t.id === activeTabId);
  const errorCount = problems.filter(p => p.severity === 'error').length;
  const warningCount = problems.filter(p => p.severity === 'warning').length;

  return (
    <div className="status-bar">
      <div className="flex items-center gap-4 flex-1">
        {/* Left side */}
        <div className="flex items-center gap-1">
          <span className={cn(
            "w-2 h-2 rounded-full",
            isRunning ? "bg-status-warning animate-pulse" : "bg-status-success"
          )} />
          <span>{isRunning ? 'Running' : 'Ready'}</span>
        </div>

        {errorCount > 0 && (
          <div className="flex items-center gap-1 text-status-error">
            <span>⊘</span>
            <span>{errorCount}</span>
          </div>
        )}

        {warningCount > 0 && (
          <div className="flex items-center gap-1 text-status-warning">
            <span>⚠</span>
            <span>{warningCount}</span>
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {activeTab && (
          <span className="text-primary-foreground/70">{activeTab.name}</span>
        )}
        <span>
          Ln {cursorPosition.line}, Col {cursorPosition.column}
        </span>
        <span>SUSA</span>
        <span>UTF-8</span>
      </div>
    </div>
  );
};
