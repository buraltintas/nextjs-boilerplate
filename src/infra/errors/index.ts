/**
 * Error Handling Module
 * 
 * Global error handling strategy with:
 * - Error normalization
 * - Error boundaries
 * - Reusable error UI
 * - Recoverable vs fatal error distinction
 */

// Types
export type {
  AppError,
  ErrorHandler,
  ErrorRecoveryAction,
} from './types';

export {
  ErrorSeverity,
  ErrorCategory,
} from './types';

// Normalizer
export {
  normalizeError,
  createAppError,
} from './normalizer';

// Error Boundary
export { ErrorBoundary } from './error-boundary';

// Error UI Components
export {
  ErrorCard,
  ErrorMessage,
  NetworkErrorBanner,
} from './error-ui';
