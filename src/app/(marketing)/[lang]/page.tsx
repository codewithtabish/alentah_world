// src/app/[lang]/page.tsx

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";

import { LanguageWrapper } from "@/components/site/pages/language/language-wrapper";

import { getLanguages } from "@/actions/language/get-languages";

import {
  HOME_SHARED_SEO,
  getHomeLanguageAlternates,
  getHomeSEO,
} from "@/data/home";

import { CACHE_TAGS } from "@/lib/cache-keys";
import { cn } from "@/lib/utils";
import prisma from "@/lib/clients/prisma-client";

// Ads (client components; safe to use inside this server component)
import {
  AdSenseUnit,
  AdsterraNativeBanner,
  AdsterraBanner300x250,
  AdsterraSocialBar,
  AdsterraPopunder,
} from "@/components/ads/ads";

// -----------------------------------------------------------------------------
// Ad settings
// -----------------------------------------------------------------------------

// Paste your AdSense ad unit slot ID here (AdSense > Ads > By ad unit).
// While this is "", no AdSense unit renders.
const ADSENSE_SLOT = "";

// -----------------------------------------------------------------------------
// Page props
// -----------------------------------------------------------------------------

type PageProps = {
  params: Promise<{
    lang: string;
  }>;
};

// -----------------------------------------------------------------------------
// Ad slot wrapper
//
// Hides itself completely (label included) while ads are switched off,
// because the ad components render nothing in that case: it only shows once
// it actually contains a <div> or <a> from an ad.
// -----------------------------------------------------------------------------

function AdSlot({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <aside
      aria-label="Advertisement"
      className={cn(
        "hidden min-w-0 flex-col items-center gap-2 has-[div,a]:flex",
        className,
      )}
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Advertisement
      </span>
      {children}
    </aside>
  );
}

// -----------------------------------------------------------------------------
// Generate static homepage routes for active languages
// -----------------------------------------------------------------------------

export async function generateStaticParams() {
  const languages = await prisma.language.findMany({
    where: {
      isActive: true,
    },

    select: {
      code: true,
    },
  });

  return languages.map((language) => ({
    lang: language.code,
  }));
}

// -----------------------------------------------------------------------------
// Dynamic multilingual SEO metadata
// -----------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;

  const seo = getHomeSEO(lang);

  // Do not allow unsupported language metadata to be indexed.
  if (!seo) {
    return {
      title: "Page Not Found | ENEENA",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalUrl = `${HOME_SHARED_SEO.siteUrl}/${lang}`;

  const languageAlternates = getHomeLanguageAlternates();

  return {
    title: {
      absolute: seo.title,
    },

    description: seo.description,

    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
    },

    robots: {
      index: true,
      follow: true,

      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    openGraph: {
      type: "website",
      siteName: HOME_SHARED_SEO.siteName,

      title: seo.title,
      description: seo.description,

      url: canonicalUrl,
      locale: seo.locale,

      images: [
        {
          url: HOME_SHARED_SEO.ogImage,
          width: HOME_SHARED_SEO.ogImageWidth,
          height: HOME_SHARED_SEO.ogImageHeight,
          alt: HOME_SHARED_SEO.ogImageAlt,
        },
      ],
    },

    twitter: {
      card: HOME_SHARED_SEO.twitterCard,

      title: seo.title,
      description: seo.description,

      images: [
        {
          url: HOME_SHARED_SEO.ogImage,
          alt: HOME_SHARED_SEO.ogImageAlt,
        },
      ],
    },
  };
}

// -----------------------------------------------------------------------------
// Cached language homepage
// -----------------------------------------------------------------------------

async function CachedLanguageHomepage({
  lang,
}: {
  lang: string;
}) {
  "use cache";

  cacheLife("max");

  cacheTag(CACHE_TAGS.languagePageBlogs(lang));
  cacheTag(CACHE_TAGS.language(lang));

  return (
    <main className="w-full min-h-screen">
      <LanguageWrapper langCode={lang} />

      {/* ADS #1: native 4-tile banner (left) + 300x250 banner (right), below
          the page content. On small screens they stack and the 300x250 is
          centered. The whole row stays hidden until an ad actually renders.
          The native banner is used only once on this page (its container id
          must not repeat); the 300x250 lives in its own iframe. */}
      <div className="mx-auto mt-16 hidden w-full min-w-0 max-w-[1600px] flex-col items-stretch gap-8 has-[div,a]:flex sm:mt-24 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
        <AdSlot className="w-full min-w-0 lg:flex-1">
          <AdsterraNativeBanner className="w-full" />
        </AdSlot>
        <AdSlot className="w-full lg:w-75 lg:shrink-0">
          <AdsterraBanner300x250 className="flex w-full justify-center" />
        </AdSlot>
      </div>

      {/* ADS #2: second 300x250, centered. Safe to repeat because it lives
          in its own iframe. */}
      <AdSlot className="mx-auto mt-16 w-full max-w-[1600px]">
        <AdsterraBanner300x250 className="flex w-full justify-center" />
      </AdSlot>

      {/* ADS #3: AdSense display unit. Only renders once ADSENSE_SLOT is
          filled in. */}
      {ADSENSE_SLOT && (
        <AdSlot className="mx-auto mt-20 w-full max-w-[1600px]">
          <AdSenseUnit slot={ADSENSE_SLOT} className="w-full" />
        </AdSlot>
      )}

      {/* ADS #4: site-wide scripts. They render nothing visible and stay off
          until switched on in components/ads/ads.tsx
          (adsterraSocialBar / adsterraPopunder).
          If you also render them in app/layout.tsx, remove them from one of
          the two places so they do not load twice. */}
      <AdsterraSocialBar />
      <AdsterraPopunder />
    </main>
  );
}

// -----------------------------------------------------------------------------
// Language homepage
// -----------------------------------------------------------------------------

export default async function LanguagePage({
  params,
}: PageProps) {
  // Resolve route parameters outside the cached component.
  const { lang } = await params;

  // Validate against active database languages.
  const languagesRes = await getLanguages();

  const isValid =
    languagesRes.success &&
    languagesRes.languages.some(
      (language) => language.code === lang && language.isActive,
    );

  if (!isValid) {
    notFound();
  }

  // Render the cached homepage for the validated language.
  return <CachedLanguageHomepage lang={lang} />;
}