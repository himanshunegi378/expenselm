"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const expenses_routes_1 = __importDefault(require("./features/expenses/expenses.routes"));
const responseFormatter_1 = require("./core/utils/responseFormatter");
const app_error_1 = require("./app.error");
const prisma_1 = require("./core/db/prisma");
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
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
app.use('/api/expenses', expenses_routes_1.default);
app.get('/api/dbCheck', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // ping db using prisma because supabase hibernate if no activity for a week
        yield prisma_1.prisma.$queryRaw `SELECT 1`;
        res.json((0, responseFormatter_1.formatSuccess)(null, 'Database connection successful'));
    }
    catch (error) {
        console.error('Database connection failed:', error);
        throw new responseFormatter_1.AppError(app_error_1.AppErrorDefinitions.DB_ERROR, {
            error: error instanceof Error ? error.message : 'Unknown error while connecting to database'
        });
    }
}));
// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Not Found' });
});
// Custom error handler function with correct typing
const handleErrors = (err, req, res, next) => {
    // Log the error
    console.error(err);
    if (!(err instanceof responseFormatter_1.AppError)) {
        const error = new responseFormatter_1.AppError(app_error_1.AppErrorDefinitions.SERVER_ERROR);
        res.status(error.errorDef.httpStatus).json(error.format());
        return;
    }
    res.status(err.errorDef.httpStatus).json(err.format());
};
// Apply error handler middleware
app.use(handleErrors);
exports.default = app;
