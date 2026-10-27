// src/components/site/home/home-client.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import { HomeBlogItem } from "@/actions/articles/get-home-blogs";

interface HomeClientProps {
  blogs: HomeBlogItem[];
}

function articleHref(blog: HomeBlogItem) {
  return `/${blog.language.code}/${blog.category.slug}/${blog.subcategory.slug}/${blog.slug}`;
}

function AuthorMeta({
  blog,
  compact = false,
}: {
  blog: HomeBlogItem;
  compact?: boolean;
}) {
  const isUrdu = blog.language.code === "ur";
  const isArabic = blog.language.code === "ar";
  const fontClass = isUrdu
    ? "font-urdu-text"
    : isArabic
      ? "font-arabic-text"
      : "";

  const authorImage =
    blog.writerImageUrl ||
    blog.author.imageUrl ||
    "/placeholder-avatar.jpg";
  const authorName =
    blog.writtenBy ||
    `${blog.author.firstName} ${blog.author.lastName}`;

  return (
    <div
      className={`flex min-w-0 items-center gap-2 text-xs text-muted-foreground ${fontClass}`}
      dir={blog.language.direction === "RTL" ? "rtl" : "ltr"}
    >
      <span
        className={`relative block shrink-0 overflow-hidden rounded-full border border-border bg-muted ${
          compact ? "size-6" : "size-8"
        }`}
      >
        <Image
          src={authorImage}
          alt=""
          fill
          sizes={compact ? "24px" : "32px"}
          className="object-cover"
          style={{
            filter: "none",
            boxShadow: "none",
          }}
        />
      </span>

      <span className="min-w-0 truncate font-medium">{authorName}</span>
      <span aria-hidden="true">•</span>
      <span className="inline-flex shrink-0 items-center gap-1">
        <Clock className="size-3.5 shrink-0" aria-hidden="true" />
        {blog.readingTime} {isUrdu ? "منٹ" : isArabic ? "دقائق" : "min read"}
      </span>
    </div>
  );
}

function ArticleImage({
  src,
  alt,
  sizes,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative block w-full overflow-hidden rounded-xl bg-muted ${className}`}
      style={{
        boxShadow: "none",
        filter: "none",
        WebkitFilter: "none",
        transform: "none",
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        style={{
          boxShadow: "none",
          filter: "none",
          WebkitFilter: "none",
          transform: "none",
        }}
      />
    </div>
  );
}

function LanguageLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex w-fit items-center rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider">
      {children}
    </span>
  );
}

export function HomeClient({ blogs }: HomeClientProps) {
  if (!blogs.length) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        No stories published yet. Check back soon.
      </div>
    );
  }

  const englishBlogs = blogs.filter((blog) => blog.language.code === "en");
  const urduBlogs = blogs.filter((blog) => blog.language.code === "ur");
  const arabicBlogs = blogs.filter((blog) => blog.language.code === "ar");

  const heroEnglish = englishBlogs[0];
  const sideBlogs = [...urduBlogs.slice(0, 2), ...arabicBlogs.slice(0, 2)];
  const latestBlogs = blogs.slice(5, 14);

  return (
    <div className="flex min-w-0 flex-col gap-12 overflow-x-clip pb-16 pt-5 sm:gap-16 sm:pb-20 sm:pt-8">
      {/* Featured stories */}
      <section className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {heroEnglish && (
          <article className="min-w-0 lg:col-span-8">
            <Link
              href={articleHref(heroEnglish)}
              aria-label={heroEnglish.title}
              className="block"
            >
              <ArticleImage
                src={heroEnglish.bannerImage}
                alt={heroEnglish.title}
                sizes="(min-width: 1024px) 66vw, 100vw"
                priority
                className="aspect-video rounded-xl"
              />
            </Link>

            <div className="flex min-w-0 flex-col items-start pt-4 sm:pt-5">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <LanguageLabel>
                  <span className="text-primary">
                    {heroEnglish.language.name}
                  </span>
                </LanguageLabel>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {heroEnglish.category.name}
                </span>
              </div>

              <Link href={articleHref(heroEnglish)} className="block">
                <h1 className="mb-2 text-2xl font-bold leading-[1.12] tracking-tight text-foreground sm:text-3xl md:text-4xl xl:text-5xl">
                  {heroEnglish.title}
                </h1>
              </Link>

              <p
                className="mb-4 w-full max-w-2xl line-clamp-2 overflow-hidden text-left text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7"
                style={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  hyphens: "none",
                  overflowWrap: "normal",
                  wordBreak: "normal",
                  textAlign: "left",
                  textAlignLast: "left",
                }}
              >
                {heroEnglish.shortDescription}
              </p>

              <AuthorMeta blog={heroEnglish} />
            </div>
          </article>
        )}

        <div className="flex min-w-0 flex-col gap-7 sm:gap-8 lg:col-span-4">
          {sideBlogs.map((blog) => {
            const isUrdu = blog.language.code === "ur";
            const isArabic = blog.language.code === "ar";
            const fontClass = isUrdu
              ? "font-urdu-text"
              : isArabic
                ? "font-arabic-text"
                : "";
            const titleFont = isUrdu
              ? "font-urdu-display"
              : isArabic
                ? "font-arabic-display"
                : "";

            return (
              <article
                key={blog.id}
                className="flex min-w-0 flex-col gap-3"
                dir={blog.language.direction === "RTL" ? "rtl" : "ltr"}
                lang={blog.language.code}
              >
                <Link
                  href={articleHref(blog)}
                  aria-label={blog.title}
                  className="block"
                >
                  <ArticleImage
                    src={blog.bannerImage}
                    alt={blog.title}
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="aspect-video"
                  />
                </Link>

                <div className="flex flex-col items-start">
                  <span className={`mb-2 text-[11px] font-bold text-primary ${fontClass}`}>
                    {blog.category.name}
                  </span>

                  <Link href={articleHref(blog)} className="block">
                    <h2 className={`mb-2 text-lg font-bold leading-[1.65] text-foreground sm:text-xl sm:leading-[1.8] ${titleFont}`}>
                      {blog.title}
                    </h2>
                  </Link>

                  <AuthorMeta blog={blog} compact />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Latest stories */}
      <section className="flex flex-col gap-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="text-3xl font-bold text-foreground">Latest Stories</h2>

          <Link
            href="/latest"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            View All Stories
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {latestBlogs.map((blog) => {
            const isUrdu = blog.language.code === "ur";
            const isArabic = blog.language.code === "ar";
            const isRTL = blog.language.direction === "RTL";
            const fontClass = isUrdu
              ? "font-urdu-text"
              : isArabic
                ? "font-arabic-text"
                : "font-body";
            const titleFont = isUrdu
              ? "font-urdu-display text-2xl"
              : isArabic
                ? "font-arabic-display text-2xl"
                : "";

            return (
              <article
                key={blog.id}
                dir={isRTL ? "rtl" : "ltr"}
                lang={blog.language.code}
                className="flex min-w-0 flex-col gap-4"
              >
                <Link
                  href={articleHref(blog)}
                  aria-label={blog.title}
                  className="block"
                >
                  <ArticleImage
                    src={blog.bannerImage}
                    alt={blog.title}
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="aspect-16/10"
                  />
                </Link>

                <div className="flex flex-1 flex-col items-start">
                  <span className={`mb-2 text-[11px] font-bold uppercase tracking-wider text-primary ${fontClass}`}>
                    {blog.category.name}
                  </span>

                  <Link href={articleHref(blog)} className="block">
                    <h3 className={`mb-2 text-xl font-bold leading-[1.8] text-foreground ${titleFont}`}>
                      {blog.title}
                    </h3>
                  </Link>

                  <p
                    className={`mb-4 line-clamp-2 text-sm leading-6 text-muted-foreground ${fontClass}`}
                    style={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      hyphens: "none",
                      textAlign: "start",
                      textAlignLast: "start",
                    }}
                  >
                    {blog.shortDescription}
                  </p>

                  <div className="mt-auto">
                    <AuthorMeta blog={blog} compact />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
