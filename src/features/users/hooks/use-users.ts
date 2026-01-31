'use client';

import { useBFFQuery } from '@/shared/hooks/use-query';
import { queryKeys } from '@/shared/constants/query-keys';
import { usersApi, type UserFilters } from '@/bff';

/**
 * Users Hooks
 */

/**
 * Get paginated users list
 */
export function useUsers(filters?: UserFilters) {
  return useBFFQuery(
    queryKeys.users.list(filters || {}),
    () => usersApi.getUsers(filters),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );
}

/**
 * Get single user by ID
 */
export function useUser(userId: string) {
  return useBFFQuery(
    queryKeys.users.detail(userId),
    () => usersApi.getUser(userId),
    {
      enabled: !!userId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
}

/**
 * Get current user
 */
export function useCurrentUserProfile() {
  return useBFFQuery(
    queryKeys.users.current(),
    () => usersApi.getCurrentUser(),
    {
      staleTime: 5 * 60 * 1000,
    }
  );
}
