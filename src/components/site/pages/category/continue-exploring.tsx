// src/components/site/pages/article/continue-exploring.tsx
import Image from "next/image";
import Link from "next/link";
import { Clock, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { getContinueExploringBlogs } from "@/actions/articles/get-continue-exploring";

// 👇 1. The Server Component
export async function ContinueExploring({
  currentArticleId,
  languageCode,
  categorySlug,
  subcategorySlug,
}: {
  currentArticleId: string;
  languageCode: string;
  categorySlug: string;
  subcategorySlug: string;
}) {
  const result = await getContinueExploringBlogs(
    currentArticleId,
    languageCode,
    categorySlug,
    subcategorySlug
  );

  if (!result.success || !result.blogs || result.blogs.length === 0) {
    return null;
  }

  const isRTL = languageCode === "ur" || languageCode === "ar";

  return (
    <section className="mx-auto mt-16 w-full max-w-6xl border-t border-border pt-10">
      <h2 className={cn("mb-6 text-2xl font-bold text-foreground", isRTL ? "font-urdu-display" : "font-serif")}>
        Continue Exploring
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {result.blogs.map((blog) => {
          const href = `/${languageCode}/${blog.category.slug}/${blog.subcategory.slug}/${blog.slug}`;
          const date = blog.publishedAt
            ? new Intl.DateTimeFormat(isRTL ? "ur-PK" : "en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(blog.publishedAt))
            : "";

          return (
            <Link key={blog.id} href={href} className="group flex flex-col gap-3">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted ring-1 ring-black/5">
                <Image src={blog.bannerImage} alt={blog.title} fill sizes="(max-width: 768px) 100vw, 20vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-s-2 top-2">
                  <span className="rounded-sm bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">{blog.subcategory.name}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className={cn("line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary", isRTL ? "font-urdu-display leading-[1.8]" : "font-serif")}>{blog.title}</h3>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  {date && <span className="flex items-center gap-1"><CalendarDays className="size-3" /> {date}</span>}
                  {blog.readingTime && <span className="flex items-center gap-1"><Clock className="size-3" /> {blog.readingTime} min</span>}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// 👇 2. The Skeleton Fallback
export function ContinueExploringSkeleton() {
  return (
    <section className="mx-auto mt-16 w-full max-w-6xl border-t border-border pt-10 animate-pulse">
      <div className="mb-6 h-8 w-48 rounded bg-muted" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="aspect-video w-full rounded-lg bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-2/3 rounded bg-muted" />
            <div className="h-3 w-1/2 rounded bg-muted" />
          </div>
        ))}
      </div>
    </section>
  );
}