
import type { MetadataRoute } from "next";
import { connection } from "next/server";
import prisma from "@/lib/clients/prisma-client";

const SITE_URL = "https://www.eneena.com";

function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Generate the database-backed sitemap at request time.
  await connection();

  // ==========================================================
  // 1. ACTIVE LANGUAGES
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
  // 2. ACTIVE CATEGORIES
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
  // 3. ACTIVE SUBCATEGORIES
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
  // 4. PUBLISHED ARTICLES
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

  // Ensure article and category languages match.
  const validArticles = articles.filter(
    (article) =>
      activeLanguageCodes.has(article.language.code) &&
      article.category.language.code === article.language.code
  );

  // ==========================================================
  // 5. ROOT HOMEPAGE
  // ==========================================================

  const rootHomepage: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  // ==========================================================
  // 6. LANGUAGE HOMEPAGES
  // ==========================================================

  const languageHomepages: MetadataRoute.Sitemap = languages.map(
    (language) => ({
      url: absoluteUrl(`/${language.code}`),
      changeFrequency: "daily",
      priority: 1.0,
    })
  );

  // ==========================================================
  // 7. PUBLIC STATIC PAGES
  // ==========================================================

  const publicPages = [
    "/about",
    "/contact",
    "/advertise",
    "/write-for-us",
    "/share-your-story",
    "/terms",
    "/privacy-policy",
  ];

  const staticPages: MetadataRoute.Sitemap = publicPages.map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // ==========================================================
  // 8. CATEGORY PAGES
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
  // 9. SUBCATEGORY PAGES
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
  // 10. ARTICLE PAGES
  // ==========================================================

  const articlePages: MetadataRoute.Sitemap = validArticles.map(
    (article) => ({
      url: absoluteUrl(
        `/${article.language.code}/${article.category.slug}/${article.subcategory.slug}/${article.slug}`
      ),

      lastModified: article.updatedAt ?? article.publishedAt ?? undefined,

      changeFrequency: "monthly",
      priority: 0.9,
    })
  );

  // ==========================================================
  // 11. COMPLETE ENEENA SITEMAP
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
