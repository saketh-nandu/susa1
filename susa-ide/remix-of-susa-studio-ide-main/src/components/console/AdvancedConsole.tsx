/**
 * Advanced Console Component for SUSA IDE
 * Handles real-time input/output with non-blocking execution
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Terminal, Play, Square, Trash2, Copy } from 'lucide-react';
import { consoleEngine, ConsoleMessage } from '@/core/console/ConsoleEngine';
import { eventBus } from '@/core/architecture/EventBus';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface AdvancedConsoleProps {
  className?: string;
  onExecute?: (code: string) => void;
  isExecuting?: boolean;
}

export const AdvancedConsole: React.FC<AdvancedConsoleProps> = ({
  className,
  onExecute,
  isExecuting = false
}) => {
  const [messages, setMessages] = useState<ConsoleMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  const [inputPlaceholder, setInputPlaceholder] = useState('Enter SUSA code or input...');
  
  // Multi-line input state for SUSA blocks
  const [multiLineBuffer, setMultiLineBuffer] = useState('');
  const [isInBlock, setIsInBlock] = useState(false);
  const [blockDepth, setBlockDepth] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Subscribe to console engine updates
  useEffect(() => {
    const unsubscribe = consoleEngine.onMessagesUpdate((newMessages) => {
      setMessages(newMessages);
      setIsWaitingForInput(consoleEngine.isWaitingForInput());
      
      // Update placeholder based on state
      if (consoleEngine.isWaitingForInput()) {
        setInputPlaceholder('Program is waiting for input...');
      } else {
        setInputPlaceholder('Enter SUSA code or input...');
      }
    });

    return unsubscribe;
  }, []);

  // Subscribe to execution events
  useEffect(() => {
    const unsubscribeStart = eventBus.on('execution.start', () => {
      setInputPlaceholder('Executing...');
    });

    const unsubscribeComplete = eventBus.on('execution.complete', () => {
      setInputPlaceholder('Enter SUSA code or input...');
      setIsWaitingForInput(false);
    });

    const unsubscribeInputRequest = eventBus.on('execution.input_request', (event) => {
      setIsWaitingForInput(true);
      if (event.payload.prompt) {
        setInputPlaceholder(event.payload.prompt);
      } else {
        setInputPlaceholder('Program is waiting for input...');
      }
    });

    return () => {
      unsubscribeStart();
      unsubscribeComplete();
      unsubscribeInputRequest();
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when waiting for input or when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isWaitingForInput]);

  // Detect SUSA code blocks and handle execution logic
  const detectSUSABlock = (input: string) => {
    const trimmed = input.trim().toLowerCase();
    
    // Count START: and END: keywords (case insensitive)
    const startCount = (trimmed.match(/start:/g) || []).length;
    const endCount = (trimmed.match(/end:/g) || []).length;
    
    // Check for block structures that require START:/END: (case insensitive)
    const hasLoop = /loop\s+\w+\s*=?\s*\d*\s*for\s+\d+\s+times:/i.test(trimmed);
    const hasIf = /if\s+.+:/i.test(trimmed);
    const hasFunction = /func\s+\w+.*:/i.test(trimmed);
    const hasClass = /class\s+\w+.*:/i.test(trimmed);
    const hasWhile = /while\s+.+:/i.test(trimmed);
    const hasFor = /for\s+\w+\s+in\s+.+:/i.test(trimmed);
    const hasTry = /try:/i.test(trimmed);
    
    // Check if line ends with START: (indicating block start)
    const endsWithStart = trimmed.endsWith('start:');
    
    // Check if line is just END: (indicating block end)
    const isJustEnd = trimmed === 'end:';
    
    return {
      isBlockStart: hasLoop || hasIf || hasFunction || hasClass || hasWhile || hasFor || hasTry,
      endsWithStart,
      isJustEnd,
      isComplete: startCount > 0 && startCount === endCount,
      needsMore: startCount > endCount || (endsWithStart && startCount === 0),
      startCount,
      endCount
    };
  };

  // Handle input submission with SUSA block logic
  const handleSubmitInput = useCallback(() => {
    if (!currentInput.trim()) return;

    if (isWaitingForInput) {
      // Submit input to console engine for program input
      consoleEngine.submitInput(currentInput);
      setCurrentInput('');
      return;
    }

    const trimmedInput = currentInput.trim();
    
    // If we're in a multi-line block, add to buffer
    if (isInBlock) {
      const newBuffer = multiLineBuffer + '\n' + trimmedInput;
      const blockInfo = detectSUSABlock(newBuffer);
      
      // Show the continuation line
      consoleEngine.addMessage({
        id: `cmd_${Date.now()}`,
        type: 'input',
        content: `... ${trimmedInput}`,
        timestamp: Date.now()
      });
      
      // Check if this completes the block
      if (blockInfo.isJustEnd || blockInfo.isComplete) {
        // Block is complete, execute it
        consoleEngine.addMessage({
          id: `exec_${Date.now()}`,
          type: 'system',
          content: `[Executing complete block]`,
          timestamp: Date.now()
        });
        
        onExecute?.(newBuffer);
        
        // Reset multi-line state
        setMultiLineBuffer('');
        setIsInBlock(false);
        setBlockDepth(0);
        setInputPlaceholder('Enter SUSA code or input...');
        
        // Add to history
        if (inputHistory[inputHistory.length - 1] !== newBuffer) {
          setInputHistory(prev => [...prev.slice(-49), newBuffer]);
        }
      } else {
        // Still need more input
        setMultiLineBuffer(newBuffer);
        const newDepth = blockInfo.startCount - blockInfo.endCount;
        setBlockDepth(newDepth);
        setInputPlaceholder(`... (waiting for complete block)`);
      }
    } else {
      // Check if this starts a new block
      const blockInfo = detectSUSABlock(trimmedInput);
      
      if (blockInfo.isComplete) {
        // Complete block in single input - execute immediately
        consoleEngine.addMessage({
          id: `cmd_${Date.now()}`,
          type: 'input',
          content: `> ${trimmedInput}`,
          timestamp: Date.now()
        });
        
        onExecute?.(trimmedInput);
        
        // Add to history
        if (inputHistory[inputHistory.length - 1] !== trimmedInput) {
          setInputHistory(prev => [...prev.slice(-49), trimmedInput]);
        }
      } else if (blockInfo.isBlockStart || blockInfo.needsMore || blockInfo.endsWithStart) {
        // This starts a block that needs more input
        setMultiLineBuffer(trimmedInput);
        setIsInBlock(true);
        const newDepth = Math.max(1, blockInfo.startCount - blockInfo.endCount);
        setBlockDepth(newDepth);
        setInputPlaceholder(`... (waiting for complete block)`);
        
        // Show the input but don't execute yet
        consoleEngine.addMessage({
          id: `cmd_${Date.now()}`,
          type: 'input',
          content: `> ${trimmedInput}`,
          timestamp: Date.now()
        });
        
        // Add a system message to indicate we're waiting for more input
        consoleEngine.addMessage({
          id: `sys_${Date.now()}`,
          type: 'system',
          content: `[Waiting for complete block - enter remaining lines and END:]`,
          timestamp: Date.now()
        });
      } else {
        // Single line statement - execute immediately
        consoleEngine.addMessage({
          id: `cmd_${Date.now()}`,
          type: 'input',
          content: `> ${trimmedInput}`,
          timestamp: Date.now()
        });
        
        onExecute?.(trimmedInput);
        
        // Add to history
        if (inputHistory[inputHistory.length - 1] !== trimmedInput) {
          setInputHistory(prev => [...prev.slice(-49), trimmedInput]);
        }
      }
    }

    setCurrentInput('');
    setHistoryIndex(-1);
  }, [currentInput, isWaitingForInput, onExecute, inputHistory, isInBlock, multiLineBuffer, blockDepth]);

  // Handle key events
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        handleSubmitInput();
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (inputHistory.length > 0) {
          const newIndex = historyIndex === -1 
            ? inputHistory.length - 1 
            : Math.max(0, historyIndex - 1);
          setHistoryIndex(newIndex);
          setCurrentInput(inputHistory[newIndex]);
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (historyIndex !== -1) {
          const newIndex = historyIndex + 1;
          if (newIndex >= inputHistory.length) {
            setHistoryIndex(-1);
            setCurrentInput('');
          } else {
            setHistoryIndex(newIndex);
            setCurrentInput(inputHistory[newIndex]);
          }
        }
        break;

      case 'Escape':
        e.preventDefault();
        if (isInBlock) {
          // Cancel multi-line input
          setMultiLineBuffer('');
          setIsInBlock(false);
          setBlockDepth(0);
          setInputPlaceholder('Enter SUSA code or input...');
        }
        setCurrentInput('');
        setHistoryIndex(-1);
        break;

      case 'l':
        if (e.ctrlKey) {
          e.preventDefault();
          handleClearConsole();
        }
        break;

      case 'c':
        if (e.ctrlKey && e.shiftKey) {
          e.preventDefault();
          handleCopyConsole();
        }
        break;
    }
  }, [historyIndex, inputHistory, handleSubmitInput]);

  // Clear console
  const handleClearConsole = useCallback(() => {
    consoleEngine.clearMessages();
    // Reset multi-line state when clearing
    setMultiLineBuffer('');
    setIsInBlock(false);
    setBlockDepth(0);
    setInputPlaceholder('Enter SUSA code or input...');
    toast.success('Console cleared');
  }, []);

  // Copy console content
  const handleCopyConsole = useCallback(() => {
    const content = messages
      .map(msg => `[${new Date(msg.timestamp).toLocaleTimeString()}] ${msg.content}`)
      .join('\n');
    
    navigator.clipboard.writeText(content).then(() => {
      toast.success('Console content copied to clipboard');
    }).catch(() => {
      toast.error('Failed to copy console content');
    });
  }, [messages]);

  // Stop execution
  const handleStopExecution = useCallback(() => {
    consoleEngine.completeExecution(false);
    eventBus.emit('execution.complete', { success: false });
    toast.info('Execution stopped');
  }, []);

  // Get message type styling
  const getMessageStyle = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error':
        return 'text-red-400';
      case 'system':
        return 'text-blue-400';
      case 'prompt':
        return 'text-yellow-400';
      case 'input':
        return 'text-green-400';
      default:
        return 'text-foreground';
    }
  };

  // Get message icon
  const getMessageIcon = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error':
        return '❌';
      case 'system':
        return '🔧';
      case 'prompt':
        return '❓';
      case 'input':
        return '▶️';
      default:
        return '';
    }
  };

  return (
    <div className={cn('h-full bg-background flex flex-col', className)}>
      {/* Console Header - Fixed */}
      <div className="flex items-center justify-between p-2 border-b border-border bg-muted/50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4" />
          <span className="text-sm font-medium">SUSA Console</span>
          {isWaitingForInput && (
            <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">
              Waiting for input
            </span>
          )}
          {isExecuting && (
            <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
              Executing
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {isExecuting && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleStopExecution}
              className="h-6 px-2"
            >
              <Square className="w-3 h-3" />
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopyConsole}
            className="h-6 px-2"
            title="Copy console content (Ctrl+Shift+C)"
          >
            <Copy className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleClearConsole}
            className="h-6 px-2"
            title="Clear console (Ctrl+L)"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Messages Area - Flexible */}
      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 overflow-y-auto p-2" ref={messagesContainerRef}>
          <div className="space-y-1 font-mono text-sm">
            {messages.length === 0 ? (
              <div className="text-muted-foreground text-center py-8">
                Console is ready. Type SUSA code or run a program.
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex items-start gap-2 py-1 px-2 rounded hover:bg-muted/50',
                    getMessageStyle(message.type)
                  )}
                >
                  <span className="text-xs opacity-60 min-w-[60px]">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="text-xs">{getMessageIcon(message.type)}</span>
                  <span className="flex-1 whitespace-pre-wrap break-words">
                    {message.content}
                  </span>
                  {message.metadata?.line && (
                    <span className="text-xs opacity-60">
                      L{message.metadata.line}
                    </span>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Section - Fixed at bottom */}
      <div className="flex-shrink-0 border-t border-border bg-background">
        {/* Input Field */}
        <div className="p-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground min-w-[20px]">
              {isWaitingForInput ? '?' : isInBlock ? '...' : '>'}
            </span>
            <Input
              ref={inputRef}
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={inputPlaceholder}
              className="flex-1 font-mono text-sm"
              disabled={isExecuting && !isWaitingForInput}
            />
            <Button
              size="sm"
              onClick={handleSubmitInput}
              disabled={!currentInput.trim() || (isExecuting && !isWaitingForInput)}
              className="px-3"
            >
              <Play className="w-3 h-3" />
            </Button>
          </div>
          {isInBlock && (
            <div className="mt-1 text-xs text-muted-foreground">
              Multi-line block mode - {blockDepth} block(s) open
            </div>
          )}
        </div>
      </div>
    </div>
  );
};