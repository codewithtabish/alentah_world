// src/app/[lang]/[category]/[subcategory]/page.tsx
import { Suspense } from "react";
import { SubcategoryWrapper } from "@/components/site/pages/subcategory/subcategory-wrapper";
import { getSubcategoryBlogs } from "@/actions/articles/get-subcategory-blogs";
import { SubcategoryPageSkeleton } from "@/components/site/pages/subcategory/subcategory-skeleton";

export async function generateMetadata({ params }: { params: Promise<{ lang: string, category: string, subcategory: string }> }) {
  const { lang, category, subcategory } = await params;
  const res = await getSubcategoryBlogs(lang, category, subcategory);
  
  if (!res.success) return { title: "Subcategory Not Found" };
  
  return {
    title: `${res.subcategory.name} | Alentah World`,
    description: res.subcategory.description || `Read the latest articles in ${res.subcategory.name}.`,
  };
}

export default async function SubcategoryPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ lang: string, category: string, subcategory: string }>,
  searchParams: Promise<{ page?: string }>
}) {
  const { lang, category, subcategory } = await params;
  const { page } = await searchParams;
  
  const currentPage = Number(page) || 1;

  return (
    <Suspense fallback={<SubcategoryPageSkeleton />}>
      <SubcategoryWrapper lang={lang} category={category} subcategory={subcategory} page={currentPage} />
    </Suspense>
  );
}