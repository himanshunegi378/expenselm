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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpensesController = void 0;
const expenses_services_1 = require("./expenses.services");
const responseFormatter_1 = require("../../core/utils/responseFormatter");
const expense_errors_1 = require("./expense.errors");
class ExpensesController {
    constructor() {
        /**
         * Create a new expense
         */
        this.createExpense = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    throw new responseFormatter_1.AppError(expense_errors_1.ExpenseErrorDefinitions.UNAUTHORIZED);
                }
                const expenseData = req.body;
                const expense = yield this.expensesService.createExpense(userId, expenseData);
                res.status(201).json((0, responseFormatter_1.formatSuccess)(expense, 'Expense created successfully'));
            }
            catch (error) {
                next(error);
            }
        });
        /**
         * Get an expense by ID
         */
        this.getExpenseById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    throw new responseFormatter_1.AppError(expense_errors_1.ExpenseErrorDefinitions.UNAUTHORIZED);
                }
                const expenseId = req.params.id;
                const expense = yield this.expensesService.getExpenseById(userId, expenseId);
                if (!expense) {
                    throw new responseFormatter_1.AppError(expense_errors_1.ExpenseErrorDefinitions.EXPENSE_NOT_FOUND);
                }
                res.status(200).json((0, responseFormatter_1.formatSuccess)(expense, 'Expense retrieved successfully'));
            }
            catch (error) {
                next(error);
            }
        });
        /**
         * Update an expense
         */
        this.updateExpense = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    throw new responseFormatter_1.AppError(expense_errors_1.ExpenseErrorDefinitions.UNAUTHORIZED);
                }
                const expenseId = req.params.id;
                const updateData = req.body;
                const expense = yield this.expensesService.updateExpense(userId, expenseId, updateData);
                res.status(200).json((0, responseFormatter_1.formatSuccess)(expense, 'Expense updated successfully'));
            }
            catch (error) {
                next(error);
            }
        });
        /**
         * Delete an expense
         */
        this.deleteExpense = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    throw new responseFormatter_1.AppError(expense_errors_1.ExpenseErrorDefinitions.UNAUTHORIZED);
                }
                const expenseId = req.params.id;
                yield this.expensesService.deleteExpense(userId, expenseId);
                res.status(200).json((0, responseFormatter_1.formatSuccess)(null, 'Expense deleted successfully'));
            }
            catch (error) {
                next(error);
            }
        });
        /**
         * Get all expenses for a user with optional filters
         */
        this.getUserExpenses = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    throw new responseFormatter_1.AppError(expense_errors_1.ExpenseErrorDefinitions.UNAUTHORIZED);
                }
                const filters = req.query;
                const expenses = yield this.expensesService.getUserExpenses(userId, filters);
                res.status(200).json((0, responseFormatter_1.formatSuccess)(expenses, 'Expenses retrieved successfully'));
            }
            catch (error) {
                next(error);
            }
        });
        /**
         * Get expense summary statistics
         */
        this.getExpenseSummary = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    throw new responseFormatter_1.AppError(expense_errors_1.ExpenseErrorDefinitions.UNAUTHORIZED);
                }
                const { startDate, endDate } = req.query;
                const summary = yield this.expensesService.getExpenseSummary(userId, startDate, endDate);
                res.status(200).json((0, responseFormatter_1.formatSuccess)(summary, 'Expense summary retrieved successfully'));
            }
            catch (error) {
                next(error);
            }
        });
        /**
         * Get all available categories
         */
        this.getAllCategories = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield this.expensesService.getAllCategories();
                res.status(200).json((0, responseFormatter_1.formatSuccess)(categories, 'Categories retrieved successfully'));
            }
            catch (error) {
                next(error);
            }
        });
        /**
         * Get all available categories ordered by likeliness
         */
        this.getAllCategoriesOrderedByLikeliness = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedInput = req.body;
                const categories = yield this.expensesService.getAllCategoriesOrderedByLikeliness(validatedInput);
                res.status(200).json((0, responseFormatter_1.formatSuccess)(categories, 'Categories retrieved successfully'));
            }
            catch (error) {
                next(error);
            }
        });
        /**
         * Create a new category
         */
        this.createCategory = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.body;
                if (!name || typeof name !== 'string') {
                    throw new responseFormatter_1.AppError(expense_errors_1.ExpenseErrorDefinitions.INVALID_INPUT);
                }
                const category = yield this.expensesService.createCategory(name);
                res.status(201).json((0, responseFormatter_1.formatSuccess)(category, 'Category created successfully'));
            }
            catch (error) {
                next(error);
            }
        });
        this.expensesService = new expenses_services_1.ExpensesService();
    }
}
exports.ExpensesController = ExpensesController;
