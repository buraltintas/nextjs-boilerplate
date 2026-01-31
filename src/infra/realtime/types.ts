/**
 * Real-Time Types
 */

import type { Socket } from 'socket.io-client';

/**
 * Socket connection status
 */
export enum SocketStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
  ERROR = 'error',
}

/**
 * Socket event callback
 */
export type SocketEventCallback<T = any> = (data: T) => void;

/**
 * Socket auth payload
 */
export interface SocketAuthPayload {
  token: string;
  userId?: string;
}

/**
 * Socket configuration
 */
export interface SocketConfig {
  url: string;
  autoConnect: boolean;
  reconnection: boolean;
  reconnectionAttempts: number;
  reconnectionDelay: number;
  timeout: number;
}

/**
 * Socket manager interface
 */
export interface ISocketManager {
  connect(): Promise<void>;
  disconnect(): void;
  isConnected(): boolean;
  getStatus(): SocketStatus;
  on<T = any>(event: string, callback: SocketEventCallback<T>): void;
  off(event: string, callback?: SocketEventCallback): void;
  emit(event: string, data?: any): void;
  subscribe(listener: (status: SocketStatus) => void): () => void;
}

/**
 * Socket instance type
 */
export type SocketInstance = Socket | null;
