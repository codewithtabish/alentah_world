// src/app/[lang]/saved/loading.tsx
import { SavedArticlesSkeleton } from "@/components/site/pages/saved/saved-articles-skeleton";

export default function SavedLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* 1. MINIMAL HEADER SKELETON */}
      <section className="w-full bg-[#fcf9f2] border-b border-border py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 animate-pulse">
          <div className="h-12 md:h-16 w-64 md:w-96 rounded-lg bg-muted-foreground/20 mb-4" />
          <div className="h-5 w-full max-w-lg rounded bg-muted-foreground/20" />
        </div>
      </section>

      {/* 2. STATS BAR SKELETON */}
      <div className="border-b border-border bg-[#fcf9f2]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-6 animate-pulse">
            <div className="h-5 w-32 rounded bg-muted-foreground/20" />
            <div className="h-5 w-32 rounded bg-muted-foreground/20 hidden sm:block" />
            <div className="h-5 w-40 rounded bg-muted-foreground/20 hidden md:block" />
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT (Loading Grid) */}
      <main className="flex-1 pb-20">
        <SavedArticlesSkeleton />
      </main>
    </div>
  );
}