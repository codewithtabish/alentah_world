// src/components/site/general/layout/footer-client.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  Check,
  Globe2,
} from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { CategoryListItem } from "@/actions/categories/get-categories";
import { LanguageListItem } from "@/actions/language/get-languages";

import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  RssIcon,
  XIcon,
  YoutubeIcon,
} from "../theme/social-icons";

interface FooterClientProps {
  categories: CategoryListItem[];
  languages: LanguageListItem[];
}

const socialLinks = [
  { name: "X", icon: XIcon, href: "#", label: "Follow us on X" },
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

const companyPages = [
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
  { name: "Advertise With Us", href: "/advertise" },
  { name: "Share your Story", href: "/share-your-story" },
  { name: "Write for Us", href: "/write-for-us" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms and Conditions", href: "/terms" },
];

const legalPages = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms and Conditions", href: "/terms" },
  { name: "Cookie Policy", href: "/cookie" },
  { name: "Sitemap", href: "/sitemap" },
];

export function FooterClient({
  categories,
  languages,
}: FooterClientProps) {
  const { resolvedTheme } = useTheme();

  const [mounted, setMounted] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const subscriptionTimeout = React.useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  React.useEffect(() => {
    setMounted(true);

    return () => {
      if (subscriptionTimeout.current) {
        clearTimeout(subscriptionTimeout.current);
      }
    };
  }, []);

  // ------------------------------------------------------------
  // THEME-AWARE LOGO
  // ------------------------------------------------------------

  const isDark = mounted && resolvedTheme === "dark";

  const lightLogoClass = isDark ? "invisible" : "visible";
  const darkLogoClass = isDark ? "visible" : "invisible";

  // ------------------------------------------------------------
  // DYNAMIC ACTIVE LANGUAGES
  // ------------------------------------------------------------

  const activeLanguages = React.useMemo(
    () =>
      languages
        .filter((language) => language.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [languages]
  );

  const defaultLanguage =
    activeLanguages.find((language) => language.isDefault) ??
    activeLanguages.find((language) => language.code === "en") ??
    activeLanguages[0];

  const homeHref = defaultLanguage ? `/${defaultLanguage.code}` : "/";

  const activeLanguageCodes = React.useMemo(
    () => new Set(activeLanguages.map((language) => language.code)),
    [activeLanguages]
  );

  const activeCategories = React.useMemo(
    () =>
      categories.filter(
        (category) =>
          category.isActive &&
          activeLanguageCodes.has(category.language.code)
      ),
    [categories, activeLanguageCodes]
  );

  const editionGroups = React.useMemo(
    () =>
      activeLanguages.map((language) => ({
        language,
        categories: activeCategories.filter(
          (category) => category.language.code === language.code
        ),
      })),
    [activeLanguages, activeCategories]
  );

  const editionsWithCategories = editionGroups.filter(
    (group) => group.categories.length > 0
  );

  // ------------------------------------------------------------
  // NEWSLETTER
  // ------------------------------------------------------------

  const handleSubscribe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || isSubmitting) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubscribed(true);
      setEmail("");

      subscriptionTimeout.current = setTimeout(() => {
        setSubscribed(false);
      }, 3500);
    }, 500);
  };

  return (
    <footer
      className={cn(
        "relative w-full overflow-hidden border-t border-border"
      )}
      dir="ltr"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

      {/* FULL-WIDTH CONTAINER */}
      <div className="w-full">
        {/* ====================================================
            NEWSLETTER
        ==================================================== */}
        {/* 👇 REMOVED px-4 sm:px-6 lg:px-8 etc. */}
        <section className="w-full border-b border-[#DCD5CA] py-12 dark:border-white/10 sm:py-14 lg:py-16">
          <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
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
                Thoughtful journalism, important perspectives, and
                noteworthy ideas — delivered directly to your inbox.
              </p>
            </div>

            <div className="lg:col-span-5">
              <form onSubmit={handleSubscribe} className="w-full">
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
                    "dark:border-white/10 dark:bg-white/4"
                  )}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3 ps-3">
                    <Mail className="size-4.25 shrink-0 text-[#999087]" />
                    <input
                      id="footer-newsletter-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Enter your email address"
                      required
                      autoComplete="email"
                      aria-label="Your email address"
                      className={cn(
                        "h-11 w-full min-w-0 bg-transparent text-sm outline-none",
                        "text-[#211D19] placeholder:text-[#A59D93]",
                        "dark:text-[#F5F0E9] dark:placeholder:text-[#77716A]"
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
                      "disabled:cursor-not-allowed disabled:opacity-70"
                    )}
                  >
                    {subscribed ? (
                      <>
                        <Check className="size-4" />
                        <span className="hidden sm:inline">Subscribed</span>
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

        {/* ====================================================
            MAIN FOOTER GRID
        ==================================================== */}
        {/* 👇 REMOVED px-4 sm:px-6 lg:px-8 etc. */}
        <div className="grid w-full grid-cols-1 gap-12 py-14 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-12 lg:gap-8 lg:py-16">
          {/* BRAND */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left lg:col-span-3">
            <Link
              href={homeHref}
              aria-label="ENEENA — Home"
              className="group relative block h-19 w-fit transition-opacity duration-200 hover:opacity-75"
            >
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
                    lightLogoClass
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
                    darkLogoClass
                  )}
                />
              </span>

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
                    lightLogoClass
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
                    darkLogoClass
                  )}
                />
              </span>
            </Link>

            <p className="mt-5 max-w-67.5 text-[13px] leading-[1.9] text-[#77716A] dark:text-[#AAA39B]">
              Independent journalism. Global perspective.
              <br />
              <em className="font-serif text-[#514A43] dark:text-[#D4CCC2]">
                A more thoughtful tomorrow.
              </em>
            </p>

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
                      "dark:hover:border-[#5E1428] dark:hover:bg-[#5E1428]"
                    )}
                  >
                    <SocialIcon className="size-3.75" />
                  </Link>
                );
              })}
            </div>

            <div className="mt-8 hidden items-center gap-2 sm:flex">
              <span className="size-1.5 rounded-full bg-[#5E1428] dark:bg-[#C17A8B]" />
              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#918980] dark:text-[#817A72]">
                Independent. International. Informed.
              </span>
            </div>
          </div>

          {/* EXPLORE EDITIONS */}
          <div className="lg:col-span-3">
            <div className="mb-7 flex flex-col items-center sm:items-start">
              <h3 className="font-serif text-[19px] font-semibold tracking-[-0.02em] text-[#211D19] dark:text-[#F5F0E9]">
                Explore Editions
              </h3>
              <span className="mt-3 h-0.5 w-8 bg-[#5E1428] dark:bg-[#C17A8B]" />
            </div>

            <div className="space-y-7">
              {editionsWithCategories.length > 0 ? (
                editionsWithCategories.map(({ language, categories: items }) => (
                  <section
                    key={language.id}
                    className="text-center sm:text-left"
                  >
                    <div className="mb-3 flex items-center justify-center gap-2 sm:justify-start">
                      <Globe2 className="size-3.5 text-primary/70" />
                      <span
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-[0.16em] text-[#82796F] dark:text-[#A69C91]",
                          language.direction === "RTL" && "font-urdu-text"
                        )}
                        dir={language.direction === "RTL" ? "rtl" : "ltr"}
                      >
                        {language.nativeName || language.name}
                      </span>
                    </div>

                    <ul className="space-y-2.5">
                      {items.slice(0, 3).map((category) => (
                        <li key={category.id}>
                          <Link
                            href={`/${language.code}/${category.slug}`}
                            className={cn(
                              "group inline-flex items-center justify-center gap-2 text-[13px]",
                              "text-[#77716A] transition-colors hover:text-[#5E1428]",
                              "dark:text-[#AAA39B] dark:hover:text-[#D59AA8]",
                              "sm:justify-start",
                              language.direction === "RTL" && "font-urdu-text"
                            )}
                            dir={language.direction === "RTL" ? "rtl" : "ltr"}
                          >
                            <span className="hidden size-1 rounded-full bg-primary/40 transition-colors group-hover:bg-primary sm:block" />
                            {category.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))
              ) : (
                <p className="text-center text-sm text-[#918980] sm:text-left">
                  Explore our latest stories and perspectives.
                </p>
              )}
            </div>
          </div>

          {/* DISCOVER MORE */}
          <div className="lg:col-span-3">
            <div className="mb-7 flex flex-col items-center sm:items-start">
              <h3 className="font-serif text-[19px] font-semibold tracking-[-0.02em] text-[#211D19] dark:text-[#F5F0E9]">
                Discover More
              </h3>
              <span className="mt-3 h-0.5 w-8 bg-[#5E1428] dark:bg-[#C17A8B]" />
            </div>

            <div className="space-y-7">
              {editionsWithCategories.map(({ language, categories: items }) => {
                const category = items.find(
                  (item) => item.subcategories?.length > 0
                );
                if (!category) return null;

                return (
                  <section key={language.id}>
                    <Link
                      href={`/${language.code}/${category.slug}`}
                      className={cn(
                        "mb-3 flex items-center justify-center gap-2 text-[13px]",
                        "font-semibold text-[#514A43] transition-colors hover:text-[#5E1428]",
                        "dark:text-[#D4CCC2] dark:hover:text-[#D59AA8]",
                        "sm:justify-start",
                        language.direction === "RTL" && "font-urdu-text"
                      )}
                      dir={language.direction === "RTL" ? "rtl" : "ltr"}
                    >
                      <ChevronRight className="hidden size-3 shrink-0 text-[#A49B90] sm:block" />
                      {category.name}
                    </Link>

                    <ul className="space-y-2 border-[#E3DDD3] dark:border-white/10 sm:ms-1 sm:border-s sm:ps-4">
                      {category.subcategories.slice(0, 3).map((subcategory) => (
                        <li key={subcategory.id}>
                          <Link
                            href={`/${language.code}/${category.slug}/${subcategory.slug}`}
                            className={cn(
                              "group inline-flex items-center justify-center gap-2 text-[12px]",
                              "text-[#82796F] transition-colors hover:text-[#5E1428]",
                              "dark:text-[#AAA39B] dark:hover:text-[#D59AA8]",
                              "sm:justify-start",
                              language.direction === "RTL" && "font-urdu-text"
                            )}
                            dir={language.direction === "RTL" ? "rtl" : "ltr"}
                          >
                            <ChevronRight className="hidden size-2.5 shrink-0 opacity-40 transition-opacity group-hover:opacity-100 sm:block" />
                            {subcategory.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
            </div>
          </div>

          {/* PUBLICATION INFORMATION */}
          <div className="lg:col-span-3">
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
                      "sm:justify-start"
                    )}
                  >
                    {page.name}
                    <ArrowUpRight className="size-3 -translate-y-0.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-9 border-t border-[#E3DDD3] pt-5 text-center dark:border-white/10 sm:text-left">
              <p className="font-serif text-[16px] italic leading-relaxed text-[#514A43] dark:text-[#D4CCC2]">
                A world of ideas.
                <br />
                A space for every perspective.
              </p>
            </div>
          </div>
        </div>

        {/* ====================================================
            LANGUAGE SWITCHER (Horizontal Row)
        ==================================================== */}
        {/* 👇 REMOVED px-4 sm:px-6 lg:px-8 etc. */}
        <div className="w-full border-t border-[#DCD5CA] py-8 dark:border-white/10">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:justify-start">
              {activeLanguages.map((lang) => (
                <Link
                  key={lang.id}
                  href={`/${lang.code}`}
                  className={cn(
                    "text-[12px] font-medium transition-colors",
                    "text-[#82796F] hover:text-[#5E1428]",
                    "dark:text-[#AAA39B] dark:hover:text-[#D59AA8]",
                    lang.direction === "RTL" && "font-urdu-text"
                  )}
                  dir={lang.direction === "RTL" ? "rtl" : "ltr"}
                >
                  {lang.nativeName || lang.name}
                </Link>
              ))}
            </div>
            <p className="text-[11px] text-[#A49B90] dark:text-[#817A72]">
              © {new Date().getFullYear()} ENEENA.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}