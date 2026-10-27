// src/app/admin/articles/new/page.tsx

import * as React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { getLanguagesAdmin } from "@/actions/language/get-languages";
import { getCategories } from "@/actions/categories/get-categories";
import { CreateArticleForm } from "@/components/site/admin/articles/create-article-form";

export const metadata = {
  title: "New Article | Admin",
};

export default function NewArticlePage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <Link 
          href="/admin/articles" 
          className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground mb-2 transition-colors"
        >
          <ChevronLeft className="size-3" />
          Back to Articles
        </Link>
        <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">
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
// SERVER DATA FETCHER
// ============================================
async function NewArticleDataFetcher() {
  // Fetch Languages and Categories in parallel
  const [languagesResult, categoriesResult] = await Promise.all([
    getLanguagesAdmin(),
    getCategories(),
  ]);

  if (!languagesResult.success || !categoriesResult.success) {
    return (
      <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6 text-center text-destructive">
        <p className="font-semibold">Failed to load required data</p>
        <p className="text-sm mt-1">Please refresh the page or try again later.</p>
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
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_320px] animate-pulse">
      
      {/* LEFT COLUMN (Editor) */}
      <div className="space-y-6">
        {/* Title Box */}
        <div className="rounded-2xl border border-border bg-card p-6 h-32 sm:h-40" />
        
        {/* Editor Box */}
        <div className="rounded-2xl border border-border bg-card h-100" />
        
        {/* Media Box */}
        <div className="rounded-2xl border border-border bg-card p-6 h-48" />

        {/* Action Bar */}
        <div className="rounded-2xl border border-border bg-card h-20" />
      </div>

      {/* RIGHT COLUMN (Sidebar) */}
      <div className="space-y-6">
        {/* Classification */}
        <div className="rounded-2xl border border-border bg-card p-6 h-87.5" />
        
        {/* Guest Author */}
        <div className="rounded-2xl border border-border bg-card p-6 h-37.5" />
        
        {/* TOC */}
        <div className="rounded-2xl border border-border bg-card p-6 h-37.5" />
      </div>

    </div>
  );
}