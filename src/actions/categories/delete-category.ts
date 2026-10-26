// src/actions/category/delete-category.ts
"use server";

// ============================================================
// Server Action — Delete Category (FULL CASCADE)
// ============================================================

import { auth } from "@clerk/nextjs/server";
import { revalidatePath, revalidateTag } from "next/cache";
import prisma from "@/lib/clients/prisma-client";
import { CACHE_TAGS } from "@/lib/cache-keys";

// ============================================================
// TYPES
// ============================================================

export type DeleteCategoryResult =
  | {
      success: true;
      deleted: {
        id: string;
        name: string;
        slug: string;
        subcategoriesDeleted: number;
        articlesDeleted: number;
      };
    }
  | { success: false; error: string };

// ============================================================
// MAIN ACTION
// ============================================================

export async function deleteCategory(
  id: string,
): Promise<DeleteCategoryResult> {
  try {
    // 1. Auth Check
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return { success: false, error: "You must be signed in." };
    }

    const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;
    if (role !== "ADMIN") {
      return { success: false, error: "Only admins can delete categories." };
    }

    // 2. Fetch data to invalidate caches later
    const existing = await prisma.category.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        subcategories: { select: { id: true, slug: true } },
        blogs: { select: { id: true, slug: true } },
      },
    });

    if (!existing) {
      return { success: false, error: "Category not found." };
    }

    // 3. Collect slugs
    const subcategoryIds = existing.subcategories.map((s) => s.id);
    const subcategorySlugs = existing.subcategories.map((s) => s.slug);

    // 4. Fetch articles belonging to the category OR its subcategories
    const allArticles = await prisma.blog.findMany({
      where: {
        OR: [
          { categoryId: id },
          ...(subcategoryIds.length > 0
            ? [{ subcategoryId: { in: subcategoryIds } }]
            : []),
        ],
      },
      select: { id: true, slug: true },
    });

    const articleIds = allArticles.map((a) => a.id);
    const articleSlugs = allArticles.map((a) => a.slug);

    // 5. Execute transaction
    await prisma.$transaction(async (tx) => {
      // Delete engagement on articles
      if (articleIds.length > 0) {
        await tx.bookmark.deleteMany({ where: { blogId: { in: articleIds } } });
        await tx.blogLike.deleteMany({ where: { blogId: { in: articleIds } } });
        await tx.comment.deleteMany({ where: { blogId: { in: articleIds } } });
        await tx.blogTag.deleteMany({ where: { blogId: { in: articleIds } } });
        await tx.blogSEO.deleteMany({ where: { blogId: { in: articleIds } } });
        await tx.blog.deleteMany({ where: { id: { in: articleIds } } });
      }

      // Delete subcategories
      await tx.subcategory.deleteMany({ where: { categoryId: id } });

      // Delete category
      await tx.category.delete({ where: { id } });
    });

    // 6. Invalidate Next.js Cache
    // Paths
    revalidatePath("/admin/categories");
    revalidatePath("/admin/articles");
    revalidatePath("/admin");
    revalidatePath("/");

    for (const slug of subcategorySlugs) {
      revalidatePath(`/category/${existing.slug}/${slug}`);
    }
    for (const slug of articleSlugs) {
      revalidatePath(`/article/${slug}`);
    }

    // Tags
    revalidateTag(CACHE_TAGS.categories, "max");
    revalidateTag(CACHE_TAGS.category(existing.slug), "max");
    revalidateTag(CACHE_TAGS.dashboardCategories, "max");
    revalidateTag(CACHE_TAGS.blogs, "max");
    revalidateTag(CACHE_TAGS.dashboardBlogs, "max");
    revalidateTag(CACHE_TAGS.home, "max");
    revalidateTag(CACHE_TAGS.homeScreen, "max");

    revalidateTag(CACHE_TAGS.categoryPageBlogs(existing.slug), "max");

    for (const slug of subcategorySlugs) {
      revalidateTag(CACHE_TAGS.subcategoryPageBlogs(slug), "max");
    }
    for (const slug of articleSlugs) {
      revalidateTag(CACHE_TAGS.blog(slug), "max");
    }

    return {
      success: true,
      deleted: {
        id: existing.id,
        name: existing.name,
        slug: existing.slug,
        subcategoriesDeleted: subcategoryIds.length,
        articlesDeleted: articleIds.length,
      },
    };
  } catch (error) {
    console.error("[deleteCategory] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete category. Please try again.",
    };
  }
}