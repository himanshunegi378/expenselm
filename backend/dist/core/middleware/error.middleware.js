"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const responseFormatter_1 = require("../utils/responseFormatter");
const auth_errors_1 = require("../../features/auth/auth.errors");
const errorHandler = (err, req, res, next) => {
    var _a;
    console.error(err);
    // Default error status and message
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong';
    // Prisma specific errors
    if ((_a = err.code) === null || _a === void 0 ? void 0 : _a.startsWith('P')) {
        if (err.code === 'P2002') { // Unique constraint violation
            return res.status(409).json((0, responseFormatter_1.formatError)(auth_errors_1.AuthErrorDefinitions.USER_ALREADY_EXISTS));
        }
    }
    // Return error response
    const details = process.env.NODE_ENV === 'development' ? { stack: err.stack, message } : { message };
    return res.status(statusCode).json((0, responseFormatter_1.formatError)(auth_errors_1.AuthErrorDefinitions.AUTH_UNAUTHORIZED, details));
};
exports.errorHandler = errorHandler;
