/**
 * Real-Time Socket Infrastructure
 * 
 * CLIENT-SIDE ONLY WebSocket/Socket.IO infrastructure
 * 
 * ARCHITECTURE:
 * - Socket code is isolated from UI and routing logic
 * - Never runs during SSR
 * - Auth via secure BFF endpoint
 * - Sockets are event triggers only (not data source)
 * - Socket events invalidate React Query caches
 * - Automatic disconnect on logout
 * 
 * USAGE:
 * 1. Initialize socket in a client component
 * 2. Use hooks to manage lifecycle
 * 3. Map socket events to React Query invalidations
 * 4. Never store socket data in global state
 * 
 * @example
 * // In a client component
 * function App() {
 *   const { connect, disconnect, status } = useSocket();
 * 
 *   useEffect(() => {
 *     connect();
 *     return () => disconnect();
 *   }, [connect, disconnect]);
 * 
 *   // Listen to events
 *   useSocketEvent('notification:new', (data) => {
 *     toast.success(data.message);
 *   });
 * 
 *   return <div>Socket: {status}</div>;
 * }
 */

// Types
export type {
  SocketEventCallback,
  SocketAuthPayload,
  SocketConfig,
  ISocketManager,
  SocketInstance,
} from './types';

export { SocketStatus } from './types';

// Core
export { getSocketManager, destroySocketManager } from './manager';

// Auth
export { fetchSocketAuthToken, refreshSocketAuthToken } from './auth';

// React Integration
export {
  useSocket,
  useSocketEvent,
  useSocketEmit,
  useSocketStatus,
  SocketStatusIndicator,
} from './hooks';

// React Query Integration
export {
  createInvalidationHandler,
  createRefetchHandler,
  createUpdateHandler,
  setupSocketEventMappings,
  cleanupSocketEventMappings,
} from './react-query-integration';

export type { SocketEventMapping } from './react-query-integration';
