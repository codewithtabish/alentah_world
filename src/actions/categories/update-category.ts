// src/actions/categories/update-category.ts
"use server";

import prisma from "@/lib/clients/prisma-client";
import { revalidateCategories, revalidateCategory } from "@/lib/cache-keys";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { categorySchema } from "@/schemas/category";
import { revalidatePath } from "next/cache";

// Reuse your Zod schema for validation
type UpdateCategoryInput = z.infer<typeof categorySchema> & {
  id: string;
};

export type UpdateCategoryResult =
  | { success: true }
  | { success: false; error: string };

export async function updateCategory(
  data: UpdateCategoryInput
): Promise<UpdateCategoryResult> {
  try {
    // 1. Security Check
    const { userId, sessionClaims } = await auth();
    if (!userId) return { success: false, error: "Not authenticated." };

    const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;
    if (role !== "ADMIN") return { success: false, error: "Not authorized." };

    // 2. Validate Input
    const parsed = categorySchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: "Invalid category data provided." };
    }
    const validData = parsed.data;

    // 3. Fetch existing category to get the old slug for revalidation
    const existingCategory = await prisma.category.findUnique({
      where: { id: data.id },
      select: { id: true, slug: true, languageId: true },
    });

    if (!existingCategory) {
      return { success: false, error: "Category not found." };
    }

    // 4. Check for slug collision (if slug or language changed)
    if (existingCategory.slug !== validData.slug || existingCategory.languageId !== validData.languageId) {
      const slugConflict = await prisma.category.findFirst({
        where: {
          languageId: validData.languageId,
          slug: validData.slug,
          NOT: { id: data.id }, // Exclude the current category
        },
      });

      if (slugConflict) {
        return { 
          success: false, 
          error: "A category with this slug already exists in this language edition." 
        };
      }
    }

    // 5. Update Database
    await prisma.category.update({
      where: { id: data.id },
      data: {
        name: validData.name,
        slug: validData.slug,
        description: validData.description || null,
        coverImage: validData.coverImage || null,
        languageId: validData.languageId,
        isActive: validData.isActive,
        sortOrder: validData.sortOrder,
      },
    });

    // 6. Invalidate Caches perfectly
    revalidateCategory(validData.slug, { previousSlug: existingCategory.slug });
    revalidateCategories();

    // 7. Revalidate all necessary paths
    revalidatePath("/admin/categories");
    revalidatePath("/admin/categories", "layout");
    
    // Public facing routes
    revalidatePath("/");
    revalidatePath(`/category/${validData.slug}`);
    
    // If slug changed, revalidate the old public route as well
    if (existingCategory.slug !== validData.slug) {
      revalidatePath(`/category/${existingCategory.slug}`);
    }

    return { success: true };

  } catch (error) {
    console.error("[updateCategory] Error:", error);
    return { 
      success: false, 
      error: "Failed to update category. Please try again." 
    };
  }
}