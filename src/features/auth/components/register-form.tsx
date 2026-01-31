'use client';

import { useState, type FormEvent } from 'react';
import { useRegister } from '@/features/auth';
import { useRouter } from 'next/navigation';

/**
 * Register Form Component
 */

interface RegisterFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export function RegisterForm({
  onSuccess,
  redirectTo = '/dashboard',
}: RegisterFormProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const registerMutation = useRegister();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      await registerMutation.mutateAsync({ name, email, password });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(redirectTo as any);
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='input-group'>
      <div className='input-group'>
        <label htmlFor='name'>Full Name</label>
        <input
          id='name'
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className='input'
          disabled={registerMutation.isPending}
        />
      </div>

      <div className='input-group'>
        <label htmlFor='email'>Email</label>
        <input
          id='email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className='input'
          disabled={registerMutation.isPending}
        />
      </div>

      <div className='input-group'>
        <label htmlFor='password'>Password</label>
        <input
          id='password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className='input'
          disabled={registerMutation.isPending}
        />
      </div>

      <div className='input-group'>
        <label htmlFor='confirmPassword'>Confirm Password</label>
        <input
          id='confirmPassword'
          type='password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className='input'
          disabled={registerMutation.isPending}
        />
      </div>

      {registerMutation.isError && (
        <div className='error' style={{ color: 'red', marginBottom: '1rem' }}>
          {registerMutation.error?.message || 'Registration failed'}
        </div>
      )}

      <button
        type='submit'
        disabled={registerMutation.isPending}
        className='btn btn-primary'
        style={{ width: '100%' }}
      >
        {registerMutation.isPending ? 'Creating account...' : 'Register'}
      </button>
    </form>
  );
}
