// src/lib/validations/category.ts
import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name cannot exceed 100 characters."),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters.")
    .max(100, "Slug cannot exceed 100 characters.")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters.")
    .optional(),
  languageId: z
    .string()
    .min(1, "Please select a language."),
  isActive: z
    .boolean()
    .default(true),
  sortOrder: z
    .number()
    .int()
    .default(0),
  coverImage: z
    .string()
    .optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;