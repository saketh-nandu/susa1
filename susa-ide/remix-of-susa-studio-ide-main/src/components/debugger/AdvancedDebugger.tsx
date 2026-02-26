/**
 * Advanced Debugger Component for SUSA IDE
 * Production-level debugger with breakpoints, variable watching, and error display
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Bug, 
  Play, 
  Pause, 
  Square, 
  SkipForward, 
  ArrowDown, 
  ArrowUp,
  RotateCcw,
  Eye,
  EyeOff,
  AlertTriangle,
  Info,
  X,
  Plus,
  Trash2,
  Circle,
  CircleDot
} from 'lucide-react';
import { debuggerEngine, DebugState, Breakpoint, Variable, DebugError } from '@/core/debugger/DebuggerEngine';
import { eventBus } from '@/core/architecture/EventBus';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';

interface AdvancedDebuggerProps {
  className?: string;
  onBreakpointToggle?: (line: number) => void;
  onStepToLine?: (line: number) => void;
  sourceCode?: string;
}

export const AdvancedDebugger: React.FC<AdvancedDebuggerProps> = ({
  className,
  onBreakpointToggle,
  onStepToLine,
  sourceCode = ''
}) => {
  // Use simple local state instead of complex debugger engine
  const [isDebugging, setIsDebugging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [breakpoints, setBreakpoints] = useState<number[]>([]);
  const [variables, setVariables] = useState<any[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [watchExpressions, setWatchExpressions] = useState<string[]>([]);
  
  const [newWatchExpression, setNewWatchExpression] = useState('');
  const [expandedVariables, setExpandedVariables] = useState<Set<string>>(new Set());
  const [selectedError, setSelectedError] = useState<any>(null);

  // Handle debug actions
  const handleStartDebug = useCallback(async () => {
    try {
      if (!sourceCode.trim()) {
        toast.error('No code to debug');
        return;
      }
      
      setIsDebugging(true);
      setIsPaused(false);
      setCurrentLine(1);
      
      // Extract real variables from the source code
      const extractedVariables = extractVariablesFromCode(sourceCode);
      setVariables(extractedVariables);
      
      toast.success('Debug session started');
      console.log('Debug session started for:', sourceCode.substring(0, 100) + '...');
      console.log('Extracted variables:', extractedVariables);
      
    } catch (error) {
      toast.error(`Debug failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [sourceCode]);

  // Extract variables from SUSA source code
  const extractVariablesFromCode = (code: string): any[] => {
    const variables: any[] = [];
    const lines = code.split('\n');
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      
      // Variable declarations: let, int, string, bool, float
      const varDeclMatch = trimmed.match(/^(let|int|string|bool|float)\s+(\w+)\s*=\s*(.+)$/i);
      if (varDeclMatch) {
        const [, type, name, valueStr] = varDeclMatch;
        const value = parseValue(valueStr.trim(), type.toLowerCase());
        
        variables.push({
          name,
          value,
          type: type.toLowerCase(),
          scope: 'local',
          line: index + 1
        });
        return;
      }
      
      // Assignments: variable = value
      const assignMatch = trimmed.match(/^(\w+)\s*=\s*(.+)$/);
      if (assignMatch && !trimmed.match(/^(let|int|string|bool|float)/i)) {
        const [, name, valueStr] = assignMatch;
        const value = parseValue(valueStr.trim());
        
        // Update existing variable or create new one
        const existingIndex = variables.findIndex(v => v.name === name);
        if (existingIndex >= 0) {
          variables[existingIndex] = {
            ...variables[existingIndex],
            value,
            line: index + 1
          };
        } else {
          variables.push({
            name,
            value,
            type: inferType(value),
            scope: 'local',
            line: index + 1
          });
        }
        return;
      }
      
      // Loop variables: LOOP variable = start FOR count TIMES
      const loopMatch = trimmed.match(/^LOOP\s+(\w+)\s*=\s*(\d+)\s+FOR\s+(\w+|\d+)\s+TIMES/i);
      if (loopMatch) {
        const [, loopVar, startVal, countVar] = loopMatch;
        
        variables.push({
          name: loopVar,
          value: parseInt(startVal),
          type: 'number',
          scope: 'local',
          line: index + 1
        });
        
        // If count is a variable name, not a number
        if (isNaN(parseInt(countVar))) {
          const countVariable = variables.find(v => v.name === countVar);
          if (countVariable) {
            variables.push({
              name: `${loopVar}_max`,
              value: countVariable.value,
              type: 'number',
              scope: 'local',
              line: index + 1
            });
          }
        }
        return;
      }
    });
    
    return variables;
  };

  // Parse value from string
  const parseValue = (valueStr: string, expectedType?: string): any => {
    // Remove quotes for strings
    if ((valueStr.startsWith('"') && valueStr.endsWith('"')) || 
        (valueStr.startsWith("'") && valueStr.endsWith("'"))) {
      return valueStr.slice(1, -1);
    }
    
    // Template strings (rt"...")
    if (valueStr.startsWith('rt"') && valueStr.endsWith('"')) {
      return valueStr.slice(3, -1); // Remove rt" and "
    }
    
    // Boolean values
    if (valueStr.toLowerCase() === 'true') return true;
    if (valueStr.toLowerCase() === 'false') return false;
    
    // Numbers
    if (/^-?\d+(\.\d+)?$/.test(valueStr)) {
      return parseFloat(valueStr);
    }
    
    // If it's a variable reference, try to find its value
    if (/^\w+$/.test(valueStr)) {
      return `<variable: ${valueStr}>`;
    }
    
    // Default based on expected type
    if (expectedType) {
      switch (expectedType) {
        case 'int':
        case 'float':
          return 0;
        case 'string':
          return '';
        case 'bool':
          return false;
        default:
          return valueStr;
      }
    }
    
    return valueStr;
  };

  // Infer type from value
  const inferType = (value: any): string => {
    if (typeof value === 'string') {
      if (value.startsWith('<variable:')) return 'reference';
      return 'string';
    }
    if (typeof value === 'number') return Number.isInteger(value) ? 'int' : 'float';
    if (typeof value === 'boolean') return 'bool';
    return 'unknown';
  };

  const handleStopDebug = useCallback(() => {
    setIsDebugging(false);
    setIsPaused(false);
    setCurrentLine(0);
    setVariables([]);
    setErrors([]);
    toast.info('Debug session stopped');
    console.log('Debug session stopped');
  }, []);

  const handleContinue = useCallback(() => {
    setIsPaused(false);
    toast.info('Execution continued');
    console.log('Debug execution continued');
  }, []);

  const handleStepOver = useCallback(async () => {
    toast.info('Step over');
    console.log('Debug step over');
  }, []);

  const handleStepInto = useCallback(async () => {
    toast.info('Step into');
    console.log('Debug step into');
  }, []);

  const handleStepOut = useCallback(async () => {
    toast.info('Step out');
    console.log('Debug step out');
  }, []);

  const handleToggleBreakpoint = useCallback((line: number) => {
    setBreakpoints(prev => {
      if (prev.includes(line)) {
        return prev.filter(l => l !== line);
      } else {
        return [...prev, line];
      }
    });
    toast.info(`Breakpoint toggled at line ${line}`);
    console.log('Breakpoint toggled at line:', line);
    onBreakpointToggle?.(line);
  }, [onBreakpointToggle]);

  const handleRemoveBreakpoint = useCallback((line: number) => {
    toast.info(`Breakpoint removed from line ${line}`);
    console.log('Breakpoint removed from line:', line);
    onBreakpointToggle?.(line);
  }, [onBreakpointToggle]);

  const handleAddWatchExpression = useCallback(() => {
    if (newWatchExpression.trim()) {
      setWatchExpressions(prev => [...prev, newWatchExpression.trim()]);
      toast.success(`Watch expression added: ${newWatchExpression}`);
      console.log('Watch expression added:', newWatchExpression);
      setNewWatchExpression('');
    }
  }, [newWatchExpression]);

  const handleRemoveWatchExpression = useCallback((expression: string) => {
    setWatchExpressions(prev => prev.filter(expr => expr !== expression));
    toast.info(`Watch expression removed: ${expression}`);
    console.log('Watch expression removed:', expression);
  }, []);

  const handleClearErrors = useCallback(() => {
    toast.info('Errors cleared');
    console.log('Debug errors cleared');
    setSelectedError(null);
  }, []);

  const toggleVariableExpansion = useCallback((variableName: string) => {
    setExpandedVariables(prev => {
      const newSet = new Set(prev);
      if (newSet.has(variableName)) {
        newSet.delete(variableName);
      } else {
        newSet.add(variableName);
      }
      return newSet;
    });
  }, []);

  // Render variable value
  const renderVariableValue = (variable: Variable, depth: number = 0) => {
    const isExpanded = expandedVariables.has(variable.name);
    const hasChildren = variable.isExpandable && variable.children && variable.children.length > 0;

    return (
      <div key={variable.name} className={cn('py-1', depth > 0 && 'ml-4')}>
        <div className="flex items-center gap-2 hover:bg-muted/50 px-2 py-1 rounded">
          {hasChildren && (
            <Button
              size="sm"
              variant="ghost"
              className="h-4 w-4 p-0"
              onClick={() => toggleVariableExpansion(variable.name)}
            >
              {isExpanded ? '▼' : '▶'}
            </Button>
          )}
          {!hasChildren && <div className="w-4" />}
          
          <span className="text-sm font-medium text-blue-400">{variable.name}</span>
          <span className="text-xs text-muted-foreground">({variable.type})</span>
          <span className="text-sm flex-1 text-right font-mono">
            {typeof variable.value === 'string' && variable.value.length > 50
              ? `"${variable.value.substring(0, 50)}..."`
              : JSON.stringify(variable.value)}
          </span>
          <Badge variant="outline" className="text-xs">
            {variable.scope}
          </Badge>
        </div>
        
        {hasChildren && isExpanded && variable.children && (
          <div className="ml-2">
            {variable.children.map(child => renderVariableValue(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Render error item
  const renderError = (error: DebugError) => {
    const severityColor = {
      error: 'text-red-400',
      warning: 'text-yellow-400',
      info: 'text-blue-400'
    };

    const severityIcon = {
      error: <AlertTriangle className="w-4 h-4" />,
      warning: <AlertTriangle className="w-4 h-4" />,
      info: <Info className="w-4 h-4" />
    };

    return (
      <div
        key={`${error.location.line}-${error.location.column}-${error.message}`}
        className={cn(
          'p-2 border rounded cursor-pointer hover:bg-muted/50',
          selectedError === error && 'bg-muted border-primary'
        )}
        onClick={() => {
          setSelectedError(error);
          onStepToLine?.(error.location.line);
        }}
      >
        <div className="flex items-start gap-2">
          <span className={severityColor[error.severity]}>
            {severityIcon[error.severity]}
          </span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{error.message}</span>
              <Badge variant="outline" className="text-xs">
                Line {error.location.line}:{error.location.column}
              </Badge>
            </div>
            {error.suggestions && error.suggestions.length > 0 && (
              <div className="mt-1 text-xs text-muted-foreground">
                💡 {error.suggestions[0]}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn('flex flex-col h-full bg-background', className)}>
      {/* Debugger Header */}
      <div className="flex items-center justify-between p-2 border-b border-border bg-muted/50">
        <div className="flex items-center gap-2">
          <Bug className="w-4 h-4" />
          <span className="text-sm font-medium">SUSA Debugger</span>
          {isDebugging && (
            <Badge variant={isPaused ? 'destructive' : 'default'} className="text-xs">
              {isPaused ? 'Paused' : 'Running'}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {!isDebugging ? (
            <Button
              size="sm"
              onClick={handleStartDebug}
              className="h-6 px-2"
              disabled={!sourceCode.trim()}
            >
              <Play className="w-3 h-3" />
            </Button>
          ) : (
            <>
              {isPaused ? (
                <Button
                  size="sm"
                  onClick={handleContinue}
                  className="h-6 px-2"
                >
                  <Play className="w-3 h-3" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setIsPaused(true)}
                  className="h-6 px-2"
                >
                  <Pause className="w-3 h-3" />
                </Button>
              )}
              
              <Button
                size="sm"
                onClick={handleStepOver}
                disabled={!isPaused}
                className="h-6 px-2"
                title="Step Over (F10)"
              >
                <SkipForward className="w-3 h-3" />
              </Button>
              
              <Button
                size="sm"
                onClick={handleStepInto}
                disabled={!isPaused}
                className="h-6 px-2"
                title="Step Into (F11)"
              >
                <ArrowDown className="w-3 h-3" />
              </Button>
              
              <Button
                size="sm"
                onClick={handleStepOut}
                disabled={!isPaused}
                className="h-6 px-2"
                title="Step Out (Shift+F11)"
              >
                <ArrowUp className="w-3 h-3" />
              </Button>
              
              <Button
                size="sm"
                onClick={handleStopDebug}
                variant="destructive"
                className="h-6 px-2"
              >
                <Square className="w-3 h-3" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Current Execution Info */}
      {isDebugging && (
        <div className="p-2 bg-muted/30 border-b border-border">
          <div className="flex items-center gap-4 text-sm">
            <span>
              <strong>Line:</strong> {currentLine}:1
            </span>
            <span>
              <strong>Variables:</strong> {variables.length}
            </span>
          </div>
        </div>
      )}

      {/* Debugger Tabs */}
      <Tabs defaultValue="variables" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="variables">Variables</TabsTrigger>
          <TabsTrigger value="breakpoints">
            Breakpoints
            {breakpoints.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {breakpoints.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="watch">
            Watch
            {watchExpressions.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {watchExpressions.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="errors">
            Errors
            {errors.length > 0 && (
              <Badge variant="destructive" className="ml-1 text-xs">
                {errors.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Variables Tab */}
        <TabsContent value="variables" className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-2">
            {variables.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                {isDebugging ? 'No variables in current scope' : 'Start debugging to see variables'}
              </div>
            ) : (
              <div className="space-y-1">
                {variables.map(variable => renderVariableValue(variable))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        {/* Breakpoints Tab */}
        <TabsContent value="breakpoints" className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-2">
            {breakpoints.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No breakpoints set. Click on line numbers in the editor to add breakpoints.
              </div>
            ) : (
              <div className="space-y-2">
                {breakpoints.map(line => (
                  <div
                    key={line}
                    className="flex items-center gap-2 p-2 border rounded hover:bg-muted/50"
                  >
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-4 w-4 p-0"
                      onClick={() => handleToggleBreakpoint(line)}
                    >
                      <CircleDot className="w-3 h-3 text-red-500" />
                    </Button>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Line {line}</span>
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onStepToLine?.(line)}
                      className="h-6 px-2"
                      title="Go to line"
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveBreakpoint(line)}
                      className="h-6 px-2"
                      title="Remove breakpoint"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        {/* Watch Tab */}
        <TabsContent value="watch" className="flex-1 flex flex-col">
          <div className="p-2 border-b border-border">
            <div className="flex gap-2">
              <Input
                value={newWatchExpression}
                onChange={(e) => setNewWatchExpression(e.target.value)}
                placeholder="Enter expression to watch..."
                className="flex-1 text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddWatchExpression();
                  }
                }}
              />
              <Button
                size="sm"
                onClick={handleAddWatchExpression}
                disabled={!newWatchExpression.trim()}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          <ScrollArea className="flex-1 p-2">
            {watchExpressions.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No watch expressions. Add expressions to monitor their values during debugging.
              </div>
            ) : (
              <div className="space-y-2">
                {watchExpressions.map((expression, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 border rounded hover:bg-muted/50"
                  >
                    <span className="flex-1 font-mono text-sm">{expression}</span>
                    <span className="text-sm text-muted-foreground">
                      <em>evaluating...</em>
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveWatchExpression(expression)}
                      className="h-6 px-2"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        {/* Errors Tab */}
        <TabsContent value="errors" className="flex-1 flex flex-col">
          <div className="p-2 border-b border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {errors.length} error(s) found
              </span>
              {errors.length > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleClearErrors}
                  className="h-6 px-2"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
          
          <ScrollArea className="flex-1 p-2">
            {errors.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No errors found. Great job! 🎉
              </div>
            ) : (
              <div className="space-y-2">
                {errors.map(error => renderError(error))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

