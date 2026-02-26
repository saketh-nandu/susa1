import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  FileCode, 
  Folder, 
  FolderOpen,
  Plus,
  Trash2,
  Edit2,
  MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditorStore, FileNode } from '@/store/editorStore';
import { fileSystemService } from '@/services/fileSystemService';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export const FileExplorer: React.FC = () => {
  const { files } = useEditorStore();

  return (
    <div className="h-full bg-sidebar flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Explorer
        </span>
        <NewFileButton />
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {files.map((node) => (
          <FileTreeItem key={node.id} node={node} depth={0} />
        ))}
      </div>
    </div>
  );
};

const NewFileButton: React.FC = () => {
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

    const { workspacePath, refreshFiles, openTab } = useEditorStore.getState();

    if (workspacePath && fileSystemService.isElectronApp()) {
      try {
        // For desktop app, create actual file in workspace
        const filePath = `${workspacePath}/${fileName}`;
        const result = await fileSystemService.writeFile(filePath, newFileContent);
        
        if (result.success) {
          // Refresh file explorer
          await refreshFiles();
          
          // Open the new file
          openTab({
            id: fileId,
            name: fileName,
            path: filePath,
            content: newFileContent
          });
          
          toast.success(`Created file: ${fileName}`);
          return;
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('Failed to create file:', error);
        toast.error(`Failed to create file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Fallback: Add to tabs immediately (for web or if file creation fails)
    openTab({
      id: fileId,
      name: fileName,
      path: fileName,
      content: newFileContent
    });
    
    toast.success(`Created new file: ${fileName}`);
  };

  return (
    <button
      onClick={handleNewFile}
      className="susa-icon-button"
      title="New file"
    >
      <Plus className="w-4 h-4" />
    </button>
  );
};

interface FileTreeItemProps {
  node: FileNode;
  depth: number;
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({ node, depth }) => {
  const { 
    selectedFileId, 
    expandedFolders, 
    selectFile, 
    toggleFolder,
    deleteFile,
    renameFile,
    createNewFile,
    createNewFolder,
    openTab,
    saveFile
  } = useEditorStore();

  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(node.name);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);

  const isFolder = node.type === 'folder';
  const isExpanded = expandedFolders.has(node.id);
  const isSelected = selectedFileId === node.id;

  const handleClick = () => {
    if (isFolder) {
      toggleFolder(node.id);
    } else {
      selectFile(node.id);
    }
  };

  const handleDoubleClick = () => {
    if (!isFolder) {
      // Open file in editor
      openTab({
        id: node.id,
        name: node.name,
        path: node.path,
        content: '' // Will be loaded when tab is activated
      });
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuOpen(true);
  };

  const handleRename = async () => {
    if (!newName.trim()) {
      setIsRenaming(false);
      setNewName(node.name);
      return;
    }
    
    const trimmedName = newName.trim();
    
    if (trimmedName === node.name) {
      setIsRenaming(false);
      return;
    }
    
    try {
      await renameFile(node.path, trimmedName);
      toast.success(`Renamed to: ${trimmedName}`);
    } catch (error) {
      console.error('Rename failed:', error);
      toast.error(`Failed to rename: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Reset to original name on error
      setNewName(node.name);
    } finally {
      setIsRenaming(false);
      setContextMenuOpen(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${node.name}"?`)) {
      try {
        await deleteFile(node.path);
        toast.success(`Deleted: ${node.name}`);
      } catch (error) {
        toast.error(`Failed to delete: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    setContextMenuOpen(false);
  };

  const handleSave = async () => {
    if (!isFolder) {
      try {
        await saveFile(node.path);
        toast.success(`Saved: ${node.name}`);
      } catch (error) {
        toast.error(`Failed to save: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    setContextMenuOpen(false);
  };

  const handleSaveAs = async () => {
    if (!isFolder && fileSystemService.isElectronApp()) {
      try {
        const result = await window.electronAPI.showSaveDialog({
          defaultPath: node.name,
          filters: [
            { name: 'SUSA Files', extensions: ['susa'] },
            { name: 'All Files', extensions: ['*'] }
          ]
        });

        if (!result.canceled && result.filePath) {
          // Get current content from editor or file
          const content = ''; // You'll need to get this from the current editor content
          const writeResult = await fileSystemService.writeFile(result.filePath, content);
          
          if (writeResult.success) {
            toast.success(`Saved as: ${result.filePath.split(/[\\/]/).pop()}`);
          } else {
            toast.error(`Failed to save: ${writeResult.error}`);
          }
        }
      } catch (error) {
        toast.error(`Save as failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    setContextMenuOpen(false);
  };

  const handleNewFile = () => {
    if (isFolder) {
      createNewFile(node.path);
    }
    setContextMenuOpen(false);
  };

  const handleNewFolder = () => {
    if (isFolder) {
      createNewFolder(node.path);
    }
    setContextMenuOpen(false);
  };

  const handleCopy = () => {
    // Copy file path to clipboard
    navigator.clipboard.writeText(node.path);
    toast.success('Path copied to clipboard');
    setContextMenuOpen(false);
  };

  return (
    <div>
      <div
        className={cn(
          'file-tree-item group',
          isSelected && 'active'
        )}
        style={{ paddingLeft: depth * 12 + 8 }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
      >
        {isFolder ? (
          <>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
            {isExpanded ? (
              <FolderOpen className="w-4 h-4 text-primary" />
            ) : (
              <Folder className="w-4 h-4 text-primary" />
            )}
          </>
        ) : (
          <>
            <span className="w-4" />
            <FileCode className="w-4 h-4 text-syntax-function" />
          </>
        )}

        {isRenaming ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleRename();
              }
              if (e.key === 'Escape') {
                e.preventDefault();
                setIsRenaming(false);
                setNewName(node.name);
              }
            }}
            onBlur={handleRename}
            onClick={(e) => e.stopPropagation()}
            autoFocus
            className="flex-1 px-1 py-0 text-sm bg-input border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Enter new name..."
            maxLength={255}
          />
        ) : (
          <span 
            className="flex-1 truncate text-sm" 
            title={node.path}
          >
            {node.name}
          </span>
        )}

        <DropdownMenu open={contextMenuOpen} onOpenChange={setContextMenuOpen}>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <button className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-secondary rounded">
              <MoreVertical className="w-3.5 h-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {!isFolder && (
              <>
                <DropdownMenuItem onClick={handleSave}>
                  <FileCode className="w-4 h-4 mr-2" />
                  Save
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSaveAs}>
                  <FileCode className="w-4 h-4 mr-2" />
                  Save As...
                </DropdownMenuItem>
                <div className="h-px bg-border my-1" />
              </>
            )}
            {isFolder && (
              <>
                <DropdownMenuItem onClick={handleNewFile}>
                  <Plus className="w-4 h-4 mr-2" />
                  New File
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleNewFolder}>
                  <Folder className="w-4 h-4 mr-2" />
                  New Folder
                </DropdownMenuItem>
                <div className="h-px bg-border my-1" />
              </>
            )}
            <DropdownMenuItem onClick={() => setIsRenaming(true)}>
              <Edit2 className="w-4 h-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopy}>
              <FileCode className="w-4 h-4 mr-2" />
              Copy Path
            </DropdownMenuItem>
            <div className="h-px bg-border my-1" />
            <DropdownMenuItem 
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AnimatePresence>
        {isFolder && isExpanded && node.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {node.children.map((child) => (
              <FileTreeItem key={child.id} node={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
