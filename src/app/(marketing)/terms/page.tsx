
import type { Metadata } from "next";

import { TermsContent } from "@/components/site/pages/terms/terms-content";

// -----------------------------------------------------------------------------
// ENEENA — Website identity
// -----------------------------------------------------------------------------

const SITE_URL = "https://www.eneena.com";
const SITE_NAME = "ENEENA";
const PAGE_URL = `${SITE_URL}/terms`;

// -----------------------------------------------------------------------------
// Terms of Service SEO
// -----------------------------------------------------------------------------

const PAGE_TITLE = "Terms of Service | ENEENA";

const PAGE_DESCRIPTION =
  "Read ENEENA's Terms of Service to understand the terms and conditions governing access to and use of our website, journalism, published content, user accounts, story submissions and available services.";

// -----------------------------------------------------------------------------
// Social sharing
// -----------------------------------------------------------------------------

const OG_IMAGE = `${SITE_URL}/images/og-image.jpg`;

const OG_IMAGE_ALT =
  "Golden scales of justice resting on law books, representing terms and legal responsibilities";

// -----------------------------------------------------------------------------
// Metadata
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
        type: "image/webp",
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
        "@type": "CreativeWork",
        "@id": `${PAGE_URL}#terms`,
        name: "ENEENA Terms of Service",
        url: PAGE_URL,
        inLanguage: "en",

        publisher: {
          "@id": `${SITE_URL}/#organization`,
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
          name: "Terms of Service",
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
// Terms of Service page
// -----------------------------------------------------------------------------

export default function TermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializedStructuredData,
        }}
      />

      <TermsContent />
    </>
  );
}
