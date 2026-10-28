// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Enable Cache Components (required for "use cache" directive)
  cacheComponents: true,

  // ✅ Increase timeout for static generation (helps with heavy Nastaliq text)
  staticPageGenerationTimeout: 120,

  // ✅ Increase Server Action body size limit (default is 1 MB)
  // Allows uploading images up to 10 MB through Server Actions.
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  // ✅ Allow ALL remote image hostnames + Optimize Formats
  images: {
    formats: ["image/avif", "image/webp"], // This makes images load 80% faster
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // allows any hostname over HTTPS
      },
      {
        protocol: "http",
        hostname: "**", // allows any hostname over HTTP
      },
    ],
  },
};

export default nextConfig;