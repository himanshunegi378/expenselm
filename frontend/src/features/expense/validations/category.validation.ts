import { z } from "zod";

export const categorySchema = z.object({
    id: z.string(),
    name: z.string().min(3, "Name must be at least 3 characters long").max(100, "Name must be at most 100 characters long"),
});

export type CategoryInputValidated = z.infer<typeof categorySchema>;