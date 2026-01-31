/**
 * Observability Module
 * 
 * Provider-agnostic observability layer for:
 * - Analytics tracking
 * - Error monitoring
 * - Logging
 * 
 * Switch providers by changing the implementation in this file
 */

import {
  LogLevel,
  EventProperties,
  UserIdentity,
  ObservabilityProvider,
} from './types';
import { ConsoleProvider } from './providers/console';
import { ProductionProvider } from './providers/production';

/**
 * Select provider based on environment
 */
function getProvider(): ObservabilityProvider {
  // In development, always use console
  if (process.env.NODE_ENV === 'development') {
    return new ConsoleProvider();
  }

  // In production, use production provider (Sentry, Datadog, etc.)
  // Uncomment when ready:
  // return new ProductionProvider();

  // Fallback to console for now
  return new ConsoleProvider();
}

// Singleton provider instance
const provider = getProvider();

// ============================================
// ANALYTICS
// ============================================

/**
 * Track an analytics event
 * 
 * @example
 * trackEvent('button_clicked', { button: 'signup', page: 'home' });
 */
export function trackEvent(eventName: string, properties?: EventProperties): void {
  provider.trackEvent(eventName, properties);
}

/**
 * Track page view
 * 
 * @example
 * trackPageView('/dashboard', { referrer: document.referrer });
 */
export function trackPageView(url: string, properties?: EventProperties): void {
  provider.trackPageView(url, properties);
}

/**
 * Identify current user
 * 
 * @example
 * identifyUser({ id: '123', email: 'user@example.com', name: 'John' });
 */
export function identifyUser(user: UserIdentity): void {
  provider.identifyUser(user);
}

// ============================================
// ERROR TRACKING
// ============================================

/**
 * Capture an error
 * 
 * @example
 * captureError(new Error('Something went wrong'), { context: 'checkout' });
 */
export function captureError(error: Error | string, context?: EventProperties): void {
  provider.captureError(error, context);
}

/**
 * Capture an exception (alias for captureError)
 */
export function captureException(exception: Error, context?: EventProperties): void {
  provider.captureException(exception, context);
}

// ============================================
// LOGGING
// ============================================

/**
 * Log debug message
 * 
 * @example
 * logDebug('Cache hit', { key: 'user-123' });
 */
export function logDebug(message: string, context?: EventProperties): void {
  provider.log(LogLevel.DEBUG, message, context);
}

/**
 * Log info message
 * 
 * @example
 * logInfo('User logged in', { userId: '123' });
 */
export function logInfo(message: string, context?: EventProperties): void {
  provider.log(LogLevel.INFO, message, context);
}

/**
 * Log warning message
 * 
 * @example
 * logWarn('Slow API response', { endpoint: '/api/users', duration: 5000 });
 */
export function logWarn(message: string, context?: EventProperties): void {
  provider.log(LogLevel.WARN, message, context);
}

/**
 * Log error message
 * 
 * @example
 * logError('Failed to save data', { error: err.message });
 */
export function logError(message: string, context?: EventProperties): void {
  provider.log(LogLevel.ERROR, message, context);
}

// ============================================
// EXPORTS
// ============================================

export type { LogLevel, EventProperties, UserIdentity, ObservabilityProvider };

export { ConsoleProvider, ProductionProvider };
