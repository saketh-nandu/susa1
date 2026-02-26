import { create } from 'zustand';

export type DebuggerState = 'idle' | 'running' | 'paused' | 'stepping';

export interface StackFrame {
  name: string;
  line: number;
  column: number;
}

export interface WatchVariable {
  name: string;
  value: unknown;
  type: string;
}

interface DebuggerStore {
  // State
  state: DebuggerState;
  currentLine: number | null;
  breakpoints: Set<number>;
  variables: Map<string, WatchVariable>;
  callStack: StackFrame[];
  isPanelOpen: boolean;
  
  // Step mode
  stepMode: 'over' | 'into' | 'out' | null;
  stepResolve: (() => void) | null;
  
  // Actions
  setState: (state: DebuggerState) => void;
  setCurrentLine: (line: number | null) => void;
  
  toggleBreakpoint: (line: number) => void;
  clearBreakpoints: () => void;
  hasBreakpoint: (line: number) => boolean;
  
  setVariables: (vars: Record<string, unknown>) => void;
  clearVariables: () => void;
  
  pushStackFrame: (frame: StackFrame) => void;
  popStackFrame: () => void;
  clearCallStack: () => void;
  
  togglePanel: () => void;
  
  // Debug controls
  startDebug: () => void;
  stopDebug: () => void;
  continueExecution: () => void;
  stepOver: () => void;
  stepInto: () => void;
  stepOut: () => void;
  
  // Internal
  setStepResolve: (resolve: (() => void) | null) => void;
  resolveStep: () => void;
}

const getValueType = (value: unknown): string => {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (Array.isArray(value)) return 'array';
  return typeof value;
};

export const useDebuggerStore = create<DebuggerStore>((set, get) => ({
  state: 'idle',
  currentLine: null,
  breakpoints: new Set(),
  variables: new Map(),
  callStack: [],
  isPanelOpen: true,
  stepMode: null,
  stepResolve: null,

  setState: (state) => set({ state }),
  setCurrentLine: (line) => set({ currentLine: line }),

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

  clearBreakpoints: () => set({ breakpoints: new Set() }),
  
  hasBreakpoint: (line) => get().breakpoints.has(line),

  setVariables: (vars) => {
    const variableMap = new Map<string, WatchVariable>();
    Object.entries(vars).forEach(([name, value]) => {
      variableMap.set(name, {
        name,
        value,
        type: getValueType(value),
      });
    });
    set({ variables: variableMap });
  },

  clearVariables: () => set({ variables: new Map() }),

  pushStackFrame: (frame) => {
    set((state) => ({ callStack: [...state.callStack, frame] }));
  },

  popStackFrame: () => {
    set((state) => ({ callStack: state.callStack.slice(0, -1) }));
  },

  clearCallStack: () => set({ callStack: [] }),

  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),

  startDebug: () => {
    set({
      state: 'running',
      currentLine: null,
      variables: new Map(),
      callStack: [{ name: 'main', line: 1, column: 1 }],
    });
  },

  stopDebug: () => {
    const { stepResolve } = get();
    if (stepResolve) stepResolve();
    set({
      state: 'idle',
      currentLine: null,
      stepMode: null,
      stepResolve: null,
    });
  },

  continueExecution: () => {
    const { stepResolve } = get();
    if (stepResolve) {
      set({ state: 'running', stepMode: null });
      stepResolve();
      set({ stepResolve: null });
    }
  },

  stepOver: () => {
    const { stepResolve } = get();
    if (stepResolve) {
      set({ stepMode: 'over' });
      stepResolve();
      set({ stepResolve: null });
    }
  },

  stepInto: () => {
    const { stepResolve } = get();
    if (stepResolve) {
      set({ stepMode: 'into' });
      stepResolve();
      set({ stepResolve: null });
    }
  },

  stepOut: () => {
    const { stepResolve } = get();
    if (stepResolve) {
      set({ stepMode: 'out' });
      stepResolve();
      set({ stepResolve: null });
    }
  },

  setStepResolve: (resolve) => set({ stepResolve: resolve }),
  
  resolveStep: () => {
    const { stepResolve } = get();
    if (stepResolve) {
      stepResolve();
      set({ stepResolve: null });
    }
  },
}));
