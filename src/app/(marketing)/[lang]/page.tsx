// src/app/[lang]/page.tsx
import * as React from "react";
import { notFound } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";
import { LanguageWrapper } from "@/components/site/pages/language/language-wrapper";
import { getLanguages } from "@/actions/language/get-languages";
import { CACHE_TAGS } from "@/lib/cache-keys";
import prisma from "@/lib/clients/prisma-client";

type PageProps = {
  params: Promise<{ lang: string }>;
};

// 👇 1. TELL NEXT.JS TO PRE-BUILD THESE AT DEPLOY TIME (STATIC)
export async function generateStaticParams() {
  const languages = await prisma.language.findMany({
    where: { isActive: true },
    select: { code: true },
  });

  return languages.map((lang) => ({
    lang: lang.code,
  }));
}

// 👇 2. SEO METADATA
export async function generateMetadata({ params }: PageProps) {
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

// 👇 3. FULL STATIC PAGE (Served instantly like the Slug Page)
export default async function LanguagePage({ params }: PageProps) {
  "use cache";
  cacheLife("max");

  const { lang } = await params;

  cacheTag(CACHE_TAGS.languagePageBlogs(lang));
  cacheTag(CACHE_TAGS.language(lang));

  // Validate language
  const languagesRes = await getLanguages();
  const isValid = languagesRes.success && languagesRes.languages.some((l) => l.code === lang);
  
  if (!isValid) {
    notFound();
  }

  // Render directly (No Suspense, No Wrapper delay)
  return (
    <main className="w-full min-h-screen">
      <LanguageWrapper langCode={lang} />
    </main>
  );
}