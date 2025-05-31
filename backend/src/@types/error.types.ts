import { z, ZodTypeAny } from 'zod';

/**
 * Generic error definition interface used across the application
 */
export interface ErrorDefinition {
  code: string;
  message: string;
  httpStatus: number;
  detailsSchema: ZodTypeAny;
}

/**
 * Type for API error response 
 */
export interface ErrorResponse<T extends ErrorDefinition> {
  success: false;
  error: {
    code: T['code'];
    message: T['message'];
    details?: z.infer<T['detailsSchema']>;
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
