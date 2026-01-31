import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { cache, type ReactNode } from 'react';

/**
 * Server-side query utilities for SSR and prefetching
 */

/**
 * Create a query client for server-side use
 * Using React cache() to ensure we get the same instance per request
 */
export const getQueryClient = cache(() => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  });
});

/**
 * Server Component wrapper for hydrating queries
 */
interface HydrationBoundaryWrapperProps {
  children: ReactNode;
}

export async function HydrationBoundaryWrapper({
  children,
}: HydrationBoundaryWrapperProps) {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}

/**
 * Prefetch helper for server components
 */
export async function prefetchQuery<T>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<T>
) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
  });

  return queryClient;
}
