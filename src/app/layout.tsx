
import type { Metadata, Viewport } from "next";
import type { CSSProperties, ReactNode } from "react";

import "./globals.css";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/site/general/theme/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

// ======================================================
// ENEENA — INTERNATIONAL EDITORIAL PUBLICATION
// 12 language editions
// ======================================================

const SITE_URL = "https://www.eneena.com";
const SITE_NAME = "ENEENA";

const LANGUAGE_CODES = [
  "en", "ur", "ar", "de", "hi", "zh",
  "es", "fr", "pt-BR", "ja", "bn", "id",
];

const SITE_DESCRIPTION =
  "ENEENA is an independent international publication covering world affairs, politics, technology, science, culture and ideas in twelve languages.";

const SITE_LONG_DESCRIPTION =
  "ENEENA is an independent international editorial publication exploring world affairs, geopolitics, politics, technology, artificial intelligence, science, business, finance, economics, religion, history, culture, society, education, travel, lifestyle and ideas through original journalism in twelve languages: English, Urdu, Arabic, German, Hindi, Chinese, Spanish, French, Portuguese, Japanese, Bengali and Indonesian.";

const DEFAULT_TITLE =
  "ENEENA — Independent Journalism, Global Perspectives";

const OG_IMAGE = "/images/og-image.jpg";
const OG_IMAGE_ALT =
  "ENEENA — Independent Journalism, Global Perspectives";

const LOGO_URL =
  `${SITE_URL}/images/logos/apple-touch-icon-180x180.png`;

const FOUNDER_IMAGE_URL =
  `${SITE_URL}/images/about/editor.webp`;

const SOCIAL_PROFILES: string[] = [
  // Add real social profile URLs here.
];

const EDITORIAL_POLICY_URLS = {
  publishingPrinciples: "",
  correctionsPolicy: "",
  ethicsPolicy: "",
  masthead: "",
  actionableFeedbackPolicy: "",
};

// ======================================================
// GOOGLE FONTS
//
// IMPORTANT:
// Do not import these fonts through next/font/google.
// They are loaded through a normal stylesheet link instead.
// This avoids the Turbopack internal font-module error.
// ======================================================

const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2" +
  "?family=Plus+Jakarta+Sans:wght@400;500;600;700;800" +
  "&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700" +
  "&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600;8..60,700" +
  "&family=Geist+Mono:wght@400;500;600" +
  "&family=Gulzar" +
  "&family=Noto+Nastaliq+Urdu" +
  "&family=Amiri:wght@400;700" +
  "&family=Noto+Naskh+Arabic:wght@400;500;600;700" +
  "&family=Noto+Serif+Devanagari:wght@400;500;600;700" +
  "&family=Noto+Sans+Devanagari:wght@400;500;600;700" +
  "&family=Noto+Serif+Bengali:wght@400;500;600;700" +
  "&family=Noto+Sans+Bengali:wght@400;500;600;700" +
  "&family=Noto+Sans+SC:wght@400;500;700" +
  "&family=Noto+Serif+SC:wght@400;500;700" +
  "&family=Noto+Sans+JP:wght@400;500;700" +
  "&family=Noto+Serif+JP:wght@400;500;700" +
  "&display=swap";

// ======================================================
// VIEWPORT
// ======================================================

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,

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
// GLOBAL SEO METADATA
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

  icons: {
    icon: [
      {
        url: "/images/logos/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/images/logos/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/images/logos/favicon-48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
    ],

    apple: [
      {
        url: "/images/logos/apple-touch-icon-180x180.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],

    shortcut: ["/images/logos/favicon-32x32.png"],
  },

  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "default",
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

  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_SITE_VERIFICATION,

    other: process.env.BING_SITE_VERIFICATION
      ? {
          "msvalidate.01": process.env.BING_SITE_VERIFICATION,
        }
      : undefined,
  },

  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",

    alternateLocale: [
      "ur_PK",
      "ar_AR",
      "de_DE",
      "hi_IN",
      "zh_CN",
      "es_ES",
      "fr_FR",
      "pt_BR",
      "ja_JP",
      "bn_BD",
      "id_ID",
    ],

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
// STRUCTURED DATA
// ======================================================

const editorialPolicies = Object.fromEntries(
  Object.entries(EDITORIAL_POLICY_URLS).filter(
    ([, value]) => Boolean(value),
  ),
);

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

      knowsLanguage: LANGUAGE_CODES,

      knowsAbout: [
        "World affairs",
        "Politics",
        "Geopolitics",
        "Technology",
        "Artificial intelligence",
        "Science",
        "Business",
        "Economics",
        "History",
        "Culture",
      ],

      ...editorialPolicies,

      ...(SOCIAL_PROFILES.length > 0
        ? { sameAs: SOCIAL_PROFILES }
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
      inLanguage: LANGUAGE_CODES,
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
// TYPOGRAPHY RENDERING
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
    colorPrimaryForeground: "var(--primary-foreground)",

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
//
// This is the root English document shell.
// Individual language content MUST carry its own lang/dir.
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
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link
          rel="stylesheet"
          href={GOOGLE_FONTS_URL}
        />
      </head>

      <body className="min-h-full flex flex-col font-sans scrollbar-none overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteStructuredData).replace(
              /</g,
              "\\u003c",
            ),
          }}
        />

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
