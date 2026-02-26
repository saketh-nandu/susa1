import React, { useState, useEffect } from 'react';
import { FileExplorer } from '@/components/layout/FileExplorer';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { Toolbar } from '@/components/layout/Toolbar';
import { BottomPanel } from '@/components/layout/BottomPanel';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { SettingsPanel } from '@/components/layout/SettingsPanel';
import { MonacoEditor } from '@/components/editor/MonacoEditor';
import { TabBar } from '@/components/editor/TabBar';
import { StatusBar } from '@/components/editor/StatusBar';
import { WelcomeScreen } from '@/components/editor/WelcomeScreen';
import { Marketplace } from '@/components/marketplace/Marketplace';
import { AdvancedConsole } from '@/components/console/AdvancedConsole';
import { 
  HorizontalResizableContainer, 
  VerticalResizableContainer,
  usePanelSizes 
} from '@/components/ui/ResizablePanel';
import { useEditorStore } from '@/store/editorStore';
import { useDebuggerStore } from '@/store/debuggerStore';
import { runtimeEngine } from '@/core/runtime/RuntimeEngine';
import { debuggerEngine } from '@/core/debugger/DebuggerEngine';
import { consoleEngine } from '@/core/console/ConsoleEngine';
import { eventBus } from '@/core/architecture/EventBus';
import { Bug, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Left Sidebar with resize handle on right edge
const LeftSidebarResizable = ({ onWidthChange }: { onWidthChange: (width: number) => void }) => {
  const [width, setWidth] = useState(() => {
    const saved = localStorage.getItem('susa-ide-left-sidebar-width');
    return saved ? parseInt(saved) : 250;
  });
  const [isLocked, setIsLocked] = useState(() => {
    const saved = localStorage.getItem('susa-ide-left-sidebar-locked');
    return saved === 'true';
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartWidth, setDragStartWidth] = useState(0);

  // Notify parent of width changes
  useEffect(() => {
    onWidthChange(width);
  }, [width, onWidthChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isLocked) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartWidth(width);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const toggleLock = () => {
    const newLocked = !isLocked;
    setIsLocked(newLocked);
    localStorage.setItem('susa-ide-left-sidebar-locked', newLocked.toString());
    toast.info(newLocked ? 'Explorer resize locked' : 'Explorer resize unlocked');
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - dragStartX;
      let newWidth = dragStartWidth + delta;
      
      // Apply constraints
      newWidth = Math.max(150, Math.min(500, newWidth));
      
      setWidth(newWidth);
      localStorage.setItem('susa-ide-left-sidebar-width', newWidth.toString());
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStartX, dragStartWidth]);

  return (
    <div 
      className="h-full bg-muted/30 border-r border-border flex-shrink-0 relative"
      style={{ width: `${width}px` }}
    >
      <FileExplorer />
      {/* Resize handle on right edge */}
      <div
        className={cn(
          'absolute right-0 top-0 w-1 h-full transition-all z-20 group',
          !isLocked && 'cursor-col-resize hover:w-2 hover:bg-primary/20',
          isLocked && 'cursor-not-allowed bg-muted/50',
          isDragging && 'w-2 bg-primary/40'
        )}
        onMouseDown={handleMouseDown}
        title={isLocked ? 'Resize locked (click lock icon to unlock)' : 'Drag to resize'}
      >
        {/* Lock/Unlock button */}
        <button
          onClick={toggleLock}
          className={cn(
            'absolute top-2 left-1/2 -translate-x-1/2 p-1.5 rounded bg-background border border-border shadow-sm',
            'hover:bg-muted transition-colors opacity-0 group-hover:opacity-100',
            isLocked && 'opacity-100'
          )}
          title={isLocked ? 'Click to unlock resize' : 'Click to lock resize'}
        >
          {isLocked ? (
            <svg className="w-3 h-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          ) : (
            <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

// Right Sidebar with resize handle on left edge
const RightSidebarResizable = ({ onWidthChange }: { onWidthChange: (width: number) => void }) => {
  const [width, setWidth] = useState(() => {
    const saved = localStorage.getItem('susa-ide-right-sidebar-width');
    return saved ? parseInt(saved) : 300;
  });
  const [isLocked, setIsLocked] = useState(() => {
    const saved = localStorage.getItem('susa-ide-right-sidebar-locked');
    return saved === 'true';
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartWidth, setDragStartWidth] = useState(0);

  // Notify parent of width changes
  useEffect(() => {
    onWidthChange(width);
  }, [width, onWidthChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isLocked) return; // Don't allow dragging if locked
    e.preventDefault();
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartWidth(width);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const toggleLock = () => {
    const newLocked = !isLocked;
    setIsLocked(newLocked);
    localStorage.setItem('susa-ide-right-sidebar-locked', newLocked.toString());
    toast.info(newLocked ? 'Outline resize locked' : 'Outline resize unlocked');
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = dragStartX - e.clientX; // Reversed because we're dragging from left
      let newWidth = dragStartWidth + delta;
      
      // Apply constraints
      newWidth = Math.max(200, Math.min(600, newWidth));
      
      setWidth(newWidth);
      localStorage.setItem('susa-ide-right-sidebar-width', newWidth.toString());
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStartX, dragStartWidth]);

  return (
    <div 
      className="h-full bg-muted/30 border-l border-border flex-shrink-0 relative"
      style={{ width: `${width}px` }}
    >
      {/* Resize handle on left edge */}
      <div
        className={cn(
          'absolute left-0 top-0 w-1 h-full transition-all z-20 group',
          !isLocked && 'cursor-col-resize hover:w-2 hover:bg-primary/20',
          isLocked && 'cursor-not-allowed bg-muted/50',
          isDragging && 'w-2 bg-primary/40'
        )}
        onMouseDown={handleMouseDown}
        title={isLocked ? 'Resize locked (click lock icon to unlock)' : 'Drag to resize'}
      >
        {/* Lock/Unlock button */}
        <button
          onClick={toggleLock}
          className={cn(
            'absolute top-2 left-1/2 -translate-x-1/2 p-1.5 rounded bg-background border border-border shadow-sm',
            'hover:bg-muted transition-colors opacity-0 group-hover:opacity-100',
            isLocked && 'opacity-100'
          )}
          title={isLocked ? 'Click to unlock resize' : 'Click to lock resize'}
        >
          {isLocked ? (
            <svg className="w-3 h-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          ) : (
            <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
      <RightSidebar />
    </div>
  );
};

const Index = () => {
  console.log('SUSA IDE Index component rendering...');
  
  const { 
    tabs, 
    initializeWorkspace, 
    createNewFile, 
    saveCurrentFile, 
    toggleCommandPalette,
    currentContent,
    isRunning,
    setIsRunning,
    addOutput,
    clearOutput,
    setActiveBottomTab,
    activeTabId,
    updateTabContent,
    openTab,
    sidebarOpen,
    rightSidebarOpen,
    bottomPanelOpen
  } = useEditorStore();
  
  const { state: debugState } = useDebuggerStore();
  const [marketplaceOpen, setMarketplaceOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('susa-ide-right-sidebar-width');
    return saved ? parseInt(saved) : 300;
  });
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('susa-ide-left-sidebar-width');
    return saved ? parseInt(saved) : 250;
  });

  // Panel size management
  const { updateSize: updatePanelSize, getSize: getPanelSize } = usePanelSizes('susa-ide-panels');

  // Initialize workspace on component mount
  useEffect(() => {
    initializeWorkspace();
  }, [initializeWorkspace]);

  // Subscribe to runtime state changes
  useEffect(() => {
    const unsubscribe = runtimeEngine.onStateChange((state) => {
      setIsExecuting(state.isExecuting);
      setIsRunning(state.isExecuting);
    });

    return unsubscribe;
  }, [setIsRunning]);

  // Subscribe to execution events
  useEffect(() => {
    const unsubscribeOutput = eventBus.on('execution.output', (event) => {
      addOutput({
        type: 'output',
        content: event.payload.content,
        timestamp: new Date(),
      });
    });

    const unsubscribeError = eventBus.on('execution.error', (event) => {
      addOutput({
        type: 'error',
        content: event.payload.message,
        timestamp: new Date(),
      });
    });

    const unsubscribeComplete = eventBus.on('execution.complete', (event) => {
      const message = event.payload.success 
        ? '✓ Execution completed successfully'
        : '✗ Execution failed or was stopped';
      
      addOutput({
        type: 'info',
        content: message,
        timestamp: new Date(),
      });
    });

    return () => {
      unsubscribeOutput();
      unsubscribeError();
      unsubscribeComplete();
    };
  }, [addOutput]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      // Ctrl+N - New File
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        const timestamp = Date.now();
        const fileName = `untitled_${timestamp}.susa`;
        const fileId = `file_${timestamp}`;
        
        const newFileContent = `# New SUSA File
# Start writing your SUSA code here

let message = "Hello, SUSA!"
print message
`;

        openTab({
          id: fileId,
          name: fileName,
          path: fileName,
          content: newFileContent
        });
        return;
      }

      // Ctrl+S - Save File
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        await saveCurrentFile();
        return;
      }

      // F5 - Run Code
      if (e.key === 'F5') {
        e.preventDefault();
        await handleRunCode();
        return;
      }

      // Shift+F5 - Debug Code
      if (e.shiftKey && e.key === 'F5') {
        e.preventDefault();
        await handleDebugCode();
        return;
      }

      // Ctrl+Shift+P - Command Palette
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        toggleCommandPalette();
        return;
      }

      // Escape - Stop execution
      if (e.key === 'Escape' && isExecuting) {
        e.preventDefault();
        handleStopExecution();
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    openTab, 
    saveCurrentFile, 
    toggleCommandPalette,
    isExecuting,
    debugState
  ]);

  // Handle code execution
  const handleRunCode = async () => {
    if (isExecuting) {
      handleStopExecution();
      return;
    }

    if (!currentContent.trim()) {
      toast.error('No code to run');
      return;
    }

    clearOutput();
    setActiveBottomTab('output');

    try {
      await runtimeEngine.executeCode(currentContent, {
        timeout: 30000,
        debugMode: false
      });
    } catch (error) {
      toast.error(`Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Handle debug execution
  const handleDebugCode = async () => {
    if (isExecuting) {
      handleStopExecution();
      return;
    }

    if (!currentContent.trim()) {
      toast.error('No code to debug');
      return;
    }

    clearOutput();
    setActiveBottomTab('output');

    try {
      await runtimeEngine.executeCode(currentContent, {
        timeout: 30000,
        debugMode: true,
        stepMode: true
      });
    } catch (error) {
      toast.error(`Debug failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Handle console code execution
  const handleConsoleExecute = async (code: string) => {
    if (!code.trim()) return;

    try {
      // Switch to console tab to show the execution
      setActiveBottomTab('console');
      
      // Execute the code using runtime engine
      const result = await runtimeEngine.executeCode(code, {
        timeout: 10000,
        debugMode: false
      });

      // The output will be handled by the console component itself
      // No need to add to output here since console should handle its own display
      
    } catch (error) {
      // Add error to console engine instead of output
      consoleEngine.addError(`Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Console execution error:', error);
    }
  };

  // Handle stop execution
  const handleStopExecution = () => {
    runtimeEngine.stopExecution();
    toast.info('Execution stopped');
  };

  // Panel configurations
  const mainPanels = [
    ...(sidebarOpen ? [{
      id: 'sidebar',
      defaultSize: getPanelSize('sidebar', 20),
      minSize: 15,
      maxSize: 40,
      collapsible: true,
      resizable: true
    }] : []),
    {
      id: 'editor-area',
      defaultSize: getPanelSize('editor-area', sidebarOpen ? 80 : 100),
      minSize: 30,
      maxSize: 85,
      resizable: true
    }
  ];

  const editorPanels = [
    {
      id: 'editor',
      defaultSize: getPanelSize('editor', bottomPanelOpen ? 70 : 100),
      minSize: 30,
      maxSize: 85,
      resizable: true
    },
    ...(bottomPanelOpen ? [{
      id: 'bottom-panel',
      defaultSize: getPanelSize('bottom-panel', 30),
      minSize: 15,
      maxSize: 70,
      collapsible: false,
      resizable: true // Enable resizing
    }] : [])
  ];

  return (
    <div className="h-screen w-screen flex flex-col bg-background overflow-hidden">
      {/* Toolbar */}
      <Toolbar />
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex relative">
        {/* Left Sidebar - Resizable */}
        {sidebarOpen && (
          <LeftSidebarResizable onWidthChange={setLeftSidebarWidth} />
        )}
        
        {/* Middle Content Area - Editor and Bottom Panel */}
        <div className="flex-1 h-full flex flex-col overflow-hidden">
          <VerticalResizableContainer
            panels={editorPanels}
            onResize={updatePanelSize}
            persistKey="susa-ide-panels"
            className="h-full"
          >
            {/* Editor */}
            <div className="h-full flex flex-col bg-background">
              {tabs.length > 0 ? (
                <>
                  <TabBar />
                  <div className="flex-1 overflow-hidden">
                    <MonacoEditor />
                  </div>
                  <StatusBar />
                </>
              ) : (
                <WelcomeScreen />
              )}
            </div>
            
            {/* Bottom Panel */}
            {bottomPanelOpen && (
              <div className="h-full border-t border-border bg-muted/30">
                <BottomPanel />
              </div>
            )}
          </VerticalResizableContainer>
        </div>

        {/* Right Sidebar - Resizable with left edge handle */}
        {rightSidebarOpen && (
          <RightSidebarResizable onWidthChange={setRightSidebarWidth} />
        )}
      </div>

      {/* Overlays */}
      <CommandPalette />
      <SettingsPanel />
      
      {marketplaceOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-4 bg-background border border-border rounded-lg shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold">SUSA Marketplace</h2>
              <button
                onClick={() => setMarketplaceOpen(false)}
                className="p-1 hover:bg-muted rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 h-full overflow-auto">
              <Marketplace />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;