import React from 'react';
import { AlertCircle, AlertTriangle, Info, Terminal, FileWarning, ScrollText, Bug } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditorStore } from '@/store/editorStore';
import { AdvancedConsole } from '@/components/console/AdvancedConsole';
import { AdvancedDebugger } from '@/components/debugger/AdvancedDebugger';
import { runtimeEngine } from '@/core/runtime/RuntimeEngine';
import { debuggerEngine } from '@/core/debugger/DebuggerEngine';
import { cn } from '@/lib/utils';

export const BottomPanel: React.FC = () => {
  const {
    activeBottomTab,
    setActiveBottomTab,
    output,
    problems,
    currentContent,
    activeTabId,
    tabs
  } = useEditorStore();

  const debugState = debuggerEngine.getState();

  const tabs_config = [
    { id: 'output' as const, label: 'Output', icon: Terminal, count: output.length },
    { id: 'console' as const, label: 'Console', icon: ScrollText, count: 0 },
    { id: 'debugger' as const, label: 'Debugger', icon: Bug, count: debugState.errors.length },
    { id: 'problems' as const, label: 'Problems', icon: FileWarning, count: problems.length },
  ];

  // Handle console code execution
  const handleConsoleExecute = async (code: string) => {
    if (!code.trim()) return;

    try {
      // Add the command to output first
      useEditorStore.getState().addOutput({
        type: 'info',
        content: `> ${code}`,
        timestamp: new Date(),
      });

      // Execute the code using runtime engine
      const result = await runtimeEngine.executeCode(code, {
        timeout: 10000,
        debugMode: false
      });

      // Add the result to output
      if (result.success) {
        if (result.output) {
          useEditorStore.getState().addOutput({
            type: 'output',
            content: result.output,
            timestamp: new Date(),
          });
        }
      } else {
        useEditorStore.getState().addOutput({
          type: 'error',
          content: result.error || 'Execution failed',
          timestamp: new Date(),
        });
      }
    } catch (error) {
      useEditorStore.getState().addOutput({
        type: 'error',
        content: `Console execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
      });
      console.error('Console execution error:', error);
    }
  };

  // Handle breakpoint toggle
  const handleBreakpointToggle = (line: number) => {
    // This would typically update the editor to show/hide breakpoint indicators
    console.log('Breakpoint toggled at line:', line);
  };

  // Handle step to line
  const handleStepToLine = (line: number) => {
    // This would typically scroll the editor to the specified line
    console.log('Step to line:', line);
  };

  // Get current source code for debugger
  const getCurrentSourceCode = () => {
    if (activeTabId && tabs.length > 0) {
      const activeTab = tabs.find(tab => tab.id === activeTabId);
      return activeTab?.content || currentContent;
    }
    return currentContent;
  };

  return (
    <div className="h-full bg-panel-bg flex flex-col">
      {/* Tabs */}
      <div className="flex items-center border-b border-panel-border bg-panel-header px-2">
        {tabs_config.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveBottomTab(tab.id)}
            className={cn(
              'panel-tab flex items-center gap-1.5',
              activeBottomTab === tab.id && 'active'
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
            {tab.count > 0 && (
              <span className={cn(
                "ml-1 px-1.5 py-0.5 text-[10px] rounded-full",
                tab.id === 'debugger' && tab.count > 0 ? 'bg-red-500 text-white' : 'bg-secondary'
              )}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeBottomTab === 'output' && (
            <OutputPanel key="output" />
          )}
          {activeBottomTab === 'console' && (
            <motion.div
              key="console"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <AdvancedConsole 
                onExecute={handleConsoleExecute}
                isExecuting={runtimeEngine.isExecuting()}
              />
            </motion.div>
          )}
          {activeBottomTab === 'debugger' && (
            <motion.div
              key="debugger"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <AdvancedDebugger
                onBreakpointToggle={handleBreakpointToggle}
                onStepToLine={handleStepToLine}
                sourceCode={getCurrentSourceCode()}
              />
            </motion.div>
          )}
          {activeBottomTab === 'problems' && (
            <ProblemsPanel key="problems" />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const OutputPanel: React.FC = () => {
  const { output, clearOutput } = useEditorStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full overflow-y-auto p-3 font-mono text-sm"
    >
      {output.length === 0 ? (
        <div className="text-muted-foreground text-center py-8">
          No output yet. Run a program to see results.
        </div>
      ) : (
        <div className="space-y-1">
          {output.map((line, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-2 py-1 px-2 rounded hover:bg-muted/50',
                line.type === 'error' && 'text-red-400',
                line.type === 'info' && 'text-blue-400',
                line.type === 'output' && 'text-foreground'
              )}
            >
              <span className="text-xs opacity-60 min-w-[60px]">
                {line.timestamp.toLocaleTimeString()}
              </span>
              <span className="text-xs">
                {line.type === 'error' && <AlertCircle className="w-3 h-3" />}
                {line.type === 'info' && <Info className="w-3 h-3" />}
                {line.type === 'output' && <Terminal className="w-3 h-3" />}
              </span>
              <span className="flex-1 whitespace-pre-wrap break-words">
                {line.content}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const ProblemsPanel: React.FC = () => {
  const { problems } = useEditorStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full overflow-y-auto p-3"
    >
      {problems.length === 0 ? (
        <div className="text-muted-foreground text-center py-8">
          No problems detected. Great job!
        </div>
      ) : (
        <div className="space-y-2">
          {problems.map((problem, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-3 p-3 rounded border-l-4',
                problem.severity === 'error' && 'border-red-500 bg-red-500/10',
                problem.severity === 'warning' && 'border-yellow-500 bg-yellow-500/10',
                problem.severity === 'info' && 'border-blue-500 bg-blue-500/10'
              )}
            >
              <div className="flex-shrink-0 mt-0.5">
                {problem.severity === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                {problem.severity === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                {problem.severity === 'info' && <Info className="w-4 h-4 text-blue-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground">
                  {problem.message}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Line {problem.line}, Column {problem.column}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};