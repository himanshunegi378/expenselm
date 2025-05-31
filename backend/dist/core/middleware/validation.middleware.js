"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParams = exports.validateQuery = exports.validate = void 0;
const responseFormatter_1 = require("../utils/responseFormatter");
const validation_errors_1 = require("./validation.errors");
/**
 * Middleware to validate request data against a Zod schema
 */
const validate = (schema) => (req, res, next) => {
    try {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json((0, responseFormatter_1.formatError)(validation_errors_1.ValidationErrorDefinitions.VALIDATION_ERROR, result.error.format()));
        }
        // Add validated data to request object
        req.validatedData = result.data;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.validate = validate;
/**
 * Middleware to validate query parameters against a Zod schema
 */
const validateQuery = (schema) => (req, res, next) => {
    try {
        const result = schema.safeParse(req.query);
        if (!result.success) {
            return res.status(400).json((0, responseFormatter_1.formatError)(validation_errors_1.ValidationErrorDefinitions.QUERY_VALIDATION_ERROR, result.error.format()));
        }
        // Replace query with validated data
        req.query = result.data;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.validateQuery = validateQuery;
/**
 * Middleware to validate URL parameters against a Zod schema
 */
const validateParams = (schema) => (req, res, next) => {
    try {
        const result = schema.safeParse(req.params);
        if (!result.success) {
            return res.status(400).json((0, responseFormatter_1.formatError)(validation_errors_1.ValidationErrorDefinitions.PARAM_VALIDATION_ERROR, result.error.format()));
        }
        // Replace params with validated data
        req.params = result.data;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.validateParams = validateParams;
