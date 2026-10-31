// src/components/site/pages/write/writing-categories.tsx
import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/actions/categories/get-categories";

export async function WritingCategories() {
  const res = await getCategories();

  if (!res.success) {
    return <div className="text-center text-muted-foreground py-10">Failed to load categories.</div>;
  }

  const enCategories = res.categories.filter((c) => c.language.code === "en" && c.isActive);
  const urCategories = res.categories.filter((c) => c.language.code === "ur" && c.isActive);

  // Take 2 English and 3 Urdu for a tight layout (or adjust as needed)
  const displayCategories = [
    ...enCategories.slice(0, 2).map(c => ({ ...c, langCode: "en" })),
    ...urCategories.slice(0, 3).map(c => ({ ...c, langCode: "ur" }))
  ];

  if (displayCategories.length === 0) {
    return <div className="text-center text-muted-foreground py-10">No categories found.</div>;
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-6">
      <div className="max-w-xl shrink-0">
        <h2 className="text-3xl font-bold mb-2 font-serif text-foreground">Writing Categories</h2>
        <p className="text-sm text-muted-foreground font-sans">
          We welcome original work across a wide range of topics.
        </p>
      </div>
      
      {/* Categories Grid */}
      <div className="flex flex-wrap gap-3">
        {displayCategories.map((cat) => {
          const isUrdu = cat.langCode === 'ur';
          
          return (
            <Link 
              key={cat.id} 
              href={`/${cat.langCode}/${cat.slug}`}
              className="relative aspect-3/4 w-30 sm:w-35 rounded-lg overflow-hidden group cursor-pointer border border-border/50"
            >
              {cat.coverImage ? (
                <Image 
                  src={cat.coverImage} 
                  alt={cat.name} 
                  fill 
                  sizes="(min-width: 1024px) 140px, 120px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              ) : (
                <div className="absolute inset-0 bg-muted flex items-center justify-center text-xs text-muted-foreground text-center p-2">
                  {cat.name}
                </div>
              )}
              
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-transparent" />
              
              {/* 👇 FIXED TEXT: Added padding, better line-height, and object positioning */}
              <div className="absolute inset-x-0 bottom-0 p-3 flex items-end">
                <span 
                  className={`text-white font-bold w-full ${
                    isUrdu 
                      ? 'font-urdu-text text-right text-[15px] leading-[2.2] pb-1' 
                      : 'font-sans text-sm leading-snug pb-0.5'
                  }`}
                >
                  {cat.name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}