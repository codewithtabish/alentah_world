// src/components/site/pages/about/about-categories-wrapper.tsx
import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/actions/categories/get-categories";

export async function AboutCategoriesWrapper() {
  const res = await getCategories();

  if (!res.success || !res.categories) {
    return null; // Fallback if needed
  }

  // Filter for English categories only and take the first 7
  const englishCategories = res.categories
    .filter((cat) => cat.language.code === "en" && cat.isActive)
    .slice(0, 7);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {englishCategories.map((cat) => (
        <Link 
          key={cat.id} 
          href={`/en/${cat.slug}`} 
          className="group flex flex-col gap-3"
        >
          <div className="relative aspect-4/5 w-full overflow-hidden rounded-md border border-border/50 bg-muted">
            {cat.coverImage ? (
              <Image
                src={cat.coverImage}
                alt={cat.name}
                fill
                sizes="(min-width: 1024px) 14vw, (min-width: 768px) 25vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground text-xs">
                No Image
              </div>
            )}
          </div>
          <span className="text-center font-serif text-sm font-bold text-foreground group-hover:text-primary transition-colors">
            {cat.name}
          </span>
        </Link>
      ))}
    </div>
  );
}