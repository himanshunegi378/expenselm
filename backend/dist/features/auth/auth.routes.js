"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const validation_1 = require("../../utils/validation");
const auth_middleware_1 = require("./middleware/auth.middleware");
const asyncHandler = (fn) => (req, res, next) => {
    try {
        const result = fn(req, res, next);
        if (result instanceof Promise) {
            result.catch(next);
        }
    }
    catch (error) {
        next(error);
    }
};
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
// Auth routes with proper binding
router.post('/register', (0, validation_1.validate)(auth_validation_1.registerSchema), asyncHandler(authController.register));
router.post('/login', (0, validation_1.validate)(auth_validation_1.loginSchema), asyncHandler(authController.login));
router.post('/logout', (req, res, next) => authController.logout(req, res));
router.get('/profile', auth_middleware_1.authenticate, asyncHandler(authController.getProfile));
exports.default = router;
