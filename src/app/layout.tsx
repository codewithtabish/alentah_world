// src/app/layout.tsx

import type { Metadata, Viewport } from "next";
import {
  Plus_Jakarta_Sans,
  Fraunces,
  Geist_Mono,
  Gulzar,
  Noto_Nastaliq_Urdu,
  Amiri,
  Noto_Naskh_Arabic,
} from "next/font/google";

import "./globals.css";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/site/general/theme/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

// ============================================
// FONTS — three languages, three font families
// ============================================

// ---------- ENGLISH (From Alentah Layout) ----------

// UI sans (navigation, buttons, metadata)
const fontSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  style: ["normal"],
  preload: true,
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: true,
});

// Editorial serif (headlines, brand)
const fontSerif = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
  preload: true,
  fallback: ["Georgia", "serif"],
  adjustFontFallback: true,
});

// Monospace (code)
const fontMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["monospace"],
  adjustFontFallback: true,
});

// ---------- URDU (Nastaliq) ----------
// preload: false → English visitors don't download these heavy fonts.

// Urdu headlines
const fontUrduDisplay = Gulzar({
  variable: "--font-gulzar",
  subsets: ["arabic"],
  weight: "400",
  display: "swap",
  preload: false,
  fallback: ["Jameel Noori Nastaleeq", "serif"],
});

// Urdu body + UI
const fontUrduText = Noto_Nastaliq_Urdu({
  variable: "--font-nastaliq",
  subsets: ["arabic"],
  display: "swap",
  preload: false,
  fallback: ["Jameel Noori Nastaleeq", "serif"],
});

// ---------- ARABIC (Naskh) ----------

// Arabic headlines
const fontArabicDisplay = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
  fallback: ["Traditional Arabic", "serif"],
});

// Arabic body + UI
const fontArabicText = Noto_Naskh_Arabic({
  variable: "--font-naskh",
  subsets: ["arabic"],
  display: "swap",
  preload: false,
  fallback: ["Traditional Arabic", "serif"],
});

// ============================================
// VIEWPORT
// ============================================

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF7F2" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1714" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light dark",
};

// ============================================
// SEO METADATA
// ============================================

export const metadata: Metadata = {
  metadataBase: new URL("https://www.alentahworld.com"),
  title: {
    default: "Alentah World | Independent Journalism, Global Perspectives",
    template: "%s | Alentah World",
  },
  description:
    "Discover original stories, fresh perspectives, and independent journalism across languages, cultures, and borders. One World. Many Voices.",
  keywords: ["Alentah World", "Independent Journalism", "Global News"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Alentah World",
    title: "Alentah World | Independent Journalism, Global Perspectives",
    description:
      "Discover original stories, fresh perspectives, and independent journalism across languages, cultures, and borders.",
  },
  robots: { index: true, follow: true },
};

// ============================================
// PREMIUM TYPOGRAPHY (Latin text only)
// Urdu/Arabic reset these in globals.css via :lang(...)
// ============================================

const premiumTypography = {
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
  textRendering: "optimizeLegibility",
  textSizeAdjust: "100%",
  fontFeatureSettings:
    '"ss01" on, "liga" on, "calt" on, "kern" on, "cpsp" on, "case" on, "salt" on',
  fontKerning: "normal",
  letterSpacing: "-0.01em",
} as const;

// ============================================
// CLERK APPEARANCE
// ============================================

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
} as const;

// ============================================
// ROOT LAYOUT
// ============================================

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
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
        "font-sans",
      )}
      suppressHydrationWarning
      style={premiumTypography}
    >
      <body className="min-h-full flex flex-col font-sans scrollbar-none overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider appearance={clerkAppearance}>
            <main className="flex flex-1 flex-col">{children}</main>
            <Toaster />
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}