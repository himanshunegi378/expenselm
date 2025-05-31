import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AuthService } from '../auth.service';
import { formatError } from '../../../core/utils/responseFormatter';
import { AuthErrorDefinitions } from '../auth.errors';

// Define a user type for the request object
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

// Authentication middleware
export const authenticate: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    // Check for token in authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } 
    // Also check for token in cookies
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      res.status(401).json(formatError(AuthErrorDefinitions.AUTH_NO_TOKEN));
      return;
    }

    // Verify token
    try {
      const authService = new AuthService();
      const decoded = authService.verifyToken(token);
      
      // Attach user info to request
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
      };
      
      next();
    } catch (error) {
      res.status(401).json(formatError(AuthErrorDefinitions.AUTH_INVALID_TOKEN));
    }
  } catch (error) {
    next(error);
  }
};
