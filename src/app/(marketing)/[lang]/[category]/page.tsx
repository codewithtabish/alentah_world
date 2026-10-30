// src/app/[lang]/[category]/page.tsx
import { Suspense } from "react";
import { CategoryWrapper } from "@/components/site/pages/category/category-wrapper";
import { getCategoryBlogs } from "@/actions/articles/get-category-blogs";
import { CategoryPageSkeleton } from "@/components/site/pages/category/category-skeleton";

export async function generateMetadata({ params }: { params: Promise<{ lang: string, category: string }> }) {
  const { lang, category } = await params;
  const res = await getCategoryBlogs(lang, category);
  
  if (!res.success) return { title: "Category Not Found" };
  
  return {
    title: `${res.category.name} | Alentah World`,
    description: res.category.description || `Read the latest articles in ${res.category.name}.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ lang: string, category: string }> }) {
  const { lang, category } = await params;

  return (
    <Suspense fallback={<CategoryPageSkeleton />}>
      <CategoryWrapper lang={lang} category={category} />
    </Suspense>
  );
}