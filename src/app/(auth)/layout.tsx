import { redirect } from 'next/navigation';
import { getServerSession } from '@/features/auth/lib/server-auth';

/**
 * Auth Layout
 * 
 * This layout wraps authentication routes (login, register, etc.)
 * Redirects to dashboard if already authenticated
 */

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerSession();

  // Redirect to dashboard if already authenticated
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        {children}
      </div>
    </div>
  );
}
