// src/app/[lang]/[category]/[subcategory]/[slug]/page.tsx

import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, Calendar } from "lucide-react";

import prisma from "@/lib/clients/prisma-client";
import { cn } from "@/lib/utils";
import { getArticleBySlug } from "@/actions/articles/get-article-by-slug";

import { ArticlePreviewer } from "@/components/site/admin/articles/article-previewer";
import { BannerImage } from "@/components/site/pages/home/banner-image";
import { Breadcrumbs } from "@/components/site/pages/shared/breadcrumbs";

import { ArticleCommentsSkeleton } from "@/components/site/pages/comments/article-comments-skeleton";
import { ArticleCommentsServer } from "@/components/site/pages/comments/article-comments-server";

import {
  ContinueExploring,
  ContinueExploringSkeleton,
} from "@/components/site/pages/category/continue-exploring";

import { SaveButton } from "@/components/site/pages/category/save-button";
import { ArticleActions } from "@/components/site/pages/category/article-actions";

// Ads (client components; safe to use inside this server component).
// Each ad renders its own "Advertisement" label and takes NO space until a
// real ad has loaded. If no ad arrives, it renders nothing at all.
import {
  AdRow,
  AdSenseUnit,
  AdsterraNativeBanner,
  AdsterraBanner300x250,
  AdsterraBanner160x600,
  AdsterraBannerAuto,
  AdsterraSocialBar,
  AdsterraPopunder,
} from "@/components/ads/ads";

// ============================================================
// TYPES
// ============================================================

type PageParams = {
  params: Promise<{
    lang: string;
    category: string;
    subcategory: string;
    slug: string;
  }>;
};

// ============================================================
// SITE CONFIGURATION
// ============================================================

const SITE_URL = "https://www.eneena.com";
const SITE_NAME = "ENEENA";

const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-image.jpg`;

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const ORGANIZATION_LOGO =
  `${SITE_URL}/images/logos/icon-maroon-1024.png`;

// Paste your AdSense ad unit slot ID here (AdSense > Ads > By ad unit).
// While this is "", no AdSense unit renders.
const ADSENSE_SLOT = "";

// The 160x600 side banner sits on the right of the article text. It
// needs the screen to be at least this wide (px) to leave room for the text.
// (1280px = Tailwind's "xl" breakpoint, used by the side column below.)
const SIDE_RAIL_MIN_WIDTH = 1280;

// ============================================================
// LOCALIZED INTERFACE LABELS
// ============================================================

const LABELS = {
  en: {
    home: "Home",
    contributor: "Contributor",
    minRead: "min read",
    aboutAuthor: "About the Author",
  },
  ur: {
    home: "صفحہ اول",
    contributor: "لکھاری",
    minRead: "منٹ کا مطالعہ",
    aboutAuthor: "مصنف کے بارے میں",
  },
  ar: {
    home: "الرئيسية",
    contributor: "الكاتب",
    minRead: "دقيقة للقراءة",
    aboutAuthor: "عن الكاتب",
  },
  de: {
    home: "Startseite",
    contributor: "Autor",
    minRead: "Min. Lesezeit",
    aboutAuthor: "Über den Autor",
  },
  hi: {
    home: "मुखपृष्ठ",
    contributor: "लेखक",
    minRead: "मिनट पढ़ने का समय",
    aboutAuthor: "लेखक के बारे में",
  },
  zh: {
    home: "首页",
    contributor: "作者",
    minRead: "分钟阅读",
    aboutAuthor: "关于作者",
  },
  es: {
    home: "Inicio",
    contributor: "Colaborador",
    minRead: "min de lectura",
    aboutAuthor: "Sobre el autor",
  },
  fr: {
    home: "Accueil",
    contributor: "Auteur",
    minRead: "min de lecture",
    aboutAuthor: "À propos de l’auteur",
  },
  "pt-BR": {
    home: "Início",
    contributor: "Autor",
    minRead: "min de leitura",
    aboutAuthor: "Sobre o autor",
  },
  ja: {
    home: "ホーム",
    contributor: "執筆者",
    minRead: "分で読めます",
    aboutAuthor: "著者について",
  },
  bn: {
    home: "হোম",
    contributor: "লেখক",
    minRead: "মিনিটে পড়া যাবে",
    aboutAuthor: "লেখক সম্পর্কে",
  },
  id: {
    home: "Beranda",
    contributor: "Kontributor",
    minRead: "menit membaca",
    aboutAuthor: "Tentang Penulis",
  },
} as const;

const LOCALES: Record<string, string> = {
  en: "en_US",
  ur: "ur_PK",
  ar: "ar",
  de: "de_DE",
  hi: "hi_IN",
  zh: "zh_CN",
  es: "es_ES",
  fr: "fr_FR",
  "pt-BR": "pt_BR",
  ja: "ja_JP",
  bn: "bn_BD",
  id: "id_ID",
};

const DATE_LOCALES: Record<string, string> = {
  en: "en-US",
  ur: "ur-PK",
  ar: "ar-SA",
  de: "de-DE",
  hi: "hi-IN",
  zh: "zh-CN",
  es: "es-ES",
  fr: "fr-FR",
  "pt-BR": "pt-BR",
  ja: "ja-JP",
  bn: "bn-BD",
  id: "id-ID",
};

// ============================================================
// HELPERS
// ============================================================

function truncate(text: string, max = 60) {
  const value = text.trim();

  return value.length > max
    ? `${value.slice(0, max).trimEnd()}…`
    : value;
}

function getArticleUrl(
  lang: string,
  category: string,
  subcategory: string,
  slug: string
) {
  return `${SITE_URL}/${lang}/${category}/${subcategory}/${slug}`;
}

function serializeStructuredData(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function getAuthorName(
  writtenBy: string | null,
  firstName: string | null,
  lastName: string | null
) {
  return (
    writtenBy?.trim() ||
    `${firstName ?? ""} ${lastName ?? ""}`.trim() ||
    SITE_NAME
  );
}

// ============================================================
// STATIC PARAMS
// ============================================================

export async function generateStaticParams() {
  const blogs = await prisma.blog.findMany({
    where: {
      status: "PUBLISHED",
    },
    select: {
      slug: true,
      language: {
        select: {
          code: true,
        },
      },
      category: {
        select: {
          slug: true,
        },
      },
      subcategory: {
        select: {
          slug: true,
        },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 100,
  });

  return blogs.map((blog) => ({
    lang: blog.language.code,
    category: blog.category.slug,
    subcategory: blog.subcategory.slug,
    slug: blog.slug,
  }));
}

// ============================================================
// DYNAMIC SEO METADATA
// ============================================================

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { lang, category, subcategory, slug } = await params;

  const result = await getArticleBySlug(
    lang,
    category,
    subcategory,
    slug
  );

  if (!result.success) {
    return {
      title: "Article Not Found | ENEENA",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const { article } = result;
  const seo = article.seo;

  // ----------------------------------------------------------
  // TITLE AND DESCRIPTION
  // ----------------------------------------------------------

  const title =
    seo?.metaTitle?.trim() ||
    article.title;

  const description =
    seo?.metaDescription?.trim() ||
    article.shortDescription?.trim() ||
    undefined;

  // ----------------------------------------------------------
  // CANONICAL URL
  // ----------------------------------------------------------

  const canonicalUrl =
    seo?.canonicalUrl?.trim() ||
    getArticleUrl(lang, category, subcategory, slug);

  // ----------------------------------------------------------
  // OPEN GRAPH
  // ----------------------------------------------------------

  const ogTitle =
    seo?.ogTitle?.trim() ||
    title;

  const ogDescription =
    seo?.ogDescription?.trim() ||
    description;

  const ogImage =
    seo?.ogImage?.trim() ||
    article.bannerImage?.trim() ||
    DEFAULT_OG_IMAGE;

  // ----------------------------------------------------------
  // TWITTER
  // ----------------------------------------------------------

  const twitterTitle =
    seo?.twitterTitle?.trim() ||
    ogTitle;

  const twitterDescription =
    seo?.twitterDescription?.trim() ||
    ogDescription;

  const twitterImage =
    seo?.twitterImage?.trim() ||
    ogImage;

  // ----------------------------------------------------------
  // INDEXING INSTRUCTIONS
  // ----------------------------------------------------------

  const noIndex = seo?.noIndex ?? false;
  const noFollow = seo?.noFollow ?? false;

  const authorName = getAuthorName(
    article.writtenBy,
    article.author.firstName,
    article.author.lastName
  );

  // ----------------------------------------------------------
  // FINAL METADATA
  // ----------------------------------------------------------

  return {
    title,
    description,

    alternates: {
      canonical: canonicalUrl,
    },

    robots: {
      index: !noIndex,
      follow: !noFollow,
      googleBot: {
        index: !noIndex,
        follow: !noFollow,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "article",
      locale: LOCALES[lang] || "en_US",

      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],

      publishedTime: article.publishedAt
        ? article.publishedAt.toISOString()
        : undefined,

      modifiedTime: article.updatedAt
        ? article.updatedAt.toISOString()
        : undefined,

      authors: [authorName],
    },

    twitter: {
      card: "summary_large_image",
      title: twitterTitle,
      description: twitterDescription,

      images: [
        {
          url: twitterImage,
          alt: article.title,
        },
      ],
    },
  };
}

// ============================================================
// AUTHOR AVATAR
// ============================================================

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
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full border border-border bg-muted",
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-sm font-bold text-muted-foreground">
          {name.trim().charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}

// ============================================================
// ARTICLE PAGE
// ============================================================

export default async function ArticlePage({
  params,
}: PageParams) {
  const { lang, category, subcategory, slug } = await params;

  const result = await getArticleBySlug(
    lang,
    category,
    subcategory,
    slug
  );

  if (!result.success) {
    notFound();
  }

  const article = result.article;

  const isRTL =
    article.language.direction?.toUpperCase() === "RTL";

  const t =
    LABELS[lang as keyof typeof LABELS] || LABELS.en;

  const fontClass = isRTL
    ? "font-urdu-text"
    : "font-sans";

  const titleFont = isRTL
    ? "font-urdu-display"
    : "font-serif";

  const lhXL = isRTL
    ? "leading-[2]"
    : "leading-[1.25]";

  const lhBody = isRTL
    ? "leading-[2.3]"
    : "leading-relaxed";

  const lhMeta = isRTL
    ? "leading-[2.2]"
    : "leading-normal";

  const pad = isRTL ? "py-1.5" : "";

  const labelCase = isRTL
    ? ""
    : "uppercase tracking-widest";

  // ----------------------------------------------------------
  // PUBLICATION DATE
  // ----------------------------------------------------------

  const dateLocale =
    DATE_LOCALES[lang] || "en-US";

  const publishedDate = article.publishedAt
    ? new Intl.DateTimeFormat(dateLocale, {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(article.publishedAt)
    : "";

  // ----------------------------------------------------------
  // AUTHOR
  // ----------------------------------------------------------

  const authorName = getAuthorName(
    article.writtenBy,
    article.author.firstName,
    article.author.lastName
  );

  const authorImage =
    article.writerImageUrl ||
    article.author.imageUrl;

  // ----------------------------------------------------------
  // BREADCRUMBS
  // ----------------------------------------------------------

  const breadcrumbItems = [
    {
      label: t.home,
      href: `/${lang}`,
    },
    {
      label: article.category.name,
      href: `/${lang}/${article.category.slug}`,
    },
    {
      label: article.subcategory.name,
      href: `/${lang}/${article.category.slug}/${article.subcategory.slug}`,
    },
    {
      label: truncate(article.title),
    },
  ];

  // ----------------------------------------------------------
  // ARTICLE URL
  // ----------------------------------------------------------

  const articleUrl =
    article.seo?.canonicalUrl?.trim() ||
    getArticleUrl(
      lang,
      article.category.slug,
      article.subcategory.slug,
      article.slug
    );

  // ----------------------------------------------------------
  // JSON-LD STRUCTURED DATA
  // ----------------------------------------------------------

  const schemaType =
    article.seo?.schemaType === "NewsArticle"
      ? "NewsArticle"
      : "Article";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": schemaType,

    "@id": `${articleUrl}#article`,

    url: articleUrl,

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },

    headline: article.title,

    description:
      article.shortDescription ||
      article.seo?.metaDescription ||
      undefined,

    image: article.bannerImage
      ? [article.bannerImage]
      : undefined,

    datePublished: article.publishedAt
      ? article.publishedAt.toISOString()
      : undefined,

    dateModified: (
      article.updatedAt ||
      article.publishedAt
    )?.toISOString(),

    inLanguage: article.language.code,

    articleSection: article.category.name,

    author: {
      "@type": "Person",
      name: authorName,
    },

    publisher: {
      "@id": ORGANIZATION_ID,
    },

    isPartOf: {
      "@id": WEBSITE_ID,
    },
  };

  const initialIsSaved = false;

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------

  return (
    <article
      lang={article.language.code}
      dir={isRTL ? "rtl" : "ltr"}
      className="flex flex-col gap-8 pb-20 pt-8"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeStructuredData(jsonLd),
        }}
      />

      <Breadcrumbs
        items={breadcrumbItems}
        isRTL={isRTL}
      />

      {/* ARTICLE HEADER */}

      <header className="flex w-full flex-col gap-6">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-sm bg-primary px-3 py-0.5 text-xs font-bold text-primary-foreground",
              labelCase,
              lhMeta,
              fontClass
            )}
          >
            {article.category.name}
          </span>
        </div>

        <h1
          className={cn(
            "w-full wrap-break-word text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl",
            pad,
            lhXL,
            titleFont
          )}
        >
          {article.title}
        </h1>

        {article.shortDescription && (
          <p
            style={{ hyphens: "none", WebkitHyphens: "none" }}
            className={cn(
              "w-full py-1 text-base text-muted-foreground sm:text-lg",
              lhBody,
              fontClass
            )}
          >
            {article.shortDescription}
          </p>
        )}

        {/* AUTHOR, PUBLICATION DETAILS AND ACTIONS */}

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
                  fontClass
                )}
              >
                {authorName}
              </span>

              <span
                className={cn(
                  "text-xs text-muted-foreground",
                  lhMeta,
                  fontClass
                )}
              >
                {t.contributor}
              </span>
            </div>
          </div>

          <div
            className={cn(
              "flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-muted-foreground",
              lhMeta,
              fontClass
            )}
          >
            {publishedDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4" />
                {publishedDate}
              </span>
            )}

            {article.readingTime ? (
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" />
                {article.readingTime} {t.minRead}
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-2 sm:ms-auto">
            <ArticleActions
              title={article.title}
              url={articleUrl}
            />

            <SaveButton
              blogId={article.id}
              blogSlug={article.slug}
              initialIsSaved={initialIsSaved}
            />
          </div>
        </div>
      </header>

      {/* ARTICLE BANNER */}

      <figure className="w-full">
        <BannerImage
          src={article.bannerImage}
          alt={
            article.bannerImageAlt ||
            article.title
          }
        />

        {article.bannerImageAlt &&
          article.bannerImage && (
            <figcaption
              className={cn(
                "mt-3 py-1 text-center text-xs text-muted-foreground",
                lhMeta,
                fontClass
              )}
            >
              {article.bannerImageAlt}
            </figcaption>
          )}
      </figure>

      {/* ADS #1: full-width banner between the banner image and the
          article text. Seen by every reader before they start reading.
          728x90 on tablet and desktop, 300x250 on phones (never both).
          Takes no space (and adds no gap) until the ad has really loaded. */}
      <AdsterraBannerAuto className="w-full" />

      {/* ARTICLE CONTENT
          Full width. From 1280px up, a 160x600 side banner (ADS #2) sits
          on the right of the text. Its column takes NO width (and no gap)
          until that ad has really loaded; if no ad arrives, the text keeps
          the full width. When the ad arrives, the column opens and the text
          narrows by the width of the ad. The ad sticks to the top of the
          screen while the reader scrolls. dir="ltr" keeps the banner on
          the right for RTL languages too; the text column itself still
          follows the article language. */}
      <div dir="ltr" className="mt-4 flex w-full min-w-0">
        <div dir={isRTL ? "rtl" : "ltr"} className="min-w-0 flex-1">
          {/* showAds turns on the in-article ads (between paragraphs). */}
          <ArticlePreviewer
            content={article.content}
            language={
              article.language.code as "en" | "ur" | "ar"
            }
            tableOfContents={
              article.tableOfContents || []
            }
            showAds
          />
        </div>

        <div className="w-0 shrink-0 xl:has-[aside[data-ad-ready]]:ms-8 xl:has-[aside[data-ad-ready]]:w-40">
          <div className="sticky top-24">
            <AdsterraBanner160x600 minWidth={SIDE_RAIL_MIN_WIDTH} />
          </div>
        </div>
      </div>

      {/* ADS #3: native 4-tile banner (left) + 300x250 banner (right),
          right after the article ends. dir="ltr" keeps the same layout for
          RTL languages. The 300x250 only appears from 1024px up, so phones
          and tablets get the native banner alone.
          AdRow keeps the whole row off the page (no space, no gap) until at
          least one of its ads has really loaded. */}
      <AdRow
        dir="ltr"
        className="flex w-full min-w-0 flex-col items-stretch gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-10"
      >
        <AdsterraNativeBanner className="w-full min-w-0 lg:flex-1" />
        <AdsterraBanner300x250
          minWidth={1024}
          className="w-full lg:w-75 lg:shrink-0"
        />
      </AdRow>

      {/* AUTHOR BIO */}

      {article.author.bio && (
        <footer className="mt-12 flex w-full flex-col items-start gap-5 rounded-2xl border border-border bg-muted/30 p-6 sm:flex-row sm:p-8">
          <Avatar
            src={authorImage}
            name={authorName}
            className="size-16 border-2 border-background shadow-sm"
            sizes="64px"
          />

          <div
            className={cn(
              "flex min-w-0 flex-col gap-1 text-start",
              fontClass
            )}
          >
            <span
              className={cn(
                "mb-1 text-xs font-bold text-primary",
                labelCase,
                lhMeta
              )}
            >
              {t.aboutAuthor}
            </span>

            <h3
              className={cn(
                "text-lg font-bold text-foreground",
                pad,
                isRTL
                  ? "leading-loose font-urdu-display"
                  : "font-serif"
              )}
            >
              {authorName}
            </h3>

            <p
              className={cn(
                "mt-1 py-1 text-sm text-muted-foreground",
                lhBody
              )}
            >
              {article.author.bio}
            </p>
          </div>
        </footer>
      )}

      {/* ADS #4: AdSense display unit, after the author bio. Only renders
          once ADSENSE_SLOT is filled in and AdSense is switched on in
          components/ads/ads.tsx.
          Off the page (no space, no gap) until AdSense reports the unit as
          filled; stays off the page when AdSense has no ad. */}
      {ADSENSE_SLOT && (
        <div className="pointer-events-none fixed left-0 top-0 flex w-full flex-col items-center gap-2 opacity-0 has-[ins[data-ad-status=filled]]:pointer-events-auto has-[ins[data-ad-status=filled]]:static has-[ins[data-ad-status=filled]]:opacity-100">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Advertisement
          </span>
          <AdSenseUnit slot={ADSENSE_SLOT} className="w-full" />
        </div>
      )}

      {/* COMMENTS */}

      <div className="mt-8 w-full">
        <Suspense
          fallback={<ArticleCommentsSkeleton />}
        >
          <ArticleCommentsServer
            blogId={article.id}
            blogSlug={article.slug}
          />
        </Suspense>
      </div>

      {/* ADS #5: full-width banner after the comments, before "Continue
          Exploring". A last chance for readers who keep scrolling. Takes no
          space until the ad has really loaded. */}
      <AdsterraBannerAuto className="w-full" />

      {/* CONTINUE EXPLORING */}

      <Suspense
        fallback={<ContinueExploringSkeleton />}
      >
        <ContinueExploring
          currentArticleId={article.id}
          languageCode={lang}
          categorySlug={category}
          subcategorySlug={subcategory}
        />
      </Suspense>

      {/* ADS #6: site-wide scripts. They render nothing visible and stay
          off until switched on in components/ads/ads.tsx
          (adsterraSocialBar / adsterraPopunder).
          Keep them in only one place (this page or app/layout.tsx) so
          they do not load twice. */}
      <AdsterraSocialBar />
      <AdsterraPopunder />
    </article>
  );
}