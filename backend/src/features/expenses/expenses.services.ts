import { Decimal } from '@prisma/client/runtime/library';
import { prisma } from '../../core/db/prisma';
import { AppError } from '../../core/utils/responseFormatter';
import { z } from 'zod';
import { ErrorDefinition } from '../../@types/error.types';
import { ExpenseErrorDefinitions } from './expense.errors';
import { ExpenseInputValidated, ExpenseUpdateInputValidated, ExpenseFilters } from './expenses.type';
import { expenseInputSchema, expenseUpdateSchema } from './expenses.validation';
import { likelyCategory } from '../ai/likelyCategory';

const db = prisma;

// Define types to match Prisma schema

export class ExpensesService {
    /**
     * Create a new expense
     */
    async createExpense(userId: string, expenseData: ExpenseInputValidated) {
        // Validate input using Zod
        const parsed = expenseInputSchema.safeParse(expenseData);
        if (!parsed.success) {
            throw new AppError(ExpenseErrorDefinitions.INVALID_INPUT, parsed.error.flatten());
        }
        // Validate user exists
        const user = await db.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new AppError(ExpenseErrorDefinitions.USER_NOT_FOUND);
        }

        // Validate category exists
        const category = await db.category.findUnique({
            where: { id: expenseData.categoryId }
        });

        if (!category) {
            throw new AppError(ExpenseErrorDefinitions.CATEGORY_NOT_FOUND);
        }

        // Handle amount conversion
        let amount: Decimal;
        if (typeof expenseData.amount === 'string') {
            amount = new Decimal(expenseData.amount);
        } else {
            amount = new Decimal(expenseData.amount.toString());
        }

        // Handle date conversion
        let date: Date;
        if (typeof expenseData.date === 'string') {
            date = new Date(expenseData.date);
        } else {
            date = expenseData.date;
        }

        // Create the expense
        const expense = await db.expense.create({
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
    }

    /**
     * Get expense by ID
     * Ensures that the expense belongs to the user
     */
    async getExpenseById(userId: string, expenseId: string) {
        const expense = await db.expense.findUnique({
            where: { id: expenseId },
            include: {
                category: true
            }
        });

        if (!expense) {
            throw new AppError(ExpenseErrorDefinitions.EXPENSE_NOT_FOUND);
        }

        // Check if expense belongs to user
        if (expense.userId !== userId) {
            throw new AppError(ExpenseErrorDefinitions.UNAUTHORIZED);
        }

        return expense;
    }

    /**
     * Update an existing expense
     * Ensures that the expense belongs to the user
     */
    async updateExpense(userId: string, expenseId: string, updateData: ExpenseUpdateInputValidated) {
        // Validate input using Zod
        const parsed = expenseUpdateSchema.safeParse(updateData);
        if (!parsed.success) {
            throw new AppError(ExpenseErrorDefinitions.INVALID_INPUT, parsed.error.flatten());
        }
        // Verify expense exists and belongs to user
        const existingExpense = await db.expense.findUnique({
            where: { id: expenseId }
        });

        if (!existingExpense) {
            throw new AppError(ExpenseErrorDefinitions.EXPENSE_NOT_FOUND);
        }

        if (existingExpense.userId !== userId) {
            throw new AppError(ExpenseErrorDefinitions.UNAUTHORIZED);
        }

        // If updating category, verify category exists
        if (updateData.categoryId) {
            const category = await db.category.findUnique({
                where: { id: updateData.categoryId }
            });

            if (!category) {
                throw new AppError(ExpenseErrorDefinitions.CATEGORY_NOT_FOUND);
            }
        }

        // Handle amount conversion if provided
        let amount: Decimal | undefined;
        if (updateData.amount !== undefined) {
            if (typeof updateData.amount === 'string') {
                amount = new Decimal(updateData.amount);
            } else {
                amount = new Decimal(updateData.amount.toString());
            }
        }

        // Handle date conversion if provided
        let date: Date | undefined;
        if (updateData.date !== undefined) {
            if (typeof updateData.date === 'string') {
                date = new Date(updateData.date);
            } else {
                date = updateData.date;
            }
        }

        // Update the expense
        const updatedExpense = await db.expense.update({
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
    }

    /**
     * Delete an expense
     * Ensures that the expense belongs to the user
     */
    async deleteExpense(userId: string, expenseId: string) {
        // Verify expense exists and belongs to user
        const existingExpense = await db.expense.findUnique({
            where: { id: expenseId }
        });

        if (!existingExpense) {
            throw new AppError(ExpenseErrorDefinitions.EXPENSE_NOT_FOUND);
        }

        if (existingExpense.userId !== userId) {
            throw new AppError(ExpenseErrorDefinitions.UNAUTHORIZED);
        }

        // Delete the expense
        await db.expense.delete({
            where: { id: expenseId }
        });

        return { success: true };
    }

    /**
     * Get all expenses for a user with optional filters
     */
    async getUserExpenses(userId: string, filters?: ExpenseFilters) {
        // Build filter conditions
        const where: any = {
            userId
        };

        // Apply date range filter
        if (filters?.startDate || filters?.endDate) {
            where.date = {};

            if (filters.startDate) {
                where.date.gte = new Date(filters.startDate);
            }

            if (filters.endDate) {
                where.date.lte = new Date(filters.endDate);
            }
        }

        // Apply category filter
        if (filters?.categoryId) {
            where.categoryId = filters.categoryId;
        }

        // Apply amount range filter
        if (filters?.minAmount !== undefined || filters?.maxAmount !== undefined) {
            where.amount = {};

            if (filters.minAmount !== undefined) {
                where.amount.gte = new Decimal(filters.minAmount);
            }

            if (filters.maxAmount !== undefined) {
                where.amount.lte = new Decimal(filters.maxAmount);
            }
        }

        // Get expenses with filters
        const expenses = await db.expense.findMany({
            where,
            include: {
                category: true
            },
            orderBy: {
                date: 'desc'
            }
        });

        return expenses;
    }

    /**
     * Get expense summary statistics for a user
     * Returns total amount, category breakdown, etc.
     */
    async getExpenseSummary(userId: string, startDate?: Date | string, endDate?: Date | string) {
        // Build date filter
        const dateFilter: any = {};

        if (startDate) {
            dateFilter.gte = new Date(startDate);
        }

        if (endDate) {
            dateFilter.lte = new Date(endDate);
        }

        // Get total expenses
        const totalExpenses = await db.expense.aggregate({
            where: {
                userId,
                ...(Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {})
            },
            _sum: {
                amount: true
            }
        });

        // Get expenses by category
        const expensesByCategory = await db.expense.groupBy({
            by: ['categoryId'],
            where: {
                userId,
                ...(Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {})
            },
            _sum: {
                amount: true
            }
        });

        // Get category details
        const categories = await db.category.findMany({
            where: {
                id: {
                    in: expensesByCategory.map(category => category.categoryId)
                }
            }
        });

        // Map category names to summary
        const categorySummary = expensesByCategory.map(expense => ({
            categoryId: expense.categoryId,
            categoryName: categories.find(c => c.id === expense.categoryId)?.name || 'Unknown',
            totalAmount: expense._sum.amount
        }));

        // Return summary stats
        return {
            totalAmount: totalExpenses._sum.amount || new Decimal(0),
            categorySummary
        };
    }

    /**
     * Get all available categories
     */
    async getAllCategories() {
        return await db.category.findMany({
            orderBy: {
                name: 'asc'
            }
        });
    }

    async getAllCategoriesOrderedByLikeliness({
        description,
        notes,
    }:{
        description?: string;
        notes?: string | null;
    }) {
      const allCategories = await this.getAllCategories();
      const likelyCategories = await likelyCategory({
        description,
        notes,
        categories: allCategories
      });
      
    //   merge likelyCategories with getAllCategories with likelyCategory at top
    //  remove duplicates without deleting any category from  likelyCategories
    const mergedCategories = [...likelyCategories, ...allCategories];
    const uniqueCategories = mergedCategories.filter((category, index) => mergedCategories.findIndex(c => c.id === category.id) === index);  

      return uniqueCategories;
    }

    /**
     * Create a new category
     */
    async createCategory(name: string) {
        // Check if category already exists
        const existingCategory = await db.category.findUnique({
            where: { name }
        });

        if (existingCategory) {
            return existingCategory;
        }

        // Create new category
        return await db.category.create({
            data: { name }
        });
    }
}