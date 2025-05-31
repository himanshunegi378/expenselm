import { Request, Response, NextFunction } from 'express';
import { AppError, formatError } from '../utils/responseFormatter';
import { AuthErrorDefinitions } from '../../features/auth/auth.errors';



export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  // Default error status and message
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';

  // Prisma specific errors
  if (err.code?.startsWith('P')) {
    if (err.code === 'P2002') { // Unique constraint violation
      return res.status(409).json(formatError(AuthErrorDefinitions.USER_ALREADY_EXISTS));
    }
  }

  // Return error response
  const details = process.env.NODE_ENV === 'development' ? { stack: err.stack, message } : { message };
  return res.status(statusCode).json(formatError(AuthErrorDefinitions.AUTH_UNAUTHORIZED, details));
};
