"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// Import routes
const auth_routes_1 = __importDefault(require("./features/auth/auth.routes"));
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)('dev')); // dev logging
// API Routes
app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to ExpenseLM API',
        version: '1.0.0'
    });
});
// Mount feature routes
app.use('/api/auth', auth_routes_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Not Found' });
});
// Custom error handler function with correct typing
const handleErrors = (err, req, res, next) => {
    var _a;
    // Log the error
    console.error(err);
    // Default error status and message
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong';
    // Prisma specific errors
    if ((_a = err.code) === null || _a === void 0 ? void 0 : _a.startsWith('P')) {
        if (err.code === 'P2002') { // Unique constraint violation
            res.status(409).json({
                success: false,
                error: 'Resource already exists',
                details: message
            });
            return;
        }
    }
    // Return error response
    res.status(statusCode).json(Object.assign({ success: false, error: message }, (process.env.NODE_ENV === 'development' && { stack: err.stack })));
};
// Apply error handler middleware
app.use(handleErrors);
exports.default = app;
