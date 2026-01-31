/**
 * React Query Integration for Socket Events
 * 
 * Maps socket events to React Query cache invalidations
 * NEVER store socket data in global state - use as event triggers only
 */

import { useQueryClient } from '@tanstack/react-query';
import { getSocketManager } from './manager';
import { logInfo } from '@/infra/observability';

/**
 * Socket event to React Query key mapping
 */
export interface SocketEventMapping {
  socketEvent: string;
  queryKeys: string[] | ((data: any) => string[]);
  action?: 'invalidate' | 'refetch' | 'update';
}

/**
 * Create socket event handler that invalidates React Query cache
 * 
 * PATTERN: Socket events trigger cache invalidation, NOT direct state updates
 * 
 * @example
 * const handleUserUpdated = createInvalidationHandler(queryClient, ['users', 'me']);
 * socketManager.on('user:updated', handleUserUpdated);
 */
export function createInvalidationHandler(
  queryClient: any,
  queryKeys: string[] | ((data: any) => string[])
) {
  return (data: any) => {
    const keys = typeof queryKeys === 'function' ? queryKeys(data) : queryKeys;
    
    logInfo('[Socket → React Query] Invalidating cache', { keys, data });
    
    keys.forEach((key) => {
      queryClient.invalidateQueries({ queryKey: [key] });
    });
  };
}

/**
 * Create socket event handler that refetches queries
 * 
 * @example
 * const handleNotification = createRefetchHandler(queryClient, ['notifications']);
 * socketManager.on('notification:new', handleNotification);
 */
export function createRefetchHandler(
  queryClient: any,
  queryKeys: string[] | ((data: any) => string[])
) {
  return (data: any) => {
    const keys = typeof queryKeys === 'function' ? queryKeys(data) : queryKeys;
    
    logInfo('[Socket → React Query] Refetching queries', { keys, data });
    
    keys.forEach((key) => {
      queryClient.refetchQueries({ queryKey: [key] });
    });
  };
}

/**
 * Create socket event handler that updates query data optimistically
 * 
 * Use with caution - prefer invalidation for most cases
 * 
 * @example
 * const handleUserUpdate = createUpdateHandler(
 *   queryClient,
 *   ['users', 'me'],
 *   (oldData, newData) => ({ ...oldData, ...newData })
 * );
 */
export function createUpdateHandler(
  queryClient: any,
  queryKey: string[],
  updater: (oldData: any, socketData: any) => any
) {
  return (data: any) => {
    logInfo('[Socket → React Query] Updating query data', { queryKey, data });
    
    queryClient.setQueryData(queryKey, (oldData: any) => {
      if (!oldData) return oldData;
      return updater(oldData, data);
    });
  };
}

/**
 * Set up common socket event mappings
 * 
 * Call this once when socket connects
 */
export function setupSocketEventMappings(queryClient: any): void {
  const socketManager = getSocketManager();

  // Example mappings - customize based on your backend events
  const mappings: SocketEventMapping[] = [
    {
      socketEvent: 'user:updated',
      queryKeys: ['users', 'me'],
      action: 'invalidate',
    },
    {
      socketEvent: 'notification:new',
      queryKeys: ['notifications'],
      action: 'refetch',
    },
    {
      socketEvent: 'message:new',
      queryKeys: (data) => ['messages', data.channelId],
      action: 'invalidate',
    },
    {
      socketEvent: 'data:updated',
      queryKeys: (data) => [data.resourceType, data.resourceId],
      action: 'invalidate',
    },
  ];

  // Register handlers
  mappings.forEach((mapping) => {
    const handler = 
      mapping.action === 'refetch'
        ? createRefetchHandler(queryClient, mapping.queryKeys)
        : createInvalidationHandler(queryClient, mapping.queryKeys);

    socketManager.on(mapping.socketEvent, handler);
  });

  logInfo('[Socket → React Query] Event mappings configured', {
    count: mappings.length,
  });
}

/**
 * Clean up socket event handlers
 */
export function cleanupSocketEventMappings(): void {
  const socketManager = getSocketManager();
  
  // Remove all event listeners
  // Note: This removes ALL listeners - be careful in production
  socketManager.off('user:updated');
  socketManager.off('notification:new');
  socketManager.off('message:new');
  socketManager.off('data:updated');
}
