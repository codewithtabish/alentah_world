// src/actions/editors/get-editors.ts
"use server";

import { cacheTag, cacheLife } from "next/cache";
import prisma from "@/lib/clients/prisma-client";
import { CACHE_TAGS } from "@/lib/cache-keys";

// ============================================================
// TYPES
// ============================================================

export type EditorListItem = {
  id: string;
  name: string;
  email: string;
  imageUrl: string | null;
  bio: string | null;
  experience: string | null;
  isActive: boolean;
  
  // Social Fields
  website: string | null;
  twitter: string | null;
  linkedin: string | null;
  instagram: string | null;
  github: string | null;

  categories: {
    id: string;
    name: string;
    slug: string;
  }[];
};

export type GetEditorsResult =
  | { success: true; editors: EditorListItem[] }
  | { success: false; error: string };

// ============================================================
// CACHED READ
// ============================================================

async function getCachedEditors(): Promise<EditorListItem[]> {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAGS.editors);

  const rows = await prisma.editor.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      imageUrl: true,
      bio: true,
      experience: true,
      isActive: true,
      
      // Select Social Fields
      website: true,
      twitter: true,
      linkedin: true,
      instagram: true,
      github: true,

      categories: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  return rows;
}

// ============================================================
// MAIN ACTION
// ============================================================

export async function getEditorsAdmin(): Promise<GetEditorsResult> {
  try {
    const editors = await getCachedEditors();
    return { success: true, editors };
  } catch (error) {
    console.error("[getEditorsAdmin] Error:", error);
    return { success: false, error: "Failed to load editors." };
  }
}