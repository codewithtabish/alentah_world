
import type { ReactNode } from "react";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  BookOpen,
  Compass,
  Globe,
  Handshake,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Images                                                                     */
/* -------------------------------------------------------------------------- */

const IMAGES = {
  hero: "/images/advertise/hero_cover.webp",
  display: "/images/advertise/4.png",
  sponsored: "/images/advertise/2.webp",
  partnership: "/images/advertise/3.webp",
  newsletter: "/images/advertise/one.webp",
  cta: "/images/advertise/hero_cover.webp",
} as const;

/* -------------------------------------------------------------------------- */
/* Editorial features                                                         */
/* -------------------------------------------------------------------------- */

const FEATURES: {
  icon: LucideIcon;
  title: string;
  desc: string;
}[] = [
  {
    icon: BookOpen,
    title: "An Editorial Environment",
    desc: "Explore opportunities to position your brand alongside thoughtfully presented editorial content.",
  },
  {
    icon: Compass,
    title: "Multiple Subject Areas",
    desc: "Connect with readers exploring technology, business, finance, science, culture, lifestyle, travel and other subjects.",
  },
  {
    icon: Globe,
    title: "Multilingual Publishing",
    desc: "Explore potential opportunities across ENEENA's English, Urdu, Arabic, German, Hindi and Chinese editions.",
  },
  {
    icon: Handshake,
    title: "Meaningful Brand Presence",
    desc: "Discuss relevant advertising and sponsorship opportunities that align with your brand and campaign objectives.",
  },
];

/* -------------------------------------------------------------------------- */
/* Advertising opportunities                                                  */
/* -------------------------------------------------------------------------- */

type VisualKey = "display" | "sponsored" | "partnership" | "newsletter";

type Opportunity = {
  letter: string;
  title: string;
  desc: string;
  visual: VisualKey;
  listTitle?: string;
  list?: string[];
  listFirst?: boolean;
};

const OPPORTUNITIES: Opportunity[] = [
  {
    letter: "A",
    title: "Display Advertising",
    desc: "Explore opportunities to present your brand through advertising placements across eligible areas of the ENEENA website.",

    visual: "display",

    listTitle: "Possible formats:",

    list: [
      "Homepage advertising placements",
      "Editorial page placements",
      "Category page placements",
      "In-article advertising placements",
      "Other available website placements",
    ],
  },

  {
    letter: "B",
    title: "Sponsored Articles",

    desc: "Explore sponsored editorial content that connects your brand with relevant topics and reader interests. Sponsored content is clearly identified and kept distinct from ENEENA's independent editorial reporting.",

    visual: "sponsored",
  },

  {
    letter: "C",
    title: "Brand Partnerships",

    desc: "Discuss tailored campaigns and collaborations for brands seeking a broader relationship with an international publication.",

    visual: "partnership",

    listFirst: true,

    listTitle: "Possible opportunities:",

    list: [
      "Multi-page campaign placements",
      "Thematic brand campaigns",
      "Product or service awareness campaigns",
      "Special editorial sponsorships, where available",
    ],
  },

  {
    letter: "D",
    title: "Newsletter Advertising",

    desc: "Explore opportunities to introduce your brand to newsletter subscribers through relevant advertising placements, subject to availability.",

    visual: "newsletter",
  },
];

/* -------------------------------------------------------------------------- */
/* Shared styles                                                              */
/* -------------------------------------------------------------------------- */

const eyebrow =
  "mb-4 block text-[11px] font-bold uppercase tracking-[0.2em] text-primary";

const SIZES_COL =
  "(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw";

/* -------------------------------------------------------------------------- */
/* Primary button                                                             */
/* -------------------------------------------------------------------------- */

function PrimaryButton({
  href,
  children,
  light = false,
}: {
  href: string;
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group/btn inline-flex h-12 items-center gap-2.5 rounded-[3px] px-6 text-[13px] font-bold shadow-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        light
          ? "bg-[#faf7f2] text-[#4a1220] shadow-black/20 hover:bg-white"
          : "bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30",
      )}
    >
      {children}

      <ArrowRight
        className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 rtl:rotate-180"
        aria-hidden="true"
      />
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* Text link                                                                  */
/* -------------------------------------------------------------------------- */

function TextLink({
  href,
  children,
  light = false,
}: {
  href: string;
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center border-b pb-1 text-[13px] font-bold transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        light
          ? "border-white/70 text-white"
          : "border-primary text-primary",
      )}
    >
      {children}
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* Four-column editorial grid                                                 */
/* -------------------------------------------------------------------------- */

function DividedGrid({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-0">
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Image component                                                            */
/* -------------------------------------------------------------------------- */

function Shot({
  src,
  alt,
  ratio,
  className,
}: {
  src: string;
  alt: string;
  ratio: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-[6px] bg-muted shadow-lg shadow-black/5 ring-1 ring-border",
        ratio,
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={SIZES_COL}
        className="object-cover object-top"
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Advertising visuals                                                        */
/* -------------------------------------------------------------------------- */

function Visual({
  kind,
}: {
  kind: VisualKey;
}) {
  switch (kind) {
    case "display":
      return (
        <div className="w-full rounded-[1.1rem] border-[6px] border-neutral-900 bg-neutral-900 shadow-xl shadow-black/20">
          <div className="relative aspect-9/8 w-full overflow-hidden rounded-3xl bg-muted">
            <Image
              src={IMAGES.display}
              alt="Illustrative example of a display advertising placement on ENEENA"
              fill
              sizes={SIZES_COL}
              className="object-cover object-center"
            />
          </div>
        </div>
      );

    case "sponsored":
      return (
        <Shot
          src={IMAGES.sponsored}
          alt="Illustrative sponsored article design about the future of sustainable cities"
          ratio="aspect-[4/3]"
        />
      );

    case "partnership":
      return (
        <Shot
          src={IMAGES.partnership}
          alt="Illustrative ENEENA brand partnership campaign design"
          ratio="aspect-[3/2]"
        />
      );

    case "newsletter":
      return (
        <Shot
          src={IMAGES.newsletter}
          alt="Illustrative ENEENA newsletter design with a potential sponsored placement"
          ratio="aspect-[3/4]"
        />
      );
  }
}

/* -------------------------------------------------------------------------- */
/* Placement list                                                             */
/* -------------------------------------------------------------------------- */

function PlacementList({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div>
      <h4 className="mb-2 text-[13px] font-bold text-foreground">
        {title}
      </h4>

      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-2.5 text-[13px] leading-snug text-muted-foreground"
          >
            <span
              aria-hidden="true"
              className="mt-1.75 size-1 shrink-0 rounded-full bg-primary"
            />

            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export function AdvertiseContent() {
  return (
    <div className="flex min-w-0 flex-col gap-20 overflow-x-clip pb-16 lg:gap-28 lg:pb-24">
      {/* ================================================================== */}
      {/* 1. HERO                                                            */}
      {/* ================================================================== */}

      <section className="grid grid-cols-1 items-center gap-10 pt-8 lg:grid-cols-2 lg:gap-16 lg:pt-14">
        <div className="flex flex-col">
          <span className={eyebrow}>
            Partner with ENEENA
          </span>

          <h1 className="mb-6 text-balance font-serif text-4xl font-bold leading-[1.08] tracking-tight text-primary sm:text-5xl xl:text-[3.75rem]">
            Your Brand Deserves a Better Story.
          </h1>

          <p className="mb-8 max-w-md text-base leading-relaxed text-foreground/75">
            Connect your brand with an international publication built around
            curiosity, ideas and meaningful storytelling. Explore advertising
            and partnership opportunities with ENEENA.
          </p>

          <div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <PrimaryButton href="/contact?subject=partnership">
              Start a Partnership Inquiry
            </PrimaryButton>

            <TextLink href="#opportunities">
              Explore Advertising Opportunities
            </TextLink>
          </div>

          <p className="flex items-center gap-4 font-serif text-sm italic text-foreground/70">
            <span
              aria-hidden="true"
              className="h-px w-10 bg-primary"
            />

            Thoughtful Stories. Meaningful Connections.
          </p>
        </div>

        <div className="relative aspect-3/2 w-full overflow-hidden rounded-[6px] bg-muted shadow-2xl shadow-black/15 ring-1 ring-black/5">
          <Image
            src={IMAGES.hero}
            alt="A writer's desk overlooking the city at sunset"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* ================================================================== */}
      {/* 2. WHY ADVERTISE WITH ENEENA                                       */}
      {/* ================================================================== */}

      <section className="flex flex-col gap-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <span className={eyebrow}>
              Why advertise with ENEENA?
            </span>

            <h2 className="text-balance font-serif text-3xl font-bold leading-[1.1] tracking-tight text-primary sm:text-5xl">
              A Different Kind of Media Partnership.
            </h2>
          </div>

          <div className="flex flex-col gap-5 text-[15px] leading-7 text-muted-foreground lg:col-span-7 lg:pt-8">
            <p>
              Advertising with ENEENA is an opportunity to associate your
              brand with a publication that values thoughtful content,
              international perspectives and intellectual curiosity.
            </p>

            <p>
              Our editorial landscape spans multiple subjects and six
              publishing languages: English, Urdu, Arabic, German, Hindi and
              Chinese. We welcome enquiries from businesses, agencies,
              organisations and brands interested in exploring relevant
              collaborations.
            </p>
          </div>
        </div>

        <DividedGrid>
          {FEATURES.map(({ icon: Icon, title, desc }, index) => (
            <div
              key={title}
              className={cn(
                "flex min-w-0 flex-col gap-3",
                index > 0 && "lg:border-s lg:border-border lg:ps-6",
                index === 0 && "lg:pe-6",
              )}
            >
              <Icon
                className="size-8 text-primary"
                strokeWidth={1.4}
                aria-hidden="true"
              />

              <h3 className="font-serif text-xl font-bold text-foreground">
                {title}
              </h3>

              <p className="text-[13px] leading-relaxed text-muted-foreground">
                {desc}
              </p>
            </div>
          ))}
        </DividedGrid>
      </section>

      {/* ================================================================== */}
      {/* 3. ADVERTISING OPPORTUNITIES                                       */}
      {/* ================================================================== */}

      <section
        id="opportunities"
        className="flex scroll-mt-24 flex-col gap-12"
      >
        <header>
          <span className={eyebrow}>
            Advertising Opportunities
          </span>

          <h2 className="text-balance font-serif text-3xl font-bold leading-[1.1] tracking-tight text-primary sm:text-5xl">
            Find the Right Way to Reach Our Readers.
          </h2>

          <p className="mt-5 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
            Explore the advertising formats and partnership possibilities
            available through ENEENA. All proposals are subject to review,
            availability and our editorial standards.
          </p>
        </header>

        <DividedGrid>
          {OPPORTUNITIES.map((opportunity, index) => {
            const list =
              opportunity.list && opportunity.listTitle ? (
                <PlacementList
                  title={opportunity.listTitle}
                  items={opportunity.list}
                />
              ) : null;

            return (
              <article
                key={opportunity.letter}
                className={cn(
                  "flex min-w-0 flex-col gap-5",
                  index > 0 && "lg:border-s lg:border-border lg:ps-6",
                  index === 0 && "lg:pe-6",
                )}
              >
                <div className="flex flex-col gap-3">
                  <span className="text-[11px] font-bold tracking-[0.2em] text-primary/65">
                    {opportunity.letter}
                  </span>

                  <h3 className="font-serif text-xl font-bold text-primary">
                    {opportunity.title}
                  </h3>

                  <p className="text-[13px] leading-relaxed text-muted-foreground">
                    {opportunity.desc}
                  </p>
                </div>

                {opportunity.listFirst && list}

                <Visual kind={opportunity.visual} />

                {!opportunity.listFirst && list}

                <p className="mt-auto pt-2 font-serif text-xs italic text-muted-foreground">
                  Illustrative example. Actual availability and formats are
                  confirmed through enquiry.
                </p>
              </article>
            );
          })}
        </DividedGrid>
      </section>

      {/* ================================================================== */}
      {/* 4. CLOSING CTA                                                     */}
      {/* ================================================================== */}

      <section className="relative isolate overflow-hidden rounded-[6px] bg-[#4a1220] shadow-2xl shadow-[#4a1220]/25 ring-1 ring-inset ring-white/10">
        {/* Background image */}

        <div className="absolute inset-y-0 inset-e-0 -z-10 w-full lg:w-3/5 [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_55%)] mask-[linear-gradient(to_right,transparent_0%,black_55%)]">
          <Image
            src={IMAGES.cta}
            alt=""
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover object-[center_60%] opacity-70"
          />
        </div>

        {/* Burgundy overlay */}

        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-linear-to-r from-[#4a1220] via-[#4a1220]/85 to-[#4a1220]/30"
        />

        <div className="flex flex-col gap-8 p-8 sm:p-12 lg:min-h-80 lg:justify-center lg:p-16">
          <div className="max-w-xl">
            <span className="mb-4 block text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">
              Let&apos;s build something meaningful
            </span>

            <h2 className="mb-4 text-balance font-serif text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl">
              Partner with ENEENA
            </h2>

            <p className="max-w-md text-[15px] leading-7 text-white/80">
              We welcome enquiries from businesses, global brands, agencies,
              entrepreneurs and organisations interested in thoughtful
              advertising and meaningful partnerships.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <PrimaryButton
              href="/contact?subject=partnership"
              light
            >
              Start a Partnership Inquiry
            </PrimaryButton>

            <TextLink
              href="/contact"
              light
            >
              Contact Our Team
            </TextLink>
          </div>

          <p className="font-serif text-sm italic text-white/75 lg:absolute lg:bottom-8 lg:inset-e-10">
            Global Perspectives. Lasting Impact.
          </p>
        </div>
      </section>
    </div>
  );
}
