// src/schemas/article.ts
import { z } from "zod";

// ============================================================
// EDITOR.JS CONTENT SCHEMA
// ============================================================

export const editorBlockSchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  // FIXED: z.record now requires both Key and Value types in Zod v4
  data: z.record(z.string(), z.any()), 
});

export const articleContentSchema = z.object({
  time: z.number().optional(),
  blocks: z.array(editorBlockSchema),
  version: z.string().optional(),
});

export const tableOfContentsSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  level: z.number().optional(),
});

// ============================================================
// MAIN ARTICLE SCHEMA
// ============================================================

export const articleSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters.").max(200, "Title is too long."),
  slug: z.string().min(3, "Slug is required."),
  
  // Relations
  languageId: z.string().min(1, "Language is required."),
  categoryId: z.string().min(1, "Category is required."),
  subcategoryId: z.string().min(1, "Subcategory is required."),
  
  // Guest Author (Optional)
  writtenBy: z.string().optional(),
  writerImageUrl: z.string().optional(),

  // Media
  bannerImage: z.string().url("Banner image must be a valid URL."),
  bannerImageAlt: z.string().optional(),
  ogImage: z.string().url("OG image must be a valid URL."),

  // Content
  content: articleContentSchema,
  tableOfContents: z.array(tableOfContentsSchema).optional(),

  // Metadata
  type: z.enum([
    "ARTICLE", "NEWS", "OPINION", "ANALYSIS", "GUIDE", "REVIEW", "INTERVIEW"
  ]).default("ARTICLE"),
  status: z.enum([
    "DRAFT", "IN_REVIEW", "SCHEDULED", "PUBLISHED", "ARCHIVED"
  ]).default("DRAFT"),
  featured: z.boolean().default(false),
  scheduledAt: z.string().optional().nullable(),
});

export type ArticleFormValues = z.infer<typeof articleSchema>;