// src/components/site/pages/category/category-wrapper.tsx
import { getCategoryBlogs } from "@/actions/articles/get-category-blogs";
import { CategoryClient } from "./category-client";
import { notFound } from "next/navigation";

export async function CategoryWrapper({ 
  lang, 
  category, 
  page = 1 
}: { 
  lang: string; 
  category: string; 
  page?: number;
}) {
  // 👇 Page parameter passed to the server action
  const res = await getCategoryBlogs(lang, category, page);

  if (!res.success) {
    notFound();
  }

  // 👇 Passes totalPages and currentPage to the Client Component
  return (
    <CategoryClient 
      langCode={lang} 
      category={res.category} 
      blogs={res.blogs} 
      totalPages={res.totalPages} 
      currentPage={res.currentPage} 
    />
  );
}