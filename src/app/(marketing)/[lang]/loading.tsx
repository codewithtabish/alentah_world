// src/app/[lang]/loading.tsx
import { LanguagePageSkeleton } from "@/components/site/pages/language/language-skeleton";

export default function Loading() {
  return (
    <div className="w-full min-h-screen">
      <LanguagePageSkeleton />
    </div>
  );
}