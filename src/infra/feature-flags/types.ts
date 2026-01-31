/**
 * Feature Flags Types
 */

/**
 * Feature flag configuration
 */
export type FeatureFlag = {
  key: string;
  enabled: boolean;
  description?: string;
  environments?: Array<'development' | 'staging' | 'production'>;
};

/**
 * Feature flags collection
 */
export type FeatureFlags = Record<string, boolean>;

/**
 * Remote config response
 */
export interface RemoteConfigResponse {
  flags: FeatureFlags;
  version: string;
  updatedAt: string;
}

/**
 * Feature flag provider interface
 */
export interface FeatureFlagProvider {
  getFlags: () => Promise<FeatureFlags>;
  isEnabled: (key: string) => boolean;
  refresh: () => Promise<void>;
}
