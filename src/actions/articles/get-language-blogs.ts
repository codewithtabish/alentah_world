// src/actions/articles/get-language-blogs.ts
"use server";

import { cacheTag, cacheLife } from "next/cache";
import prisma from "@/lib/clients/prisma-client";
import { CACHE_TAGS } from "@/lib/cache-keys";

export type LanguagePageBlog = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  bannerImage: string;
  publishedAt: Date | null;
  readingTime: number | null;
  writtenBy: string | null;
  writerImageUrl: string | null;
  language: { code: string; name: string; direction: string };
  category: { name: string; slug: string };
  subcategory: { name: string; slug: string };
  author: { firstName: string | null; lastName: string | null; imageUrl: string | null };
};

export type LanguagePageCategory = {
  id: string;
  name: string;
  slug: string;
};

// 👇 FIXED: The Union Type is explicitly defined so TypeScript knows what to expect
export type GetLanguageBlogsResult = 
  | { success: true; blogs: LanguagePageBlog[]; categories: LanguagePageCategory[] }
  | { success: false; error: string };

async function getCachedLanguageBlogs(langCode: string) {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAGS.languagePageBlogs(langCode));

  const blogs = await prisma.blog.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: { not: null },
      language: { code: langCode },
    },
    orderBy: { publishedAt: "desc" },
    take: 25,
    select: {
      id: true, title: true, slug: true, shortDescription: true, bannerImage: true,
      publishedAt: true, readingTime: true, writtenBy: true, writerImageUrl: true,
      language: { select: { code: true, name: true, direction: true } },
      category: { select: { name: true, slug: true } },
      subcategory: { select: { name: true, slug: true } },
      author: { select: { firstName: true, lastName: true, imageUrl: true } },
    },
  });

  const categories = await prisma.category.findMany({
    where: { language: { code: langCode }, isActive: true },
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true, slug: true },
  });

  return { blogs, categories };
}

// 👇 FIXED: Added the Return Type
export async function getLanguageBlogs(langCode: string): Promise<GetLanguageBlogsResult> {
  try {
    const data = await getCachedLanguageBlogs(langCode);
    return { success: true, blogs: data.blogs, categories: data.categories };
  } catch (error) {
    console.error("[getLanguageBlogs]", error);
    return { success: false, error: "Failed to load language data." };
  }
}