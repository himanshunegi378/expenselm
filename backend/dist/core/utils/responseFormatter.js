"use strict";
/**
 * Centralized response formatter for consistent API responses
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatError = exports.formatSuccess = exports.AppError = void 0;
class AppError extends Error {
    constructor(errorDef, details) {
        super(errorDef.message);
        this.errorDef = errorDef;
        this.details = details;
        this.name = errorDef.code;
        this.errorDef = errorDef;
        this.details = details;
        this.stack = (new Error()).stack;
    }
    format() {
        return (0, exports.formatError)(this.errorDef, this.details);
    }
}
exports.AppError = AppError;
// Response types are now imported from @types/error.types
/**
 * Format a successful response
 * @param data - The data to include in the response
 * @param message - Optional success message (defaults to 'Operation successful')
 * @returns A formatted success response object
 */
const formatSuccess = (data, message = 'Operation successful') => {
    return {
        success: true,
        message,
        data,
    };
};
exports.formatSuccess = formatSuccess;
/**
 * Format an error response using an error definition
 * @param errorDef - The error definition
 * @param details - Optional error details that should match the detailsSchema in the error definition
 * @returns A formatted error response object
 */
const formatError = (errorDef, details = null) => {
    const errorResponse = {
        success: false,
        error: {
            code: errorDef.code,
            message: errorDef.message,
        },
    };
    if (details) {
        // In a production app, you might want to validate the details against the schema here
        errorDef.detailsSchema.parse(details);
        errorResponse.error.details = details;
    }
    return errorResponse;
};
exports.formatError = formatError;
