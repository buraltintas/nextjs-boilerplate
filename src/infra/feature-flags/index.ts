/**
 * Feature Flags Module
 * 
 * Centralized feature flag management with:
 * - Environment-aware defaults
 * - Remote config support (future-ready)
 * - SSR compatibility
 * - Clean API for both client and server
 */

// Client-side
export { useFeatureFlag, useFeatureFlags, FeatureGate } from './hooks';

// Server-side
export { isFeatureEnabled, getFeatureFlags, refreshFeatureFlags } from './server';

// Provider (for advanced use cases)
export { featureFlagsProvider } from './provider';

// Types
export type { FeatureFlags, FeatureFlag, RemoteConfigResponse } from './types';
