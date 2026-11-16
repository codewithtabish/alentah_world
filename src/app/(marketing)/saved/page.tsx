// src/app/[lang]/saved/page.tsx
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Bookmark, Clock } from "lucide-react";
import { getSavedArticles } from "@/actions/articles/get-saved-articles";
import { SavedClient } from "@/components/site/pages/saved/saved-client";
import { SavedArticlesSkeleton } from "@/components/site/pages/saved/saved-articles-skeleton";

// Server Component that fetches the data
async function SavedArticlesData() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in"); // Or handle guest state manually
  }

  const result = await getSavedArticles();

  if (!result.success) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Failed to load saved articles. Please try again later.
      </div>
    );
  }

  // 👇 FIXED: Added `|| []` to guarantee an array is passed even if blogs is somehow undefined
  return <SavedClient initialBlogs={result.blogs || []} />;
}

export default function SavedPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* 1. HERO HEADER */}
      <section className="relative w-full overflow-hidden bg-[#3b0d15] text-white">
        <div className="absolute inset-0 opacity-20">
          {/* Replace with your actual banner image path */}
          <img 
            src="/images/saved/banner-16x9-q80.webp" 
            alt="Bookshelf" 
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#fdfbf7] mb-4">
            My Saved Stories
          </h1>
          <p className="max-w-2xl text-lg text-[#fdfbf7]/80">
            Your personal collection of stories, ideas, and perspectives worth returning to.
          </p>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <div className="border-b border-border bg-[#fcf9f2]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <Bookmark className="size-5 text-primary" />
              <span className="text-primary text-base">12</span> Saved Articles
            </div>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <Bookmark className="size-4" />
              <span className="font-semibold text-foreground">12</span> Available to Read
            </div>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <Clock className="size-4" />
              Last Saved: 2 days ago
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT (SUSPENSE STREAMED) */}
      <main className="flex-1 pb-20">
        <Suspense fallback={<SavedArticlesSkeleton />}>
          <SavedArticlesData />
        </Suspense>
      </main>
    </div>
  );
}