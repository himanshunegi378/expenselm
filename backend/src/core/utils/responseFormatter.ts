/**
 * Centralized response formatter for consistent API responses
 */

import { ErrorDefinition, SuccessResponse, ErrorResponse } from '../../@types/error.types';
import { z } from 'zod';


export class AppError<T extends ErrorDefinition> extends Error {
  constructor(public errorDef: T, private details?: z.infer<T['detailsSchema']>) {
    super(errorDef.message);
    this.name = errorDef.code;
    this.errorDef = errorDef;
    this.details = details;
    this.stack = (new Error()).stack;
  }

  format() {
    return formatError(this.errorDef, this.details);
  }
}

// Response types are now imported from @types/error.types

/**
 * Format a successful response
 * @param data - The data to include in the response
 * @param message - Optional success message (defaults to 'Operation successful')
 * @returns A formatted success response object
 */
export const formatSuccess = <T>(data: T, message = 'Operation successful'): SuccessResponse<T> => {
  return {
    success: true,
    message,
    data,
  };
};

/**
 * Format an error response using an error definition
 * @param errorDef - The error definition
 * @param details - Optional error details that should match the detailsSchema in the error definition
 * @returns A formatted error response object
 */
export const formatError = <T extends ErrorDefinition>(
  errorDef: T,
  details: z.infer<T['detailsSchema']> | null = null
): ErrorResponse<T> => {
  const errorResponse: ErrorResponse<T> = {
    success: false,
    error: {
      code: errorDef.code,
      message: errorDef.message,
    },
  };

  if (details) {
    // In a production app, you might want to validate the details against the schema here
    errorDef.detailsSchema.parse(details);
    errorResponse.error.details = details;
  }

  return errorResponse;
};
