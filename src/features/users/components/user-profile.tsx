'use client';

import { useUser } from '@/features/users/hooks/use-users';
import { Card, CardHeader, CardTitle, CardContent, Spinner } from '@/shared/components';
import { formatDate } from '@/shared/utils';

/**
 * User Profile Component
 */

interface UserProfileProps {
  userId: string;
}

export function UserProfile({ userId }: UserProfileProps) {
  const { data: user, isLoading, error } = useUser(userId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-red-600 p-4 bg-red-50 rounded-md">
        Error loading user profile
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            
            <div>
              <CardTitle>{user.name}</CardTitle>
              <p className="text-gray-600">{user.email}</p>
              <span className="inline-block mt-2 px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded">
                {user.role}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase">User ID</h4>
              <p className="mt-1">{user.id}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase">Email</h4>
              <p className="mt-1">{user.email}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase">Role</h4>
              <p className="mt-1 capitalize">{user.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
