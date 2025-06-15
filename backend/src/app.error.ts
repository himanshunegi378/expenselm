import { z } from "zod";

export const AppErrorDefinitions = {
    SERVER_ERROR: {
        code: "SERVER_ERROR",
        message: "Something went wrong",
        httpStatus: 500,
        detailsSchema: z.object({}).optional(),
    }
}