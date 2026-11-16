// src/components/site/pages/saved/saved-client.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Bookmark, Search, ArrowRight, Clock, Trash2, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SavedArticleItem } from "@/actions/articles/get-saved-articles";

type SortOption = "recent" | "published" | "oldest" | "newest";

export function SavedClient({ initialBlogs }: { initialBlogs: SavedArticleItem[] }) {
  const [search, setSearch] = React.useState("");
  const [sort, setSort] = React.useState<SortOption>("recent");
  const [blogs, setBlogs] = React.useState(initialBlogs);

  // Filter and Sort logic
  const filteredBlogs = React.useMemo(() => {
    let result = [...blogs];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.category.name.toLowerCase().includes(q) ||
          b.shortDescription?.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      if (sort === "recent") return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
      if (sort === "oldest") return new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime();
      if (sort === "published") {
        const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return bDate - aDate;
      }
      if (sort === "newest") {
        // Assuming "newest" means newest published
        const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return bDate - aDate;
      }
      return 0;
    });

    return result;
  }, [blogs, search, sort]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Filters & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {(
            [
              { id: "recent", label: "Recently Saved", icon: Clock },
              { id: "published", label: "Recently Published", icon: Bookmark },
              { id: "oldest", label: "Oldest Saved", icon: Clock },
              { id: "newest", label: "Newest Published", icon: Bookmark },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSort(tab.id)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors border",
                sort === tab.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-border hover:bg-muted"
              )}
            >
              <tab.icon className="size-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search your saved articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-border bg-background py-2 ps-9 pe-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Grid */}
      {filteredBlogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="inline-flex size-16 items-center justify-center rounded-full bg-muted mb-4">
            <Bookmark className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">No saved articles found</h3>
          <p className="text-muted-foreground max-w-sm">
            {search ? "No articles match your search." : "You haven't saved any articles yet. Explore our latest stories to get started."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <article
              key={blog.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md"
            >
              <Link href={`/${blog.language.code}/${blog.category.slug}/${blog.slug}`} className="relative aspect-video w-full overflow-hidden bg-muted">
                {blog.bannerImage ? (
                  <Image
                    src={blog.bannerImage}
                    alt={blog.bannerImageAlt || blog.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary/5 text-primary/30">
                    <Bookmark className="size-12" />
                  </div>
                )}
                <div className="absolute inset-s-3 top-3 rounded-full bg-background/95 px-2.5 py-1 text-xs font-bold text-foreground shadow-sm backdrop-blur">
                  {blog.category.name}
                </div>
              </Link>

              <div className="flex flex-1 flex-col p-5">
                <Link href={`/${blog.language.code}/${blog.category.slug}/${blog.slug}`}>
                  <h3 className="mb-2 text-lg font-bold leading-tight hover:text-primary transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                </Link>
                {blog.shortDescription && (
                  <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                    {blog.shortDescription}
                  </p>
                )}

                <div className="mt-auto flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <span>
                    By {blog.author.firstName} {blog.author.lastName}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {blog.readingTime || 1} min read
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-4 mt-auto">
                  <Link
                    href={`/${blog.language.code}/${blog.category.slug}/${blog.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                  >
                    Read Article <ArrowRight className="size-4" />
                  </Link>
                  <div className="flex items-center gap-1">
                    <button className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors" title="Share">
                      <Share2 className="size-4" />
                    </button>
                    <button className="p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors" title="Remove">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}