import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { ExpensesController } from './expenses.controller';
import { categoryOrderedByLikelinesSchema, expenseInputSchema, expenseUpdateSchema } from './expenses.validation';
import { validate } from '../../utils/validation';
import { authenticate } from '../auth/middleware/auth.middleware';

type AsyncRequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void> | void;

const asyncHandler = (fn: AsyncRequestHandler): RequestHandler =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = fn(req, res, next);
            if (result instanceof Promise) {
                result.catch(next);
            }
        } catch (error) {
            next(error);
        }
    };

const router = Router();
const expensesController = new ExpensesController();

// All routes require authentication
router.use(authenticate);

// Expense routes
router.post('/',
    validate(expenseInputSchema),
    asyncHandler(expensesController.createExpense)
);

router.get('/',
    asyncHandler(expensesController.getUserExpenses)
);

router.get('/summary',
    asyncHandler(expensesController.getExpenseSummary)
);

router.get('/:id',
    asyncHandler(expensesController.getExpenseById)
);

router.put('/:id',
    validate(expenseUpdateSchema),
    asyncHandler(expensesController.updateExpense)
);

router.delete('/:id',
    asyncHandler(expensesController.deleteExpense)
);

// Category routes
router.get('/categories/all',
    asyncHandler(expensesController.getAllCategories)
);

router.post('/categories/orderedByLikeliness',
    validate(categoryOrderedByLikelinesSchema),
    asyncHandler(expensesController.getAllCategoriesOrderedByLikeliness)
);

router.post('/categories',
    asyncHandler(expensesController.createCategory)
);

export default router;
