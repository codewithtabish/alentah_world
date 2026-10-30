// src/app/(marketing)/about/page.tsx
import * as React from "react";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AboutCategoriesWrapper } from "@/components/site/pages/about/about-categories-wrapper";

export const metadata = {
  title: "About Us | Alentah World",
  description:
    "An independent publication for curious minds, exploring the ideas, people, and perspectives shaping our world.",
};

const eyebrow =
  "mb-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-primary";

const storyPoints = [
  { title: "Depth over noise.", desc: "We go beyond the surface to find what truly matters." },
  { title: "Context over superficial headlines.", desc: "We look at the bigger picture." },
  { title: "Quality over quantity.", desc: "We choose depth, not volume." },
  { title: "Curiosity without borders.", desc: "We explore ideas, cultures and perspectives from around the world." },
  { title: "Independent thinking and meaningful storytelling.", desc: "We believe in journalism that informs, inspires and creates dialogue." },
];

const principles = [
  { num: "01.", title: "Depth Over Noise", desc: "We value meaningful context and thoughtful exploration." },
  { num: "02.", title: "Curiosity Without Borders", desc: "We welcome perspectives from different subjects, cultures, and places." },
  { num: "03.", title: "Quality With Purpose", desc: "Every story should have a reason to exist and something meaningful to offer." },
  { num: "04.", title: "Independent Thinking", desc: "We encourage readers to question, explore, and form their own understanding." },
];

export default function AboutPage() {
  const fontClass = "font-sans";
  const titleFont = "font-serif";

  return (
    <div className="flex flex-col pb-0" dir="ltr">
      {/* 1. HERO — image bleeds in from the right and fades into the cream background */}
      <section className="relative w-full overflow-hidden bg-[#faf7f2] dark:bg-background">
        {/* Image layer */}
        <div
          className={cn(
            "absolute inset-0 lg:left-auto lg:right-0 lg:w-[64%]",
            // mobile: fade to the bottom; desktop: fade to the left
            "[-webkit-mask-image:linear-gradient(to_top,transparent_0%,black_70%)] mask-[linear-gradient(to_top,transparent_0%,black_70%)]",
            "lg:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.55)_22%,black_55%)] lg:mask-[linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.55)_22%,black_55%)]"
          )}
        >
          <Image
            src="/images/about/about_cover.webp"
            alt="Alentah World About Cover"
            fill
            priority
            sizes="(min-width: 1024px) 64vw, 100vw"
            className="object-cover object-[70%_center]"
          />
        </div>

        {/* Soft overlay on mobile so text stays readable */}
        <div className="absolute inset-0 bg-[#faf7f2]/70 dark:bg-background/70 lg:hidden" />

        {/* Text layer */}
        <div className="relative mx-auto flex min-h-105 w-full max-w-7xl items-center px-4 py-16 sm:px-6 lg:min-h-125 lg:px-8 lg:py-24">
          <div className="max-w-xl">
            <span className={eyebrow}>About Alentah World</span>
            <h1
              className={cn(
                "mb-6 text-4xl font-bold leading-[1.1] text-primary sm:text-5xl lg:text-[3.5rem]",
                titleFont
              )}
            >
              A World of Stories.
              <br />
              A Clearer Way of Seeing.
            </h1>
            <p
              className={cn(
                "mb-8 max-w-md text-base leading-relaxed text-foreground/75",
                fontClass
              )}
            >
              An independent publication for curious minds, exploring the ideas,
              people, and perspectives shaping our world through thoughtful
              journalism and meaningful storytelling.
            </p>
            <Link
              href="#our-story"
              className="inline-flex w-fit items-center gap-3 text-[11px] font-bold uppercase tracking-[0.15em] text-primary"
            >
              <span className="h-px w-10 bg-primary" />
              Our Story
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. OUR STORY */}
      <section id="our-story" className="w-full bg-[#faf7f2] dark:bg-background">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:gap-0 lg:px-8 lg:py-16">
          <div className="lg:col-span-4 lg:pe-10">
            <span className={eyebrow}>Our Story</span>
            <h2
              className={cn(
                "mb-5 text-3xl font-bold leading-tight text-primary sm:text-4xl",
                titleFont
              )}
            >
              More Than Headlines.
              <br />
              Stories That Matter.
            </h2>
            <p className={cn("leading-relaxed text-muted-foreground", fontClass)}>
              Alentah World believes great journalism should do more than
              deliver information. It should create understanding, encourage
              curiosity, and help readers see the world from different
              perspectives.
            </p>
          </div>

          <div className="space-y-5 lg:col-span-5 lg:border-s lg:border-border lg:px-10">
            {storyPoints.map((item) => (
              <div key={item.title} className="flex gap-4">
                <span className="mt-2.5 h-0.5 w-5 shrink-0 bg-primary" />
                <div>
                  <h4 className={cn("mb-0.5 text-sm font-bold text-primary", fontClass)}>
                    {item.title}
                  </h4>
                  <p className={cn("text-[13px] text-muted-foreground", fontClass)}>
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
                alt="Reading by the river"
                fill
                sizes="(min-width: 1024px) 25vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. EDITORIAL LEADERSHIP */}
      <section className="w-full bg-[#f5f0e8] dark:bg-muted/30">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <span className={eyebrow}>The People Behind Alentah</span>
          <h2 className={cn("mb-3 text-3xl font-bold text-primary sm:text-4xl", titleFont)}>
            Editorial Leadership
          </h2>
          <p className={cn("mb-10 max-w-xs text-sm text-muted-foreground", fontClass)}>
            Two minds. One vision. A shared commitment to better journalism.
          </p>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-0">
            {/* Editor 1 */}
            <div className="flex flex-col items-start gap-6 sm:flex-row md:pe-10">
              <div className="relative aspect-4/5 w-full shrink-0 overflow-hidden sm:w-52">
                <Image
                  src="/images/about/editor.webp"
                  alt="Talha Tabish"
                  fill
                  sizes="(min-width: 640px) 208px, 100vw"
                  className="object-cover object-top"
                />
              </div>
              <div className="flex-1">
                <h3 className={cn("mb-1 text-2xl font-bold text-primary", titleFont)}>
                  Talha Tabish
                </h3>
                <p className={cn("mb-4 text-xs font-bold text-foreground/70", fontClass)}>
                  Founder & Editor-in-Chief
                </p>
                <p className={cn("text-sm leading-relaxed text-muted-foreground", fontClass)}>
                  Alentah World is built on a belief that journalism should
                  encourage people to question, understand, and think
                  independently. As Founder and Editor-in-Chief, Talha Tabish
                  leads the publication&apos;s vision and overall editorial
                  direction.
                </p>
                <span className="mt-5 block h-0.5 w-5 bg-primary" />
              </div>
            </div>

            {/* Editor 2 */}
            <div className="flex flex-col items-start gap-6 sm:flex-row md:border-s md:border-border md:ps-10">
              <div className="relative aspect-4/5 w-full shrink-0 overflow-hidden sm:w-52">
                <Image
                  src="/images/about/sudais.webp"
                  alt="Asad Ali"
                  fill
                  sizes="(min-width: 640px) 208px, 100vw"
                  className="object-cover object-top"
                />
              </div>
              <div className="flex-1">
                <h3 className={cn("mb-1 text-2xl font-bold text-primary", titleFont)}>
                    SUDAIS AZLAN
                </h3>
                <p className={cn("mb-4 text-xs font-bold text-foreground/70", fontClass)}>
                  Sub-Editor
                </p>
                <p className={cn("text-sm leading-relaxed text-muted-foreground", fontClass)}>
                  Working alongside the Editor-in-Chief, the Sub-Editor
                  contributes to the publication&apos;s editorial process,
                  helping maintain clarity, consistency, and quality across
                  published stories.
                </p>
                <span className="mt-5 block h-0.5 w-5 bg-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FROM THE EDITOR */}
      <section className="w-full bg-[#faf7f2] dark:bg-background">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:gap-0 lg:px-8 lg:py-16">
          <div className="lg:col-span-4 lg:pe-10">
            <div className="relative aspect-3/2 w-full overflow-hidden">
              <Image
                src="/images/about/editor.webp"
                alt="Talha Tabish"
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
                titleFont
              )}
            >
              “We don’t chase trends.
              <br />
              We chase truth, taste, and time.”
            </blockquote>
            <p className={cn("text-sm leading-relaxed text-muted-foreground", fontClass)}>
              At Alentah, we believe that great stories do more than inform —
              they help us see the world more clearly. In a time of endless
              noise, we choose depth over speed, quality over quantity, and
              perspective over popularity.
            </p>
          </div>

          <div className="flex flex-col justify-center gap-5 lg:col-span-3 lg:border-s lg:border-border lg:ps-10">
            <div
              className="text-4xl italic text-foreground/80"
              style={{ fontFamily: "'Brush Script MT', 'Segoe Script', cursive" }}
            >
              TALHA TABISH
            </div>
            <div>
              <p className={cn("text-sm font-bold text-foreground", fontClass)}>Talha Tabish</p>
              <p className={cn("text-xs text-muted-foreground", fontClass)}>
                Founder & Editor-in-Chief
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHAT GUIDES US */}
      <section className="w-full bg-[#f5f0e8] dark:bg-muted/30">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <span className={eyebrow}>Our Editorial Philosophy</span>
          <h2 className={cn("mb-10 text-3xl font-bold text-primary sm:text-4xl", titleFont)}>
            What Guides Us
          </h2>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
            {principles.map((item, i) => (
              <div
                key={item.num}
                className={cn(
                  "flex flex-col gap-2",
                  i > 0 && "lg:border-s lg:border-border lg:ps-8",
                  i < principles.length - 1 && "lg:pe-8"
                )}
              >
                <h3 className={cn("flex items-baseline gap-3 text-sm font-bold text-primary", fontClass)}>
                  <span className="text-xs">{item.num}</span>
                  {item.title}
                </h3>
                <p className={cn("text-[13px] leading-relaxed text-muted-foreground", fontClass)}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. OUR EDITORIAL LANDSCAPE */}
      <section className="w-full bg-[#faf7f2] dark:bg-background">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-8 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-16">
          <div className="lg:col-span-3">
            <span className={eyebrow}>What We Cover</span>
            <h2 className={cn("text-3xl font-bold text-primary sm:text-4xl", titleFont)}>
              Our Editorial Landscape
            </h2>
          </div>
          <div className="lg:col-span-9">
            <Suspense
              fallback={
                <div className="flex h-32 animate-pulse items-center justify-center text-muted-foreground">
                  Loading categories...
                </div>
              }
            >
              <AboutCategoriesWrapper />
            </Suspense>
          </div>
        </div>
      </section>

      {/* 7. THREE LANGUAGES (full-bleed image on the left) */}
      <section className="grid w-full grid-cols-1 border-y border-border bg-[#faf7f2] dark:bg-background lg:grid-cols-12">
        <div className="relative min-h-55 w-full lg:col-span-3">
          <Image
            src="/images/about/books.webp"
            alt="Books"
            fill
            sizes="(min-width: 1024px) 25vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center px-6 py-10 lg:col-span-4 lg:px-12">
          <span className={eyebrow}>A Multilingual Publication</span>
          <h2 className={cn("text-3xl font-bold leading-tight text-primary sm:text-4xl", titleFont)}>
            Three Languages.
            <br />
            One Global Perspective.
          </h2>
        </div>

        <div className="flex flex-col justify-center px-6 pb-10 lg:col-span-5 lg:border-s lg:border-border lg:px-12 lg:py-10">
          <div className="mb-4 flex items-center gap-3">
            <span className="font-serif text-lg font-bold text-primary">English</span>
            <span className="size-1 rounded-full bg-primary/60" />
            <span className="font-urdu-display text-lg font-bold text-primary">اردو</span>
            <span className="size-1 rounded-full bg-primary/60" />
            <span className="font-arabic-display text-lg font-bold text-primary">العربية</span>
          </div>
          <p className={cn("max-w-md text-sm leading-relaxed text-muted-foreground", fontClass)}>
            Alentah publishes separate editorial content in English, Urdu, and
            Arabic — each with its own voice, perspective and reading
            experience.
          </p>
        </div>
      </section>

      {/* 8. BOTTOM BANNER (Burgundy) */}
      <div className="w-full bg-[#6b1d2e] py-14 text-[#faf7f2]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:gap-0 lg:px-8">
          <div className="lg:col-span-4 lg:pe-10">
            <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
              Our Commitment to Readers
            </span>
            <h2 className={cn("text-3xl font-bold leading-tight", titleFont)}>
              Your Curiosity Deserves Better Stories.
            </h2>
          </div>
          <div
            className={cn(
              "text-sm leading-relaxed text-white/80 lg:col-span-5 lg:border-s lg:border-white/20 lg:px-10",
              fontClass
            )}
          >
            In a world that never stops publishing, we believe readers deserve
            more than another stream of headlines. They deserve thoughtful
            work, meaningful perspectives, and stories worth their time.
          </div>
          <div className="flex justify-start lg:col-span-3 lg:justify-end lg:border-s lg:border-white/20 lg:ps-10">
            <Link
              href="/en"
              className="inline-flex items-center gap-2 border-b border-white/80 pb-1 text-[13px] font-bold text-white transition-opacity hover:opacity-80"
            >
              Explore Our Stories <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}