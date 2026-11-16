
import type { Metadata } from "next";

import { ContactContent } from "@/components/site/pages/contact/contact-content";

// -----------------------------------------------------------------------------
// ENEENA — Website identity
// -----------------------------------------------------------------------------

const SITE_URL = "https://www.eneena.com";
const SITE_NAME = "ENEENA";
const PAGE_URL = `${SITE_URL}/contact`;

// -----------------------------------------------------------------------------
// Contact page SEO
// -----------------------------------------------------------------------------

const PAGE_TITLE =
  "Contact ENEENA | Editorial Enquiries, Story Submissions & Partnerships";

const PAGE_DESCRIPTION =
  "Contact ENEENA for editorial enquiries, story submissions, reader feedback, press enquiries and business partnerships. Connect with our independent international publication.";

// -----------------------------------------------------------------------------
// Social sharing
// -----------------------------------------------------------------------------

const OG_IMAGE = `${SITE_URL}/images/og-image.jpg`;

const OG_IMAGE_ALT =
  "ENEENA — Independent Journalism, Global Perspectives";

// -----------------------------------------------------------------------------
// ENEENA's 12 editorial languages
// -----------------------------------------------------------------------------

const LANGUAGE_CODES = [
  "en",
  "ur",
  "ar",
  "de",
  "hi",
  "zh",
  "es",
  "fr",
  "pt-BR",
  "ja",
  "bn",
  "id",
] as const;

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
// Structured data — ContactPage + BreadcrumbList
// -----------------------------------------------------------------------------

const structuredData = {
  "@context": "https://schema.org",

  "@graph": [
    {
      "@type": "ContactPage",
      "@id": `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      inLanguage: "en",

      isPartOf: {
        "@id": `${SITE_URL}/#website`,
      },

      about: {
        "@id": `${SITE_URL}/#organization`,
      },

      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },

      mainEntity: {
        "@id": `${SITE_URL}/#organization`,
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
          name: "Contact",
          item: PAGE_URL,
        },
      ],
    },
  ],
};

// -----------------------------------------------------------------------------
// Safely serialize JSON-LD
// -----------------------------------------------------------------------------

const serializedStructuredData = JSON.stringify(structuredData)
  .replace(/</g, "\\u003c")
  .replace(/\u2028/g, "\\u2028")
  .replace(/\u2029/g, "\\u2029");

// -----------------------------------------------------------------------------
// Contact page
// -----------------------------------------------------------------------------

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializedStructuredData,
        }}
      />

      <ContactContent />
    </>
  );
}
