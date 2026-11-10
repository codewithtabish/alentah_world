// src/components/site/general/layout/footer.tsx
import * as React from "react";
import { Suspense } from "react";

import { getCategories } from "@/actions/categories/get-categories";
import { getLanguages } from "@/actions/language/get-languages";

import { FooterClient } from "./footer-client";
import { FooterSkeleton } from "./footer-skeleton";

// ============================================================
// ENEENA — PUBLIC FOOTER
// Server component
// ============================================================

async function FooterData() {
  const [categoriesRes, languagesRes] = await Promise.all([
    getCategories(),
    getLanguages(),
  ]);

  if (!categoriesRes.success || !languagesRes.success) {
    return null;
  }

  // 👇 Pass ALL active languages, not just EN and UR
  const languages = languagesRes.languages.filter(
    (language) => language.isActive
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

export default Footer;