// src/app/[lang]/[category]/[subcategory]/page.tsx

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import prisma from "@/lib/clients/prisma-client";

import { getSubcategoryBlogs } from "@/actions/articles/get-subcategory-blogs";

import { SubcategoryClient } from "@/components/site/pages/subcategory/subcategory-client";

// Ads (client components; safe to use inside this server component).
// Each ad renders its own "Advertisement" label and takes NO space until a
// real ad has loaded. If no ad arrives, it renders nothing at all.
import {
  AdSenseUnit,
  AdsterraNativeBanner,
  AdsterraBanner300x250,
  AdsterraBannerAuto,
  AdsterraSocialBar,
  AdsterraPopunder,
} from "@/components/ads/ads";

// -----------------------------------------------------------------------------
// ENEENA SEO configuration
// -----------------------------------------------------------------------------

const SITE_URL = "https://www.eneena.com";
const SITE_NAME = "ENEENA";

// Subcategories do not have their own cover image.
// Use ENEENA's shared social sharing image.
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-image.jpg`;

// Paste your AdSense ad unit slot ID here (AdSense > Ads > By ad unit).
// While this is "", no AdSense unit renders.
const ADSENSE_SLOT = "";

const LANGUAGE_LOCALES: Record<string, string> = {
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

// -----------------------------------------------------------------------------
// Localized breadcrumb labels
// -----------------------------------------------------------------------------

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
    subcategory: string;
  }>;
};

// -----------------------------------------------------------------------------
// URL helpers
// -----------------------------------------------------------------------------

function getCanonicalUrl(
  lang: string,
  categorySlug: string,
  subcategorySlug: string,
): string {
  return `${SITE_URL}/${lang}/${categorySlug}/${subcategorySlug}`;
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
// Generate static subcategory routes from Prisma
// -----------------------------------------------------------------------------

export async function generateStaticParams() {
  const subcategories = await prisma.subcategory.findMany({
    where: {
      isActive: true,
      category: {
        isActive: true,
      },
    },

    select: {
      slug: true,

      category: {
        select: {
          slug: true,

          language: {
            select: {
              code: true,
            },
          },
        },
      },
    },
  });

  return subcategories.map((subcategory) => ({
    lang: subcategory.category.language.code,
    category: subcategory.category.slug,
    subcategory: subcategory.slug,
  }));
}

// -----------------------------------------------------------------------------
// Dynamic multilingual subcategory SEO metadata
// -----------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, category, subcategory } = await params;

  const result = await getSubcategoryBlogs(lang, category, subcategory, 1);

  if (!result.success) {
    return {
      title: `Subcategory Not Found | ${SITE_NAME}`,

      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const subcategoryData = result.subcategory;

  // Use the real subcategory name and description from Prisma.
  const subcategoryName = subcategoryData.name;
  const description = subcategoryData.description?.trim() || undefined;

  const title = `${subcategoryName} | ${SITE_NAME}`;

  const canonicalUrl = getCanonicalUrl(
    subcategoryData.language.code,
    subcategoryData.category.slug,
    subcategoryData.slug,
  );

  // No subcategory-specific image exists.
  // Use the shared ENEENA OG image.
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

      locale: LANGUAGE_LOCALES[subcategoryData.language.code] ?? "en_US",

      images: [
        {
          url: DEFAULT_OG_IMAGE,
          alt: `${subcategoryName} | ${SITE_NAME}`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",

      title,

      ...(description ? { description } : {}),

      images: [
        {
          url: DEFAULT_OG_IMAGE,
          alt: `${subcategoryName} | ${SITE_NAME}`,
        },
      ],
    },
  };
}

// -----------------------------------------------------------------------------
// Subcategory page
// -----------------------------------------------------------------------------

export default async function SubcategoryPage({ params }: PageProps) {
  const { lang, category, subcategory } = await params;

  // The data action already handles caching and cache tags.
  const result = await getSubcategoryBlogs(lang, category, subcategory, 1);

  if (!result.success) {
    notFound();
  }

  const subcategoryData = result.subcategory;

  const subcategoryName = subcategoryData.name;
  const categoryName = subcategoryData.category.name;

  const description = subcategoryData.description?.trim() || undefined;

  const canonicalUrl = getCanonicalUrl(
    subcategoryData.language.code,
    subcategoryData.category.slug,
    subcategoryData.slug,
  );

  const homeLabel = HOME_LABELS[lang] ?? "Home";

  // ---------------------------------------------------------------------------
  // Published article URLs
  //
  // ENEENA article route:
  // /[lang]/[category]/[subcategory]/[slug]
  // ---------------------------------------------------------------------------

  const articleItems = result.blogs.map((blog, index) => {
    const articleUrl =
      `${SITE_URL}/${lang}/` +
      `${blog.category.slug}/` +
      `${blog.subcategory.slug}/` +
      `${blog.slug}`;

    return {
      "@type": "ListItem",

      position: index + 1,

      item: {
        "@type": "Article",

        "@id": `${articleUrl}#article`,

        url: articleUrl,

        headline: blog.title,

        ...(blog.shortDescription?.trim()
          ? {
              description: blog.shortDescription.trim(),
            }
          : {}),

        ...(blog.bannerImage
          ? {
              image: blog.bannerImage,
            }
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
  // CollectionPage + BreadcrumbList structured data
  // ---------------------------------------------------------------------------

  const structuredData = {
    "@context": "https://schema.org",

    "@graph": [
      {
        "@type": "CollectionPage",

        "@id": `${canonicalUrl}#webpage`,

        url: canonicalUrl,

        name: `${subcategoryName} | ${SITE_NAME}`,

        ...(description ? { description } : {}),

        inLanguage: subcategoryData.language.code,

        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },

        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },

        about: {
          "@type": "Thing",

          name: subcategoryName,

          ...(description ? { description } : {}),
        },

        primaryImageOfPage: {
          "@type": "ImageObject",

          url: DEFAULT_OG_IMAGE,
        },

        breadcrumb: {
          "@id": `${canonicalUrl}#breadcrumb`,
        },

        ...(result.blogs.length > 0
          ? {
              mainEntity: {
                "@type": "ItemList",

                "@id": `${canonicalUrl}#article-list`,

                name: `${subcategoryName} Articles`,

                numberOfItems: result.blogs.length,

                itemListOrder: "https://schema.org/ItemListOrderDescending",

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

            item: `${SITE_URL}/${lang}/${subcategoryData.category.slug}`,
          },

          {
            "@type": "ListItem",

            position: 3,

            name: subcategoryName,

            item: canonicalUrl,
          },
        ],
      },
    ],
  };

  const serializedStructuredData = serializeStructuredData(structuredData);

  // ---------------------------------------------------------------------------
  // Render subcategory page
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
        lang={subcategoryData.language.code}
        dir={subcategoryData.language.direction === "rtl" ? "rtl" : "ltr"}
        className="w-full min-w-0"
      >
        {/* The page content itself also contains ads (a responsive banner
            after the featured story and a native banner in the middle of
            the story grid): see subcategory-client.tsx. */}
        <SubcategoryClient
          langCode={lang}
          subcategory={subcategoryData}
          blogs={result.blogs}
          totalPages={result.totalPages}
          currentPage={result.currentPage}
        />

        {/* ADS #1: native 4-tile banner (left) + 300x250 banner (right),
            below the subcategory content. dir="ltr" keeps the same layout
            for RTL languages. The 300x250 only appears from 1024px up, so
            phones and tablets get the native banner alone.
            The row (and its top margin) stays hidden until at least one ad
            has REALLY loaded: a loaded ad is an <aside data-ad-ready>.
            While ads are loading, or when none arrives, this row takes no
            space. */}
        <div
          dir="ltr"
          className="mx-auto mt-16 hidden w-full min-w-0 max-w-[1600px] flex-col items-stretch gap-8 has-[aside[data-ad-ready]]:flex sm:mt-24 lg:flex-row lg:items-start lg:justify-between lg:gap-10"
        >
          <AdsterraNativeBanner className="w-full min-w-0 lg:flex-1" />
          <AdsterraBanner300x250
            minWidth={1024}
            className="w-full lg:w-75 lg:shrink-0"
          />
        </div>

        {/* ADS #2: full-width banner. 728x90 on tablet and desktop, 300x250
            on phones (never both). Takes no space (including its top
            margin) until the ad has loaded. */}
        <AdsterraBannerAuto className="mx-auto mt-16 w-full max-w-[1600px] sm:mt-20" />

        {/* ADS #3: AdSense display unit. Only renders once ADSENSE_SLOT is
            filled in and AdSense is switched on in components/ads/ads.tsx.
            Collapsed (no height, no margin) until AdSense reports the unit
            as filled; stays collapsed when AdSense has no ad. */}
        {ADSENSE_SLOT && (
          <div className="mx-auto mt-0 flex max-h-0 w-full max-w-[1600px] flex-col items-center gap-2 overflow-hidden has-[ins[data-ad-status=filled]]:mt-16 has-[ins[data-ad-status=filled]]:max-h-none has-[ins[data-ad-status=filled]]:overflow-visible sm:has-[ins[data-ad-status=filled]]:mt-20">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Advertisement
            </span>
            <AdSenseUnit slot={ADSENSE_SLOT} className="w-full" />
          </div>
        )}

        {/* ADS #4: site-wide scripts. They render nothing visible and stay
            off until switched on in components/ads/ads.tsx
            (adsterraSocialBar / adsterraPopunder).
            Keep them in only one place (this page or app/layout.tsx) so
            they do not load twice. */}
        <AdsterraSocialBar />
        <AdsterraPopunder />
      </main>
    </>
  );
}