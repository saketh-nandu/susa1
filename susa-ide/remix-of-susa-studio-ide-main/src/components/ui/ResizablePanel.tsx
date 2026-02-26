/**
 * Production Resizable Panel System for SUSA IDE
 * Supports horizontal and vertical resizing with constraints and persistence
 */

import React, { useState, useRef, useCallback, useEffect, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface ResizeConstraints {
  minSize: number;
  maxSize: number;
}

export interface PanelConfig {
  id: string;
  defaultSize: number;
  minSize?: number;
  maxSize?: number;
  collapsible?: boolean;
  resizable?: boolean;
}

interface ResizablePanelProps {
  children: ReactNode;
  className?: string;
  direction: 'horizontal' | 'vertical';
  panels: PanelConfig[];
  onResize?: (panelId: string, size: number) => void;
  persistKey?: string; // Key for localStorage persistence
}

interface PanelState {
  size: number;
  isCollapsed: boolean;
}

export const ResizablePanel: React.FC<ResizablePanelProps> = ({
  children,
  className,
  direction,
  panels,
  onResize,
  persistKey
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [panelStates, setPanelStates] = useState<Map<string, PanelState>>(new Map());
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialSizes, setInitialSizes] = useState<Map<string, number>>(new Map());

  // Initialize panel states
  useEffect(() => {
    const states = new Map<string, PanelState>();
    
    panels.forEach(panel => {
      let size = panel.defaultSize;
      
      // Load from localStorage if persistKey is provided
      if (persistKey) {
        const saved = localStorage.getItem(`${persistKey}_${panel.id}`);
        if (saved) {
          const parsedSize = parseFloat(saved);
          if (!isNaN(parsedSize)) {
            size = Math.max(panel.minSize || 0, Math.min(panel.maxSize || Infinity, parsedSize));
          }
        }
      }
      
      states.set(panel.id, {
        size,
        isCollapsed: false
      });
    });
    
    setPanelStates(states);
  }, [panels, persistKey]);

  // Save to localStorage when panel sizes change
  useEffect(() => {
    if (persistKey) {
      panelStates.forEach((state, panelId) => {
        localStorage.setItem(`${persistKey}_${panelId}`, state.size.toString());
      });
    }
  }, [panelStates, persistKey]);

  // Handle mouse down on resize handle
  const handleMouseDown = useCallback((e: React.MouseEvent, panelId: string) => {
    e.preventDefault();
    
    // Check if the panel is resizable
    const panel = panels.find(p => p.id === panelId);
    if (!panel || panel.resizable === false) {
      return; // Don't allow resizing if disabled
    }
    
    setIsDragging(panelId);
    setDragStart({ x: e.clientX, y: e.clientY });
    
    // Store initial sizes
    const sizes = new Map<string, number>();
    panelStates.forEach((state, id) => {
      sizes.set(id, state.size);
    });
    setInitialSizes(sizes);
    
    document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';
  }, [direction, panelStates, panels]);

  // Handle mouse move during drag
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    
    const delta = direction === 'horizontal' 
      ? e.clientX - dragStart.x 
      : e.clientY - dragStart.y;
    
    const containerSize = direction === 'horizontal' 
      ? containerRect.width 
      : containerRect.height;

    // Calculate new sizes
    const newStates = new Map(panelStates);
    const currentPanel = panels.find(p => p.id === isDragging);
    const currentState = panelStates.get(isDragging);
    
    if (currentPanel && currentState) {
      const initialSize = initialSizes.get(isDragging) || currentState.size;
      const deltaPercent = (delta / containerSize) * 100;
      let newSize = initialSize + deltaPercent;
      
      // Apply constraints
      newSize = Math.max(currentPanel.minSize || 10, newSize);
      newSize = Math.min(currentPanel.maxSize || 90, newSize);
      
      // Find the next panel to adjust
      const currentIndex = panels.findIndex(p => p.id === isDragging);
      const nextPanel = panels[currentIndex + 1];
      
      if (nextPanel) {
        const nextState = panelStates.get(nextPanel.id);
        if (nextState) {
          const nextInitialSize = initialSizes.get(nextPanel.id) || nextState.size;
          let nextNewSize = nextInitialSize - deltaPercent;
          
          // Apply constraints to next panel
          nextNewSize = Math.max(nextPanel.minSize || 10, nextNewSize);
          nextNewSize = Math.min(nextPanel.maxSize || 90, nextNewSize);
          
          // Update both panels
          newStates.set(isDragging, {
            ...currentState,
            size: newSize
          });
          
          newStates.set(nextPanel.id, {
            ...nextState,
            size: nextNewSize
          });
        }
      }
      
      setPanelStates(newStates);
      onResize?.(isDragging, newSize);
      if (nextPanel) {
        const nextState = newStates.get(nextPanel.id);
        if (nextState) {
          onResize?.(nextPanel.id, nextState.size);
        }
      }
    }
  }, [isDragging, dragStart, direction, panelStates, panels, initialSizes, onResize]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
    setDragStart({ x: 0, y: 0 });
    setInitialSizes(new Map());
    
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Toggle panel collapse
  const toggleCollapse = useCallback((panelId: string) => {
    const newStates = new Map(panelStates);
    const currentState = newStates.get(panelId);
    
    if (currentState) {
      newStates.set(panelId, {
        ...currentState,
        isCollapsed: !currentState.isCollapsed
      });
      setPanelStates(newStates);
    }
  }, [panelStates]);

  // Render children with panel props
  const renderChildren = () => {
    return React.Children.map(children, (child, index) => {
      if (!React.isValidElement(child)) return child;
      
      const panel = panels[index];
      if (!panel) return child;
      
      const state = panelStates.get(panel.id);
      if (!state) return child;
      
      // For the last panel, use flex-grow to fill remaining space
      const isLastPanel = index === panels.length - 1;
      
      const style = direction === 'horizontal' 
        ? { 
            width: state.isCollapsed ? '0px' : (isLastPanel ? 'auto' : `${state.size}%`),
            minWidth: state.isCollapsed ? '0px' : `${panel.minSize || 10}%`,
            maxWidth: state.isCollapsed ? '0px' : `${panel.maxSize || 90}%`,
            flexGrow: isLastPanel ? 1 : 0,
            flexShrink: isLastPanel ? 1 : 0
          }
        : { 
            height: state.isCollapsed ? '0px' : (isLastPanel ? 'auto' : `${state.size}%`),
            minHeight: state.isCollapsed ? '0px' : `${panel.minSize || 10}%`,
            maxHeight: state.isCollapsed ? '0px' : `${panel.maxSize || 90}%`,
            flexGrow: isLastPanel ? 1 : 0,
            flexShrink: isLastPanel ? 1 : 0
          };
      
      return (
        <div
          key={panel.id}
          className={cn(
            'relative overflow-hidden transition-all duration-200 flex-shrink-0',
            state.isCollapsed && 'min-w-0 min-h-0'
          )}
          style={style}
        >
          <div 
            className="w-full h-full overflow-auto"
            style={{
              width: '100%',
              height: '100%',
              minWidth: 0,
              minHeight: 0
            }}
          >
            {React.cloneElement(child, {
              ...child.props,
              style: {
                ...child.props.style,
                width: '100%',
                height: '100%',
                minWidth: 0,
                minHeight: 0
              }
            })}
          </div>
          
          {/* Resize handle - only show on left/top edge for last panel */}
          {panel.resizable !== false && index < panels.length - 1 && (
            <div
              className={cn(
                'absolute bg-border hover:bg-primary/20 transition-colors z-10',
                direction === 'horizontal' 
                  ? 'right-0 top-0 w-1 h-full cursor-col-resize hover:w-2' 
                  : 'bottom-0 left-0 w-full h-1 cursor-row-resize hover:h-2',
                isDragging === panel.id && 'bg-primary/40'
              )}
              onMouseDown={(e) => handleMouseDown(e, panel.id)}
            />
          )}
          
          {/* Resize handle for last panel - on left/top edge */}
          {panel.resizable !== false && index === panels.length - 1 && index > 0 && (
            <div
              className={cn(
                'absolute bg-border hover:bg-primary/20 transition-colors z-10',
                direction === 'horizontal' 
                  ? 'left-0 top-0 w-1 h-full cursor-col-resize hover:w-2' 
                  : 'top-0 left-0 w-full h-1 cursor-row-resize hover:h-2',
                isDragging === panels[index - 1].id && 'bg-primary/40'
              )}
              onMouseDown={(e) => handleMouseDown(e, panels[index - 1].id)}
            />
          )}
          
          {/* Collapse button */}
          {panel.collapsible && (
            <button
              onClick={() => toggleCollapse(panel.id)}
              className={cn(
                'absolute z-20 p-1 bg-background border border-border rounded hover:bg-muted transition-colors',
                direction === 'horizontal' 
                  ? 'right-2 top-2' 
                  : 'left-2 bottom-2'
              )}
              title={state.isCollapsed ? 'Expand' : 'Collapse'}
            >
              <div className={cn(
                'w-2 h-2 border-r-2 border-b-2 border-foreground transition-transform',
                state.isCollapsed 
                  ? direction === 'horizontal' ? 'rotate-[-135deg]' : 'rotate-45'
                  : direction === 'horizontal' ? 'rotate-45' : 'rotate-[-135deg]'
              )} />
            </button>
          )}
        </div>
      );
    });
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex w-full h-full',
        direction === 'horizontal' ? 'flex-row' : 'flex-col',
        className
      )}
    >
      {renderChildren()}
    </div>
  );
};

// Specialized components for common layouts
export const HorizontalResizableContainer: React.FC<{
  children: ReactNode;
  className?: string;
  panels: PanelConfig[];
  onResize?: (panelId: string, size: number) => void;
  persistKey?: string;
}> = ({ children, className, panels, onResize, persistKey }) => (
  <ResizablePanel
    direction="horizontal"
    panels={panels}
    onResize={onResize}
    persistKey={persistKey}
    className={className}
  >
    {children}
  </ResizablePanel>
);

export const VerticalResizableContainer: React.FC<{
  children: ReactNode;
  className?: string;
  panels: PanelConfig[];
  onResize?: (panelId: string, size: number) => void;
  persistKey?: string;
}> = ({ children, className, panels, onResize, persistKey }) => (
  <ResizablePanel
    direction="vertical"
    panels={panels}
    onResize={onResize}
    persistKey={persistKey}
    className={className}
  >
    {children}
  </ResizablePanel>
);

// Hook for managing panel sizes
export const usePanelSizes = (persistKey?: string) => {
  const [sizes, setSizes] = useState<Map<string, number>>(new Map());

  const updateSize = useCallback((panelId: string, size: number) => {
    setSizes(prev => new Map(prev.set(panelId, size)));
    
    if (persistKey) {
      localStorage.setItem(`${persistKey}_${panelId}`, size.toString());
    }
  }, [persistKey]);

  const getSize = useCallback((panelId: string, defaultSize: number = 50): number => {
    const stored = sizes.get(panelId);
    if (stored !== undefined) return stored;
    
    if (persistKey) {
      const saved = localStorage.getItem(`${persistKey}_${panelId}`);
      if (saved) {
        const parsedSize = parseFloat(saved);
        if (!isNaN(parsedSize)) return parsedSize;
      }
    }
    
    return defaultSize;
  }, [sizes, persistKey]);

  return { updateSize, getSize, sizes };
};