import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/bff';

/**
 * Auth State Store
 * 
 * Manages client-side auth state hints.
 * Note: This is NOT the source of truth for authentication.
 * The real auth state comes from server-side session cookies.
 * This store only provides UI hints to avoid layout shifts.
 */

export interface AuthState {
  // User hints (for optimistic UI)
  userHint: User | null;
  setUserHint: (user: User | null) => void;

  // Auth status hint
  isAuthenticatedHint: boolean;
  setAuthenticatedHint: (authenticated: boolean) => void;

  // Session timestamp (to detect stale sessions)
  lastSessionCheck: number | null;
  updateSessionCheck: () => void;

  // Clear all auth state
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userHint: null,
      setUserHint: (user) => set({ userHint: user }),

      isAuthenticatedHint: false,
      setAuthenticatedHint: (authenticated) => set({ isAuthenticatedHint: authenticated }),

      lastSessionCheck: null,
      updateSessionCheck: () => set({ lastSessionCheck: Date.now() }),

      clearAuth: () =>
        set({
          userHint: null,
          isAuthenticatedHint: false,
          lastSessionCheck: null,
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
