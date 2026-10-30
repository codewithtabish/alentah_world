// src/actions/articles/get-category-blogs.ts
"use server";

import { cacheTag, cacheLife } from "next/cache";
import prisma from "@/lib/clients/prisma-client";
import { CACHE_TAGS } from "@/lib/cache-keys";

export type CategoryPageBlog = {
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

export type CategoryPageData = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  coverImage: string | null;
  language: { code: string; name: string; direction: string };
  subcategories: { id: string; name: string; slug: string }[];
  // 👇 ADDED: Editor Data for the Author Card
  editor: {
    id: string;
    name: string;
    imageUrl: string | null;
    bio: string | null;
    experience: string | null;
    location: string | null;
    twitter: string | null;
    linkedin: string | null;
    facebook: string | null;
    instagram: string | null;
    website: string | null;
  } | null;
};

export type GetCategoryBlogsResult = 
  | { success: true; category: CategoryPageData; blogs: CategoryPageBlog[]; totalCount: number; currentPage: number; totalPages: number }
  | { success: false; error: string };

const PAGE_SIZE = 20;

async function getCachedCategoryPage(langCode: string, categorySlug: string, page: number) {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAGS.categoryPage(`${categorySlug}:${page}`));
  cacheTag(CACHE_TAGS.category(categorySlug));

  const skip = (page - 1) * PAGE_SIZE;

  const category = await prisma.category.findFirst({
    where: { 
      slug: categorySlug, 
      language: { code: langCode },
      isActive: true 
    },
    include: {
      language: { select: { code: true, name: true, direction: true } },
      subcategories: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        select: { id: true, name: true, slug: true },
      },
      editor: {
        select: {
          id: true, name: true, imageUrl: true, bio: true, experience: true,
          location: true, twitter: true, linkedin: true, facebook: true,
          instagram: true, website: true,
        }
      }
    },
  });

  if (!category) return null;

  const totalCount = await prisma.blog.count({
    where: { status: "PUBLISHED", categoryId: category.id },
  });

  const blogs = await prisma.blog.findMany({
    where: {
      status: "PUBLISHED",
      categoryId: category.id,
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

  const mappedCategory: CategoryPageData = {
    id: category.id,
    slug: category.slug,
    name: category.name,
    description: category.description,
    coverImage: category.coverImage,
    language: category.language,
    subcategories: category.subcategories,
    editor: category.editor,
  };

  return { 
    category: mappedCategory, 
    blogs, 
    totalCount, 
    totalPages: Math.ceil(totalCount / PAGE_SIZE),
    currentPage: page
  };
}

export async function getCategoryBlogs(langCode: string, categorySlug: string, page: number = 1): Promise<GetCategoryBlogsResult> {
  try {
    const data = await getCachedCategoryPage(langCode, categorySlug, page);
    if (!data) return { success: false, error: "Category not found." };
    return { success: true, ...data };
  } catch (error) {
    console.error("[getCategoryBlogs]", error);
    return { success: false, error: "Failed to load category data." };
  }
}