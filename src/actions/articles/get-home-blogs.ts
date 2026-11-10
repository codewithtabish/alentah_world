// src/actions/articles/get-home-blogs.ts
"use server";

import { cacheTag, cacheLife } from "next/cache";
import prisma from "@/lib/clients/prisma-client";
import { CACHE_TAGS } from "@/lib/cache-keys";

// ============================================================
// CONFIG
// ============================================================

// Latest stories shown on the homepage (all languages together)
const HOME_BLOG_LIMIT = 30;

// ============================================================
// TYPES
// ============================================================

export type HomeBlogItem = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  bannerImage: string;
  publishedAt: Date | null;
  readingTime: number | null;
  featured: boolean;

  // Guest Author
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
  };

  seo: {
    canonicalUrl: string | null;
  } | null;
};

export type GetHomeBlogsResult =
  | { success: true; blogs: HomeBlogItem[] }
  | { success: false; error: string };

// ============================================================
// CACHED DATA FETCHER
// ============================================================

async function getCachedHomeBlogs(): Promise<HomeBlogItem[]> {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAGS.home);

  const rows = await prisma.blog.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: { not: null },
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: HOME_BLOG_LIMIT,
    select: {
      id: true,
      title: true,
      slug: true,
      shortDescription: true,
      bannerImage: true,
      publishedAt: true,
      readingTime: true,
      featured: true,
      writtenBy: true,
      writerImageUrl: true,
      language: {
        select: {
          code: true,
          name: true,
          direction: true,
        },
      },
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      subcategory: {
        select: {
          name: true,
          slug: true,
        },
      },
      author: {
        select: {
          firstName: true,
          lastName: true,
          imageUrl: true,
        },
      },
      seo: {
        select: {
          canonicalUrl: true,
        },
      },
    },
  });

  return rows;
}

// ============================================================
// MAIN ACTION
// ============================================================

export async function getHomeBlogs(): Promise<GetHomeBlogsResult> {
  try {
    const blogs = await getCachedHomeBlogs();
    return { success: true, blogs };
  } catch (error) {
    console.error("[getHomeBlogs] Error:", error);
    return { success: false, error: "Failed to load home blogs." };
  }
}