// src/app/[lang]/page.tsx
import * as React from "react";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { LanguageWrapper } from "@/components/site/pages/language/language-wrapper";
import { LanguagePageSkeleton } from "@/components/site/pages/language/language-skeleton";
import { getLanguages } from "@/actions/language/get-languages";

// 👇 SEO Metadata for the Language Page
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  
  const langNames: Record<string, string> = {
    en: "English Edition",
    ur: "اردو ایڈیشن",
    ar: "النسخة العربية",
  };

  return {
    title: `${langNames[lang] || "Edition"} | Alentah World`,
    description: `Read the latest articles, analysis, and stories from the Alentah World ${langNames[lang] || "language"} edition.`,
  };
}

export default async function LanguagePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  
  // 1. Validate the language exists in the database
  const languagesRes = await getLanguages();
  const isValid = languagesRes.success && languagesRes.languages.some(l => l.code === lang);
  
  if (!isValid) {
    notFound();
  }

  return (
    <main className="w-full min-h-screen">
      {/* 👇 Wrapped in Suspense to prevent Blocking Route Errors */}
      <Suspense fallback={<LanguagePageSkeleton />}>
        <LanguageWrapper langCode={lang} />
      </Suspense>
    </main>
  );
}