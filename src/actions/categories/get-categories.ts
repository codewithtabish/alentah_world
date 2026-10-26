// src/actions/category/get-categories.ts
"use server";

import { cacheTag, cacheLife } from "next/cache";
import prisma from "@/lib/clients/prisma-client";
import { CACHE_TAGS } from "@/lib/cache-keys";

// ============================================================
// TYPES
// ============================================================

export type CategorySubcategoryListItem = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
};

export type CategoryListItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  language: {
    id: string;
    code: string;
    name: string;
    nativeName: string;
    direction: string;
  };
  editor: {
    id: string;
    name: string;
    imageUrl: string | null;
  } | null;
  subcategories: CategorySubcategoryListItem[];
  _count: {
    subcategories: number;
    blogs: number;
  };
};

export type GetCategoriesResult =
  | { success: true; categories: CategoryListItem[] }
  | { success: false; error: string };

// ============================================================
// CACHED DATA FETCHER (No Try/Catch allowed here)
// ============================================================

async function getCachedCategories(): Promise<CategoryListItem[]> {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAGS.categories);

  const rows = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
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

  return rows;
}

// ============================================================
// PUBLIC ACTION (Handles error catching)
// ============================================================

export async function getCategories(): Promise<GetCategoriesResult> {
  try {
    const categories = await getCachedCategories();
    return { success: true, categories };
  } catch (error) {
    console.error("[getCategories] Error:", error);
    return { success: false, error: "Failed to load categories." };
  }
}