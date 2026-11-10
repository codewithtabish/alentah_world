// src/actions/images/upload-profile-image-action.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { uploadEditorImage } from "@/lib/images/upload-editor-image";

export async function uploadProfileImageAction(formData: FormData) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "You must be signed in to upload an image." };
    }

    const file = formData.get("file");
    if (!(file instanceof File)) {
      return { success: false, error: "No valid image provided." };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 👇 Calls the EXACT logic from your upload-editor-image.ts
    const result = await uploadEditorImage({
      file: buffer,
      fileName: file.name,
      folder: "fellows/story-profiles", 
    });

    return {
      success: true,
      url: result.url,
    };
  } catch (error) {
    console.error("[UPLOAD_PROFILE_ERROR]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload profile image.",
    };
  }
}