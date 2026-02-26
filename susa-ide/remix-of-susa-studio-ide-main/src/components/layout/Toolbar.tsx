import React from 'react';
import {
  FilePlus,
  Save,
  Play,
  Square,
  Bug,
  Settings,
  Command,
  Code2,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  LayoutPanelTop,
  FolderOpen,
  Folder,
  Package
} from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { useSettingsStore } from '@/store/settingsStore';
import { fileSystemService } from '@/services/fileSystemService';
import { susaService } from '@/services/susaService';
import { Marketplace } from '@/components/marketplace/Marketplace';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';

export const Toolbar: React.FC = () => {
  const {
    sidebarOpen,
    toggleSidebar,
    rightSidebarOpen,
    toggleRightSidebar,
    bottomPanelOpen,
    toggleBottomPanel,
    toggleCommandPalette,
    currentContent,
    isRunning,
    setIsRunning,
    addOutput,
    clearOutput,
    setActiveBottomTab,
    createNewFile,
    saveCurrentFile,
    activeTabId,
    tabs,
    updateTabContent,
  } = useEditorStore();

  const [marketplaceOpen, setMarketplaceOpen] = React.useState(false);

  const handleRun = async () => {
    if (isRunning) {
      setIsRunning(false);
      return;
    }

    if (!currentContent.trim()) {
      toast.error('No code to run');
      return;
    }

    clearOutput();
    setActiveBottomTab('output');
    setIsRunning(true);

    addOutput({
      type: 'info',
      content: '▶ Running SUSA program...',
      timestamp: new Date(),
    });

    try {
      const result = await susaService.executeCode(currentContent);
      
      if (result.success) {
        if (result.stdout) {
          addOutput({
            type: 'output',
            content: result.stdout,
            timestamp: new Date(),
          });
        }
        addOutput({
          type: 'info',
          content: '✓ Program completed successfully',
          timestamp: new Date(),
        });
      } else {
        addOutput({
          type: 'error',
          content: `✗ ${result.stderr || 'Program failed'}`,
          timestamp: new Date(),
        });
      }
    } catch (error) {
      addOutput({
        type: 'error',
        content: `✗ Execution error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
      });
    }

    setIsRunning(false);
  };

  const handleNewFile = async () => {
    // Create a simple new file with a unique name
    const timestamp = Date.now();
    const fileName = `untitled_${timestamp}.susa`;
    const fileId = `file_${timestamp}`;
    
    const newFileContent = `# New SUSA File
# Start writing your SUSA code here

let message = "Hello, SUSA!"
PRINT message
`;

    if (fileSystemService.isElectronApp()) {
      // For desktop app, create actual file in workspace
      try {
        const { workspacePath, refreshFiles } = useEditorStore.getState();
        if (workspacePath) {
          const filePath = `${workspacePath}/${fileName}`;
          const result = await fileSystemService.writeFile(filePath, newFileContent);
          
          if (result.success) {
            // Refresh file explorer
            await refreshFiles();
            
            // Open the new file
            const { openTab } = useEditorStore.getState();
            openTab({
              id: fileId,
              name: fileName,
              path: filePath,
              content: newFileContent
            });
            
            toast.success(`Created file: ${fileName}`);
            return;
          }
        }
      } catch (error) {
        console.error('Failed to create file:', error);
      }
    }

    // Fallback: Add to tabs immediately (for web or if file creation fails)
    const { openTab } = useEditorStore.getState();
    openTab({
      id: fileId,
      name: fileName,
      path: fileName, // Will be updated when saved
      content: newFileContent
    });
    
    toast.success(`Created new file: ${fileName}`);
  };

  const handleSave = async () => {
    await saveCurrentFile();
  };

  const handleOpenFile = async () => {
    if (!fileSystemService.isElectronApp()) {
      toast.error('Open file is only available in desktop app');
      return;
    }

    try {
      const result = await window.electronAPI.showOpenDialog({
        properties: ['openFile'],
        filters: [
          { name: 'SUSA Files', extensions: ['susa'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      if (!result.canceled && result.filePaths.length > 0) {
        const filePath = result.filePaths[0];
        const readResult = await fileSystemService.readFile(filePath);
        
        if (readResult.success && readResult.content !== undefined) {
          const fileName = filePath.split(/[\\/]/).pop() || 'untitled.susa';
          const fileId = `file-${Date.now()}`;
          
          // Add to store as a new tab
          const { openTab } = useEditorStore.getState();
          openTab({
            id: fileId,
            name: fileName,
            path: filePath,
            content: readResult.content
          });
          
          toast.success(`File opened: ${fileName}`);
        } else {
          toast.error(`Failed to open file: ${readResult.error}`);
        }
      }
    } catch (error) {
      toast.error(`Open failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleOpenFolder = async () => {
    if (!fileSystemService.isElectronApp()) {
      toast.error('Open folder is only available in desktop app');
      return;
    }

    try {
      const result = await window.electronAPI.showOpenDialog({
        properties: ['openDirectory'],
        title: 'Select SUSA Project Folder'
      });

      if (!result.canceled && result.filePaths.length > 0) {
        const folderPath = result.filePaths[0];
        
        // Update workspace path and refresh files
        const { setWorkspacePath, refreshFiles } = useEditorStore.getState();
        setWorkspacePath(folderPath);
        await refreshFiles();
        
        toast.success(`Opened folder: ${folderPath.split(/[\\/]/).pop()}`);
      }
    } catch (error) {
      toast.error(`Failed to open folder: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleFormat = async () => {
    if (!activeTabId) {
      toast.error('No file to format');
      return;
    }
    
    try {
      const result = await susaService.formatCode(currentContent);
      if (result.success && result.changesMade) {
        updateTabContent(activeTabId, result.formattedCode);
        toast.success('Code formatted');
      } else if (!result.changesMade) {
        toast.info('Code is already formatted');
      } else {
        toast.error(`Format failed: ${result.error}`);
      }
    } catch (error) {
      toast.error(`Format failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <>
      <div className="h-12 bg-panel-header border-b border-panel-border flex items-center px-3 gap-1">
        {/* Logo */}
        <div className="flex items-center gap-2 mr-4 pr-4 border-r border-panel-border">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
            <img 
              src="/susa-logo.png" 
              alt="SUSA Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback to icon if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center hidden">
              <Code2 className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground leading-tight">SUSA</span>
            <span className="text-[10px] text-muted-foreground leading-tight">Studio</span>
          </div>
        </div>

        {/* Toggle sidebar */}
        <ToolbarButton
          icon={sidebarOpen ? PanelLeftClose : PanelLeftOpen}
          tooltip={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          onClick={toggleSidebar}
        />

        <div className="w-px h-6 bg-panel-border mx-1" />

        {/* File actions */}
        <ToolbarButton icon={FilePlus} tooltip="New file (Ctrl+N)" onClick={handleNewFile} />
        <ToolbarButton icon={FolderOpen} tooltip="Open file (Ctrl+O)" onClick={handleOpenFile} />
        <ToolbarButton icon={Folder} tooltip="Open folder" onClick={handleOpenFolder} />
        <ToolbarButton icon={Save} tooltip="Save (Ctrl+S)" onClick={handleSave} />

        <div className="w-px h-6 bg-panel-border mx-1" />

        {/* Run actions */}
        <ToolbarButton
          icon={isRunning ? Square : Play}
          tooltip={isRunning ? 'Stop (Shift+F5)' : 'Run (F5)'}
          onClick={handleRun}
          variant={isRunning ? 'destructive' : 'success'}
        />
        <ToolbarButton icon={Bug} tooltip="Debug" onClick={() => {}} />
        <ToolbarButton icon={Sparkles} tooltip="Format code" onClick={handleFormat} />

        <div className="flex-1" />

        {/* Right side */}
        <ToolbarButton icon={Package} tooltip="Marketplace" onClick={() => setMarketplaceOpen(true)} />
        <ToolbarButton
          icon={rightSidebarOpen ? PanelRightClose : PanelRightOpen}
          tooltip={rightSidebarOpen ? 'Hide right panel' : 'Show right panel'}
          onClick={toggleRightSidebar}
        />
        <ToolbarButton
          icon={LayoutPanelTop}
          tooltip={bottomPanelOpen ? 'Hide panel' : 'Show panel'}
          onClick={toggleBottomPanel}
        />
        <ToolbarButton
          icon={Command}
          tooltip="Command palette (Ctrl+Shift+P)"
          onClick={toggleCommandPalette}
        />
        <ToolbarButton icon={Settings} tooltip="Settings" onClick={useSettingsStore.getState().toggleSettings} />
      </div>
      
      <Marketplace isOpen={marketplaceOpen} onClose={() => setMarketplaceOpen(false)} />
    </>
  );
};

interface ToolbarButtonProps {
  icon: React.ElementType;
  tooltip: string;
  onClick: () => void;
  variant?: 'default' | 'success' | 'destructive';
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon: Icon,
  tooltip,
  onClick,
  variant = 'default',
}) => {
  const variantClasses = {
    default: 'text-muted-foreground hover:text-foreground hover:bg-secondary',
    success: 'text-status-success hover:text-status-success hover:bg-status-success/10',
    destructive: 'text-status-error hover:text-status-error hover:bg-status-error/10',
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={`p-2 rounded-md transition-colors ${variantClasses[variant]}`}
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
