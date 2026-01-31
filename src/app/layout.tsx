import { ReactQueryProvider } from '@/shared/providers/react-query-provider';
import { ErrorBoundary } from '@/infra/errors';
import { BootstrapProvider } from '@/infra/bootstrap';
// import { DegradedModeBanner } from '@/infra/network'; // Uncomment when backend is connected
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import '@/styles/globals.scss';

/**
 * Root Layout
 * 
 * Main layout for the entire application with:
 * - Global error boundary
 * - Bootstrap orchestration
 * - Network status monitoring (optional)
 * - React Query provider
 */

export const metadata: Metadata = {
  title: 'Next.js Boilerplate',
  description: 'Production-ready Next.js boilerplate with best practices',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary level="global">
          <ReactQueryProvider>
            <BootstrapProvider>
              {/* <DegradedModeBanner /> */}
              {children}
            </BootstrapProvider>
          </ReactQueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
