import { z } from 'zod';

export const ExpenseErrorDefinitions = {
  EXPENSE_NOT_FOUND: {
    code: 'EXPENSE_NOT_FOUND',
    message: 'Expense not found',
    httpStatus: 404,
    detailsSchema: z.object({ expenseId: z.string().optional() }).optional()
  },
  CATEGORY_NOT_FOUND: {
    code: 'CATEGORY_NOT_FOUND',
    message: 'Category not found',
    httpStatus: 404,
    detailsSchema: z.object({ categoryId: z.string().optional() }).optional()
  },
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: 'User not found',
    httpStatus: 404,
    detailsSchema: z.object({ userId: z.string().optional() }).optional()
  },
  INVALID_INPUT: {
    code: 'INVALID_INPUT',
    message: 'Invalid input data',
    httpStatus: 400,
    detailsSchema: z.any().optional()
  },
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'You are not authorized to perform this action',
    httpStatus: 403,
    detailsSchema: z.object({ userId: z.string().optional(), resourceId: z.string().optional() }).optional()
  }
};

export type ExpenseErrorCode = keyof typeof ExpenseErrorDefinitions;
