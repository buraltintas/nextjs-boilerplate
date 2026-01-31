'use client';

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

  return useBFFQuery(
    queryKeys.auth.session(),
    async () => {
      // Mock: Check if token exists in cookie (via server action later)
      // For now, return dummy user
      const response = await api.auth.getCurrentUser();
      return response.data;
    },
    {
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      onSuccess: (user: User) => {
        setUserHint(user);
        setAuthenticatedHint(true);
        updateSessionCheck();
      },
      onError: () => {
        setUserHint(null);
        setAuthenticatedHint(false);
      },
    }
  );
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

  return useBFFMutation(
    async (credentials: LoginCredentials) => {
      const response = await api.auth.login(credentials);
      
      // Mock: Store token in cookie (simulate backend setting cookie)
      if (response.data) {
        document.cookie = `session=${response.data.token}; path=/; max-age=86400; samesite=lax`;
      }
      
      return response;
    },
    {
      onSuccess: (response: any) => {
        // Update auth hints
        setUserHint(response.data.user);
        setAuthenticatedHint(true);

        // Invalidate and refetch session
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
      },
    }
  );
}

/**
 * Logout mutation
 * MOCK: Clears the mock session cookie
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state: any) => state.clearAuth);

  return useBFFMutation(
    async () => {
      await api.auth.logout();
      
      // Mock: Clear cookie
      document.cookie = 'session=; path=/; max-age=0';
      
      return { data: { success: true }, error: null };
    },
    {
      onSuccess: () => {
        // Clear auth hints
        clearAuth();

        // Clear all queries
        queryClient.clear();
      },
    }
  );
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

  return useBFFMutation(
    async (data: RegisterData) => {
      const response = await api.auth.register(data);
      
      // Mock: Store token in cookie
      if (response.data) {
        document.cookie = `session=${response.data.token}; path=/; max-age=86400; samesite=lax`;
      }
      
      return response;
    },
    {
      onSuccess: (response: any) => {
        // Update auth hints
        setUserHint(response.data.user);
        setAuthenticatedHint(true);

        // Invalidate and refetch session
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
      },
    }
  );
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
