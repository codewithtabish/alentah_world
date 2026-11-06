
import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/actions/categories/get-categories";

const EDITORIAL_LANGUAGES = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    direction: "ltr",
  },
  {
    code: "ur",
    name: "Urdu",
    nativeName: "اردو",
    direction: "rtl",
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    direction: "rtl",
  },
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    direction: "ltr",
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    direction: "ltr",
  },
  {
    code: "zh",
    name: "Chinese",
    nativeName: "中文",
    direction: "ltr",
  },
] as const;

export async function AboutCategoriesWrapper() {
  const res = await getCategories();

  if (!res.success || !res.categories) {
    return (
      <p className="text-sm text-muted-foreground">
        Editorial categories are currently unavailable.
      </p>
    );
  }

  const activeCategories = res.categories.filter(
    (category) =>
      category.isActive &&
      EDITORIAL_LANGUAGES.some(
        (language) => language.code === category.language.code,
      ),
  );

  const languageSections = EDITORIAL_LANGUAGES.map((language) => ({
    ...language,
    categories: activeCategories.filter(
      (category) => category.language.code === language.code,
    ),
  }));

  return (
    <div className="space-y-12">
      {languageSections.map((language) => {
        if (language.categories.length === 0) {
          return null;
        }

        return (
          <section
            key={language.code}
            lang={language.code}
            dir={language.direction}
            aria-labelledby={`about-categories-${language.code}`}
            className="space-y-5"
          >
            <div className="flex items-center gap-3">
              <h3
                id={`about-categories-${language.code}`}
                className="font-serif text-xl font-bold text-primary"
              >
                {language.nativeName}
              </h3>

              <span className="h-px flex-1 bg-border" />

              <span className="text-xs text-muted-foreground" dir="ltr">
                {language.categories.length}{" "}
                {language.categories.length === 1
                  ? "category"
                  : "categories"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {language.categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/${language.code}/${category.slug}`}
                  className="group flex min-w-0 flex-col gap-3"
                >
                  <div className="relative aspect-4/5 w-full overflow-hidden rounded-md border border-border/50 bg-muted">
                    {category.coverImage ? (
                      <Image
                        src={category.coverImage}
                        alt={category.name}
                        fill
                        sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted px-2 text-center text-xs text-muted-foreground">
                        {language.code === "ur"
                          ? "تصویر دستیاب نہیں"
                          : language.code === "ar"
                            ? "الصورة غير متاحة"
                            : language.code === "hi"
                              ? "चित्र उपलब्ध नहीं"
                              : language.code === "zh"
                                ? "暂无图片"
                                : language.code === "de"
                                  ? "Kein Bild"
                                  : "No Image"}
                      </div>
                    )}
                  </div>

                  <span className="text-center font-serif text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {activeCategories.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No active editorial categories are available yet.
        </p>
      )}
    </div>
  );
}
