import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
  type QueryKey,
} from '@tanstack/react-query';
import {
  BFFError,
  UnauthorizedError,
  type BFFResponse,
} from '@/bff';

/**
 * Type-safe query hooks with error handling
 */

export type QueryConfig<TData, TError = BFFError> = Omit<
  UseQueryOptions<BFFResponse<TData>, TError, TData>,
  'queryKey' | 'queryFn'
>;

export type MutationConfig<TData, TVariables, TError = BFFError> = Omit<
  UseMutationOptions<BFFResponse<TData>, TError, TVariables>,
  'mutationFn'
>;

/**
 * Enhanced useQuery hook with BFF response unwrapping
 */
export function useBFFQuery<TData>(
  queryKey: QueryKey,
  queryFn: () => Promise<BFFResponse<TData>>,
  options?: QueryConfig<TData>
) {
  return useQuery({
    queryKey,
    queryFn,
    select: (response) => response.data,
    ...options,
  });
}

/**
 * Enhanced useMutation hook with error handling
 */
export function useBFFMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<BFFResponse<TData>>,
  options?: MutationConfig<TData, TVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onError: (error) => {
      // Handle unauthorized errors globally
      if (error instanceof UnauthorizedError) {
        // Invalidate auth queries
        queryClient.invalidateQueries({ queryKey: ['auth'] });
      }
    },
    ...options,
  });
}

/**
 * Export React Query hooks and utilities
 */
export { useQueryClient, useIsFetching, useIsMutating } from '@tanstack/react-query';
