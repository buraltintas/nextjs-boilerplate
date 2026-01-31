/**
 * Error Types
 */

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  FATAL = 'fatal',
}

/**
 * Error categories for classification
 */
export enum ErrorCategory {
  NETWORK = 'network',
  AUTH = 'auth',
  VALIDATION = 'validation',
  NOT_FOUND = 'not_found',
  PERMISSION = 'permission',
  SERVER = 'server',
  CLIENT = 'client',
  UNKNOWN = 'unknown',
}

/**
 * Normalized application error
 */
export interface AppError {
  code: string;
  message: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  recoverable: boolean;
  originalError?: Error;
  metadata?: Record<string, any>;
  timestamp: number;
}

/**
 * Error handler function type
 */
export type ErrorHandler = (error: AppError) => void;

/**
 * Error recovery action
 */
export interface ErrorRecoveryAction {
  label: string;
  action: () => void;
}
