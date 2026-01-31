/**
 * Auth API Module
 *
 * Handles all authentication-related API calls
 * MOCK MODE: Returns dummy data for development without backend
 */

import type { BFFResponse } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  expiresIn: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface RefreshTokenResponse {
  token: string;
  expiresIn: number;
}

export const authApi = {
  /**
   * MOCK: Login with any credentials
   */
  login: async (
    credentials: LoginCredentials
  ): Promise<BFFResponse<LoginResponse>> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock: Accept any credentials
    return {
      data: {
        user: {
          id: '1',
          name: 'John Doe',
          email: credentials.email,
          role: 'admin',
        },
        token: 'mock-jwt-token-' + Date.now(),
        expiresIn: 86400, // 24 hours
      },
      status: 200,
      headers: new Headers(),
    };
  },

  /**
   * MOCK: Register with any data
   */
  register: async (
    data: RegisterData
  ): Promise<BFFResponse<User>> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock: Accept any registration
    return {
      data: {
        id: '2',
        name: data.name,
        email: data.email,
        role: 'user',
      },
      status: 201,
      headers: new Headers(),
    };
  },

  /**
   * MOCK: Logout always succeeds
   */
  logout: async (): Promise<BFFResponse<void>> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      data: undefined,
      status: 200,
      headers: new Headers(),
    };
  },

  /**
   * MOCK: Get current user session
   */
  getSession: async (): Promise<BFFResponse<User | null>> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Mock: Return dummy user
    return {
      data: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
      },
      status: 200,
      headers: new Headers(),
    };
  },

  /**
   * MOCK: Get current user (alias)
   */
  getCurrentUser: async (): Promise<BFFResponse<User | null>> => {
    return authApi.getSession();
  },

  /**
   * MOCK: Refresh token
   */
  refreshToken: async (): Promise<BFFResponse<RefreshTokenResponse>> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    return {
      data: {
        token: 'mock-jwt-token-' + Date.now(),
        expiresIn: 86400,
      },
      status: 200,
      headers: new Headers(),
    };
  },

  /**
   * MOCK: Request password reset
   */
  requestPasswordReset: async (
    email: string
  ): Promise<BFFResponse<void>> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      data: undefined,
      status: 200,
      headers: new Headers(),
    };
  },

  /**
   * MOCK: Reset password
   */
  resetPassword: async (
    token: string,
    newPassword: string
  ): Promise<BFFResponse<void>> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      data: undefined,
      status: 200,
      headers: new Headers(),
    };
  },
};
