// src/components/site/pages/language/language-wrapper.tsx
import { getLanguageBlogs } from "@/actions/articles/get-language-blogs";
import { LanguageClient } from "./language-client";
import { LanguagePageSkeleton } from "./language-skeleton";

export async function LanguageWrapper({ langCode }: { langCode: string }) {
  const res = await getLanguageBlogs(langCode);

  if (!res.success) {
    return <div className="py-20 text-center text-red-500">Failed to load edition.</div>;
  }

  return <LanguageClient langCode={langCode} blogs={res.blogs} categories={res.categories} />;
}