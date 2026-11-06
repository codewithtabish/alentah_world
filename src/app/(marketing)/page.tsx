import type { Metadata } from "next";
import { Suspense } from "react";

import FromTheEditor from "@/components/site/pages/home/from-editor";
import { HomeWrapper } from "@/components/site/pages/home/home-wrapper";

const SITE_URL = "https://www.eneena.com";
const SITE_NAME = "ENEENA";

const PAGE_TITLE = "ENEENA — Independent Journalism, Global Perspectives";

// Under ~160 characters so it is not truncated in results.
const PAGE_DESCRIPTION =
  "Original journalism on world affairs, politics, technology, AI, science, business and culture. Read ENEENA in English, Urdu, Arabic, German, Hindi and Chinese.";

const OG_IMAGE = "/images/og-image.jpg";
const OG_IMAGE_ALT = "ENEENA — Independent Journalism, Global Perspectives";

// metadataBase, robots, authors, publisher etc. are inherited from the root
// layout. openGraph and twitter replace the parent's objects, so they are
// complete here.
export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,

  alternates: {
    canonical: SITE_URL,
    // Every language home (/en, /ur, ...) must declare this SAME set,
    // including x-default pointing at "/". Only keep a language here once
    // its home page really exists and returns 200.
    languages: {
      en: `${SITE_URL}/en`,
      ur: `${SITE_URL}/ur`,
      ar: `${SITE_URL}/ar`,
      de: `${SITE_URL}/de`,
      hi: `${SITE_URL}/hi`,
      "zh-Hans": `${SITE_URL}/zh`,
      "x-default": SITE_URL,
    },
  },

  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
    alternateLocale: ["ur_PK", "ar_AR", "de_DE", "hi_IN", "zh_CN"],
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
    images: [{ url: OG_IMAGE, alt: OG_IMAGE_ALT }],
  },
};

// The root layout already renders <main id="main-content">,
// so this page must not add a second <main>.
export default function HomePage() {
  return (
    <>
      <HomeWrapper />

      {/* Editorial letter: streams in after the main grid */}
      <Suspense fallback={null}>
        <FromTheEditor />
      </Suspense>
    </>
  );
}