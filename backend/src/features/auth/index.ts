/**
 * Auth Feature - Public API
 * 
 * This file strictly controls what is accessible to outside modules.
 * Internal implementation details are kept private, while only necessary
 * interfaces, types, and functionality are exported.
 */

// Export the router for registering in the main app
import authRouter from './auth.routes';

// Export middleware that might be used by other features
import { authenticate } from './middleware/auth.middleware';

// Export error definitions for use in the central error handler
import { AuthErrorDefinitions, AuthErrorCode } from './auth.errors';

// Re-export specific validation schemas if needed by other modules
import { RegisterInput, LoginInput } from './auth.validation';

// Export authentication types if needed by other modules
export type { RegisterInput, LoginInput, AuthErrorCode };

// Export the main components
export {
  authRouter,
  authenticate,
  AuthErrorDefinitions
};

/**
 * Note: The following are NOT exported and are considered internal to the auth feature:
 * - AuthService: Service implementation
 * - AuthController: Controller implementation
 * - Other internal utilities and helpers
 */
