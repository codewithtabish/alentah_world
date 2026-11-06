
import type { Metadata } from "next";

import { PrivacyContent } from "@/components/site/pages/privacy/privacy-content";

// -----------------------------------------------------------------------------
// ENEENA — Privacy Policy SEO configuration
// -----------------------------------------------------------------------------

const SITE_URL = "https://www.eneena.com";
const SITE_NAME = "ENEENA";
const PAGE_URL = `${SITE_URL}/privacy`;

const PAGE_TITLE = "Privacy Policy | ENEENA";

const PAGE_DESCRIPTION =
  "Read ENEENA's Privacy Policy to understand how we collect, use, store, and protect personal information when you visit our international multilingual publication.";

const OG_IMAGE = "/images/og-image.png";

const OG_IMAGE_ALT = "ENEENA — Independent Journalism and Global Perspectives";

// -----------------------------------------------------------------------------
// Metadata
// -----------------------------------------------------------------------------

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  applicationName: SITE_NAME,

  title: {
    absolute: PAGE_TITLE,
  },

  description: PAGE_DESCRIPTION,

  authors: [
    {
      name: "ENEENA",
      url: SITE_URL,
    },
  ],

  creator: SITE_NAME,
  publisher: SITE_NAME,

  alternates: {
    canonical: PAGE_URL,
  },

  robots: {
    index: true,
    follow: true,
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

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function PrivacyPage() {
  return <PrivacyContent />;
}
