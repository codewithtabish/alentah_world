// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable Cache Components (required for "use cache")
  cacheComponents: true,

  // Prefetch the saved shell of the next page, so clicks feel instant.
  // Recommended by Next.js for new Cache Components projects.
  partialPrefetching: true,

  // More time for static generation (helps with heavy Nastaliq text)
  staticPageGenerationTimeout: 120,

  // Server Action body size limit (default is 1 MB).
  // Allows uploading images up to 10 MB through Server Actions.
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  images: {
    formats: ["image/avif", "image/webp"],

    // Image quality values the app may request.
    // Needed for quality={60} and quality={70} on the home page.
    qualities: [60, 70, 75],

    // Keep optimized images cached for 30 days, so they are not rebuilt often
    minimumCacheTTL: 60 * 60 * 24 * 30,

    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;