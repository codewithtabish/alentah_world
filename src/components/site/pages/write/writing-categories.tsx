
// src/components/site/pages/write/writing-categories.tsx

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";

import { getCategories } from "@/actions/categories/get-categories";

const EDITORIAL_LANGUAGES = [
  { code: "en", label: "English", direction: "ltr" },
  { code: "ur", label: "اردو", direction: "rtl" },
  { code: "ar", label: "العربية", direction: "rtl" },
  { code: "de", label: "Deutsch", direction: "ltr" },
  { code: "hi", label: "हिन्दी", direction: "ltr" },
  { code: "zh", label: "中文", direction: "ltr" },
] as const;

const MAX_CATEGORIES_PER_LANGUAGE = 2;

export async function WritingCategories() {
  const result = await getCategories();

  if (!result.success) {
    return (
      <section
        aria-labelledby="writing-categories-heading"
        className="w-full"
      >
        <div className="mb-6">
          <span className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Explore our coverage
          </span>

          <h2
            id="writing-categories-heading"
            className="font-serif text-3xl font-bold text-foreground"
          >
            Writing Categories
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Explore the subjects covered by ENEENA and discover where your
            ideas and expertise can contribute.
          </p>
        </div>

        <p
          className="py-8 text-center text-sm text-muted-foreground"
          role="status"
        >
          Editorial categories are temporarily unavailable. Please try again
          later.
        </p>
      </section>
    );
  }

  const activeCategories = result.categories.filter(
    (category) => category.isActive,
  );

  const displayCategories = EDITORIAL_LANGUAGES.flatMap((language) => {
    const languageCategories = activeCategories
      .filter((category) => category.language.code === language.code)
      .slice(0, MAX_CATEGORIES_PER_LANGUAGE);

    return languageCategories.map((category) => ({
      ...category,
      languageCode: language.code,
      languageLabel: language.label,
      direction: language.direction,
    }));
  });

  return (
    <section
      aria-labelledby="writing-categories-heading"
      className="w-full"
    >
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <span className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Explore our coverage
          </span>

          <h2
            id="writing-categories-heading"
            className="font-serif text-3xl font-bold text-foreground sm:text-4xl"
          >
            Writing Categories
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            From world affairs and technology to history, culture, science
            and society, ENEENA welcomes original work across a wide range
            of subjects.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 text-xs font-medium text-muted-foreground">
          <BookOpen className="size-4 text-primary" aria-hidden="true" />
          <span>Explore our editorial sections</span>
        </div>
      </div>

      {displayCategories.length === 0 ? (
        <div
          className="rounded-lg border border-border px-5 py-10 text-center"
          role="status"
        >
          <p className="text-sm text-muted-foreground">
            No active writing categories are available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {displayCategories.map((category) => {
            const isRightToLeft = category.direction === "rtl";

            return (
              <Link
                key={category.id}
                href={`/${category.languageCode}/${category.slug}`}
                dir={category.direction}
                aria-label={`Explore ${category.name} in ${category.languageLabel}`}
                className="group relative aspect-3/4 min-w-0 overflow-hidden rounded-lg border border-border/60 bg-muted transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {category.coverImage ? (
                  <Image
                    src={category.coverImage}
                    alt={`${category.name} editorial category`}
                    fill
                    sizes="(min-width: 1280px) 16vw, (min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#5E1428]/10 p-4 text-center">
                    <span className="font-serif text-lg font-bold text-foreground">
                      {category.name}
                    </span>
                  </div>
                )}

                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-linear-to-t from-black/95 via-black/35 to-transparent"
                />

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 sm:p-4">
                  <div className="min-w-0 flex-1">
                    <span
                      className={`mb-1 block text-[9px] font-semibold uppercase tracking-[0.14em] text-white/75 ${
                        isRightToLeft ? "text-right" : "text-left"
                      }`}
                      dir="ltr"
                    >
                      {category.languageLabel}
                    </span>

                    <span
                      className={`block w-full text-white ${
                        isRightToLeft
                          ? "font-urdu-text text-right text-base font-bold leading-loose"
                          : "text-left font-serif text-sm font-bold leading-snug sm:text-base"
                      }`}
                    >
                      {category.name}
                    </span>
                  </div>

                  <span
                    aria-hidden="true"
                    className="mb-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-white/40 text-white transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-[#5E1428]"
                  >
                    <ArrowUpRight className="size-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
        ENEENA publishes distinct editorial work in English, Urdu, Arabic,
        German, Hindi and Chinese. Available categories depend on the
        language sections currently published on the platform.
      </p>
    </section>
  );
}
