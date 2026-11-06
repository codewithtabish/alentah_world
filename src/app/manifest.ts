import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  const logo = "/images/logos/icon-maroon-1024.png";

  return {
    // ==========================================
    // APPLICATION IDENTITY
    // ==========================================

    id: "/",
    name: "ENEENA — Independent Editorial Publication",
    short_name: "ENEENA",

    description:
          "ENEENA is an independent international multilingual editorial publication in English, Urdu and Arabic, built on the spirit of slow journalism for curious minds. Explore thoughtful long-form reporting, analysis, essays and opinion across world affairs, geopolitics, politics, diplomacy, economy, business, finance, markets, technology, artificial intelligence, science, health, environment, climate, culture, art, literature, books, religion, spirituality, history, philosophy, society, education, travel, food, lifestyle, sports and big ideas — all in one place, with depth, context and clarity instead of noise.",

     

    // ==========================================
    // APPLICATION NAVIGATION
    // ==========================================

    start_url: "/",
    scope: "/",

    // ==========================================
    // APPLICATION DISPLAY
    // ==========================================

    display: "standalone",

    display_override: ["standalone", "minimal-ui", "browser"],

    orientation: "any",

    // ==========================================
    // BRAND COLORS
    // ==========================================

    theme_color: "#5E1428",
    background_color: "#FAF8F5",

    // ==========================================
    // LANGUAGE
    // ==========================================

    lang: "en",
    dir: "auto",

    // ==========================================
    // APPLICATION CATEGORIES
    // ==========================================

    categories: ["news", "education", "books", "business", "lifestyle"],

    // ==========================================
    // INSTALLATION PREFERENCES
    // ==========================================

    prefer_related_applications: false,

    // ==========================================
    // APPLICATION ICONS
    // ==========================================

    icons: [
      {
        src: "/images/logos/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/logos/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/logos/maskable-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/images/logos/maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],

    // ==========================================
    // DESKTOP AND MOBILE SCREENSHOTS
    // ==========================================

    screenshots: [
      {
        src: "/images/screenshots/desktop-home.webp",
        sizes: "1280x720",
        type: "image/webp",
        form_factor: "wide",
        label: "ENEENA desktop homepage",
      },
      {
        src: "/images/screenshots/desktop-editorial.webp",
        sizes: "1280x720",
        type: "image/webp",
        form_factor: "wide",
        label: "ENEENA editorial experience",
      },
      {
        src: "/images/screenshots/mobile-home.webp",
        sizes: "390x844",
        type: "image/webp",
        form_factor: "narrow",
        label: "ENEENA mobile homepage",
      },
      {
        // File on disk is named "mobile-editorial.png.webp"
        src: "/images/screenshots/mobile-editorial.png.webp",
        sizes: "390x844",
        type: "image/webp",
        form_factor: "narrow",
        label: "ENEENA mobile reading experience",
      },
    ],

    // ==========================================
    // DESKTOP AND MOBILE APP SHORTCUTS
    // ==========================================

    shortcuts: [
      {
        name: "ENEENA English Edition",
        short_name: "English",
        description: "Explore the English edition.",
        url: "/en",
        icons: [
          {
            src: logo,
            sizes: "1024x1024",
            type: "image/png",
          },
        ],
      },
      {
        name: "ENEENA Urdu Edition",
        short_name: "Urdu",
        description: "Explore the Urdu edition.",
        url: "/ur",
        icons: [
          {
            src: logo,
            sizes: "1024x1024",
            type: "image/png",
          },
        ],
      },
      {
        name: "ENEENA Arabic Edition",
        short_name: "Arabic",
        description: "Explore the Arabic edition.",
        url: "/ar",
        icons: [
          {
            src: logo,
            sizes: "1024x1024",
            type: "image/png",
          },
        ],
      },
    ],
  };
}