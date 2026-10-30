// src/app/(marketing)/contact/page.tsx
import type { Metadata } from "next";
import { ContactContent } from "@/components/site/pages/contact/contact-content";

export const metadata: Metadata = {
  title: "Contact Us | Alentah World",
  description:
    "Have a story to share, a question to ask, or an opportunity to discuss? Get in touch with the Alentah World team.",
};

export default function ContactPage() {
  return <ContactContent />;
}