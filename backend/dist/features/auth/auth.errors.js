"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthErrorDefinitions = void 0;
const zod_1 = require("zod");
/**
 * Error definitions for the Auth feature
 */
exports.AuthErrorDefinitions = {
    AUTH_NO_TOKEN: {
        code: 'AUTH_NO_TOKEN',
        message: 'Unauthorized - No token provided',
        httpStatus: 401,
        detailsSchema: zod_1.z.object({}).optional(), // No extra details
    },
    AUTH_INVALID_TOKEN: {
        code: 'AUTH_INVALID_TOKEN',
        message: 'Unauthorized - Invalid token',
        httpStatus: 401,
        detailsSchema: zod_1.z.object({ reason: zod_1.z.string().optional() }).optional(),
    },
    AUTH_UNAUTHORIZED: {
        code: 'AUTH_UNAUTHORIZED',
        message: 'Unauthorized access',
        httpStatus: 401,
        detailsSchema: zod_1.z.object({}).optional(),
    },
    USER_NOT_FOUND: {
        code: 'USER_NOT_FOUND',
        message: 'User not found',
        httpStatus: 404,
        detailsSchema: zod_1.z.object({ userId: zod_1.z.string().optional() }).optional(),
    },
    USER_ALREADY_EXISTS: {
        code: 'USER_ALREADY_EXISTS',
        message: 'User already exists',
        httpStatus: 409,
        detailsSchema: zod_1.z.object({ email: zod_1.z.string().email().optional() }).optional(),
    },
    INVALID_CREDENTIALS: {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
        httpStatus: 401,
        detailsSchema: zod_1.z.object({ email: zod_1.z.string().email().optional() }).optional(),
    },
    VALIDATION_ERROR: {
        code: 'VALIDATION_ERROR',
        message: 'Validation error',
        httpStatus: 400,
        detailsSchema: zod_1.z.any().optional(), // Zod error format
    },
};
