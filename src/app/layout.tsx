
import type { Metadata, Viewport } from "next";

import type { CSSProperties, ReactNode } from "react";

import "./globals.css";

import { cn } from "@/lib/utils";

import { ThemeProvider } from "@/components/site/general/theme/theme-provider";

import { ClerkProvider } from "@clerk/nextjs";

import { Toaster } from "sonner";

// ======================================================
// ENEENA — INTERNATIONAL EDITORIAL PUBLICATION
// ======================================================

const SITE_URL = "https://www.eneena.com";

const SITE_NAME = "ENEENA";

const DEFAULT_TITLE =
  "ENEENA — Independent Journalism, Global Perspectives";

const SITE_DESCRIPTION =
  "ENEENA is an independent international editorial publication sharing original journalism, world affairs, technology, science, business, culture, and human stories across 12 language editions.";

const SITE_LONG_DESCRIPTION =
  "ENEENA is an independent international editorial publication exploring world affairs, geopolitics, politics, technology, artificial intelligence, science, business, finance, economics, history, culture, society, education, travel, lifestyle, and ideas. ENEENA publishes original editorial content across English, Urdu, Arabic, German, Hindi, Chinese, Spanish, French, Brazilian Portuguese, Japanese, Bengali, and Indonesian language editions.";

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

const LANGUAGE_NAMES = [
  "English",
  "Urdu",
  "Arabic",
  "German",
  "Hindi",
  "Chinese",
  "Spanish",
  "French",
  "Brazilian Portuguese",
  "Japanese",
  "Bengali",
  "Indonesian",
] as const;

// ======================================================
// GOOGLE ADSENSE
//
// Publisher ID copied from the AdSense verification
// screen. Double-check it against the Copy button in
// AdSense before deploying.
// ======================================================

const ADSENSE_CLIENT_ID = "ca-pub-7966396390181709";

const ADSENSE_SCRIPT_URL = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;

// ======================================================
// BRAND ASSETS
// ======================================================

const OG_IMAGE = "/images/og-image.jpg";

const OG_IMAGE_ALT =
  "ENEENA — Independent Journalism, Global Perspectives";

const LOGO_URL =
  `${SITE_URL}/images/logos/apple-touch-icon-180x180.png`;

const FOUNDER_IMAGE_URL =
  `${SITE_URL}/images/about/editor.webp`;

// ======================================================
// VERIFIED SOCIAL PROFILES
//
// Add only real, publicly accessible ENEENA profiles.
// Never add placeholder or invented social URLs.
// ======================================================

const SOCIAL_PROFILES: string[] = [];

// ======================================================
// GOOGLE FONTS
//
// External stylesheet loading avoids the previous
// Turbopack next/font/google module resolution issue.
//
// Keep the font families used by globals.css.
// ======================================================

const GOOGLE_FONTS_URL = [
  "https://fonts.googleapis.com/css2",
  "?family=Plus+Jakarta+Sans:wght@400;500;600;700;800",
  "&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700",
  "&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600;8..60,700",
  "&family=Geist+Mono:wght@400;500;600",
  "&family=Gulzar",
  "&family=Noto+Nastaliq+Urdu",
  "&family=Amiri:wght@400;700",
  "&family=Noto+Naskh+Arabic:wght@400;500;600;700",
  "&family=Noto+Serif+Devanagari:wght@400;500;600;700",
  "&family=Noto+Sans+Devanagari:wght@400;500;600;700",
  "&family=Noto+Serif+Bengali:wght@400;500;600;700",
  "&family=Noto+Sans+Bengali:wght@400;500;600;700",
  "&family=Noto+Sans+SC:wght@400;500;700",
  "&family=Noto+Serif+SC:wght@400;500;700",
  "&family=Noto+Sans+JP:wght@400;500;700",
  "&family=Noto+Serif+JP:wght@400;500;700",
  "&display=swap",
].join("");

// ======================================================
// VIEWPORT
// ======================================================

export const viewport: Viewport = {
  width: "device-width",

  initialScale: 1,

  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: "#FAF8F5",
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: "#1A1714",
    },
  ],

  colorScheme: "light dark",
};

// ======================================================
// GLOBAL METADATA
//
// These are site-wide defaults.
//
// Individual language pages and editorial pages
// must override their own localized metadata.
// ======================================================

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  applicationName: SITE_NAME,

  title: {
    default: DEFAULT_TITLE,
    template: "%s | ENEENA",
  },

  description: SITE_DESCRIPTION,

  authors: [
    {
      name: "ENEENA Editorial Team",
      url: SITE_URL,
    },
  ],

  creator: SITE_NAME,

  publisher: SITE_NAME,

  category: "News and Editorial Journalism",

  referrer: "strict-origin-when-cross-origin",

  manifest: "/manifest.webmanifest",

  // Favicon is handled automatically by src/app/icon.png.

  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "default",
  },

  // ==================================================
  // SEARCH ENGINE VERIFICATION
  //
  // Configure actual verification values in .env.
  // Never put fake verification codes here.
  // ==================================================

  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,

    yandex: process.env.YANDEX_SITE_VERIFICATION,

    other: process.env.BING_SITE_VERIFICATION
      ? {
          "msvalidate.01":
            process.env.BING_SITE_VERIFICATION,
        }
      : undefined,
  },

  // ==================================================
  // OPEN GRAPH DEFAULTS
  //
  // Page-specific metadata must override these values
  // for individual articles and localized editions.
  //
  // Deliberately omit a global og:url because every
  // article must use its own actual canonical URL.
  // ==================================================

  openGraph: {
    type: "website",

    siteName: SITE_NAME,

    title: DEFAULT_TITLE,

    description: SITE_DESCRIPTION,

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

  // ==================================================
  // X / TWITTER SOCIAL CARDS
  // ==================================================

  twitter: {
    card: "summary_large_image",

    title: DEFAULT_TITLE,

    description: SITE_DESCRIPTION,

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

// ======================================================
// STRUCTURED DATA — ORGANIZATION + WEBSITE + FOUNDER
//
// These entities establish ENEENA's consistent
// publisher identity across the website.
//
// Individual article pages need their own
// Article / NewsArticle structured data.
// ======================================================

const siteStructuredData = {
  "@context": "https://schema.org",

  "@graph": [
    {
      "@type": "NewsMediaOrganization",

      "@id": `${SITE_URL}/#organization`,

      name: SITE_NAME,

      alternateName: [
        "Eneena",
        "ENEENA Journal",
        "eneena.com",
      ],

      url: SITE_URL,

      description: SITE_LONG_DESCRIPTION,

      slogan: "Independent Journalism, Global Perspectives",

      logo: {
        "@type": "ImageObject",

        "@id": `${SITE_URL}/#logo`,

        url: LOGO_URL,

        contentUrl: LOGO_URL,

        width: 180,

        height: 180,
      },

      image: `${SITE_URL}${OG_IMAGE}`,

      founder: {
        "@id": `${SITE_URL}/#founder`,
      },

      knowsLanguage: [...LANGUAGE_NAMES],

      knowsAbout: [
        "World affairs",
        "Politics",
        "Geopolitics",
        "Technology",
        "Artificial intelligence",
        "Science",
        "Business",
        "Finance",
        "Economics",
        "History",
        "Culture",
        "Society",
        "Education",
      ],

      ...(SOCIAL_PROFILES.length > 0
        ? {
            sameAs: SOCIAL_PROFILES,
          }
        : {}),
    },

    {
      "@type": "WebSite",

      "@id": `${SITE_URL}/#website`,

      name: SITE_NAME,

      alternateName: "Eneena",

      url: SITE_URL,

      description: SITE_DESCRIPTION,

      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },

      inLanguage: [...LANGUAGE_CODES],
    },

    {
      "@type": "Person",

      "@id": `${SITE_URL}/#founder`,

      name: "Talha Tabish",

      jobTitle: "Founder and Editor-in-Chief",

      image: FOUNDER_IMAGE_URL,

      url: `${SITE_URL}/about`,

      worksFor: {
        "@id": `${SITE_URL}/#organization`,
      },
    },
  ],
};

// ======================================================
// SAFE STRUCTURED DATA SERIALIZATION
//
// Prevent HTML/script-breaking characters from
// being interpreted inside the JSON-LD script.
// ======================================================

const serializedSiteStructuredData = JSON.stringify(
  siteStructuredData,
)
  .replace(/</g, "\\u003c")
  .replace(/\u2028/g, "\\u2028")
  .replace(/\u2029/g, "\\u2029");

// ======================================================
// PREMIUM TYPOGRAPHY RENDERING
// ======================================================

const premiumTypography: CSSProperties = {
  WebkitFontSmoothing: "antialiased",

  MozOsxFontSmoothing: "grayscale",

  textRendering: "optimizeLegibility",

  textSizeAdjust: "100%",

  fontKerning: "normal",
};

// ======================================================
// CLERK APPEARANCE
// ======================================================

const clerkAppearance = {
  variables: {
    colorPrimary: "var(--primary)",

    colorBackground: "var(--card)",

    colorForeground: "var(--card-foreground)",

    colorText: "var(--foreground)",

    colorTextSecondary: "var(--muted-foreground)",

    colorInputBackground: "var(--background)",

    colorInputText: "var(--foreground)",

    colorDanger: "var(--destructive)",

    colorBorder: "var(--border)",

    colorRing: "var(--ring)",

    borderRadius: "0.75rem",

    fontFamily:
      '"Plus Jakarta Sans", ui-sans-serif, sans-serif',

    fontFamilyButtons:
      '"Plus Jakarta Sans", ui-sans-serif, sans-serif',

    fontSize: "0.875rem",

    spacingUnit: "1rem",
  },

  elements: {
    rootBox: "font-sans",

    card: cn(
      "bg-card text-card-foreground",
      "border border-border",
      "rounded-3xl",
      "shadow-none",
      "overflow-hidden",
      "p-2",
    ),

    headerTitle: cn(
      "font-serif text-foreground text-2xl",
      "tracking-tight font-normal text-center",
    ),

    formButtonPrimary: cn(
      "bg-primary text-primary-foreground",
      "rounded-full h-12",
      "text-[11px] font-semibold uppercase tracking-[0.18em]",
      "hover:bg-primary/90",
      "transition-all duration-200",
    ),
  },
};

// ======================================================
// ROOT LAYOUT
// ======================================================

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      className="h-full antialiased"
      suppressHydrationWarning
      style={premiumTypography}
    >
      <head>
        {/* Google Fonts connection optimization */}

        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Multilingual typography */}

        <link
          rel="stylesheet"
          href={GOOGLE_FONTS_URL}
        />

        {/*
          Google AdSense — site verification + ad serving.

          Deliberately a plain <script> tag (not next/script):
          it appears in the server-rendered HTML exactly as
          AdSense expects, and avoids the data-nscript
          attribute that AdSense's code checker dislikes.
        */}

        <script
          async
          src={ADSENSE_SCRIPT_URL}
          crossOrigin="anonymous"
        />
      </head>

      <body className="min-h-full flex flex-col font-sans scrollbar-none overflow-x-hidden">
        {/* ENEENA publisher and website identity */}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializedSiteStructuredData,
          }}
        />

        {/* Accessibility: skip directly to main content */}

        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
        >
          Skip to main content
        </a>

        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider appearance={clerkAppearance}>
            <main
              id="main-content"
              className="flex flex-1 flex-col"
            >
              {children}
            </main>

            <Toaster />
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
