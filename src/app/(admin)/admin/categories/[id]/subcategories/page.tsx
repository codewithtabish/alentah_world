// src/app/admin/categories/[id]/subcategories/page.tsx

import * as React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getCategoryById } from "@/actions/categories/get-category-by-id";
import { SubcategoriesClient } from "@/components/site/admin/category/subcategories-client";

export const metadata = {
  title: "Subcategories | Admin",
};

// ============================================
// MAIN PAGE
// ============================================
export default function SubcategoriesPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <React.Suspense fallback={<SubcategoriesSkeleton />}>
        <SubcategoriesDataFetcher params={params} />
      </React.Suspense>
    </div>
  );
}

// ============================================
// SERVER DATA FETCHER
// ============================================
async function SubcategoriesDataFetcher({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const result = await getCategoryById(id);

  if (!result.success) {
    return (
      <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6 text-center text-destructive">
        <p className="font-semibold">Failed to load category</p>
        <p className="text-sm mt-1">{result.error}</p>
        <Link 
          href="/admin/categories" 
          className="mt-4 inline-flex items-center gap-1 text-xs font-medium hover:underline"
        >
          <ChevronLeft className="size-3" /> Back to Categories
        </Link>
      </div>
    );
  }

  const category = result.category;

  return (
    <>
      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <Link 
          href="/admin/categories" 
          className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground mb-2 transition-colors"
        >
          <ChevronLeft className="size-3" />
          Back to Categories
        </Link>
        <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">
          {category.name} Subcategories
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage the subcategories that belong to this category.
        </p>
      </div>

      {/* CLIENT TABLE & SLIDE-OVER */}
      <SubcategoriesClient 
        categoryId={category.id} 
        categoryName={category.name} 
        initialSubcategories={category.subcategories} 
      />
    </>
  );
}

// ============================================
// LOADING SKELETON
// ============================================
function SubcategoriesSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full animate-pulse">
      {/* HEADER SKELETON */}
      <div className="flex flex-col gap-1">
        <div className="h-4 w-32 bg-muted rounded mb-2" />
        <div className="h-9 w-64 bg-muted rounded-md" />
        <div className="h-4 w-96 bg-muted rounded-md mt-1" />
      </div>

      {/* TABLE SKELETON */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4 bg-card border border-border p-4 rounded-xl h-18">
          <div className="h-10 w-full max-w-md bg-muted rounded-md" />
          <div className="h-10 w-40 bg-muted rounded-md" />
        </div>
        <div className="rounded-xl border border-border bg-card h-100">
          <div className="h-14 bg-muted/30 border-b border-border" />
        </div>
      </div>
    </div>
  );
}