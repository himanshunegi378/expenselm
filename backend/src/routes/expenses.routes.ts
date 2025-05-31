import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { 
  validate, 
  validateParams, 
  validateQuery,
  idParamSchema,
  expenseSchema
} from '../utils/validation';

// Extend Express Request type to include validatedData
declare global {
  namespace Express {
    interface Request {
      validatedData?: any;
    }
  }
}

const router = Router();

// In-memory store for demonstration
let expenses: any[] = [];

// Helper function to send JSON response
const sendResponse = (res: Response, status: number, data: any) => {
  res.status(status).json(data);
  return Promise.resolve();
};

// Create a new expense
router.post('/', validate(expenseSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newExpense = {
      id: crypto.randomUUID(),
      ...req.validatedData,
      createdAt: new Date(),
    };
    
    expenses.push(newExpense);
    
    await sendResponse(res, 201, {
      success: true,
      data: newExpense,
    });
  } catch (error) {
    next(error);
  }
});

// Get all expenses with optional query params
router.get('/', validateQuery(
  expenseSchema.partial().extend({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  })
), async (req: Request, res: Response, next: NextFunction) => {
  try {
    let filteredExpenses = [...expenses];
    
    // Filter by query params if provided
    const { startDate, endDate, ...filters } = req.query;
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filteredExpenses = filteredExpenses.filter(
          (expense) => expense[key] === value
        );
      }
    });
    
    // Filter by date range if provided
    if (startDate || endDate) {
      filteredExpenses = filteredExpenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        const start = startDate ? new Date(startDate as string) : new Date(0);
        const end = endDate ? new Date(endDate as string) : new Date();
        return expenseDate >= start && expenseDate <= end;
      });
    }
    
    await sendResponse(res, 200, {
      success: true,
      data: filteredExpenses,
    });
  } catch (error) {
    next(error);
  }
});

// Get a single expense by ID
router.get('/:id', validateParams(idParamSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const expense = expenses.find((e) => e.id === req.params.id);
    
    if (!expense) {
      await sendResponse(res, 404, {
        success: false,
        error: 'Expense not found',
      });
      return;
    }
    
    await sendResponse(res, 200, {
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
});

// Update an expense
router.put('/:id', [
  validateParams(idParamSchema),
  validate(expenseSchema.partial()),
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const index = expenses.findIndex((e) => e.id === req.params.id);
    
    if (index === -1) {
      await sendResponse(res, 404, {
        success: false,
        error: 'Expense not found',
      });
      return;
    }
    
    const updatedExpense = {
      ...expenses[index],
      ...req.validatedData,
      updatedAt: new Date(),
    };
    
    expenses[index] = updatedExpense;
    
    await sendResponse(res, 200, {
      success: true,
      data: updatedExpense,
    });
  } catch (error) {
    next(error);
  }
});

// Delete an expense
router.delete('/:id', validateParams(idParamSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const index = expenses.findIndex((e) => e.id === req.params.id);
    
    if (index === -1) {
      await sendResponse(res, 404, {
        success: false,
        error: 'Expense not found',
      });
      return;
    }
    
    const [deletedExpense] = expenses.splice(index, 1);
    
    await sendResponse(res, 200, {
      success: true,
      data: deletedExpense,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
