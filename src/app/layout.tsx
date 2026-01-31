import { ReactQueryProvider } from '@/shared/providers/react-query-provider';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import '@/styles/globals.scss';

/**
 * Root Layout
 * 
 * Main layout for the entire application
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
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
