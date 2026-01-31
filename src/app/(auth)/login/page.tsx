import { LoginForm } from '@/features/auth';
import Link from 'next/link';
import { metadataPresets } from '@/infra/seo';
import type { Metadata } from 'next';

/**
 * Login Page
 */

export const metadata: Metadata = metadataPresets.login();

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirectTo?: string };
}) {
  // Get the redirect destination from query params, default to dashboard
  const redirectTo = searchParams.redirectTo || '/dashboard';

  return (
    <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <div className="card-header">
        <h1 className="card-title" style={{ textAlign: 'center' }}>
          Login to Your Account
        </h1>
        <p style={{ textAlign: 'center', color: '#64748b' }}>
          Welcome back! Please login to continue
        </p>
      </div>
      
      <div className="card-content">
        <LoginForm redirectTo={redirectTo} />
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
          <p style={{ color: '#64748b' }}>
            Don't have an account?{' '}
            <Link href="/register" style={{ color: '#2563eb', fontWeight: '500' }}>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
