// src/components/site/pages/subcategory/subcategory-wrapper.tsx
import { getSubcategoryBlogs } from "@/actions/articles/get-subcategory-blogs";
import { SubcategoryClient } from "./subcategory-client";
import { notFound } from "next/navigation";

export async function SubcategoryWrapper({ 
  lang, 
  category, 
  subcategory,
  page = 1 
}: { 
  lang: string; 
  category: string; 
  subcategory: string;
  page?: number;
}) {
  const res = await getSubcategoryBlogs(lang, category, subcategory, page);

  if (!res.success) {
    notFound();
  }

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