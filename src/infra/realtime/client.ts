/**
 * Socket Client
 * 
 * BROWSER-ONLY socket client implementation.
 * NEVER runs during SSR.
 */

import { io, Socket } from 'socket.io-client';
import { SocketConfig, SocketInstance } from './types';
import { logInfo, logWarn, logError } from '@/infra/observability';

/**
 * Create socket instance (browser-only)
 * 
 * CRITICAL: This function must NEVER be called during SSR
 */
export function createSocketClient(config: SocketConfig): SocketInstance {
  // SSR guard - absolutely critical
  if (typeof window === 'undefined') {
    logWarn('[Socket] Attempted to create socket during SSR - blocked');
    return null;
  }

  try {
    logInfo('[Socket] Creating socket client', { url: config.url });

    const socket = io(config.url, {
      autoConnect: config.autoConnect,
      reconnection: config.reconnection,
      reconnectionAttempts: config.reconnectionAttempts,
      reconnectionDelay: config.reconnectionDelay,
      timeout: config.timeout,
      transports: ['websocket', 'polling'], // Try WebSocket first, fallback to polling
      withCredentials: false, // We handle auth via token, not cookies
    });

    // Built-in socket.io events
    socket.on('connect', () => {
      logInfo('[Socket] Connected', { id: socket.id });
    });

    socket.on('disconnect', (reason) => {
      logWarn('[Socket] Disconnected', { reason });
    });

    socket.on('connect_error', (error) => {
      logError('[Socket] Connection error', { error: error.message });
    });

    socket.on('reconnect', (attemptNumber) => {
      logInfo('[Socket] Reconnected', { attemptNumber });
    });

    socket.on('reconnect_attempt', (attemptNumber) => {
      logInfo('[Socket] Reconnecting...', { attempt: attemptNumber });
    });

    socket.on('reconnect_error', (error) => {
      logError('[Socket] Reconnection error', { error: error.message });
    });

    socket.on('reconnect_failed', () => {
      logError('[Socket] Reconnection failed - max attempts reached');
    });

    return socket;
  } catch (error) {
    logError('[Socket] Failed to create socket client', { error });
    return null;
  }
}

/**
 * Perform socket authentication handshake
 */
export async function authenticateSocket(
  socket: Socket,
  token: string
): Promise<boolean> {
  return new Promise((resolve) => {
    logInfo('[Socket] Authenticating...');

    // Set auth timeout
    const timeout = setTimeout(() => {
      logError('[Socket] Authentication timeout');
      resolve(false);
    }, 5000);

    // Emit auth event
    socket.emit('authenticate', { token }, (response: any) => {
      clearTimeout(timeout);

      if (response?.success) {
        logInfo('[Socket] Authentication successful');
        resolve(true);
      } else {
        logError('[Socket] Authentication failed', { response });
        resolve(false);
      }
    });
  });
}

/**
 * Gracefully disconnect socket
 */
export function disconnectSocket(socket: Socket): void {
  if (socket.connected) {
    logInfo('[Socket] Disconnecting...');
    socket.disconnect();
  }
}
