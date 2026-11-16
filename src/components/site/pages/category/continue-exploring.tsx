// src/components/site/pages/article/continue-exploring.tsx
import Image from "next/image";
import Link from "next/link";
import { Clock, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { getContinueExploringBlogs } from "@/actions/articles/get-continue-exploring";

// 👇 Translations for "Continue Exploring"
const CONTINUE_EXPLORING_LABELS: Record<string, string> = {
  en: "Continue Exploring",
  ur: "مزید پڑھیں",
  ar: "استكشف المزيد",
  de: "Weiterlesen",
  hi: "और पढ़ें",
  zh: "继续探索",
  es: "Seguir explorando",
  fr: "Continuer l'exploration",
  "pt-BR": "Continuar explorando",
  ja: "探索を続ける",
  bn: "আরও পড়ুন",
  id: "Jelajahi Lebih Lanjut",
};

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
  const sectionTitle = CONTINUE_EXPLORING_LABELS[languageCode] || CONTINUE_EXPLORING_LABELS.en;

  // Font classes based on the language
  const titleFontClass = isRTL ? "font-urdu-text" : "font-serif";
  const headingFontClass = isRTL ? "font-urdu-display" : "font-serif";

  return (
    // Note: We DO NOT put dir="rtl" on the whole section so the Title stays on the left
    <section className="mx-auto mt-16 w-full max-w-6xl border-t border-border pt-10">
      <h2 className={cn("mb-8 text-2xl font-bold text-foreground", headingFontClass)}>
        {sectionTitle}
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {result.blogs.map((blog) => {
          const href = `/${languageCode}/${blog.category.slug}/${blog.subcategory.slug}/${blog.slug}`;
          
          const date = blog.publishedAt
            ? new Intl.DateTimeFormat(isRTL ? "ur-PK" : "en-US", { 
                month: "short", 
                day: "numeric", 
                year: "numeric" 
              }).format(new Date(blog.publishedAt))
            : "";

          return (
            <Link 
              key={blog.id} 
              href={href} 
              // We apply dir="rtl" only to the card content so text aligns correctly
              dir={isRTL ? "rtl" : "ltr"}
              className="group flex flex-col gap-3"
            >
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted ring-1 ring-black/5">
                <Image 
                  src={blog.bannerImage} 
                  alt={blog.title} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 20vw" 
                  className="object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute inset-s-2 top-2">
                  <span className={cn(
                    "rounded-sm bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-sm",
                    isRTL && "font-urdu-text tracking-normal"
                  )}>
                    {blog.subcategory.name}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <h3 className={cn(
                  "line-clamp-2 text-[15px] font-bold text-foreground transition-colors group-hover:text-primary", 
                  titleFontClass,
                  isRTL ? "leading-[1.8]" : "leading-snug"
                )}>
                  {blog.title}
                </h3>
                
                <div className={cn(
                  "flex items-center gap-3 text-[12px] text-muted-foreground", 
                  isRTL ? "font-urdu-text leading-loose" : "font-sans"
                )}>
                  {date && (
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="size-3.5" /> {date}
                    </span>
                  )}
                  {blog.readingTime && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-3.5" /> {blog.readingTime} min
                    </span>
                  )}
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
      <div className="mb-8 h-8 w-48 rounded bg-muted" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="aspect-video w-full rounded-lg bg-muted" />
            <div className="h-5 w-full rounded bg-muted" />
            <div className="h-5 w-2/3 rounded bg-muted" />
            <div className="mt-1 h-4 w-1/2 rounded bg-muted" />
          </div>
        ))}
      </div>
    </section>
  );
}