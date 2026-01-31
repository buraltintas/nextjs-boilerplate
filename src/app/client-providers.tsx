'use client';

import { ErrorBoundary } from '@/infra/errors';
import { BootstrapProvider } from '@/infra/bootstrap';
import type { ReactNode } from 'react';

/**
 * Client-side Providers
 * 
 * Wraps client-only features to avoid SSR issues:
 * - Global error boundary
 * - Bootstrap orchestration
 */
export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary level="global">
      <BootstrapProvider>
        {children}
      </BootstrapProvider>
    </ErrorBoundary>
  );
}
