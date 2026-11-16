
import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Bookmark } from "lucide-react";

import { getSavedArticles } from "@/actions/articles/get-saved-articles";
import { SavedClient } from "@/components/site/pages/saved/saved-client";
import { SavedArticlesSkeleton } from "@/components/site/pages/saved/saved-articles-skeleton";

// ============================================================
// SEO: PRIVATE PAGE - NEVER INDEX
// ============================================================

export const metadata: Metadata = {
  title: "My Saved Stories | ENEENA",
  description: "Your personal collection of saved ENEENA stories.",

  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

// ============================================================
// TYPES
// ============================================================

type SavedPageProps = {
  params: Promise<{
    lang: string;
  }>;
};

// ============================================================
// AUTHENTICATED SAVED ARTICLES
// ============================================================

async function SavedArticlesData({
  lang,
}: {
  lang: string;
}) {
  const { userId } = await auth();

  // No separate sign-in route exists in this application.
  // Send unauthenticated visitors to their language homepage.
  if (!userId) {
    redirect(`/${lang}`);
  }

  const result = await getSavedArticles();

  if (!result.success) {
    return (
      <div
        className="py-20 text-center text-muted-foreground"
        role="alert"
      >
        Failed to load your saved articles. Please try again later.
      </div>
    );
  }

  return <SavedClient initialBlogs={result.blogs ?? []} />;
}

// ============================================================
// LOADING STATE
// ============================================================

function SavedPageFallback() {
  return <SavedArticlesSkeleton />;
}

// ============================================================
// PAGE
// ============================================================

export default async function SavedPage({
  params,
}: SavedPageProps) {
  const { lang } = await params;

  const direction =
    lang === "ar" || lang === "ur" ? "rtl" : "ltr";

  return (
    <div className="flex min-h-screen flex-col">
      {/* ================================================== */}
      {/* HERO HEADER */}
      {/* ================================================== */}

      <section className="relative isolate w-full overflow-hidden">
        <div className="absolute inset-0 -z-20">
          <Image
            src="/images/saved/banner-16x9-q80.webp"
            alt="A collection of stories saved for later reading"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <div className="absolute inset-0 -z-10 bg-black/65" />

        <div className="relative mx-auto w-full max-w-7xl py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-3">
              <Bookmark
                className="size-6 text-white"
                aria-hidden="true"
              />

              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
                ENEENA COLLECTION
              </span>
            </div>

            <h1 className="mb-5 font-serif text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              My Saved Stories
            </h1>

            <p className="max-w-2xl text-lg leading-relaxed text-white/85">
              Your personal collection of stories, ideas, and
              perspectives worth returning to.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* SAVED ARTICLES */}
      {/* ================================================== */}

      <main
        lang={lang}
        dir={direction}
        className="w-full min-w-0 flex-1 pb-20"
      >
        <Suspense fallback={<SavedPageFallback />}>
          <SavedArticlesData lang={lang} />
        </Suspense>
      </main>
    </div>
  );
}
