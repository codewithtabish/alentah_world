// src/actions/articles/get-article-by-slug.ts
"use server";

import { cacheTag, cacheLife } from "next/cache";
import prisma from "@/lib/clients/prisma-client";
import { CACHE_TAGS } from "@/lib/cache-keys";

// ============================================================
// TYPES
// ============================================================

export type ArticlePageData = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  content: any;
  tableOfContents: any;
  bannerImage: string;
  bannerImageAlt: string | null;
  publishedAt: Date | null;
  readingTime: number | null;
  writtenBy: string | null;
  writerImageUrl: string | null;
  language: {
    code: string;
    name: string;
    direction: string;
  };
  category: {
    name: string;
    slug: string;
  };
  subcategory: {
    name: string;
    slug: string;
  };
  author: {
    firstName: string | null;
    lastName: string | null;
    imageUrl: string | null;
    bio: string | null;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl: string | null;
    ogImage: string | null;
  } | null;
};

export type GetArticleResult =
  | { success: true; article: ArticlePageData }
  | { success: false; error: string };

// ============================================================
// CACHED DATA FETCHER
// ============================================================

async function getCachedArticleBySlug(
  lang: string,
  category: string,
  subcategory: string,
  slug: string
): Promise<ArticlePageData | null> {
  "use cache";
  cacheLife("max");
  // Link the cache to the specific blog slug AND the general blogs tag
  cacheTag(CACHE_TAGS.blog(slug));
  cacheTag(CACHE_TAGS.blogs);

  const article = await prisma.blog.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
      language: { code: lang },
      category: { slug: category },
      subcategory: { slug: subcategory },
    },
    include: {
      language: true,
      category: true,
      subcategory: true,
      author: true,
      seo: true,
    },
  });

  if (!article) return null;

  return article as ArticlePageData;
}

// ============================================================
// MAIN ACTION
// ============================================================

export async function getArticleBySlug(
  lang: string,
  category: string,
  subcategory: string,
  slug: string
): Promise<GetArticleResult> {
  try {
    const article = await getCachedArticleBySlug(lang, category, subcategory, slug);

    if (!article) {
      return { success: false, error: "Article not found." };
    }

    return { success: true, article };
  } catch (error) {
    console.error("[getArticleBySlug]", error);
    return { success: false, error: "Failed to load article." };
  }
}