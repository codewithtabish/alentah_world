// src/app/(marketing)/advertise/page.tsx
import type { Metadata } from "next";
import { AdvertiseContent } from "@/components/site/pages/advertise/advertise-content";

export const metadata: Metadata = {
  title: "Advertise With Us | Alentah World",
  description:
    "Connect your brand with a publication built around curiosity, ideas, and meaningful storytelling. Explore advertising and partnership opportunities with Alentah World.",
};

export default function AdvertisePage() {
  return <AdvertiseContent />;
}