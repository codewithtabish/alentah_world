
import type { Metadata } from "next";

import { ContactContent } from "@/components/site/pages/contact/contact-content";

const SITE_URL = "https://www.eneena.com";
const SITE_NAME = "ENEENA";

const PAGE_URL = `${SITE_URL}/contact`;

const PAGE_TITLE =
  "Contact ENEENA | Editorial Enquiries, Story Submissions & Partnerships";

const PAGE_DESCRIPTION =
  "Get in touch with ENEENA, an independent international publication. Submit a story idea, share feedback, contact our editorial team, or explore advertising and partnership opportunities.";

const OG_IMAGE = "/images/og-image.png";

const OG_IMAGE_ALT =
  "ENEENA — Independent Journalism and Global Perspectives";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  applicationName: SITE_NAME,

  title: {
    absolute: PAGE_TITLE,
  },

  description: PAGE_DESCRIPTION,

  keywords: [
    "Contact ENEENA",
    "ENEENA contact",
    "ENEENA editorial team",
    "ENEENA journalism",
    "contact international publication",
    "editorial enquiries",
    "story submissions",
    "submit a story",
    "journalism contributions",
    "advertising enquiries",
    "media partnerships",
    "business partnerships",
    "independent journalism",
    "global publication",
    "press enquiries",
  ],

  authors: [
    {
      name: "ENEENA Editorial Team",
      url: SITE_URL,
    },
  ],

  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "News and Journalism",

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

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
      inLanguage: [
        "en",
        "ur",
        "ar",
        "de",
        "hi",
        "zh",
      ],
    },
    {
      "@type": "ContactPage",
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
      inLanguage: "en",
    },
  ],
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <ContactContent />
    </>
  );
}
