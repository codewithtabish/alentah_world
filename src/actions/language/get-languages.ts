// src/actions/language/get-languages.ts
"use server";

// ============================================================
// Server Actions — Languages
//   - getLanguages()      → PUBLIC. No auth. Navbar + footer.
//   - getLanguagesAdmin() → ADMIN only. Admin category/editor forms.
//
// IMPORTANT: never call auth() from the public read — it calls
// headers() under the hood, which breaks static prerendering.
// ============================================================

import { cacheTag, cacheLife } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/clients/prisma-client";
import { CACHE_TAGS } from "@/lib/cache-keys";

// ============================================================
// TYPES
// ============================================================

export type LanguageListItem = {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  direction: "LTR" | "RTL";
  isActive: boolean;
  isDefault: boolean;
  sortOrder: number;
};

export type GetLanguagesResult =
  | { success: true; languages: LanguageListItem[] }
  | { success: false; error: string };

// ============================================================
// CACHED PUBLIC READ
// ============================================================

async function getCachedLanguages(): Promise<LanguageListItem[]> {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAGS.languages); // We will add this tag below

  const rows = await prisma.language.findMany({
    orderBy: [
      { sortOrder: "asc" },
      { name: "asc" }
    ],
    select: {
      id: true,
      code: true,
      name: true,
      nativeName: true,
      direction: true,
      isActive: true,
      isDefault: true,
      sortOrder: true,
    },
  });

  return rows;
}

// ============================================================
// PUBLIC — navbar, footer, site pages. NO auth() call.
// ============================================================

export async function getLanguages(): Promise<GetLanguagesResult> {
  try {
    const languages = await getCachedLanguages();
    return { success: true, languages };
  } catch (error) {
    console.error("[getLanguages] Error:", error);
    return { success: false, error: "Failed to load languages." };
  }
}

// ============================================================
// ADMIN — validates role, then returns the same data.
// Do NOT use this from the navbar / footer / public pages.
// ============================================================

export async function getLanguagesAdmin(): Promise<GetLanguagesResult> {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return { success: false, error: "Not authenticated." };
    }

    const role = (
      sessionClaims?.metadata as { role?: string } | undefined
    )?.role;

    if (role !== "ADMIN") {
      return { success: false, error: "Not authorized." };
    }

    const languages = await getCachedLanguages();
    return { success: true, languages };
  } catch (error) {
    console.error("[getLanguagesAdmin] Error:", error);
    return { success: false, error: "Failed to load languages." };
  }
}