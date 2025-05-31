import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { prisma } from '../../core/db/prisma';

// Import prismaTest directly to avoid require() issues

// Always use prismaTest during Jest tests to ensure consistent database access
const db = prisma;

// Define User type to match Prisma schema
type User = {
  id: string;
  email: string;
  name: string | null;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};
import { RegisterInput, LoginInput } from './auth.validation';
import { AuthErrorDefinitions } from './auth.errors';
import { AppError } from '../../core/utils/responseFormatter';

export class AuthService {
  /**
   * Register a new user
   */
  async register(userData: RegisterInput): Promise<{ user: Omit<User, 'password'>, token: string }> {
    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      const error = new AppError(AuthErrorDefinitions.USER_ALREADY_EXISTS);
      throw error;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Create the user
    const user = await db.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
      },
    });

    // Generate JWT token
    const token = this.generateToken(user);

    // Return user without password and token
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  /**
   * Login a user
   */
  async login(loginData: LoginInput): Promise<{ user: Omit<User, 'password'>, token: string }> {
    // Find the user
    const user = await db.user.findUnique({
      where: { email: loginData.email },
    });

    if (!user) {
      const error = new AppError(AuthErrorDefinitions.USER_NOT_FOUND);
      throw error;
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) {
      const error = new AppError(AuthErrorDefinitions.INVALID_CREDENTIALS);
      throw error;
    }

    // Generate JWT
    const token = this.generateToken(user);

    // Return user without password and token
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  /**
   * Generate JWT token
   */
  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    // Get secret from environment or use fallback
    const secret = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';

    // Define options with proper type
    const options: SignOptions = {};

    // Explicitly set expiresIn with correct type handling
    options.expiresIn = (process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']) || '1D';

    return jwt.sign(payload, secret, options);
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<Omit<User, 'password'> | null> {
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): { userId: string, email: string } {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'fallback_secret_for_dev_only'
      ) as jwt.JwtPayload;

      return {
        userId: decoded.sub as string,
        email: decoded.email as string
      };
    } catch (error) {
      const tokenError = new AppError(AuthErrorDefinitions.AUTH_INVALID_TOKEN);
      throw tokenError;
    }
  }
}
