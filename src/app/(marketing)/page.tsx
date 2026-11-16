
import type { Metadata } from "next";
import { Suspense } from "react";

import FromTheEditor from "@/components/site/pages/home/from-editor";
import { HomeWrapper } from "@/components/site/pages/home/home-wrapper";

const SITE_URL = "https://www.eneena.com";
const SITE_NAME = "ENEENA";

const PAGE_TITLE =
  "ENEENA — Independent Journalism, Global Perspectives";

const PAGE_DESCRIPTION =
  "Independent journalism and original perspectives on world affairs, technology, AI, science, business and culture. Explore ENEENA in 12 languages.";

const OG_IMAGE = `${SITE_URL}/images/og-image.jpg`;

const OG_IMAGE_ALT =
  "ENEENA — Independent Journalism, Global Perspectives";

export const metadata: Metadata = {
  title: {
    absolute: PAGE_TITLE,
  },

  description: PAGE_DESCRIPTION,

  alternates: {
    canonical: SITE_URL,

    languages: {
      en: `${SITE_URL}/en`,
      ur: `${SITE_URL}/ur`,
      ar: `${SITE_URL}/ar`,
      de: `${SITE_URL}/de`,
      hi: `${SITE_URL}/hi`,
      "zh-CN": `${SITE_URL}/zh`,
      es: `${SITE_URL}/es`,
      fr: `${SITE_URL}/fr`,
      "pt-BR": `${SITE_URL}/pt-BR`,
      ja: `${SITE_URL}/ja`,
      bn: `${SITE_URL}/bn`,
      id: `${SITE_URL}/id`,
      "x-default": SITE_URL,
    },
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
    url: SITE_URL,
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

// The root layout already renders <main id="main-content">.
// Do not create another <main> element here.
export default function HomePage() {
  return (
    <>
      <HomeWrapper />

      {/* Editorial letter: streams in after the main homepage content. */}
      <Suspense fallback={null}>
        <FromTheEditor />
      </Suspense>
    </>
  );
}
