// ============================================================
// Navbar category data — ALENTAH WORLD
// English / Urdu / Arabic editions
// Edit names, slugs and subcategories here.
// ============================================================

export type LanguageCode = "en" | "ur" | "ar";

export interface NavSubcategory {
  name: string;
  slug: string;
}

export interface NavCategory {
  name: string;
  slug: string;
  subcategories: NavSubcategory[];
}

export interface NavLanguage {
  code: LanguageCode;
  /** Text shown on the language button */
  label: string;
  editionTitle: string;
  editionTagline: string;
  dir: "ltr" | "rtl";
  /** URL prefix for this edition ("" for the default language) */
  basePath: string;
  categories: NavCategory[];
}

// ------------------------------------------------------------
// LANGUAGES
// ------------------------------------------------------------

export const navLanguages: Record<LanguageCode, NavLanguage> = {
  en: {
    code: "en",
    label: "English",
    editionTitle: "English Edition",
    editionTagline: "Independent English newsroom",
    dir: "ltr",
    basePath: "",
    categories: [
      {
        name: "Technology",
        slug: "technology",
        subcategories: [
          { name: "Artificial Intelligence", slug: "artificial-intelligence" },
          { name: "Software", slug: "software" },
          { name: "Startups", slug: "startups" },
        ],
      },
      {
        name: "Business",
        slug: "business",
        subcategories: [
          { name: "Finance", slug: "finance" },
          { name: "Markets", slug: "markets" },
          { name: "Entrepreneurship", slug: "entrepreneurship" },
        ],
      },
      {
        name: "Politics",
        slug: "politics",
        subcategories: [
          { name: "Government", slug: "government" },
          { name: "Elections", slug: "elections" },
          { name: "Public Policy", slug: "public-policy" },
        ],
      },
      {
        name: "Science",
        slug: "science",
        subcategories: [
          { name: "Space", slug: "space" },
          { name: "Research", slug: "research" },
          { name: "Health", slug: "health" },
        ],
      },
      {
        name: "World",
        slug: "world",
        subcategories: [
          { name: "International Affairs", slug: "international-affairs" },
          { name: "Analysis", slug: "analysis" },
        ],
      },
      {
        name: "Culture",
        slug: "culture",
        subcategories: [
          { name: "Arts", slug: "arts" },
          { name: "Literature", slug: "literature" },
          { name: "Society", slug: "society" },
        ],
      },
    ],
  },

  ur: {
    code: "ur",
    label: "اردو",
    editionTitle: "اردو ایڈیشن",
    editionTagline: "آزاد اردو نیوز روم",
    dir: "rtl",
    basePath: "/ur",
    categories: [
      {
        name: "ٹیکنالوجی",
        slug: "technology",
        subcategories: [
          { name: "مصنوعی ذہانت", slug: "artificial-intelligence" },
          { name: "سافٹ ویئر", slug: "software" },
          { name: "اسٹارٹ اپس", slug: "startups" },
        ],
      },
      {
        name: "کاروبار",
        slug: "business",
        subcategories: [
          { name: "مالیات", slug: "finance" },
          { name: "منڈیاں", slug: "markets" },
          { name: "انٹرپرینیورشپ", slug: "entrepreneurship" },
        ],
      },
      {
        name: "سیاست",
        slug: "politics",
        subcategories: [
          { name: "حکومت", slug: "government" },
          { name: "انتخابات", slug: "elections" },
          { name: "عوامی پالیسی", slug: "public-policy" },
        ],
      },
      {
        name: "سائنس",
        slug: "science",
        subcategories: [
          { name: "خلا", slug: "space" },
          { name: "تحقیق", slug: "research" },
          { name: "صحت", slug: "health" },
        ],
      },
      {
        name: "دنیا",
        slug: "world",
        subcategories: [
          { name: "بین الاقوامی امور", slug: "international-affairs" },
          { name: "تجزیہ", slug: "analysis" },
        ],
      },
      {
        name: "ثقافت",
        slug: "culture",
        subcategories: [
          { name: "فنون", slug: "arts" },
          { name: "ادب", slug: "literature" },
          { name: "معاشرہ", slug: "society" },
        ],
      },
    ],
  },

  ar: {
    code: "ar",
    label: "العربية",
    editionTitle: "النسخة العربية",
    editionTagline: "غرفة أخبار عربية مستقلة",
    dir: "rtl",
    basePath: "/ar",
    categories: [
      {
        name: "التكنولوجيا",
        slug: "technology",
        subcategories: [
          { name: "الذكاء الاصطناعي", slug: "artificial-intelligence" },
          { name: "البرمجيات", slug: "software" },
          { name: "الشركات الناشئة", slug: "startups" },
        ],
      },
      {
        name: "الأعمال",
        slug: "business",
        subcategories: [
          { name: "المال", slug: "finance" },
          { name: "الأسواق", slug: "markets" },
          { name: "ريادة الأعمال", slug: "entrepreneurship" },
        ],
      },
      {
        name: "السياسة",
        slug: "politics",
        subcategories: [
          { name: "الحكومة", slug: "government" },
          { name: "الانتخابات", slug: "elections" },
          { name: "السياسات العامة", slug: "public-policy" },
        ],
      },
      {
        name: "العلوم",
        slug: "science",
        subcategories: [
          { name: "الفضاء", slug: "space" },
          { name: "الأبحاث", slug: "research" },
          { name: "الصحة", slug: "health" },
        ],
      },
      {
        name: "العالم",
        slug: "world",
        subcategories: [
          { name: "الشؤون الدولية", slug: "international-affairs" },
          { name: "التحليل", slug: "analysis" },
        ],
      },
      {
        name: "الثقافة",
        slug: "culture",
        subcategories: [
          { name: "الفنون", slug: "arts" },
          { name: "الأدب", slug: "literature" },
          { name: "المجتمع", slug: "society" },
        ],
      },
    ],
  },
};

export const navLanguageList: NavLanguage[] = [
  navLanguages.en,
  navLanguages.ur,
  navLanguages.ar,
];

// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------

export function getCategoryHref(lang: NavLanguage, categorySlug: string) {
  return `${lang.basePath}/${categorySlug}`;
}

export function getSubcategoryHref(
  lang: NavLanguage,
  categorySlug: string,
  subcategorySlug: string,
) {
  return `${lang.basePath}/${categorySlug}?sub=${subcategorySlug}`;
}

export function getLanguageFromPathname(pathname: string): LanguageCode {
  if (pathname === "/ur" || pathname.startsWith("/ur/")) return "ur";
  if (pathname === "/ar" || pathname.startsWith("/ar/")) return "ar";
  return "en";
}