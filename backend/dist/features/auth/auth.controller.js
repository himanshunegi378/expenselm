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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const responseFormatter_1 = require("../../core/utils/responseFormatter");
const auth_errors_1 = require("./auth.errors");
class AuthController {
    constructor() {
        /**
         * Register a new user
         */
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                const { user, token } = yield this.authService.register(userData);
                // Set token as HTTP-only cookie
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 24 * 60 * 60 * 1000, // 1 day
                });
                res.status(201).json((0, responseFormatter_1.formatSuccess)({ user, token }, 'User registered successfully'));
            }
            catch (error) {
                next(error);
            }
        });
        /**
         * Login a user
         */
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const loginData = req.body;
                const { user, token } = yield this.authService.login(loginData);
                // Set token as HTTP-only cookie
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 24 * 60 * 60 * 1000, // 1 day
                });
                res.status(200).json((0, responseFormatter_1.formatSuccess)({ user, token }, 'User logged in successfully'));
            }
            catch (error) {
                next(error);
            }
        });
        /**
         * Logout a user
         */
        this.logout = (req, res) => {
            // Clear the token cookie
            res.clearCookie('token');
            res.status(200).json((0, responseFormatter_1.formatSuccess)(null, 'Logged out successfully'));
        };
        /**
         * Get current user profile
         */
        this.getProfile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // User should be attached by auth middleware
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    res.status(401).json((0, responseFormatter_1.formatError)(auth_errors_1.AuthErrorDefinitions.AUTH_UNAUTHORIZED));
                    return;
                }
                const user = yield this.authService.getUserById(userId);
                if (!user) {
                    res.status(404).json((0, responseFormatter_1.formatError)(auth_errors_1.AuthErrorDefinitions.USER_NOT_FOUND, {
                        userId
                    }));
                    return;
                }
                res.status(200).json((0, responseFormatter_1.formatSuccess)(user, 'User profile retrieved successfully'));
            }
            catch (error) {
                next(error);
            }
        });
        this.authService = new auth_service_1.AuthService();
    }
}
exports.AuthController = AuthController;
