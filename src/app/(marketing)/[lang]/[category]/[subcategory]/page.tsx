
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import prisma from "@/lib/clients/prisma-client";

import { getSubcategoryBlogs } from "@/actions/articles/get-subcategory-blogs";

import { SubcategoryClient } from "@/components/site/pages/subcategory/subcategory-client";

// -----------------------------------------------------------------------------
// ENEENA SEO configuration
// -----------------------------------------------------------------------------

const SITE_URL = "https://www.eneena.com";
const SITE_NAME = "ENEENA";

// Subcategories do not have their own cover image.
// Use ENEENA's shared social sharing image.
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-image.jpg`;

const DEFAULT_OG_IMAGE_ALT =
  "ENEENA — Independent Journalism, Global Perspectives";

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

  const result = await getSubcategoryBlogs(
    lang,
    category,
    subcategory,
    1,
  );

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
  const description =
    subcategoryData.description?.trim() || undefined;

  const categoryName = subcategoryData.category.name;

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

      locale:
        LANGUAGE_LOCALES[subcategoryData.language.code] ??
        "en_US",

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

export default async function SubcategoryPage({
  params,
}: PageProps) {
  const { lang, category, subcategory } = await params;

  // The data action already handles caching and cache tags.
  const result = await getSubcategoryBlogs(
    lang,
    category,
    subcategory,
    1,
  );

  if (!result.success) {
    notFound();
  }

  const subcategoryData = result.subcategory;

  const subcategoryName = subcategoryData.name;
  const categoryName = subcategoryData.category.name;

  const description =
    subcategoryData.description?.trim() || undefined;

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

  const serializedStructuredData =
    serializeStructuredData(structuredData);

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
        dir={
          subcategoryData.language.direction === "rtl"
            ? "rtl"
            : "ltr"
        }
        className="w-full min-w-0"
      >
        <SubcategoryClient
          langCode={lang}
          subcategory={subcategoryData}
          blogs={result.blogs}
          totalPages={result.totalPages}
          currentPage={result.currentPage}
        />
      </main>
    </>
  );
}
