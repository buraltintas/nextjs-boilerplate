/**
 * Network Strategy Configuration
 * 
 * Defines timeouts, retry policies, and degraded mode behavior
 */

/**
 * Retry configuration
 */
export interface RetryConfig {
  enabled: boolean;
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryableStatusCodes: number[];
}

/**
 * Timeout configuration
 */
export interface TimeoutConfig {
  default: number;
  critical: number;
  background: number;
}

/**
 * Network strategy configuration
 */
export interface NetworkStrategyConfig {
  timeouts: TimeoutConfig;
  retry: RetryConfig;
  degradedMode: {
    enabled: boolean;
    maxConsecutiveFailures: number;
    recoveryCheckInterval: number;
  };
}

/**
 * Default network strategy
 */
export const defaultNetworkStrategy: NetworkStrategyConfig = {
  timeouts: {
    default: 30000,    // 30 seconds
    critical: 10000,   // 10 seconds for critical operations
    background: 60000, // 1 minute for background tasks
  },
  retry: {
    enabled: true,
    maxAttempts: 3,
    initialDelay: 1000,      // 1 second
    maxDelay: 10000,         // 10 seconds
    backoffMultiplier: 2,    // Exponential backoff
    retryableStatusCodes: [
      408, // Request Timeout
      429, // Too Many Requests
      500, // Internal Server Error
      502, // Bad Gateway
      503, // Service Unavailable
      504, // Gateway Timeout
    ],
  },
  degradedMode: {
    enabled: true,
    maxConsecutiveFailures: 3,
    recoveryCheckInterval: 60000, // 1 minute
  },
};

/**
 * Check if error is retryable
 */
export function isRetryableError(statusCode: number, config: RetryConfig): boolean {
  if (!config.enabled) return false;
  return config.retryableStatusCodes.includes(statusCode);
}

/**
 * Calculate retry delay with exponential backoff
 */
export function calculateRetryDelay(
  attempt: number,
  config: RetryConfig
): number {
  const delay = config.initialDelay * Math.pow(config.backoffMultiplier, attempt - 1);
  return Math.min(delay, config.maxDelay);
}

/**
 * Wait for specified duration
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
