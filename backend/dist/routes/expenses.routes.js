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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const validation_1 = require("../utils/validation");
const router = (0, express_1.Router)();
// In-memory store for demonstration
let expenses = [];
// Helper function to send JSON response
const sendResponse = (res, status, data) => {
    res.status(status).json(data);
    return Promise.resolve();
};
// Create a new expense
router.post('/', (0, validation_1.validate)(validation_1.expenseSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newExpense = Object.assign(Object.assign({ id: crypto.randomUUID() }, req.validatedData), { createdAt: new Date() });
        expenses.push(newExpense);
        yield sendResponse(res, 201, {
            success: true,
            data: newExpense,
        });
    }
    catch (error) {
        next(error);
    }
}));
// Get all expenses with optional query params
router.get('/', (0, validation_1.validateQuery)(validation_1.expenseSchema.partial().extend({
    startDate: zod_1.z.string().datetime().optional(),
    endDate: zod_1.z.string().datetime().optional(),
})), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let filteredExpenses = [...expenses];
        // Filter by query params if provided
        const _a = req.query, { startDate, endDate } = _a, filters = __rest(_a, ["startDate", "endDate"]);
        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                filteredExpenses = filteredExpenses.filter((expense) => expense[key] === value);
            }
        });
        // Filter by date range if provided
        if (startDate || endDate) {
            filteredExpenses = filteredExpenses.filter((expense) => {
                const expenseDate = new Date(expense.date);
                const start = startDate ? new Date(startDate) : new Date(0);
                const end = endDate ? new Date(endDate) : new Date();
                return expenseDate >= start && expenseDate <= end;
            });
        }
        yield sendResponse(res, 200, {
            success: true,
            data: filteredExpenses,
        });
    }
    catch (error) {
        next(error);
    }
}));
// Get a single expense by ID
router.get('/:id', (0, validation_1.validateParams)(validation_1.idParamSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expense = expenses.find((e) => e.id === req.params.id);
        if (!expense) {
            yield sendResponse(res, 404, {
                success: false,
                error: 'Expense not found',
            });
            return;
        }
        yield sendResponse(res, 200, {
            success: true,
            data: expense,
        });
    }
    catch (error) {
        next(error);
    }
}));
// Update an expense
router.put('/:id', [
    (0, validation_1.validateParams)(validation_1.idParamSchema),
    (0, validation_1.validate)(validation_1.expenseSchema.partial()),
], (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const index = expenses.findIndex((e) => e.id === req.params.id);
        if (index === -1) {
            yield sendResponse(res, 404, {
                success: false,
                error: 'Expense not found',
            });
            return;
        }
        const updatedExpense = Object.assign(Object.assign(Object.assign({}, expenses[index]), req.validatedData), { updatedAt: new Date() });
        expenses[index] = updatedExpense;
        yield sendResponse(res, 200, {
            success: true,
            data: updatedExpense,
        });
    }
    catch (error) {
        next(error);
    }
}));
// Delete an expense
router.delete('/:id', (0, validation_1.validateParams)(validation_1.idParamSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const index = expenses.findIndex((e) => e.id === req.params.id);
        if (index === -1) {
            yield sendResponse(res, 404, {
                success: false,
                error: 'Expense not found',
            });
            return;
        }
        const [deletedExpense] = expenses.splice(index, 1);
        yield sendResponse(res, 200, {
            success: true,
            data: deletedExpense,
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
