import { create } from 'zustand';
import { fileSystemService } from '../services/fileSystemService';

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  content?: string;
  children?: FileNode[];
  isOpen?: boolean;
}

export interface Tab {
  id: string;
  name: string;
  path: string;
  content: string;
  isDirty: boolean;
}

export interface Problem {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface OutputLine {
  type: 'output' | 'error' | 'info';
  content: string;
  timestamp: Date;
}

interface EditorState {
  // File system
  files: FileNode[];
  selectedFileId: string | null;
  expandedFolders: Set<string>;
  workspacePath: string;
  
  // Tabs
  tabs: Tab[];
  activeTabId: string | null;
  
  // Editor state
  currentContent: string;
  cursorPosition: { line: number; column: number };
  
  // Panels
  sidebarOpen: boolean;
  sidebarWidth: number;
  rightSidebarOpen: boolean;
  rightSidebarWidth: number;
  bottomPanelOpen: boolean;
  bottomPanelHeight: number;
  activeBottomTab: 'output' | 'console' | 'problems' | 'debugger';
  debugPanelOpen: boolean;
  debugPanelWidth: number;
  
  // Output & debugging
  output: OutputLine[];
  problems: Problem[];
  isRunning: boolean;
  currentExecutingLine: number | null;
  breakpoints: Set<number>;
  variables: Record<string, unknown>;
  
  // Command palette
  commandPaletteOpen: boolean;
  
  // Actions
  initializeWorkspace: () => Promise<void>;
  refreshFiles: () => Promise<void>;
  loadDirectory: (dirPath: string) => Promise<FileNode[]>;
  setWorkspacePath: (path: string) => void;
  
  createNewFile: (parentPath?: string, name?: string) => Promise<void>;
  createNewFolder: (parentPath?: string, name?: string) => Promise<void>;
  deleteFile: (filePath: string) => Promise<void>;
  renameFile: (oldPath: string, newName: string) => Promise<void>;
  
  openFile: (filePath: string) => Promise<void>;
  saveFile: (filePath: string, content: string) => Promise<void>;
  saveCurrentFile: () => Promise<void>;
  
  selectFile: (id: string) => void;
  toggleFolder: (id: string) => void;
  
  openTab: (file: { id: string; name: string; path: string; content: string }) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTabContent: (id: string, content: string) => void;
  
  setCurrentContent: (content: string) => void;
  setCursorPosition: (pos: { line: number; column: number }) => void;
  
  toggleSidebar: () => void;
  setSidebarWidth: (width: number) => void;
  toggleRightSidebar: () => void;
  setRightSidebarWidth: (width: number) => void;
  toggleBottomPanel: () => void;
  setBottomPanelHeight: (height: number) => void;
  setActiveBottomTab: (tab: 'output' | 'console' | 'problems' | 'debugger') => void;
  toggleDebugPanel: () => void;
  setDebugPanelWidth: (width: number) => void;
  
  addOutput: (line: OutputLine) => void;
  clearOutput: () => void;
  setProblems: (problems: Problem[]) => void;
  setIsRunning: (running: boolean) => void;
  setCurrentExecutingLine: (line: number | null) => void;
  toggleBreakpoint: (line: number) => void;
  setVariables: (variables: Record<string, unknown>) => void;
  
  toggleCommandPalette: () => void;
}

const findFileById = (files: FileNode[], id: string): FileNode | null => {
  for (const file of files) {
    if (file.id === id) return file;
    if (file.children) {
      const found = findFileById(file.children, id);
      if (found) return found;
    }
  }
  return null;
};

const generateId = () => Math.random().toString(36).substring(2, 9);

const pathToId = (path: string) => path.replace(/[^a-zA-Z0-9]/g, '_');

export const useEditorStore = create<EditorState>((set, get) => ({
  files: [],
  selectedFileId: null,
  expandedFolders: new Set(),
  workspacePath: '',
  
  tabs: [],
  activeTabId: null,
  
  currentContent: '',
  cursorPosition: { line: 1, column: 1 },
  
  sidebarOpen: true,
  sidebarWidth: 260,
  rightSidebarOpen: true,
  rightSidebarWidth: 300,
  bottomPanelOpen: true,
  bottomPanelHeight: 200,
  activeBottomTab: 'output',
  debugPanelOpen: true,
  debugPanelWidth: 300,
  
  output: [
    { type: 'info', content: 'SUSA IDE v1.0 initialized', timestamp: new Date() },
    { type: 'info', content: 'Ready to code!', timestamp: new Date() },
  ],
  problems: [],
  isRunning: false,
  currentExecutingLine: null,
  breakpoints: new Set(),
  variables: {},
  
  commandPaletteOpen: false,
  
  // Initialize workspace
  initializeWorkspace: async () => {
    if (!fileSystemService.isElectronApp()) {
      // Fallback for web version - use sample files
      const sampleFiles: FileNode[] = [
        {
          id: 'sample',
          name: 'sample.susa',
          type: 'file',
          path: 'sample.susa',
          content: `# Welcome to SUSA IDE!
let message = "Hello, SUSA!"
PRINT message

# Try creating your own files using the File menu
int count = 5
LOOP i = 1 FOR count TIMES: START:
    PRINT rt"Count: {i}"
END:`,
        },
      ];
      set({ files: sampleFiles, workspacePath: '' });
      return;
    }

    try {
      // Create a dedicated SUSA workspace directory in user's home
      const homeDir = await fileSystemService.getWorkspacePath();
      const susaWorkspace = `${homeDir}/SUSA_Projects`;
      
      // Create the workspace directory if it doesn't exist
      await fileSystemService.createDirectory(susaWorkspace);
      
      // Create a welcome file if workspace is empty
      const dirResult = await fileSystemService.listDirectory(susaWorkspace);
      if (dirResult.success && dirResult.items && dirResult.items.length === 0) {
        const welcomeFile = `${susaWorkspace}/welcome.susa`;
        await fileSystemService.writeFile(welcomeFile, `# Welcome to SUSA IDE!
# This is your SUSA workspace directory.

let message = "Hello from SUSA!"
PRINT message

# Example: Variables and types
let age = 25
let name = "SUSA Developer"
let isReady = true

PRINT rt"Name: {name}, Age: {age}, Ready: {isReady}"

# Example: Control flow
IF age > 18: START:
    PRINT "You are an adult!"
END:

# Example: Loop
LOOP i = 1 FOR 3 TIMES: START:
    PRINT rt"Count: {i}"
END:

PRINT "Welcome to SUSA programming!"
`);
      }
      
      set({ workspacePath: susaWorkspace });
      
      const { refreshFiles } = get();
      await refreshFiles();
      
      get().addOutput({
        type: 'info',
        content: `Workspace loaded: ${susaWorkspace}`,
        timestamp: new Date(),
      });
    } catch (error) {
      get().addOutput({
        type: 'error',
        content: `Failed to initialize workspace: ${error}`,
        timestamp: new Date(),
      });
    }
  },

  // Refresh files from file system
  refreshFiles: async () => {
    const { workspacePath, loadDirectory } = get();
    if (!workspacePath) return;

    try {
      const files = await loadDirectory(workspacePath);
      set({ files });
    } catch (error) {
      get().addOutput({
        type: 'error',
        content: `Failed to refresh files: ${error}`,
        timestamp: new Date(),
      });
    }
  },

  // Load directory contents
  loadDirectory: async (dirPath: string): Promise<FileNode[]> => {
    const result = await fileSystemService.listDirectory(dirPath);
    
    if (!result.success || !result.items) {
      throw new Error(result.error || 'Failed to load directory');
    }

    const nodes: FileNode[] = [];
    
    for (const item of result.items) {
      const node: FileNode = {
        id: pathToId(item.path),
        name: item.name,
        type: item.isDirectory ? 'folder' : 'file',
        path: item.path,
      };

      if (item.isDirectory) {
        // Don't load children immediately - load on expand
        node.children = [];
      }

      nodes.push(node);
    }

    return nodes.sort((a, b) => {
      // Folders first, then files
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  },

  // Create new file
  createNewFile: async (parentPath?: string, name?: string) => {
    const { workspacePath, refreshFiles } = get();
    
    if (!fileSystemService.isElectronApp()) {
      // For web version, create in-memory file
      if (!name) {
        name = prompt('Enter file name:') || 'untitled.susa';
      }
      
      if (!name.endsWith('.susa')) {
        name += '.susa';
      }
      
      const fileId = generateId();
      const newFile: FileNode = {
        id: fileId,
        name: name,
        type: 'file',
        path: name,
        content: '# New SUSA file\n\n'
      };
      
      const { files, openTab } = get();
      set({ files: [...files, newFile] });
      
      openTab({
        id: fileId,
        name: name,
        path: name,
        content: newFile.content || ''
      });
      
      return;
    }
    
    if (!name) {
      name = prompt('Enter file name:');
      if (!name) return;
    }

    if (!name.endsWith('.susa')) {
      name += '.susa';
    }

    const filePath = parentPath 
      ? `${parentPath}/${name}`
      : `${workspacePath}/${name}`;

    try {
      const result = await fileSystemService.createFile(filePath);
      
      if (result.success) {
        await refreshFiles();
        
        // Open the new file
        const { openFile } = get();
        await openFile(filePath);
        
        get().addOutput({
          type: 'info',
          content: `Created file: ${name}`,
          timestamp: new Date(),
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      get().addOutput({
        type: 'error',
        content: `Failed to create file: ${error}`,
        timestamp: new Date(),
      });
    }
  },

  // Create new folder
  createNewFolder: async (parentPath?: string, name?: string) => {
    const { workspacePath, refreshFiles } = get();
    
    if (!name) {
      name = prompt('Enter folder name:');
      if (!name) return;
    }

    const folderPath = parentPath 
      ? `${parentPath}/${name}`
      : `${workspacePath}/${name}`;

    try {
      const result = await fileSystemService.createDirectory(folderPath);
      
      if (result.success) {
        await refreshFiles();
        
        get().addOutput({
          type: 'info',
          content: `Created folder: ${name}`,
          timestamp: new Date(),
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      get().addOutput({
        type: 'error',
        content: `Failed to create folder: ${error}`,
        timestamp: new Date(),
      });
    }
  },

  // Delete file
  deleteFile: async (filePath: string) => {
    const { refreshFiles, tabs, closeTab } = get();
    
    if (!confirm(`Are you sure you want to delete ${filePath}?`)) {
      return;
    }

    try {
      const result = await fileSystemService.deleteFile(filePath);
      
      if (result.success) {
        // Close tab if open
        const fileId = pathToId(filePath);
        const tab = tabs.find(t => t.id === fileId);
        if (tab) {
          closeTab(fileId);
        }
        
        await refreshFiles();
        
        get().addOutput({
          type: 'info',
          content: `Deleted: ${filePath}`,
          timestamp: new Date(),
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      get().addOutput({
        type: 'error',
        content: `Failed to delete file: ${error}`,
        timestamp: new Date(),
      });
    }
  },

  // Rename file
  renameFile: async (oldPath: string, newName: string) => {
    const { refreshFiles } = get();
    
    if (!fileSystemService.isElectronApp()) {
      // For web version, just update in-memory files
      const { files, tabs, activeTabId } = get();
      const oldFileId = pathToId(oldPath);
      const newFileId = pathToId(newName);
      
      // Update files array
      const updateFiles = (nodes: FileNode[]): FileNode[] => {
        return nodes.map(node => {
          if (node.id === oldFileId) {
            return { ...node, id: newFileId, name: newName, path: newName };
          }
          if (node.children) {
            return { ...node, children: updateFiles(node.children) };
          }
          return node;
        });
      };
      
      // Update tabs
      const updatedTabs = tabs.map(tab => {
        if (tab.id === oldFileId) {
          return {
            ...tab,
            id: newFileId,
            name: newName,
            path: newName
          };
        }
        return tab;
      });
      
      const newActiveTabId = activeTabId === oldFileId ? newFileId : activeTabId;
      
      set({ 
        files: updateFiles(files),
        tabs: updatedTabs,
        activeTabId: newActiveTabId
      });
      
      get().addOutput({
        type: 'info',
        content: `Renamed to: ${newName}`,
        timestamp: new Date(),
      });
      return;
    }
    
    // For desktop app, handle file system rename
    try {
      // Validate new name
      if (!newName || !newName.trim()) {
        throw new Error('Invalid file name');
      }
      
      const trimmedName = newName.trim();
      
      // Handle both Windows and Unix path separators
      const separator = oldPath.includes('\\') ? '\\' : '/';
      const directory = oldPath.substring(0, oldPath.lastIndexOf(separator));
      const newPath = directory ? `${directory}${separator}${trimmedName}` : trimmedName;
      
      console.log('Renaming file:', { oldPath, newPath, newName: trimmedName });
      
      const result = await fileSystemService.renameFile(oldPath, newPath);
      
      if (result.success) {
        // Update any open tabs with the new path
        const { tabs, activeTabId } = get();
        const oldFileId = pathToId(oldPath);
        const newFileId = pathToId(newPath);
        
        const updatedTabs = tabs.map(tab => {
          if (tab.id === oldFileId) {
            return {
              ...tab,
              id: newFileId,
              name: trimmedName,
              path: newPath
            };
          }
          return tab;
        });
        
        const newActiveTabId = activeTabId === oldFileId ? newFileId : activeTabId;
        
        set({ 
          tabs: updatedTabs,
          activeTabId: newActiveTabId
        });
        
        await refreshFiles();
        
        get().addOutput({
          type: 'info',
          content: `Successfully renamed to: ${trimmedName}`,
          timestamp: new Date(),
        });
      } else {
        throw new Error(result.error || 'Rename operation failed');
      }
    } catch (error) {
      console.error('Rename error:', error);
      get().addOutput({
        type: 'error',
        content: `Failed to rename file: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
      });
      
      // Show user-friendly error message
      if (typeof window !== 'undefined' && window.alert) {
        window.alert(`Failed to rename file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  },

  // Open file
  openFile: async (filePath: string) => {
    try {
      const result = await fileSystemService.readFile(filePath);
      
      if (result.success && result.content !== undefined) {
        const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
        const fileId = pathToId(filePath);
        
        const { openTab } = get();
        openTab({
          id: fileId,
          name: fileName,
          path: filePath,
          content: result.content,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      get().addOutput({
        type: 'error',
        content: `Failed to open file: ${error}`,
        timestamp: new Date(),
      });
    }
  },

  // Save file
  saveFile: async (filePath: string, content: string) => {
    try {
      const result = await fileSystemService.writeFile(filePath, content);
      
      if (result.success) {
        // Mark tab as not dirty
        const { tabs } = get();
        const fileId = pathToId(filePath);
        const newTabs = tabs.map(tab => 
          tab.id === fileId ? { ...tab, isDirty: false } : tab
        );
        set({ tabs: newTabs });
        
        get().addOutput({
          type: 'info',
          content: `Saved: ${filePath}`,
          timestamp: new Date(),
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      get().addOutput({
        type: 'error',
        content: `Failed to save file: ${error}`,
        timestamp: new Date(),
      });
    }
  },

  // Save current file
  saveCurrentFile: async () => {
    const { activeTabId, tabs, currentContent } = get();
    
    if (!activeTabId) return;
    
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (!activeTab) return;

    const { saveFile } = get();
    await saveFile(activeTab.path, currentContent);
  },
  
  selectFile: (id) => {
    const { files } = get();
    const file = findFileById(files, id);
    
    if (file && file.type === 'file') {
      set({ selectedFileId: id });
      const { openFile } = get();
      openFile(file.path);
    }
  },
  
  toggleFolder: async (id) => {
    const { expandedFolders, files, loadDirectory } = get();
    const newExpanded = new Set(expandedFolders);
    
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
      
      // Load folder contents if not already loaded
      const file = findFileById(files, id);
      if (file && file.type === 'folder' && (!file.children || file.children.length === 0)) {
        try {
          const children = await loadDirectory(file.path);
          
          const updateChildren = (nodes: FileNode[]): FileNode[] => {
            return nodes.map((node) => {
              if (node.id === id) {
                return { ...node, children };
              }
              if (node.children) {
                return { ...node, children: updateChildren(node.children) };
              }
              return node;
            });
          };
          
          set({ files: updateChildren(files) });
        } catch (error) {
          get().addOutput({
            type: 'error',
            content: `Failed to load folder: ${error}`,
            timestamp: new Date(),
          });
        }
      }
    }
    
    set({ expandedFolders: newExpanded });
  },
  
  openTab: (file) => {
    const { tabs } = get();
    const existing = tabs.find((t) => t.id === file.id);
    
    if (!existing) {
      set({
        tabs: [...tabs, { ...file, isDirty: false }],
        activeTabId: file.id,
        currentContent: file.content,
      });
    } else {
      set({
        activeTabId: file.id,
        currentContent: existing.content,
      });
    }
  },
  
  closeTab: (id) => {
    const { tabs, activeTabId } = get();
    const index = tabs.findIndex((t) => t.id === id);
    const newTabs = tabs.filter((t) => t.id !== id);
    
    let newActiveTabId = activeTabId;
    if (activeTabId === id) {
      newActiveTabId = newTabs[Math.min(index, newTabs.length - 1)]?.id || null;
    }
    
    set({
      tabs: newTabs,
      activeTabId: newActiveTabId,
      currentContent: newActiveTabId 
        ? newTabs.find((t) => t.id === newActiveTabId)?.content || ''
        : '',
    });
  },
  
  setActiveTab: (id) => {
    const { tabs } = get();
    const tab = tabs.find((t) => t.id === id);
    if (tab) {
      set({ activeTabId: id, currentContent: tab.content });
    }
  },
  
  updateTabContent: (id, content) => {
    const { tabs } = get();
    
    const newTabs = tabs.map((tab) =>
      tab.id === id ? { ...tab, content, isDirty: true } : tab
    );
    
    set({ tabs: newTabs, currentContent: content });
  },
  
  setCurrentContent: (content) => set({ currentContent: content }),
  setCursorPosition: (pos) => set({ cursorPosition: pos }),
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarWidth: (width) => set({ sidebarWidth: width }),
  toggleRightSidebar: () => set((state) => ({ rightSidebarOpen: !state.rightSidebarOpen })),
  setRightSidebarWidth: (width) => set({ rightSidebarWidth: width }),
  toggleBottomPanel: () => set((state) => ({ bottomPanelOpen: !state.bottomPanelOpen })),
  setBottomPanelHeight: (height) => set({ bottomPanelHeight: height }),
  setActiveBottomTab: (tab) => set({ activeBottomTab: tab }),
  toggleDebugPanel: () => set((state) => ({ debugPanelOpen: !state.debugPanelOpen })),
  setDebugPanelWidth: (width) => set({ debugPanelWidth: width }),
  
  addOutput: (line) => set((state) => ({ output: [...state.output, line] })),
  clearOutput: () => set({ output: [] }),
  setProblems: (problems) => set({ problems }),
  setIsRunning: (running) => set({ isRunning: running }),
  setCurrentExecutingLine: (line) => set({ currentExecutingLine: line }),
  toggleBreakpoint: (line) => {
    const { breakpoints } = get();
    const newBreakpoints = new Set(breakpoints);
    if (newBreakpoints.has(line)) {
      newBreakpoints.delete(line);
    } else {
      newBreakpoints.add(line);
    }
    set({ breakpoints: newBreakpoints });
  },
  setVariables: (variables) => set({ variables }),
  
  toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
  
  setWorkspacePath: (path) => set({ workspacePath: path }),
}));
