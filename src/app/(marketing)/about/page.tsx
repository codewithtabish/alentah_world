import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { AboutCategoriesWrapper } from "@/components/site/pages/about/about-categories-wrapper";

// -----------------------------------------------------------------------------
// ENEENA — Brand and SEO configuration
// -----------------------------------------------------------------------------

const SITE_URL = "https://www.eneena.com";
const SITE_NAME = "ENEENA";
const PAGE_URL = `${SITE_URL}/about`;

const PAGE_TITLE = "About ENEENA | Independent Journalism & Global Perspectives";

const PAGE_DESCRIPTION =
  "ENEENA is an independent international publication offering thoughtful journalism on world affairs, technology, science, business and culture in 12 languages.";

const OG_IMAGE = "/images/og-image.jpg";
const OG_IMAGE_ALT = "ENEENA — Independent Journalism, Global Perspectives";

// -----------------------------------------------------------------------------
// Search engine metadata
// -----------------------------------------------------------------------------

export const metadata: Metadata = {
  title: {
    absolute: PAGE_TITLE,
  },

  description: PAGE_DESCRIPTION,

  alternates: {
    canonical: PAGE_URL,
  },

  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    locale: "en_US",
    alternateLocale: ["ur_PK", "ar_AR", "de_DE", "hi_IN", "zh_CN", "es_ES", "fr_FR", "pt_BR", "ja_JP", "bn_BD", "id_ID"],
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: OG_IMAGE_ALT,
        type: "image/jpeg",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [{ url: OG_IMAGE, alt: OG_IMAGE_ALT }],
  },
};

// -----------------------------------------------------------------------------
// Page-level structured data
// -----------------------------------------------------------------------------

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: "About ENEENA",
      description: PAGE_DESCRIPTION,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
      mainEntity: { "@id": `${SITE_URL}/#organization` },
      breadcrumb: { "@id": `${PAGE_URL}#breadcrumb` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${SITE_URL}${OG_IMAGE}`,
        width: 1200,
        height: 630,
      },
      inLanguage: "en",
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${PAGE_URL}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "About",
          item: PAGE_URL,
        },
      ],
    },
  ],
};

// -----------------------------------------------------------------------------
// Reusable styling
// -----------------------------------------------------------------------------

const eyebrow =
  "mb-3 block text-xs font-bold uppercase tracking-[0.2em] text-primary";

// -----------------------------------------------------------------------------
// Editorial philosophy
// -----------------------------------------------------------------------------

const storyPoints = [
  {
    title: "Depth over noise.",
    desc: "We go beyond the surface to find what truly matters.",
  },
  {
    title: "Context over superficial headlines.",
    desc: "We examine the bigger picture, the underlying forces and the wider implications.",
  },
  {
    title: "Quality over quantity.",
    desc: "We value thoughtful reporting and meaningful work over publishing for volume.",
  },
  {
    title: "Curiosity without borders.",
    desc: "We explore ideas, cultures and perspectives from around the world.",
  },
  {
    title: "Independent thinking and meaningful storytelling.",
    desc: "We believe journalism should inform, inspire and encourage thoughtful dialogue.",
  },
];

// -----------------------------------------------------------------------------
// Editorial principles
// -----------------------------------------------------------------------------

const principles = [
  {
    num: "01.",
    title: "Accuracy & Verification",
    desc: "Claims are checked against credible sources, and facts are kept clearly separate from interpretation.",
  },
  {
    num: "02.",
    title: "Editorial Independence",
    desc: "Our coverage is shaped by evidence and editorial judgment, never by outside pressure.",
  },
  {
    num: "03.",
    title: "Transparency & Corrections",
    desc: "We show our sources, label opinion clearly and correct mistakes openly when they happen.",
  },
  {
    num: "04.",
    title: "Respect for Every Culture",
    desc: "We write with fairness, care and context for readers of every language and background.",
  },
];

// -----------------------------------------------------------------------------
// ENEENA's 12 Editorial Languages
// -----------------------------------------------------------------------------

const languages = [
  { name: "English", nativeName: "English", code: "en", dir: "ltr", className: "font-serif" },
  { name: "Urdu", nativeName: "اردو", code: "ur", dir: "rtl", className: "font-urdu-display" },
  { name: "Arabic", nativeName: "العربية", code: "ar", dir: "rtl", className: "font-arabic-display" },
  { name: "German", nativeName: "Deutsch", code: "de", dir: "ltr", className: "font-serif" },
  { name: "Hindi", nativeName: "हिन्दी", code: "hi", dir: "ltr", className: "font-hindi-display" },
  { name: "Chinese", nativeName: "中文", code: "zh", dir: "ltr", className: "font-chinese-display" },
  { name: "Spanish", nativeName: "Español", code: "es", dir: "ltr", className: "font-serif" },
  { name: "French", nativeName: "Français", code: "fr", dir: "ltr", className: "font-serif" },
  { name: "Portuguese (Brazil)", nativeName: "Português (Brasil)", code: "pt-BR", dir: "ltr", className: "font-serif" },
  { name: "Japanese", nativeName: "日本語", code: "ja", dir: "ltr", className: "font-serif" },
  { name: "Bengali", nativeName: "বাংলা", code: "bn", dir: "ltr", className: "font-serif" },
  { name: "Indonesian", nativeName: "Bahasa Indonesia", code: "id", dir: "ltr", className: "font-serif" },
] as const;

// -----------------------------------------------------------------------------
// About page
// -----------------------------------------------------------------------------

export default function AboutPage() {
  const fontClass = "font-sans";
  const titleFont = "font-serif";

  return (
    <div className="flex flex-col pb-0" dir="ltr">
      {/* Structured data for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      {/* ------------------------------------------------------------------ */}
      {/* 1. HERO */}
      {/* ------------------------------------------------------------------ */}

      <section className="relative w-full overflow-hidden bg-[#faf7f2] dark:bg-background">
        <div
          className={cn(
            "absolute inset-0 lg:left-auto lg:right-0 lg:w-[64%]",
            "[-webkit-mask-image:linear-gradient(to_top,transparent_0%,black_70%)] mask-[linear-gradient(to_top,transparent_0%,black_70%)]",
            "lg:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.55)_22%,black_55%)] lg:mask-[linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.55)_22%,black_55%)]",
          )}
        >
          <Image
            src="/images/about/about_cover.webp"
            alt="ENEENA — Independent journalism and global perspectives"
            fill
            priority
            sizes="(min-width: 1024px) 64vw, 100vw"
            className="object-cover object-[70%_center]"
          />
        </div>

        <div className="absolute inset-0 bg-[#faf7f2]/70 dark:bg-background/70 lg:hidden" />

        <div className="relative mx-auto flex min-h-105 w-full max-w-7xl items-center px-4 py-16 sm:px-6 lg:min-h-125 lg:px-8 lg:py-24">
          <div className="max-w-xl">
            {/* Visible breadcrumb (matches the BreadcrumbList structured data) */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol
                className={cn(
                  "flex items-center gap-2 text-xs text-foreground/70",
                  fontClass,
                )}
              >
                <li>
                  <Link href="/" className="hover:text-primary hover:underline">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="font-semibold text-primary">
                  About
                </li>
              </ol>
            </nav>

            <span className={eyebrow}>About ENEENA</span>

            <h1
              className={cn(
                "mb-6 text-4xl font-bold leading-[1.1] text-primary sm:text-5xl lg:text-[3.5rem]",
                titleFont,
              )}
            >
              A World of Stories.
              <br />
              A Clearer Way of Seeing.
            </h1>

            <p
              className={cn(
                "mb-8 max-w-md text-base leading-relaxed text-foreground/80",
                fontClass,
              )}
            >
              ENEENA is an independent international publication for curious
              minds, exploring the ideas, people and perspectives shaping our
              world through thoughtful journalism and meaningful storytelling.
            </p>

            <Link
              href="#our-story"
              className="inline-flex w-fit items-center gap-3 text-xs font-bold uppercase tracking-[0.15em] text-primary"
            >
              <span className="h-px w-10 bg-primary" />
              Our Story
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 2. OUR STORY */}
      {/* ------------------------------------------------------------------ */}

      <section
        id="our-story"
        aria-labelledby="our-story-heading"
        className="w-full bg-[#faf7f2] dark:bg-background"
      >
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:gap-0 lg:px-8 lg:py-16">
          <div className="lg:col-span-4 lg:pe-10">
            <span className={eyebrow}>Our Story</span>

            <h2
              id="our-story-heading"
              className={cn(
                "mb-5 text-3xl font-bold leading-tight text-primary sm:text-4xl",
                titleFont,
              )}
            >
              More Than Headlines.
              <br />
              Stories That Matter.
            </h2>

            <p
              className={cn(
                "leading-relaxed text-muted-foreground",
                fontClass,
              )}
            >
              ENEENA believes great journalism should do more than deliver
              information. It should create understanding, encourage curiosity
              and help readers see the world from different perspectives.
            </p>
          </div>

          <div className="space-y-5 lg:col-span-5 lg:border-s lg:border-border lg:px-10">
            {storyPoints.map((item) => (
              <div key={item.title} className="flex gap-4">
                <span
                  className="mt-2.5 h-0.5 w-5 shrink-0 bg-primary"
                  aria-hidden="true"
                />

                <div>
                  <h3
                    className={cn(
                      "mb-0.5 text-sm font-bold text-primary",
                      fontClass,
                    )}
                  >
                    {item.title}
                  </h3>

                  <p
                    className={cn(
                      "text-sm text-muted-foreground",
                      fontClass,
                    )}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3">
            <div className="relative aspect-square w-full overflow-hidden">
              <Image
                src="/images/about/sunset_man.webp"
                alt="A contemplative moment by the river"
                fill
                sizes="(min-width: 1024px) 25vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 3. EDITORIAL LEADERSHIP — FOUNDER ONLY */}
      {/* ------------------------------------------------------------------ */}

      <section
        aria-labelledby="leadership-heading"
        className="w-full bg-[#f5f0e8] dark:bg-muted/30"
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <span className={eyebrow}>The Person Behind ENEENA</span>

          <h2
            id="leadership-heading"
            className={cn(
              "mb-3 text-3xl font-bold text-primary sm:text-4xl",
              titleFont,
            )}
          >
            Editorial Leadership
          </h2>

          <p
            className={cn(
              "mb-10 max-w-md text-sm text-muted-foreground",
              fontClass,
            )}
          >
            An independent editorial vision built around thoughtful journalism,
            intellectual curiosity and global perspectives.
          </p>

          <div className="flex flex-col items-start gap-6 sm:flex-row">
            <div className="relative aspect-4/5 w-full shrink-0 overflow-hidden sm:w-64">
              <Image
                src="/images/about/editor.webp"
                alt="Talha Tabish, Founder and Editor-in-Chief of ENEENA"
                fill
                sizes="(min-width: 640px) 256px, 100vw"
                className="object-cover object-top"
              />
            </div>

            <div className="max-w-xl flex-1 sm:py-4">
              <h3
                className={cn(
                  "mb-1 text-2xl font-bold text-primary sm:text-3xl",
                  titleFont,
                )}
              >
                Talha Tabish
              </h3>

              <p
                className={cn(
                  "mb-5 text-sm font-bold text-foreground/70",
                  fontClass,
                )}
              >
                Founder &amp; Editor-in-Chief
              </p>

              <p
                className={cn(
                  "text-sm leading-relaxed text-muted-foreground",
                  fontClass,
                )}
              >
                ENEENA is built on the belief that journalism should encourage
                people to question, understand and think independently. As
                Founder and Editor-in-Chief, Talha Tabish leads the
                publication&apos;s vision and overall editorial direction,
                with a commitment to meaningful reporting, intellectual
                curiosity and perspectives that cross borders.
              </p>

              <span
                className="mt-6 block h-0.5 w-8 bg-primary"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 4. FROM THE EDITOR */}
      {/* ------------------------------------------------------------------ */}

      <section
        aria-label="From the Editor"
        className="w-full bg-[#faf7f2] dark:bg-background"
      >
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:gap-0 lg:px-8 lg:py-16">
          <div className="lg:col-span-4 lg:pe-10">
            <div className="relative aspect-3/2 w-full overflow-hidden">
              <Image
                src="/images/about/editor.webp"
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover object-[center_20%]"
              />
            </div>
          </div>

          <div className="lg:col-span-5 lg:pe-10">
            <span className={eyebrow}>From the Editor</span>

            <blockquote
              className={cn(
                "mb-5 text-2xl font-bold italic leading-snug text-primary sm:text-3xl",
                titleFont,
              )}
            >
              “We don’t chase trends.
              <br />
              We pursue truth, perspective and ideas that endure.”
            </blockquote>

            <p
              className={cn(
                "text-sm leading-relaxed text-muted-foreground",
                fontClass,
              )}
            >
              At ENEENA, we believe that great stories do more than inform —
              they help us see the world more clearly. In a time of endless
              noise, we choose depth over speed, quality over quantity and
              perspective over popularity.
            </p>
          </div>

          <div className="flex flex-col justify-center gap-5 lg:col-span-3 lg:border-s lg:border-border lg:ps-10">
            <div
              className="text-4xl italic text-foreground/80"
              aria-hidden="true"
              style={{
                fontFamily: "'Brush Script MT', 'Segoe Script', cursive",
              }}
            >
              TALHA TABISH
            </div>

            <div>
              <p
                className={cn(
                  "text-sm font-bold text-foreground",
                  fontClass,
                )}
              >
                Talha Tabish
              </p>

              <p
                className={cn(
                  "text-xs text-muted-foreground",
                  fontClass,
                )}
              >
                Founder &amp; Editor-in-Chief
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 5. WHAT GUIDES US */}
      {/* ------------------------------------------------------------------ */}

      <section
        aria-labelledby="guides-heading"
        className="w-full bg-[#f5f0e8] dark:bg-muted/30"
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <span className={eyebrow}>Our Editorial Standards</span>

          <h2
            id="guides-heading"
            className={cn(
              "mb-10 text-3xl font-bold text-primary sm:text-4xl",
              titleFont,
            )}
          >
            What Guides Us
          </h2>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
            {principles.map((item, i) => (
              <div
                key={item.num}
                className={cn(
                  "flex flex-col gap-2",
                  i > 0 && "lg:border-s lg:border-border lg:ps-8",
                  i < principles.length - 1 && "lg:pe-8",
                )}
              >
                <h3
                  className={cn(
                    "flex items-baseline gap-3 text-sm font-bold text-primary",
                    fontClass,
                  )}
                >
                  <span className="text-xs">{item.num}</span>
                  {item.title}
                </h3>

                <p
                  className={cn(
                    "text-sm leading-relaxed text-muted-foreground",
                    fontClass,
                  )}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 6. OUR EDITORIAL LANDSCAPE */}
      {/* ------------------------------------------------------------------ */}

      <section
        aria-labelledby="landscape-heading"
        className="w-full bg-[#faf7f2] dark:bg-background"
      >
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-8 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-16">
          <div className="lg:col-span-3">
            <span className={eyebrow}>What We Cover</span>

            <h2
              id="landscape-heading"
              className={cn(
                "text-3xl font-bold text-primary sm:text-4xl",
                titleFont,
              )}
            >
              Our Editorial Landscape
            </h2>

            <p
              className={cn(
                "mt-4 text-sm leading-relaxed text-muted-foreground",
                fontClass,
              )}
            >
              Explore the subjects and perspectives covered by ENEENA across
              all 12 independent editorial languages.
            </p>
          </div>

          <div className="lg:col-span-9">
            <Suspense
              fallback={
                <div className="flex h-32 animate-pulse items-center justify-center text-muted-foreground">
                  Loading editorial categories...
                </div>
              }
            >
              <AboutCategoriesWrapper />
            </Suspense>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 7. TWELVE LANGUAGES */}
      {/* ------------------------------------------------------------------ */}

      <section
        aria-labelledby="languages-heading"
        className="grid w-full grid-cols-1 border-y border-border bg-[#faf7f2] dark:bg-background lg:grid-cols-12"
      >
        <div className="relative min-h-55 w-full lg:col-span-3">
          <Image
            src="/images/about/books.webp"
            alt="Books representing ENEENA's multilingual editorial approach"
            fill
            sizes="(min-width: 1024px) 25vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center px-6 py-10 lg:col-span-4 lg:px-12">
          <span className={eyebrow}>A Multilingual Publication</span>

          <h2
            id="languages-heading"
            className={cn(
              "text-3xl font-bold leading-tight text-primary sm:text-4xl",
              titleFont,
            )}
          >
            Twelve Languages.
            <br />
            One Global Perspective.
          </h2>
        </div>

        <div className="flex flex-col justify-center px-6 pb-10 lg:col-span-5 lg:border-s lg:border-border lg:px-12 lg:py-10">
          <nav aria-label="ENEENA editions by language">
            <ul className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-3">
              {languages.map((language, index) => (
                <li key={language.code} className="flex items-center gap-3">
                  <Link
                    href={`/${language.code}`}
                    hrefLang={language.code}
                    lang={language.code}
                    dir={language.dir}
                    title={`ENEENA in ${language.name}`}
                    className={cn(
                      "text-lg font-bold text-primary transition-opacity hover:opacity-75",
                      language.className,
                    )}
                  >
                    {language.nativeName}
                  </Link>

                  {index < languages.length - 1 && (
                    <span
                      className="size-1 rounded-full bg-primary/60"
                      aria-hidden="true"
                    />
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <p
            className={cn(
              "max-w-md text-sm leading-relaxed text-muted-foreground",
              fontClass,
            )}
          >
            ENEENA publishes separate editorial content in English, Urdu,
            Arabic, German, Hindi, Chinese, Spanish, French, Portuguese,
            Japanese, Bengali, and Indonesian. Each language has its own voice,
            perspective and reading experience, reflecting the cultures and
            audiences it serves. Our aim is to make thoughtful journalism
            accessible across linguistic and cultural boundaries.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 8. BOTTOM BANNER */}
      {/* ------------------------------------------------------------------ */}

      <section
        aria-labelledby="commitment-heading"
        className="w-full bg-[#5E1428] py-14 text-[#FAF8F5]"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:gap-0 lg:px-8">
          <div className="lg:col-span-4 lg:pe-10">
            <span className="mb-3 block text-xs font-bold uppercase tracking-[0.2em] text-white/80">
              Our Commitment to Readers
            </span>

            <h2
              id="commitment-heading"
              className={cn("text-3xl font-bold leading-tight", titleFont)}
            >
              Your Curiosity Deserves Better Stories.
            </h2>
          </div>

          <div
            className={cn(
              "text-sm leading-relaxed text-white/85 lg:col-span-5 lg:border-s lg:border-white/20 lg:px-10",
              fontClass,
            )}
          >
            In a world that never stops publishing, we believe readers deserve
            more than another stream of headlines. They deserve thoughtful
            work, meaningful perspectives and stories worth their time.
          </div>

          <div className="flex justify-start lg:col-span-3 lg:justify-end lg:border-s lg:border-white/20 lg:ps-10">
            <Link
              href="/en"
              hrefLang="en"
              className="inline-flex items-center gap-2 border-b border-white/80 pb-1 text-sm font-bold text-white transition-opacity hover:opacity-80"
            >
              Explore Our Stories
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}