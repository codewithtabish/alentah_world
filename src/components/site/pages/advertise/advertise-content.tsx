// src/components/site/pages/advertise/advertise-content.tsx
// Server component: no state, no effects, ships no JS of its own.

import * as React from "react";
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

/* ------------------------------------------------------------------ */
/* Images (swap file names here if any picture is in the wrong spot)   */
/* ------------------------------------------------------------------ */

const IMAGES = {
  hero: "/images/advertise/hero_cover.webp", // 1200x800, London desk at sunset
  display: "/images/advertise/4.png", // shown inside the tablet frame
  sponsored: "/images/advertise/2.webp", // 800x600, "Future of Sustainable Cities"
  partnership: "/images/advertise/3.webp", // 600x400, "A More Thoughtful Tomorrow"
  newsletter: "/images/advertise/one.webp", // 533x800, "Top Stories" newsletter
  cta: "/images/advertise/hero_cover.webp", // closing banner background
} as const;

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const FEATURES: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: BookOpen,
    title: "An Editorial Environment",
    desc: "Position your brand alongside thoughtfully presented editorial content.",
  },
  {
    icon: Compass,
    title: "Multiple Subject Areas",
    desc: "Reach readers exploring technology, business, finance, culture, lifestyle, travel, and other subjects covered by Alentah.",
  },
  {
    icon: Globe,
    title: "Multilingual Publishing",
    desc: "Explore opportunities across Alentah's English, Urdu, and Arabic editions.",
  },
  {
    icon: Handshake,
    title: "Meaningful Brand Presence",
    desc: "Build a partnership through relevant, carefully presented advertising and sponsored content opportunities.",
  },
];

type VisualKey = "display" | "sponsored" | "partnership" | "newsletter";

const OPPORTUNITIES: {
  letter: string;
  title: string;
  desc: string;
  visual: VisualKey;
  listTitle?: string;
  list?: string[];
  listFirst?: boolean;
}[] = [
  {
    letter: "A",
    title: "Display Advertising",
    desc: "Offer placements for brand campaigns across eligible website areas.",
    visual: "display",
    listTitle: "Possible formats:",
    list: [
      "Homepage placements",
      "Editorial page placements",
      "Category page placements",
      "In-article advertising placements",
      "Other available website placements",
    ],
  },
  {
    letter: "B",
    title: "Sponsored Articles",
    desc: "Publish sponsored editorial content that aligns with your brand and audience. Sponsored content is clearly identified and differentiated from independent editorial reporting.",
    visual: "sponsored",
  },
  {
    letter: "C",
    title: "Brand Partnerships",
    desc: "Customized campaigns for brands seeking a more comprehensive collaboration.",
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
    desc: "Reach our subscribers with your brand message through Alentah's newsletter, subject to availability.",
    visual: "newsletter",
  },
];

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

const eyebrow =
  "mb-4 block text-[11px] font-bold uppercase tracking-[0.2em] text-primary";

const SIZES_COL = "(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw";

function PrimaryButton({
  href,
  children,
  light = false,
}: {
  href: string;
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group/btn inline-flex h-12 items-center gap-2.5 rounded-[3px] px-6 text-[13px] font-bold shadow-lg transition-colors duration-300",
        light
          ? "bg-[#faf7f2] text-[#4a1220] shadow-black/20 hover:bg-white"
          : "bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90",
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

function TextLink({
  href,
  children,
  light = false,
}: {
  href: string;
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center border-b pb-1 text-[13px] font-bold transition-opacity hover:opacity-70",
        light ? "border-white/70 text-white" : "border-primary text-primary",
      )}
    >
      {children}
    </Link>
  );
}

// 4 columns with 1px dividers between them (dividers are their own grid
// cells, so no horizontal padding is needed on the columns).
function DividedGrid({ children }: { children: React.ReactNode }) {
  const items = React.Children.toArray(children);

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)_1px_minmax(0,1fr)_1px_minmax(0,1fr)]">
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <span
              aria-hidden="true"
              className="hidden w-px self-stretch bg-border lg:block"
            />
          )}
          {item}
        </React.Fragment>
      ))}
    </div>
  );
}

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

function Visual({ kind }: { kind: VisualKey }) {
  switch (kind) {
    case "display":
      // Tablet frame
      return (
        <div className="w-full rounded-[1.1rem] border-[6px] border-neutral-900 bg-neutral-900 shadow-xl shadow-black/20">
          <div className="relative aspect-9/8 w-full overflow-hidden rounded-3xl bg-muted">
            <Image
              src={IMAGES.display}
              alt="Example of a display advertising placement on Alentah World"
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
          alt="Example of a sponsored article: The Future of Sustainable Cities"
          ratio="aspect-[4/3]"
        />
      );
    case "partnership":
      return (
        <Shot
          src={IMAGES.partnership}
          alt="Example of a brand partnership campaign: A More Thoughtful Tomorrow"
          ratio="aspect-[3/2]"
        />
      );
    case "newsletter":
      return (
        <Shot
          src={IMAGES.newsletter}
          alt="Example of the Alentah World newsletter with a sponsored placement"
          ratio="aspect-[3/4]"
        />
      );
  }
}

function PlacementList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="mb-2 text-[13px] font-bold text-foreground">{title}</h4>
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
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function AdvertiseContent() {
  return (
    <div className="flex min-w-0 flex-col gap-20 overflow-x-clip pb-16 lg:gap-28 lg:pb-24">
      {/* ============================================================ */}
      {/* 1. HERO                                                      */}
      {/* ============================================================ */}
      <section className="grid grid-cols-1 items-center gap-10 pt-8 lg:grid-cols-2 lg:gap-16 lg:pt-14">
        <div className="flex flex-col">
          <span className={eyebrow}>Partner with Alentah World</span>

          <h1 className="mb-6 text-balance font-serif text-4xl font-bold leading-[1.08] tracking-tight text-primary sm:text-5xl xl:text-[3.75rem]">
            Your Brand Deserves a Better Story.
          </h1>

          <p className="mb-8 max-w-md text-base leading-relaxed text-foreground/75">
            Connect your brand with a publication built around curiosity, ideas,
            and meaningful storytelling. Explore advertising and partnership
            opportunities with Alentah World.
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
            <span aria-hidden="true" className="h-px w-10 bg-primary" />
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

      {/* ============================================================ */}
      {/* 2. WHY ADVERTISE                                             */}
      {/* ============================================================ */}
      <section className="flex flex-col gap-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <span className={eyebrow}>Why advertise with Alentah World?</span>
            <h2 className="text-balance font-serif text-3xl font-bold leading-[1.1] tracking-tight text-primary sm:text-5xl">
              A Different Kind of Media Partnership.
            </h2>
          </div>

          <div className="flex flex-col gap-5 text-[15px] leading-7 text-muted-foreground lg:col-span-7 lg:pt-8">
            <p>
              Advertising with Alentah World means more than just visibility. It
              means aligning your brand with a publication that values
              thoughtful content, global perspectives, and intellectual
              curiosity.
            </p>
            <p>
              We offer brands the opportunity to connect with engaged readers
              through a premium editorial environment, across multiple subjects
              and languages, with meaningful and relevant placements.
            </p>
          </div>
        </div>

        <DividedGrid>
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex min-w-0 flex-col gap-3">
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

      {/* ============================================================ */}
      {/* 3. ADVERTISING OPPORTUNITIES                                 */}
      {/* ============================================================ */}
      <section id="opportunities" className="flex scroll-mt-24 flex-col gap-12">
        <header>
          <span className={eyebrow}>Advertising Opportunities</span>
          <h2 className="text-balance font-serif text-3xl font-bold leading-[1.1] tracking-tight text-primary sm:text-5xl">
            Find the Right Way to Reach Our Readers.
          </h2>
        </header>

        <DividedGrid>
          {OPPORTUNITIES.map((o) => {
            const list =
              o.list && o.listTitle ? (
                <PlacementList title={o.listTitle} items={o.list} />
              ) : null;

            return (
              <article key={o.letter} className="flex min-w-0 flex-col gap-5">
                <div className="flex flex-col gap-3">
                  <h3 className="font-serif text-xl font-bold text-primary">
                    {o.letter}. {o.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">
                    {o.desc}
                  </p>
                </div>

                {o.listFirst && list}
                <Visual kind={o.visual} />
                {!o.listFirst && list}

                <p className="mt-auto pt-2 font-serif text-xs italic text-muted-foreground">
                  Illustrative example. Not a guaranteed inventory.
                </p>
              </article>
            );
          })}
        </DividedGrid>
      </section>

      {/* ============================================================ */}
      {/* 4. CLOSING CTA                                               */}
      {/* ============================================================ */}
      <section className="relative isolate overflow-hidden rounded-[6px] bg-[#4a1220] shadow-2xl shadow-[#4a1220]/25 ring-1 ring-inset ring-white/10">
        {/* Image fades in from the right */}
        <div className="absolute inset-y-0 inset-e-0 -z-10 w-full lg:w-3/5 [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_55%)] mask-[linear-gradient(to_right,transparent_0%,black_55%)]">
          <Image
            src={IMAGES.cta}
            alt=""
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover object-[center_60%] opacity-70"
          />
        </div>
        {/* Burgundy wash so the text always stays readable */}
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
              Partner with Alentah World
            </h2>
            <p className="max-w-md text-[15px] leading-7 text-white/80">
              We welcome inquiries from businesses, global brands, agencies,
              entrepreneurs and organizations that share our commitment to
              quality, integrity and thoughtful storytelling.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <PrimaryButton href="/contact?subject=partnership" light>
              Start a Partnership Inquiry
            </PrimaryButton>
            <TextLink href="/contact" light>
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