import { RegisterForm } from '@/features/auth';
import { metadataPresets } from '@/infra/seo';
import type { Metadata } from 'next';
import Link from 'next/link';

/**
 * Register Page
 */

export const metadata: Metadata = {
  ...metadataPresets.login(),
  title: 'Register | Your App',
  description: 'Create your account',
};

export default function RegisterPage({
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
          Create Your Account
        </h1>
        <p style={{ textAlign: 'center', color: '#64748b' }}>
          Join us today and get started
        </p>
      </div>
      
      <div className="card-content">
        <RegisterForm redirectTo={redirectTo} />
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
          <p style={{ color: '#64748b' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#2563eb', fontWeight: '500' }}>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
