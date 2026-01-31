/**
 * Network Status Hook
 * 
 * React hook for monitoring network status
 */

'use client';

import { useEffect, useState } from 'react';
import { NetworkStatus, degradedModeManager } from './degraded-mode';

/**
 * Hook to get current network status
 * 
 * @example
 * const networkStatus = useNetworkStatus();
 * 
 * if (networkStatus === NetworkStatus.DEGRADED) {
 *   return <DegradedModeBanner />;
 * }
 */
export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>(() =>
    degradedModeManager.getStatus()
  );

  useEffect(() => {
    const unsubscribe = degradedModeManager.subscribe(setStatus);
    return unsubscribe;
  }, []);

  return status;
}

/**
 * Hook to check if in degraded mode
 * 
 * @example
 * const isDegraded = useIsDegraded();
 * 
 * return (
 *   <>
 *     {isDegraded && <DegradedModeBanner />}
 *     <MyComponent readOnly={isDegraded} />
 *   </>
 * );
 */
export function useIsDegraded(): boolean {
  const status = useNetworkStatus();
  return status === NetworkStatus.DEGRADED;
}

/**
 * Degraded Mode Banner Component
 */
export function DegradedModeBanner() {
  const isDegraded = useIsDegraded();

  if (!isDegraded) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#f59e0b',
        color: 'white',
        padding: '0.75rem',
        textAlign: 'center',
        zIndex: 9999,
        fontSize: '0.875rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <span style={{ fontWeight: 'bold' }}>⚠️ Degraded Mode</span>
      <span style={{ marginLeft: '0.5rem' }}>
        Some features may be unavailable. Retrying connection...
      </span>
    </div>
  );
}
