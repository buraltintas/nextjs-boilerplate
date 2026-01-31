import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * User Preferences Store
 * 
 * Stores user-specific preferences like language, display options, etc.
 */

export interface UserPreferencesState {
  // Language
  preferredLanguage: string | null;
  setPreferredLanguage: (language: string) => void;

  // Display preferences
  compactMode: boolean;
  setCompactMode: (compact: boolean) => void;

  // Notifications
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;

  // Recently viewed items (for quick access)
  recentlyViewed: string[];
  addRecentlyViewed: (itemId: string) => void;
  clearRecentlyViewed: () => void;

  // Reset all preferences
  resetPreferences: () => void;
}

const DEFAULT_STATE = {
  preferredLanguage: null,
  compactMode: false,
  notificationsEnabled: true,
  recentlyViewed: [],
};

export const usePreferencesStore = create<UserPreferencesState>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,

      setPreferredLanguage: (language) => set({ preferredLanguage: language }),

      compactMode: false,
      setCompactMode: (compact) => set({ compactMode: compact }),

      notificationsEnabled: true,
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),

      recentlyViewed: [],
      addRecentlyViewed: (itemId) =>
        set((state) => ({
          recentlyViewed: [
            itemId,
            ...state.recentlyViewed.filter((id) => id !== itemId),
          ].slice(0, 10), // Keep only last 10 items
        })),
      clearRecentlyViewed: () => set({ recentlyViewed: [] }),

      resetPreferences: () => set(DEFAULT_STATE),
    }),
    {
      name: 'preferences-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
