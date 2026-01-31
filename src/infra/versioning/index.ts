/**
 * App Versioning Module
 * 
 * Manages app version, compatibility checks, and forced updates
 */

import { logInfo, logWarn } from '@/infra/observability';

/**
 * App version info
 */
export interface VersionInfo {
  current: string;
  build: string;
  environment: string;
}

/**
 * Version compatibility result
 */
export interface CompatibilityResult {
  compatible: boolean;
  forceUpdate: boolean;
  message?: string;
  minVersion?: string;
}

/**
 * Get current app version
 */
export function getAppVersion(): VersionInfo {
  return {
    current: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    build: process.env.NEXT_PUBLIC_BUILD_ID || 'dev',
    environment: process.env.NODE_ENV || 'development',
  };
}

/**
 * Check version compatibility with backend
 * 
 * @example
 * const result = await checkCompatibility();
 * if (result.forceUpdate) {
 *   forceReload();
 * }
 */
export async function checkCompatibility(): Promise<CompatibilityResult> {
  try {
    // TODO: Replace with actual API call when backend is ready
    // const response = await fetch('/api/version/check', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ version: getAppVersion().current }),
    // });
    // const data = await response.json();
    // return data;

    // Mock response
    return {
      compatible: true,
      forceUpdate: false,
    };
  } catch (error) {
    logWarn('[Versioning] Failed to check compatibility', { error });
    
    // Fail open - assume compatible
    return {
      compatible: true,
      forceUpdate: false,
    };
  }
}

/**
 * Force reload the application
 * 
 * Clears cache and reloads
 */
export function forceReload(): void {
  logInfo('[Versioning] Force reloading application');
  
  if (typeof window !== 'undefined') {
    // Clear service worker cache if available
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => caches.delete(name));
      });
    }
    
    // Hard reload
    window.location.reload();
  }
}

/**
 * Get cache busting query parameter
 * 
 * @example
 * const url = `/api/data?${getCacheBustingParam()}`;
 */
export function getCacheBustingParam(): string {
  const version = getAppVersion();
  return `v=${version.current}&b=${version.build}`;
}

/**
 * Add cache busting to URL
 */
export function addCacheBusting(url: string): string {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${getCacheBustingParam()}`;
}
