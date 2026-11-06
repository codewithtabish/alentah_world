
import type { Metadata } from "next";

import { AdvertiseContent } from "@/components/site/pages/advertise/advertise-content";

/* -------------------------------------------------------------------------- */
/* ENEENA — Website identity                                                  */
/* -------------------------------------------------------------------------- */

const SITE_URL = "https://www.eneena.com";
const SITE_NAME = "ENEENA";

const PAGE_URL = `${SITE_URL}/advertise`;

const PAGE_TITLE =
  "Advertise With ENEENA | Global Media, Brand Partnerships & Sponsorships";

const PAGE_DESCRIPTION =
  "Discover advertising and brand partnership opportunities with ENEENA, an independent international multilingual publication. Connect your brand with readers interested in world affairs, technology, business, finance, science, culture, society and ideas.";

/* -------------------------------------------------------------------------- */
/* Social sharing                                                             */
/* -------------------------------------------------------------------------- */

const OG_IMAGE = "/images/og-image.png";

const OG_IMAGE_ALT =
  "ENEENA — Independent Journalism and Global Perspectives";

/* -------------------------------------------------------------------------- */
/* SEO metadata                                                               */
/* -------------------------------------------------------------------------- */

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  applicationName: SITE_NAME,

  title: {
    absolute: PAGE_TITLE,
  },

  description: PAGE_DESCRIPTION,

  keywords: [
    "Advertise with ENEENA",
    "ENEENA advertising",
    "advertising opportunities",
    "international media advertising",
    "global advertising opportunities",
    "digital advertising",
    "online publication advertising",
    "brand partnerships",
    "media partnerships",
    "media sponsorships",
    "sponsorship opportunities",
    "digital media partnerships",
    "content partnerships",
    "editorial sponsorships",
    "sponsored articles",
    "sponsored content",
    "display advertising",
    "newsletter advertising",
    "brand visibility",
    "advertising for businesses",
    "advertising for agencies",
    "international publication",
    "multilingual publication",
    "independent journalism",
    "global media platform",
    "business and finance media",
    "technology publication",
    "culture and society publication",
    "advertising enquiries",
  ],

  authors: [
    {
      name: "ENEENA Editorial Team",
      url: SITE_URL,
    },
  ],

  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Advertising and Media",

  alternates: {
    canonical: PAGE_URL,
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,

    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
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
        type: "image/png",
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

  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
    url: false,
  },
};

/* -------------------------------------------------------------------------- */
/* Structured data                                                            */
/* -------------------------------------------------------------------------- */

const structuredData = {
  "@context": "https://schema.org",

  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,

      description:
        "ENEENA is an independent international multilingual publication exploring world affairs, geopolitics, technology, science, business, finance, history, culture, society and ideas.",

      knowsLanguage: [
        "English",
        "Urdu",
        "Arabic",
        "German",
        "Hindi",
        "Chinese",
      ],
    },

    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,

      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },

      inLanguage: ["en", "ur", "ar", "de", "hi", "zh"],
    },

    {
      "@type": "WebPage",
      "@id": `${PAGE_URL}/#webpage`,
      url: PAGE_URL,
      name: PAGE_TITLE,
      description: PAGE_DESCRIPTION,

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
        "@id": `${PAGE_URL}/#advertising-service`,
      },

      inLanguage: "en",
    },

    {
      "@type": "Service",
      "@id": `${PAGE_URL}/#advertising-service`,
      name: "Advertising and Brand Partnership Enquiries",
      description:
        "Advertising, sponsorship, sponsored content and brand partnership opportunities offered by ENEENA, subject to availability and editorial standards.",

      serviceType: [
        "Digital advertising enquiries",
        "Display advertising enquiries",
        "Sponsored content enquiries",
        "Newsletter advertising enquiries",
        "Brand partnership enquiries",
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
  ],
};

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function AdvertisePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <AdvertiseContent />
    </>
  );
}
