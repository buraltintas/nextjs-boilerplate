/**
 * Auth Feature Module
 *
 * Exports all auth-related functionality
 */

// Hooks (Client-side only)
export {
  useSession,
  useCurrentUser,
  useLogin,
  useLogout,
  useRegister,
  useIsAuthenticated,
} from '@/features/auth/hooks/use-auth';

// Components (Client-side only)
export { LoginForm } from '@/features/auth/components/login-form';
export { LogoutButton } from '@/features/auth/components/logout-button';
export { RegisterForm } from '@/features/auth/components/register-form';

// Note: Server utilities (server-auth.ts) should be imported directly
// from '@/features/auth/lib/server-auth' in Server Components only
