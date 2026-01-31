/**
 * BFF API Modules
 * 
 * Central export point for all domain-based API modules
 */

export { authApi } from '@/bff/modules/auth';
export type { LoginCredentials, LoginResponse, User, RegisterData } from '@/bff/modules/auth';

export { usersApi } from '@/bff/modules/users';
export type { UpdateUserData, UserFilters } from '@/bff/modules/users';

// Export a combined api object for convenience
import { authApi } from '@/bff/modules/auth';
import { usersApi } from '@/bff/modules/users';

export const api = {
  auth: authApi,
  users: usersApi,
};
