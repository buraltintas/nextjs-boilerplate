import { redirect } from 'next/navigation';
import { getServerSession } from '@/features/auth/lib/server-auth';
import { headers } from 'next/headers';

/**
 * Protected Layout
 * 
 * This layout wraps all protected routes.
 * It checks authentication on the server and redirects if not authenticated.
 * Preserves the intended destination URL for post-login redirect.
 */

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerSession();

  // Redirect to login if not authenticated
  if (!user) {
    // Get the current pathname to redirect back after login
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') || '/dashboard';
    
    // Redirect with the intended destination
    redirect(`/login?redirectTo=${encodeURIComponent(pathname)}`);
  }

  return (
    <div className="min-h-screen">
      {/* Protected layout wrapper */}
      <div className="flex">
        {/* Sidebar could go here */}
        <aside className="w-64 bg-gray-100 min-h-screen p-4">
          <nav>
            <h2 className="font-bold mb-4">Navigation</h2>
            {/* Add navigation items */}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
