"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const auth_service_1 = require("../auth.service");
const responseFormatter_1 = require("../../../core/utils/responseFormatter");
const auth_errors_1 = require("../auth.errors");
// Authentication middleware
const authenticate = (req, res, next) => {
    try {
        let token;
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
            res.status(401).json((0, responseFormatter_1.formatError)(auth_errors_1.AuthErrorDefinitions.AUTH_NO_TOKEN));
            return;
        }
        // Verify token
        try {
            const authService = new auth_service_1.AuthService();
            const decoded = authService.verifyToken(token);
            // Attach user info to request
            req.user = {
                userId: decoded.userId,
                email: decoded.email,
            };
            next();
        }
        catch (error) {
            res.status(401).json((0, responseFormatter_1.formatError)(auth_errors_1.AuthErrorDefinitions.AUTH_INVALID_TOKEN));
        }
    }
    catch (error) {
        next(error);
    }
};
exports.authenticate = authenticate;
