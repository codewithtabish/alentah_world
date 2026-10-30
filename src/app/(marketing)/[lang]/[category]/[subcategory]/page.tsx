// src/app/[lang]/[category]/[subcategory]/page.tsx
import * as React from "react";
import { notFound } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";
import prisma from "@/lib/clients/prisma-client";
import { CACHE_TAGS } from "@/lib/cache-keys";
import { getSubcategoryBlogs } from "@/actions/articles/get-subcategory-blogs";
import { SubcategoryClient } from "@/components/site/pages/subcategory/subcategory-client";

type PageProps = {
  params: Promise<{ lang: string; category: string; subcategory: string }>;
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

export async function generateMetadata({ params }: PageProps) {
  const { lang, category, subcategory } = await params;
  const res = await getSubcategoryBlogs(lang, category, subcategory, 1);

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

export default async function SubcategoryPage({ params }: PageProps) {
  "use cache";
  cacheLife("max");

  const { lang, category, subcategory } = await params;

  cacheTag(CACHE_TAGS.subcategoryPageBlogs(subcategory));
  // Same tag format your action uses: "<slug>:<page>"
  cacheTag(CACHE_TAGS.subcategoryPage(`${subcategory}:1`));

  // Only page 1 is fetched, so the page is fully static and instant.
  const res = await getSubcategoryBlogs(lang, category, subcategory, 1);

  if (!res.success) notFound();

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