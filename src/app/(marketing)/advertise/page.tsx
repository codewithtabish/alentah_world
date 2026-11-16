
import type { Metadata } from "next";

import { AdvertiseContent } from "@/components/site/pages/advertise/advertise-content";

// -----------------------------------------------------------------------------
// ENEENA — Brand identity
// -----------------------------------------------------------------------------

const SITE_URL = "https://www.eneena.com";
const SITE_NAME = "ENEENA";

const PAGE_URL = `${SITE_URL}/advertise`;

// -----------------------------------------------------------------------------
// Page SEO
// -----------------------------------------------------------------------------

const PAGE_TITLE =
  "Advertise With ENEENA | Global Media & Brand Partnerships";

const PAGE_DESCRIPTION =
  "Explore advertising and brand partnership opportunities with ENEENA, an independent international publication covering world affairs, technology, business, science and culture in 12 languages.";

// Use the existing ENEENA global social sharing image.
const OG_IMAGE = `${SITE_URL}/images/og-image.jpg`;

const OG_IMAGE_ALT =
  "ENEENA — Independent Journalism, Global Perspectives";

// -----------------------------------------------------------------------------
// Supported editorial languages
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
// Structured data — Advertising page
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

      about: {
        "@id": `${SITE_URL}/#organization`,
      },

      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },

      mainEntity: {
        "@id": `${PAGE_URL}#advertising-service`,
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
      "@type": "Service",
      "@id": `${PAGE_URL}#advertising-service`,
      name: "Advertising and Brand Partnership Enquiries",

      description:
        "Explore advertising, sponsorship and brand partnership opportunities with ENEENA. Potential collaborations are subject to availability, audience relevance and ENEENA's editorial standards.",

      serviceType: [
        "Digital advertising enquiries",
        "Display advertising enquiries",
        "Sponsored content enquiries",
        "Newsletter advertising enquiries",
        "Brand partnership enquiries",
        "Media partnership enquiries",
      ],

      provider: {
        "@id": `${SITE_URL}/#organization`,
      },

      areaServed: {
        "@type": "Place",
        name: "International",
      },

      url: PAGE_URL,
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
          name: "Advertise",
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
// Advertise page
// -----------------------------------------------------------------------------

export default function AdvertisePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializedStructuredData,
        }}
      />

      <AdvertiseContent />
    </>
  );
}
