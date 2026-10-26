// src/schemas/subcategory.ts
import { z } from "zod";

export const subcategorySchema = z.object({
  name: z.string().min(2, "Name is required."),
  slug: z.string().min(2, "Slug is required."),
  description: z.string().max(500, "Description cannot exceed 500 characters.").optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

export type SubcategoryFormInput = z.input<typeof subcategorySchema>;
export type SubcategoryFormValues = z.output<typeof subcategorySchema>;