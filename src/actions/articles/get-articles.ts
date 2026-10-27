// src/actions/articles/get-articles.ts
"use server";

import { cacheTag, cacheLife } from "next/cache";
import prisma from "@/lib/clients/prisma-client";
import { CACHE_TAGS } from "@/lib/cache-keys";

// ============================================================
// TYPES
// ============================================================

export type ArticleListItem = {
  id: string;
  title: string;
  slug: string;
  bannerImage: string;
  status: string;
  publishedAt: Date | null;
  updatedAt: Date;
  writtenBy: string | null; // <-- Added Guest Author
  writerImageUrl: string | null; // <-- Added Guest Author Image
  language: {
    code: string;
    name: string;
  };
  category: {
    name: string;
  };
  subcategory: {
    name: string;
  };
  author: {
    firstName: string | null;
    lastName: string | null;
    imageUrl: string | null;
  };
  editor: {
    name: string;
    imageUrl: string | null;
  } | null;
};

export type ArticleStats = {
  total: number;
  published: number;
  drafts: number;
  scheduled: number;
};

export type GetArticlesResult =
  | { success: true; articles: ArticleListItem[]; stats: ArticleStats }
  | { success: false; error: string };

// ============================================================
// CACHED READ
// ============================================================

async function getCachedArticles(): Promise<{ articles: ArticleListItem[]; stats: ArticleStats }> {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAGS.blogs);

  const rows = await prisma.blog.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      bannerImage: true,
      status: true,
      publishedAt: true,
      updatedAt: true,
      writtenBy: true, // <-- Added
      writerImageUrl: true, // <-- Added
      language: { select: { code: true, name: true } },
      category: { 
        select: { 
          name: true,
          editor: { select: { name: true, imageUrl: true } }
        } 
      },
      subcategory: { select: { name: true } },
      author: { select: { firstName: true, lastName: true, imageUrl: true } },
    },
  });

  // Calculate Stats safely
  const stats: ArticleStats = {
    total: rows.length,
    published: rows.filter((r) => r.status === "PUBLISHED").length,
    drafts: rows.filter((r) => r.status === "DRAFT").length,
    scheduled: rows.filter((r) => r.status === "SCHEDULED").length,
  };

  // Map the data to match the ArticleListItem type
  const articles = rows.map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    bannerImage: row.bannerImage,
    status: row.status,
    publishedAt: row.publishedAt,
    updatedAt: row.updatedAt,
    writtenBy: row.writtenBy,
    writerImageUrl: row.writerImageUrl,
    language: row.language,
    category: { name: row.category.name },
    subcategory: { name: row.subcategory.name },
    author: row.author,
    editor: row.category.editor,
  }));

  return { articles, stats };
}

// ============================================================
// MAIN ACTION
// ============================================================

export async function getArticlesAdmin(): Promise<GetArticlesResult> {
  try {
    const data = await getCachedArticles();
    return { success: true, articles: data.articles, stats: data.stats };
  } catch (error) {
    console.error("[getArticlesAdmin] Error:", error);
    return { success: false, error: "Failed to load articles." };
  }
}