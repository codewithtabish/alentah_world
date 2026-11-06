import type { Metadata, Viewport } from "next";
import type { CSSProperties, ReactNode } from "react";

import {
  Plus_Jakarta_Sans,
  Fraunces,
  Geist_Mono,
  Gulzar,
  Noto_Nastaliq_Urdu,
  Amiri,
  Noto_Naskh_Arabic,
  Noto_Serif_Devanagari,
  Noto_Sans_Devanagari,
  Noto_Serif_SC,
  Noto_Sans_SC,
} from "next/font/google";

import "./globals.css";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/site/general/theme/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

// ======================================================
// ENEENA — INTERNATIONAL EDITORIAL PUBLICATION
// English | Urdu | Arabic | German | Hindi | Chinese
// ======================================================

const SITE_URL = "https://www.eneena.com";
const SITE_NAME = "ENEENA";

// Keep under ~160 characters so search engines don't truncate it.
const SITE_DESCRIPTION =
  "ENEENA is an independent international publication covering world affairs, politics, technology, AI, science, business, culture and ideas in six languages.";

// Longer description, used only in structured data.
const SITE_LONG_DESCRIPTION =
  "ENEENA is an independent international editorial publication exploring world affairs, geopolitics, politics, technology, artificial intelligence, science, business, finance, economics, religion, history, culture, society, education, travel, lifestyle and ideas through original journalism in English, Urdu, Arabic, German, Hindi and Chinese.";

const DEFAULT_TITLE = "ENEENA — Independent Journalism, Global Perspectives";

const OG_IMAGE = "/images/og-image.jpg";
const OG_IMAGE_ALT = "ENEENA — Independent Journalism, Global Perspectives";
const LOGO_URL = `${SITE_URL}/images/logos/apple-touch-icon-180x180.png`;
const FOUNDER_IMAGE_URL = `${SITE_URL}/images/about/editor.webp`;

// Add your real profiles here. They are used as `sameAs` in structured
// data, which helps search engines and AI systems tie the brand together.
const SOCIAL_PROFILES: string[] = [
  // "https://x.com/eneena",
  // "https://www.facebook.com/eneena",
  // "https://www.linkedin.com/company/eneena",
  // "https://www.youtube.com/@eneena",
  // "https://www.instagram.com/eneena",
];

// Fill these in ONLY when the pages really exist. Empty strings are
// skipped automatically. They strengthen trust signals (E-E-A-T) for a
// news publisher. Example: `${SITE_URL}/editorial-standards`
const EDITORIAL_POLICY_URLS = {
  publishingPrinciples: "",
  correctionsPolicy: "",
  ethicsPolicy: "",
  masthead: "",
  actionableFeedbackPolicy: "",
};

// ======================================================
// 1. LATIN TYPOGRAPHY (English + German)
// Plus Jakarta Sans and Fraunces are variable fonts. Leaving out the
// `weight` list makes Next.js ship ONE variable file per style instead
// of many static files, which means less data and a faster LCP.
// ======================================================

const fontSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  style: ["normal"],
  preload: true,
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: true,
});

const fontSerif = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  preload: true,
  fallback: ["Georgia", "serif"],
  adjustFontFallback: true,
});

// Rarely above the fold, so it must not compete for early bandwidth.
const fontMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  fallback: ["monospace"],
  adjustFontFallback: true,
});

// ======================================================
// 2. URDU TYPOGRAPHY — NASTALIQ
// ======================================================

const fontUrduDisplay = Gulzar({
  variable: "--font-gulzar",
  subsets: ["arabic"],
  weight: "400",
  display: "swap",
  preload: false,
  fallback: ["Jameel Noori Nastaleeq", "serif"],
});

const fontUrduText = Noto_Nastaliq_Urdu({
  variable: "--font-nastaliq",
  subsets: ["arabic"],
  display: "swap",
  preload: false,
  fallback: ["Jameel Noori Nastaleeq", "serif"],
});

// ======================================================
// 3. ARABIC TYPOGRAPHY — NASKH
// ======================================================

const fontArabicDisplay = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
  fallback: ["Traditional Arabic", "serif"],
});

const fontArabicText = Noto_Naskh_Arabic({
  variable: "--font-naskh",
  subsets: ["arabic"],
  display: "swap",
  preload: false,
  fallback: ["Traditional Arabic", "serif"],
});

// ======================================================
// 4. HINDI TYPOGRAPHY — DEVANAGARI
// ======================================================

const fontHindiDisplay = Noto_Serif_Devanagari({
  variable: "--font-devanagari-serif",
  subsets: ["devanagari", "latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
  fallback: ["Mangal", "serif"],
});

const fontHindiText = Noto_Sans_Devanagari({
  variable: "--font-devanagari-sans",
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  preload: false,
  fallback: ["Mangal", "sans-serif"],
});

// ======================================================
// 5. CHINESE TYPOGRAPHY — SIMPLIFIED
// CJK fonts are delivered in unicode-range slices, so only
// the characters actually used on a page are downloaded.
// ======================================================

const fontChineseDisplay = Noto_Serif_SC({
  variable: "--font-sc-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
  fallback: ["Songti SC", "SimSun", "serif"],
});

const fontChineseText = Noto_Sans_SC({
  variable: "--font-sc-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  preload: false,
  fallback: ["PingFang SC", "Microsoft YaHei", "sans-serif"],
});

// ======================================================
// 6. VIEWPORT
// ======================================================

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,

  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF8F5" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1714" },
  ],

  colorScheme: "light dark",
};

// ======================================================
// 7. GLOBAL SEO METADATA
// NOTE: do NOT set `alternates.canonical` here. A canonical in the
// root layout is inherited by every page and would point them all
// at the same URL. Set canonical + hreflang per page instead.
// ======================================================

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  applicationName: SITE_NAME,

  title: {
    default: DEFAULT_TITLE,
    template: "%s | ENEENA",
  },

  description: SITE_DESCRIPTION,

  authors: [{ name: "ENEENA Editorial Team", url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "News and Editorial Journalism",
  referrer: "strict-origin-when-cross-origin",

  manifest: "/manifest.webmanifest",

  icons: {
    icon: [
      { url: "/images/logos/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/images/logos/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/logos/favicon-48x48.png", sizes: "48x48", type: "image/png" },
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

  // Search engine ownership verification (set these in your env).
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_SITE_VERIFICATION,
    other: process.env.BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
      : undefined,
  },

  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
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
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: OG_IMAGE, alt: OG_IMAGE_ALT }],
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
// 8. SITE-WIDE STRUCTURED DATA
// Organization, WebSite and founder are defined once here
// and referenced by @id from individual pages.
// ======================================================

const editorialPolicies = Object.fromEntries(
  Object.entries(EDITORIAL_POLICY_URLS).filter(([, value]) => Boolean(value)),
);

const siteStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "NewsMediaOrganization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: ["Eneena", "ENEENA Journal", "eneena.com"],
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
      founder: { "@id": `${SITE_URL}/#founder` },
      knowsLanguage: ["en", "ur", "ar", "de", "hi", "zh"],
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
      ...(SOCIAL_PROFILES.length > 0 ? { sameAs: SOCIAL_PROFILES } : {}),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      alternateName: "Eneena",
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: ["en", "ur", "ar", "de", "hi", "zh"],
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#founder`,
      name: "Talha Tabish",
      jobTitle: "Founder and Editor-in-Chief",
      image: FOUNDER_IMAGE_URL,
      url: `${SITE_URL}/about`,
      worksFor: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

// ======================================================
// 9. LATIN TYPOGRAPHY RENDERING
// Letter-spacing and OpenType features are NOT set here.
// Negative tracking breaks the joined letters of Urdu / Arabic /
// Devanagari, so they live in globals.css and are scoped by :lang().
// ======================================================

const premiumTypography: CSSProperties = {
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
  textRendering: "optimizeLegibility",
  textSizeAdjust: "100%",
  fontKerning: "normal",
};

// ======================================================
// 10. CLERK APPEARANCE
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

    fontFamily: "var(--font-jakarta), ui-sans-serif, sans-serif",
    fontFamilyButtons: "var(--font-jakarta), ui-sans-serif, sans-serif",

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
// 11. ROOT LAYOUT
// IMPORTANT: lang="en" is correct for English pages only. For /ur,
// /ar, /de, /hi and /zh, the <html lang> and dir MUST change. The
// clean way is a route segment: app/[lang]/layout.tsx that renders
// <html lang={lang} dir={lang === "ur" || lang === "ar" ? "rtl" : "ltr"}>
// and moves this shell into it.
// ======================================================

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={cn(
        "h-full",
        "antialiased",

        fontSans.variable,
        fontSerif.variable,
        fontMono.variable,

        fontUrduDisplay.variable,
        fontUrduText.variable,

        fontArabicDisplay.variable,
        fontArabicText.variable,

        fontHindiDisplay.variable,
        fontHindiText.variable,

        fontChineseDisplay.variable,
        fontChineseText.variable,

        "font-sans",
      )}
      suppressHydrationWarning
      style={premiumTypography}
    >
      <body className="min-h-full flex flex-col font-sans scrollbar-none overflow-x-hidden">
        {/* Site-wide structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteStructuredData).replace(/</g, "\\u003c"),
          }}
        />

        {/* Accessibility + keyboard navigation */}
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
            <main id="main-content" className="flex flex-1 flex-col">
              {children}
            </main>

            <Toaster />
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}