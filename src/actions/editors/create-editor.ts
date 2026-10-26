// src/actions/editors/create-editor.ts
"use server";

import prisma from "@/lib/clients/prisma-client";
import { revalidateTag, revalidatePath } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-keys";
import { auth } from "@clerk/nextjs/server";
import { editorSchema, EditorFormValues } from "@/schemas/editor";

export type CreateEditorResult =
  | { success: true; editorId: string }
  | { success: false; error: string };

export async function createEditor(data: EditorFormValues): Promise<CreateEditorResult> {
  try {
    // 1. Security Check
    const { userId, sessionClaims } = await auth();
    if (!userId) return { success: false, error: "Not authenticated." };

    const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;
    if (role !== "ADMIN") return { success: false, error: "Not authorized." };

    // 2. Validate Input
    const parsed = editorSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: "Invalid data provided." };
    }
    const validData = parsed.data;

    // 3. Check for duplicate email
    const existing = await prisma.editor.findUnique({
      where: { email: validData.email },
    });

    if (existing) {
      return { success: false, error: "An editor with this email already exists." };
    }

    // 4. Create Editor and Connect Categories
    const editor = await prisma.editor.create({
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
        isActive: true,
        categories: {
          connect: validData.categoryIds.map((id) => ({ id })),
        },
      },
      select: { id: true },
    });

    // 5. Invalidate Caches
    revalidateTag(CACHE_TAGS.editors, "max");
    revalidatePath("/admin/editors");
    revalidatePath("/");

    return { success: true, editorId: editor.id };

  } catch (error) {
    console.error("[createEditor] Error:", error);
    return { success: false, error: "Failed to create editor. Please try again." };
  }
}