/**
 * Real-Time React Hooks
 * 
 * BROWSER-ONLY hooks for socket integration
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSocketManager } from './manager';
import { SocketStatus, SocketEventCallback } from './types';
import { setupSocketEventMappings, cleanupSocketEventMappings } from './react-query-integration';
import { logInfo, logWarn } from '@/infra/observability';

/**
 * Hook to manage socket connection lifecycle
 * 
 * IMPORTANT: Only use in components that are definitely client-side
 * 
 * @example
 * function MyComponent() {
 *   const { status, connect, disconnect } = useSocket();
 * 
 *   useEffect(() => {
 *     connect();
 *     return () => disconnect();
 *   }, [connect, disconnect]);
 * 
 *   return <div>Socket: {status}</div>;
 * }
 */
export function useSocket() {
  const [status, setStatus] = useState<SocketStatus>(SocketStatus.DISCONNECTED);
  const [isInitialized, setIsInitialized] = useState(false);
  const queryClient = useQueryClient();

  // Initialize socket manager (browser-only)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const manager = getSocketManager();
      setStatus(manager.getStatus());
      setIsInitialized(true);

      // Subscribe to status changes
      const unsubscribe = manager.subscribe(setStatus);

      return () => {
        unsubscribe();
      };
    } catch (error) {
      logWarn('[useSocket] Failed to initialize', { error });
    }
  }, []);

  // Connect
  const connect = useCallback(async () => {
    if (typeof window === 'undefined') return;

    try {
      const manager = getSocketManager();
      await manager.connect();

      // Set up React Query mappings
      setupSocketEventMappings(queryClient);

      logInfo('[useSocket] Connected and configured');
    } catch (error) {
      logWarn('[useSocket] Connection failed', { error });
    }
  }, [queryClient]);

  // Disconnect
  const disconnect = useCallback(() => {
    if (typeof window === 'undefined') return;

    const manager = getSocketManager();
    cleanupSocketEventMappings();
    manager.disconnect();
  }, []);

  return {
    status,
    isConnected: status === SocketStatus.CONNECTED,
    isInitialized,
    connect,
    disconnect,
  };
}

/**
 * Hook to subscribe to a specific socket event
 * 
 * @example
 * useSocketEvent('notification:new', (data) => {
 *   toast.success(`New notification: ${data.message}`);
 * });
 */
export function useSocketEvent<T = any>(
  event: string,
  callback: SocketEventCallback<T>,
  deps: any[] = []
) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const manager = getSocketManager();

      // Only subscribe if connected
      if (!manager.isConnected()) {
        logWarn('[useSocketEvent] Not connected - event listener not registered', { event });
        return;
      }

      manager.on(event, callback);

      return () => {
        manager.off(event, callback);
      };
    } catch (error) {
      logWarn('[useSocketEvent] Failed to subscribe', { event, error });
    }
  }, [event, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps
}

/**
 * Hook to emit socket events
 * 
 * @example
 * const emit = useSocketEmit();
 * 
 * const sendMessage = () => {
 *   emit('message:send', { text: 'Hello!' });
 * };
 */
export function useSocketEmit() {
  return useCallback((event: string, data?: any) => {
    if (typeof window === 'undefined') return;

    try {
      const manager = getSocketManager();
      
      if (!manager.isConnected()) {
        logWarn('[useSocketEmit] Not connected - event not sent', { event });
        return;
      }

      manager.emit(event, data);
    } catch (error) {
      logWarn('[useSocketEmit] Failed to emit', { event, error });
    }
  }, []);
}

/**
 * Hook to get socket status
 * 
 * @example
 * const status = useSocketStatus();
 * return <div>Status: {status}</div>;
 */
export function useSocketStatus(): SocketStatus {
  const [status, setStatus] = useState<SocketStatus>(SocketStatus.DISCONNECTED);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const manager = getSocketManager();
      setStatus(manager.getStatus());

      const unsubscribe = manager.subscribe(setStatus);
      return unsubscribe;
    } catch (error) {
      logWarn('[useSocketStatus] Failed to get status', { error });
    }
  }, []);

  return status;
}

/**
 * Socket status indicator component
 */
export function SocketStatusIndicator() {
  const status = useSocketStatus();

  const colors: Record<SocketStatus, string> = {
    [SocketStatus.DISCONNECTED]: '#6b7280',
    [SocketStatus.CONNECTING]: '#f59e0b',
    [SocketStatus.CONNECTED]: '#10b981',
    [SocketStatus.RECONNECTING]: '#f59e0b',
    [SocketStatus.ERROR]: '#ef4444',
  };

  const labels: Record<SocketStatus, string> = {
    [SocketStatus.DISCONNECTED]: 'Disconnected',
    [SocketStatus.CONNECTING]: 'Connecting...',
    [SocketStatus.CONNECTED]: 'Connected',
    [SocketStatus.RECONNECTING]: 'Reconnecting...',
    [SocketStatus.ERROR]: 'Error',
  };

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        backgroundColor: '#f3f4f6',
        fontSize: '0.75rem',
      }}
    >
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: colors[status],
        }}
      />
      <span>{labels[status]}</span>
    </div>
  );
}
