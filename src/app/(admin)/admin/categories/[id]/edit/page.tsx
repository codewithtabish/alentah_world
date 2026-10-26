// src/app/admin/categories/[id]/edit/page.tsx

import * as React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getCategoryById } from "@/actions/categories/get-category-by-id";
import { EditCategoryForm } from "@/components/site/admin/category/edit-category-form";

export const metadata = {
  title: "Edit Category | Admin",
};

// 1. Make the page component async and type params as a Promise
export default async function EditCategoryPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 2. Await the params to extract the ID
  const { id } = await params;

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Link 
            href="/admin/categories" 
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ChevronLeft className="size-3" />
            Back to Categories
          </Link>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">
            Edit Category
          </h1>
          <p className="text-sm text-muted-foreground">
            Update the details, appearance, and settings for this category.
          </p>
        </div>
      </div>

      {/* FORM WITH SUSPENSE */}
      <React.Suspense fallback={<EditCategorySkeleton />}>
        <CategoryDataFetcher id={id} />
      </React.Suspense>
    </div>
  );
}

// ============================================
// SERVER DATA FETCHER
// ============================================
async function CategoryDataFetcher({ id }: { id: string }) {
  const result = await getCategoryById(id);

  if (!result.success) {
    return (
      <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6 text-center text-destructive">
        <p className="font-semibold">Failed to load category</p>
        <p className="text-sm mt-1">{result.error}</p>
      </div>
    );
  }

  return <EditCategoryForm category={result.category} />;
}

// ============================================
// LOADING SKELETON
// ============================================
function EditCategorySkeleton() {
  return (
    <div className="flex flex-col gap-8 w-full animate-pulse">
      <div className="rounded-xl border border-border bg-card p-6 h-125">
        <div className="h-6 w-48 bg-muted rounded mb-6" />
        <div className="space-y-5">
          <div className="h-10 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}