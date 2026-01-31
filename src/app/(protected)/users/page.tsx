import { metadataPresets } from '@/infra/seo';
import type { Metadata } from 'next';

/**
 * Users Page (Protected)
 */

export const metadata: Metadata = {
  ...metadataPresets.dashboard(),
  title: 'Users | Your App',
  description: 'Manage users',
};

export default function UsersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <p>User management interface goes here</p>
        </div>
      </div>
    </div>
  );
}
