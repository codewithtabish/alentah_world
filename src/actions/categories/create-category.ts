// src/actions/categories/create-category.ts
"use server";

import prisma from "@/lib/clients/prisma-client";
import { revalidateCategories } from "@/lib/cache-keys";
import { auth } from "@clerk/nextjs/server";

// ============================================================
// TYPES
// ============================================================

interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
  coverImage?: string;
  languageId: string;
  isActive?: boolean;
  sortOrder?: number;
}

type CreateCategoryResult =
  | { success: true; categoryId: string }
  | { success: false; error: string };

// ============================================================
// SERVER ACTION
// ============================================================

export async function createCategory(
  data: CreateCategoryInput,
): Promise<CreateCategoryResult> {
  try {
    // 1. Security Check: Ensure the user is an ADMIN
    const { userId, sessionClaims } = await auth();
    
    if (!userId) {
      return { success: false, error: "Not authenticated." };
    }

    const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;
    if (role !== "ADMIN") {
      return { success: false, error: "Not authorized to create categories." };
    }

    // 2. Validate required fields
    if (!data.name || !data.slug || !data.languageId) {
      return { success: false, error: "Name, slug, and language are required." };
    }

    // 3. Check if the slug already exists for this specific language
    const existing = await prisma.category.findUnique({
      where: {
        languageId_slug: {
          languageId: data.languageId,
          slug: data.slug,
        },
      },
    });

    if (existing) {
      return { 
        success: false, 
        error: "A category with this slug already exists in this language edition." 
      };
    }

    // 4. Create the category in the database
    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        coverImage: data.coverImage || null,
        languageId: data.languageId,
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder ?? 0,
      },
      select: {
        id: true,
      }
    });

    // 5. Invalidate the Next.js cache using your helper
    // This ensures the new category instantly appears in the admin panel and public navbar.
    revalidateCategories();

    return { success: true, categoryId: category.id };

  } catch (error) {
    console.error("[createCategory] Error:", error);
    return { 
      success: false, 
      error: "Failed to create category. Please try again." 
    };
  }
}