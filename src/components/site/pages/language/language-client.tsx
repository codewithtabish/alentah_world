// src/components/site/pages/language/language-client.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LanguagePageBlog, LanguagePageCategory } from "@/actions/articles/get-language-blogs";

interface LanguageClientProps {
  langCode: string;
  blogs: LanguagePageBlog[];
  categories: LanguagePageCategory[];
}

// Small UI label dictionary (en / ur / ar)
const LABELS = {
  en: {
    home: "Home",
    latest: "Latest Stories",
    more: "More Stories",
    emptyTitle: "No stories yet",
    emptyText: "No articles have been published in this edition. Check back soon.",
  },
  ur: {
    home: "صفحہ اول",
    latest: "تازہ ترین مضامین",
    more: "مزید مضامین",
    emptyTitle: "ابھی کوئی مضمون نہیں",
    emptyText: "اس ایڈیشن میں ابھی کوئی مضمون شائع نہیں ہوا۔ جلد دوبارہ دیکھیں۔",
  },
  ar: {
    home: "الرئيسية",
    latest: "أحدث المقالات",
    more: "المزيد من المقالات",
    emptyTitle: "لا توجد مقالات بعد",
    emptyText: "لم يتم نشر أي مقالات في هذه النسخة بعد. عد قريباً.",
  },
} as const;

function SectionHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-border pb-3">
      <span aria-hidden className="h-6 w-1 shrink-0 rounded-full bg-primary" />
      <h2 className={cn("font-bold text-foreground", className)}>{children}</h2>
    </div>
  );
}

export function LanguageClient({ langCode, blogs, categories }: LanguageClientProps) {
  const isRTL = langCode === "ur" || langCode === "ar";
  const t = LABELS[(langCode as keyof typeof LABELS) in LABELS ? (langCode as keyof typeof LABELS) : "en"];

  const fontClass = isRTL ? "font-urdu-text" : "font-sans";
  const titleFont = isRTL ? "font-urdu-display" : "font-serif";

  // ───── Anti-clipping helpers (Urdu/Arabic: tall ascenders + deep descenders) ─────
  const lhXL = isRTL ? "leading-[2]" : "leading-[1.25]";
  const lhTitle = isRTL ? "leading-[2.1]" : "leading-[1.4]";
  const lhBody = isRTL ? "leading-[2.3]" : "leading-relaxed";
  const lhMeta = isRTL ? "leading-[2.2]" : "leading-normal";
  const pad = isRTL ? "py-1.5" : "";
  const clamp2 = "line-clamp-2";
  const clamp3 = "line-clamp-3";
  const labelCase = isRTL ? "" : "uppercase tracking-wider";

  if (!blogs.length) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-2 py-32 text-center"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <h3 className={cn("text-2xl font-bold text-foreground", pad, lhTitle, titleFont)}>
          {t.emptyTitle}
        </h3>
        <p className={cn("text-muted-foreground", lhBody, fontClass)}>{t.emptyText}</p>
      </div>
    );
  }

  const href = (b: LanguagePageBlog) =>
    `/${langCode}/${b.category.slug}/${b.subcategory.slug}/${b.slug}`;

  // ───── Dynamic layout split: sections only render when they have articles ─────
  const heroBlog = blogs[0];
  const rest = blogs.slice(1);
  const sidebarBlogs = rest.slice(0, 4);
  const topGridBlogs = rest.slice(4, 7);
  const bottomGridBlogs = rest.slice(7, 17);

  const hasSidebar = sidebarBlogs.length > 0;
  const topCols =
    topGridBlogs.length === 1
      ? "sm:grid-cols-1"
      : topGridBlogs.length === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-3";

  return (
    <div className="flex flex-col gap-10 pb-20 pt-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* CATEGORY NAVIGATION BAR */}
      <nav
        aria-label="Categories"
        className="flex items-end gap-7 overflow-x-auto border-b border-border pt-3 scrollbar-none"
      >
        <Link
          href={`/${langCode}`}
          className={cn(
            "whitespace-nowrap border-b-2 border-primary px-0.5 pb-3 pt-2 text-sm font-bold text-primary",
            lhMeta,
            fontClass
          )}
        >
          {t.home}
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/${langCode}/${cat.slug}`}
            className={cn(
              "whitespace-nowrap border-b-2 border-transparent px-0.5 pb-3 pt-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary",
              lhMeta,
              fontClass
            )}
          >
            {cat.name}
          </Link>
        ))}
      </nav>

      {/* MAIN MAGAZINE LAYOUT */}
      <section className="flex flex-col items-start gap-8 lg:flex-row">
        {/* SIDEBAR: Latest Stories (only when there are stories to show) */}
        {hasSidebar && (
          <aside className="order-2 flex w-full shrink-0 flex-col gap-2 lg:sticky lg:top-24 lg:order-1 lg:w-[30%]">
            <SectionHeading className={cn("text-xl", pad, lhTitle, titleFont)}>
              {t.latest}
            </SectionHeading>

            <div className="flex flex-col">
              {sidebarBlogs.map((blog, i) => (
                <article
                  key={blog.id}
                  className="group flex items-start gap-4 border-b border-border/60 py-5 last:border-b-0"
                >
                  {/* Thumbnail */}
                  <Link
                    href={href(blog)}
                    className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-lg border border-border bg-muted"
                  >
                    <Image
                      src={blog.bannerImage}
                      alt={blog.title}
                      fill
                      sizes="96px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>

                  {/* Text */}
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold tabular-nums text-primary/40">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={cn("text-[11px] font-bold text-primary", lhMeta, fontClass)}>
                        {blog.category.name}
                      </span>
                    </div>
                    <Link href={href(blog)}>
                      <h3
                        className={cn(
                          "wrap-break-word text-[15px] font-bold text-foreground transition-colors group-hover:text-primary",
                          pad,
                          clamp3,
                          lhTitle,
                          titleFont
                        )}
                      >
                        {blog.title}
                      </h3>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        )}

        {/* MAIN CONTENT */}
        <div className="order-1 flex w-full min-w-0 flex-1 flex-col gap-8 lg:order-2">
          {/* HERO BLOG */}
          <div className="group relative flex min-h-80 w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-sm lg:min-h-105">
            <Link href={href(heroBlog)} className="absolute inset-0 z-20" aria-label={heroBlog.title} />
            <Image
              src={heroBlog.bannerImage}
              alt={heroBlog.title}
              fill
              priority
              sizes={hasSidebar ? "(min-width: 1024px) 70vw, 100vw" : "100vw"}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/55 to-transparent" />

            <div className="relative z-10 mt-auto flex w-full flex-col justify-end gap-2 p-6 sm:p-10">
              <span
                className={cn(
                  "mb-1 w-fit rounded-sm bg-primary px-3 py-0.5 text-[11px] font-bold text-primary-foreground shadow-sm",
                  labelCase,
                  lhMeta,
                  fontClass
                )}
              >
                {heroBlog.category.name}
              </span>
              <h1
                className={cn(
                  "wrap-break-word text-3xl font-bold text-white sm:text-4xl lg:text-5xl",
                  pad,
                  clamp3,
                  lhXL,
                  titleFont
                )}
              >
                {heroBlog.title}
              </h1>
              {heroBlog.shortDescription && (
                <p
                  className={cn(
                    "max-w-3xl text-sm text-white/85 sm:text-base",
                    pad,
                    clamp2,
                    lhBody,
                    fontClass
                  )}
                >
                  {heroBlog.shortDescription}
                </p>
              )}
            </div>
          </div>

          {/* TOP GRID */}
          {topGridBlogs.length > 0 && (
            <div className={cn("grid grid-cols-1 gap-6", topCols)}>
              {topGridBlogs.map((blog) => (
                <article key={blog.id} className="group flex min-w-0 flex-col gap-3">
                  <Link
                    href={href(blog)}
                    className="relative aspect-16/10 overflow-hidden rounded-xl border border-border/50 bg-muted"
                  >
                    <Image
                      src={blog.bannerImage}
                      alt={blog.title}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className={cn("text-[11px] font-bold text-primary", lhMeta, fontClass)}>
                      {blog.category.name}
                    </span>
                    <Link href={href(blog)} className="flex items-start gap-1">
                      <h3
                        className={cn(
                          "wrap-break-word text-lg font-bold text-foreground transition-colors group-hover:text-primary",
                          pad,
                          clamp2,
                          lhTitle,
                          titleFont
                        )}
                      >
                        {blog.title}
                      </h3>
                      <ArrowUpRight className="mt-2 size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 rtl:-scale-x-100" />
                    </Link>
                    {blog.shortDescription && (
                      <p
                        className={cn(
                          "wrap-break-word text-sm text-muted-foreground",
                          pad,
                          clamp2,
                          lhBody,
                          fontClass
                        )}
                      >
                        {blog.shortDescription}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* BOTTOM GRID SECTION (Full Width, only when there are stories) */}
      {bottomGridBlogs.length > 0 && (
        <section className="flex flex-col gap-6">
          <SectionHeading className={cn("text-2xl", pad, lhTitle, titleFont)}>
            {t.more}
          </SectionHeading>

          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-5">
            {bottomGridBlogs.map((blog) => (
              <article key={blog.id} className="group flex min-w-0 flex-col gap-3">
                <Link
                  href={href(blog)}
                  className="relative aspect-4/3 overflow-hidden rounded-lg border border-border/50 bg-muted"
                >
                  <Image
                    src={blog.bannerImage}
                    alt={blog.title}
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
                <div className="flex min-w-0 flex-col gap-1">
                  <span
                    className={cn(
                      "text-[10px] font-bold text-primary",
                      labelCase,
                      lhMeta,
                      fontClass
                    )}
                  >
                    {blog.category.name}
                  </span>
                  <Link href={href(blog)}>
                    <h4
                      className={cn(
                        "wrap-break-word text-[13px] font-bold text-foreground transition-colors group-hover:text-primary",
                        pad,
                        clamp3,
                        lhTitle,
                        titleFont
                      )}
                    >
                      {blog.title}
                    </h4>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}