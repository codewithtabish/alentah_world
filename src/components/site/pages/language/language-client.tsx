// src/components/site/pages/language/language-client.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { LanguagePageBlog, LanguagePageCategory } from "@/actions/articles/get-language-blogs";

interface LanguageClientProps {
  langCode: string;
  blogs: LanguagePageBlog[];
  categories: LanguagePageCategory[];
}

export function LanguageClient({ langCode, blogs, categories }: LanguageClientProps) {
  if (!blogs.length) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <h3 className="text-2xl font-bold text-foreground mb-2">No stories yet</h3>
        <p className="text-muted-foreground">No articles have been published in this edition. Check back soon.</p>
      </div>
    );
  }

  const isRTL = langCode === "ur" || langCode === "ar";
  const fontClass = isRTL ? "font-urdu-text" : "font-sans";
  const titleFont = isRTL ? "font-urdu-display" : "font-serif";

  // ───── Anti-clipping helpers ─────
  // Urdu/Nastaliq has very tall ascenders and deep descenders. Clipping happens when:
  //  1) line-height is too small, 2) overflow-hidden/line-clamp crops the box,
  //  3) a scroll container (overflow-x-auto) crops vertically.
  // So: big line-height + vertical padding everywhere, and NO line-clamp for RTL.
  const lhXL = isRTL ? "leading-[2]" : "leading-[1.3]";
  const lhTitle = isRTL ? "leading-[2.1]" : "leading-[1.4]";
  const lhBody = isRTL ? "leading-[2.3]" : "leading-relaxed";
  const lhMeta = isRTL ? "leading-[2.2]" : "leading-normal";
  const pad = isRTL ? "py-1.5" : "";
  const clamp2 = isRTL ? "" : "line-clamp-2";
  const labelCase = isRTL ? "" : "uppercase tracking-wider";

  const href = (b: LanguagePageBlog) =>
    `/${langCode}/${b.category.slug}/${b.subcategory.slug}/${b.slug}`;

  // Layout data split
  const heroBlog = blogs[0];
  const topGridBlogs = blogs.slice(1, 4);
  const sidebarBlogs = blogs.slice(4, 8);
  const bottomGridBlogs = blogs.slice(8, 18);

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
          {isRTL ? "صفحہ اول" : "Home"}
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

      {/* MAIN MAGAZINE LAYOUT (12 Columns) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* SIDEBAR: Latest Stories List */}
        <aside className="lg:col-span-3 order-2 lg:order-1 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className={cn("text-xl font-bold text-foreground", pad, lhTitle, titleFont)}>
              {isRTL ? "تازہ ترین مضامین" : "Latest Stories"}
            </h2>
          </div>
          <div className="flex flex-col gap-6">
            {sidebarBlogs.map((blog) => (
              <article key={blog.id} className="group flex items-start gap-4">

                {/* Thumbnail */}
                <Link
                  href={href(blog)}
                  className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-md border border-border bg-muted"
                >
                  <Image
                    src={blog.bannerImage}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>

                {/* Text */}
                <div className="flex min-w-0 flex-col pt-0.5">
                  <span className={cn("text-[11px] font-bold text-primary", lhMeta, fontClass)}>
                    {blog.category.name}
                  </span>
                  <Link href={href(blog)}>
                    <h3
                      className={cn(
                        "text-[14px] font-bold text-foreground transition-colors group-hover:text-primary",
                        pad,
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

        {/* MAIN CONTENT (Col span 9) */}
        <div className="lg:col-span-9 order-1 lg:order-2 flex flex-col gap-8">

          {/* HERO BLOG — grows with its text, never crops it */}
          {heroBlog && (
            <div className="group relative flex min-h-80 overflow-hidden rounded-xl border border-border bg-muted shadow-sm sm:min-h-100 lg:min-h-105">
              <Link href={href(heroBlog)} className="absolute inset-0 z-20" aria-label={heroBlog.title} />
              <Image
                src={heroBlog.bannerImage}
                alt={heroBlog.title}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/55 to-black/10" />

              <div className="relative z-10 flex w-full flex-col justify-end gap-2 p-6 pt-28 sm:p-10 sm:pt-32">
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
                    "text-3xl font-bold text-white sm:text-4xl",
                    pad,
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
          )}

          {/* 3-COLUMN TOP GRID */}
          <div className="grid grid-cols-1 gap-6 border-b border-border pb-8 md:grid-cols-3">
            {topGridBlogs.map((blog) => (
              <article key={blog.id} className="group flex flex-col gap-3">
                <Link
                  href={href(blog)}
                  className="relative aspect-16/10 overflow-hidden rounded-lg border border-border/50 bg-muted"
                >
                  <Image
                    src={blog.bannerImage}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
                <div>
                  <span className={cn("text-[11px] font-bold text-primary", lhMeta, fontClass)}>
                    {blog.category.name}
                  </span>
                  <Link href={href(blog)}>
                    <h3
                      className={cn(
                        "mt-1 text-lg font-bold text-foreground transition-colors hover:text-primary",
                        pad,
                        clamp2,
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
        </div>
      </section>

      {/* BOTTOM GRID SECTION (Full Width) */}
      <section className="mt-4 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className={cn("text-2xl font-bold text-foreground", pad, lhTitle, titleFont)}>
            {isRTL ? "مزید مضامین" : "More Stories"}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {bottomGridBlogs.map((blog) => (
            <article key={blog.id} className="group flex flex-col gap-3">
              <Link
                href={href(blog)}
                className="relative aspect-4/3 overflow-hidden rounded-md border border-border/50 bg-muted"
              >
                <Image
                  src={blog.bannerImage}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <div>
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
                      "mt-1 text-[13px] font-bold text-foreground transition-colors hover:text-primary",
                      pad,
                      clamp2,
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
    </div>
  );
}