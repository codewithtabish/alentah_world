// src/app/admin/categories/page.tsx

import { getCategories } from "@/actions/categories/get-categories";
import { CategoriesClient } from "@/components/site/admin/category/categories-client";
import * as React from "react";

export const metadata = {
  title: "Categories | Admin",
};

// ============================================
// MAIN PAGE
// ============================================
export default function CategoriesPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <React.Suspense fallback={<CategoriesSkeleton />}>
        <CategoriesDataFetcher />
      </React.Suspense>
    </div>
  );
}

// ============================================
// SERVER DATA FETCHER
// ============================================
async function CategoriesDataFetcher() {
  const result = await getCategories();

  if (!result.success) {
    return (
      <div className="p-8 text-center text-destructive rounded-xl border border-destructive/20 bg-destructive/5">
        <p className="font-semibold">Failed to load categories</p>
        <p className="text-sm">{result.error}</p>
      </div>
    );
  }

  return <CategoriesClient initialCategories={result.categories} />;
}

// ============================================
// LOADING SKELETON
// ============================================
function CategoriesSkeleton() {
  return (
    <div className="flex flex-col gap-8 w-full animate-pulse">
      
      {/* HEADER SKELETON */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-4 w-72 bg-muted rounded" />
        </div>
        <div className="h-10 w-32 bg-muted rounded-md" />
      </div>

      {/* STATS SKELETON */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5 h-27.5">
            <div className="h-4 w-24 bg-muted rounded mb-4" />
            <div className="h-8 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>

      {/* FILTERS SKELETON */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-card border border-border p-4 rounded-xl">
        <div className="h-10 flex-1 w-full bg-muted rounded-md" />
        <div className="h-10 w-32 bg-muted rounded-md" />
        <div className="h-10 w-32 bg-muted rounded-md" />
      </div>

      {/* TABLE SKELETON */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="h-12 bg-muted/30 border-b border-border" />
        <div className="divide-y divide-border">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <div className="size-10 bg-muted rounded-md shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 bg-muted rounded" />
                <div className="h-3 w-64 bg-muted rounded" />
              </div>
              <div className="h-6 w-20 bg-muted rounded-full" />
              <div className="h-4 w-24 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}