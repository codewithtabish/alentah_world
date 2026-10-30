// src/components/site/pages/subcategory/subcategory-client.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft, Clock } from "lucide-react";
import type { SubcategoryPageBlog, SubcategoryPageData } from "@/actions/articles/get-subcategory-blogs";
import { Breadcrumbs } from "../shared/breadcrumbs";

interface SubcategoryClientProps {
  langCode: string;
  subcategory: SubcategoryPageData;
  blogs: SubcategoryPageBlog[];
  totalPages: number;
  currentPage: number;
}

// Small UI label dictionary (en / ur / ar)
const LABELS = {
  en: { home: "Home", minRead: "min read", more: "More Stories", prev: "Prev", next: "Next", empty: "No articles here yet." },
  ur: { home: "صفحہ اول", minRead: "منٹ کا مطالعہ", more: "مزید مضامین", prev: "پچھلا", next: "اگلا", empty: "یہاں ابھی کوئی مضمون نہیں ہے۔" },
  ar: { home: "الرئيسية", minRead: "دقائق للقراءة", more: "المزيد من المقالات", prev: "السابق", next: "التالي", empty: "لا توجد مقالات هنا بعد." },
} as const;

export function SubcategoryClient({ langCode, subcategory, blogs, totalPages, currentPage }: SubcategoryClientProps) {
  const isRTL = subcategory.language.direction === "RTL";
  const fontClass = isRTL ? "font-urdu-text" : "font-sans";
  const titleFont = isRTL ? "font-urdu-display" : "font-serif";
  const t = LABELS[(langCode as keyof typeof LABELS) in LABELS ? (langCode as keyof typeof LABELS) : "en"];

  // ───── Anti-clipping helpers (Urdu/Arabic: tall ascenders + deep descenders) ─────
  // Rules: big line-height, vertical padding, NO line-clamp / uppercase for RTL.
  const lhXL = isRTL ? "leading-[2]" : "leading-[1.2]";
  const lhTitle = isRTL ? "leading-[2.05]" : "leading-snug";
  const lhBody = isRTL ? "leading-[2.3]" : "leading-relaxed";
  const lhMeta = isRTL ? "leading-[2.2]" : "leading-normal";
  const pad = isRTL ? "py-1.5" : "";
  const clamp2 = isRTL ? "" : "line-clamp-2";
  const clamp3 = isRTL ? "" : "line-clamp-3";
  const labelCase = isRTL ? "" : "uppercase tracking-wider";

  const href = (b: SubcategoryPageBlog) =>
    `/${langCode}/${subcategory.category.slug}/${subcategory.slug}/${b.slug}`;
  const authorName = (b: SubcategoryPageBlog) =>
    b.writtenBy || `${b.author.firstName} ${b.author.lastName}`;
  const authorImg = (b: SubcategoryPageBlog) =>
    b.writerImageUrl || b.author.imageUrl || "/placeholder-avatar.jpg";

  // Hero only on first page
  const isFirstPage = currentPage === 1;
  const heroBlog = isFirstPage ? blogs[0] : null;
  const gridBlogs = isFirstPage ? blogs.slice(1) : blogs;

  // Breadcrumb trail: Home > Category > Subcategory
  const breadcrumbItems = [
    { label: t.home, href: `/${langCode}` },
    { label: subcategory.category.name, href: `/${langCode}/${subcategory.category.slug}` },
    { label: subcategory.name },
  ];

  return (
    <div className="flex flex-col pb-20 pt-6 lg:pt-8" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        {/* 0. BREADCRUMBS */}
        <Breadcrumbs items={breadcrumbItems} isRTL={isRTL} className="mb-6 lg:mb-8" />

        {/* 1. HEADER */}
        <header className="mx-auto mb-10 flex w-full max-w-3xl flex-col items-center gap-3 text-center">
          <h1
            className={cn(
              "w-full text-balance wrap-break-word py-1 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl",
              lhXL,
              titleFont
            )}
          >
            {subcategory.name}
          </h1>
          {subcategory.description && (
            <p
              className={cn(
                "w-full max-w-2xl text-balance py-1 text-sm text-muted-foreground sm:text-base",
                lhBody,
                fontClass
              )}
            >
              {subcategory.description}
            </p>
          )}
        </header>

        {blogs.length === 0 && (
          <div className={cn("py-24 text-center text-muted-foreground", lhBody, fontClass)}>
            {t.empty}
          </div>
        )}

        {/* 2. HERO ARTICLE (Only on Page 1) */}
        {heroBlog && (
          <section className="mb-12">
            <Link
              href={href(heroBlog)}
              className="group grid grid-cols-1 items-center gap-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md lg:grid-cols-2 lg:gap-10"
            >
              <div className="relative aspect-video w-full overflow-hidden lg:aspect-auto lg:h-100">
                <Image
                  src={heroBlog.bannerImage}
                  alt={heroBlog.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="flex h-full min-w-0 flex-col justify-center gap-3 p-6 lg:p-10">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={cn(
                      "rounded-full bg-primary/10 px-3 py-0.5 text-xs font-bold text-primary",
                      labelCase,
                      lhMeta,
                      fontClass
                    )}
                  >
                    {subcategory.name}
                  </span>
                  <span
                    className={cn(
                      "flex items-center gap-1.5 text-xs font-medium text-muted-foreground",
                      lhMeta,
                      fontClass
                    )}
                  >
                    <Clock className="size-3.5" /> {heroBlog.readingTime} {t.minRead}
                  </span>
                </div>

                <h2
                  className={cn(
                    "wrap-break-word text-2xl font-bold text-foreground transition-colors group-hover:text-primary sm:text-3xl lg:text-4xl",
                    pad,
                    lhXL,
                    titleFont
                  )}
                >
                  {heroBlog.title}
                </h2>

                {heroBlog.shortDescription && (
                  <p
                    className={cn(
                      "text-sm text-muted-foreground sm:text-base",
                      pad,
                      clamp3,
                      lhBody,
                      fontClass
                    )}
                  >
                    {heroBlog.shortDescription}
                  </p>
                )}

                <div
                  className={cn(
                    "mt-3 flex items-center gap-3 border-t border-border/50 pt-4 text-sm text-muted-foreground",
                    lhMeta,
                    fontClass
                  )}
                >
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-border">
                    <Image src={authorImg(heroBlog)} alt="" fill className="object-cover" />
                  </div>
                  <span className="font-bold text-foreground">{authorName(heroBlog)}</span>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* 3. MAIN GRID */}
        {gridBlogs.length > 0 && (
          <section>
            <div className="mb-8 flex items-center justify-between border-b border-border pb-3">
              <h2 className={cn("py-1 text-2xl font-bold text-foreground", lhTitle, titleFont)}>
                {t.more}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {gridBlogs.map((blog) => (
                <article key={blog.id} className="group flex flex-col gap-4">
                  <Link
                    href={href(blog)}
                    className="relative aspect-16/10 overflow-hidden rounded-xl border border-border bg-muted"
                  >
                    <Image
                      src={blog.bannerImage}
                      alt={blog.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 inset-s-3">
                      <span
                        className={cn(
                          "rounded-sm bg-black/60 px-2.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm",
                          labelCase,
                          lhMeta,
                          fontClass
                        )}
                      >
                        {subcategory.name}
                      </span>
                    </div>
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <Link href={href(blog)}>
                      <h3
                        className={cn(
                          "wrap-break-word text-xl font-bold text-foreground transition-colors hover:text-primary",
                          pad,
                          clamp2,
                          lhTitle,
                          titleFont
                        )}
                      >
                        {blog.title}
                      </h3>
                    </Link>

                    {blog.shortDescription && (
                      <p
                        className={cn(
                          "text-sm text-muted-foreground",
                          pad,
                          clamp2,
                          lhBody,
                          fontClass
                        )}
                      >
                        {blog.shortDescription}
                      </p>
                    )}

                    <div
                      className={cn(
                        "mt-auto flex flex-wrap items-center gap-x-2 pt-3 text-xs text-muted-foreground",
                        lhMeta,
                        fontClass
                      )}
                    >
                      <span className="font-semibold text-foreground">{authorName(blog)}</span>
                      {blog.readingTime ? (
                        <>
                          <span aria-hidden className="h-3 w-px bg-border" />
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" /> {blog.readingTime} {t.minRead}
                          </span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* 4. PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-16">
            {currentPage > 1 && (
              <Link
                href={`/${langCode}/${subcategory.category.slug}/${subcategory.slug}?page=${currentPage - 1}`}
                className={cn(
                  "inline-flex h-10 items-center justify-center gap-1 rounded-full border border-border bg-background px-5 text-sm font-semibold transition-colors hover:bg-muted",
                  fontClass
                )}
              >
                <ChevronLeft className="size-4 rtl:rotate-180" /> {t.prev}
              </Link>
            )}

            <span className={cn("text-sm font-bold text-muted-foreground", lhMeta, fontClass)}>
              {currentPage} / {totalPages}
            </span>

            {currentPage < totalPages && (
              <Link
                href={`/${langCode}/${subcategory.category.slug}/${subcategory.slug}?page=${currentPage + 1}`}
                className={cn(
                  "inline-flex h-10 items-center justify-center gap-1 rounded-full border border-border bg-background px-5 text-sm font-semibold transition-colors hover:bg-muted",
                  fontClass
                )}
              >
                {t.next} <ChevronRight className="size-4 rtl:rotate-180" />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}