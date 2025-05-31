import { z } from 'zod';

/**
 * Error definitions for the Auth feature
 */

export const AuthErrorDefinitions = {
  AUTH_NO_TOKEN: {
    code: 'AUTH_NO_TOKEN',
    message: 'Unauthorized - No token provided',
    httpStatus: 401,
    detailsSchema: z.object({}).optional(), // No extra details
  },
  AUTH_INVALID_TOKEN: {
    code: 'AUTH_INVALID_TOKEN',
    message: 'Unauthorized - Invalid token',
    httpStatus: 401,
    detailsSchema: z.object({ reason: z.string().optional() }).optional(),
  },
  AUTH_UNAUTHORIZED: {
    code: 'AUTH_UNAUTHORIZED',
    message: 'Unauthorized access',
    httpStatus: 401,
    detailsSchema: z.object({}).optional(),
  },
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: 'User not found',
    httpStatus: 404,
    detailsSchema: z.object({ userId: z.string().optional() }).optional(),
  },
  USER_ALREADY_EXISTS: {
    code: 'USER_ALREADY_EXISTS',
    message: 'User already exists',
    httpStatus: 409,
    detailsSchema: z.object({ email: z.string().email().optional() }).optional(),
  },
  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    message: 'Invalid email or password',
    httpStatus: 401,
    detailsSchema: z.object({ email: z.string().email().optional() }).optional(),
  },
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    message: 'Validation error',
    httpStatus: 400,
    detailsSchema: z.any().optional(), // Zod error format
  },
};

export type AuthErrorCode = keyof typeof AuthErrorDefinitions;
