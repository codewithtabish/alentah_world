// src/components/site/pages/category/category-client.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft, ChevronDown, ArrowRight, Globe, MapPin, Briefcase } from "lucide-react";
import type { CategoryPageBlog, CategoryPageData } from "@/actions/articles/get-category-blogs";
import { Breadcrumbs } from "../shared/breadcrumbs";

// Shape of the category editor (add the same type to your get-category-blogs action)
export type CategoryEditor = {
  name: string;
  role?: string | null;
  bio?: string | null;
  imageUrl?: string | null;
  location?: string | null;
  experienceYears?: number | null;
  website?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  facebook?: string | null;
  instagram?: string | null;
};

interface CategoryClientProps {
  langCode: string;
  category: CategoryPageData & { editor?: CategoryEditor | null };
  blogs: CategoryPageBlog[];
  totalPages: number;
  currentPage: number;
  totalCount?: number;
}

const LABELS = {
  en: {
    home: "Home",
    total: "Total articles",
    allSub: "All subcategories",
    all: "All",
    readMore: "Read full article",
    latest: "Latest Stories",
    empty: "No articles in this category yet.",
    prev: "Previous page",
    next: "Next page",
    years: (n: number) => `${n} years experience`,
  },
  ur: {
    home: "صفحہ اول",
    total: "کل مضامین",
    allSub: "تمام ذیلی زمرے",
    all: "تمام",
    readMore: "مکمل مضمون پڑھیں",
    latest: "تازہ ترین مضامین",
    empty: "اس زمرے میں ابھی کوئی مضمون نہیں ہے۔",
    prev: "پچھلا صفحہ",
    next: "اگلا صفحہ",
    years: (n: number) => `${n} سالہ تجربہ`,
  },
  ar: {
    home: "الرئيسية",
    total: "إجمالي المقالات",
    allSub: "جميع الأقسام الفرعية",
    all: "الكل",
    readMore: "اقرأ المقال كاملاً",
    latest: "أحدث المقالات",
    empty: "لا توجد مقالات في هذا القسم بعد.",
    prev: "الصفحة السابقة",
    next: "الصفحة التالية",
    years: (n: number) => `${n} سنوات خبرة`,
  },
} as const;

// ───── Social icons (inline so no lucide brand-icon version issues) ─────
const XIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const LinkedInIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const FacebookIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);
const InstagramIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

function Avatar({ src, name, className, sizes }: { src?: string | null; name: string; className: string; sizes: string }) {
  return (
    <div className={cn("relative shrink-0 overflow-hidden rounded-full border border-border bg-muted", className)}>
      {src ? (
        <Image src={src} alt={name} fill sizes={sizes} className="object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-sm font-bold text-muted-foreground">
          {name.trim().charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}

function getPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...set].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push("…");
    out.push(p);
    prev = p;
  }
  return out;
}

export function CategoryClient({ langCode, category, blogs, totalPages, currentPage, totalCount }: CategoryClientProps) {
  const isRTL = category.language.direction === "RTL";
  const fontClass = isRTL ? "font-urdu-text" : "font-sans";
  const titleFont = isRTL ? "font-urdu-display" : "font-serif";
  const t = LABELS[(langCode as keyof typeof LABELS) in LABELS ? (langCode as keyof typeof LABELS) : "en"];

  // ───── Anti-clipping helpers (Urdu/Arabic have tall ascenders + deep descenders) ─────
  const lhXL = isRTL ? "leading-[2]" : "leading-[1.2]";
  const lhTitle = isRTL ? "leading-[2.05]" : "leading-snug";
  const lhBody = isRTL ? "leading-[2.3]" : "leading-relaxed";
  const lhMeta = isRTL ? "leading-[2.2]" : "leading-normal";
  const pad = isRTL ? "py-1.5" : "";
  const clamp2 = isRTL ? "" : "line-clamp-2";
  const clamp3 = isRTL ? "" : "line-clamp-3";

  const editor = category.editor ?? null;
  const total = totalCount ?? blogs.length;

  const locale = langCode === "ur" ? "ur-PK" : langCode === "ar" ? "ar-SA" : "en-US";
  const dateFmt = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  const fmtDate = (b: CategoryPageBlog) => (b.publishedAt ? dateFmt.format(new Date(b.publishedAt)) : "");

  const href = (b: CategoryPageBlog) => `/${langCode}/${category.slug}/${b.subcategory.slug}/${b.slug}`;
  const authorName = (b: CategoryPageBlog) => b.writtenBy || `${b.author.firstName ?? ""} ${b.author.lastName ?? ""}`.trim();
  const authorImg = (b: CategoryPageBlog) => b.writerImageUrl || b.author.imageUrl || null;

  const base = `/${langCode}/${category.slug}`;
  const pageHref = (n: number) => (n === 1 ? base : `${base}?page=${n}`);

  // Page 1: first story is featured. Other pages: grid only.
  const isFirstPage = currentPage === 1;
  const heroBlog = isFirstPage ? blogs[0] : null;
  const gridBlogs = isFirstPage ? blogs.slice(1) : blogs;

  const breadcrumbItems = [{ label: t.home, href: `/${langCode}` }, { label: category.name }];

  const socials = editor
    ? [
        { url: editor.website, label: "Website", Icon: Globe },
        { url: editor.twitter, label: "X", Icon: XIcon },
        { url: editor.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
        { url: editor.facebook, label: "Facebook", Icon: FacebookIcon },
        { url: editor.instagram, label: "Instagram", Icon: InstagramIcon },
      ].filter((s) => !!s.url)
    : [];

  // Subcategory dropdown (native <details>, no state needed)
  const subMenu =
    category.subcategories.length > 0 ? (
      <details className="group rounded-md border border-border bg-background text-start">
        <summary
          className={cn(
            "flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-2 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden",
            lhMeta,
            fontClass
          )}
        >
          <span>{t.allSub}</span>
          <ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180" />
        </summary>
        <div className="flex flex-wrap gap-2 border-t border-border p-4">
          <Link
            href={base}
            className={cn(
              "whitespace-nowrap rounded-full bg-primary px-4 py-1 text-sm font-bold text-primary-foreground",
              lhMeta,
              fontClass
            )}
          >
            {t.all}
          </Link>
          {category.subcategories.map((sub) => (
            <Link
              key={sub.id}
              href={`${base}/${sub.slug}`}
              className={cn(
                "whitespace-nowrap rounded-full border border-border bg-muted/50 px-4 py-1 text-sm font-semibold text-foreground transition-colors hover:bg-muted",
                lhMeta,
                fontClass
              )}
            >
              {sub.name}
            </Link>
          ))}
        </div>
      </details>
    ) : null;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col px-4 pb-20 pt-6 sm:px-6 lg:pt-8" dir={isRTL ? "rtl" : "ltr"}>
      {/* ───────── 0. BREADCRUMBS ───────── */}
      <Breadcrumbs items={breadcrumbItems} isRTL={isRTL} className="mb-6 lg:mb-8" />

      {/* ───────── 1. HERO BANNER (title never overflows, cover is optional) ───────── */}
      <section className="relative isolate overflow-hidden rounded-2xl border border-border bg-card">
        {category.coverImage && (
          <div className="absolute inset-0 -z-10 lg:w-3/5 lg:ltr:left-auto lg:ltr:right-0 lg:rtl:right-auto lg:rtl:left-0">
            <Image
              src={category.coverImage}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-card/85 lg:bg-transparent lg:bg-linear-to-r lg:from-card lg:via-card/60 lg:to-transparent lg:rtl:bg-linear-to-l" />
          </div>
        )}

        <div className="relative flex flex-col items-start gap-4 px-6 py-10 sm:px-10 sm:py-14 lg:max-w-[58%] lg:px-14 lg:py-16">
          <h1
            className={cn(
              "w-full text-balance wrap-break-word py-1 text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl",
              lhXL,
              titleFont
            )}
          >
            {category.name}
          </h1>

          {category.description && (
            <p className={cn("w-full max-w-xl py-1 text-sm text-muted-foreground sm:text-base", lhBody, fontClass)}>
              {category.description}
            </p>
          )}

          <div className={cn("mt-1 flex items-center gap-3 text-sm font-semibold text-foreground", lhMeta, fontClass)}>
            <span aria-hidden className="h-px w-12 bg-border" />
            <span>
              {t.total}: {total}
            </span>
          </div>
        </div>
      </section>

      {/* ───────── 2. EDITOR CARD + SUBCATEGORY DROPDOWN ───────── */}
      {editor ? (
        <section className="mx-auto mt-14 w-full max-w-xl">
          <div className="relative rounded-md border border-border bg-card px-5 pb-6 pt-10 text-center sm:px-8">
            <span
              className={cn(
                "absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-sm border border-border bg-background px-4 py-0.5 text-sm font-semibold text-foreground",
                lhMeta,
                fontClass
              )}
            >
              {category.name}
            </span>

            <Avatar src={editor.imageUrl} name={editor.name} className="mx-auto size-24" sizes="96px" />

            <h2 className={cn("mt-4 text-2xl font-bold text-foreground", pad, lhTitle, titleFont)}>{editor.name}</h2>

            {editor.role && (
              <p className={cn("text-sm font-semibold text-foreground", lhMeta, fontClass)}>{editor.role}</p>
            )}

            {editor.bio && (
              <p className={cn("mt-3 py-1 text-sm text-muted-foreground", lhBody, fontClass)}>{editor.bio}</p>
            )}

            {(editor.location || editor.experienceYears) && (
              <div
                className={cn(
                  "mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-muted-foreground",
                  lhMeta,
                  fontClass
                )}
              >
                {editor.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3.5" /> {editor.location}
                  </span>
                )}
                {editor.location && editor.experienceYears ? <span aria-hidden className="h-3 w-px bg-border" /> : null}
                {editor.experienceYears ? (
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="size-3.5" /> {t.years(editor.experienceYears)}
                  </span>
                ) : null}
              </div>
            )}

            {socials.length > 0 && (
              <div className="mt-4 flex items-center justify-center gap-5 text-foreground">
                {socials.map(({ url, label, Icon }) => (
                  <a
                    key={label}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="transition-colors hover:text-primary"
                  >
                    <Icon className="size-4.5" />
                  </a>
                ))}
              </div>
            )}

            {subMenu && <div className="mt-6">{subMenu}</div>}
          </div>
        </section>
      ) : (
        subMenu && <section className="mx-auto mt-10 w-full max-w-xl">{subMenu}</section>
      )}

      <div className="mt-12 flex flex-col gap-12 border-t border-border pt-12">
        {blogs.length === 0 ? (
          <div className={cn("py-24 text-center text-muted-foreground", lhBody, fontClass)}>{t.empty}</div>
        ) : (
          <>
            {/* ───────── 3. FEATURED STORY (page 1) ───────── */}
            {heroBlog && (
              <article className="group grid grid-cols-1 items-center gap-6 md:grid-cols-2 lg:gap-12">
                <div className="order-2 flex min-w-0 flex-col items-start gap-3 md:order-1">
                  <span
                    className={cn(
                      "rounded-sm bg-muted px-3 py-0.5 text-xs font-bold text-foreground",
                      lhMeta,
                      fontClass
                    )}
                  >
                    {heroBlog.subcategory.name}
                  </span>

                  <Link href={href(heroBlog)} className="w-full">
                    <h2
                      className={cn(
                        "wrap-break-word text-2xl font-bold text-foreground transition-colors hover:text-primary sm:text-3xl lg:text-4xl",
                        pad,
                        lhXL,
                        titleFont
                      )}
                    >
                      {heroBlog.title}
                    </h2>
                  </Link>

                  {heroBlog.shortDescription && (
                    <p className={cn("text-sm text-muted-foreground sm:text-base", pad, clamp3, lhBody, fontClass)}>
                      {heroBlog.shortDescription}
                    </p>
                  )}

                  <div
                    className={cn(
                      "mt-3 flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm text-muted-foreground",
                      lhMeta,
                      fontClass
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar src={authorImg(heroBlog)} name={authorName(heroBlog) || "A"} className="size-9" sizes="36px" />
                      <span className="font-semibold text-foreground">{authorName(heroBlog)}</span>
                      {fmtDate(heroBlog) && (
                        <>
                          <span aria-hidden className="h-4 w-px bg-border" />
                          <span>{fmtDate(heroBlog)}</span>
                        </>
                      )}
                    </div>

                    <Link
                      href={href(heroBlog)}
                      className="flex items-center gap-1.5 font-semibold text-foreground transition-colors hover:text-primary"
                    >
                      {t.readMore} <ArrowRight className="size-4 rtl:rotate-180" />
                    </Link>
                  </div>
                </div>

                <Link
                  href={href(heroBlog)}
                  className="relative order-1 aspect-4/3 w-full overflow-hidden rounded-md border border-border bg-muted md:order-2"
                >
                  <Image
                    src={heroBlog.bannerImage}
                    alt={heroBlog.title}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>
              </article>
            )}

            {/* ───────── 4. LATEST STORIES GRID ───────── */}
            {gridBlogs.length > 0 && (
              <section className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <h2 className={cn("py-1 text-2xl font-bold text-foreground", lhTitle, titleFont)}>{t.latest}</h2>
                  <span aria-hidden className="h-px flex-1 bg-border" />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {gridBlogs.map((blog) => (
                    <article
                      key={blog.id}
                      className="group flex flex-col overflow-hidden rounded-md border border-border bg-card"
                    >
                      <div className="relative">
                        <Link href={href(blog)} className="relative block aspect-16/10 overflow-hidden bg-muted">
                          <Image
                            src={blog.bannerImage}
                            alt={blog.title}
                            fill
                            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </Link>
                        <span
                          className={cn(
                            "absolute -bottom-3.5 inset-e-3 rounded-sm border border-border bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-foreground",
                            lhMeta,
                            fontClass
                          )}
                        >
                          {blog.subcategory.name}
                        </span>
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4 pt-6">
                        <Link href={href(blog)}>
                          <h3
                            className={cn(
                              "wrap-break-word text-lg font-bold text-foreground transition-colors hover:text-primary",
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
                          <p className={cn("text-sm text-muted-foreground", pad, clamp2, lhBody, fontClass)}>
                            {blog.shortDescription}
                          </p>
                        )}

                        <div className={cn("mt-auto flex items-center gap-2.5 pt-3 text-xs text-muted-foreground", fontClass)}>
                          <Avatar src={authorImg(blog)} name={authorName(blog) || "A"} className="size-8" sizes="32px" />
                          <div className={cn("flex min-w-0 flex-col", lhMeta)}>
                            <span className="font-semibold text-foreground">{authorName(blog)}</span>
                            {fmtDate(blog) && <span>{fmtDate(blog)}</span>}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* ───────── 5. PAGINATION (numbered) ───────── */}
        {totalPages > 1 && (
          <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-2">
            {currentPage > 1 && (
              <Link
                href={pageHref(currentPage - 1)}
                aria-label={t.prev}
                className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
              >
                <ChevronLeft className="size-4 rtl:rotate-180" />
              </Link>
            )}

            {getPageNumbers(currentPage, totalPages).map((p, i) =>
              p === "…" ? (
                <span key={`gap-${i}`} className="px-1 text-muted-foreground" aria-hidden>
                  …
                </span>
              ) : p === currentPage ? (
                <span
                  key={p}
                  aria-current="page"
                  className="inline-flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
                >
                  {p}
                </span>
              ) : (
                <Link
                  key={p}
                  href={pageHref(p)}
                  className="inline-flex size-9 items-center justify-center rounded-full text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  {p}
                </Link>
              )
            )}

            {currentPage < totalPages && (
              <Link
                href={pageHref(currentPage + 1)}
                aria-label={t.next}
                className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
              >
                <ChevronRight className="size-4 rtl:rotate-180" />
              </Link>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}