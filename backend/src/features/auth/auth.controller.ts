import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { RegisterInput, LoginInput } from './auth.validation';
import { formatSuccess, formatError } from '../../core/utils/responseFormatter';
import { AuthErrorDefinitions } from './auth.errors';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Register a new user
   */
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData = req.body as RegisterInput;
      const { user, token } = await this.authService.register(userData);

      // Set token as HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      res.status(201).json(formatSuccess({ user, token }, 'User registered successfully'));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Login a user
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const loginData = req.body as LoginInput;
      const { user, token } = await this.authService.login(loginData);

      // Set token as HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      res.status(200).json(formatSuccess({ user, token }, 'User logged in successfully'));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Logout a user
   */
  logout = (req: Request, res: Response): void => {
    // Clear the token cookie
    res.clearCookie('token');

    res.status(200).json(formatSuccess(null, 'Logged out successfully'));
  };

  /**
   * Get current user profile
   */
  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // User should be attached by auth middleware
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json(formatError(AuthErrorDefinitions.AUTH_UNAUTHORIZED));
        return;
      }

      const user = await this.authService.getUserById(userId);

      if (!user) {
        res.status(404).json(formatError(AuthErrorDefinitions.USER_NOT_FOUND,{
          userId 
        }));
        return;
      }

      res.status(200).json(formatSuccess(user, 'User profile retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };
}
