/**
 * Production Console Engine for SUSA IDE
 * Handles non-blocking input, async execution, and real-time rendering
 */

import { eventBus } from '../architecture/EventBus';

export interface ConsoleMessage {
  id: string;
  type: 'input' | 'output' | 'error' | 'system' | 'prompt';
  content: string;
  timestamp: number;
  metadata?: {
    line?: number;
    column?: number;
    executionId?: string;
  };
}

export interface ExecutionContext {
  id: string;
  state: 'running' | 'waiting_input' | 'completed' | 'error';
  currentLine: number;
  variables: Map<string, any>;
  callStack: string[];
  pendingInput?: {
    resolve: (value: string) => void;
    reject: (error: Error) => void;
    prompt?: string;
    timeout?: NodeJS.Timeout;
  };
}

export interface InputRequest {
  prompt?: string;
  timeout?: number;
  validator?: (input: string) => boolean | string;
}

export class ConsoleEngine {
  private messages: ConsoleMessage[] = [];
  private executionContext: ExecutionContext | null = null;
  private messageListeners: Set<(messages: ConsoleMessage[]) => void> = new Set();
  private inputRequestQueue: Array<{
    request: InputRequest;
    resolve: (value: string) => void;
    reject: (error: Error) => void;
  }> = [];

  constructor() {
    this.addSystemMessage('SUSA Console v1.0 - Ready');
    this.setupEventListeners();
  }

  /**
   * Setup event bus listeners
   */
  private setupEventListeners(): void {
    eventBus.on('execution.output', (event) => {
      this.addOutput(event.payload.content, event.payload.metadata);
    });

    eventBus.on('execution.error', (event) => {
      this.addError(event.payload.message, event.payload.metadata);
    });

    eventBus.on('execution.input_request', (event) => {
      this.handleInputRequest(event.payload);
    });

    eventBus.on('console.clear', () => {
      this.clearMessages();
    });
  }

  /**
   * Subscribe to console message updates
   */
  onMessagesUpdate(callback: (messages: ConsoleMessage[]) => void): () => void {
    this.messageListeners.add(callback);
    // Send current messages immediately
    callback([...this.messages]);
    
    return () => {
      this.messageListeners.delete(callback);
    };
  }

  /**
   * Add a message to the console (private method)
   */
  private addMessageInternal(message: Omit<ConsoleMessage, 'id' | 'timestamp'>): void {
    const newMessage: ConsoleMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };

    this.messages.push(newMessage);
    this.notifyListeners();
    
    // Emit console message event
    eventBus.emit('console.message', newMessage);
  }

  /**
   * Add a message to the console (public method)
   */
  addMessage(message: Omit<ConsoleMessage, 'id' | 'timestamp'>): void {
    const newMessage: ConsoleMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };

    this.messages.push(newMessage);
    this.notifyListeners();
    
    // Emit console message event
    eventBus.emit('console.message', newMessage);
  }

  /**
   * Notify all listeners of message updates
   */
  private notifyListeners(): void {
    const messagesCopy = [...this.messages];
    this.messageListeners.forEach(callback => {
      try {
        callback(messagesCopy);
      } catch (error) {
        console.error('Console listener error:', error);
      }
    });
  }

  /**
   * Add system message
   */
  addSystemMessage(content: string): void {
    this.addMessageInternal({
      type: 'system',
      content: `[SYSTEM] ${content}`
    });
  }

  /**
   * Add output message
   */
  addOutput(content: string, metadata?: ConsoleMessage['metadata']): void {
    this.addMessageInternal({
      type: 'output',
      content,
      metadata
    });
  }

  /**
   * Add error message
   */
  addError(content: string, metadata?: ConsoleMessage['metadata']): void {
    this.addMessageInternal({
      type: 'error',
      content: `[ERROR] ${content}`,
      metadata
    });
  }

  /**
   * Add input message
   */
  addInput(content: string): void {
    this.addMessageInternal({
      type: 'input',
      content: `> ${content}`
    });
  }

  /**
   * Add prompt message
   */
  addPrompt(content: string): void {
    this.addMessageInternal({
      type: 'prompt',
      content
    });
  }

  /**
   * Request input from user (non-blocking)
   */
  async requestInput(request: InputRequest = {}): Promise<string> {
    return new Promise((resolve, reject) => {
      // Add to request queue
      this.inputRequestQueue.push({ request, resolve, reject });
      
      // Show prompt if provided
      if (request.prompt) {
        this.addPrompt(request.prompt);
      }
      
      // Set timeout if provided
      if (request.timeout) {
        setTimeout(() => {
          reject(new Error('Input timeout'));
        }, request.timeout);
      }
      
      // Process queue
      this.processInputQueue();
    });
  }

  /**
   * Submit user input
   */
  submitInput(input: string): void {
    this.addInput(input);
    
    // Process current input request
    if (this.inputRequestQueue.length > 0) {
      const { request, resolve, reject } = this.inputRequestQueue.shift()!;
      
      // Validate input if validator provided
      if (request.validator) {
        const validation = request.validator(input);
        if (validation !== true) {
          const errorMessage = typeof validation === 'string' ? validation : 'Invalid input';
          this.addError(errorMessage);
          // Re-add request to queue
          this.inputRequestQueue.unshift({ request, resolve, reject });
          return;
        }
      }
      
      // Clear timeout if exists
      if (this.executionContext?.pendingInput?.timeout) {
        clearTimeout(this.executionContext.pendingInput.timeout);
      }
      
      // Resolve with input
      resolve(input);
      
      // Emit input response event
      eventBus.emit('execution.input_response', { input });
      
      // Update execution context
      if (this.executionContext) {
        this.executionContext.state = 'running';
        this.executionContext.pendingInput = undefined;
      }
    }
  }

  /**
   * Process input request queue
   */
  private processInputQueue(): void {
    if (this.inputRequestQueue.length > 0 && !this.isWaitingForInput()) {
      // Update execution context to waiting for input
      if (this.executionContext) {
        this.executionContext.state = 'waiting_input';
      }
    }
  }

  /**
   * Handle input request from execution engine
   */
  private handleInputRequest(payload: any): void {
    const { prompt, timeout, validator } = payload;
    this.requestInput({ prompt, timeout, validator });
  }

  /**
   * Check if console is waiting for input
   */
  isWaitingForInput(): boolean {
    return this.inputRequestQueue.length > 0 || 
           (this.executionContext?.state === 'waiting_input');
  }

  /**
   * Clear all messages
   */
  clearMessages(): void {
    this.messages = [];
    this.notifyListeners();
  }

  /**
   * Get current execution context
   */
  getExecutionContext(): ExecutionContext | null {
    return this.executionContext;
  }

  /**
   * Set execution context
   */
  setExecutionContext(context: ExecutionContext | null): void {
    this.executionContext = context;
  }

  /**
   * Create new execution context
   */
  createExecutionContext(): ExecutionContext {
    const context: ExecutionContext = {
      id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      state: 'running',
      currentLine: 0,
      variables: new Map(),
      callStack: []
    };
    
    this.setExecutionContext(context);
    return context;
  }

  /**
   * Complete execution
   */
  completeExecution(success: boolean = true): void {
    if (this.executionContext) {
      this.executionContext.state = success ? 'completed' : 'error';
      
      // Clear any pending input
      if (this.executionContext.pendingInput) {
        if (this.executionContext.pendingInput.timeout) {
          clearTimeout(this.executionContext.pendingInput.timeout);
        }
        this.executionContext.pendingInput.reject(new Error('Execution completed'));
        this.executionContext.pendingInput = undefined;
      }
    }
    
    // Clear input request queue
    this.inputRequestQueue.forEach(({ reject }) => {
      reject(new Error('Execution completed'));
    });
    this.inputRequestQueue = [];
    
    // Emit completion event
    eventBus.emit('execution.complete', { success });
  }
}

// Export singleton instance
export const consoleEngine = new ConsoleEngine();