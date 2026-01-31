import { getServerSession } from '@/features/auth/lib/server-auth';
import { LogoutButton } from '@/features/auth';
import { metadataPresets } from '@/infra/seo';
import type { Metadata } from 'next';

/**
 * Dashboard Page (Protected)
 */

export const metadata: Metadata = metadataPresets.dashboard();

export default async function DashboardPage() {
  const user = await getServerSession();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {user?.name}!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">1,234</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Active Sessions</h3>
          <p className="text-3xl font-bold text-green-600">856</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Revenue</h3>
          <p className="text-3xl font-bold text-purple-600">$12,345</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">User Information</h2>
        <div className="space-y-2">
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
          <p><strong>ID:</strong> {user?.id}</p>
        </div>
        
        <div className="mt-6">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
