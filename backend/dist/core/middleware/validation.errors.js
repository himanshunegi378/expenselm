"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationErrorDefinitions = void 0;
const zod_1 = require("zod");
/**
 * Error definitions for validation middleware
 */
exports.ValidationErrorDefinitions = {
    VALIDATION_ERROR: {
        code: 'VALIDATION_ERROR',
        message: 'Validation error',
        httpStatus: 400,
        detailsSchema: zod_1.z.any(), // Can be any format from Zod
    },
    QUERY_VALIDATION_ERROR: {
        code: 'QUERY_VALIDATION_ERROR',
        message: 'Query validation error',
        httpStatus: 400,
        detailsSchema: zod_1.z.any(),
    },
    PARAM_VALIDATION_ERROR: {
        code: 'PARAM_VALIDATION_ERROR',
        message: 'Parameter validation error',
        httpStatus: 400,
        detailsSchema: zod_1.z.any(),
    },
};
