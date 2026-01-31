/**
 * BFF Layer Entry Point
 *
 * This is the main export for the Backend-for-Frontend layer.
 * All data fetching should go through this layer.
 */

// Core client and types
export { bffClient, BFFClient } from '@/bff/client';
export type {
  BFFRequestInit,
  BFFResponse,
  ErrorResponse,
  PaginatedResponse,
} from '@/bff/types';

// Errors
export {
  BFFError,
  NetworkError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '@/bff/errors';

// API Modules
export { api, authApi, usersApi } from '@/bff/modules';
export type {
  LoginCredentials,
  LoginResponse,
  User,
  RegisterData,
  UpdateUserData,
  UserFilters,
} from '@/bff/modules';
