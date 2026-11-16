
// src/app/robots.ts

import type { MetadataRoute } from "next";

const SITE_URL = "https://www.eneena.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",

        allow: "/",

        // Administrative areas are not public editorial content.
        disallow: [
          "/admin",
          "/admin/",
          "/admins",
          "/admins/",
        ],
      },
    ],

    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
