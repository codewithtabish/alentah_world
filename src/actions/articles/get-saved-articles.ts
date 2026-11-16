// src/actions/articles/get-saved-articles.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { cacheTag, cacheLife } from "next/cache";
import prisma from "@/lib/clients/prisma-client";
import { CACHE_TAGS } from "@/lib/cache-keys";

export type SavedArticleItem = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string | null;
  bannerImage: string;
  bannerImageAlt: string | null;
  publishedAt: Date | null;
  readingTime: number | null;
  category: { name: string; slug: string };
  language: { code: string };
  author: {
    firstName: string | null;
    lastName: string | null;
    imageUrl: string | null;
  };
  savedAt: Date;
};

export async function getSavedArticles() {
  const { userId } = await auth();

  if (!userId) {
    return { success: true, blogs: [] }; // Return empty instead of erroring for guests
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!user) return { success: true, blogs: [] };

    // Note: Using "use cache" inside a function so it's tagged correctly
    const fetchSaved = async () => {
      "use cache";
      cacheLife("max");
      cacheTag(CACHE_TAGS.userSaved(userId));
      cacheTag(CACHE_TAGS.bookmarks(user.id));

      const bookmarks = await prisma.bookmark.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
          blog: {
            include: {
              category: true,
              language: true,
              author: true,
            },
          },
        },
      });

      return bookmarks.map((b) => ({
        id: b.blog.id,
        slug: b.blog.slug,
        title: b.blog.title,
        shortDescription: b.blog.shortDescription,
        bannerImage: b.blog.bannerImage,
        bannerImageAlt: b.blog.bannerImageAlt,
        publishedAt: b.blog.publishedAt,
        readingTime: b.blog.readingTime,
        category: {
          name: b.blog.category.name,
          slug: b.blog.category.slug,
        },
        language: {
          code: b.blog.language.code,
        },
        author: {
          firstName: b.blog.author.firstName,
          lastName: b.blog.author.lastName,
          imageUrl: b.blog.author.imageUrl,
        },
        savedAt: b.createdAt,
      })) as SavedArticleItem[];
    };

    const blogs = await fetchSaved();
    return { success: true, blogs };
  } catch (error) {
    console.error("[getSavedArticles]", error);
    return { success: false, error: "Failed to load saved articles." };
  }
}