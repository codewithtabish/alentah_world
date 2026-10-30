// src/app/[lang]/page.tsx
import * as React from "react";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";
import { LanguageWrapper } from "@/components/site/pages/language/language-wrapper";
import { LanguagePageSkeleton } from "@/components/site/pages/language/language-skeleton";
import { getLanguages } from "@/actions/language/get-languages";
import { CACHE_TAGS } from "@/lib/cache-keys";

type PageProps = {
  params: Promise<{ lang: string }>;
};

// 👇 SEO Metadata
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

// 👇 CACHED: Language homepage is generated once and served to everyone
async function CachedLanguagePage({ lang }: { lang: string }) {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAGS.languagePageBlogs(lang));
  cacheTag(CACHE_TAGS.language(lang));

  // 1. Validate the language exists in the database
  const languagesRes = await getLanguages();
  const isValid = languagesRes.success && languagesRes.languages.some(l => l.code === lang);
  
  if (!isValid) {
    notFound();
  }

  // 2. Render the wrapper which fetches the blogs
  return <LanguageWrapper langCode={lang} />;
}

// 👇 Wrapper with Suspense for the Skeleton
export default function LanguagePage({ params }: PageProps) {
  return (
    <main className="w-full min-h-screen">
      <Suspense fallback={<LanguagePageSkeleton />}>
        <LanguageContent params={params} />
      </Suspense>
    </main>
  );
}

async function LanguageContent({ params }: PageProps) {
  const { lang } = await params;
  return <CachedLanguagePage lang={lang} />;
}