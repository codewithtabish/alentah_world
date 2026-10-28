import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";
import { Clock, Calendar } from "lucide-react";
import { getArticleBySlug } from "@/actions/articles/get-article-by-slug";
import { CACHE_TAGS } from "@/lib/cache-keys";
import { ArticlePreviewer } from "@/components/site/admin/articles/article-previewer";
import { BannerImage } from "@/components/site/pages/home/banner-image";

type PageParams = {
  params: Promise<{
    lang: string;
    category: string;
    subcategory: string;
    slug: string;
  }>;
};

// ------------------------------------------------------------
// SEO METADATA (reads the cached data, no extra DB query)
// ------------------------------------------------------------
export async function generateMetadata({ params }: PageParams) {
  const { lang, category, subcategory, slug } = await params;
  const result = await getArticleBySlug(lang, category, subcategory, slug);

  if (!result.success) {
    return { title: "Article Not Found | Alentah World" };
  }

  const { article } = result;
  const title = article.seo?.metaTitle || article.title;
  const description =
    article.seo?.metaDescription || article.shortDescription || "";
  const ogImage = article.seo?.ogImage || article.bannerImage;
  const images = ogImage ? [ogImage] : [];

  return {
    title,
    description,
    alternates: {
      canonical:
        article.seo?.canonicalUrl ||
        `/${lang}/${category}/${subcategory}/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      images,
      publishedTime: article.publishedAt
        ? new Date(article.publishedAt).toISOString()
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}

// ------------------------------------------------------------
// AVATAR (with initial fallback)
// ------------------------------------------------------------
function Avatar({
  src,
  name,
  className,
  sizes,
}: {
  src?: string | null;
  name: string;
  className: string;
  sizes: string;
}) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full border border-border bg-muted ${className}`}
    >
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

// ------------------------------------------------------------
// MAIN PAGE (whole page cached, one shared copy for every user)
// ------------------------------------------------------------
export default async function ArticlePage({ params }: PageParams) {
  "use cache";
  cacheLife("max");

  const { lang, category, subcategory, slug } = await params;

  // Same tags as get-article-by-slug.ts, so one revalidate clears both
  cacheTag(CACHE_TAGS.blog(slug));
  cacheTag(CACHE_TAGS.blogs);

  const result = await getArticleBySlug(lang, category, subcategory, slug);

  if (!result.success) {
    notFound();
  }

  const article = result.article;
  const isRTL = article.language.direction === "RTL";

  const publishedDate = article.publishedAt
    ? new Intl.DateTimeFormat(
        lang === "ur" ? "ur-PK" : lang === "ar" ? "ar-SA" : "en-US",
        { month: "long", day: "numeric", year: "numeric" },
      ).format(new Date(article.publishedAt))
    : "";

  const authorName =
    article.writtenBy ||
    `${article.author.firstName ?? ""} ${article.author.lastName ?? ""}`.trim() ||
    "Alentah World";
  const authorImage = article.writerImageUrl || article.author.imageUrl;

  return (
    <article
      className="flex flex-col gap-8 pb-20 pt-8"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* BREADCRUMBS */}
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <Link href={`/${lang}`} className="transition-colors hover:text-primary">
          {article.language.name}
        </Link>
        <span>/</span>
        <Link
          href={`/${lang}/${category}`}
          className="transition-colors hover:text-primary"
        >
          {article.category.name}
        </Link>
        <span>/</span>
        <Link
          href={`/${lang}/${category}/${subcategory}`}
          className="transition-colors hover:text-primary"
        >
          {article.subcategory.name}
        </Link>
      </nav>

      {/* 1. HEADER */}
      <header className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div
          className={`flex items-center gap-2 ${
            isRTL ? "justify-end" : "justify-start"
          }`}
        >
          <span
            className={`rounded-sm bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground ${
              isRTL ? "font-urdu-text" : ""
            }`}
          >
            {article.category.name}
          </span>
        </div>

        <h1
          className={`font-serif text-3xl font-bold leading-[1.15] text-foreground sm:text-5xl lg:text-6xl ${
            isRTL ? "font-urdu-display leading-[1.4]" : ""
          }`}
        >
          {article.title}
        </h1>

        {article.shortDescription && (
          <p
            className={`text-lg leading-relaxed text-muted-foreground sm:text-xl ${
              isRTL ? "font-urdu-text leading-[2.2]" : ""
            }`}
          >
            {article.shortDescription}
          </p>
        )}

        {/* Author and metadata */}
        <div
          className={`flex flex-wrap items-center gap-4 border-y border-border py-4 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <div
            className={`flex items-center gap-3 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <Avatar
              src={authorImage}
              name={authorName}
              className="size-10"
              sizes="40px"
            />
            <div
              className={`flex flex-col ${
                isRTL ? "items-end" : "items-start"
              }`}
            >
              <span
                className={`text-sm font-bold text-foreground ${
                  isRTL ? "font-urdu-text" : ""
                }`}
              >
                {authorName}
              </span>
              <span className="text-xs text-muted-foreground">Contributor</span>
            </div>
          </div>

          <div
            className={`flex items-center gap-4 text-xs font-medium text-muted-foreground sm:ml-auto ${
              isRTL ? "sm:ml-0 sm:mr-auto" : ""
            }`}
          >
            {publishedDate && (
              <span
                className={`flex items-center gap-1.5 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <Calendar className="size-4" /> {publishedDate}
              </span>
            )}
            {article.readingTime ? (
              <span
                className={`flex items-center gap-1.5 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <Clock className="size-4" /> {article.readingTime} min read
              </span>
            ) : null}
          </div>
        </div>
      </header>

      {/* 2. BANNER (fast, with fallback) */}
      <figure className="mx-auto w-full max-w-6xl">
        <BannerImage
          src={article.bannerImage}
          alt={article.bannerImageAlt || article.title}
        />
        {article.bannerImageAlt && article.bannerImage && (
          <figcaption className="mt-3 text-center text-xs text-muted-foreground">
            {article.bannerImageAlt}
          </figcaption>
        )}
      </figure>

      {/* 3. CONTENT */}
      <div className="mx-auto mt-4 w-full max-w-3xl">
        <ArticlePreviewer
          content={article.content}
          language={article.language.code as "en" | "ur" | "ar"}
          tableOfContents={article.tableOfContents || []}
        />
      </div>

      {/* 4. AUTHOR BIO */}
      {article.author.bio && (
        <footer className="mx-auto mt-12 flex w-full max-w-3xl flex-col items-start gap-5 rounded-2xl border border-border bg-muted/30 p-6 sm:flex-row sm:p-8">
          <Avatar
            src={authorImage}
            name={authorName}
            className="size-16 border-2 border-background shadow-sm"
            sizes="64px"
          />
          <div
            className={`flex flex-col gap-1 ${
              isRTL ? "text-right font-urdu-text" : ""
            }`}
          >
            <span className="mb-1 text-[10px] font-bold uppercase tracking-widest text-primary">
              About the Author
            </span>
            <h3 className="font-serif text-lg font-bold text-foreground">
              {authorName}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {article.author.bio}
            </p>
          </div>
        </footer>
      )}
    </article>
  );
}