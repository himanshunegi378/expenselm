// Types for the Expenses feature

import { z } from "zod";
import { expenseInputSchema, expenseUpdateSchema } from "./expenses.validation";


export type ExpenseInputValidated = z.infer<typeof expenseInputSchema>;
export type ExpenseUpdateInputValidated = z.infer<typeof expenseUpdateSchema>;

export type ExpenseFilters = {
    startDate?: Date | string;
    endDate?: Date | string;
    categoryId?: string;
    minAmount?: number;
    maxAmount?: number;
};
