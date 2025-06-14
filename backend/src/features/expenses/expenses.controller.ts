import { Request, Response, NextFunction } from 'express';
import { ExpensesService } from './expenses.services';
import { ExpenseInputValidated, ExpenseUpdateInputValidated } from './expenses.type';
import { formatSuccess, formatError, AppError } from '../../core/utils/responseFormatter';
import { ExpenseErrorDefinitions } from './expense.errors';
import { categoryOrderedByLikelinesSchema } from './expenses.validation';
import { z } from 'zod';

export class ExpensesController {
    private expensesService: ExpensesService;

    constructor() {
        this.expensesService = new ExpensesService();
    }

    /**
     * Create a new expense
     */
    createExpense = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError(ExpenseErrorDefinitions.UNAUTHORIZED);
            }

            const expenseData = req.body as ExpenseInputValidated;
            const expense = await this.expensesService.createExpense(userId, expenseData);

            res.status(201).json(formatSuccess(expense, 'Expense created successfully'));
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get an expense by ID
     */
    getExpenseById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError(ExpenseErrorDefinitions.UNAUTHORIZED);
            }

            const expenseId = req.params.id;
            const expense = await this.expensesService.getExpenseById(userId, expenseId);

            if (!expense) {
                throw new AppError(ExpenseErrorDefinitions.EXPENSE_NOT_FOUND);
            }

            res.status(200).json(formatSuccess(expense, 'Expense retrieved successfully'));
        } catch (error) {
            next(error);
        }
    };

    /**
     * Update an expense
     */
    updateExpense = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError(ExpenseErrorDefinitions.UNAUTHORIZED);
            }

            const expenseId = req.params.id;
            const updateData = req.body as ExpenseUpdateInputValidated;
            const expense = await this.expensesService.updateExpense(userId, expenseId, updateData);

            res.status(200).json(formatSuccess(expense, 'Expense updated successfully'));
        } catch (error) {
            next(error);
        }
    };

    /**
     * Delete an expense
     */
    deleteExpense = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError(ExpenseErrorDefinitions.UNAUTHORIZED);
            }

            const expenseId = req.params.id;
            await this.expensesService.deleteExpense(userId, expenseId);

            res.status(200).json(formatSuccess(null, 'Expense deleted successfully'));
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get all expenses for a user with optional filters
     */
    getUserExpenses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError(ExpenseErrorDefinitions.UNAUTHORIZED);
            }

            const filters = req.query;
            const expenses = await this.expensesService.getUserExpenses(userId, filters);

            res.status(200).json(formatSuccess(expenses, 'Expenses retrieved successfully'));
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get expense summary statistics
     */
    getExpenseSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError(ExpenseErrorDefinitions.UNAUTHORIZED);
            }

            const { startDate, endDate } = req.query;
            const summary = await this.expensesService.getExpenseSummary(
                userId,
                startDate as string | undefined,
                endDate as string | undefined
            );

            res.status(200).json(formatSuccess(summary, 'Expense summary retrieved successfully'));
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get all available categories
     */
    getAllCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const categories = await this.expensesService.getAllCategories();
            res.status(200).json(formatSuccess(categories, 'Categories retrieved successfully'));
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get all available categories ordered by likeliness
     */
    getAllCategoriesOrderedByLikeliness = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const validatedInput = req.body as z.infer<typeof categoryOrderedByLikelinesSchema>;
            const categories = await this.expensesService.getAllCategoriesOrderedByLikeliness(validatedInput);
            res.status(200).json(formatSuccess(categories, 'Categories retrieved successfully'));
        } catch (error) {
            next(error);
        }
    };

    /**
     * Create a new category
     */
    createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { name } = req.body;
            if (!name || typeof name !== 'string') {
                throw new AppError(ExpenseErrorDefinitions.INVALID_INPUT);
            }

            const category = await this.expensesService.createCategory(name);
            res.status(201).json(formatSuccess(category, 'Category created successfully'));
        } catch (error) {
            next(error);
        }
    };
}
