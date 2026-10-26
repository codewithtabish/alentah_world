// src/actions/editors/get-editor-by-id.ts
"use server";

import { cacheTag, cacheLife } from "next/cache";
import prisma from "@/lib/clients/prisma-client";
import { CACHE_TAGS } from "@/lib/cache-keys";
import { EditorListItem } from "./get-editors";

export type GetEditorResult =
  | { success: true; editor: EditorListItem }
  | { success: false; error: string };

async function getCachedEditorById(id: string): Promise<EditorListItem | null> {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAGS.editor(id));
  cacheTag(CACHE_TAGS.editors);

  const row = await prisma.editor.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      imageUrl: true,
      bio: true,
      experience: true,
      website: true,
      twitter: true,
      linkedin: true,
      instagram: true,
      github: true,
      isActive: true,
      categories: {
        select: { id: true, name: true, slug: true },
      },
    },
  });

  return row as EditorListItem | null;
}

export async function getEditorById(id: string): Promise<GetEditorResult> {
  if (!id) return { success: false, error: "Invalid editor ID." };

  try {
    const editor = await getCachedEditorById(id);
    if (!editor) return { success: false, error: "Editor not found." };
    return { success: true, editor };
  } catch (error) {
    console.error("[getEditorById] Error:", error);
    return { success: false, error: "Failed to load editor." };
  }
}