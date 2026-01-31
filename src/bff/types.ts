/**
 * Type definitions for BFF layer
 */

export interface BFFRequestInit extends RequestInit {
  timeout?: number;
  skipAuth?: boolean;
}

export interface BFFResponse<T = unknown> {
  data: T;
  status: number;
  headers: Headers;
}

export interface ErrorResponse {
  message: string;
  code?: string;
  details?: unknown;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
}
