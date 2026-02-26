/**
 * Production Event Bus for SUSA IDE
 * Handles all communication between UI, Runtime, Console, and Debugger
 */

export type EventType = 
  | 'execution.start'
  | 'execution.output'
  | 'execution.input_request'
  | 'execution.input_response'
  | 'execution.complete'
  | 'execution.error'
  | 'debug.breakpoint_hit'
  | 'debug.step_complete'
  | 'debug.variable_update'
  | 'console.message'
  | 'console.clear'
  | 'ui.panel_resize'
  | 'ui.theme_change';

export interface Event<T = any> {
  type: EventType;
  payload: T;
  timestamp: number;
  id: string;
}

export interface EventListener<T = any> {
  (event: Event<T>): void | Promise<void>;
}

export class EventBus {
  private static instance: EventBus;
  private listeners: Map<EventType, Set<EventListener>> = new Map();
  private eventHistory: Event[] = [];
  private maxHistorySize = 1000;

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Subscribe to events
   */
  on<T = any>(eventType: EventType, listener: EventListener<T>): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    
    this.listeners.get(eventType)!.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.get(eventType)?.delete(listener);
    };
  }

  /**
   * Subscribe to events once
   */
  once<T = any>(eventType: EventType, listener: EventListener<T>): () => void {
    const wrappedListener = (event: Event<T>) => {
      listener(event);
      this.off(eventType, wrappedListener);
    };
    
    return this.on(eventType, wrappedListener);
  }

  /**
   * Unsubscribe from events
   */
  off<T = any>(eventType: EventType, listener: EventListener<T>): void {
    this.listeners.get(eventType)?.delete(listener);
  }

  /**
   * Emit an event
   */
  async emit<T = any>(eventType: EventType, payload: T): Promise<void> {
    const event: Event<T> = {
      type: eventType,
      payload,
      timestamp: Date.now(),
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    // Add to history
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }

    // Notify listeners
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      const promises = Array.from(listeners).map(listener => {
        try {
          return Promise.resolve(listener(event));
        } catch (error) {
          console.error(`Event listener error for ${eventType}:`, error);
          return Promise.resolve();
        }
      });
      
      await Promise.all(promises);
    }
  }

  /**
   * Get event history
   */
  getHistory(eventType?: EventType): Event[] {
    if (eventType) {
      return this.eventHistory.filter(event => event.type === eventType);
    }
    return [...this.eventHistory];
  }

  /**
   * Clear event history
   */
  clearHistory(): void {
    this.eventHistory = [];
  }

  /**
   * Get active listeners count
   */
  getListenerCount(eventType?: EventType): number {
    if (eventType) {
      return this.listeners.get(eventType)?.size || 0;
    }
    
    let total = 0;
    for (const listeners of this.listeners.values()) {
      total += listeners.size;
    }
    return total;
  }
}

// Export singleton instance
export const eventBus = EventBus.getInstance();