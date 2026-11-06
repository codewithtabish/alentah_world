// src/components/site/general/footer/footer-client.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowRight, ChevronRight, Check } from "lucide-react";
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

export function FooterClient({ categories, languages }: FooterClientProps) {
  const fontClass = "font-sans";
  const titleFont = "font-serif";

  // ============================================================
  // LOGO THEME FIX
  // ============================================================
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Using visibility instead of hidden/block prevents layout collapse
  // and bypasses any CSS conflicts from Tailwind's dark mode.
  const lightClass = mounted && resolvedTheme === "dark" ? "invisible" : "visible";
  const darkClass = mounted && resolvedTheme === "dark" ? "visible" : "invisible";

  // Separate categories by language
  const englishCategories = categories.filter(
    (c) => c.language.code === "en" && c.isActive
  );
  const urduCategories = categories.filter(
    (c) => c.language.code === "ur" && c.isActive
  );

  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  const socialLinks = [
    { icon: XIcon, href: "#" },
    { icon: FacebookIcon, href: "#" },
    { icon: InstagramIcon, href: "#" },
    { icon: LinkedinIcon, href: "#" },
    { icon: YoutubeIcon, href: "#" },
    { icon: RssIcon, href: "#" },
  ];

  const companyPages = [
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "Advertise With Us", href: "/advertise" },
    { name: "Write for Us", href: "/write-for-us" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms and Conditions", href: "/terms" },
  ];

  return (
    <footer
      className="w-full border-t border-border bg-[#faf7f2] pt-16 pb-8 dark:bg-background"
      dir="ltr"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* MAIN FOOTER GRID */}
        <div className="mb-16 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          
          {/* COLUMN 1: Brand & Social */}
          <div className="flex flex-col items-center gap-6 text-center md:items-start md:text-left lg:col-span-3">
            <Link
              href="/en"
              aria-label="Alentah World - Home"
              className="group relative block h-20 w-fit transition-opacity hover:opacity-80"
            >
              {/* SMALL DEVICES (< 640px): brand icon */}
              <span className="relative block h-20 w-20 sm:hidden">
                {/* Light mode icon (maroon) */}
                <Image
                  src="/images/logos/icon-maroon-1024.png"
                  alt="Alentah World"
                  width={1024}
                  height={1024}
                  sizes="80px"
                  priority
                  unoptimized
                  className={cn(
                    "absolute inset-0 size-20 object-contain",
                    lightClass
                  )}
                />
                {/* Dark mode icon (white) */}
                <Image
                  src="/images/logos/icon-white-1024.png"
                  alt="Alentah World"
                  width={1024}
                  height={1024}
                  sizes="80px"
                  priority
                  unoptimized
                  className={cn(
                    "absolute inset-0 size-20 object-contain",
                    darkClass
                  )}
                />
              </span>

              {/* LARGE DEVICES (>= 640px): full logo */}
              <span className="relative hidden h-20 w-[240px] items-center sm:flex">
                {/* Light mode logo (maroon) */}
                <Image
                  src="/images/logos/light.png"
                  alt="Alentah World"
                  width={1600}
                  height={400}
                  sizes="240px"
                  priority
                  unoptimized
                  className={cn(
                    "absolute inset-0 h-auto w-full object-contain",
                    lightClass
                  )}
                />
                {/* Dark mode logo (white) */}
                <Image
                  src="/images/logos/dark.png"
                  alt="Alentah World"
                  width={1600}
                  height={400}
                  sizes="240px"
                  priority
                  unoptimized
                  className={cn(
                    "absolute inset-0 h-auto w-full object-contain",
                    darkClass
                  )}
                />
              </span>
            </Link>

            <p
              className={cn(
                "max-w-xs text-sm leading-relaxed text-muted-foreground",
                fontClass
              )}
            >
              Independent Journalism. Global Perspective.
              <br />
              <em>A More Thoughtful Tomorrow.</em>
            </p>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 md:justify-start">
              {socialLinks.map((social, i) => (
                <Link
                  key={i}
                  href={social.href}
                  className="flex size-9 items-center justify-center rounded-full bg-foreground/5 text-foreground/70 transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <social.icon className="size-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* COLUMN 2: Explore Categories (English + Urdu) */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left lg:col-span-3">
            <h3
              className={cn(
                "mb-6 inline-block border-b-2 border-foreground/10 pb-2 text-lg font-bold text-foreground",
                titleFont
              )}
            >
              Explore Categories
            </h3>
            <ul className="flex w-full flex-col items-center gap-3 md:items-start">
              {englishCategories.slice(0, 3).map((cat) => (
                <li key={cat.id} className="w-full">
                  <Link
                    href={`/en/${cat.slug}`}
                    className={cn(
                      "group flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary md:justify-start",
                      fontClass
                    )}
                  >
                    <span className="hidden size-1.5 rounded-full bg-primary/40 group-hover:bg-primary md:block" />
                    {cat.name}
                  </Link>
                </li>
              ))}

              <li className="my-1 h-px w-full bg-border/50" />

              {urduCategories.slice(0, 3).map((cat) => (
                <li key={cat.id} className="w-full">
                  <Link
                    href={`/ur/${cat.slug}`}
                    className="group flex items-center justify-center gap-2 font-urdu-text text-sm text-muted-foreground transition-colors hover:text-primary md:justify-start"
                  >
                    <span className="hidden size-1.5 rounded-full bg-primary/40 group-hover:bg-primary md:block" />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: Explore Subcategories (English + Urdu) */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left lg:col-span-3">
            <h3
              className={cn(
                "mb-6 inline-block border-b-2 border-foreground/10 pb-2 text-lg font-bold text-foreground",
                titleFont
              )}
            >
              Explore Subcategories
            </h3>
            <div className="flex w-full flex-col items-center gap-4 md:items-start">
              {englishCategories
                .filter((c) => c.subcategories.length > 0)
                .slice(0, 1)
                .map((cat) => (
                  <div
                    key={cat.id}
                    className="flex w-full flex-col items-center gap-2 md:items-start"
                  >
                    <p
                      className={cn(
                        "flex items-center gap-1.5 text-sm font-bold text-foreground",
                        fontClass
                      )}
                    >
                      <ChevronRight className="hidden size-3 text-muted-foreground md:block" />{" "}
                      {cat.name}
                    </p>
                    <ul className="flex w-full flex-col items-center gap-2 md:ms-4 md:items-start md:border-s md:border-border/50 md:ps-3">
                      {cat.subcategories.slice(0, 3).map((sub) => (
                        <li key={sub.id}>
                          <Link
                            href={`/en/${cat.slug}/${sub.slug}`}
                            className={cn(
                              "flex items-center justify-center gap-2 text-[13px] text-muted-foreground transition-colors hover:text-primary md:justify-start",
                              fontClass
                            )}
                          >
                            <ChevronRight className="hidden size-2.5 opacity-50 md:block" />{" "}
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

              {urduCategories
                .filter((c) => c.subcategories.length > 0)
                .slice(0, 1)
                .map((cat) => (
                  <div
                    key={cat.id}
                    className="flex w-full flex-col items-center gap-2 md:items-start"
                  >
                    <p className="flex items-center gap-1.5 font-urdu-display text-sm font-bold text-foreground">
                      <ChevronRight className="hidden size-3 text-muted-foreground md:block" />{" "}
                      {cat.name}
                    </p>
                    <ul className="flex w-full flex-col items-center gap-2 md:ms-4 md:items-start md:border-s md:border-border/50 md:ps-3">
                      {cat.subcategories.slice(0, 3).map((sub) => (
                        <li key={sub.id}>
                          <Link
                            href={`/ur/${cat.slug}/${sub.slug}`}
                            className="flex items-center justify-center gap-2 font-urdu-text text-[13px] text-muted-foreground transition-colors hover:text-primary md:justify-start"
                          >
                            <ChevronRight className="hidden size-2.5 opacity-50 md:block" />{" "}
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </div>

          {/* COLUMN 4: Information Links & Newsletter */}
          <div className="flex flex-col items-center gap-8 text-center md:items-start md:text-left lg:col-span-3">
            <div className="flex w-full flex-col items-center md:items-start">
              <h3
                className={cn(
                  "mb-6 inline-block border-b-2 border-foreground/10 pb-2 text-lg font-bold text-foreground",
                  titleFont
                )}
              >
                Information
              </h3>
              <ul className="flex w-full flex-col items-center gap-3 md:items-start">
                {companyPages.map((page) => (
                  <li key={page.name}>
                    <Link
                      href={page.href}
                      className={cn(
                        "block text-sm text-muted-foreground transition-colors hover:text-primary",
                        fontClass
                      )}
                    >
                      {page.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full">
              <h3
                className={cn(
                  "mb-3 text-center text-lg font-bold text-foreground md:text-left",
                  titleFont
                )}
              >
                Stay Informed.
              </h3>
              <p
                className={cn(
                  "mb-3 text-center text-xs text-muted-foreground md:text-left",
                  fontClass
                )}
              >
                Get the latest stories delivered to your inbox.
              </p>
              <form
                onSubmit={handleSubscribe}
                className="relative mx-auto flex max-w-sm items-center md:mx-0"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full rounded-full border border-border bg-background py-2.5 pe-12 ps-10 text-sm outline-none focus:border-primary/50"
                  dir="ltr"
                />
                <Mail className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <button
                  type="submit"
                  className="absolute end-1 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {subscribed ? (
                    <Check className="size-4" />
                  ) : (
                    <ArrowRight className="size-4 rtl:rotate-180" />
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 md:flex-row">
          <p
            className="text-center text-xs text-muted-foreground md:text-start"
            dir="ltr"
          >
            © 2026 Alentah World. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link
              href="/privacy"
              className={cn(
                "text-xs text-muted-foreground hover:text-foreground",
                fontClass
              )}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className={cn(
                "text-xs text-muted-foreground hover:text-foreground",
                fontClass
              )}
            >
              Terms and Conditions
            </Link>
            <Link
              href="/cookie"
              className={cn(
                "text-xs text-muted-foreground hover:text-foreground",
                fontClass
              )}
            >
              Cookie Policy
            </Link>
            <Link
              href="/sitemap"
              className={cn(
                "text-xs text-muted-foreground hover:text-foreground",
                fontClass
              )}
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}