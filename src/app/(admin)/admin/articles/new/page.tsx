// src/app/(admin)/admin/articles/new/page.tsx
// (use the path your project really has; your error showed the (admin) group)

import * as React from "react";
import Link from "next/link";
import { connection } from "next/server";
import { ChevronLeft } from "lucide-react";

import { getLanguagesAdmin } from "@/actions/language/get-languages";
import { getCategories } from "@/actions/categories/get-categories";
import { CreateArticleForm } from "@/components/site/admin/articles/create-article-form";

export const metadata = {
  title: "New Article | Admin",
};

export default function NewArticlePage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <Link
          href="/admin/articles"
          className="mb-2 flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-3" />
          Back to Articles
        </Link>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
          Create New Article
        </h1>
        <p className="text-sm text-muted-foreground">
          Write, format, and publish your story to Alentah World.
        </p>
      </div>

      {/* FORM WITH SUSPENSE */}
      <React.Suspense fallback={<NewArticleSkeleton />}>
        <NewArticleDataFetcher />
      </React.Suspense>
    </div>
  );
}

// ============================================
// SERVER DATA FETCHER (runs per request, never at build time)
// ============================================
async function NewArticleDataFetcher() {
  // Wait for a real visitor. This stops the build from running auth() here.
  await connection();

  // Fetch languages and categories in parallel
  const [languagesResult, categoriesResult] = await Promise.all([
    getLanguagesAdmin(),
    getCategories(),
  ]);

  if (!languagesResult.success || !categoriesResult.success) {
    return (
      <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6 text-center text-destructive">
        <p className="font-semibold">Failed to load required data</p>
        <p className="mt-1 text-sm">
          Please refresh the page or try again later.
        </p>
      </div>
    );
  }

  return (
    <CreateArticleForm
      languages={languagesResult.languages}
      categories={categoriesResult.categories}
    />
  );
}

// ============================================
// LOADING SKELETON
// ============================================
function NewArticleSkeleton() {
  return (
    <div className="grid animate-pulse grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
      {/* LEFT COLUMN (Editor) */}
      <div className="space-y-6">
        <div className="h-32 rounded-2xl border border-border bg-card p-6 sm:h-40" />
        <div className="h-100 rounded-2xl border border-border bg-card" />
        <div className="h-48 rounded-2xl border border-border bg-card p-6" />
        <div className="h-20 rounded-2xl border border-border bg-card" />
      </div>

      {/* RIGHT COLUMN (Sidebar) */}
      <div className="space-y-6">
        <div className="h-87.5 rounded-2xl border border-border bg-card p-6" />
        <div className="h-37.5 rounded-2xl border border-border bg-card p-6" />
        <div className="h-37.5 rounded-2xl border border-border bg-card p-6" />
      </div>
    </div>
  );
}