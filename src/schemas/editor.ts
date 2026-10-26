// src/schemas/editor.ts
import { z } from "zod";

export const editorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(100, "Name is too long."),
  email: z.string().email("Please enter a valid email address."),
  experience: z.string().max(100, "Role/Title is too long.").optional(),
  bio: z.string().max(500, "Biography cannot exceed 500 characters.").optional(),
  imageUrl: z.string().optional(),
  
  // Social Links
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  instagram: z.string().optional(),
  github: z.string().optional(),
  
  categoryIds: z.array(z.string()).default([]),
});

export type EditorFormInput = z.input<typeof editorSchema>;
export type EditorFormValues = z.output<typeof editorSchema>;