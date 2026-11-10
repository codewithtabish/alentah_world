// src/actions/fellows/upload-fellow-document.ts
"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import s3Client from "@/lib/clients/s3-client";

type UploadSuccess = {
  success: true;
  data: { storageKey: string; originalFileName: string; mimeType: string; fileSize: number; };
};

type UploadError = {
  success: false;
  error: string;
};

export type UploadFellowDocumentResult = UploadSuccess | UploadError;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export async function uploadFellowDocumentAction(
  formData: FormData
): Promise<UploadFellowDocumentResult> {
  try {
    const value = formData.get("file");

    if (!(value instanceof File)) return { success: false, error: "No valid document was provided." };
    if (value.size === 0) return { success: false, error: "The selected document is empty." };
    if (value.size > MAX_FILE_SIZE) return { success: false, error: "Document must be smaller than 5 MB." };
    if (!ALLOWED_TYPES.has(value.type)) return { success: false, error: "Only PDF, DOC, and DOCX files are allowed." };

    const arrayBuffer = await value.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const ext = value.name.split(".").pop() || "pdf";
    const key = `fellows/documents/${randomUUID()}.${ext}`;

    // 👇 USING YOUR EXACT ENV VARIABLE
    const bucketName = process.env.AWS_S3_BUCKET;

    if (!bucketName) {
      throw new Error("AWS_S3_BUCKET is not configured.");
    }

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: value.type,
      })
    );

    return {
      success: true,
      data: {
        storageKey: key,
        originalFileName: value.name,
        mimeType: value.type,
        fileSize: buffer.length,
      },
    };
  } catch (error) {
    console.error("Fellow document upload failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload document.",
    };
  }
}