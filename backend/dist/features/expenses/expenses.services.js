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
exports.ExpensesService = void 0;
const library_1 = require("@prisma/client/runtime/library");
const prisma_1 = require("../../core/db/prisma");
const responseFormatter_1 = require("../../core/utils/responseFormatter");
const expense_errors_1 = require("./expense.errors");
const expenses_validation_1 = require("./expenses.validation");
const likelyCategory_1 = require("../ai/likelyCategory");
const db = prisma_1.prisma;
// Define types to match Prisma schema
class ExpensesService {
    /**
     * Create a new expense
     */
    createExpense(userId, expenseData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate input using Zod
            const parsed = expenses_validation_1.expenseInputSchema.safeParse(expenseData);
            if (!parsed.success) {
                throw new responseFormatter_1.AppError(expense_errors_1.ExpenseErrorDefinitions.INVALID_INPUT, parsed.error.flatten());
            }
            // Validate user exists
            const user = yield db.user.findUnique({
                where: { id: userId }
            });
            if (!user) {
                throw new responseFormatter_1.AppError(expense_errors_1.ExpenseErrorDefinitions.USER_NOT_FOUND);
            }
            // Validate category exists
            const category = yield db.category.findUnique({
                where: { id: expenseData.categoryId }
            });
            if (!category) {
                throw new responseFormatter_1.AppError(expense_errors_1.ExpenseErrorDefinitions.CATEGORY_NOT_FOUND);
            }
            // Handle amount conversion
            let amount;
            if (typeof expenseData.amount === 'string') {
                amount = new library_1.Decimal(expenseData.amount);
            }
            else {
                amount = new library_1.Decimal(expenseData.amount.toString());
            }
            // Handle date conversion
            let date;
            if (typeof expenseData.date === 'string') {
                date = new Date(expenseData.date);
            }
            else {
                date = expenseData.date;
            }
            // Create the expense
            const expense = yield db.expense.create({
                data: {
                    amount,
                    description: expenseData.description,
                    date,
                    userId,
                    categoryId: expenseData.categoryId
                },
                include: {
                    category: true
                }
            });
            return expense;
        });
    }
    /**
     * Get expense by ID
     * Ensures that the expense belongs to the user
     */
    getExpenseById(userId, expenseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const expense = yield db.expense.findUnique({
                where: { id: expenseId },
                include: {
                    category: true
                }
            });
            if (!expense) {
                throw new responseFormatter_1.AppError(expense_errors_1.ExpenseErrorDefinitions.EXPENSE_NOT_FOUND);
            }
            // Check if expense belongs to user
            if (expense.userId !== userId) {
                throw new responseFormatter_1.AppError(expense_errors_1.ExpenseErrorDefinitions.UNAUTHORIZED);
            }
            return expense;
        });
    }
    /**
     * Update an existing expense
     * Ensures that the expense belongs to the user
     */
    updateExpense(userId, expenseId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate input using Zod
            const parsed = expenses_validation_1.expenseUpdateSchema.safeParse(updateData);
            if (!parsed.success) {
                throw new responseFormatter_1.AppError(expense_errors_1.ExpenseErrorDefinitions.INVALID_INPUT, parsed.error.flatten());
            }
            // Verify expense exists and belongs to user
            const existingExpense = yield db.expense.findUnique({
                where: { id: expenseId }
            });
            if (!existingExpense) {
                throw new responseFormatter_1.AppError(expense_errors_1.ExpenseErrorDefinitions.EXPENSE_NOT_FOUND);
            }
            if (existingExpense.userId !== userId) {
                throw new responseFormatter_1.AppError(expense_errors_1.ExpenseErrorDefinitions.UNAUTHORIZED);
            }
            // If updating category, verify category exists
            if (updateData.categoryId) {
                const category = yield db.category.findUnique({
                    where: { id: updateData.categoryId }
                });
                if (!category) {
                    throw new responseFormatter_1.AppError(expense_errors_1.ExpenseErrorDefinitions.CATEGORY_NOT_FOUND);
                }
            }
            // Handle amount conversion if provided
            let amount;
            if (updateData.amount !== undefined) {
                if (typeof updateData.amount === 'string') {
                    amount = new library_1.Decimal(updateData.amount);
                }
                else {
                    amount = new library_1.Decimal(updateData.amount.toString());
                }
            }
            // Handle date conversion if provided
            let date;
            if (updateData.date !== undefined) {
                if (typeof updateData.date === 'string') {
                    date = new Date(updateData.date);
                }
                else {
                    date = updateData.date;
                }
            }
            // Update the expense
            const updatedExpense = yield db.expense.update({
                where: { id: expenseId },
                data: {
                    amount: amount,
                    description: updateData.description,
                    notes: updateData.notes, // Include notes in the update
                    date: date,
                    categoryId: updateData.categoryId
                },
                include: {
                    category: true
                }
            });
            return updatedExpense;
        });
    }
    /**
     * Delete an expense
     * Ensures that the expense belongs to the user
     */
    deleteExpense(userId, expenseId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verify expense exists and belongs to user
            const existingExpense = yield db.expense.findUnique({
                where: { id: expenseId }
            });
            if (!existingExpense) {
                throw new responseFormatter_1.AppError(expense_errors_1.ExpenseErrorDefinitions.EXPENSE_NOT_FOUND);
            }
            if (existingExpense.userId !== userId) {
                throw new responseFormatter_1.AppError(expense_errors_1.ExpenseErrorDefinitions.UNAUTHORIZED);
            }
            // Delete the expense
            yield db.expense.delete({
                where: { id: expenseId }
            });
            return { success: true };
        });
    }
    /**
     * Get all expenses for a user with optional filters
     */
    getUserExpenses(userId, filters) {
        return __awaiter(this, void 0, void 0, function* () {
            // Build filter conditions
            const where = {
                userId
            };
            // Apply date range filter
            if ((filters === null || filters === void 0 ? void 0 : filters.startDate) || (filters === null || filters === void 0 ? void 0 : filters.endDate)) {
                where.date = {};
                if (filters.startDate) {
                    where.date.gte = new Date(filters.startDate);
                }
                if (filters.endDate) {
                    where.date.lte = new Date(filters.endDate);
                }
            }
            // Apply category filter
            if (filters === null || filters === void 0 ? void 0 : filters.categoryId) {
                where.categoryId = filters.categoryId;
            }
            // Apply amount range filter
            if ((filters === null || filters === void 0 ? void 0 : filters.minAmount) !== undefined || (filters === null || filters === void 0 ? void 0 : filters.maxAmount) !== undefined) {
                where.amount = {};
                if (filters.minAmount !== undefined) {
                    where.amount.gte = new library_1.Decimal(filters.minAmount);
                }
                if (filters.maxAmount !== undefined) {
                    where.amount.lte = new library_1.Decimal(filters.maxAmount);
                }
            }
            // Get expenses with filters
            const expenses = yield db.expense.findMany({
                where,
                include: {
                    category: true
                },
                orderBy: {
                    date: 'desc'
                }
            });
            return expenses;
        });
    }
    /**
     * Get expense summary statistics for a user
     * Returns total amount, category breakdown, etc.
     */
    getExpenseSummary(userId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            // Build date filter
            const dateFilter = {};
            if (startDate) {
                dateFilter.gte = new Date(startDate);
            }
            if (endDate) {
                dateFilter.lte = new Date(endDate);
            }
            // Get total expenses
            const totalExpenses = yield db.expense.aggregate({
                where: Object.assign({ userId }, (Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {})),
                _sum: {
                    amount: true
                }
            });
            // Get expenses by category
            const expensesByCategory = yield db.expense.groupBy({
                by: ['categoryId'],
                where: Object.assign({ userId }, (Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {})),
                _sum: {
                    amount: true
                }
            });
            // Get category details
            const categories = yield db.category.findMany({
                where: {
                    id: {
                        in: expensesByCategory.map(category => category.categoryId)
                    }
                }
            });
            // Map category names to summary
            const categorySummary = expensesByCategory.map(expense => {
                var _a;
                return ({
                    categoryId: expense.categoryId,
                    categoryName: ((_a = categories.find(c => c.id === expense.categoryId)) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown',
                    totalAmount: expense._sum.amount
                });
            });
            // Return summary stats
            return {
                totalAmount: totalExpenses._sum.amount || new library_1.Decimal(0),
                categorySummary
            };
        });
    }
    /**
     * Get all available categories
     */
    getAllCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db.category.findMany({
                orderBy: {
                    name: 'asc'
                }
            });
        });
    }
    getAllCategoriesOrderedByLikeliness(_a) {
        return __awaiter(this, arguments, void 0, function* ({ description, notes, }) {
            const allCategories = yield this.getAllCategories();
            const likelyCategories = yield (0, likelyCategory_1.likelyCategory)({
                description,
                notes,
                categories: allCategories
            });
            //   merge likelyCategories with getAllCategories with likelyCategory at top
            //  remove duplicates without deleting any category from  likelyCategories
            const mergedCategories = [...likelyCategories, ...allCategories];
            const uniqueCategories = mergedCategories.filter((category, index) => mergedCategories.findIndex(c => c.id === category.id) === index);
            return uniqueCategories;
        });
    }
    /**
     * Create a new category
     */
    createCategory(name) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if category already exists
            const existingCategory = yield db.category.findUnique({
                where: { name }
            });
            if (existingCategory) {
                return existingCategory;
            }
            // Create new category
            return yield db.category.create({
                data: { name }
            });
        });
    }
}
exports.ExpensesService = ExpensesService;
