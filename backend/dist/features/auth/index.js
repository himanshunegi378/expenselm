"use strict";
/**
 * Auth Feature - Public API
 *
 * This file strictly controls what is accessible to outside modules.
 * Internal implementation details are kept private, while only necessary
 * interfaces, types, and functionality are exported.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthErrorDefinitions = exports.authenticate = exports.authRouter = void 0;
// Export the router for registering in the main app
const auth_routes_1 = __importDefault(require("./auth.routes"));
exports.authRouter = auth_routes_1.default;
// Export middleware that might be used by other features
const auth_middleware_1 = require("./middleware/auth.middleware");
Object.defineProperty(exports, "authenticate", { enumerable: true, get: function () { return auth_middleware_1.authenticate; } });
// Export error definitions for use in the central error handler
const auth_errors_1 = require("./auth.errors");
Object.defineProperty(exports, "AuthErrorDefinitions", { enumerable: true, get: function () { return auth_errors_1.AuthErrorDefinitions; } });
/**
 * Note: The following are NOT exported and are considered internal to the auth feature:
 * - AuthService: Service implementation
 * - AuthController: Controller implementation
 * - Other internal utilities and helpers
 */
