import { z } from "zod";

export const AppErrorDefinitions = {
    SERVER_ERROR: {
        code: "SERVER_ERROR",
        message: "Something went wrong",
        httpStatus: 500,
        detailsSchema: z.object({}).optional(),
    },
    DB_ERROR: {
        code: "DB_ERROR",
        message: "Database connection failed",
        httpStatus: 500,
        detailsSchema: z.object({ error: z.string() }),
    },
}