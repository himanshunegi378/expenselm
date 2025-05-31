"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const expenses_routes_1 = __importDefault(require("./routes/expenses.routes"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev')); // dev logging
// API Routes
app.use('/api', (req, res, next) => {
    res.json({ message: 'Welcome to ExpenseLM API' });
    next();
});
// Expense routes
app.use('/api/expenses', expenses_routes_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Not Found' });
});
// Error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json(Object.assign({ success: false, error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!' }, (process.env.NODE_ENV === 'development' && { stack: err.stack })));
});
// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
