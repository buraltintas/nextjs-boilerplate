'use client';

import { useUsers } from '@/features/users/hooks/use-users';
import { Card, Spinner } from '@/shared/components';
import { useState } from 'react';
import { useDebounce, useQueryParams } from '@/shared/hooks';
import type { User } from '@/bff';

/**
 * Users List Component
 */

export function UsersList() {
  const { searchParams, setQueryParam } = useQueryParams();
  
  const page = parseInt(searchParams.get('page') || '1', 10);
  const search = searchParams.get('search') || '';
  
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 300);

  const { data, isLoading, error } = useUsers({
    page,
    limit: 10,
    search: debouncedSearch,
  });

  const handleSearch = (value: string) => {
    setSearchInput(value);
    if (value) {
      setQueryParam('search', value);
    }
  };

  const handlePageChange = (newPage: number) => {
    setQueryParam('page', newPage.toString());
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 bg-red-50 rounded-md">
        Error loading users: {error.message}
      </div>
    );
  }

  return (
    <div>
      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users..."
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.data.map((user: User) => (
          <Card key={user.id} hoverable>
            <div className="flex items-center space-x-4">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              
              <div className="flex-1">
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-gray-100 rounded">
                  {user.role}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {data && data.meta && (
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {((data.meta.page - 1) * data.meta.limit) + 1} to{' '}
            {Math.min(data.meta.page * data.meta.limit, data.meta.total)} of{' '}
            {data.meta.total} users
          </p>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <span className="px-4 py-2">
              Page {data.meta.page} of {data.meta.totalPages}
            </span>
            
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= data.meta.totalPages}
              className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
