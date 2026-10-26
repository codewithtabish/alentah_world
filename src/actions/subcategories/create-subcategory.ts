// src/actions/subcategories/create-subcategory.ts
"use server";

import prisma from "@/lib/clients/prisma-client";
import { revalidateCategories, revalidateSubcategory } from "@/lib/cache-keys";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

const subcategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  slug: z.string().min(2, "Slug must be at least 2 characters."),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Category is required."),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

type CreateSubcategoryInput = z.input<typeof subcategorySchema>;

export async function createSubcategory(data: CreateSubcategoryInput) {
  try {
    // 1. Auth Check
    const { userId, sessionClaims } = await auth();
    if (!userId) return { success: false, error: "Not authenticated." };

    const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;
    if (role !== "ADMIN") return { success: false, error: "Not authorized." };

    // 2. Validate Input
    const parsed = subcategorySchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: "Invalid data provided." };
    }
    const validData = parsed.data;

    // 3. Check for slug collision in this category
    const existing = await prisma.subcategory.findUnique({
      where: {
        categoryId_slug: {
          categoryId: validData.categoryId,
          slug: validData.slug,
        },
      },
    });

    if (existing) {
      return { success: false, error: "A subcategory with this slug already exists in this category." };
    }

    // 4. Create Subcategory
    const subcategory = await prisma.subcategory.create({
      data: {
        name: validData.name,
        slug: validData.slug,
        description: validData.description || null,
        categoryId: validData.categoryId,
        isActive: validData.isActive,
        sortOrder: validData.sortOrder,
      },
      select: { id: true }
    });

    // 5. Invalidate Caches
    revalidateCategories(); 
    // Fetch parent category slug to revalidate it properly
    const parentCat = await prisma.category.findUnique({ where: { id: validData.categoryId }, select: { slug: true } });
    if (parentCat) {
        revalidateSubcategory(validData.slug, parentCat.slug);
    }

    return { success: true, subcategoryId: subcategory.id };

  } catch (error) {
    console.error("[createSubcategory] Error:", error);
    return { success: false, error: "Failed to create subcategory." };
  }
}