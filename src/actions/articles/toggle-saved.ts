// src/actions/articles/toggle-saved.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/clients/prisma-client";
import { revalidateBookmark } from "@/lib/cache-keys";

export async function toggleSavedAction(blogId: string, blogSlug?: string) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return { success: false, error: "You must be signed in to save articles." };
    }

    // 1. Get the internal database user ID
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    if (!user) {
      return { success: false, error: "User not found in database." };
    }

    // 2. Check if the bookmark already exists
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_blogId: {
          userId: user.id,
          blogId,
        },
      },
    });

    let isSaved = false;

    // 3. Toggle the bookmark
    if (existingBookmark) {
      // Remove it
      await prisma.bookmark.delete({
        where: {
          id: existingBookmark.id,
        },
      });
      isSaved = false;
    } else {
      // Add it
      await prisma.bookmark.create({
        data: {
          userId: user.id,
          blogId,
        },
      });
      isSaved = true;
    }

    // 4. Instantly clear the cache in the background
    // This triggers Next.js to refresh the /saved page and the specific article
    revalidateBookmark(clerkId, user.id, blogId);

    return { success: true, isSaved };
  } catch (error) {
    console.error("[toggleSavedAction]", error);
    return { success: false, error: "Failed to toggle saved status. Please try again." };
  }
}