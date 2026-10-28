// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable Cache Components (required for "use cache")
  cacheComponents: true,

  // Prefetch the saved shell of the next page, so clicks feel instant.
  partialPrefetching: true,

  // More time for static generation (helps with heavy Nastaliq text)
  staticPageGenerationTimeout: 120,

  // Server Action body size limit (default is 1 MB).
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  images: {
    // WebP encodes much faster than AVIF, so the first visit is quicker.
    formats: ["image/webp"],

    // Image quality values the app may request.
    qualities: [60, 70, 75],

    // Keep optimized images cached for 1 year.
    minimumCacheTTL: 60 * 60 * 24 * 365, // 31536000 seconds

    // Smaller list of sizes means fewer versions to build and cache.
    deviceSizes: [480, 768, 1024, 1280, 1600],
    imageSizes: [32, 64, 128, 256, 400],

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