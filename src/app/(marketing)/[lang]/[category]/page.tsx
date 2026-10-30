// src/app/[lang]/[category]/page.tsx
import * as React from "react";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";
import prisma from "@/lib/clients/prisma-client";
import { CACHE_TAGS } from "@/lib/cache-keys";
import { getCategoryBlogs } from "@/actions/articles/get-category-blogs";
import { CategoryClient } from "@/components/site/pages/category/category-client";
import { CategoryPageSkeleton } from "@/components/site/pages/category/category-skeleton";

// 👇 FIXED: Use the exact type signature Next.js 16 expects for Props
type PageProps = {
  params: Promise<{ lang: string; category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: {
      slug: true,
      language: { select: { code: true } },
    },
  });

  const params = categories.map((c) => ({
    lang: c.language.code,
    category: c.slug,
  }));

  return params.length ? params : [{ lang: "en", category: "_" }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; category: string }> }) {
  const { lang, category } = await params;
  const res = await getCategoryBlogs(lang, category);

  if (!res.success) return { title: "Category Not Found | Alentah World" };

  const title = `${res.category.name} | Alentah World`;
  const description =
    res.category.description || `Read the latest articles in ${res.category.name}.`;
  const images = res.category.coverImage ? [res.category.coverImage] : [];

  return {
    title,
    description,
    alternates: { canonical: `/${lang}/${category}` },
    openGraph: { title, description, type: "website", images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

async function CachedCategoryPage({
  lang,
  category,
  page,
}: {
  lang: string;
  category: string;
  page: number;
}) {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAGS.category(category));
  cacheTag(CACHE_TAGS.categoryPage(`${category}:${page}`));

  const res = await getCategoryBlogs(lang, category, page);

  if (!res.success) notFound();
  if (page > 1 && res.blogs.length === 0) notFound();

  return (
    <CategoryClient
      langCode={lang}
      category={res.category}
      blogs={res.blogs}
      totalPages={res.totalPages}
      currentPage={res.currentPage}
      totalCount={res.totalCount}
    />
  );
}

async function CategoryContent({ params, searchParams }: PageProps) {
  const [{ lang, category }, sp] = await Promise.all([params, searchParams]);
  // FIXED: Safely parse page number from string | string[] | undefined
  const pageStr = typeof sp?.page === "string" ? sp.page : "1";
  const page = Math.max(1, Number.parseInt(pageStr, 10) || 1);

  return <CachedCategoryPage lang={lang} category={category} page={page} />;
}

// 👇 FIXED: Explicitly type the component props to match Next.js 16 expectations
export default function CategoryPage({ params, searchParams }: PageProps) {
  return (
    <Suspense fallback={<CategoryPageSkeleton />}>
      <CategoryContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}