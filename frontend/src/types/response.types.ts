/**
 * Response type definitions for API responses
 * Mirrors the backend structure for consistency
 */

/**
 * Basic error definition interface
 */
export interface ErrorDefinition {
  code: string;
  message: string;
}

/**
 * Type for API error response
 */
export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any; // Optional error details
  };
}

/**
 * Type for successful API response
 */
export interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

/**
 * Union type for all API responses
 */
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

/**
 * Type guard to check if a response is successful
 */
export function isSuccessResponse<T>(response: ApiResponse<T>): response is SuccessResponse<T> {
  return response.success === true;
}

/**
 * Type guard to check if a response is an error
 */
export function isErrorResponse<T>(response: ApiResponse<T>): response is ErrorResponse {
  return response.success === false;
}