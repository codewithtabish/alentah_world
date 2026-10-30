// src/components/site/general/footer/footer.tsx
import * as React from "react";
import { Suspense } from "react";
import { getCategories } from "@/actions/categories/get-categories";
import { getLanguages } from "@/actions/language/get-languages";
import { FooterClient } from "./footer-client";
import { FooterSkeleton } from "./footer-skeleton";

async function FooterData() {
  // Fetch data in parallel
  const [categoriesRes, languagesRes] = await Promise.all([
    getCategories(),
    getLanguages(),
  ]);

  // If data fails, return null (or you can return an empty footer)
  if (!categoriesRes.success || !languagesRes.success) {
    return null;
  }

  // Filter out Arabic for now (as per your navbar setup)
  const languages = languagesRes.languages.filter(
    (l) => l.code === "en" || l.code === "ur"
  );

  return (
    <FooterClient 
      categories={categoriesRes.categories} 
      languages={languages} 
    />
  );
}

export function Footer() {
  return (
    <Suspense fallback={<FooterSkeleton />}>
      <FooterData />
    </Suspense>
  );
}