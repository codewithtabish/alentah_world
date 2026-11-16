
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  Gem,
  Users,
  Handshake,
  Info,
  BookOpen,
  Lightbulb,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { WritingCategories } from "@/components/site/pages/write/writing-categories";

// -----------------------------------------------------------------------------
// ENEENA — Website identity
// -----------------------------------------------------------------------------

const SITE_URL = "https://www.eneena.com";
const SITE_NAME = "ENEENA";
const PAGE_URL = `${SITE_URL}/write-for-us`;

// -----------------------------------------------------------------------------
// SEO configuration
// -----------------------------------------------------------------------------

const PAGE_TITLE =
  "Write for ENEENA | Become a Contributor to Our Global Publication";

const PAGE_DESCRIPTION =
  "Write for ENEENA, an independent international publication available in 12 languages. Submit original articles, research, analysis, opinions and personal stories to our editorial team.";

// -----------------------------------------------------------------------------
// Social sharing
// -----------------------------------------------------------------------------

const OG_IMAGE = `${SITE_URL}/images/og-image.jpg`;

const OG_IMAGE_ALT =
  "ENEENA — Independent Journalism, Global Perspectives";

// -----------------------------------------------------------------------------
// Metadata
// -----------------------------------------------------------------------------

export const metadata: Metadata = {
  title: {
    absolute: PAGE_TITLE,
  },

  description: PAGE_DESCRIPTION,

  alternates: {
    canonical: PAGE_URL,
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    locale: "en_US",

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

    images: [
      {
        url: OG_IMAGE,
        alt: OG_IMAGE_ALT,
      },
    ],
  },
};

// -----------------------------------------------------------------------------
// Contributor guidelines
// -----------------------------------------------------------------------------

const GUIDELINES = [
  "Submit original work that you have the right to publish.",
  "Use reliable sources and verify factual claims.",
  "Write clearly, thoughtfully and for a real audience.",
  "Include references and links for important claims.",
  "Use images only when you have the necessary rights.",
  "Maintain respectful, professional and responsible language.",
];

// -----------------------------------------------------------------------------
// Contributor benefits
// -----------------------------------------------------------------------------

const BENEFITS = [
  {
    icon: Globe,
    title: "An International Platform",
    description:
      "Share your ideas with readers interested in perspectives and stories from around the world.",
  },
  {
    icon: Gem,
    title: "Editorial Presentation",
    description:
      "Present your work in a publication that values clarity, substance and thoughtful storytelling.",
  },
  {
    icon: Users,
    title: "Meaningful Discussion",
    description:
      "Contribute informed perspectives to conversations about the issues shaping our world.",
  },
  {
    icon: Handshake,
    title: "A Wider Community",
    description:
      "Become part of an international community of writers, researchers and thinkers.",
  },
];

// -----------------------------------------------------------------------------
// Submission process
// -----------------------------------------------------------------------------

const SUBMISSION_STEPS = [
  {
    number: "01",
    title: "Choose Your Subject",
    description:
      "Explore our editorial categories and identify a subject you can contribute to meaningfully.",
  },
  {
    number: "02",
    title: "Prepare Your Work",
    description:
      "Develop an original, well-researched article with a clear argument and reliable sources.",
  },
  {
    number: "03",
    title: "Contact Our Team",
    description:
      "Send us your article idea, a draft or a brief proposal through our contact page.",
  },
  {
    number: "04",
    title: "Editorial Assessment",
    description:
      "Our editorial team considers submissions for relevance, accuracy, originality and quality.",
  },
];

// -----------------------------------------------------------------------------
// Frequently asked questions
// -----------------------------------------------------------------------------

const FAQS = [
  {
    question: "Who can contribute to ENEENA?",
    answer:
      "Writers, researchers, professionals, students and independent thinkers are welcome to contact our editorial team. We consider submissions on their originality, relevance, research quality and suitability for our readers rather than relying solely on professional credentials.",
  },
  {
    question: "What topics does ENEENA cover?",
    answer:
      "Our editorial interests include world affairs, geopolitics, politics, governance, technology, artificial intelligence, science, business, finance, economics, history, civilizations, archaeology, culture, society, education, philosophy, religion, lifestyle, travel, the environment and human stories.",
  },
  {
    question: "Can I submit an article in my own language?",
    answer:
      "ENEENA publishes editorial content across 12 language editions: English, Urdu, Arabic, German, Hindi, Chinese, Spanish, French, Brazilian Portuguese, Japanese, Bengali and Indonesian. Contact our editorial team about a submission in your preferred language. Each contribution should be written naturally for its intended audience rather than being an automatically translated copy.",
  },
  {
    question: "What should I include in my submission?",
    answer:
      "Please include your proposed title or subject, a short summary of the article, your preferred publication language, a brief author biography and links to relevant previous work if available. You may also include a complete draft and its references.",
  },
  {
    question: "Can I submit previously published content?",
    answer:
      "Our preference is for original work that has not already appeared elsewhere. If your article has been published before, tell us where and when it appeared and clarify the publication rights before submitting it.",
  },
  {
    question: "Do you accept AI-assisted articles?",
    answer:
      "Submissions must reflect the author's own judgement, research and responsibility. Authors must independently verify facts, references and quotations. Do not submit unverified machine-generated material or present another person's work as your own. Disclose substantial AI assistance when contacting the editorial team.",
  },
  {
    question: "Who owns the copyright to an accepted article?",
    answer:
      "Copyright and publication permissions should be clarified with the editorial team before publication. Please do not submit material unless you have the necessary rights and authority to share it.",
  },
  {
    question: "How long does the editorial review take?",
    answer:
      "Review times depend on the subject, submission volume and editorial requirements. Our team will communicate with you if your submission is selected for further consideration. Sending a submission does not guarantee acceptance or publication.",
  },
];

// -----------------------------------------------------------------------------
// Structured data — WebPage, BreadcrumbList and FAQPage
// -----------------------------------------------------------------------------

const jsonLd = {
  "@context": "https://schema.org",

  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      inLanguage: "en",

      isPartOf: {
        "@id": `${SITE_URL}/#website`,
      },

      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },

      about: {
        "@id": `${SITE_URL}/#organization`,
      },

      mainEntity: {
        "@id": `${PAGE_URL}#faq`,
      },

      breadcrumb: {
        "@id": `${PAGE_URL}#breadcrumb`,
      },

      primaryImageOfPage: {
        "@type": "ImageObject",
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        caption: OG_IMAGE_ALT,
      },
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
          name: "Write for Us",
          item: PAGE_URL,
        },
      ],
    },

    {
      "@type": "FAQPage",
      "@id": `${PAGE_URL}#faq`,

      isPartOf: {
        "@id": `${PAGE_URL}#webpage`,
      },

      mainEntity: FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.question,

        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ],
};

// -----------------------------------------------------------------------------
// Safely serialize structured data
// -----------------------------------------------------------------------------

const serializedJsonLd = JSON.stringify(jsonLd)
  .replace(/</g, "\\u003c")
  .replace(/\u2028/g, "\\u2028")
  .replace(/\u2029/g, "\\u2029");

// -----------------------------------------------------------------------------
// Write for ENEENA page
// -----------------------------------------------------------------------------

export default function WriteForUsPage() {
  const titleFont = "font-serif";
  const bodyFont = "font-sans";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializedJsonLd }}
      />

      <main className="flex flex-col" dir="ltr">
        {/* HERO */}
        <section
          aria-labelledby="write-hero-title"
          className="relative flex min-h-120 w-full items-center lg:min-h-145"
        >
          <div className="absolute inset-0">
            <Image
              src="/images/write/write_for_us_cover.webp"
              alt="A writer developing ideas and working on an article"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />

            <div
              aria-hidden="true"
              className="absolute inset-0 bg-black/65"
            />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-7xl py-20 lg:py-28">
            <div className="max-w-3xl">
              <div className="mb-6 flex items-center gap-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/85">
                  Contribute to ENEENA
                </span>

                <span
                  aria-hidden="true"
                  className="h-px w-12 bg-white/60"
                />
              </div>

              <h1
                id="write-hero-title"
                className={cn(
                  "mb-6 text-4xl font-bold leading-[1.12] text-white sm:text-5xl lg:text-7xl",
                  titleFont,
                )}
              >
                Your Voice Deserves
                <br />
                a Wider Audience.
              </h1>

              <p
                className={cn(
                  "mb-9 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg lg:text-xl",
                  bodyFont,
                )}
              >
                Have an idea worth sharing? Contribute original journalism,
                research, analysis and stories to ENEENA — an international
                publication bringing thoughtful perspectives to readers
                across languages and borders.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center justify-center rounded-sm bg-primary px-8 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  Contact the Editorial Team
                  <ArrowRight className="ms-2 size-4" aria-hidden="true" />
                </Link>

                <Link
                  href="#guidelines"
                  className="inline-flex h-12 items-center justify-center border border-white/60 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Read Contributor Guidelines
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* INTRODUCTION */}
        <section
          aria-labelledby="why-write-title"
          className="w-full border-b border-border"
        >
          <div className="mx-auto max-w-7xl py-16 lg:py-20">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-3">
                <span className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  Why contribute
                </span>

                <h2
                  id="why-write-title"
                  className={cn(
                    "mb-4 text-3xl font-bold leading-tight text-foreground",
                    titleFont,
                  )}
                >
                  Why Write for ENEENA?
                </h2>

                <p
                  className={cn(
                    "text-sm leading-relaxed text-muted-foreground",
                    bodyFont,
                  )}
                >
                  We believe thoughtful writing can broaden perspectives,
                  encourage understanding and make important ideas accessible
                  to readers around the world.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:col-span-9 lg:grid-cols-4">
                {BENEFITS.map((item) => {
                  const Icon = item.icon;

                  return (
                    <article
                      key={item.title}
                      className="flex flex-col gap-3"
                    >
                      <Icon
                        className="size-8 text-primary"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />

                      <h3
                        className={cn(
                          "text-base font-bold text-foreground",
                          titleFont,
                        )}
                      >
                        {item.title}
                      </h3>

                      <p
                        className={cn(
                          "text-sm leading-relaxed text-muted-foreground",
                          bodyFont,
                        )}
                      >
                        {item.description}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* EDITORIAL CATEGORIES */}
        <section
          aria-labelledby="writing-categories-heading"
          className="w-full py-16 lg:py-20"
        >
          <div className="mx-auto max-w-7xl">
            <Suspense
              fallback={
                <div
                  className="flex min-h-48 items-center justify-center text-sm text-muted-foreground"
                  role="status"
                  aria-live="polite"
                >
                  Loading editorial categories...
                </div>
              }
            >
              <WritingCategories />
            </Suspense>
          </div>
        </section>

        {/* CONTRIBUTOR GUIDELINES */}
        <section
          id="guidelines"
          aria-labelledby="guidelines-heading"
          className="w-full border-y border-border bg-muted/30 py-16 lg:py-20"
        >
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 lg:flex-row lg:gap-16">
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl border border-border/60 lg:aspect-square lg:w-1/3">
              <Image
                src="/images/write/book.webp"
                alt="Books and reading glasses representing research and thoughtful writing"
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover"
              />
            </div>

            <div className="w-full lg:w-2/3">
              <span className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-primary">
                Our editorial standards
              </span>

              <h2
                id="guidelines-heading"
                className={cn(
                  "mb-4 text-3xl font-bold text-foreground sm:text-4xl",
                  titleFont,
                )}
              >
                Contributor Guidelines
              </h2>

              <p
                className={cn(
                  "mb-7 max-w-2xl text-sm leading-relaxed text-muted-foreground",
                  bodyFont,
                )}
              >
                Every contribution should offer readers something valuable.
                We look for original thinking, responsible research and
                writing that respects the intelligence of its audience.
              </p>

              <ul className="mb-8 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                {GUIDELINES.map((rule) => (
                  <li key={rule} className="flex items-start gap-3">
                    <CheckCircle2
                      className="mt-0.5 size-5 shrink-0 text-primary"
                      strokeWidth={1.7}
                      aria-hidden="true"
                    />

                    <span
                      className={cn(
                        "text-sm leading-relaxed text-foreground",
                        bodyFont,
                      )}
                    >
                      {rule}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex items-start gap-3 rounded-lg border border-amber-300/60 bg-amber-50 p-4 text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
                <Info
                  className="mt-0.5 size-5 shrink-0"
                  aria-hidden="true"
                />

                <p className={cn("text-xs leading-relaxed", bodyFont)}>
                  All submissions are subject to editorial assessment.
                  Contacting ENEENA or submitting an article does not
                  guarantee acceptance or publication.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SUBMISSION PROCESS */}
        <section
          id="submission-process"
          aria-labelledby="submission-process-heading"
          className="w-full py-16 lg:py-20"
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
              <div className="w-full lg:w-1/4">
                <span className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  How it works
                </span>

                <h2
                  id="submission-process-heading"
                  className={cn(
                    "mb-4 text-3xl font-bold text-foreground",
                    titleFont,
                  )}
                >
                  Submission Process
                </h2>

                <p
                  className={cn(
                    "text-sm leading-relaxed text-muted-foreground",
                    bodyFont,
                  )}
                >
                  A straightforward path from your first idea to an
                  editorial conversation.
                </p>
              </div>

              <ol className="relative grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:w-3/4 lg:grid-cols-4">
                <div
                  aria-hidden="true"
                  className="absolute left-5 right-5 top-5 hidden h-px bg-border lg:block"
                />

                {SUBMISSION_STEPS.map((step) => (
                  <li
                    key={step.number}
                    className="relative flex flex-col gap-3"
                  >
                    <span className="relative z-10 flex size-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground ring-8 ring-background">
                      {step.number}
                    </span>

                    <h3
                      className={cn(
                        "text-base font-bold text-foreground",
                        titleFont,
                      )}
                    >
                      {step.title}
                    </h3>

                    <p
                      className={cn(
                        "text-sm leading-relaxed text-muted-foreground",
                        bodyFont,
                      )}
                    >
                      {step.description}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* SUBMISSION CONTACT */}
        <section
          aria-labelledby="submission-contact-heading"
          className="w-full border-y border-border py-16 lg:py-20"
        >
          <div className="mx-auto max-w-4xl text-center">
            <span className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Start a conversation
            </span>

            <h2
              id="submission-contact-heading"
              className={cn(
                "mb-5 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl",
                titleFont,
              )}
            >
              Let&apos;s Hear Your Story.
            </h2>

            <p
              className={cn(
                "mx-auto mb-9 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg",
                bodyFont,
              )}
            >
              Have a compelling idea, a researched article or a perspective
              that deserves a thoughtful audience? Introduce yourself and
              tell our editorial team what you would like to contribute.
            </p>

            <div className="mb-8 rounded-2xl border border-border bg-background p-7 shadow-sm sm:p-12">
              <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <BookOpen
                  className="size-7"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>

              <h3
                className={cn(
                  "mb-4 text-2xl font-bold text-foreground",
                  titleFont,
                )}
              >
                Have an Article Idea?
              </h3>

              <p
                className={cn(
                  "mx-auto mb-8 max-w-xl text-sm leading-relaxed text-muted-foreground",
                  bodyFont,
                )}
              >
                Contact us with your proposed subject, a short article
                summary, your preferred language and a brief author
                biography. You can also share a draft or examples of your
                previous work.
              </p>

              <Link
                href="/contact"
                className="inline-flex min-h-14 items-center justify-center rounded-sm bg-primary px-8 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:px-10 sm:text-base"
              >
                Contact the ENEENA Editorial Team
                <ArrowRight className="ms-3 size-5" aria-hidden="true" />
              </Link>

              <p
                className={cn(
                  "mt-6 text-xs leading-relaxed text-muted-foreground",
                  bodyFont,
                )}
              >
                All proposals are subject to editorial review. Publication
                timelines and decisions vary by submission.
              </p>
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section
          aria-labelledby="faq-heading"
          className="w-full border-t border-border py-16 lg:py-20"
        >
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <span className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-primary">
                Before you submit
              </span>

              <h2
                id="faq-heading"
                className={cn(
                  "text-3xl font-bold text-foreground sm:text-4xl",
                  titleFont,
                )}
              >
                Frequently Asked Questions
              </h2>

              <p
                className={cn(
                  "mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground",
                  bodyFont,
                )}
              >
                Find answers about contributing, editorial standards,
                supported languages and the submission process.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {FAQS.map((faq, index) => (
                <details
                  key={faq.question}
                  className="group overflow-hidden rounded-lg border border-border bg-background"
                  open={index === 0}
                >
                  <summary
                    className={cn(
                      "flex cursor-pointer list-none items-center justify-between gap-5 p-5 text-left font-bold text-foreground transition-colors hover:bg-muted/40 [&::-webkit-details-marker]:hidden",
                      titleFont,
                    )}
                  >
                    <span>{faq.question}</span>

                    <span
                      aria-hidden="true"
                      className="shrink-0 text-xl font-light text-muted-foreground transition-transform duration-200 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>

                  <div
                    className={cn(
                      "border-t border-border px-5 pb-5 pt-4 text-sm leading-relaxed text-muted-foreground",
                      bodyFont,
                    )}
                  >
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CONTRIBUTOR CTA */}
        <section className="relative w-full overflow-hidden bg-primary py-16 text-primary-foreground lg:py-20">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[url('/images/world-map.png')] bg-cover bg-center opacity-[0.09] mix-blend-overlay"
          />

          <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
            <div className="max-w-2xl text-center md:text-left">
              <div className="mb-3 flex items-center justify-center gap-2 md:justify-start">
                <Lightbulb
                  className="size-5 text-primary-foreground/80"
                  aria-hidden="true"
                />

                <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground/75">
                  Ideas that travel
                </span>
              </div>

              <h2
                className={cn(
                  "mb-3 text-3xl font-bold sm:text-4xl",
                  titleFont,
                )}
              >
                Every Great Publication Begins With a Voice.
              </h2>

              <p
                className={cn(
                  "text-base leading-relaxed text-primary-foreground/80",
                  bodyFont,
                )}
              >
                Bring your knowledge, curiosity and perspective to ENEENA.
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-background px-8 text-sm font-bold text-foreground transition-colors hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            >
              Become a Contributor
              <ArrowRight className="ms-2 size-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
