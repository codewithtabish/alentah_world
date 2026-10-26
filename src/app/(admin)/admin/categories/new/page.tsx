// src/app/admin/categories/new/page.tsx

import * as React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CreateCategoryForm } from "@/components/site/admin/category/create-category-form";

// Only the Form Component is imported

// ============================================
// METADATA
// ============================================
export const metadata = {
  title: "Create Category | Admin",
};

// ============================================
// MAIN PAGE
// ============================================
export default function CreateCategoryPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      
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
            Create Category
          </h1>
          <p className="text-sm text-muted-foreground">
            Create a category for a specific language and organize its editorial content.
          </p>
        </div>
      </div>

      {/* FORM */}
      <React.Suspense fallback={<CreateCategorySkeleton />}>
        <CreateCategoryForm />
      </React.Suspense>

    </div>
  );
}

// ============================================
// LOADING SKELETON
// ============================================
function CreateCategorySkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start animate-pulse">
      
      {/* LEFT COLUMN (Main Form) */}
      <div className="flex-1 w-full space-y-8">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="h-6 w-48 bg-muted rounded mb-6" />
          <div className="space-y-5">
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
            <div className="h-32 bg-muted rounded" />
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN (Sidebar) */}
      <div className="w-full lg:w-95 shrink-0 space-y-6">
        {/* Appearance Card */}
        <div className="rounded-xl border border-border bg-card p-6 h-75">
          <div className="h-6 w-32 bg-muted rounded mb-4" />
          <div className="h-32 bg-muted rounded" />
        </div>
        
        {/* Settings Card */}
        <div className="rounded-xl border border-border bg-card p-6 h-50">
          <div className="h-6 w-32 bg-muted rounded mb-4" />
          <div className="h-10 bg-muted rounded mb-4" />
          <div className="h-10 bg-muted rounded" />
        </div>

        {/* Buttons Skeleton */}
        <div className="flex justify-end gap-3 pt-4">
          <div className="h-10 w-24 bg-muted rounded" />
          <div className="h-10 w-32 bg-muted rounded" />
        </div>
      </div>

    </div>
  );
}