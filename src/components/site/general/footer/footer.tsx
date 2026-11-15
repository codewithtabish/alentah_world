
// src/components/site/general/layout/footer.tsx

import * as React from "react";
import { Suspense } from "react";

import { getLanguages } from "@/actions/language/get-languages";

import { FooterClient } from "./footer-client";
import { FooterSkeleton } from "./footer-skeleton";

// ============================================================
// ENEENA — PUBLIC FOOTER
// Server Component
// ============================================================

async function FooterData() {
  const languagesRes = await getLanguages();

  if (!languagesRes.success) {
    return null;
  }

  // Pass all active languages to the client footer
  const languages = languagesRes.languages
    .filter((language) => language.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return <FooterClient languages={languages} />;
}

export function Footer() {
  return (
    <Suspense fallback={<FooterSkeleton />}>
      <FooterData />
    </Suspense>
  );
}

export default Footer;
