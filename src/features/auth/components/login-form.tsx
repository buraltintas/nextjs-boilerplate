'use client';

import { useState, type FormEvent } from 'react';
import { useLogin } from '@/features/auth/hooks/use-auth';
import { useRouter } from 'next/navigation';

/**
 * Login Form Component
 */

interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export function LoginForm({ onSuccess, redirectTo = '/dashboard' }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const loginMutation = useLogin();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      await loginMutation.mutateAsync({ email, password });
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(redirectTo);
      }
    } catch (error) {
      // Error is handled by the mutation
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="input-group">
      <div className="input-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input"
          disabled={loginMutation.isPending}
        />
      </div>

      <div className="input-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input"
          disabled={loginMutation.isPending}
        />
      </div>

      {loginMutation.isError && (
        <div style={{ color: 'red', fontSize: '0.875rem', marginBottom: '1rem' }}>
          {loginMutation.error?.message || 'Login failed'}
        </div>
      )}

      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="btn btn-primary"
        style={{ width: '100%' }}
      >
        {loginMutation.isPending ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
