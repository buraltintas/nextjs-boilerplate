/**
 * Error Boundary Component
 * 
 * React Error Boundary for catching and handling errors in component tree
 */

'use client';

import React, { Component, ErrorInfo } from 'react';
import { AppError, ErrorSeverity } from './types';
import { normalizeError } from './normalizer';
import { captureError } from '@/infra/observability';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: (error: AppError, reset: () => void) => React.ReactNode;
  onError?: (error: AppError, errorInfo: ErrorInfo) => void;
  level?: 'route' | 'global';
}

interface ErrorBoundaryState {
  error: AppError | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * 
 * @example
 * <ErrorBoundary fallback={(error, reset) => <ErrorUI error={error} onRetry={reset} />}>
 *   <MyComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      error: normalizeError(error),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const normalizedError = normalizeError(error);

    // Capture error for observability - convert AppError to Error
    const errorForCapture = new Error(normalizedError.message);
    errorForCapture.name = normalizedError.code;
    if (normalizedError.originalError?.stack) {
      errorForCapture.stack = normalizedError.originalError.stack;
    }
    
    captureError(errorForCapture, {
      ...normalizedError.metadata,
      componentStack: errorInfo.componentStack,
      level: this.props.level || 'route',
      severity: normalizedError.severity,
      recoverable: normalizedError.recoverable,
      category: normalizedError.category,
      timestamp: normalizedError.timestamp,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(normalizedError, errorInfo);
    }

    this.setState({ errorInfo });
  }

  reset = (): void => {
    this.setState({
      error: null,
      errorInfo: null,
    });
  };

  render() {
    const { error } = this.state;
    const { children, fallback } = this.props;

    if (error) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback(error, this.reset);
      }

      // Use default error UI
      return <DefaultErrorFallback error={error} onReset={this.reset} />;
    }

    return children;
  }
}

/**
 * Default Error Fallback UI
 */
function DefaultErrorFallback({
  error,
  onReset,
}: {
  error: AppError;
  onReset: () => void;
}) {
  const isFatal = error.severity === ErrorSeverity.FATAL;
  const isRecoverable = error.recoverable;

  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '600px',
        margin: '2rem auto',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: '3rem',
          marginBottom: '1rem',
        }}
      >
        {isFatal ? '💥' : '⚠️'}
      </div>
      
      <h2
        style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: isFatal ? '#dc2626' : '#ea580c',
        }}
      >
        {isFatal ? 'Something went wrong' : 'Oops! An error occurred'}
      </h2>

      <p
        style={{
          color: '#6b7280',
          marginBottom: '2rem',
        }}
      >
        {error.message}
      </p>

      {isRecoverable && (
        <button
          onClick={onReset}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            cursor: 'pointer',
            marginRight: '0.5rem',
          }}
        >
          Try Again
        </button>
      )}

      <button
        onClick={() => window.location.href = '/'}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#6b7280',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          fontSize: '1rem',
          cursor: 'pointer',
        }}
      >
        Go Home
      </button>

      {process.env.NODE_ENV === 'development' && error.originalError && (
        <details
          style={{
            marginTop: '2rem',
            textAlign: 'left',
            padding: '1rem',
            backgroundColor: '#f3f4f6',
            borderRadius: '0.5rem',
          }}
        >
          <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
            Error Details (dev only)
          </summary>
          <pre
            style={{
              marginTop: '1rem',
              fontSize: '0.875rem',
              overflow: 'auto',
            }}
          >
            {error.originalError.stack}
          </pre>
        </details>
      )}
    </div>
  );
}
