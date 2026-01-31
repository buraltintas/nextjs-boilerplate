/**
 * Observability Types
 */

/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

/**
 * Event properties
 */
export type EventProperties = Record<string, any>;

/**
 * User identification
 */
export interface UserIdentity {
  id: string;
  email?: string;
  name?: string;
  [key: string]: any;
}

/**
 * Observability provider interface
 */
export interface ObservabilityProvider {
  // Analytics
  trackEvent(eventName: string, properties?: EventProperties): void;
  trackPageView(url: string, properties?: EventProperties): void;
  identifyUser(user: UserIdentity): void;

  // Error tracking
  captureError(error: Error | string, context?: EventProperties): void;
  captureException(exception: Error, context?: EventProperties): void;

  // Logging
  log(level: LogLevel, message: string, context?: EventProperties): void;
}
