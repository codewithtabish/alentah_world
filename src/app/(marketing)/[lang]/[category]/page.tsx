// src/app/[lang]/[category]/page.tsx
import * as React from "react";
import { notFound } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";
import prisma from "@/lib/clients/prisma-client";
import { CACHE_TAGS } from "@/lib/cache-keys";
import { getCategoryBlogs } from "@/actions/articles/get-category-blogs";
import { CategoryClient } from "@/components/site/pages/category/category-client";

type PageProps = {
  params: Promise<{ lang: string; category: string }>;
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

export async function generateMetadata({ params }: PageProps) {
  const { lang, category } = await params;
  const res = await getCategoryBlogs(lang, category, 1);

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

export default async function CategoryPage({ params }: PageProps) {
  "use cache";
  cacheLife("max");

  const { lang, category } = await params;

  cacheTag(CACHE_TAGS.category(category));
  cacheTag(CACHE_TAGS.categoryPage(category)); // Cached without page number

  // 👇 We ONLY fetch page 1. This makes the page 100% static and instant.
  const res = await getCategoryBlogs(lang, category, 1);

  if (!res.success) notFound();

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