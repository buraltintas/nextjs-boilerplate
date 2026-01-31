/**
 * Socket Manager
 * 
 * Centralized socket lifecycle management
 * - Connection / disconnection
 * - Authentication
 * - Reconnection on auth changes
 * - Event handling
 * - Status notifications
 */

import type { Socket } from 'socket.io-client';
import {
  SocketStatus,
  SocketEventCallback,
  SocketConfig,
  ISocketManager,
} from './types';
import {
  createSocketClient,
  authenticateSocket,
  disconnectSocket,
} from './client';
import {
  fetchSocketAuthToken,
  refreshSocketAuthToken,
} from './auth';
import { logInfo, logWarn, logError } from '@/infra/observability';

/**
 * Default socket configuration
 */
const DEFAULT_CONFIG: SocketConfig = {
  url: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000',
  autoConnect: false, // We control connection manually
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000,
};

class SocketManager implements ISocketManager {
  private socket: Socket | null = null;
  private status: SocketStatus = SocketStatus.DISCONNECTED;
  private config: SocketConfig;
  private listeners: Array<(status: SocketStatus) => void> = [];
  private authToken: string | null = null;
  private reconnectOnAuthChange = false;

  constructor(config: Partial<SocketConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };

    // SSR guard - absolutely critical
    if (typeof window === 'undefined') {
      logWarn('[SocketManager] Attempted to create manager during SSR - disabled');
      return;
    }

    // Listen for auth changes (via storage events or custom events)
    if (typeof window !== 'undefined') {
      window.addEventListener('auth:logout', this.handleLogout);
      window.addEventListener('auth:login', this.handleLogin);
    }
  }

  /**
   * Connect to socket server
   */
  async connect(): Promise<void> {
    // SSR guard
    if (typeof window === 'undefined') {
      logWarn('[SocketManager] Cannot connect during SSR');
      return;
    }

    // Already connected
    if (this.socket?.connected) {
      logInfo('[SocketManager] Already connected');
      return;
    }

    try {
      this.updateStatus(SocketStatus.CONNECTING);

      // Fetch auth token
      this.authToken = await fetchSocketAuthToken();

      if (!this.authToken) {
        logWarn('[SocketManager] No auth token - connecting as guest');
      }

      // Create socket client
      this.socket = createSocketClient(this.config);

      if (!this.socket) {
        throw new Error('Failed to create socket client');
      }

      // Set up event handlers
      this.setupSocketHandlers();

      // Connect
      this.socket.connect();

      // Wait for connection
      await this.waitForConnection();

      // Authenticate if we have a token
      if (this.authToken) {
        const authSuccess = await authenticateSocket(this.socket, this.authToken);
        if (!authSuccess) {
          logError('[SocketManager] Authentication failed - disconnecting');
          this.disconnect();
          this.updateStatus(SocketStatus.ERROR);
          return;
        }
      }

      this.updateStatus(SocketStatus.CONNECTED);
      logInfo('[SocketManager] Successfully connected and authenticated');
    } catch (error) {
      logError('[SocketManager] Connection failed', { error });
      this.updateStatus(SocketStatus.ERROR);
      throw error;
    }
  }

  /**
   * Disconnect from socket server
   */
  disconnect(): void {
    if (this.socket) {
      disconnectSocket(this.socket);
      this.socket = null;
      this.authToken = null;
      this.updateStatus(SocketStatus.DISCONNECTED);
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Get current status
   */
  getStatus(): SocketStatus {
    return this.status;
  }

  /**
   * Subscribe to socket event
   */
  on<T = any>(event: string, callback: SocketEventCallback<T>): void {
    if (!this.socket) {
      logWarn('[SocketManager] Cannot subscribe - not initialized');
      return;
    }

    this.socket.on(event, callback);
  }

  /**
   * Unsubscribe from socket event
   */
  off(event: string, callback?: SocketEventCallback): void {
    if (!this.socket) return;

    if (callback) {
      this.socket.off(event, callback);
    } else {
      this.socket.off(event);
    }
  }

  /**
   * Emit socket event
   */
  emit(event: string, data?: any): void {
    if (!this.socket?.connected) {
      logWarn('[SocketManager] Cannot emit - not connected');
      return;
    }

    this.socket.emit(event, data);
  }

  /**
   * Subscribe to status changes
   */
  subscribe(listener: (status: SocketStatus) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
   * Set up socket event handlers
   */
  private setupSocketHandlers(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.updateStatus(SocketStatus.CONNECTED);
    });

    this.socket.on('disconnect', () => {
      this.updateStatus(SocketStatus.DISCONNECTED);
    });

    this.socket.on('reconnect_attempt', () => {
      this.updateStatus(SocketStatus.RECONNECTING);
    });

    this.socket.on('connect_error', () => {
      this.updateStatus(SocketStatus.ERROR);
    });
  }

  /**
   * Wait for socket connection
   */
  private waitForConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not initialized'));
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error('Connection timeout'));
      }, this.config.timeout);

      this.socket.once('connect', () => {
        clearTimeout(timeout);
        resolve();
      });

      this.socket.once('connect_error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  }

  /**
   * Update status and notify listeners
   */
  private updateStatus(status: SocketStatus): void {
    this.status = status;
    this.listeners.forEach((listener) => listener(status));
  }

  /**
   * Handle logout event
   */
  private handleLogout = (): void => {
    logInfo('[SocketManager] Logout detected - disconnecting');
    this.disconnect();
  };

  /**
   * Handle login event
   */
  private handleLogin = async (): Promise<void> => {
    logInfo('[SocketManager] Login detected - reconnecting');
    
    // Disconnect existing connection
    if (this.socket) {
      this.disconnect();
    }

    // Reconnect with new auth
    await this.connect();
  };

  /**
   * Clean up resources
   */
  destroy(): void {
    this.disconnect();
    
    if (typeof window !== 'undefined') {
      window.removeEventListener('auth:logout', this.handleLogout);
      window.removeEventListener('auth:login', this.handleLogin);
    }

    this.listeners = [];
  }
}

// Singleton instance (browser-only)
let socketManagerInstance: SocketManager | null = null;

/**
 * Get socket manager instance
 * 
 * CRITICAL: Only call this in browser context
 */
export function getSocketManager(config?: Partial<SocketConfig>): SocketManager {
  // SSR guard
  if (typeof window === 'undefined') {
    throw new Error('SocketManager can only be used in browser context');
  }

  if (!socketManagerInstance) {
    socketManagerInstance = new SocketManager(config);
  }

  return socketManagerInstance;
}

/**
 * Destroy socket manager instance
 */
export function destroySocketManager(): void {
  if (socketManagerInstance) {
    socketManagerInstance.destroy();
    socketManagerInstance = null;
  }
}
