/**
 * Default Feature Flags
 * 
 * These are the local defaults that can be overridden by remote config.
 * Environment-aware flags are resolved based on NODE_ENV.
 */

import { FeatureFlags } from './types';

/**
 * Default feature flags for each environment
 */
export const defaultFlags: Record<string, FeatureFlags> = {
  development: {
    // Auth & Security
    'auth.mock-enabled': true,
    'auth.two-factor': false,
    'auth.social-login': false,

    // Features
    'feature.users-management': true,
    'feature.analytics': false,
    'feature.notifications': true,
    'feature.dark-mode': true,

    // Performance
    'performance.lazy-loading': true,
    'performance.image-optimization': true,

    // Experimental
    'experimental.new-dashboard': true,
    'experimental.ai-features': false,

    // Debugging
    'debug.show-queries': true,
    'debug.show-errors': true,
    'debug.performance-monitor': true,
  },

  staging: {
    // Auth & Security
    'auth.mock-enabled': false,
    'auth.two-factor': true,
    'auth.social-login': true,

    // Features
    'feature.users-management': true,
    'feature.analytics': true,
    'feature.notifications': true,
    'feature.dark-mode': true,

    // Performance
    'performance.lazy-loading': true,
    'performance.image-optimization': true,

    // Experimental
    'experimental.new-dashboard': true,
    'experimental.ai-features': false,

    // Debugging
    'debug.show-queries': false,
    'debug.show-errors': true,
    'debug.performance-monitor': true,
  },

  production: {
    // Auth & Security
    'auth.mock-enabled': false,
    'auth.two-factor': true,
    'auth.social-login': true,

    // Features
    'feature.users-management': true,
    'feature.analytics': true,
    'feature.notifications': true,
    'feature.dark-mode': true,

    // Performance
    'performance.lazy-loading': true,
    'performance.image-optimization': true,

    // Experimental
    'experimental.new-dashboard': false,
    'experimental.ai-features': false,

    // Debugging
    'debug.show-queries': false,
    'debug.show-errors': false,
    'debug.performance-monitor': false,
  },
};

/**
 * Get default flags for current environment
 */
export function getDefaultFlags(): FeatureFlags {
  const env = (process.env.NODE_ENV || 'development') as keyof typeof defaultFlags;
  return defaultFlags[env] || defaultFlags.development;
}
