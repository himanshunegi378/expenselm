import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { AuthController } from './auth.controller';
import { registerSchema, loginSchema } from './auth.validation';
import { validate } from '../../utils/validation';
import { authenticate } from './middleware/auth.middleware';

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
const authController = new AuthController();

// Auth routes with proper binding
router.post('/register', 
  validate(registerSchema),
  asyncHandler(authController.register)
);

router.post('/login', 
  validate(loginSchema),
  asyncHandler(authController.login)
);

router.post('/logout', 
  (req, res, next) => authController.logout(req, res)
);

router.get('/profile', 
  authenticate,
  asyncHandler(authController.getProfile)
);

export default router;
