// src/actions/articles/get-article-by-id.ts
"use server";

import prisma from "@/lib/clients/prisma-client";
import { auth } from "@clerk/nextjs/server";

export async function getArticleByIdAdmin(id: string) {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) return { success: false, error: "Not authenticated." };

    const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;
    if (role !== "ADMIN") return { success: false, error: "Not authorized." };

    const article = await prisma.blog.findUnique({
      where: { id },
      include: {
        seo: true,
        language: true,
        category: true,
        subcategory: true,
      },
    });

    if (!article) return { success: false, error: "Article not found." };

    return { success: true, article };
  } catch (error) {
    console.error("[getArticleByIdAdmin]", error);
    return { success: false, error: "Failed to load article." };
  }
}