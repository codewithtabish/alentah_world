
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  ArrowRight,
  ArrowUpRight,
  Check,
} from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { LanguageListItem } from "@/actions/language/get-languages";

import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  RssIcon,
  XIcon,
  YoutubeIcon,
} from "../theme/social-icons";

// ============================================================
// ENEENA — PREMIUM PUBLIC FOOTER
// Client Component
// ============================================================

interface FooterClientProps {
  languages: LanguageListItem[];
}

// ============================================================
// SOCIAL LINKS
// ============================================================

const socialLinks = [
  {
    name: "X",
    icon: XIcon,
    href: "#",
    label: "Follow us on X",
  },
  {
    name: "Facebook",
    icon: FacebookIcon,
    href: "#",
    label: "Follow us on Facebook",
  },
  {
    name: "Instagram",
    icon: InstagramIcon,
    href: "#",
    label: "Follow us on Instagram",
  },
  {
    name: "LinkedIn",
    icon: LinkedinIcon,
    href: "#",
    label: "Follow us on LinkedIn",
  },
  {
    name: "YouTube",
    icon: YoutubeIcon,
    href: "#",
    label: "Visit our YouTube channel",
  },
  {
    name: "RSS",
    icon: RssIcon,
    href: "#",
    label: "Subscribe to our RSS feed",
  },
];

// ============================================================
// PUBLICATION LINKS
// ============================================================

const companyPages = [
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
  { name: "Advertise With Us", href: "/advertise" },
  { name: "Share Your Story", href: "/share-your-story" },
  { name: "Write for Us", href: "/write-for-us" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms and Conditions", href: "/terms" },
];

// ============================================================
// LANGUAGE FLAG ASSETS
// Located in /public/images/navbar/
// Each flag uses its existing 64 × 64 WebP asset.
// ============================================================

const availableFlagCodes = new Set([
  "ar",
  "bn",
  "de",
  "en",
  "es",
  "fr",
  "hi",
  "id",
  "ja",
  "pt",
  "ur",
  "zh",
]);

function getFlagCode(languageCode: string): string | null {
  const normalizedCode = languageCode
    .trim()
    .toLowerCase()
    .split(/[-_]/)[0];

  return availableFlagCodes.has(normalizedCode)
    ? normalizedCode
    : null;
}

// ============================================================
// FOOTER CLIENT
// ============================================================

export function FooterClient({ languages }: FooterClientProps) {
  const { resolvedTheme } = useTheme();

  const [mounted, setMounted] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Browser setTimeout returns a number, not NodeJS.Timeout.
  const subscriptionTimeout = React.useRef<number | null>(null);

  // ----------------------------------------------------------
  // MOUNT AND CLEANUP
  // ----------------------------------------------------------

  React.useEffect(() => {
    setMounted(true);

    return () => {
      if (subscriptionTimeout.current !== null) {
        window.clearTimeout(subscriptionTimeout.current);
        subscriptionTimeout.current = null;
      }
    };
  }, []);

  // ----------------------------------------------------------
  // THEME-AWARE LOGOS
  // ----------------------------------------------------------

  const isDark = mounted && resolvedTheme === "dark";

  const lightLogoClass = isDark ? "invisible" : "visible";
  const darkLogoClass = isDark ? "visible" : "invisible";

  // ----------------------------------------------------------
  // ACTIVE LANGUAGES
  // ----------------------------------------------------------

  const activeLanguages = React.useMemo(
    () =>
      languages
        .filter((language) => language.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [languages],
  );

  const defaultLanguage =
    activeLanguages.find((language) => language.isDefault) ??
    activeLanguages.find((language) => language.code === "en") ??
    activeLanguages[0];

  const homeHref = defaultLanguage
    ? `/${defaultLanguage.code}`
    : "/";

  // ----------------------------------------------------------
  // NEWSLETTER SUBSCRIPTION UI
  // Connect this handler to your newsletter API/server action
  // before treating submissions as stored subscriptions.
  // ----------------------------------------------------------

  const handleSubscribe = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!email.trim() || isSubmitting) return;

    // Clear any existing timer.
    if (subscriptionTimeout.current !== null) {
      window.clearTimeout(subscriptionTimeout.current);
      subscriptionTimeout.current = null;
    }

    setIsSubmitting(true);

    subscriptionTimeout.current = window.setTimeout(() => {
      setIsSubmitting(false);
      setSubscribed(true);
      setEmail("");

      subscriptionTimeout.current = window.setTimeout(() => {
        setSubscribed(false);
        subscriptionTimeout.current = null;
      }, 3500);
    }, 500);
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <footer
      className="relative w-full overflow-hidden border-t border-border"
      dir="ltr"
    >
      {/* TOP DECORATIVE LINE */}

      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

      <div className="w-full">

        {/* ==================================================
            NEWSLETTER
        ================================================== */}

        <section className="w-full border-b border-[#DCD5CA] py-12 dark:border-white/10 sm:py-14 lg:py-16">

          <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">

            {/* NEWSLETTER INTRO */}

            <div className="lg:col-span-7">

              <div className="mb-4 flex items-center gap-2">
                <span className="h-px w-7 bg-primary" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
                  The ENEENA Briefing
                </span>
              </div>

              <h2 className="max-w-2xl font-serif text-3xl font-medium leading-[1.15] tracking-[-0.035em] text-[#211D19] dark:text-[#F5F0E9] sm:text-4xl lg:text-[46px]">
                Ideas worth thinking about.
                <br />
                Stories worth your time.
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-7 text-[#77716A] dark:text-[#AAA39B] sm:text-[15px]">
                Thoughtful journalism, important perspectives,
                and noteworthy ideas — delivered directly to
                your inbox.
              </p>

            </div>

            {/* NEWSLETTER FORM */}

            <div className="lg:col-span-5">

              <form
                onSubmit={handleSubscribe}
                className="w-full"
              >

                <label
                  htmlFor="footer-newsletter-email"
                  className="mb-2 block text-xs font-semibold tracking-wide text-[#514A43] dark:text-[#D4CCC2]"
                >
                  YOUR EMAIL ADDRESS
                </label>

                <div
                  className={cn(
                    "group flex items-center gap-2 rounded-xl border p-1.5",
                    "border-[#DCD5CA] bg-white transition-all",
                    "focus-within:border-primary/60 focus-within:ring-4 focus-within:ring-primary/5",
                    "dark:border-white/10 dark:bg-white/4",
                  )}
                >

                  <div className="flex min-w-0 flex-1 items-center gap-3 ps-3">

                    <Mail className="size-4.25 shrink-0 text-[#999087]" />

                    <input
                      id="footer-newsletter-email"
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="Enter your email address"
                      required
                      autoComplete="email"
                      aria-label="Your email address"
                      className={cn(
                        "h-11 w-full min-w-0 bg-transparent text-sm outline-none",
                        "text-[#211D19] placeholder:text-[#A59D93]",
                        "dark:text-[#F5F0E9] dark:placeholder:text-[#77716A]",
                      )}
                      dir="ltr"
                    />

                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-label="Subscribe to newsletter"
                    className={cn(
                      "flex h-11 shrink-0 items-center justify-center gap-2",
                      "rounded-lg bg-[#5E1428] px-4 text-xs font-semibold text-white",
                      "transition-all duration-200 hover:bg-[#741B34]",
                      "disabled:cursor-not-allowed disabled:opacity-70",
                    )}
                  >
                    {subscribed ? (
                      <>
                        <Check className="size-4" />
                        <span className="hidden sm:inline">
                          Subscribed
                        </span>
                      </>
                    ) : isSubmitting ? (
                      <span>Joining...</span>
                    ) : (
                      <>
                        <span>Subscribe</span>
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </button>

                </div>

                <p
                  className="mt-3 text-[11px] leading-5 text-[#918980] dark:text-[#817A72]"
                  aria-live="polite"
                >
                  {subscribed
                    ? "Thank you for joining the ENEENA community."
                    : "A considered selection of stories. No unnecessary noise."}
                </p>

              </form>

            </div>

          </div>

        </section>

        {/* ==================================================
            MAIN FOOTER GRID
            BRAND / LANGUAGES / PUBLICATION
        ================================================== */}

        <div className="grid w-full grid-cols-1 gap-12 py-14 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-12 lg:gap-8 lg:py-16">

          {/* ==================================================
              BRAND
          ================================================== */}

          <div className="flex flex-col items-center text-center sm:items-start sm:text-left lg:col-span-4">

            {/* RESPONSIVE LOGO */}

            <Link
              href={homeHref}
              aria-label="ENEENA — Home"
              className="group relative block h-19 w-fit transition-opacity duration-200 hover:opacity-75"
            >

              {/* MOBILE ICON LOGO */}

              <span className="relative block size-19 sm:hidden">

                <Image
                  src="/images/logos/icon-maroon-1024.png"
                  alt="ENEENA"
                  width={1024}
                  height={1024}
                  sizes="76px"
                  priority
                  unoptimized
                  className={cn(
                    "absolute inset-0 size-full object-contain",
                    lightLogoClass,
                  )}
                />

                <Image
                  src="/images/logos/icon-white-1024.png"
                  alt="ENEENA"
                  width={1024}
                  height={1024}
                  sizes="76px"
                  priority
                  unoptimized
                  className={cn(
                    "absolute inset-0 size-full object-contain",
                    darkLogoClass,
                  )}
                />

              </span>

              {/* DESKTOP WORDMARK LOGO */}

              <span className="relative hidden h-19 w-57.5 items-center sm:flex">

                <Image
                  src="/images/logos/light.png"
                  alt="ENEENA"
                  width={1600}
                  height={400}
                  sizes="230px"
                  priority
                  unoptimized
                  className={cn(
                    "absolute inset-0 h-full w-full object-contain object-left",
                    lightLogoClass,
                  )}
                />

                <Image
                  src="/images/logos/dark.png"
                  alt="ENEENA"
                  width={1600}
                  height={400}
                  sizes="230px"
                  priority
                  unoptimized
                  className={cn(
                    "absolute inset-0 h-full w-full object-contain object-left",
                    darkLogoClass,
                  )}
                />

              </span>

            </Link>

            {/* BRAND DESCRIPTION */}

            <p className="mt-5 max-w-67.5 text-[13px] leading-[1.9] text-[#77716A] dark:text-[#AAA39B]">
              Independent journalism. Global perspective.
              <br />

              <em className="font-serif text-[#514A43] dark:text-[#D4CCC2]">
                A more thoughtful tomorrow.
              </em>
            </p>

            {/* SOCIAL LINKS */}

            <div className="mt-7 flex items-center justify-center gap-2 sm:justify-start">

              {socialLinks.map((social) => {
                const SocialIcon = social.icon;

                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    aria-label={social.label}
                    className={cn(
                      "flex size-9 items-center justify-center rounded-full",
                      "border border-[#E3DDD3] text-[#716A62]",
                      "transition-all duration-200",
                      "hover:border-[#5E1428] hover:bg-[#5E1428] hover:text-white",
                      "dark:border-white/10 dark:text-[#B8B0A7]",
                      "dark:hover:border-[#5E1428] dark:hover:bg-[#5E1428]",
                    )}
                  >
                    <SocialIcon className="size-3.75" />
                  </Link>
                );
              })}

            </div>

            {/* BRAND SIGNATURE */}

            <div className="mt-8 hidden items-center gap-2 sm:flex">
              <span className="size-1.5 rounded-full bg-[#5E1428] dark:bg-[#C17A8B]" />

              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#918980] dark:text-[#817A72]">
                Independent. International. Informed.
              </span>
            </div>

          </div>

          {/* ==================================================
              LANGUAGES WITH FLAG IMAGES
          ================================================== */}

          <div className="lg:col-span-4">

            <div className="mb-7 flex flex-col items-center sm:items-start">

              <h3 className="font-serif text-[19px] font-semibold tracking-[-0.02em] text-[#211D19] dark:text-[#F5F0E9]">
                Languages
              </h3>

              <span className="mt-3 h-0.5 w-8 bg-[#5E1428] dark:bg-[#C17A8B]" />

            </div>

            <div className="grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-2">

              {activeLanguages.map((language) => {
                const flagCode = getFlagCode(language.code);
                const languageName =
                  language.nativeName || language.name;

                return (
                  <Link
                    key={language.id}
                    href={`/${language.code}`}
                    lang={language.code}
                    dir={
                      language.direction === "RTL"
                        ? "rtl"
                        : "ltr"
                    }
                    aria-label={`Read ENEENA in ${languageName}`}
                    className={cn(
                      "group flex min-w-0 items-center gap-3 rounded-lg py-1.5",
                      "text-[#77716A] transition-colors hover:text-[#5E1428]",
                      "dark:text-[#AAA39B] dark:hover:text-[#D59AA8]",
                    )}
                  >

                    {/* FLAG IMAGE */}

                    {flagCode ? (
                      <span className="relative size-7 shrink-0 overflow-hidden rounded-full">

                        <Image
                          src={`/images/navbar/flag-${flagCode}-64.webp`}
                          alt=""
                          width={64}
                          height={64}
                          sizes="28px"
                          unoptimized
                          className="size-full object-contain transition-transform duration-200 group-hover:scale-110"
                        />

                      </span>
                    ) : (
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-[#E3DDD3] text-[10px] font-semibold text-[#82796F] dark:border-white/10 dark:text-[#AAA39B]">
                        {language.code.slice(0, 2).toUpperCase()}
                      </span>
                    )}

                    {/* LANGUAGE NAME */}

                    <span
                      className={cn(
                        "min-w-0 truncate text-[13px] font-medium transition-colors",
                        language.direction === "RTL" &&
                          "font-urdu-text",
                      )}
                    >
                      {languageName}
                    </span>

                    <ArrowUpRight className="ms-auto size-3 shrink-0 -translate-y-0.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />

                  </Link>
                );
              })}

            </div>

          </div>

          {/* ==================================================
              PUBLICATION INFORMATION
          ================================================== */}

          <div className="lg:col-span-4">

            <div className="mb-7 flex flex-col items-center sm:items-start">

              <h3 className="font-serif text-[19px] font-semibold tracking-[-0.02em] text-[#211D19] dark:text-[#F5F0E9]">
                The Publication
              </h3>

              <span className="mt-3 h-0.5 w-8 bg-[#5E1428] dark:bg-[#C17A8B]" />

            </div>

            <ul className="space-y-3 text-center sm:text-left">

              {companyPages.map((page) => (
                <li key={page.href}>

                  <Link
                    href={page.href}
                    className={cn(
                      "group inline-flex items-center justify-center gap-1.5 text-[13px]",
                      "text-[#77716A] transition-colors hover:text-[#5E1428]",
                      "dark:text-[#AAA39B] dark:hover:text-[#D59AA8]",
                      "sm:justify-start",
                    )}
                  >
                    {page.name}

                    <ArrowUpRight className="size-3 -translate-y-0.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />

                  </Link>

                </li>
              ))}

            </ul>

            {/* PUBLICATION SIGNATURE */}

            <div className="mt-9 border-t border-[#E3DDD3] pt-5 text-center dark:border-white/10 sm:text-left">

              <p className="font-serif text-[16px] italic leading-relaxed text-[#514A43] dark:text-[#D4CCC2]">
                A world of ideas.
                <br />
                A space for every perspective.
              </p>

            </div>

          </div>

        </div>

        {/* ==================================================
            COPYRIGHT
            No duplicate language switcher
        ================================================== */}

        <div className="w-full border-t border-[#DCD5CA] py-8 dark:border-white/10">

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-between">

            <p className="text-[11px] text-[#A49B90] dark:text-[#817A72]">
              © {new Date().getFullYear()} ENEENA. All rights reserved.
            </p>

            <p className="text-[11px] text-[#A49B90] dark:text-[#817A72]">
              Independent. International. Informed.
            </p>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default FooterClient;
