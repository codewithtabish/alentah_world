import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Dash, Eyebrow, H2, VDivider } from "./about-ui";
import { headingFont, signatureFont } from "@/data/about-fonts";
import { ABOUT_IMAGES, BAND_A, BAND_B, BAND_CTA, BODY, CONTAINER, INK, LANGUAGES, LEADERS, MAROON_BORDER, MAROON_TEXT, PHILOSOPHY, RULE, STORY_VALUES } from "@/data/about-data";

/* ================================ HERO ================================ */

export function AboutHero() {
  return (
    <section
      aria-labelledby="about-hero-title"
      className={`relative isolate overflow-hidden ${BAND_A}`}
    >
      {/* Mobile / tablet image */}
      <div className="relative aspect-video w-full lg:hidden">
        <Image
          src={ABOUT_IMAGES.cover}
          alt="A writer's desk at golden hour with a leather notebook, fountain pen and tea, overlooking the river and Parliament"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Desktop image: bleeds to the right edge, fades into the page */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[62%] mask-[linear-gradient(to_right,transparent,black_38%)] lg:block">
        <Image
          src={ABOUT_IMAGES.cover}
          alt=""
          aria-hidden
          fill
          priority
          sizes="62vw"
          className="object-cover object-[50%_40%]"
        />
      </div>

      <div
        className={`${CONTAINER} relative z-10 flex items-center py-10 lg:min-h-88 lg:py-14`}
      >
        <div className="flex max-w-xl flex-col gap-6">
          <Eyebrow>About Alentah World</Eyebrow>
          <h1
            id="about-hero-title"
            className={`${headingFont.className} text-4xl leading-[1.12] sm:text-5xl xl:text-[3.4rem] ${MAROON_TEXT}`}
          >
            A World of Stories.
            <br />A Clearer Way of Seeing.
          </h1>
          <p className={`max-w-md text-[15px] leading-relaxed ${BODY}`}>
            An independent publication for curious minds, exploring the ideas,
            people, and perspectives shaping our world through thoughtful
            journalism and meaningful storytelling.
          </p>
          <Link
            href="#our-story"
            className={`group inline-flex items-center gap-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${MAROON_TEXT}`}
          >
            <Dash className="w-10" />
            Our Story
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ================================ STORY ================================ */

export function AboutStory() {
  return (
    <section
      id="our-story"
      aria-labelledby="our-story-title"
      className={`scroll-mt-24 py-10 md:py-12 ${BAND_B}`}
    >
      <div
        className={`${CONTAINER} grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.1fr)_minmax(0,0.78fr)] lg:gap-x-10`}
      >
        <div className="flex flex-col gap-5">
          <Eyebrow>Our Story</Eyebrow>
          <H2 id="our-story-title">
            More Than Headlines.
            <br />
            Stories That Matter.
          </H2>
          <p className={`max-w-sm text-sm leading-relaxed ${BODY}`}>
            Alentah World believes great journalism should do more than deliver
            information. It should create understanding, encourage curiosity,
            and help readers see the world from different perspectives.
          </p>
        </div>

        <VDivider />

        <ul className="flex flex-col gap-4">
          {STORY_VALUES.map((item) => (
            <li key={item.title} className="flex items-start gap-3">
              <span
                aria-hidden
                className={`mt-[0.6rem] w-4 shrink-0 border-t ${MAROON_BORDER}`}
              />
              <div className="flex flex-col gap-0.5">
                <p className={`text-[13px] font-semibold ${MAROON_TEXT}`}>
                  {item.title}
                </p>
                <p className={`text-[12.5px] leading-relaxed ${BODY}`}>
                  {item.text}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="relative aspect-square w-full max-w-sm self-start overflow-hidden lg:max-w-none">
          <Image
            src={ABOUT_IMAGES.sunsetMan}
            alt="A reader with a newspaper on a bench by the river at sunset, Parliament in the distance"
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 384px, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

/* ============================== LEADERSHIP ============================== */

function LeaderCard({ leader }: { leader: (typeof LEADERS)[number] }) {
  return (
    <article className="flex flex-col gap-5 sm:flex-row sm:gap-6">
      <div className="relative aspect-8/7 w-full shrink-0 overflow-hidden sm:w-56 xl:w-64">
        <Image
          src={leader.image}
          alt={leader.alt}
          fill
          sizes="(min-width: 1280px) 256px, (min-width: 640px) 224px, 100vw"
          className="object-cover object-[50%_25%]"
        />
      </div>
      <div className="flex flex-col gap-2.5">
        <h3
          className={`${headingFont.className} text-[1.7rem] leading-tight ${MAROON_TEXT}`}
        >
          {leader.name}
        </h3>
        <p className={`text-sm font-semibold ${INK}`}>{leader.role}</p>
        <p className={`text-[13px] leading-relaxed ${BODY}`}>{leader.bio}</p>
        <Dash className="mt-1 w-5" />
      </div>
    </article>
  );
}

export function AboutLeadership() {
  return (
    <section
      aria-labelledby="leadership-title"
      className={`py-10 md:py-12 ${BAND_A}`}
    >
      <div className={`${CONTAINER} flex flex-col gap-7`}>
        <div className="flex flex-col gap-2.5">
          <Eyebrow>The People Behind Alentah</Eyebrow>
          <H2 id="leadership-title">Editorial Leadership</H2>
          <p className={`max-w-xs text-sm leading-relaxed ${BODY}`}>
            Two minds. One vision. A shared commitment to better journalism.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-x-10">
          <LeaderCard leader={LEADERS[0]} />
          <VDivider />
          <LeaderCard leader={LEADERS[1]} />
        </div>
      </div>
    </section>
  );
}

/* ============================ FROM THE EDITOR ============================ */

export function AboutEditorNote() {
  return (
    <section
      aria-labelledby="editor-note-title"
      className={`py-10 md:py-12 ${BAND_B}`}
    >
      <div
        className={`${CONTAINER} grid items-center gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)_auto_minmax(0,0.8fr)] lg:gap-x-10`}
      >
        <div className="relative aspect-3/2 w-full max-w-md overflow-hidden lg:max-w-none">
          <Image
            src={ABOUT_IMAGES.editor}
            alt="Talha Tabish, Founder and Editor-in-Chief"
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 448px, 100vw"
            className="object-cover object-[50%_28%]"
          />
        </div>

        <div className="flex flex-col gap-4">
          <Eyebrow>From the Editor</Eyebrow>
          <blockquote
            id="editor-note-title"
            className={`${headingFont.className} text-2xl italic leading-snug sm:text-[1.9rem] ${MAROON_TEXT}`}
          >
            “We don’t chase trends.
            <br />
            We chase truth, taste, and time.”
          </blockquote>
          <p className={`max-w-xl text-[13.5px] leading-relaxed ${BODY}`}>
            At Alentah, we believe that great stories do more than inform —
            they help us see the world more clearly. In a time of endless
            noise, we choose depth over speed, quality over quantity, and
            perspective over popularity.
          </p>
        </div>

        <VDivider />

        <div className="flex flex-col gap-3">
          <p
            className={`${signatureFont.className} text-5xl leading-none sm:text-6xl ${INK}`}
          >
            Talha Tabish
          </p>
          <div className="flex flex-col gap-0.5">
            <p className={`text-sm font-semibold ${INK}`}>Talha Tabish</p>
            <p className={`text-xs ${BODY}`}>Founder &amp; Editor-in-Chief</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================== PHILOSOPHY ============================== */

export function AboutPhilosophy() {
  return (
    <section
      aria-labelledby="philosophy-title"
      className={`py-10 md:py-12 ${BAND_A}`}
    >
      <div className={`${CONTAINER} flex flex-col gap-7`}>
        <div className="flex flex-col gap-2.5">
          <Eyebrow>Our Editorial Philosophy</Eyebrow>
          <H2 id="philosophy-title">What Guides Us</H2>
        </div>

        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {PHILOSOPHY.map((item, index) => (
            <li
              key={item.title}
              className={`group border-t pt-5 lg:border-l lg:border-t-0 lg:pt-0 lg:first:border-l-0 ${RULE}`}
            >
              <div className="flex flex-col gap-2 lg:ms-6 lg:me-4 lg:group-first:ms-0">
                <p className="flex items-baseline gap-3">
                  <span
                    className={`font-mono text-[11px] font-semibold ${MAROON_TEXT}`}
                  >
                    {String(index + 1).padStart(2, "0")}.
                  </span>
                  <span className={`text-sm font-semibold ${MAROON_TEXT}`}>
                    {item.title}
                  </span>
                </p>
                <p className={`max-w-60 text-[13px] leading-relaxed ${BODY}`}>
                  {item.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ============================== MULTILINGUAL ============================== */

export function AboutMultilingual() {
  return (
    <section
      aria-labelledby="multilingual-title"
      className={`overflow-hidden ${BAND_A}`}
    >
      <div className="grid lg:grid-cols-[22%_minmax(0,1fr)]">
        {/* Image bleeds to the left edge */}
        <div className="relative aspect-video w-full lg:aspect-auto lg:min-h-40">
          <Image
            src={ABOUT_IMAGES.books}
            alt="A stack of leather-bound books beside a brass magnifying glass and fountain pen"
            fill
            sizes="(min-width: 1024px) 22vw, 100vw"
            className="object-cover"
          />
        </div>

        <div
          className={`${CONTAINER} flex items-center py-10 lg:ml-12 lg:mr-[max(1rem,calc((100vw-76rem)/2))] lg:w-auto lg:py-8`}
        >
          <div className="grid w-full items-center gap-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-x-10">
            <div className="flex flex-col gap-2.5">
              <Eyebrow>A Multilingual Publication</Eyebrow>
              <H2 id="multilingual-title">
                Three Languages.
                <br />
                One Global Perspective.
              </H2>
            </div>

            <VDivider className={`min-h-20 ${RULE}`} />

            <div className="flex flex-col gap-3">
              <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
                {LANGUAGES.map((language, index) => (
                  <li key={language.label} className="flex items-center gap-4">
                    {index > 0 && (
                      <span aria-hidden className={BODY}>
                        ·
                      </span>
                    )}
                    <span
                      lang={language.lang}
                      dir={language.dir}
                      className={`text-xl leading-loose ${
                        index === 0
                          ? `${headingFont.className} font-medium ${MAROON_TEXT}`
                          : INK
                      }`}
                    >
                      {language.label}
                    </span>
                  </li>
                ))}
              </ul>
              <p className={`max-w-sm text-[13px] leading-relaxed ${BODY}`}>
                Alentah publishes separate editorial content in English, Urdu,
                and Arabic — each with its own voice, perspective and reading
                experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================== CTA ================================== */

export function AboutCta() {
  return (
    <section
      aria-labelledby="about-cta-title"
      className={`text-white ${BAND_CTA}`}
    >
      <div
        className={`${CONTAINER} grid items-center gap-6 py-10 md:py-12 lg:grid-cols-[minmax(0,1.1fr)_auto_minmax(0,1.2fr)_auto_auto] lg:gap-x-10`}
      >
        <div className="flex flex-col gap-3">
          <Eyebrow className="text-white/70">Our Commitment to Readers</Eyebrow>
          <h2
            id="about-cta-title"
            className={`${headingFont.className} text-3xl leading-tight text-white sm:text-[2.1rem]`}
          >
            Your Curiosity Deserves Better Stories.
          </h2>
        </div>

        <VDivider className="border-white/20" />

        <p className="max-w-md text-[13px] leading-relaxed text-white/80">
          In a world that never stops publishing, we believe readers deserve
          more than another stream of headlines. They deserve thoughtful work,
          meaningful perspectives, and stories worth their time.
        </p>

        <VDivider className="border-white/20" />

        <Link
          href="/"
          className="group inline-flex w-fit items-center gap-2 border-b border-white py-1 text-sm font-semibold text-white"
        >
          Explore Our Stories
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}