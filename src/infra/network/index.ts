/**
 * Network Module
 * 
 * Network strategy with:
 * - Configurable timeouts
 * - Retry policy with exponential backoff
 * - Degraded mode detection
 * - Network error handling
 */

// Strategy
export type {
  RetryConfig,
  TimeoutConfig,
  NetworkStrategyConfig,
} from './strategy';

export {
  defaultNetworkStrategy,
  isRetryableError,
  calculateRetryDelay,
  wait,
} from './strategy';

// Degraded Mode
export {
  NetworkStatus,
  degradedModeManager,
} from './degraded-mode';

// Hooks & Components
export {
  useNetworkStatus,
  useIsDegraded,
  DegradedModeBanner,
} from './hooks';
