import z from "zod";

export const expenseSchema = z.object({
    id: z.string().optional(),
    amount: z.union([
      z.number().positive('Amount must be positive'),
      z.string().regex(/^\d+(\.\d{1,2})?$/, 'Amount must be a valid number')
    ]),
    description: z.string().min(1, 'Description is required'),
    notes: z.string().optional(),
    date: z.string().refine(val => !isNaN(Date.parse(val)), 'Date must be a valid string'),
    categoryId: z.string().min(1, 'Category is required'),
  });

  export const expenseFormSchema = z.object({
    amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Amount must be a valid number'),
    description: z.string().min(1, 'Description is required'),
    notes: z.string().optional(),
    categoryId: z.string().min(1, 'Category is required'),
    date: z.string().refine(val => !isNaN(Date.parse(val)), 'Date must be a valid string'),
  });

export type Expense = z.infer<typeof expenseSchema>;
export type ExpenseForm = z.infer<typeof expenseFormSchema>;