
import type { Metadata } from "next";

import { getLanguages } from "@/actions/language/get-languages";
import ShareYourStoryForm from "@/components/site/pages/story/share-your-story-form";

// -----------------------------------------------------------------------------
// ENEENA — Website identity
// -----------------------------------------------------------------------------

const SITE_URL = "https://www.eneena.com";
const SITE_NAME = "ENEENA";
const PAGE_URL = `${SITE_URL}/share-your-story`;

// -----------------------------------------------------------------------------
// Page SEO configuration
// -----------------------------------------------------------------------------

const PAGE_TITLE =
  "Share Your Story with ENEENA | Submit Your Personal Experience";

const PAGE_DESCRIPTION =
  "Have a meaningful experience, personal perspective or true story to share? Submit your original story to ENEENA's international editorial team in your preferred language.";

// -----------------------------------------------------------------------------
// Social sharing
// -----------------------------------------------------------------------------

const OG_IMAGE = `${SITE_URL}/images/og-image.jpg`;

const OG_IMAGE_ALT =
  "Share Your Story with ENEENA — Independent Journalism, Global Perspectives";

// -----------------------------------------------------------------------------
// Search engine metadata
// -----------------------------------------------------------------------------

export const metadata: Metadata = {
  title: {
    absolute: PAGE_TITLE,
  },

  description: PAGE_DESCRIPTION,

  alternates: {
    canonical: PAGE_URL,
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
    siteName: SITE_NAME,
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    locale: "en_US",

    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: OG_IMAGE_ALT,
        type: "image/jpeg",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,

    images: [
      {
        url: OG_IMAGE,
        alt: OG_IMAGE_ALT,
      },
    ],
  },
};

// -----------------------------------------------------------------------------
// Structured data — WebPage + BreadcrumbList
// -----------------------------------------------------------------------------

const structuredData = {
  "@context": "https://schema.org",

  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      inLanguage: "en",

      isPartOf: {
        "@id": `${SITE_URL}/#website`,
      },

      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },

      about: {
        "@id": `${SITE_URL}/#organization`,
      },

      mainEntity: {
        "@type": "WebApplication",
        "@id": `${PAGE_URL}#submission-form`,
        name: "ENEENA Story Submission Form",
        description:
          "A form for readers to submit original stories and personal experiences to ENEENA's editorial team.",
        applicationCategory: "CommunicationApplication",
        operatingSystem: "Any",
        inLanguage: "en",
        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },
      },

      breadcrumb: {
        "@id": `${PAGE_URL}#breadcrumb`,
      },

      primaryImageOfPage: {
        "@type": "ImageObject",
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        caption: OG_IMAGE_ALT,
      },
    },

    {
      "@type": "BreadcrumbList",
      "@id": `${PAGE_URL}#breadcrumb`,

      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Share Your Story",
          item: PAGE_URL,
        },
      ],
    },
  ],
};

// -----------------------------------------------------------------------------
// Safely serialize structured data
// -----------------------------------------------------------------------------

const serializedStructuredData = JSON.stringify(structuredData)
  .replace(/</g, "\\u003c")
  .replace(/\u2028/g, "\\u2028")
  .replace(/\u2029/g, "\\u2029");

// -----------------------------------------------------------------------------
// Share Your Story page
// -----------------------------------------------------------------------------

export default async function ShareYourStoryPage() {
  const result = await getLanguages();

  const languages = result.success
    ? result.languages.filter((language) => language.isActive)
    : [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializedStructuredData,
        }}
      />

      <main className="w-full min-w-0">
        <ShareYourStoryForm
          languages={languages}
          languageError={result.success ? null : result.error}
        />
      </main>
    </>
  );
}
