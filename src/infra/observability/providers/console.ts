/**
 * Console Provider
 * 
 * Development-friendly observability provider that logs to console
 */

import {
  LogLevel,
  EventProperties,
  UserIdentity,
  ObservabilityProvider,
} from '../types';

export class ConsoleProvider implements ObservabilityProvider {
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Track analytics event
   */
  trackEvent(eventName: string, properties?: EventProperties): void {
    if (this.isDevelopment) {
      console.log(
        `%c[Analytics]%c ${eventName}`,
        'color: #3b82f6; font-weight: bold',
        'color: inherit',
        properties || {}
      );
    }
  }

  /**
   * Track page view
   */
  trackPageView(url: string, properties?: EventProperties): void {
    if (this.isDevelopment) {
      console.log(
        `%c[PageView]%c ${url}`,
        'color: #10b981; font-weight: bold',
        'color: inherit',
        properties || {}
      );
    }
  }

  /**
   * Identify user
   */
  identifyUser(user: UserIdentity): void {
    if (this.isDevelopment) {
      console.log(
        `%c[User]%c ${user.id} (${user.email || 'no email'})`,
        'color: #8b5cf6; font-weight: bold',
        'color: inherit',
        user
      );
    }
  }

  /**
   * Capture error
   */
  captureError(error: Error | string, context?: EventProperties): void {
    const message = typeof error === 'string' ? error : error.message;
    console.error(
      `%c[Error]%c ${message}`,
      'color: #ef4444; font-weight: bold',
      'color: inherit',
      {
        error,
        ...context,
      }
    );
  }

  /**
   * Capture exception
   */
  captureException(exception: Error, context?: EventProperties): void {
    console.error(
      `%c[Exception]%c ${exception.message}`,
      'color: #dc2626; font-weight: bold',
      'color: inherit',
      {
        exception,
        stack: exception.stack,
        ...context,
      }
    );
  }

  /**
   * Log message
   */
  log(level: LogLevel, message: string, context?: EventProperties): void {
    const color = this.getLevelColor(level);
    const method = this.getLevelMethod(level);

    console[method](
      `%c[${level.toUpperCase()}]%c ${message}`,
      `color: ${color}; font-weight: bold`,
      'color: inherit',
      context || {}
    );
  }

  private getLevelColor(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return '#6b7280';
      case LogLevel.INFO:
        return '#3b82f6';
      case LogLevel.WARN:
        return '#f59e0b';
      case LogLevel.ERROR:
        return '#ef4444';
      default:
        return '#000000';
    }
  }

  private getLevelMethod(level: LogLevel): 'log' | 'info' | 'warn' | 'error' {
    switch (level) {
      case LogLevel.ERROR:
        return 'error';
      case LogLevel.WARN:
        return 'warn';
      case LogLevel.INFO:
        return 'info';
      default:
        return 'log';
    }
  }
}
