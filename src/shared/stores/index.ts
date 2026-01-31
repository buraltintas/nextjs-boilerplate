/**
 * Zustand Stores
 * 
 * Central export for all client-side state stores
 */

export { useUIStore, type UIState } from '@/shared/stores/ui-store';
export { useAuthStore, type AuthState } from '@/shared/stores/auth-store';
export { usePreferencesStore, type UserPreferencesState } from '@/shared/stores/preferences-store';
