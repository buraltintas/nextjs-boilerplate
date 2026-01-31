import { config } from '@/infra/config';
import {
  BFFError,
  NetworkError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '@/bff/errors';
import type { BFFRequestInit, BFFResponse } from '@/bff/types';
import {
  defaultNetworkStrategy,
  isRetryableError,
  calculateRetryDelay,
  wait,
} from '@/infra/network';
import { degradedModeManager } from '@/infra/network';
import { logWarn, logError } from '@/infra/observability';

/**
 * Core BFF Fetch Client
 * 
 * Responsibilities:
 * - Wraps native fetch with sensible defaults
 * - Attaches authentication tokens from cookies
 * - Handles timeouts
 * - Centralizes error handling
 * - Provides consistent response format
 */

class BFFClient {
  private baseURL: string;
  private defaultTimeout: number;

  constructor(baseURL: string, timeout: number = 30000) {
    this.baseURL = baseURL;
    this.defaultTimeout = timeout;
  }

  /**
   * Get auth token from cookies (server-side only)
   */
  private async getAuthToken(): Promise<string | undefined> {
    // Only works in Server Components
    if (typeof window === 'undefined') {
      try {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies(); // Next.js 15+ returns Promise
        const sessionCookie = cookieStore.get(config.session.cookieName);
        return sessionCookie?.value;
      } catch {
        return undefined;
      }
    }
    
    // Client-side: cookies are automatically sent by browser
    return undefined;
  }

  /**
   * Build full URL with base
   */
  private buildURL(endpoint: string): string {
    // If endpoint is already a full URL, return as-is
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }
    
    // Remove leading slash if present to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${this.baseURL}/${cleanEndpoint}`;
  }

  /**
   * Build headers with auth token
   */
  private async buildHeaders(
    headers?: HeadersInit,
    skipAuth: boolean = false
  ): Promise<Headers> {
    const requestHeaders = new Headers(headers);

    // Set default content-type if not provided
    if (!requestHeaders.has('Content-Type')) {
      requestHeaders.set('Content-Type', 'application/json');
    }

    // Attach auth token if available and not skipped
    if (!skipAuth) {
      const token = await this.getAuthToken();
      if (token) {
        requestHeaders.set('Authorization', `Bearer ${token}`);
      }
    }

    return requestHeaders;
  }

  /**
   * Handle HTTP response and throw appropriate errors
   */
  private async handleResponse<T>(response: Response): Promise<BFFResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJSON = contentType?.includes('application/json');

    // Try to parse body
    let body: any;
    try {
      body = isJSON ? await response.json() : await response.text();
    } catch {
      body = null;
    }

    // Handle error responses
    if (!response.ok) {
      const errorMessage = body?.error?.message || body?.message || response.statusText;
      const errorCode = body?.error?.code || body?.code;
      const errorDetails = body?.error?.details || body?.details;

      switch (response.status) {
        case 401:
          throw new UnauthorizedError(errorMessage);
        case 403:
          throw new ForbiddenError(errorMessage);
        case 404:
          throw new NotFoundError(errorMessage);
        case 422:
          throw new ValidationError(errorMessage, errorDetails);
        default:
          throw new BFFError(errorMessage, response.status, errorCode, errorDetails);
      }
    }

    // Return successful response
    return {
      data: body?.data ?? body,
      status: response.status,
      headers: response.headers,
    };
  }

  /**
   * Create fetch with timeout
   */
  private fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new NetworkError(`Request timeout after ${timeout}ms`));
      }, timeout);

      fetch(url, options)
        .then((response) => {
          clearTimeout(timer);
          resolve(response);
        })
        .catch((error) => {
          clearTimeout(timer);
          reject(new NetworkError(error.message || 'Network request failed'));
        });
    });
  }

  /**
   * Core request method with retry logic
   */
  async request<T = unknown>(
    endpoint: string,
    options: BFFRequestInit = {}
  ): Promise<BFFResponse<T>> {
    const {
      timeout = this.defaultTimeout,
      skipAuth = false,
      retry = defaultNetworkStrategy.retry,
      headers,
      ...fetchOptions
    } = options;

    const url = this.buildURL(endpoint);
    const requestHeaders = await this.buildHeaders(headers, skipAuth);

    let lastError: Error | null = null;
    const maxAttempts = retry.enabled ? retry.maxAttempts : 1;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await this.fetchWithTimeout(
          url,
          {
            ...fetchOptions,
            headers: requestHeaders,
          },
          timeout
        );

        const result = await this.handleResponse<T>(response);
        
        // Request succeeded - record success
        degradedModeManager.recordSuccess();
        
        return result;
      } catch (error) {
        lastError = error as Error;

        // Check if error is retryable
        const statusCode = (error as BFFError).statusCode || 0;
        const shouldRetry = attempt < maxAttempts && isRetryableError(statusCode, retry);

        if (shouldRetry) {
          const delay = calculateRetryDelay(attempt, retry);
          logWarn(`[BFF] Retrying request (attempt ${attempt}/${maxAttempts})`, {
            endpoint,
            delay,
            error: (error as Error).message,
          });
          await wait(delay);
          continue;
        }

        // Not retryable or max attempts reached
        degradedModeManager.recordFailure();
        
        // Re-throw known errors
        if (error instanceof BFFError) {
          throw error;
        }
        
        // Wrap unknown errors
        throw new BFFError(
          error instanceof Error ? error.message : 'Unknown error occurred',
          500
        );
      }
    }

    // Should never reach here, but TypeScript needs it
    throw lastError || new BFFError('Request failed after retries', 500);
  }

  /**
   * Convenience methods
   */
  async get<T = unknown>(endpoint: string, options?: BFFRequestInit): Promise<BFFResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: BFFRequestInit
  ): Promise<BFFResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: BFFRequestInit
  ): Promise<BFFResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: BFFRequestInit
  ): Promise<BFFResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = unknown>(endpoint: string, options?: BFFRequestInit): Promise<BFFResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

/**
 * Default BFF client instance
 */
export const bffClient = new BFFClient(
  config.backend.apiUrl,
  config.backend.timeout
);

/**
 * Export class for custom instances
 */
export { BFFClient };
