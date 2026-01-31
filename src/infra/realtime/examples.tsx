/**
 * Real-Time Socket Usage Examples
 * 
 * Comprehensive examples for WebSocket/Socket.IO integration
 */

'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useSocket,
  useSocketEvent,
  useSocketEmit,
  useSocketStatus,
  SocketStatus,
  getSocketManager,
  createInvalidationHandler,
  setupSocketEventMappings,
} from '@/infra/realtime';

// ============================================
// 1. BASIC SOCKET CONNECTION
// ============================================

/**
 * Example: Connect socket on app mount
 */
export function AppWithSocket() {
  const { connect, disconnect, status, isConnected } = useSocket();

  useEffect(() => {
    // Connect when app mounts
    connect();

    // Disconnect when app unmounts
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return (
    <div>
      <h1>My App</h1>
      <p>Socket Status: {status}</p>
      <p>{isConnected ? '✅ Connected' : '❌ Disconnected'}</p>
    </div>
  );
}

// ============================================
// 2. LISTENING TO SOCKET EVENTS
// ============================================

/**
 * Example: Listen to notification events
 */
export function NotificationListener() {
  useSocketEvent('notification:new', (data) => {
    console.log('New notification:', data);
    // Show toast, play sound, etc.
    showToast(data.message);
  });

  return null; // This is just a listener component
}

/**
 * Example: Listen to user updates
 */
export function UserUpdateListener() {
  useSocketEvent<{ userId: string; name: string }>('user:updated', (data) => {
    console.log('User updated:', data);
    // React Query will automatically refetch if configured
  });

  return null;
}

// ============================================
// 3. EMITTING SOCKET EVENTS
// ============================================

/**
 * Example: Send typing indicator
 */
export function ChatInput() {
  const emit = useSocketEmit();

  const handleTyping = () => {
    emit('chat:typing', { userId: 'me', channelId: '123' });
  };

  return (
    <input
      type="text"
      onKeyDown={handleTyping}
      placeholder="Type a message..."
    />
  );
}

/**
 * Example: Join/leave rooms
 */
export function ChatRoom({ roomId }: { roomId: string }) {
  const emit = useSocketEmit();

  useEffect(() => {
    // Join room on mount
    emit('room:join', { roomId });

    // Leave room on unmount
    return () => {
      emit('room:leave', { roomId });
    };
  }, [roomId, emit]);

  return <div>Chat Room: {roomId}</div>;
}

// ============================================
// 4. REACT QUERY INTEGRATION
// ============================================

/**
 * Example: Auto-invalidate queries on socket events
 */
export function AutoRefetchOnSocketEvent() {
  const queryClient = useQueryClient();

  // When 'data:updated' event arrives, invalidate relevant queries
  useSocketEvent('data:updated', (data) => {
    // Pattern: Use socket as event trigger only
    queryClient.invalidateQueries({
      queryKey: ['data', data.resourceId],
    });
  });

  return null;
}

/**
 * Example: Custom socket event mapping
 */
export function CustomSocketMapping() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const manager = getSocketManager();

    // Create custom handlers
    const handleUserUpdate = createInvalidationHandler(
      queryClient,
      ['users', 'me']
    );

    const handleMessageNew = createInvalidationHandler(
      queryClient,
      (data) => ['messages', data.channelId]
    );

    // Register handlers
    manager.on('user:updated', handleUserUpdate);
    manager.on('message:new', handleMessageNew);

    // Cleanup
    return () => {
      manager.off('user:updated', handleUserUpdate);
      manager.off('message:new', handleMessageNew);
    };
  }, [queryClient]);

  return null;
}

// ============================================
// 5. SOCKET STATUS HANDLING
// ============================================

/**
 * Example: Show UI based on socket status
 */
export function SocketStatusAwareUI() {
  const status = useSocketStatus();

  if (status === SocketStatus.DISCONNECTED) {
    return <div>⚠️ Disconnected from server</div>;
  }

  if (status === SocketStatus.RECONNECTING) {
    return <div>🔄 Reconnecting...</div>;
  }

  if (status === SocketStatus.ERROR) {
    return <div>❌ Connection error</div>;
  }

  return <div>✅ Live updates enabled</div>;
}

/**
 * Example: Disable features when disconnected
 */
export function RealTimeFeature() {
  const status = useSocketStatus();
  const isDisabled = status !== SocketStatus.CONNECTED;

  return (
    <button disabled={isDisabled}>
      {isDisabled ? 'Real-time unavailable' : 'Send live update'}
    </button>
  );
}

// ============================================
// 6. AUTH INTEGRATION
// ============================================

/**
 * Example: Reconnect socket on login
 */
export function LoginForm() {
  const { connect } = useSocket();

  const handleLogin = async (email: string, password: string) => {
    // Perform login
    await login(email, password);

    // Dispatch custom event to trigger socket reconnection
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth:login'));
    }

    // Socket manager will automatically reconnect with new auth
  };

  return <form>{/* Login form fields */}</form>;
}

/**
 * Example: Disconnect socket on logout
 */
export function LogoutButton() {
  const handleLogout = () => {
    // Perform logout
    logout();

    // Dispatch custom event to trigger socket disconnection
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth:logout'));
    }

    // Socket manager will automatically disconnect
  };

  return <button onClick={handleLogout}>Logout</button>;
}

// ============================================
// 7. COMPLETE EXAMPLE
// ============================================

/**
 * Example: Complete real-time chat component
 */
export function RealTimeChat({ channelId }: { channelId: string }) {
  const { status } = useSocket();
  const emit = useSocketEmit();
  const queryClient = useQueryClient();

  // Join channel on mount
  useEffect(() => {
    emit('channel:join', { channelId });
    return () => {
      emit('channel:leave', { channelId });
    };
  }, [channelId, emit]);

  // Listen for new messages (trigger refetch)
  useSocketEvent('message:new', (data) => {
    if (data.channelId === channelId) {
      queryClient.invalidateQueries({ queryKey: ['messages', channelId] });
    }
  });

  // Listen for typing indicators
  useSocketEvent<{ userId: string; channelId: string }>('user:typing', (data) => {
    if (data.channelId === channelId) {
      showTypingIndicator(data.userId);
    }
  });

  const sendMessage = (text: string) => {
    emit('message:send', { channelId, text });
  };

  return (
    <div>
      <div>Status: {status}</div>
      {/* Messages would come from React Query */}
      <MessageList channelId={channelId} />
      <MessageInput onSend={sendMessage} />
    </div>
  );
}

// ============================================
// 8. GLOBAL SOCKET SETUP
// ============================================

/**
 * Example: Global socket initialization
 * 
 * Call this once in your root layout (client component)
 */
export function GlobalSocketProvider({ children }: { children: React.ReactNode }) {
  const { connect, disconnect } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Connect on mount
    connect();

    // Set up global event mappings
    setupSocketEventMappings(queryClient);

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [connect, disconnect, queryClient]);

  return <>{children}</>;
}

// Dummy implementations for examples
function showToast(message: string) {
  console.log('Toast:', message);
}
function showTypingIndicator(userId: string) {
  console.log('Typing:', userId);
}
function MessageList({ channelId }: { channelId: string }) {
  return <div>Messages for {channelId}</div>;
}
function MessageInput({ onSend }: { onSend: (text: string) => void }) {
  return <input placeholder="Type..." />;
}
async function login(email: string, password: string) {
  console.log('Login:', email);
}
function logout() {
  console.log('Logout');
}
