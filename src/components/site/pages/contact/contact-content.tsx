// src/components/site/pages/contact/contact-content.tsx
import type { ReactNode } from "react";

import Image from "next/image";
import Link from "next/link";

import { ArrowRight, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

import { ContactForm } from "./contact-form";

/* -------------------------------------------------------------------------- */
/* Images                                                                     */
/* -------------------------------------------------------------------------- */

const IMAGES = {
  cover: "/images/contact/contact_cover.webp",
  story: "/images/contact/share_story.webp",
  mission: "/images/contact/our_mission.webp",
} as const;

/* -------------------------------------------------------------------------- */
/* Content                                                                    */
/* -------------------------------------------------------------------------- */

const TOPICS = [
  {
    title: "General Enquiries",
    desc: "Questions, feedback and suggestions.",
  },
  {
    title: "Editorial & Stories",
    desc: "Story ideas, submissions and corrections.",
  },
  {
    title: "Advertising & Partnerships",
    desc: "Sponsorships and commercial collaborations.",
  },
  {
    title: "Technical Support",
    desc: "Website issues and accessibility concerns.",
  },
];

const FAQ_LEFT = [
  {
    q: "How can I submit a story idea?",
    a: "Use the form above and choose “Editorial & Story Submission”. Include a short summary of your idea and why it matters to our readers.",
  },
  {
    q: "Do you accept guest contributions?",
    a: "We welcome fresh perspectives and thoughtful contributions. Please send a short pitch through the form before submitting a full piece, and our editorial team will review it.",
  },
  {
    q: "How can I advertise on ENEENA?",
    a: (
      <>
        Visit our{" "}
        <Link
          href="/advertise"
          className="font-semibold text-primary underline underline-offset-4"
        >
          Advertise page
        </Link>{" "}
        to explore the options, then send us a partnership enquiry.
      </>
    ),
  },
];

const FAQ_RIGHT = [
  {
    q: "Can I request a correction to an article?",
    a: "Yes. Choose “Editorial & Story Submission” in the form and include the article link and the details that need correcting.",
  },
  {
    q: "Is there a media kit available?",
    a: "Media kit details are shared with partnership enquiries. Select “Advertising & Partnership” in the form and let us know what you need.",
  },
  {
    q: "How do I report a technical issue?",
    a: "Choose “Technical Support” and tell us which page you were on, plus your device and browser, so we can look into it quickly.",
  },
];

/* -------------------------------------------------------------------------- */
/* Shared styles                                                              */
/* -------------------------------------------------------------------------- */

const eyebrow =
  "mb-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/70";

const cleanText =
  "text-start! hyphens-none! wrap-normal! break-normal! text-pretty";

/* -------------------------------------------------------------------------- */
/* FAQ component                                                              */
/* -------------------------------------------------------------------------- */

function FaqList({
  items,
}: {
  items: {
    q: string;
    a: ReactNode;
  }[];
}) {
  return (
    <div className="flex flex-col border-t border-border">
      {items.map((item) => (
        <details
          key={item.q}
          className="group border-b border-border"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[13px] font-semibold text-foreground transition-colors marker:content-none hover:text-primary [&::-webkit-details-marker]:hidden">
            {item.q}

            <Plus
              className="size-4 shrink-0 text-foreground/70 transition-transform duration-300 group-open:rotate-45"
              aria-hidden="true"
            />
          </summary>

          <div
            className={cn(
              "pb-4 pe-8 text-[13px] leading-relaxed text-muted-foreground",
              cleanText,
            )}
          >
            {item.a}
          </div>
        </details>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Contact page content                                                       */
/* -------------------------------------------------------------------------- */

export function ContactContent() {
  return (
    <div className="flex min-w-0 flex-col gap-16 overflow-x-clip pb-16 lg:gap-24 lg:pb-24">
      {/* ================================================================== */}
      {/* 1. HERO                                                            */}
      {/* ================================================================== */}

      <section className="relative isolate overflow-hidden">
        {/* Hero image */}

        <div className="absolute inset-y-0 inset-e-0 -z-10 w-full lg:w-[68%] lg:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.55)_20%,black_50%)] lg:mask-[linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.55)_20%,black_50%)]">
          <Image
            src={IMAGES.cover}
            alt="A historic city at sunset with a leather journal and fountain pen on a stone ledge"
            fill
            priority
            sizes="(min-width: 1024px) 68vw, 100vw"
            className="object-cover object-right"
          />
        </div>

        {/* Readability overlay */}

        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-background/80 lg:hidden"
        />

        <div className="flex min-h-88 max-w-xl flex-col justify-center py-12 lg:min-h-100 lg:py-16">
          <span className="mb-5 flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/70">
            Get in touch

            <span
              aria-hidden="true"
              className="hidden h-px w-14 bg-foreground/25 sm:block"
            />
          </span>

          <h1 className="mb-5 text-balance font-serif text-4xl font-bold leading-[1.08] tracking-tight text-primary sm:text-5xl xl:text-[3.5rem]">
            Every Good Conversation Starts Somewhere.
          </h1>

          <p
            className={cn(
              "mb-8 max-w-md text-base leading-relaxed text-foreground/75",
              cleanText,
            )}
          >
            Have a story to share, a question to ask, an idea to explore, or an
            opportunity to discuss? We&apos;d love to hear from you.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="#contact-form"
              className="group/btn inline-flex h-12 items-center gap-2.5 rounded-[3px] bg-primary px-6 text-[13px] font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-colors duration-300 hover:bg-primary/90"
            >
              Send Us a Message

              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>

            <Link
              href="/advertise"
              className="inline-flex h-12 items-center rounded-[3px] border border-foreground/25 px-6 text-[13px] font-semibold text-foreground transition-colors duration-300 hover:border-primary hover:text-primary"
            >
              Explore Advertising
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 2. HOW CAN WE HELP                                                 */}
      {/* ================================================================== */}

      <section className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Introduction */}

        <div className="flex flex-col lg:col-span-4">
          <span className={eyebrow}>Our contact information</span>

          <h2 className="font-serif text-3xl font-bold leading-[1.1] tracking-tight text-primary sm:text-4xl">
            How Can
            <br className="hidden sm:block" /> We Help?
          </h2>

          <span
            aria-hidden="true"
            className="my-6 block h-px w-14 bg-foreground/25"
          />

          <p
            className={cn(
              "max-w-68 text-[13.5px] leading-[1.75] text-muted-foreground",
              cleanText,
            )}
          >
            Our journalism, your feedback or a partnership: we&apos;re here to
            listen.
          </p>
        </div>

        {/* Contact topics */}

        <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 lg:col-span-8 xl:grid-cols-4 xl:gap-y-0">
          {TOPICS.map((topic, index) => (
            <div
              key={topic.title}
              className="group/topic flex min-w-0 flex-col gap-2.5 border-s border-border ps-5 pe-4 transition-colors duration-300 hover:border-primary/60 xl:py-1"
            >
              <span
                aria-hidden="true"
                className="font-serif text-[11px] font-bold tracking-[0.18em] text-foreground/40 transition-colors duration-300 group-hover/topic:text-primary"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3
                className={cn(
                  "font-serif text-[1.05rem] font-bold leading-snug text-primary",
                  cleanText,
                )}
              >
                {topic.title}
              </h3>

              <p
                className={cn(
                  "text-[13px] leading-[1.65] text-muted-foreground",
                  cleanText,
                )}
              >
                {topic.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================== */}
      {/* 3. STORY CARD, CONTACT FORM AND MISSION CARD                       */}
      {/* ================================================================== */}

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,3.1fr)_minmax(0,4.35fr)_minmax(0,2.5fr)] lg:items-stretch">
        {/* Share your story */}

        <article className="group relative isolate flex min-h-120 flex-col justify-end overflow-hidden rounded-lg lg:min-h-0">
          <Image
            src={IMAGES.story}
            alt="A coffee cup and leather journal on a desk by a window overlooking a city at sunset"
            fill
            sizes="(min-width: 1024px) 28vw, 100vw"
            className="-z-10 object-cover object-top transition-transform duration-1200 ease-out [@media(hover:hover)]:group-hover:scale-[1.03]"
          />

          {/* 👇 CHANGED to bg-primary */}
          <div className="relative w-[88%] bg-primary p-6 text-primary-foreground shadow-2xl shadow-black/30 backdrop-blur-[2px] lg:p-7">
            <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.22em] text-primary-foreground/70">
              For editorial
            </span>

            <h2 className="mb-3 font-serif text-2xl font-bold leading-tight sm:text-[1.7rem]">
              Share Your Story
            </h2>

            <p
              className={cn(
                "mb-5 max-w-[16rem] text-[13px] leading-relaxed text-primary-foreground/80",
                cleanText,
              )}
            >
              We&apos;re always looking for fresh perspectives, compelling
              stories and new voices.
            </p>

            <Link
              href="/share-your-story"
              className="group/link inline-flex items-center gap-2 border-b border-primary-foreground/70 pb-0.5 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-75"
            >
              Submit a Story

              <ArrowRight
                className="size-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </article>

        {/* Contact form */}

        <div
          id="contact-form"
          className="scroll-mt-24 rounded-lg border border-border p-6 shadow-sm shadow-black/3 sm:p-8 lg:p-9"
        >
          <span className={eyebrow}>Write to us</span>

          <h2 className="mb-3 font-serif text-3xl font-bold leading-tight text-primary">
            Get in Touch
          </h2>

          <p
            className={cn(
              "mb-7 max-w-sm text-[13px] leading-relaxed text-muted-foreground",
              cleanText,
            )}
          >
            Tell us a little about what brings you here. We&apos;ll make sure
            your message reaches the appropriate team.
          </p>

          <ContactForm />
        </div>

        {/* Our mission */}

        <article className="group flex flex-col overflow-hidden rounded-lg border border-border">
          <div className="relative aspect-3/2 w-full shrink-0 overflow-hidden bg-muted">
            <Image
              src={IMAGES.mission}
              alt="A historic domed city beside a river at golden hour"
              fill
              sizes="(min-width: 1024px) 24vw, 100vw"
              className="object-cover transition-transform duration-1200 ease-out [@media(hover:hover)]:group-hover:scale-[1.04]"
            />
          </div>

          <div className="flex flex-1 flex-col gap-3 bg-primary/5 p-6 lg:p-7">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-foreground/70">
              Our mission
            </span>

            <h2 className="font-serif text-2xl font-bold leading-tight text-primary">
              Independent Global Journalism
            </h2>

            <p
              className={cn(
                "text-[13px] leading-relaxed text-muted-foreground",
                cleanText,
              )}
            >
              We&apos;re building a more informed, more connected world through
              independent journalism and diverse perspectives.
            </p>

            <Link
              href="/about"
              className="group/link mt-auto inline-flex w-fit items-center gap-2 border-b border-primary pb-0.5 text-[13px] font-semibold text-primary transition-opacity hover:opacity-75"
            >
              Learn More

              <ArrowRight
                className="size-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </article>
      </section>

      {/* ================================================================== */}
      {/* 4. FREQUENTLY ASKED QUESTIONS                                      */}
      {/* ================================================================== */}

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Heading */}

        <div className="lg:col-span-3">
          <span className={eyebrow}>
            Frequently asked questions
          </span>

          <h2 className="font-serif text-3xl font-bold leading-[1.1] tracking-tight text-primary sm:text-4xl">
            Quick Answers
          </h2>

          <span
            aria-hidden="true"
            className="mt-6 block h-px w-14 bg-foreground/25"
          />
        </div>

        {/* FAQ columns */}

        <div className="grid grid-cols-1 gap-x-12 gap-y-0 sm:grid-cols-2 lg:col-span-9">
          <FaqList items={FAQ_LEFT} />

          <FaqList items={FAQ_RIGHT} />
        </div>
      </section>
    </div>
  );
}