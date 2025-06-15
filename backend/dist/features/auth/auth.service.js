"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../../core/db/prisma");
// Import prismaTest directly to avoid require() issues
// Always use prismaTest during Jest tests to ensure consistent database access
const db = prisma_1.prisma;
const auth_errors_1 = require("./auth.errors");
const responseFormatter_1 = require("../../core/utils/responseFormatter");
class AuthService {
    /**
     * Register a new user
     */
    register(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if user already exists
            const existingUser = yield db.user.findUnique({
                where: { email: userData.email },
            });
            if (existingUser) {
                const error = new responseFormatter_1.AppError(auth_errors_1.AuthErrorDefinitions.USER_ALREADY_EXISTS);
                throw error;
            }
            // Hash the password
            const salt = yield bcrypt_1.default.genSalt(10);
            const hashedPassword = yield bcrypt_1.default.hash(userData.password, salt);
            // Create the user
            const user = yield db.user.create({
                data: {
                    name: userData.name,
                    email: userData.email,
                    password: hashedPassword,
                },
            });
            // Generate JWT token
            const token = this.generateToken(user);
            // Return user without password and token
            const { password } = user, userWithoutPassword = __rest(user, ["password"]);
            return { user: userWithoutPassword, token };
        });
    }
    /**
     * Login a user
     */
    login(loginData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find the user
            const user = yield db.user.findUnique({
                where: { email: loginData.email },
            });
            if (!user) {
                const error = new responseFormatter_1.AppError(auth_errors_1.AuthErrorDefinitions.USER_NOT_FOUND);
                throw error;
            }
            // Check password
            const isPasswordValid = yield bcrypt_1.default.compare(loginData.password, user.password);
            if (!isPasswordValid) {
                const error = new responseFormatter_1.AppError(auth_errors_1.AuthErrorDefinitions.INVALID_CREDENTIALS);
                throw error;
            }
            // Generate JWT
            const token = this.generateToken(user);
            // Return user without password and token
            const { password } = user, userWithoutPassword = __rest(user, ["password"]);
            return { user: userWithoutPassword, token };
        });
    }
    /**
     * Generate JWT token
     */
    generateToken(user) {
        const payload = {
            sub: user.id,
            email: user.email,
        };
        // Get secret from environment or use fallback
        const secret = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';
        // Define options with proper type
        const options = {};
        // Explicitly set expiresIn with correct type handling
        options.expiresIn = process.env.JWT_EXPIRES_IN || '1D';
        return jsonwebtoken_1.default.sign(payload, secret, options);
    }
    /**
     * Get user by ID
     */
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                return null;
            }
            const { password } = user, userWithoutPassword = __rest(user, ["password"]);
            return userWithoutPassword;
        });
    }
    /**
     * Verify JWT token
     */
    verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'fallback_secret_for_dev_only');
            return {
                userId: decoded.sub,
                email: decoded.email
            };
        }
        catch (error) {
            const tokenError = new responseFormatter_1.AppError(auth_errors_1.AuthErrorDefinitions.AUTH_INVALID_TOKEN);
            throw tokenError;
        }
    }
}
exports.AuthService = AuthService;
