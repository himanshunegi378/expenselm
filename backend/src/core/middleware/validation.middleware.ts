import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { formatError } from '../utils/responseFormatter';
import { ValidationErrorDefinitions } from './validation.errors';

/**
 * Middleware to validate request data against a Zod schema
 */
export const validate = (schema: ZodSchema) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json(formatError(ValidationErrorDefinitions.VALIDATION_ERROR, result.error.format()));
      }
      
      // Add validated data to request object
      (req as any).validatedData = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };

/**
 * Middleware to validate query parameters against a Zod schema
 */
export const validateQuery = (schema: ZodSchema) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.query);
      
      if (!result.success) {
        return res.status(400).json(formatError(ValidationErrorDefinitions.QUERY_VALIDATION_ERROR, result.error.format()));
      }
      
      // Replace query with validated data
      req.query = result.data as any;
      next();
    } catch (error) {
      next(error);
    }
  };

/**
 * Middleware to validate URL parameters against a Zod schema
 */
export const validateParams = (schema: ZodSchema) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.params);
      
      if (!result.success) {
        return res.status(400).json(formatError(ValidationErrorDefinitions.PARAM_VALIDATION_ERROR, result.error.format()));
      }
      
      // Replace params with validated data
      req.params = result.data as any;
      next();
    } catch (error) {
      next(error);
    }
  };
