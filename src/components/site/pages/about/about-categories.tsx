import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { getCategories } from "@/actions/categories/get-categories";
import { Eyebrow } from "./about-ui";

/* ---------------- Skeleton (defined here, no import needed) ---------------- */

const BOX = "animate-pulse border border-border";

function CategoriesSkeleton() {
  return (
    <ul
      aria-hidden
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7"
    >
      {Array.from({ length: 7 }).map((_, index) => (
        <li key={index} className="flex flex-col gap-2">
          <div className={`aspect-4/3 w-full ${BOX}`} />
          <div className={`h-3 w-2/3 ${BOX}`} />
        </li>
      ))}
    </ul>
  );
}

/* ---------------- Async data component (streams in) ---------------- */

async function CategoriesGrid() {
  const result = await getCategories();
  const categories = result.success
    ? result.categories.filter((category) => category.isActive)
    : [];

  if (categories.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {result.success
          ? "Our editorial sections are coming soon."
          : "We couldn’t load our sections right now. Please try again shortly."}
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
      {categories.map((category) => (
        <li key={category.id}>
          <Link
            href={`/${category.slug}`}
            lang={category.language.code}
            dir={category.language.direction}
            className="group flex flex-col gap-2"
          >
            <div className="relative aspect-4/3 w-full overflow-hidden border border-border">
              {category.coverImage ? (
                <Image
                  src={category.coverImage}
                  alt={category.name}
                  fill
                  unoptimized
                  sizes="(min-width: 1024px) 14vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                // Fallback when a category has no cover image
                <span
                  aria-hidden
                  className={`flex size-full items-center justify-center font-serif text-4xl`}
                >
                  {category.name.trim().charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold leading-snug text-foreground">
                {category.name}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {category._count.blogs}{" "}
                {category._count.blogs === 1 ? "story" : "stories"}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/* ---------------- Section (heading + Suspense + fallback) ---------------- */

export function AboutCategoriesSection() {
  return (
    <section
      aria-labelledby="landscape-title"
      className="flex flex-col gap-8 border-t border-border py-10 md:py-14"
    >
      <div className="flex flex-col gap-3">
        <Eyebrow>What We Cover</Eyebrow>
        <h2
          id="landscape-title"
          className="font-serif text-3xl text-foreground sm:text-4xl"
        >
          Our Editorial Landscape
        </h2>
      </div>

      <Suspense fallback={<CategoriesSkeleton />}>
        <CategoriesGrid />
      </Suspense>
    </section>
  );
}