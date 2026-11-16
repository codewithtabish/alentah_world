
// src/app/sitemap.ts

import type { MetadataRoute } from "next";
import { connection } from "next/server";
import prisma from "@/lib/clients/prisma-client";

const SITE_URL = "https://www.eneena.com";

function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Ensure the database-backed sitemap is generated at request time.
  // This works with Next.js Cache Components.
  await connection();

  // ==========================================================
  // 1. FETCH ACTIVE LANGUAGES
  // ==========================================================

  const languages = await prisma.language.findMany({
    where: {
      isActive: true,
    },
    select: {
      code: true,
    },
    orderBy: {
      code: "asc",
    },
  });

  const activeLanguageCodes = new Set(
    languages.map((language) => language.code)
  );

  // ==========================================================
  // 2. FETCH ACTIVE CATEGORIES
  // ==========================================================

  const categories = await prisma.category.findMany({
    where: {
      isActive: true,
      language: {
        isActive: true,
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

  const validCategories = categories.filter((category) =>
    activeLanguageCodes.has(category.language.code)
  );

  // ==========================================================
  // 3. FETCH ACTIVE SUBCATEGORIES
  // ==========================================================

  const subcategories = await prisma.subcategory.findMany({
    where: {
      isActive: true,
      category: {
        isActive: true,
        language: {
          isActive: true,
        },
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

  const validSubcategories = subcategories.filter((subcategory) =>
    activeLanguageCodes.has(subcategory.category.language.code)
  );

  // ==========================================================
  // 4. FETCH PUBLISHED ARTICLES
  // ==========================================================

  const articles = await prisma.blog.findMany({
    where: {
      status: "PUBLISHED",
      language: {
        isActive: true,
      },
      category: {
        isActive: true,
        language: {
          isActive: true,
        },
      },
      subcategory: {
        isActive: true,
      },
    },
    select: {
      slug: true,
      publishedAt: true,
      updatedAt: true,

      language: {
        select: {
          code: true,
        },
      },

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

      subcategory: {
        select: {
          slug: true,
        },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
  });

  // Prevent accidentally generating a URL using mismatched
  // language and category relationships.
  const validArticles = articles.filter(
    (article) =>
      activeLanguageCodes.has(article.language.code) &&
      article.category.language.code === article.language.code
  );

  // ==========================================================
  // 5. LANGUAGE HOMEPAGE ALTERNATES
  // ==========================================================

  const languageAlternates: Record<string, string> = {
    "x-default": absoluteUrl("/"),
  };

  for (const language of languages) {
    languageAlternates[language.code] = absoluteUrl(
      `/${language.code}`
    );
  }

  // ==========================================================
  // 6. MAIN ROOT HOMEPAGE
  // ==========================================================

  const rootHomepage: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      changeFrequency: "daily",
      priority: 1,
      alternates: {
        languages: languageAlternates,
      },
    },
  ];

  // ==========================================================
  // 7. ALL LANGUAGE HOMEPAGES
  // ==========================================================

  const languageHomepages: MetadataRoute.Sitemap = languages.map(
    (language) => ({
      url: absoluteUrl(`/${language.code}`),
      changeFrequency: "daily",
      priority: 1,
      alternates: {
        languages: languageAlternates,
      },
    })
  );

  // ==========================================================
  // 8. PUBLIC STATIC PAGES
  // ==========================================================

  // These are root-level public URLs.
  // Keep only paths that actually exist in your application.
  const publicPages = [
    "/about",
    "/contact",
    "/advertise",
    "/write-for-us",
    "/share-your-story",
    "/terms",
    "/privacy-policy",
  ];

  const staticPages: MetadataRoute.Sitemap = publicPages.map(
    (path) => ({
      url: absoluteUrl(path),
      changeFrequency: "monthly",
      priority: 0.6,
    })
  );

  // ==========================================================
  // 9. CATEGORY PAGES
  // ==========================================================

  const categoryPages: MetadataRoute.Sitemap = validCategories.map(
    (category) => ({
      url: absoluteUrl(
        `/${category.language.code}/${category.slug}`
      ),
      changeFrequency: "weekly",
      priority: 0.8,
    })
  );

  // ==========================================================
  // 10. SUBCATEGORY PAGES
  // ==========================================================

  const subcategoryPages: MetadataRoute.Sitemap =
    validSubcategories.map((subcategory) => ({
      url: absoluteUrl(
        `/${subcategory.category.language.code}/${subcategory.category.slug}/${subcategory.slug}`
      ),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  // ==========================================================
  // 11. ARTICLE PAGES
  // ==========================================================

  const articlePages: MetadataRoute.Sitemap = validArticles.map(
    (article) => ({
      url: absoluteUrl(
        `/${article.language.code}/${article.category.slug}/${article.subcategory.slug}/${article.slug}`
      ),

      ...(article.updatedAt || article.publishedAt
        ? {
            lastModified:
              article.updatedAt ?? article.publishedAt ?? undefined,
          }
        : {}),

      changeFrequency: "monthly",
      priority: 0.9,
    })
  );

  // ==========================================================
  // 12. COMPLETE SITEMAP
  // ==========================================================

  return [
    ...rootHomepage,
    ...languageHomepages,
    ...staticPages,
    ...categoryPages,
    ...subcategoryPages,
    ...articlePages,
  ];
}
