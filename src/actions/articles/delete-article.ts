// src/actions/articles/delete-article.ts
"use server";

import prisma from "@/lib/clients/prisma-client";
import { revalidateTag, revalidatePath } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-keys";
import { auth } from "@clerk/nextjs/server";

export type DeleteArticleResult = { success: true } | { success: false; error: string };

export async function deleteArticle(id: string): Promise<DeleteArticleResult> {
  try {
    // 1. Strict Admin Auth Check
    const { userId, sessionClaims } = await auth();
    if (!userId) return { success: false, error: "Not authenticated." };

    const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;
    if (role !== "ADMIN") return { success: false, error: "Only administrators can delete articles." };

    // 2. Fetch article to get slugs for cache invalidation
    const article = await prisma.blog.findUnique({
      where: { id },
      select: { 
        slug: true, 
        category: { select: { slug: true } }, 
        subcategory: { select: { slug: true } },
        language: { select: { code: true } }
      },
    });

    if (!article) return { success: false, error: "Article not found." };

    // 3. Delete from DB (Cascades will handle SEO, comments, etc. as per your schema)
    await prisma.blog.delete({ where: { id } });

    // 4. Perfect Cache Invalidation
    revalidatePath("/admin/articles");
    revalidatePath("/admin");
    revalidatePath("/");
    
    // Public routes
    revalidatePath(`/${article.language.code}/${article.category.slug}/${article.subcategory.slug}/${article.slug}`);
    revalidatePath(`/${article.language.code}/${article.category.slug}`);

    // Tags
    revalidateTag(CACHE_TAGS.blogs, "max");
    revalidateTag(CACHE_TAGS.blog(article.slug), "max");
    revalidateTag(CACHE_TAGS.home, "max");
    revalidateTag(CACHE_TAGS.homeScreen, "max");
    revalidateTag(CACHE_TAGS.categoryPageBlogs(article.category.slug), "max");
    revalidateTag(CACHE_TAGS.subcategoryPageBlogs(article.subcategory.slug), "max");

    return { success: true };
  } catch (error) {
    console.error("[deleteArticle] Error:", error);
    return { success: false, error: "Failed to delete article." };
  }
}