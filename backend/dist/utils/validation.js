"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParams = exports.validateQuery = exports.validate = exports.expenseSchema = exports.loginSchema = exports.userSchema = exports.idParamSchema = void 0;
const zod_1 = require("zod");
// Common validation schemas
exports.idParamSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, 'ID is required').uuid('Invalid ID format'),
});
// Example user schema
exports.userSchema = zod_1.z.object({
    username: zod_1.z.string().min(3, 'Username must be at least 3 characters'),
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
// Example login schema
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
// Example expense schema
exports.expenseSchema = zod_1.z.object({
    amount: zod_1.z.number().positive('Amount must be positive'),
    description: zod_1.z.string().min(1, 'Description is required'),
    category: zod_1.z.string().min(1, 'Category is required'),
    date: zod_1.z.string().datetime('Invalid date format').or(zod_1.z.date()),
});
// Validation middleware
const validate = (schema) => (req, res, next) => {
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
    }
    catch (error) {
        next(error);
    }
};
exports.validate = validate;
// Query params validation
const validateQuery = (schema) => (req, res, next) => {
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
    }
    catch (error) {
        next(error);
    }
};
exports.validateQuery = validateQuery;
// Params validation
const validateParams = (schema) => (req, res, next) => {
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
    }
    catch (error) {
        next(error);
    }
};
exports.validateParams = validateParams;
