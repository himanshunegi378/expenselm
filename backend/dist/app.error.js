"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppErrorDefinitions = void 0;
const zod_1 = require("zod");
exports.AppErrorDefinitions = {
    SERVER_ERROR: {
        code: "SERVER_ERROR",
        message: "Something went wrong",
        httpStatus: 500,
        detailsSchema: zod_1.z.object({}).optional(),
    },
    DB_ERROR: {
        code: "DB_ERROR",
        message: "Database connection failed",
        httpStatus: 500,
        detailsSchema: zod_1.z.object({ error: zod_1.z.string() }),
    },
};
