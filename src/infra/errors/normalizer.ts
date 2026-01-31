/**
 * Error Normalizer
 * 
 * Converts various error types into normalized AppError format
 */

import { AppError, ErrorCategory, ErrorSeverity } from './types';
import { BFFError } from '@/bff/errors';

/**
 * Normalize any error into AppError format
 */
export function normalizeError(error: unknown): AppError {
  const timestamp = Date.now();

  // Already normalized
  if (isAppError(error)) {
    return error as AppError;
  }

  // BFF errors
  if (error instanceof BFFError) {
    return normalizeBFFError(error, timestamp);
  }

  // Network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Network connection failed. Please check your internet connection.',
      severity: ErrorSeverity.ERROR,
      category: ErrorCategory.NETWORK,
      recoverable: true,
      originalError: error as Error,
      timestamp,
    };
  }

  // Standard Error objects
  if (error instanceof Error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message || 'An unexpected error occurred',
      severity: ErrorSeverity.ERROR,
      category: ErrorCategory.UNKNOWN,
      recoverable: false,
      originalError: error,
      timestamp,
    };
  }

  // String errors
  if (typeof error === 'string') {
    return {
      code: 'UNKNOWN_ERROR',
      message: error,
      severity: ErrorSeverity.ERROR,
      category: ErrorCategory.UNKNOWN,
      recoverable: false,
      timestamp,
    };
  }

  // Unknown error type
  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred',
    severity: ErrorSeverity.ERROR,
    category: ErrorCategory.UNKNOWN,
    recoverable: false,
    metadata: { originalError: error },
    timestamp,
  };
}

/**
 * Normalize BFF errors
 */
function normalizeBFFError(error: BFFError, timestamp: number): AppError {
  const category = categorizeBFFError(error);
  const severity = categorizeSeverity(error.statusCode);
  const recoverable = isRecoverable(error.statusCode);

  return {
    code: error.code || `HTTP_${error.statusCode}`,
    message: error.message,
    severity,
    category,
    recoverable,
    originalError: error,
    metadata: {
      statusCode: error.statusCode,
      details: error.details,
    },
    timestamp,
  };
}

/**
 * Categorize BFF error by status code
 */
function categorizeBFFError(error: BFFError): ErrorCategory {
  const { statusCode } = error;

  if (statusCode === 401 || statusCode === 403) {
    return ErrorCategory.AUTH;
  }

  if (statusCode === 404) {
    return ErrorCategory.NOT_FOUND;
  }

  if (statusCode === 422 || statusCode === 400) {
    return ErrorCategory.VALIDATION;
  }

  if (statusCode >= 500) {
    return ErrorCategory.SERVER;
  }

  if (statusCode >= 400) {
    return ErrorCategory.CLIENT;
  }

  return ErrorCategory.UNKNOWN;
}

/**
 * Categorize error severity by status code
 */
function categorizeSeverity(statusCode: number): ErrorSeverity {
  if (statusCode >= 500) {
    return ErrorSeverity.FATAL;
  }

  if (statusCode >= 400) {
    return ErrorSeverity.ERROR;
  }

  return ErrorSeverity.WARNING;
}

/**
 * Check if error is recoverable
 */
function isRecoverable(statusCode: number): boolean {
  // Network errors, rate limits, timeouts are recoverable
  if (statusCode === 408 || statusCode === 429 || statusCode === 503) {
    return true;
  }

  // Auth errors might be recoverable (refresh token)
  if (statusCode === 401) {
    return true;
  }

  // Client errors are generally not recoverable
  if (statusCode >= 400 && statusCode < 500) {
    return false;
  }

  // Server errors might be temporary
  if (statusCode >= 500) {
    return true;
  }

  return false;
}

/**
 * Check if error is AppError
 */
function isAppError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'severity' in error &&
    'category' in error &&
    'recoverable' in error
  );
}

/**
 * Create a custom AppError
 */
export function createAppError(
  code: string,
  message: string,
  options: {
    severity?: ErrorSeverity;
    category?: ErrorCategory;
    recoverable?: boolean;
    metadata?: Record<string, any>;
  } = {}
): AppError {
  return {
    code,
    message,
    severity: options.severity || ErrorSeverity.ERROR,
    category: options.category || ErrorCategory.UNKNOWN,
    recoverable: options.recoverable ?? false,
    metadata: options.metadata,
    timestamp: Date.now(),
  };
}
