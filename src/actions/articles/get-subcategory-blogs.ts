// src/actions/articles/get-subcategory-blogs.ts
"use server";

import { cacheTag, cacheLife } from "next/cache";
import prisma from "@/lib/clients/prisma-client";
import { CACHE_TAGS } from "@/lib/cache-keys";

export type SubcategoryPageBlog = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  bannerImage: string;
  publishedAt: Date | null;
  readingTime: number | null;
  writtenBy: string | null;
  writerImageUrl: string | null;
  category: { name: string; slug: string };
  subcategory: { name: string; slug: string };
  author: { firstName: string | null; lastName: string | null; imageUrl: string | null };
};

export type SubcategoryPageData = {
  name: string;
  slug: string;
  description: string | null;
  category: { name: string; slug: string };
  language: { code: string; name: string; direction: string };
};

export type GetSubcategoryBlogsResult = 
  | { success: true; subcategory: SubcategoryPageData; blogs: SubcategoryPageBlog[]; totalCount: number; currentPage: number; totalPages: number }
  | { success: false; error: string };

const PAGE_SIZE = 25; // First 25 shown per page as requested

async function getCachedSubcategoryPage(langCode: string, categorySlug: string, subcategorySlug: string, page: number) {
  "use cache";
  cacheLife("max");
  // Dynamic cache tag for pagination
  cacheTag(CACHE_TAGS.subcategoryPage(`${subcategorySlug}:${page}`));
  cacheTag(CACHE_TAGS.subcategoryPageBlogs(subcategorySlug));

  const skip = (page - 1) * PAGE_SIZE;

  const subcategory = await prisma.subcategory.findFirst({
    where: { 
      slug: subcategorySlug, 
      category: { slug: categorySlug, language: { code: langCode } },
      isActive: true 
    },
    include: {
      category: {
        select: {
          name: true,
          slug: true,
          language: { select: { code: true, name: true, direction: true } },
        }
      }
    },
  });

  if (!subcategory) return null;

  // Get total count to calculate pages
  const totalCount = await prisma.blog.count({
    where: { status: "PUBLISHED", subcategoryId: subcategory.id },
  });

  const blogs = await prisma.blog.findMany({
    where: {
      status: "PUBLISHED",
      subcategoryId: subcategory.id,
    },
    orderBy: { publishedAt: "desc" },
    skip: skip,
    take: PAGE_SIZE,
    select: {
      id: true, title: true, slug: true, shortDescription: true, bannerImage: true,
      publishedAt: true, readingTime: true, writtenBy: true, writerImageUrl: true,
      category: { select: { name: true, slug: true } },
      subcategory: { select: { name: true, slug: true } },
      author: { select: { firstName: true, lastName: true, imageUrl: true } },
    },
  });

  const mappedSubcategory: SubcategoryPageData = {
    name: subcategory.name,
    slug: subcategory.slug,
    description: subcategory.description,
    category: { name: subcategory.category.name, slug: subcategory.category.slug },
    language: subcategory.category.language,
  };

  return { 
    subcategory: mappedSubcategory, 
    blogs, 
    totalCount, 
    totalPages: Math.ceil(totalCount / PAGE_SIZE),
    currentPage: page
  };
}

export async function getSubcategoryBlogs(langCode: string, categorySlug: string, subcategorySlug: string, page: number = 1): Promise<GetSubcategoryBlogsResult> {
  try {
    const data = await getCachedSubcategoryPage(langCode, categorySlug, subcategorySlug, page);
    if (!data) return { success: false, error: "Subcategory not found." };
    return { success: true, ...data };
  } catch (error) {
    console.error("[getSubcategoryBlogs]", error);
    return { success: false, error: "Failed to load subcategory data." };
  }
}