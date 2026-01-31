import { ReactQueryProvider } from '@/shared/providers/react-query-provider';
import { ClientProviders } from './client-providers';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import '@/styles/globals.scss';

/**
 * Root Layout
 * 
 * Main layout for the entire application with:
 * - Global error boundary (client-side)
 * - Bootstrap orchestration (client-side)
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
        <ReactQueryProvider>
          <ClientProviders>
            {children}
          </ClientProviders>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
