import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Import routes
import authRoutes from './features/auth/auth.routes';
import expenseRoutes from './features/expenses/expenses.routes';

// Import middleware
import { AuthErrorDefinitions } from './features/auth';
import { AppError, formatError } from './core/utils/responseFormatter';
import { AppErrorDefinitions } from './app.error';

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
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

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Not Found' });
});

// Custom error handler function with correct typing
const handleErrors = (err: AppError | Error, req: Request, res: Response, next: NextFunction): void => {
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
