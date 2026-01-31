/**
 * Feature Flags Hooks
 * 
 * Client-side hooks for accessing feature flags in React components.
 */

'use client';

import { useEffect, useState } from 'react';
import { featureFlagsProvider } from './provider';
import { FeatureFlags } from './types';

/**
 * Hook to check if a feature flag is enabled
 * 
 * @example
 * const isNewDashboardEnabled = useFeatureFlag('experimental.new-dashboard');
 * 
 * if (isNewDashboardEnabled) {
 *   return <NewDashboard />;
 * }
 */
export function useFeatureFlag(key: string): boolean {
  const [isEnabled, setIsEnabled] = useState(() => 
    featureFlagsProvider.isEnabled(key)
  );

  useEffect(() => {
    // Refresh flags on mount (respects cache)
    featureFlagsProvider.fetchRemoteFlags().catch(console.error);

    // Re-check flag after potential refresh
    const checkFlag = () => {
      setIsEnabled(featureFlagsProvider.isEnabled(key));
    };

    // Check immediately
    checkFlag();

    // Optional: Set up polling for remote changes (every 5 minutes)
    const interval = setInterval(() => {
      featureFlagsProvider.fetchRemoteFlags().then(checkFlag).catch(console.error);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [key]);

  return isEnabled;
}

/**
 * Hook to get all feature flags
 * 
 * @example
 * const flags = useFeatureFlags();
 * 
 * if (flags['feature.analytics']) {
 *   trackEvent('page_view');
 * }
 */
export function useFeatureFlags(): FeatureFlags {
  const [flags, setFlags] = useState(() => 
    featureFlagsProvider.getFlags()
  );

  useEffect(() => {
    featureFlagsProvider.fetchRemoteFlags().then(() => {
      setFlags(featureFlagsProvider.getFlags());
    }).catch(console.error);
  }, []);

  return flags;
}

/**
 * Component wrapper for feature-gated content
 * 
 * @example
 * <FeatureGate flag="experimental.new-dashboard" fallback={<OldDashboard />}>
 *   <NewDashboard />
 * </FeatureGate>
 */
export function FeatureGate({
  flag,
  children,
  fallback = null,
}: {
  flag: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const isEnabled = useFeatureFlag(flag);

  return <>{isEnabled ? children : fallback}</>;
}
