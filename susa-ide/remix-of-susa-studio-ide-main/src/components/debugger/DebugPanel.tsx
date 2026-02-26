import React from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  SkipForward, 
  ArrowDown,
  ArrowUp,
  Trash2,
  Circle,
  ChevronRight,
  ChevronDown,
  Bug
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebuggerStore, WatchVariable, StackFrame } from '@/store/debuggerStore';
import { useEditorStore } from '@/store/editorStore';
import { runSUSADebug } from '@/language/debugInterpreter';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export const DebugPanel: React.FC = () => {
  const {
    state,
    isPanelOpen,
    togglePanel,
    currentLine,
    breakpoints,
    variables,
    callStack,
    continueExecution,
    stepOver,
    stepInto,
    stepOut,
    stopDebug,
    clearBreakpoints,
    toggleBreakpoint,
  } = useDebuggerStore();

  const { currentContent, addOutput, clearOutput, setActiveBottomTab } = useEditorStore();

  const handleStartDebug = async () => {
    clearOutput();
    setActiveBottomTab('output');
    
    addOutput({
      type: 'info',
      content: '🔍 Starting debug session...',
      timestamp: new Date(),
    });

    const result = await runSUSADebug(currentContent, (output) => {
      addOutput({ ...output, timestamp: new Date() });
    });

    if (result.success) {
      addOutput({
        type: 'info',
        content: '✓ Debug session completed',
        timestamp: new Date(),
      });
    } else {
      addOutput({
        type: 'error',
        content: `✗ ${result.error || 'Debug session failed'}`,
        timestamp: new Date(),
      });
    }
  };

  const isDebugging = state !== 'idle';
  const isPaused = state === 'paused';

  return (
    <div className="h-full flex flex-col bg-panel-bg border-l border-panel-border">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-panel-border bg-panel-header">
        <div className="flex items-center gap-2">
          <Bug className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Debugger</span>
          <span className={cn(
            "px-2 py-0.5 text-xs rounded-full",
            state === 'idle' && "bg-muted text-muted-foreground",
            state === 'running' && "bg-status-success/20 text-status-success",
            state === 'paused' && "bg-status-warning/20 text-status-warning",
            state === 'stepping' && "bg-status-info/20 text-status-info",
          )}>
            {state === 'idle' ? 'Ready' : state.charAt(0).toUpperCase() + state.slice(1)}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-panel-border">
        {!isDebugging ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleStartDebug}
                className="h-7 px-2 text-status-success hover:text-status-success hover:bg-status-success/10"
              >
                <Play className="w-4 h-4 mr-1" />
                Debug
              </Button>
            </TooltipTrigger>
            <TooltipContent>Start debugging (F5)</TooltipContent>
          </Tooltip>
        ) : (
          <>
            <DebugButton
              icon={isPaused ? Play : Pause}
              tooltip={isPaused ? "Continue (F5)" : "Pause"}
              onClick={continueExecution}
              disabled={!isPaused}
              variant="success"
            />
            <DebugButton
              icon={Square}
              tooltip="Stop (Shift+F5)"
              onClick={stopDebug}
              variant="destructive"
            />
            <div className="w-px h-5 bg-panel-border mx-1" />
            <DebugButton
              icon={SkipForward}
              tooltip="Step Over (F10)"
              onClick={stepOver}
              disabled={!isPaused}
            />
            <DebugButton
              icon={ArrowDown}
              tooltip="Step Into (F11)"
              onClick={stepInto}
              disabled={!isPaused}
            />
            <DebugButton
              icon={ArrowUp}
              tooltip="Step Out (Shift+F11)"
              onClick={stepOut}
              disabled={!isPaused}
            />
          </>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Breakpoints Section */}
        <DebugSection title="Breakpoints" defaultOpen>
          <div className="space-y-1">
            {breakpoints.size === 0 ? (
              <p className="text-xs text-muted-foreground px-3 py-2">
                Click in the editor gutter to add breakpoints
              </p>
            ) : (
              <>
                <div className="flex items-center justify-between px-3 py-1">
                  <span className="text-xs text-muted-foreground">
                    {breakpoints.size} breakpoint{breakpoints.size !== 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={clearBreakpoints}
                    className="text-xs text-destructive hover:underline"
                  >
                    Clear all
                  </button>
                </div>
                {Array.from(breakpoints).sort((a, b) => a - b).map((line) => (
                  <div
                    key={line}
                    className="flex items-center gap-2 px-3 py-1 hover:bg-secondary/50 cursor-pointer group"
                    onClick={() => toggleBreakpoint(line)}
                  >
                    <Circle className="w-3 h-3 fill-status-error text-status-error" />
                    <span className="text-sm flex-1">Line {line}</span>
                    <Trash2 className="w-3 h-3 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive" />
                  </div>
                ))}
              </>
            )}
          </div>
        </DebugSection>

        {/* Variables Section */}
        <DebugSection title="Variables" defaultOpen>
          {variables.size === 0 ? (
            <p className="text-xs text-muted-foreground px-3 py-2">
              {isDebugging ? 'No variables in scope' : 'Start debugging to inspect variables'}
            </p>
          ) : (
            <div className="space-y-0.5">
              {Array.from(variables.values()).map((variable) => (
                <VariableItem key={variable.name} variable={variable} />
              ))}
            </div>
          )}
        </DebugSection>

        {/* Call Stack Section */}
        <DebugSection title="Call Stack" defaultOpen>
          {callStack.length === 0 ? (
            <p className="text-xs text-muted-foreground px-3 py-2">
              {isDebugging ? 'No call stack' : 'Start debugging to see call stack'}
            </p>
          ) : (
            <div className="space-y-0.5">
              {callStack.map((frame, index) => (
                <StackFrameItem 
                  key={index} 
                  frame={frame} 
                  isActive={index === callStack.length - 1}
                  isCurrent={frame.line === currentLine}
                />
              ))}
            </div>
          )}
        </DebugSection>
      </div>

      {/* Current Line Indicator */}
      {currentLine && (
        <div className="px-3 py-2 border-t border-panel-border bg-status-warning/10">
          <span className="text-xs text-status-warning">
            ▶ Paused at line {currentLine}
          </span>
        </div>
      )}
    </div>
  );
};

interface DebugButtonProps {
  icon: React.ElementType;
  tooltip: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'success' | 'destructive';
}

const DebugButton: React.FC<DebugButtonProps> = ({
  icon: Icon,
  tooltip,
  onClick,
  disabled,
  variant = 'default',
}) => {
  const variantClasses = {
    default: 'hover:bg-secondary',
    success: 'text-status-success hover:bg-status-success/10',
    destructive: 'text-status-error hover:bg-status-error/10',
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          disabled={disabled}
          className={cn(
            'p-1.5 rounded transition-colors',
            variantClasses[variant],
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <Icon className="w-4 h-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
};

interface DebugSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const DebugSection: React.FC<DebugSectionProps> = ({ title, defaultOpen = false, children }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
        {isOpen ? (
          <ChevronDown className="w-3 h-3" />
        ) : (
          <ChevronRight className="w-3 h-3" />
        )}
        {title}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </CollapsibleContent>
    </Collapsible>
  );
};

interface VariableItemProps {
  variable: WatchVariable;
}

const VariableItem: React.FC<VariableItemProps> = ({ variable }) => {
  const formatValue = (value: unknown): string => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return `"${value}"`;
    if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
    return String(value);
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'number': return 'text-syntax-number';
      case 'string': return 'text-syntax-string';
      case 'boolean': return 'text-syntax-constant';
      case 'null':
      case 'undefined': return 'text-muted-foreground';
      default: return 'text-foreground';
    }
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1 hover:bg-secondary/50 font-mono text-sm">
      <span className="text-syntax-variable">{variable.name}</span>
      <span className="text-muted-foreground">=</span>
      <span className={getTypeColor(variable.type)}>
        {formatValue(variable.value)}
      </span>
      <span className="text-xs text-muted-foreground ml-auto">
        {variable.type}
      </span>
    </div>
  );
};

interface StackFrameItemProps {
  frame: StackFrame;
  isActive: boolean;
  isCurrent: boolean;
}

const StackFrameItem: React.FC<StackFrameItemProps> = ({ frame, isActive, isCurrent }) => {
  return (
    <div className={cn(
      'flex items-center gap-2 px-3 py-1.5 text-sm cursor-pointer transition-colors',
      isActive && 'bg-primary/10',
      isCurrent && 'bg-status-warning/10',
      !isActive && !isCurrent && 'hover:bg-secondary/50'
    )}>
      {isCurrent && <span className="text-status-warning">▶</span>}
      <span className={cn(
        'font-mono',
        isActive ? 'text-foreground' : 'text-muted-foreground'
      )}>
        {frame.name}
      </span>
      <span className="text-xs text-muted-foreground ml-auto">
        :{frame.line}
      </span>
    </div>
  );
};
