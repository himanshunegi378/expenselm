import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Import routes
import authRoutes from './features/auth/auth.routes';
import expenseRoutes from './features/expenses/expenses.routes';

// Import middleware
import { AuthErrorDefinitions } from './features/auth';
import { AppError, formatError, formatSuccess } from './core/utils/responseFormatter';
import { AppErrorDefinitions } from './app.error';
import { prisma } from './core/db/prisma';
import { ErrorDefinition } from './@types/error.types';

const app = express();

// Middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'https://expenselm.timercards.com', 'https://www.expenselm.expenselm.timercards.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev')); // dev logging

// API Routes
app.get('/api', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to ExpenseLM API',
    version: '1.0.0'
  });
});

// Mount feature routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

app.get('/api/dbCheck', async (req: Request, res: Response) => {
  try {
    // ping db using prisma because supabase hibernate if no activity for a week
    await prisma.$queryRaw`SELECT 1`;
    res.json(formatSuccess(null, 'Database connection successful'));
  } catch (error) {
    console.error('Database connection failed:', error);
    throw new AppError(AppErrorDefinitions.DB_ERROR, {
      error: error instanceof Error ? error.message : 'Unknown error while connecting to database'
    });
  }
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Not Found' });
});

// Custom error handler function with correct typing
const handleErrors = (err: AppError<ErrorDefinition> | Error, req: Request, res: Response, next: NextFunction): void => {
  // Log the error
  console.error(err);
  if (!(err instanceof AppError)) {
    const error = new AppError(AppErrorDefinitions.SERVER_ERROR);
    res.status(error.errorDef.httpStatus).json(error.format());
    return;
  }

  res.status(err.errorDef.httpStatus).json(err.format());
};

// Apply error handler middleware
app.use(handleErrors);

export default app;
