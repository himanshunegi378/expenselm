"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseErrorDefinitions = void 0;
const zod_1 = require("zod");
exports.ExpenseErrorDefinitions = {
    EXPENSE_NOT_FOUND: {
        code: 'EXPENSE_NOT_FOUND',
        message: 'Expense not found',
        httpStatus: 404,
        detailsSchema: zod_1.z.object({ expenseId: zod_1.z.string().optional() }).optional()
    },
    CATEGORY_NOT_FOUND: {
        code: 'CATEGORY_NOT_FOUND',
        message: 'Category not found',
        httpStatus: 404,
        detailsSchema: zod_1.z.object({ categoryId: zod_1.z.string().optional() }).optional()
    },
    USER_NOT_FOUND: {
        code: 'USER_NOT_FOUND',
        message: 'User not found',
        httpStatus: 404,
        detailsSchema: zod_1.z.object({ userId: zod_1.z.string().optional() }).optional()
    },
    INVALID_INPUT: {
        code: 'INVALID_INPUT',
        message: 'Invalid input data',
        httpStatus: 400,
        detailsSchema: zod_1.z.any().optional()
    },
    UNAUTHORIZED: {
        code: 'UNAUTHORIZED',
        message: 'You are not authorized to perform this action',
        httpStatus: 403,
        detailsSchema: zod_1.z.object({ userId: zod_1.z.string().optional(), resourceId: zod_1.z.string().optional() }).optional()
    }
};
