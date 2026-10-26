// src/actions/editors/update-editor.ts
"use server";

import prisma from "@/lib/clients/prisma-client";
import { revalidateTag, revalidatePath } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-keys";
import { auth } from "@clerk/nextjs/server";
import { editorSchema } from "@/schemas/editor";

export type UpdateEditorResult = { success: true } | { success: false; error: string };

export async function updateEditor(id: string, data: unknown): Promise<UpdateEditorResult> {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) return { success: false, error: "Not authenticated." };

    const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;
    if (role !== "ADMIN") return { success: false, error: "Not authorized." };

    const parsed = editorSchema.safeParse(data);
    if (!parsed.success) return { success: false, error: "Invalid data." };
    const validData = parsed.data;

    await prisma.editor.update({
      where: { id },
      data: {
        name: validData.name,
        email: validData.email,
        experience: validData.experience || null,
        bio: validData.bio || null,
        imageUrl: validData.imageUrl || null,
        website: validData.website || null,
        twitter: validData.twitter || null,
        linkedin: validData.linkedin || null,
        instagram: validData.instagram || null,
        github: validData.github || null,
        // Overwrite categories (disconnect all, connect new)
        categories: {
          set: validData.categoryIds.map((catId) => ({ id: catId })),
        },
      },
    });

    // Perfect cache invalidation
    revalidateTag(CACHE_TAGS.editor(id), "max");
    revalidateTag(CACHE_TAGS.editors, "max");
    revalidateTag(CACHE_TAGS.categories, "max"); // Categories hold editor data
    revalidateTag(CACHE_TAGS.blogs, "max"); // Blogs show author info

    revalidatePath("/admin/editors");
    revalidatePath(`/admin/editors/${id}`);
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("[updateEditor] Error:", error);
    return { success: false, error: "Failed to update editor." };
  }
}