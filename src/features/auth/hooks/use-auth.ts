'use client';

import { useEffect } from 'react';
import { useBFFQuery, useBFFMutation } from '@/shared/hooks/use-query';
import { queryKeys } from '@/shared/constants/query-keys';
import {
  api,
  type User,
  type LoginCredentials,
  type RegisterData,
} from '@/bff';
import { useAuthStore } from '@/shared/stores';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Auth Hooks
 *
 * Client-side hooks for authentication
 */

/**
 * Get current session
 * MOCK: Returns dummy user from BFF
 */
export function useSession() {
  const setUserHint = useAuthStore((state: any) => state.setUserHint);
  const setAuthenticatedHint = useAuthStore(
    (state: any) => state.setAuthenticatedHint
  );
  const updateSessionCheck = useAuthStore(
    (state: any) => state.updateSessionCheck
  );

  const query = useBFFQuery(
    queryKeys.auth.session(),
    () => api.auth.getCurrentUser(), // Already returns BFFResponse<User | null>
    {
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // React Query v5: Use useEffect instead of onSuccess
  useEffect(() => {
    if (query.data) {
      const user = query.data; // Already unwrapped by useBFFQuery
      setUserHint(user);
      setAuthenticatedHint(true);
      updateSessionCheck();
    } else if (query.isError) {
      setUserHint(null);
      setAuthenticatedHint(false);
    }
  }, [query.data, query.isError, setUserHint, setAuthenticatedHint, updateSessionCheck]);

  return query;
}

/**
 * Get current user (alias for useSession)
 */
export function useCurrentUser() {
  return useSession();
}

/**
 * Login mutation
 * MOCK: Always succeeds and sets a dummy token cookie
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const setUserHint = useAuthStore((state: any) => state.setUserHint);
  const setAuthenticatedHint = useAuthStore(
    (state: any) => state.setAuthenticatedHint
  );

  const mutation = useBFFMutation(
    async (credentials: LoginCredentials) => {
      const response = await api.auth.login(credentials);
      
      // Mock: Store token in cookie (simulate backend setting cookie)
      if (response.data) {
        document.cookie = `session=${response.data.token}; path=/; max-age=86400; samesite=lax`;
      }
      
      return response;
    }
  );

  // React Query v5: Use useEffect instead of onSuccess
  useEffect(() => {
    if (mutation.data) {
      setUserHint(mutation.data.data.user);
      setAuthenticatedHint(true);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
    }
  }, [mutation.data, setUserHint, setAuthenticatedHint, queryClient]);

  return mutation;
}

/**
 * Logout mutation
 * MOCK: Clears the mock session cookie
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state: any) => state.clearAuth);

  const mutation = useBFFMutation(
    async () => {
      await api.auth.logout();
      
      // Mock: Clear cookie
      document.cookie = 'session=; path=/; max-age=0';
      
      return { data: { success: true }, status: 200, headers: new Headers() };
    }
  );

  // React Query v5: Use useEffect instead of onSuccess
  useEffect(() => {
    if (mutation.isSuccess) {
      clearAuth();
      queryClient.clear();
    }
  }, [mutation.isSuccess, clearAuth, queryClient]);

  return mutation;
}

/**
 * Register mutation
 * MOCK: Always succeeds and sets a dummy token cookie
 */
export function useRegister() {
  const queryClient = useQueryClient();
  const setUserHint = useAuthStore((state: any) => state.setUserHint);
  const setAuthenticatedHint = useAuthStore(
    (state: any) => state.setAuthenticatedHint
  );

  const mutation = useBFFMutation(
    async (data: RegisterData) => {
      const response = await api.auth.register(data);
      
      // Mock: Store token - User response doesn't have token, create one
      const token = 'mock-jwt-token-' + Date.now();
      document.cookie = `session=${token}; path=/; max-age=86400; samesite=lax`;
      
      return response;
    }
  );

  // React Query v5: Use useEffect instead of onSuccess
  useEffect(() => {
    if (mutation.data) {
      setUserHint(mutation.data.data);
      setAuthenticatedHint(true);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
    }
  }, [mutation.data, setUserHint, setAuthenticatedHint, queryClient]);

  return mutation;
}

/**
 * Check if user is authenticated (optimistic hint)
 */
export function useIsAuthenticated() {
  const { data: user, isLoading } = useSession();
  const isAuthenticatedHint = useAuthStore(
    (state: any) => state.isAuthenticatedHint
  );

  // Use hint for immediate feedback, actual data when available
  return {
    isAuthenticated: !!user || isAuthenticatedHint,
    isLoading,
    user,
  };
}
