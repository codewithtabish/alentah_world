// src/app/(site)/privacy/page.tsx   <- use your real route path
import type { Metadata } from "next";
import { PrivacyContent } from "@/components/site/pages/privacy/privacy-content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Alentah World collects, uses, stores, and protects your personal information, and the choices available to you.",
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}