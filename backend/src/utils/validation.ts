import { z } from 'zod';

// Common validation schemas
export const idParamSchema = z.object({
  id: z.string().min(1, 'ID is required').uuid('Invalid ID format'),
});

// Example user schema
export const userSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Example login schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Example expense schema
export const expenseSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  date: z.string().datetime('Invalid date format').or(z.date()),
});

// Validation middleware
export const validate = (schema: z.ZodSchema) => 
  (req: any, res: any, next: any) => {
    try {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          errors: result.error.format(),
        });
      }
      req.validatedData = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };

// Query params validation
export const validateQuery = (schema: z.ZodSchema) => 
  (req: any, res: any, next: any) => {
    try {
      const result = schema.safeParse(req.query);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          errors: result.error.format(),
        });
      }
      req.query = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };

// Params validation
export const validateParams = (schema: z.ZodSchema) => 
  (req: any, res: any, next: any) => {
    try {
      const result = schema.safeParse(req.params);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          errors: result.error.format(),
        });
      }
      req.params = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
