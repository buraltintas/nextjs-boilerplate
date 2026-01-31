'use client';

import { ErrorBoundary } from '@/infra/errors';
import { BootstrapProvider } from '@/infra/bootstrap';
import { useState, useEffect, type ReactNode } from 'react';

/**
 * Client-side Providers
 * 
 * Wraps client-only features to avoid SSR issues:
 * - Global error boundary
 * - Bootstrap orchestration
 * 
 * Uses client-side mounting to prevent prerendering errors
 */
export function ClientProviders({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR and initial render, just render children
  if (!mounted) {
    return <>{children}</>;
  }

  // After mounting, wrap with providers
  return (
    <ErrorBoundary level="global">
      <BootstrapProvider>
        {children}
      </BootstrapProvider>
    </ErrorBoundary>
  );
}
