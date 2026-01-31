'use client';

import { useLogout } from '@/features/auth/hooks/use-auth';
import { useRouter } from 'next/navigation';

/**
 * Logout Button Component
 */

interface LogoutButtonProps {
  onSuccess?: () => void;
  redirectTo?: string;
  className?: string;
  children?: React.ReactNode;
}

export function LogoutButton({
  onSuccess,
  redirectTo = '/login',
  className = '',
  children = 'Logout',
}: LogoutButtonProps) {
  const router = useRouter();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(redirectTo);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={logoutMutation.isPending}
      className={className || 'px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700'}
    >
      {logoutMutation.isPending ? 'Logging out...' : children}
    </button>
  );
}
