/**
 * Degraded Mode Manager
 * 
 * Manages app state when backend is unreachable
 */

import { logWarn, logInfo, logError } from '@/infra/observability';

export enum NetworkStatus {
  ONLINE = 'online',
  DEGRADED = 'degraded',
  OFFLINE = 'offline',
}

class DegradedModeManager {
  private status: NetworkStatus = NetworkStatus.ONLINE;
  private consecutiveFailures = 0;
  private maxConsecutiveFailures = 3;
  private recoveryCheckInterval = 60000; // 1 minute
  private recoveryTimer: NodeJS.Timeout | null = null;
  private listeners: Array<(status: NetworkStatus) => void> = [];

  constructor(maxFailures: number = 3, recoveryInterval: number = 60000) {
    this.maxConsecutiveFailures = maxFailures;
    this.recoveryCheckInterval = recoveryInterval;
  }

  /**
   * Record a network failure
   */
  recordFailure(): void {
    this.consecutiveFailures++;

    logWarn('[Network] Request failed', {
      consecutiveFailures: this.consecutiveFailures,
      maxAllowed: this.maxConsecutiveFailures,
    });

    // Enter degraded mode if threshold exceeded
    if (this.consecutiveFailures >= this.maxConsecutiveFailures) {
      this.enterDegradedMode();
    }
  }

  /**
   * Record a successful request
   */
  recordSuccess(): void {
    if (this.status !== NetworkStatus.ONLINE) {
      this.recover();
    }
    
    this.consecutiveFailures = 0;
  }

  /**
   * Enter degraded mode
   */
  private enterDegradedMode(): void {
    if (this.status === NetworkStatus.DEGRADED) return;

    this.status = NetworkStatus.DEGRADED;
    logError('[Network] Entering degraded mode', {
      consecutiveFailures: this.consecutiveFailures,
    });

    // Notify listeners
    this.notifyListeners();

    // Start recovery checks
    this.startRecoveryChecks();
  }

  /**
   * Recover from degraded mode
   */
  private recover(): void {
    if (this.status === NetworkStatus.ONLINE) return;

    this.status = NetworkStatus.ONLINE;
    this.consecutiveFailures = 0;
    
    logInfo('[Network] Recovered from degraded mode');

    // Stop recovery checks
    if (this.recoveryTimer) {
      clearInterval(this.recoveryTimer);
      this.recoveryTimer = null;
    }

    // Notify listeners
    this.notifyListeners();
  }

  /**
   * Start periodic recovery checks
   */
  private startRecoveryChecks(): void {
    if (this.recoveryTimer) return;

    this.recoveryTimer = setInterval(() => {
      logInfo('[Network] Checking for recovery...');
      // Recovery will happen automatically when next request succeeds
    }, this.recoveryCheckInterval);
  }

  /**
   * Get current status
   */
  getStatus(): NetworkStatus {
    return this.status;
  }

  /**
   * Check if in degraded mode
   */
  isDegraded(): boolean {
    return this.status === NetworkStatus.DEGRADED;
  }

  /**
   * Force enter degraded mode (for testing)
   */
  forceDegraded(): void {
    this.enterDegradedMode();
  }

  /**
   * Force recovery (for testing)
   */
  forceRecover(): void {
    this.recover();
  }

  /**
   * Subscribe to status changes
   */
  subscribe(listener: (status: NetworkStatus) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.status));
  }

  /**
   * Reset state (for testing)
   */
  reset(): void {
    this.status = NetworkStatus.ONLINE;
    this.consecutiveFailures = 0;
    
    if (this.recoveryTimer) {
      clearInterval(this.recoveryTimer);
      this.recoveryTimer = null;
    }
  }
}

// Singleton instance
export const degradedModeManager = new DegradedModeManager();
