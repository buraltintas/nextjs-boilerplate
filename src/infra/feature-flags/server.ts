/**
 * Feature Flags Server Utilities
 * 
 * Server-side utilities for accessing feature flags in Server Components and API routes.
 */

'use server';

import { featureFlagsProvider } from './provider';
import { FeatureFlags } from './types';

/**
 * Check if a feature flag is enabled (server-side)
 * 
 * @example
 * const isEnabled = await isFeatureEnabled('experimental.new-dashboard');
 */
export async function isFeatureEnabled(key: string): Promise<boolean> {
  // Fetch remote flags (respects cache)
  await featureFlagsProvider.fetchRemoteFlags();
  
  return featureFlagsProvider.isEnabled(key);
}

/**
 * Get all feature flags (server-side)
 * 
 * @example
 * const flags = await getFeatureFlags();
 */
export async function getFeatureFlags(): Promise<FeatureFlags> {
  // Fetch remote flags (respects cache)
  await featureFlagsProvider.fetchRemoteFlags();
  
  return featureFlagsProvider.getFlags();
}

/**
 * Refresh feature flags from remote (server-side)
 * Useful for API routes that need latest flags
 */
export async function refreshFeatureFlags(): Promise<void> {
  await featureFlagsProvider.refresh();
}
