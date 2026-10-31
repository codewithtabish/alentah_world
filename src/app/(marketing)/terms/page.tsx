// src/app/(site)/terms/page.tsx   <- use your real route path
// Server component. The shared layout Container provides the page background
// and horizontal padding, so none is added here.

import type { Metadata } from "next";
import { TermsContent } from "@/components/site/pages/terms/terms-content";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The conditions governing your access to and use of Alentah World, our publication, website, and available services.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service | Alentah World",
    description:
      "The conditions governing your access to and use of Alentah World, our publication, website, and available services.",
    url: "/terms",
    type: "website",
    images: [
      {
        url: "/images/privacy/privacy.webp",
        alt: "Golden scales of justice resting on law books",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return <TermsContent />;
}