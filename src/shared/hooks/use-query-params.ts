import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';

/**
 * useQueryParams Hook
 * 
 * Manage URL query parameters
 */

export function useQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setQueryParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(key, value);
      router.push(`${pathname}?${params.toString()}` as any);
    },
    [pathname, router, searchParams]
  );

  const removeQueryParam = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);
      router.push(`${pathname}?${params.toString()}` as any);
    },
    [pathname, router, searchParams]
  );

  const setMultipleQueryParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      
      router.push(`${pathname}?${params.toString()}` as any);
    },
    [pathname, router, searchParams]
  );

  const getQueryParam = useCallback(
    (key: string): string | null => {
      return searchParams.get(key);
    },
    [searchParams]
  );

  return {
    searchParams,
    setQueryParam,
    removeQueryParam,
    setMultipleQueryParams,
    getQueryParam,
  };
}
