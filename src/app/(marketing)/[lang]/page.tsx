// src/app/[lang]/page.tsx

import type { Metadata } from "next";
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
import prisma from "@/lib/clients/prisma-client";

// Ads (client components; safe to use inside this server component).
// Each ad renders its own "Advertisement" label and takes NO space until a
// real ad has loaded. If no ad arrives, it renders nothing at all.
import {
  AdSenseUnit,
  AdsterraNativeBanner,
  AdsterraBanner300x250,
  AdsterraBannerAuto,
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
      {/* The page content itself also contains ads (sidebar 300x250, a
          native banner after the top grid, and a responsive banner above
          "More Stories"): see language-client.tsx. */}
      <LanguageWrapper langCode={lang} />

      {/* ADS #1: native 4-tile banner (left) + 300x250 banner (right), below
          the page content. The 300x250 only appears from 1024px up, so
          phones and tablets get the native banner alone.
          The row (and its top margin) stays hidden until at least one ad has
          REALLY loaded: a loaded ad is an <aside data-ad-ready>. While ads
          are loading, or when none arrives, this row takes no space. */}
      <div className="mx-auto mt-16 hidden w-full min-w-0 max-w-[1600px] flex-col items-stretch gap-8 has-[aside[data-ad-ready]]:flex sm:mt-24 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
        <AdsterraNativeBanner className="w-full min-w-0 lg:flex-1" />
        <AdsterraBanner300x250
          minWidth={1024}
          className="w-full lg:w-75 lg:shrink-0"
        />
      </div>

      {/* ADS #2: full-width banner. 728x90 on tablet and desktop, 300x250 on
          phones (never both). Takes no space (including its top margin)
          until the ad has loaded. */}
      <AdsterraBannerAuto className="mx-auto mt-16 w-full max-w-[1600px] sm:mt-20" />

      {/* ADS #3: AdSense display unit. Only renders once ADSENSE_SLOT is
          filled in and AdSense is switched on in components/ads/ads.tsx.
          Collapsed (no height, no margin) until AdSense reports the unit as
          filled; stays collapsed when AdSense has no ad. */}
      {ADSENSE_SLOT && (
        <div className="mx-auto mt-0 flex max-h-0 w-full max-w-[1600px] flex-col items-center gap-2 overflow-hidden has-[ins[data-ad-status=filled]]:mt-16 has-[ins[data-ad-status=filled]]:max-h-none has-[ins[data-ad-status=filled]]:overflow-visible sm:has-[ins[data-ad-status=filled]]:mt-20">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Advertisement
          </span>
          <AdSenseUnit slot={ADSENSE_SLOT} className="w-full" />
        </div>
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