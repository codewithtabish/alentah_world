// src/app/admin/articles/page.tsx

import * as React from "react";
import { getArticlesAdmin } from "@/actions/articles/get-articles";
import { ArticlesClient } from "@/components/site/admin/articles/articles-client";

export const metadata = {
  title: "Editorial Overview | Admin",
};

export default function ArticlesPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <React.Suspense fallback={<ArticlesSkeleton />}>
        <ArticlesDataFetcher />
      </React.Suspense>
    </div>
  );
}

async function ArticlesDataFetcher() {
  const result = await getArticlesAdmin();

  if (!result.success) {
    return (
      <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6 text-center text-destructive">
        <p className="font-semibold">Failed to load articles</p>
        <p className="text-sm mt-1">{result.error}</p>
      </div>
    );
  }

  return <ArticlesClient initialArticles={result.articles} stats={result.stats} />;
}

function ArticlesSkeleton() {
  return (
    <div className="flex flex-col gap-8 w-full animate-pulse">
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <div className="h-9 w-64 bg-muted rounded-md" />
        <div className="h-4 w-96 bg-muted rounded-md" />
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5 h-27.5">
            <div className="h-4 w-24 bg-muted rounded mb-4" />
            <div className="h-8 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>

      {/* TABLE */}
      <div className="rounded-xl border border-border bg-card overflow-hidden h-125">
        <div className="h-14 bg-muted/30 border-b border-border" />
        <div className="p-4 space-y-4">
           {Array.from({ length: 6 }).map((_, i) => (
             <div key={i} className="h-16 bg-muted rounded w-full" />
           ))}
        </div>
      </div>
    </div>
  );
}