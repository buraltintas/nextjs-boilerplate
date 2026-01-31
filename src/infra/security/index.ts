/**
 * Security Utilities
 * 
 * Centralized security functions for:
 * - Token handling
 * - Cookie management
 * - Safe logging
 */

import { config } from '@/infra/config';

/**
 * Sensitive data patterns to redact from logs
 */
const SENSITIVE_PATTERNS = [
  /Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi,  // Bearer tokens
  /token["\s:=]+([A-Za-z0-9\-._~+/]+)/gi,  // token fields
  /password["\s:=]+([^\s,"'}]+)/gi,  // password fields
  /api[_-]?key["\s:=]+([^\s,"'}]+)/gi,  // API keys
  /secret["\s:=]+([^\s,"'}]+)/gi,  // secrets
];

/**
 * Redact sensitive data from strings
 * 
 * @example
 * const safe = redactSensitiveData('Bearer abc123'); // 'Bearer [REDACTED]'
 */
export function redactSensitiveData(data: string): string {
  let redacted = data;
  
  SENSITIVE_PATTERNS.forEach((pattern) => {
    redacted = redacted.replace(pattern, (match) => {
      const prefix = match.split(/\s|:|=/)[0];
      return `${prefix} [REDACTED]`;
    });
  });
  
  return redacted;
}

/**
 * Safely log data (redacts sensitive info)
 * 
 * @example
 * safeLog({ token: 'abc123', user: 'john' }); // { token: '[REDACTED]', user: 'john' }
 */
export function safeLog(data: any): any {
  if (typeof data === 'string') {
    return redactSensitiveData(data);
  }
  
  if (typeof data === 'object' && data !== null) {
    const safe: any = Array.isArray(data) ? [] : {};
    
    for (const key in data) {
      const lowerKey = key.toLowerCase();
      
      // Redact known sensitive keys
      if (
        lowerKey.includes('token') ||
        lowerKey.includes('password') ||
        lowerKey.includes('secret') ||
        lowerKey.includes('apikey') ||
        lowerKey.includes('api_key')
      ) {
        safe[key] = '[REDACTED]';
      } else if (typeof data[key] === 'object') {
        safe[key] = safeLog(data[key]);
      } else if (typeof data[key] === 'string') {
        safe[key] = redactSensitiveData(data[key]);
      } else {
        safe[key] = data[key];
      }
    }
    
    return safe;
  }
  
  return data;
}

/**
 * Secure cookie options
 */
export const secureCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: config.session.maxAge,
};

/**
 * Get secure headers for API requests
 */
export function getSecureHeaders(): HeadersInit {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };
}

/**
 * Validate token format (basic validation)
 */
export function isValidTokenFormat(token: string): boolean {
  // Check if token is not empty and has reasonable length
  if (!token || token.length < 10) {
    return false;
  }
  
  // Check if token contains only allowed characters
  const validPattern = /^[A-Za-z0-9\-._~+/]+=*$/;
  return validPattern.test(token);
}

/**
 * Hash sensitive data (for client-side comparison only, NOT for security!)
 * Use proper backend hashing for actual security
 */
export function simpleHash(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(36);
}

/**
 * Generate random string (for client-side nonces, NOT for security!)
 */
export function generateNonce(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * Sanitize URL to prevent open redirects
 */
export function sanitizeRedirectUrl(url: string, allowedDomains: string[] = []): string | null {
  try {
    // Allow relative URLs
    if (url.startsWith('/') && !url.startsWith('//')) {
      return url;
    }
    
    // Check absolute URLs
    const parsed = new URL(url);
    
    // Allow same origin
    if (typeof window !== 'undefined' && parsed.origin === window.location.origin) {
      return url;
    }
    
    // Check allowed domains
    if (allowedDomains.some((domain) => parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`))) {
      return url;
    }
    
    // Block external URLs by default
    return null;
  } catch {
    // Invalid URL
    return null;
  }
}
