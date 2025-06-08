import type z from "zod";
import type { categorySchema } from "../validations/category.validation";

export type Category = z.infer<typeof categorySchema>;