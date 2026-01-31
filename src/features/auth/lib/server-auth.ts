'use server';

/**
 * Server-only Auth Utilities
 * 
 * ⚠️ Important: This file should ONLY be imported in Server Components!
 * Do NOT export these from index.ts or import in Client Components.
 */

import { cookies } from 'next/headers';
import { config } from '@/infra/config';
import { api } from '@/bff';
import type { User } from '@/bff';

/**
 * Get session token from cookies
 */
export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(config.session.cookieName);
  return sessionCookie?.value;
}

/**
 * Check if user is authenticated (server-side)
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getSessionToken();
  return !!token;
}

/**
 * Get current user session (server-side)
 * MOCK: Always returns a dummy user
 */
export async function getServerSession(): Promise<User | null> {
  const token = await getSessionToken();
  
  // If no token, return null (not logged in)
  if (!token) {
    return null;
  }
  
  // Mock: Return dummy user based on token
  return {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
  };
}

/**
 * Set session cookie
 */
export async function setSessionCookie(token: string, expiresIn: number) {
  const cookieStore = await cookies();
  
  cookieStore.set(config.session.cookieName, token, {
    httpOnly: true,
    secure: config.app.env === 'production',
    sameSite: 'lax',
    maxAge: expiresIn,
    path: '/',
  });
}

/**
 * Clear session cookie
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(config.session.cookieName);
}

/**
 * Require authentication (throws redirect if not authenticated)
 */
export async function requireAuth(): Promise<User> {
  const user = await getServerSession();
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  return user;
}

/**
 * Require specific role
 */
export async function requireRole(allowedRoles: string[]): Promise<User> {
  const user = await requireAuth();
  
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Forbidden');
  }
  
  return user;
}
