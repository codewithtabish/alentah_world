// src/components/site/home/home-client.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { HomeBlogItem } from "@/actions/articles/get-home-blogs";

interface HomeClientProps {
  blogs: HomeBlogItem[];
}

const FALLBACK_AVATAR = "/placeholder-avatar.jpg";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function articleHref(blog: HomeBlogItem) {
  return `/${blog.language.code}/${blog.category.slug}/${blog.subcategory.slug}/${blog.slug}`;
}

function isRtlBlog(blog: HomeBlogItem) {
  return blog.language.direction === "RTL";
}

function getAuthorName(blog: HomeBlogItem) {
  const full = [blog.author.firstName, blog.author.lastName]
    .filter(Boolean)
    .join(" ");
  return blog.writtenBy || full || "The Insider";
}

function getAuthorImage(blog: HomeBlogItem) {
  return blog.writerImageUrl || blog.author.imageUrl || FALLBACK_AVATAR;
}

function getLanguageLabel(blog: HomeBlogItem) {
  if (blog.language.code === "ur") return "اردو";
  if (blog.language.code === "ar") return "العربية";
  return blog.language.name;
}

function getReadingLabel(blog: HomeBlogItem, long = false) {
  if (!blog.readingTime) return null;
  if (blog.language.code === "ur") return `${blog.readingTime} منٹ`;
  if (blog.language.code === "ar") return `${blog.readingTime} دقائق`;
  return long ? `${blog.readingTime} min read` : `${blog.readingTime} min`;
}

// UTC + latin digits => identical output on server and client (no hydration mismatch)
function formatDate(value: Date | string | null, code: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const locale =
    code === "ur"
      ? "ur-PK-u-nu-latn"
      : code === "ar"
        ? "ar-u-nu-latn"
        : "en-US";

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

function LanguageBadge({
  blog,
  small = false,
}: {
  blog: HomeBlogItem;
  small?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded bg-primary font-bold uppercase leading-none tracking-wider text-primary-foreground",
        small
          ? "px-1.5 py-1 text-[9px] sm:px-2 sm:text-[10px]"
          : "px-2 py-1 text-[10px]"
      )}
    >
      {getLanguageLabel(blog)}
    </span>
  );
}

function StoryMeta({
  blog,
  tone = "card",
}: {
  blog: HomeBlogItem;
  tone?: "card" | "overlay";
}) {
  const reading = getReadingLabel(blog, tone === "overlay");
  const date = formatDate(blog.publishedAt, blog.language.code);
  const name = getAuthorName(blog);

  const avatar = (
    <span
      className={cn(
        "relative block shrink-0 overflow-hidden rounded-full border bg-muted",
        tone === "overlay" ? "size-8 border-white/30" : "size-7 border-border"
      )}
    >
      <Image
        src={getAuthorImage(blog)}
        alt=""
        fill
        sizes="32px"
        className="object-cover"
      />
    </span>
  );

  if (tone === "overlay") {
    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/90">
        <span className="flex min-w-0 items-center gap-2">
          {avatar}
          <span className="truncate font-medium">By {name}</span>
        </span>
        {reading && (
          <span className="inline-flex items-center gap-1.5 text-white/80">
            <Clock className="size-3.5" aria-hidden="true" />
            {reading}
          </span>
        )}
        {date && (
          <span className="inline-flex items-center gap-1.5 text-white/80">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            {date}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
      <span className="flex min-w-0 items-center gap-2">
        {avatar}
        <span className="truncate font-medium text-foreground/80">{name}</span>
      </span>

      <span className="flex shrink-0 items-center gap-3">
        {reading && (
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" aria-hidden="true" />
            {reading}
          </span>
        )}
        {date && (
          <span className="hidden items-center gap-1 sm:inline-flex">
            <CalendarDays className="size-3" aria-hidden="true" />
            {date}
          </span>
        )}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Story card                                                          */
/*                                                                     */
/*  variant="grid"  -> full card everywhere (Latest Stories)           */
/*  variant="side"  -> mobile/tablet: image-only tile (2-col grid)     */
/*                     desktop (lg+): full card beside the hero        */
/* ------------------------------------------------------------------ */

function StoryCard({
  blog,
  variant = "grid",
}: {
  blog: HomeBlogItem;
  variant?: "grid" | "side";
}) {
  const rtl = isRtlBlog(blog);
  const href = articleHref(blog);
  const isSide = variant === "side";

  return (
    <article
      dir={rtl ? "rtl" : "ltr"}
      lang={blog.language.code}
      className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors duration-300 hover:border-primary/40"
    >
      {/* Image */}
      <div
        className={cn(
          "relative isolate w-full shrink-0 overflow-hidden bg-muted shadow-none",
          isSide ? "aspect-4/3 sm:aspect-video lg:aspect-16/7" : "aspect-video"
        )}
      >
        <Image
          src={blog.bannerImage}
          alt={blog.title}
          fill
          sizes={
            isSide
              ? "(min-width: 1024px) 33vw, 50vw"
              : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          }
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-s-2 top-2 sm:inset-s-3 sm:top-3">
          <LanguageBadge blog={blog} small={isSide} />
        </div>
      </div>

      {/* Mobile-only full-tile link for side tiles (text is hidden there) */}
      {isSide && (
        <Link
          href={href}
          aria-label={blog.title}
          className="absolute inset-0 z-10 lg:hidden"
        />
      )}

      {/* Body: hidden on mobile/tablet for side tiles */}
      <div
        className={cn(
          "flex-1 flex-col gap-2 p-4 sm:p-5",
          isSide ? "hidden lg:flex" : "flex"
        )}
      >
        <span
          className={cn(
            "text-[11px] font-bold text-primary",
            !rtl && "uppercase tracking-wider"
          )}
        >
          {blog.category.name}
        </span>

        <h3
          className={cn(
            "font-bold text-foreground transition-colors group-hover:text-primary",
            rtl ? "text-xl sm:text-2xl" : "text-lg leading-snug sm:text-xl"
          )}
        >
          {/* Stretched link: the whole card is clickable */}
          <Link href={href} className="after:absolute after:inset-0">
            {blog.title}
          </Link>
        </h3>

        {blog.shortDescription && (
          <div
            className={cn(
              "line-clamp-2 text-sm text-muted-foreground",
              rtl ? "leading-7" : "leading-6"
            )}
          >
            {blog.shortDescription}
          </div>
        )}

        <div className="mt-auto pt-2">
          <StoryMeta blog={blog} />
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

export function HomeClient({ blogs }: HomeClientProps) {
  if (!blogs.length) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        No stories published yet. Check back soon.
      </div>
    );
  }

  // ---- Pick hero + side stories, then everything else is "Latest" ----
  const used = new Set<string>();

  const englishBlogs = blogs.filter((b) => b.language.code === "en");
  const urduBlogs = blogs.filter((b) => b.language.code === "ur");
  const arabicBlogs = blogs.filter((b) => b.language.code === "ar");

  const hero = englishBlogs[0] ?? blogs[0];
  used.add(hero.id);

  const sideBlogs: HomeBlogItem[] = [];
  const pickFrom = (list: HomeBlogItem[]) => {
    const found = list.find((b) => !used.has(b.id));
    if (found) {
      used.add(found.id);
      sideBlogs.push(found);
    }
  };
  pickFrom(urduBlogs);
  pickFrom(arabicBlogs);

  // If one language is missing, fill from whatever is left
  for (const b of blogs) {
    if (sideBlogs.length >= 2) break;
    if (!used.has(b.id)) {
      used.add(b.id);
      sideBlogs.push(b);
    }
  }

  const latestBlogs = blogs.filter((b) => !used.has(b.id)).slice(0, 9);

  const heroHref = articleHref(hero);
  const heroRtl = isRtlBlog(hero);

  return (
    <div className="flex min-w-0 flex-col gap-12 overflow-x-clip pb-16 pt-5 sm:gap-16 sm:pb-20 sm:pt-8">
      {/* ============================================================ */}
      {/* 1. HERO + SIDE STORIES                                       */}
      {/* ============================================================ */}
      <section className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-12 lg:items-stretch">
        {/* Hero (overlay style) */}
        <article
          dir={heroRtl ? "rtl" : "ltr"}
          lang={hero.language.code}
          className="group relative isolate min-h-96 overflow-hidden rounded-2xl border border-border bg-muted shadow-none sm:min-h-128 lg:col-span-8 lg:min-h-136"
        >
          <Image
            src={hero.bannerImage}
            alt={hero.title}
            fill
            priority
            sizes="(min-width: 1024px) 66vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/45 to-black/5" />

          {/* Whole hero is clickable */}
          <Link
            href={heroHref}
            aria-label={hero.title}
            className="absolute inset-0 z-20"
          />

          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end p-5 sm:p-8 lg:p-10">
            <div className="mb-3 flex flex-wrap items-center gap-3 sm:mb-4">
              <LanguageBadge blog={hero} />
              <span className="text-xs font-bold uppercase tracking-wider text-white/80">
                {hero.category.name}
              </span>
            </div>

            <h1 className="mb-3 max-w-3xl text-balance text-2xl font-bold leading-[1.15] tracking-tight text-white sm:text-4xl xl:text-5xl">
              {hero.title}
            </h1>

            {hero.shortDescription && (
              <div className="mb-5 line-clamp-2 max-w-2xl text-left text-sm leading-6 text-white/80 sm:text-base sm:leading-7">
                {hero.shortDescription}
              </div>
            )}

            <StoryMeta blog={hero} tone="overlay" />
          </div>
        </article>

        {/* Side stories:
            mobile/tablet -> 2-column grid of image tiles
            desktop       -> stacked full cards beside the hero */}
        {sideBlogs.length > 0 && (
          <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-5 lg:col-span-4 lg:auto-rows-fr lg:grid-cols-1">
            {sideBlogs.map((blog) => (
              <StoryCard key={blog.id} blog={blog} variant="side" />
            ))}
          </div>
        )}
      </section>

      {/* ============================================================ */}
      {/* 2. LATEST STORIES                                            */}
      {/* ============================================================ */}
      {latestBlogs.length > 0 && (
        <section className="flex flex-col gap-6 sm:gap-8">
          <div className="flex items-center gap-4">
            <h2 className="whitespace-nowrap text-2xl font-bold text-primary sm:text-3xl">
              Latest Stories
            </h2>

            <span
              aria-hidden="true"
              className="hidden h-px flex-1 bg-border sm:block"
            />

            <Link
              href="/latest"
              className="ms-auto inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              View All Stories
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latestBlogs.map((blog) => (
              <StoryCard key={blog.id} blog={blog} variant="grid" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}