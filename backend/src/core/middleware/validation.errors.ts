import { z } from 'zod';

/**
 * Error definitions for validation middleware
 */
export const ValidationErrorDefinitions = {
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    message: 'Validation error',
    httpStatus: 400,
    detailsSchema: z.any(), // Can be any format from Zod
  },
  QUERY_VALIDATION_ERROR: {
    code: 'QUERY_VALIDATION_ERROR',
    message: 'Query validation error',
    httpStatus: 400,
    detailsSchema: z.any(),
  },
  PARAM_VALIDATION_ERROR: {
    code: 'PARAM_VALIDATION_ERROR',
    message: 'Parameter validation error',
    httpStatus: 400,
    detailsSchema: z.any(),
  },
};

export type ValidationErrorCode = keyof typeof ValidationErrorDefinitions;
