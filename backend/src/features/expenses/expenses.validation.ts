import { z } from 'zod';

export const expenseInputSchema = z.object({
  amount: z.union([
    z.number().positive('Amount must be positive'),
    z.string().regex(/^\d+(\.\d{1,2})?$/, 'Amount must be a valid number')
  ]),
  description: z.string().min(1, 'Description is required'),
  notes: z.string().optional(),
  date: z.union([
    z.string().refine(val => !isNaN(Date.parse(val)), 'Date must be a valid string'),
    z.date()
  ]),
  categoryId: z.string().min(1, 'Category is required'),
});

export const expenseUpdateSchema = expenseInputSchema.partial();


