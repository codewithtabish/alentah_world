import * as React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";
import { Clock, Calendar } from "lucide-react";
import prisma from "@/lib/clients/prisma-client";
import { cn } from "@/lib/utils";
import { getArticleBySlug } from "@/actions/articles/get-article-by-slug";
import { CACHE_TAGS } from "@/lib/cache-keys";
import { ArticlePreviewer } from "@/components/site/admin/articles/article-previewer";
import { BannerImage } from "@/components/site/pages/home/banner-image";

// Comments imports
import { Suspense } from "react";
import { ArticleCommentsSkeleton } from "@/components/site/pages/comments/article-comments-skeleton";
import { ArticleCommentsServer } from "@/components/site/pages/comments/article-comments-server";
import { Breadcrumbs } from "@/components/site/pages/shared/breadcrumbs";

type PageParams = {
  params: Promise<{
    lang: string;
    category: string;
    subcategory: string;
    slug: string;
  }>;
};

// Small UI label dictionary (en / ur / ar)
const LABELS = {
  en: { home: "Home", contributor: "Contributor", minRead: "min read", aboutAuthor: "About the Author" },
  ur: { home: "صفحہ اول", contributor: "لکھاری", minRead: "منٹ کا مطالعہ", aboutAuthor: "مصنف کے بارے میں" },
  ar: { home: "الرئيسية", contributor: "كاتب", minRead: "دقائق للقراءة", aboutAuthor: "عن الكاتب" },
} as const;

function truncate(text: string, max = 60) {
  const t = text.trim();
  return t.length > max ? `${t.slice(0, max).trimEnd()}…` : t;
}

export async function generateStaticParams() {
  const blogs = await prisma.blog.findMany({
    where: { status: "PUBLISHED" },
    select: {
      slug: true,
      language: { select: { code: true } },
      category: { select: { slug: true } },
      subcategory: { select: { slug: true } },
    },
    orderBy: { publishedAt: "desc" },
    take: 100,
  });

  const params = blogs.map((b) => ({
    lang: b.language.code,
    category: b.category.slug,
    subcategory: b.subcategory.slug,
    slug: b.slug,
  }));

  return params.length
    ? params
    : [{ lang: "en", category: "_", subcategory: "_", slug: "_" }];
}

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

export default async function ArticlePage({ params }: PageParams) {
  "use cache";
  cacheLife("max");

  const { lang, category, subcategory, slug } = await params;

  cacheTag(CACHE_TAGS.blog(slug));

  const result = await getArticleBySlug(lang, category, subcategory, slug);

  if (!result.success) {
    notFound();
  }

  const article = result.article;
  const isRTL = article.language.direction === "RTL";
  const t = LABELS[(lang as keyof typeof LABELS) in LABELS ? (lang as keyof typeof LABELS) : "en"];

  // ───── Anti-clipping helpers (Urdu/Arabic: tall ascenders + deep descenders) ─────
  // NOTE: dir="rtl" already flips flex rows, so NO flex-row-reverse / justify-end hacks.
  const fontClass = isRTL ? "font-urdu-text" : "font-sans";
  const titleFont = isRTL ? "font-urdu-display" : "font-serif";
  const lhXL = isRTL ? "leading-[2]" : "leading-[1.15]";
  const lhBody = isRTL ? "leading-[2.3]" : "leading-relaxed";
  const lhMeta = isRTL ? "leading-[2.2]" : "leading-normal";
  const pad = isRTL ? "py-1.5" : "";
  const labelCase = isRTL ? "" : "uppercase tracking-widest";

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

  const breadcrumbItems = [
    { label: t.home, href: `/${lang}` },
    { label: article.category.name, href: `/${lang}/${category}` },
    { label: article.subcategory.name, href: `/${lang}/${category}/${subcategory}` },
    { label: truncate(article.title) },
  ];

  return (
    <article
      className="flex flex-col gap-8 pb-20 pt-8"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* BREADCRUMBS */}
      <Breadcrumbs items={breadcrumbItems} isRTL={isRTL} />

      {/* 1. HEADER */}
      <header className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-sm bg-primary px-3 py-0.5 text-xs font-bold text-primary-foreground",
              labelCase,
              lhMeta,
              fontClass,
            )}
          >
            {article.category.name}
          </span>
        </div>

        <h1
          className={cn(
            "wrap-break-word text-3xl font-bold text-foreground sm:text-5xl lg:text-6xl",
            pad,
            lhXL,
            titleFont,
          )}
        >
          {article.title}
        </h1>

        {article.shortDescription && (
          <p
            className={cn(
              "py-1 text-lg text-muted-foreground sm:text-xl",
              lhBody,
              fontClass,
            )}
          >
            {article.shortDescription}
          </p>
        )}

        {/* Author and metadata */}
        <div className="flex flex-wrap items-center gap-4 border-y border-border py-4">
          <div className="flex items-center gap-3">
            <Avatar
              src={authorImage}
              name={authorName}
              className="size-10"
              sizes="40px"
            />
            <div className="flex flex-col items-start">
              <span
                className={cn(
                  "text-sm font-bold text-foreground",
                  lhMeta,
                  fontClass,
                )}
              >
                {authorName}
              </span>
              <span
                className={cn("text-xs text-muted-foreground", lhMeta, fontClass)}
              >
                {t.contributor}
              </span>
            </div>
          </div>

          <div
            className={cn(
              "flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-muted-foreground sm:ms-auto",
              lhMeta,
              fontClass,
            )}
          >
            {publishedDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4" /> {publishedDate}
              </span>
            )}
            {article.readingTime ? (
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" /> {article.readingTime} {t.minRead}
              </span>
            ) : null}
          </div>
        </div>
      </header>

      {/* 2. BANNER */}
      <figure className="mx-auto w-full max-w-6xl">
        <BannerImage
          src={article.bannerImage}
          alt={article.bannerImageAlt || article.title}
        />
        {article.bannerImageAlt && article.bannerImage && (
          <figcaption
            className={cn(
              "mt-3 py-1 text-center text-xs text-muted-foreground",
              lhMeta,
              fontClass,
            )}
          >
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
          <div className={cn("flex min-w-0 flex-col gap-1 text-start", fontClass)}>
            <span
              className={cn(
                "mb-1 text-xs font-bold text-primary",
                labelCase,
                lhMeta,
              )}
            >
              {t.aboutAuthor}
            </span>
            <h3
              className={cn(
                "text-lg font-bold text-foreground",
                pad,
                isRTL ? "leading-loose font-urdu-display" : "font-serif",
              )}
            >
              {authorName}
            </h3>
            <p className={cn("mt-1 py-1 text-sm text-muted-foreground", lhBody)}>
              {article.author.bio}
            </p>
          </div>
        </footer>
      )}

      {/* 5. COMMENTS SECTION (SUSPENSE STREAMED) */}
      <div className="mx-auto mt-8 w-full max-w-3xl">
        <Suspense fallback={<ArticleCommentsSkeleton />}>
          <ArticleCommentsServer
            blogId={article.id}
            blogSlug={article.slug}
          />
        </Suspense>
      </div>
    </article>
  );
}