"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenseUpdateSchema = exports.categoryOrderedByLikelinesSchema = exports.expenseInputSchema = void 0;
const zod_1 = require("zod");
exports.expenseInputSchema = zod_1.z.object({
    amount: zod_1.z.union([
        zod_1.z.number().positive('Amount must be positive'),
        zod_1.z.string().regex(/^\d+(\.\d{1,2})?$/, 'Amount must be a valid number')
    ]),
    description: zod_1.z.string().min(1, 'Description is required'),
    notes: zod_1.z.string().optional(),
    date: zod_1.z.union([
        zod_1.z.string().refine(val => !isNaN(Date.parse(val)), 'Date must be a valid string'),
        zod_1.z.date()
    ]),
    categoryId: zod_1.z.string().min(1, 'Category is required'),
});
exports.categoryOrderedByLikelinesSchema = zod_1.z.object({
    description: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional().nullable(),
});
exports.expenseUpdateSchema = exports.expenseInputSchema.partial();
