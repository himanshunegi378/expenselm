"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const expenses_controller_1 = require("./expenses.controller");
const expenses_validation_1 = require("./expenses.validation");
const validation_1 = require("../../utils/validation");
const auth_middleware_1 = require("../auth/middleware/auth.middleware");
const asyncHandler = (fn) => (req, res, next) => {
    try {
        const result = fn(req, res, next);
        if (result instanceof Promise) {
            result.catch(next);
        }
    }
    catch (error) {
        next(error);
    }
};
const router = (0, express_1.Router)();
const expensesController = new expenses_controller_1.ExpensesController();
// All routes require authentication
router.use(auth_middleware_1.authenticate);
// Expense routes
router.post('/', (0, validation_1.validate)(expenses_validation_1.expenseInputSchema), asyncHandler(expensesController.createExpense));
router.get('/', asyncHandler(expensesController.getUserExpenses));
router.get('/summary', asyncHandler(expensesController.getExpenseSummary));
router.get('/:id', asyncHandler(expensesController.getExpenseById));
router.put('/:id', (0, validation_1.validate)(expenses_validation_1.expenseUpdateSchema), asyncHandler(expensesController.updateExpense));
router.delete('/:id', asyncHandler(expensesController.deleteExpense));
// Category routes
router.get('/categories/all', asyncHandler(expensesController.getAllCategories));
router.post('/categories/orderedByLikeliness', (0, validation_1.validate)(expenses_validation_1.categoryOrderedByLikelinesSchema), asyncHandler(expensesController.getAllCategoriesOrderedByLikeliness));
router.post('/categories', asyncHandler(expensesController.createCategory));
exports.default = router;
