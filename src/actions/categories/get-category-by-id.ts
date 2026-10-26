// src/actions/categories/get-category-by-id.ts
"use server";

import { cacheTag, cacheLife } from "next/cache";
import prisma from "@/lib/clients/prisma-client";
import { CACHE_TAGS } from "@/lib/cache-keys";
import { CategoryListItem } from "@/actions/categories/get-categories";

export type GetCategoryResult =
  | { success: true; category: CategoryListItem }
  | { success: false; error: string };

async function getCachedCategoryById(id: string): Promise<CategoryListItem | null> {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAGS.category(id)); // Cache per specific category
  cacheTag(CACHE_TAGS.categories);

  const row = await prisma.category.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      coverImage: true,
      isActive: true,
      sortOrder: true,
      createdAt: true,
      updatedAt: true,
      language: {
        select: {
          id: true,
          code: true,
          name: true,
          nativeName: true,
          direction: true,
        }
      },
      editor: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
        }
      },
      subcategories: {
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: {
          id: true,
          name: true,
          slug: true,
          isActive: true,
        },
      },
      _count: {
        select: {
          subcategories: true,
          blogs: true,
        }
      }
    },
  });

  return row as CategoryListItem | null;
}

export async function getCategoryById(id: string): Promise<GetCategoryResult> {
  if (!id || typeof id !== "string") {
    return { success: false, error: "Invalid category ID." };
  }

  try {
    const category = await getCachedCategoryById(id);
    if (!category) {
      return { success: false, error: "Category not found." };
    }
    return { success: true, category };
  } catch (error) {
    console.error("[getCategoryById] Error:", error);
    return { success: false, error: "Failed to load category." };
  }
}