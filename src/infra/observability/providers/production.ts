/**
 * Production Provider Template
 * 
 * Template for implementing production observability provider
 * (e.g., Sentry, Datadog, LogRocket, Mixpanel, etc.)
 * 
 * INSTRUCTIONS:
 * 1. Install your provider's SDK (e.g., @sentry/nextjs)
 * 2. Initialize the SDK in this file
 * 3. Implement the ObservabilityProvider interface
 * 4. Update observability/index.ts to use this provider in production
 */

import type {
  EventProperties,
  UserIdentity,
  ObservabilityProvider,
} from '../types';
import { LogLevel } from '../types';

/**
 * Example: Sentry + Mixpanel Provider
 * 
 * Uncomment and modify when ready to implement:
 * 
 * import * as Sentry from '@sentry/nextjs';
 * import mixpanel from 'mixpanel-browser';
 */

export class ProductionProvider implements ObservabilityProvider {
  constructor() {
    this.initialize();
  }

  /**
   * Initialize SDKs
   */
  private initialize(): void {
    // Example: Initialize Sentry
    // Sentry.init({
    //   dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    //   environment: process.env.NODE_ENV,
    //   tracesSampleRate: 1.0,
    // });

    // Example: Initialize Mixpanel
    // if (process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
    //   mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN);
    // }

    // Example: Initialize Datadog
    // datadogRum.init({
    //   applicationId: process.env.NEXT_PUBLIC_DD_APP_ID!,
    //   clientToken: process.env.NEXT_PUBLIC_DD_CLIENT_TOKEN!,
    //   site: 'datadoghq.com',
    //   service: 'my-app',
    //   env: process.env.NODE_ENV,
    // });
  }

  /**
   * Track analytics event
   */
  trackEvent(eventName: string, properties?: EventProperties): void {
    // Example: Mixpanel
    // mixpanel.track(eventName, properties);

    // Example: Datadog
    // datadogRum.addAction(eventName, properties);

    // Fallback: console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', eventName, properties);
    }
  }

  /**
   * Track page view
   */
  trackPageView(url: string, properties?: EventProperties): void {
    // Example: Mixpanel
    // mixpanel.track('Page View', { url, ...properties });

    // Example: Google Analytics
    // gtag('config', 'GA_MEASUREMENT_ID', { page_path: url });

    if (process.env.NODE_ENV === 'development') {
      console.log('[PageView]', url, properties);
    }
  }

  /**
   * Identify user
   */
  identifyUser(user: UserIdentity): void {
    // Example: Sentry
    // Sentry.setUser({
    //   id: user.id,
    //   email: user.email,
    //   username: user.name,
    // });

    // Example: Mixpanel
    // mixpanel.identify(user.id);
    // mixpanel.people.set({
    //   $email: user.email,
    //   $name: user.name,
    // });

    if (process.env.NODE_ENV === 'development') {
      console.log('[User]', user);
    }
  }

  /**
   * Capture error
   */
  captureError(error: Error | string, context?: EventProperties): void {
    const errorObj = typeof error === 'string' ? new Error(error) : error;

    // Example: Sentry
    // Sentry.captureException(errorObj, {
    //   extra: context,
    // });

    // Always log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[Error]', errorObj, context);
    }
  }

  /**
   * Capture exception
   */
  captureException(exception: Error, context?: EventProperties): void {
    // Example: Sentry
    // Sentry.captureException(exception, {
    //   extra: context,
    // });

    // Example: Datadog
    // datadogRum.addError(exception, context);

    if (process.env.NODE_ENV === 'development') {
      console.error('[Exception]', exception, context);
    }
  }

  /**
   * Log message
   */
  log(level: LogLevel, message: string, context?: EventProperties): void {
    // Example: Sentry breadcrumb
    // Sentry.addBreadcrumb({
    //   message,
    //   level: level as any,
    //   data: context,
    // });

    // Example: Datadog logger
    // switch (level) {
    //   case LogLevel.ERROR:
    //     datadogLogs.logger.error(message, context);
    //     break;
    //   case LogLevel.WARN:
    //     datadogLogs.logger.warn(message, context);
    //     break;
    //   default:
    //     datadogLogs.logger.info(message, context);
    // }

    // Console fallback
    const method = level === LogLevel.ERROR ? 'error' : level === LogLevel.WARN ? 'warn' : 'log';
    console[method](`[${level.toUpperCase()}]`, message, context);
  }
}
