// src/actions/subcategories/delete-subcategory.ts
"use server";

import prisma from "@/lib/clients/prisma-client";
import { revalidateTag, revalidatePath } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-keys";
import { auth } from "@clerk/nextjs/server";

export type DeleteSubcategoryResult =
  | { success: true }
  | { success: false; error: string };

export async function deleteSubcategory(id: string): Promise<DeleteSubcategoryResult> {
  try {
    // 1. Auth Check
    const { userId, sessionClaims } = await auth();
    if (!userId) return { success: false, error: "Not authenticated." };

    const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;
    if (role !== "ADMIN") return { success: false, error: "Not authorized." };

    // 2. Fetch subcategory details before deleting (for cache invalidation)
    const subcategory = await prisma.subcategory.findUnique({
      where: { id },
      select: { 
        slug: true, 
        category: { select: { slug: true } } 
      },
    });

    if (!subcategory) {
      return { success: false, error: "Subcategory not found." };
    }

    // 3. Delete from Database
    await prisma.subcategory.delete({
      where: { id },
    });

    // 4. Invalidate Caches
    revalidateTag(CACHE_TAGS.categories, "max");
    revalidateTag(CACHE_TAGS.category(subcategory.category.slug), "max");
    revalidateTag(CACHE_TAGS.subcategoryPageBlogs(subcategory.slug), "max");
    
    // 5. Revalidate Paths
    revalidatePath("/");
    revalidatePath("/admin/categories");
    revalidatePath(`/category/${subcategory.category.slug}`);
    revalidatePath(`/category/${subcategory.category.slug}/${subcategory.slug}`);

    return { success: true };

  } catch (error) {
    console.error("[deleteSubcategory] Error:", error);
    return { success: false, error: "Failed to delete subcategory." };
  }
}