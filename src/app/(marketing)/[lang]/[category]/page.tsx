import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import prisma from "@/lib/clients/prisma-client";
import { cn } from "@/lib/utils";

import { getCategoryBlogs } from "@/actions/articles/get-category-blogs";

import { CategoryClient } from "@/components/site/pages/category/category-client";

// Ads (client components; safe to use inside this server component)
import {
  AdSenseUnit,
  AdsterraNativeBanner,
  AdsterraBanner300x250,
  AdsterraSocialBar,
  AdsterraPopunder,
} from "@/components/ads/ads";

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

const SITE_URL = "https://www.eneena.com";
const SITE_NAME = "ENEENA";
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-image.jpg`;

// Paste your AdSense ad unit slot ID here (AdSense > Ads > By ad unit).
// While this is "", no AdSense unit renders.
const ADSENSE_SLOT = "";

const CATEGORY_LOCALES: Record<string, string> = {
  en: "en_US",
  ur: "ur_PK",
  ar: "ar_AR",
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

const HOME_LABELS: Record<string, string> = {
  en: "Home",
  ur: "صفحہ اول",
  ar: "الرئيسية",
  de: "Startseite",
  hi: "होम",
  zh: "首页",
  es: "Inicio",
  fr: "Accueil",
  "pt-BR": "Início",
  ja: "ホーム",
  bn: "হোম",
  id: "Beranda",
};

// -----------------------------------------------------------------------------
// Page props
// -----------------------------------------------------------------------------

type PageProps = {
  params: Promise<{
    lang: string;
    category: string;
  }>;
};

// -----------------------------------------------------------------------------
// Ad slot wrapper
//
// Hides itself completely (label included) while ads are switched off,
// because the ad components render nothing in that case: it only shows once
// it actually contains a <div> or <a> from an ad.
// -----------------------------------------------------------------------------

function AdSlot({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <aside
      aria-label="Advertisement"
      className={cn(
        "hidden min-w-0 flex-col items-center gap-2 has-[div,a]:flex",
        className,
      )}
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Advertisement
      </span>
      {children}
    </aside>
  );
}

// -----------------------------------------------------------------------------
// URL helpers
// -----------------------------------------------------------------------------

function getCanonicalUrl(lang: string, categorySlug: string): string {
  return `${SITE_URL}/${lang}/${categorySlug}`;
}

function getAbsoluteUrl(value: string): string | undefined {
  try {
    const url = new URL(value, SITE_URL);

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return undefined;
    }

    return url.toString();
  } catch {
    return undefined;
  }
}

// The category's own cover image is the primary social image.
function getCategorySocialImage(coverImage: string | null) {
  const imageUrl = coverImage
    ? getAbsoluteUrl(coverImage)
    : undefined;

  return {
    url: imageUrl ?? DEFAULT_OG_IMAGE,
    alt: imageUrl
      ? `${SITE_NAME} category cover image`
      : "ENEENA — Independent Journalism, Global Perspectives",
  };
}

// -----------------------------------------------------------------------------
// Safe JSON-LD serialization
// -----------------------------------------------------------------------------

function serializeStructuredData(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

// -----------------------------------------------------------------------------
// Generate static category routes from Prisma
// -----------------------------------------------------------------------------

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    where: {
      isActive: true,
      language: {
        is: {
          isActive: true,
        },
      },
    },
    select: {
      slug: true,
      language: {
        select: {
          code: true,
        },
      },
    },
  });

  return categories.map((category) => ({
    lang: category.language.code,
    category: category.slug,
  }));
}

// -----------------------------------------------------------------------------
// Dynamic multilingual category metadata
// -----------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, category } = await params;

  const result = await getCategoryBlogs(lang, category, 1);

  if (!result.success) {
    return {
      title: `Category Not Found | ${SITE_NAME}`,
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const categoryData = result.category;

  // Use the real category name and description from the database.
  const categoryName = categoryData.name;
  const description = categoryData.description?.trim() || undefined;

  const title = `${categoryName} | ${SITE_NAME}`;

  const canonicalUrl = getCanonicalUrl(
    categoryData.language.code,
    categoryData.slug,
  );

  // Use this category's own cover image for social sharing.
  const socialImage = getCategorySocialImage(
    categoryData.coverImage,
  );

  // Avoid indexing empty category archives with no published articles.
  const shouldIndex = result.totalCount > 0;

  return {
    title: {
      absolute: title,
    },

    ...(description ? { description } : {}),

    alternates: {
      canonical: canonicalUrl,
    },

    robots: {
      index: shouldIndex,
      follow: true,

      googleBot: {
        index: shouldIndex,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      ...(description ? { description } : {}),
      url: canonicalUrl,
      locale:
        CATEGORY_LOCALES[categoryData.language.code] ?? "en_US",

      images: [
        {
          url: socialImage.url,
          alt: `${categoryName} | ${SITE_NAME}`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      ...(description ? { description } : {}),

      images: [
        {
          url: socialImage.url,
          alt: `${categoryName} | ${SITE_NAME}`,
        },
      ],
    },
  };
}

// -----------------------------------------------------------------------------
// Category page
// -----------------------------------------------------------------------------

export default async function CategoryPage({
  params,
}: PageProps) {
  const { lang, category } = await params;

  const result = await getCategoryBlogs(lang, category, 1);

  if (!result.success) {
    notFound();
  }

  const categoryData = result.category;

  const categoryName = categoryData.name;
  const description = categoryData.description?.trim() || undefined;

  const canonicalUrl = getCanonicalUrl(
    categoryData.language.code,
    categoryData.slug,
  );

  const socialImage = getCategorySocialImage(
    categoryData.coverImage,
  );

  const homeLabel = HOME_LABELS[lang] ?? "Home";

  // ---------------------------------------------------------------------------
  // Published article URLs
  // Actual route structure:
  // /[lang]/[category]/[subcategory]/[slug]
  // ---------------------------------------------------------------------------

  const articleItems = result.blogs.map((blog, index) => {
    const articleUrl =
      `${SITE_URL}/${lang}/` +
      `${blog.category.slug}/` +
      `${blog.subcategory.slug}/` +
      `${blog.slug}`;

    const articleImage = getAbsoluteUrl(blog.bannerImage);

    return {
      "@type": "ListItem",
      position: index + 1,

      item: {
        "@type": "Article",
        "@id": `${articleUrl}#article`,
        url: articleUrl,
        headline: blog.title,

        ...(blog.shortDescription?.trim()
          ? { description: blog.shortDescription.trim() }
          : {}),

        ...(articleImage
          ? { image: articleImage }
          : {}),

        ...(blog.publishedAt
          ? {
              datePublished: blog.publishedAt.toISOString(),
            }
          : {}),
      },
    };
  });

  // ---------------------------------------------------------------------------
  // CollectionPage and BreadcrumbList structured data
  // ---------------------------------------------------------------------------

  const structuredData = {
    "@context": "https://schema.org",

    "@graph": [
      {
        "@type": "CollectionPage",

        "@id": `${canonicalUrl}#webpage`,

        url: canonicalUrl,

        name: titleForStructuredData(categoryName),

        ...(description ? { description } : {}),

        inLanguage: categoryData.language.code,

        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },

        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },

        about: {
          "@type": "Thing",
          name: categoryName,
          ...(description ? { description } : {}),
        },

        primaryImageOfPage: {
          "@type": "ImageObject",
          url: socialImage.url,
        },

        breadcrumb: {
          "@id": `${canonicalUrl}#breadcrumb`,
        },

        ...(result.blogs.length > 0
          ? {
              mainEntity: {
                "@type": "ItemList",

                "@id": `${canonicalUrl}#article-list`,

                name: `${categoryName} Articles`,

                numberOfItems: result.blogs.length,

                itemListOrder:
                  "https://schema.org/ItemListOrderDescending",

                itemListElement: articleItems,
              },
            }
          : {}),
      },

      {
        "@type": "BreadcrumbList",

        "@id": `${canonicalUrl}#breadcrumb`,

        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: homeLabel,
            item: `${SITE_URL}/${lang}`,
          },

          {
            "@type": "ListItem",
            position: 2,
            name: categoryName,
            item: canonicalUrl,
          },
        ],
      },
    ],
  };

  const serializedStructuredData =
    serializeStructuredData(structuredData);

  // ---------------------------------------------------------------------------
  // Render category page
  // ---------------------------------------------------------------------------

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializedStructuredData,
        }}
      />

      <main
        lang={categoryData.language.code}
        dir={
          categoryData.language.direction === "rtl"
            ? "rtl"
            : "ltr"
        }
        className="w-full min-w-0"
      >
        <CategoryClient
          langCode={lang}
          category={categoryData}
          blogs={result.blogs}
          totalPages={result.totalPages}
          currentPage={result.currentPage}
          totalCount={result.totalCount}
        />

        {/* ADS #1: native 4-tile banner (left) + 300x250 banner (right),
            below the category content. dir="ltr" keeps the same layout for
            RTL languages. On small screens they stack and the 300x250 is
            centered. The whole row stays hidden until an ad renders.
            The native banner is used only once on this page (its container
            id must not repeat); the 300x250 lives in its own iframe. */}
        <div
          dir="ltr"
          className="mx-auto mt-16 hidden w-full min-w-0 max-w-[1600px] flex-col items-stretch gap-8 has-[div,a]:flex sm:mt-24 lg:flex-row lg:items-start lg:justify-between lg:gap-10"
        >
          <AdSlot className="w-full min-w-0 lg:flex-1">
            <AdsterraNativeBanner className="w-full" />
          </AdSlot>
          <AdSlot className="w-full lg:w-75 lg:shrink-0">
            <AdsterraBanner300x250 className="flex w-full justify-center" />
          </AdSlot>
        </div>

        {/* ADS #2: second 300x250, centered. Safe to repeat because it
            lives in its own iframe. */}
        <AdSlot className="mx-auto mt-16 w-full max-w-[1600px]">
          <AdsterraBanner300x250 className="flex w-full justify-center" />
        </AdSlot>

        {/* ADS #3: AdSense display unit. Only renders once ADSENSE_SLOT is
            filled in. */}
        {ADSENSE_SLOT && (
          <AdSlot className="mx-auto mt-20 w-full max-w-[1600px]">
            <AdSenseUnit slot={ADSENSE_SLOT} className="w-full" />
          </AdSlot>
        )}

        {/* ADS #4: site-wide scripts. They render nothing visible and stay
            off until switched on in components/ads/ads.tsx
            (adsterraSocialBar / adsterraPopunder).
            If you also render them in app/layout.tsx or another page that
            is on screen at the same time, keep them in only one place so
            they do not load twice. */}
        <AdsterraSocialBar />
        <AdsterraPopunder />
      </main>
    </>
  );
}

// -----------------------------------------------------------------------------
// Structured-data title helper
// -----------------------------------------------------------------------------

function titleForStructuredData(categoryName: string): string {
  return `${categoryName} | ${SITE_NAME}`;
}