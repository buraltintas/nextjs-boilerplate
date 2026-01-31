/**
 * Feature Flags Provider
 * 
 * Manages feature flags with support for:
 * - Local defaults
 * - Remote overrides (future-ready)
 * - Environment awareness
 * - SSR compatibility
 */

import { FeatureFlags, RemoteConfigResponse } from './types';
import { getDefaultFlags } from './default-flags';

class FeatureFlagsProvider {
  private flags: FeatureFlags;
  private remoteFlags: FeatureFlags | null = null;
  private lastFetch: number = 0;
  private fetchPromise: Promise<void> | null = null;
  
  // Cache remote flags for 5 minutes
  private readonly CACHE_TTL = 5 * 60 * 1000;

  constructor() {
    this.flags = getDefaultFlags();
  }

  /**
   * Check if a feature flag is enabled
   */
  isEnabled(key: string): boolean {
    // Remote flags take precedence over defaults
    if (this.remoteFlags && key in this.remoteFlags) {
      return this.remoteFlags[key];
    }
    
    return this.flags[key] ?? false;
  }

  /**
   * Get all current flags (merged)
   */
  getFlags(): FeatureFlags {
    return {
      ...this.flags,
      ...this.remoteFlags,
    };
  }

  /**
   * Fetch remote flags
   * 
   * Future-ready: Replace this with actual API call when backend is ready
   */
  async fetchRemoteFlags(): Promise<RemoteConfigResponse | null> {
    // Skip if cache is fresh
    const now = Date.now();
    if (this.remoteFlags && now - this.lastFetch < this.CACHE_TTL) {
      return null;
    }

    // Prevent multiple simultaneous fetches
    if (this.fetchPromise) {
      await this.fetchPromise;
      return null;
    }

    this.fetchPromise = this._fetchRemoteFlags();
    await this.fetchPromise;
    this.fetchPromise = null;

    return null;
  }

  private async _fetchRemoteFlags(): Promise<void> {
    try {
      // TODO: Replace with actual API endpoint when backend is ready
      // const response = await fetch('/api/feature-flags', {
      //   headers: { 'Content-Type': 'application/json' },
      // });
      // const data: RemoteConfigResponse = await response.json();
      // this.remoteFlags = data.flags;
      // this.lastFetch = Date.now();

      // For now, check for environment variable overrides
      const envOverrides = this._getEnvOverrides();
      if (Object.keys(envOverrides).length > 0) {
        this.remoteFlags = {
          ...this.remoteFlags,
          ...envOverrides,
        };
        this.lastFetch = Date.now();
      }
    } catch (error) {
      // Silently fail - use defaults
      console.warn('[FeatureFlags] Failed to fetch remote flags:', error);
    }
  }

  /**
   * Get feature flag overrides from environment variables
   * Format: NEXT_PUBLIC_FF_<FLAG_KEY>=true/false
   */
  private _getEnvOverrides(): FeatureFlags {
    const overrides: FeatureFlags = {};
    const prefix = 'NEXT_PUBLIC_FF_';

    if (typeof process !== 'undefined' && process.env) {
      Object.keys(process.env).forEach((key) => {
        if (key.startsWith(prefix)) {
          const flagKey = key
            .substring(prefix.length)
            .toLowerCase()
            .replace(/_/g, '.');
          
          const value = process.env[key];
          if (value === 'true' || value === 'false') {
            overrides[flagKey] = value === 'true';
          }
        }
      });
    }

    return overrides;
  }

  /**
   * Force refresh flags from remote
   */
  async refresh(): Promise<void> {
    this.lastFetch = 0; // Invalidate cache
    await this.fetchRemoteFlags();
  }

  /**
   * Reset to defaults (useful for testing)
   */
  reset(): void {
    this.flags = getDefaultFlags();
    this.remoteFlags = null;
    this.lastFetch = 0;
  }
}

// Singleton instance
export const featureFlagsProvider = new FeatureFlagsProvider();
