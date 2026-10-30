// src/app/[lang]/[category]/[subcategory]/page.tsx
import * as React from "react";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";
import prisma from "@/lib/clients/prisma-client";
import { CACHE_TAGS } from "@/lib/cache-keys";
import { getSubcategoryBlogs } from "@/actions/articles/get-subcategory-blogs";
import { SubcategoryClient } from "@/components/site/pages/subcategory/subcategory-client";
import { SubcategoryPageSkeleton } from "@/components/site/pages/subcategory/subcategory-skeleton";

type RouteParams = { lang: string; category: string; subcategory: string };

type PageParams = {
  params: Promise<RouteParams>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateStaticParams() {
  const subcategories = await prisma.subcategory.findMany({
    where: { isActive: true, category: { isActive: true } },
    select: {
      slug: true,
      category: {
        select: {
          slug: true,
          language: { select: { code: true } },
        },
      },
    },
  });

  const params = subcategories.map((s) => ({
    lang: s.category.language.code,
    category: s.category.slug,
    subcategory: s.slug,
  }));

  return params.length ? params : [{ lang: "en", category: "_", subcategory: "_" }];
}

export async function generateMetadata({ params }: { params: PageParams["params"] }) {
  const { lang, category, subcategory } = await params;
  const res = await getSubcategoryBlogs(lang, category, subcategory);

  if (!res.success) return { title: "Subcategory Not Found | Alentah World" };

  const title = `${res.subcategory.name} | Alentah World`;
  const description =
    res.subcategory.description || `Read the latest articles in ${res.subcategory.name}.`;

  return {
    title,
    description,
    alternates: { canonical: `/${lang}/${category}/${subcategory}` },
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

// ─────────────────────────────────────────────────────────────
// CACHED: one cache entry per (lang, category, subcategory, page).
// Revalidate with the same tags your action already uses.
// ─────────────────────────────────────────────────────────────
async function CachedSubcategoryPage({
  lang,
  category,
  subcategory,
  page,
}: {
  lang: string;
  category: string;
  subcategory: string;
  page: number;
}) {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAGS.subcategoryPageBlogs(subcategory));
  cacheTag(CACHE_TAGS.subcategoryPage(`${subcategory}:${page}`));

  const res = await getSubcategoryBlogs(lang, category, subcategory, page);

  if (!res.success) notFound();
  // Page number past the last page -> 404
  if (page > 1 && res.blogs.length === 0) notFound();

  return (
    <SubcategoryClient
      langCode={lang}
      subcategory={res.subcategory}
      blogs={res.blogs}
      totalPages={res.totalPages}
      currentPage={res.currentPage}
    />
  );
}

// Reads ?page= (runtime data) inside Suspense so the rest stays static/cached.
async function SubcategoryContent({ params, searchParams }: PageParams) {
  const [{ lang, category, subcategory }, sp] = await Promise.all([params, searchParams]);
  const page = Math.max(1, Number.parseInt(sp?.page ?? "1", 10) || 1);

  return (
    <CachedSubcategoryPage
      lang={lang}
      category={category}
      subcategory={subcategory}
      page={page}
    />
  );
}

export default function SubcategoryPage({ params, searchParams }: PageParams) {
  return (
    <Suspense fallback={<SubcategoryPageSkeleton />}>
      <SubcategoryContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}