/**
 * Reusable Error UI Components
 * 
 * Domain-agnostic error UI components
 */

'use client';

import { AppError, ErrorSeverity, ErrorCategory } from './types';

interface ErrorUIProps {
  error: AppError;
  onRetry?: () => void;
  onDismiss?: () => void;
}

/**
 * Generic Error Card
 */
export function ErrorCard({ error, onRetry, onDismiss }: ErrorUIProps) {
  const Icon = getErrorIcon(error.category);
  const colors = getSeverityColors(error.severity);

  return (
    <div
      style={{
        border: `1px solid ${colors.border}`,
        borderRadius: '0.5rem',
        padding: '1rem',
        backgroundColor: colors.bg,
      }}
    >
      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ fontSize: '1.5rem' }}>{Icon}</div>
        
        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontWeight: 'bold',
              color: colors.text,
              marginBottom: '0.5rem',
            }}
          >
            {getErrorTitle(error.category)}
          </h3>
          
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            {error.message}
          </p>

          {(onRetry || onDismiss) && (
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              {error.recoverable && onRetry && (
                <button
                  onClick={onRetry}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: colors.button,
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.25rem',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  Retry
                </button>
              )}
              
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'transparent',
                    color: '#6b7280',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.25rem',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  Dismiss
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Inline Error Message
 */
export function ErrorMessage({ error }: { error: AppError | string }) {
  const normalizedError = typeof error === 'string' 
    ? { message: error, severity: ErrorSeverity.ERROR } as AppError
    : error;

  const colors = getSeverityColors(normalizedError.severity);

  return (
    <div
      style={{
        padding: '0.75rem',
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: '0.25rem',
        color: colors.text,
        fontSize: '0.875rem',
      }}
    >
      {normalizedError.message}
    </div>
  );
}

/**
 * Network Error Banner
 */
export function NetworkErrorBanner({ onRetry }: { onRetry?: () => void }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#dc2626',
        color: 'white',
        padding: '1rem',
        textAlign: 'center',
        zIndex: 9999,
      }}
    >
      <span>⚠️ Network connection lost. Please check your internet.</span>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            marginLeft: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: 'white',
            color: '#dc2626',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
}

/**
 * Helper: Get error icon
 */
function getErrorIcon(category: ErrorCategory): string {
  switch (category) {
    case ErrorCategory.NETWORK:
      return '📡';
    case ErrorCategory.AUTH:
      return '🔒';
    case ErrorCategory.NOT_FOUND:
      return '🔍';
    case ErrorCategory.PERMISSION:
      return '🚫';
    case ErrorCategory.VALIDATION:
      return '✏️';
    case ErrorCategory.SERVER:
      return '🔧';
    default:
      return '⚠️';
  }
}

/**
 * Helper: Get error title
 */
function getErrorTitle(category: ErrorCategory): string {
  switch (category) {
    case ErrorCategory.NETWORK:
      return 'Connection Error';
    case ErrorCategory.AUTH:
      return 'Authentication Error';
    case ErrorCategory.NOT_FOUND:
      return 'Not Found';
    case ErrorCategory.PERMISSION:
      return 'Permission Denied';
    case ErrorCategory.VALIDATION:
      return 'Validation Error';
    case ErrorCategory.SERVER:
      return 'Server Error';
    default:
      return 'Error';
  }
}

/**
 * Helper: Get severity colors
 */
function getSeverityColors(severity: ErrorSeverity) {
  switch (severity) {
    case ErrorSeverity.FATAL:
      return {
        bg: '#fee2e2',
        border: '#fca5a5',
        text: '#991b1b',
        button: '#dc2626',
      };
    case ErrorSeverity.ERROR:
      return {
        bg: '#fed7aa',
        border: '#fdba74',
        text: '#9a3412',
        button: '#ea580c',
      };
    case ErrorSeverity.WARNING:
      return {
        bg: '#fef3c7',
        border: '#fcd34d',
        text: '#92400e',
        button: '#f59e0b',
      };
    default:
      return {
        bg: '#dbeafe',
        border: '#93c5fd',
        text: '#1e3a8a',
        button: '#3b82f6',
      };
  }
}
