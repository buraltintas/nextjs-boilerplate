import { bffClient } from '@/bff/client';
import type { BFFResponse, PaginatedResponse } from '@/bff/types';
import type { User } from '@/bff/modules/auth';

/**
 * Users API Module
 * 
 * Handles user-related API calls
 */

export interface UpdateUserData {
  name?: string;
  avatar?: string;
  bio?: string;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  sortBy?: 'name' | 'email' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export const usersApi = {
  /**
   * Get paginated list of users
   */
  getUsers: async (filters?: UserFilters): Promise<BFFResponse<PaginatedResponse<User>>> => {
    const params = new URLSearchParams();
    
    if (filters?.page) params.set('page', filters.page.toString());
    if (filters?.limit) params.set('limit', filters.limit.toString());
    if (filters?.search) params.set('search', filters.search);
    if (filters?.role) params.set('role', filters.role);
    if (filters?.sortBy) params.set('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.set('sortOrder', filters.sortOrder);

    const queryString = params.toString();
    const endpoint = queryString ? `/users?${queryString}` : '/users';

    return bffClient.get<PaginatedResponse<User>>(endpoint);
  },

  /**
   * Get single user by ID
   */
  getUser: async (userId: string): Promise<BFFResponse<User>> => {
    return bffClient.get<User>(`/users/${userId}`);
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<BFFResponse<User>> => {
    return bffClient.get<User>('/users/me');
  },

  /**
   * Update current user profile
   */
  updateCurrentUser: async (data: UpdateUserData): Promise<BFFResponse<User>> => {
    return bffClient.patch<User>('/users/me', data);
  },

  /**
   * Update user by ID (admin only)
   */
  updateUser: async (userId: string, data: UpdateUserData): Promise<BFFResponse<User>> => {
    return bffClient.patch<User>(`/users/${userId}`, data);
  },

  /**
   * Delete user by ID (admin only)
   */
  deleteUser: async (userId: string): Promise<BFFResponse<void>> => {
    return bffClient.delete<void>(`/users/${userId}`);
  },
};
