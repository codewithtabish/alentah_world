
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
      <LanguageWrapper langCode={lang} />
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
