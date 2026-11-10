// src/actions/articles/update-article.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/clients/prisma-client";
import { CACHE_TAGS } from "@/lib/cache-keys";
import { generateSEO, type SEOResult, type SEOLanguage } from "@/lib/articles/generate-seo";

export type UpdateArticleInput = {
  id: string;
  title: string;
  slug: string;
  content: { blocks: Array<Record<string, unknown>> };
  bannerImage: string;
  bannerImageAlt?: string;
  ogImage: string;
  languageId: string;
  categoryId: string;
  subcategoryId: string;
  writtenBy?: string;
  writerImageUrl?: string;
  type?: string;
  status?: string;
  featured?: boolean;
  scheduledAt?: string | null;
  tableOfContents?: { id: string; title: string; slug: string; level?: number }[];
};

export async function updateArticleAction(data: UpdateArticleInput) {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) return { success: false, error: "Not authenticated." };

    const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;
    if (role !== "ADMIN") return { success: false, error: "Not authorized." };

    // 1. Fetch existing article to get old slugs for cache invalidation
    const existing = await prisma.blog.findUnique({
      where: { id: data.id },
      include: { category: true, subcategory: true, language: true, seo: true },
    });

    if (!existing) return { success: false, error: "Article not found." };

    // 2. Check slug conflict (if slug changed)
    if (existing.slug !== data.slug) {
      const conflict = await prisma.blog.findUnique({ where: { slug: data.slug } });
      if (conflict) return { success: false, error: "This slug is already in use.", field: "slug" };
    }

    // 3. Fetch the new Category and Subcategory to get their slugs for the Canonical URL
    const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
    const subcategory = await prisma.subcategory.findUnique({ where: { id: data.subcategoryId } });
    const language = await prisma.language.findUnique({ where: { id: data.languageId } });

    if (!category || !subcategory || !language) {
      return { success: false, error: "Invalid language, category, or subcategory." };
    }

    // 4. Construct the Canonical URL dynamically using the .env URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://www.eneena.com";
    const canonicalUrl = `${baseUrl}/${language.code}/${category.slug}/${subcategory.slug}/${data.slug}`;

    // 5. Regenerate SEO if title or content changed
    let seo: SEOResult | null = null;
    if (existing.title !== data.title || JSON.stringify(existing.content) !== JSON.stringify(data.content)) {
      const textContent = data.content.blocks
        .map((b: any) => b.data?.text || b.data?.itemsContent || "")
        .join("\n");
      seo = await generateSEO(data.title, textContent, existing.language.code as SEOLanguage);
    }

    // 6. Update DB
    const isPublished = data.status === "PUBLISHED";
    
    const updated = await prisma.blog.update({
      where: { id: data.id },
      data: {
        title: data.title.trim(),
        slug: data.slug.trim(),
        content: data.content as unknown as Prisma.InputJsonValue,
        tableOfContents: (data.tableOfContents ?? []) as unknown as Prisma.InputJsonValue,
        bannerImage: data.bannerImage.trim(),
        bannerImageAlt: data.bannerImageAlt?.trim() || data.title.trim(),
        type: (data.type as any) || "ARTICLE",
        status: data.status as any,
        featured: data.featured ?? false,
        publishedAt: isPublished && !existing.publishedAt ? new Date() : existing.publishedAt,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        languageId: data.languageId,
        categoryId: data.categoryId,
        subcategoryId: data.subcategoryId,
        writtenBy: data.writtenBy?.trim() || null,
        writerImageUrl: data.writerImageUrl?.trim() || null,
        
        // 👇 FIX: Update SEO and force the new Canonical URL
        seo: {
          upsert: {
            create: {
              metaTitle: seo?.metaTitle || data.title.trim(),
              metaDescription: seo?.metaDescription || "",
              canonicalUrl: canonicalUrl, // Created with new URL
              ogTitle: seo?.metaTitle || data.title.trim(),
              ogDescription: seo?.metaDescription || "",
              ogImage: data.ogImage.trim(),
              twitterTitle: seo?.metaTitle || data.title.trim(),
              twitterDescription: seo?.metaDescription || "",
              twitterImage: data.ogImage.trim(),
            },
            update: {
              metaTitle: seo?.metaTitle || data.title.trim(),
              metaDescription: seo?.metaDescription || "",
              canonicalUrl: canonicalUrl, // Updated with new URL
              ogTitle: seo?.metaTitle || data.title.trim(),
              ogDescription: seo?.metaDescription || "",
              ogImage: data.ogImage.trim(),
              twitterTitle: seo?.metaTitle || data.title.trim(),
              twitterDescription: seo?.metaDescription || "",
              twitterImage: data.ogImage.trim(),
            },
          },
        },
      },
    });

    // 7. PERFECT CACHE INVALIDATION
    // Admin Paths
    revalidatePath("/admin/articles");
    revalidatePath("/admin");

    // Public Paths
    revalidatePath("/");
    
    // Old URL
    revalidatePath(`/${existing.language.code}/${existing.category.slug}/${existing.subcategory.slug}/${existing.slug}`);
    
    // New URL
    revalidatePath(`/${language.code}/${category.slug}/${subcategory.slug}/${updated.slug}`);
    
    // Category & Subcategory Paths
    revalidatePath(`/${existing.language.code}/${existing.category.slug}`);
    revalidatePath(`/${language.code}/${category.slug}`);
    
    // Tags
    revalidateTag(CACHE_TAGS.blog(existing.slug), "max");
    if (existing.slug !== updated.slug) {
      revalidateTag(CACHE_TAGS.blog(updated.slug), "max"); // Invalidate new slug too
    }
    revalidateTag(CACHE_TAGS.blogs, "max");
    revalidateTag(CACHE_TAGS.home, "max");
    revalidateTag(CACHE_TAGS.homeScreen, "max");
    revalidateTag(CACHE_TAGS.categoryPageBlogs(existing.category.slug), "max");
    revalidateTag(CACHE_TAGS.subcategoryPageBlogs(existing.subcategory.slug), "max");

    return { success: true, data: { articleId: updated.id, slug: updated.slug } };
  } catch (error) {
    console.error("[updateArticleAction]", error);
    return { success: false, error: "Failed to update article." };
  }
}