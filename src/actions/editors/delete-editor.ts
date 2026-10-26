// src/actions/editors/delete-editor.ts
"use server";

import prisma from "@/lib/clients/prisma-client";
import { revalidateTag, revalidatePath } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-keys";
import { auth } from "@clerk/nextjs/server";

export type DeleteEditorResult = { success: true } | { success: false; error: string };

export async function deleteEditor(id: string): Promise<DeleteEditorResult> {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) return { success: false, error: "Not authenticated." };

    const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;
    if (role !== "ADMIN") return { success: false, error: "Not authorized." };

    const editor = await prisma.editor.findUnique({
      where: { id },
      select: { name: true },
    });

    if (!editor) return { success: false, error: "Editor not found." };

    await prisma.editor.delete({ where: { id } });

    // Perfect cache invalidation
    revalidateTag(CACHE_TAGS.editor(id), "max");
    revalidateTag(CACHE_TAGS.editors, "max");
    revalidateTag(CACHE_TAGS.categories, "max");
    
    revalidatePath("/admin/editors");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("[deleteEditor] Error:", error);
    return { success: false, error: "Failed to delete editor." };
  }
}