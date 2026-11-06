// src/components/site/general/navbars/navbar-client.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Bookmark,
  Check,
  ChevronDown,
  Globe,
  LogOut,
  Menu,
  Search,
  User as UserIcon,
  X,
} from "lucide-react";
import { SignInButton, useUser, useClerk, Show } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/site/general/theme/mode-toggle";
import { LanguageListItem } from "@/actions/language/get-languages";
import { CategoryListItem } from "@/actions/categories/get-categories";

// ============================================================
// STYLE CONSTANTS
// ============================================================

const HIDE_SCROLLBAR =
  "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

const PANEL =
  "rounded-2xl bg-popover/95 text-popover-foreground ring-1 ring-border/60 backdrop-blur-xl shadow-[0_24px_60px_-12px_rgba(0,0,0,0.28)] animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 origin-top";

const USER_PANEL =
  "rounded-2xl border border-border bg-popover text-popover-foreground shadow-xl animate-in fade-in slide-in-from-top-2 duration-200";

const ICON_BTN =
  "inline-flex size-9 shrink-0 items-center justify-center rounded-full no-underline transition-colors hover:bg-muted hover:text-primary sm:size-10";

const MENU_ITEM =
  "flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] text-popover-foreground/85 no-underline transition-colors hover:bg-accent hover:text-foreground";

// ============================================================
// LOCALIZED COPY
// ============================================================

type EditionCopy = {
  title: string;
  tagline: string;
  open: string;
  empty: string;
};

const EDITION_COPY: Record<string, EditionCopy> = {
  ur: {
    title: "اردو ایڈیشن",
    tagline: "آزاد اردو نیوز روم",
    open: "اردو ایڈیشن کھولیں",
    empty: "ابھی کوئی زمرہ نہیں ہے۔",
  },
  ar: {
    title: "النسخة العربية",
    tagline: "غرفة أخبار عربية مستقلة",
    open: "افتح النسخة العربية",
    empty: "لا توجد تصنيفات بعد.",
  },
  de: {
    title: "Deutsche Ausgabe",
    tagline: "Unabhängige deutsche Redaktion",
    open: "Deutsche Ausgabe öffnen",
    empty: "Noch keine Kategorien.",
  },
  hi: {
    title: "हिंदी संस्करण",
    tagline: "स्वतंत्र हिंदी न्यूज़रूम",
    open: "हिंदी संस्करण खोलें",
    empty: "अभी कोई श्रेणी नहीं है।",
  },
  zh: {
    title: "中文版",
    tagline: "独立中文新闻编辑部",
    open: "打开中文版",
    empty: "暂无分类。",
  },
};

function getCopy(language: LanguageListItem): EditionCopy {
  return (
    EDITION_COPY[language.code] ?? {
      title: `${language.name} Edition`,
      tagline: `Independent ${language.name} newsroom`,
      open: `Open ${language.name} edition`,
      empty: "No categories yet.",
    }
  );
}

function getLanguageFromPathname(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  return parts[0] || "en";
}

// ============================================================
// FLAGS  →  /public/images/navbar/flag-xx-64.webp
// ============================================================

const FLAG_BASE = "/images/navbar";
const FLAG_CODES = new Set(["en", "ur", "ar", "de", "hi", "zh"]);

function Flag({
  code,
  size = 24,
  className,
}: {
  code: string;
  size?: number;
  className?: string;
}) {
  if (!FLAG_CODES.has(code)) {
    return (
      <span
        aria-hidden="true"
        style={{ width: size, height: size }}
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground",
          className,
        )}
      >
        <Globe className="size-3/5" strokeWidth={1.75} />
      </span>
    );
  }

  return (
    <Image
      src={`${FLAG_BASE}/flag-${code}-64.webp`}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      unoptimized
      draggable={false}
      style={{ width: size, height: size }}
      className={cn("shrink-0 select-none object-contain", className)}
    />
  );
}

// ============================================================
// LOGO — ENEENA
// ============================================================

const LOGO_BASE = "/images/logos";

const ICON_CLASS =
  "absolute inset-0 size-14 select-none object-contain transition-all duration-300 group-hover:scale-[1.04]";

const FULL_CLASS =
  "absolute inset-0 h-full w-auto select-none object-contain transition-all duration-300 group-hover:scale-[1.02]";

function Logo() {
  return (
    <Link
      href="/"
      aria-label="ENEENA — Home"
      className="group relative flex h-16 shrink-0 items-center no-underline transition-opacity duration-200 hover:opacity-85 sm:h-20"
    >
      {/* PHONES: square icon */}
      <span className="relative flex h-12 w-12 items-center sm:hidden">
        <Image
          src={`${LOGO_BASE}/icon-maroon-1024.png`}
          alt="ENEENA"
          width={1024}
          height={1024}
          sizes="48px"
          priority
          unoptimized
          className={cn("block dark:hidden", ICON_CLASS, "size-12")}
        />
        <Image
          src={`${LOGO_BASE}/icon-white-1024.png`}
          alt="ENEENA"
          width={1024}
          height={1024}
          sizes="48px"
          priority
          unoptimized
          className={cn("hidden dark:block", ICON_CLASS, "size-12")}
        />
      </span>

      {/* TABLET + DESKTOP: full logo (scales with breakpoint) */}
      <span className="relative hidden h-14 w-56 items-center sm:flex xl:h-16 xl:w-64 2xl:h-20 2xl:w-80">
        <Image
          src={`${LOGO_BASE}/light.png`}
          alt="ENEENA"
          width={1600}
          height={400}
          sizes="(min-width:1536px) 320px, (min-width:1280px) 256px, 224px"
          priority
          unoptimized
          className={cn("block dark:hidden", FULL_CLASS)}
        />
        <Image
          src={`${LOGO_BASE}/dark.png`}
          alt="ENEENA"
          width={1600}
          height={400}
          sizes="(min-width:1536px) 320px, (min-width:1280px) 256px, 224px"
          priority
          unoptimized
          className={cn("hidden dark:block", FULL_CLASS)}
        />
      </span>
    </Link>
  );
}

// ============================================================
// CUSTOM SVG — SHIELD
// ============================================================

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2 4 5v6c0 5.25 3.4 9.74 8 11 4.6-1.26 8-5.75 8-11V5l-8-3Z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

// ============================================================
// DESKTOP — CATEGORY CARD (image + name + sub links with "|")
// ============================================================

function CategoryCard({
  category,
  onNavigate,
}: {
  category: CategoryListItem;
  onNavigate: () => void;
}) {
  const href = `/${category.language.code}/${category.slug}`;
  const subs = category.subcategories.slice(0, 3);

  return (
    <div className="group/card flex items-start gap-3 rounded-xl p-2.5 ring-1 ring-transparent transition-all duration-200 hover:bg-muted/60 hover:ring-border/60">
      <Link
        href={href}
        onClick={onNavigate}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block size-14 shrink-0 overflow-hidden rounded-xl ring-1 ring-border/60"
      >
        {category.coverImage ? (
          <Image
            src={category.coverImage}
            alt=""
            fill
            sizes="56px"
            className="object-cover transition-transform duration-500 group-hover/card:scale-110"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
            <Globe className="size-5" strokeWidth={1.5} />
          </span>
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          href={href}
          onClick={onNavigate}
          className="block wrap-break-word text-[14px] font-bold leading-snug text-primary no-underline transition-opacity hover:opacity-80 ltr:line-clamp-2 rtl:text-[16px] rtl:leading-loose"
        >
          {category.name}
        </Link>

        {subs.length > 0 && (
          <ul className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
            {subs.map((sub, i) => (
              <li key={sub.id} className="flex items-center gap-1.5">
                {i > 0 && (
                  <span aria-hidden="true" className="text-border">
                    |
                  </span>
                )}
                <Link
                  href={`${href}/${sub.slug}`}
                  onClick={onNavigate}
                  className="text-[11.5px] leading-snug text-muted-foreground no-underline transition-colors hover:text-primary rtl:text-[13px] rtl:leading-loose"
                >
                  {sub.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ============================================================
// DESKTOP — EDITION HEADER (banner)
// ============================================================

function EditionHeader({
  language,
  onNavigate,
}: {
  language: LanguageListItem;
  onNavigate: () => void;
}) {
  const copy = getCopy(language);

  return (
    <div className="relative overflow-hidden rounded-xl bg-linear-to-br from-primary/10 via-primary/5 to-transparent ring-1 ring-primary/10">
      <Link
        href={`/${language.code}`}
        onClick={onNavigate}
        className="group/ed flex items-center gap-3 px-4 py-3.5 no-underline"
      >
        <Flag code={language.code} size={36} />

        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold leading-tight text-primary transition-opacity group-hover/ed:opacity-80 rtl:text-2xl rtl:leading-loose">
            {copy.title}
          </p>
          <p className="text-[12px] leading-snug text-muted-foreground rtl:text-[14px] rtl:leading-loose">
            {copy.tagline}
          </p>
        </div>
      </Link>

      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary/70" />
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

interface NavbarClientProps {
  categories: CategoryListItem[];
  languages: LanguageListItem[];
}

export function NavbarClient({
  categories,
  languages,
}: NavbarClientProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();

  const currentLangCode = getLanguageFromPathname(pathname);

  const [openLang, setOpenLang] = React.useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const [langSheetOpen, setLangSheetOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const [prevPathname, setPrevPathname] = React.useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpenLang(null);
    setUserMenuOpen(false);
    setLangSheetOpen(false);
    setMobileOpen(false);
  }

  const langGroupRef = React.useRef<HTMLDivElement>(null);
  const langSheetRef = React.useRef<HTMLDivElement>(null);
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  const role = (
    user?.publicMetadata as { role?: string } | undefined
  )?.role;

  const isAdmin = role === "ADMIN";

  const isAdminRoute =
    pathname === "/admin" || pathname.startsWith("/admin/");

  const isSavedRoute = pathname === "/saved";

  // Close dropdowns on outside click
  React.useEffect(() => {
    if (!openLang && !userMenuOpen && !langSheetOpen) return;

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;

      if (
        langGroupRef.current &&
        !langGroupRef.current.contains(target)
      ) {
        setOpenLang(null);
      }

      if (
        langSheetRef.current &&
        !langSheetRef.current.contains(target)
      ) {
        setLangSheetOpen(false);
      }

      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(target)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [openLang, userMenuOpen, langSheetOpen]);

  // Escape closes everything
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenLang(null);
        setUserMenuOpen(false);
        setLangSheetOpen(false);
        setMobileOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Lock page scroll while the mobile drawer is open
  React.useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  // Close mobile layers if the screen grows to desktop
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const onChange = () => {
      if (mq.matches) {
        setMobileOpen(false);
        setLangSheetOpen(false);
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (isAdminRoute) return null;

  const activeLanguages = languages;

  const openLanguageData = activeLanguages.find(
    (language) => language.code === openLang,
  );

  const openCategories = categories.filter(
    (category) => category.language.code === openLang,
  );

  const currentLanguage =
    activeLanguages.find((l) => l.code === currentLangCode) ??
    activeLanguages.find((l) => l.code === "en") ??
    activeLanguages[0];

  const mobileCategories = categories.filter(
    (category) => category.language.code === currentLanguage?.code,
  );

  const isOpenRTL = openLanguageData?.direction === "RTL";

  const searchHref = "/search";

  return (
    <header className="relative z-50 w-full">
      <div className="flex h-16 items-center justify-between gap-2 sm:h-20 sm:gap-4 xl:h-22">
        {/* ====================================================
            LEFT: HAMBURGER (mobile) + LOGO + DIVIDER
        ==================================================== */}
        <div className="flex min-w-0 items-center gap-1 sm:gap-2 xl:gap-4">
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className={cn(ICON_BTN, "text-foreground/80 xl:hidden")}
          >
            <Menu className="size-5" strokeWidth={1.75} />
          </button>

          <Logo />

          <span
            aria-hidden="true"
            className="hidden h-9 w-px bg-border xl:block"
          />
        </div>

        {/* ====================================================
            RIGHT: LANGUAGES + ACTIONS
        ==================================================== */}
        <div className="flex min-w-0 shrink-0 items-center gap-0.5 sm:gap-1.5 xl:flex-1 xl:justify-end">
          {/* ---------- DESKTOP (xl+): SIX LANGUAGE PILLS ---------- */}
          <div
            ref={langGroupRef}
            className="relative hidden items-center gap-0.5 xl:flex"
          >
            {activeLanguages.map((lang) => {
              const isOpen = openLang === lang.code;
              const isCurrent = currentLangCode === lang.code;
              const isRTL = lang.direction === "RTL";

              return (
                <div
                  key={lang.id}
                  className={cn(
                    "relative inline-flex h-10 items-center rounded-full transition-all duration-200",
                    isOpen
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-muted",
                  )}
                >
                  <Link
                    href={`/${lang.code}`}
                    onClick={() => setOpenLang(null)}
                    aria-current={isCurrent ? "page" : undefined}
                    lang={lang.code}
                    dir={isRTL ? "rtl" : "ltr"}
                    className={cn(
                      "inline-flex h-10 items-center gap-2 rounded-full ps-2.5 pe-0.5 text-[13px] font-bold no-underline transition-colors",
                      isOpen
                        ? "text-primary-foreground"
                        : isCurrent
                          ? "text-primary"
                          : "text-foreground/80 hover:text-foreground",
                      isRTL && "text-sm leading-loose",
                    )}
                  >
                    <Flag code={lang.code} size={22} />
                    <span className="whitespace-nowrap">
                      {lang.nativeName}
                    </span>
                  </Link>

                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    aria-label={`Browse ${lang.name} categories`}
                    onClick={() =>
                      setOpenLang(isOpen ? null : lang.code)
                    }
                    className={cn(
                      "inline-flex h-10 w-7 items-center justify-center rounded-full transition-colors",
                      isOpen
                        ? "text-primary-foreground/90"
                        : "text-muted-foreground hover:text-primary",
                    )}
                  >
                    <ChevronDown
                      className={cn(
                        "size-3.5 transition-transform duration-200",
                        isOpen && "rotate-180",
                      )}
                      strokeWidth={2}
                    />
                  </button>
                </div>
              );
            })}

            {/* DESKTOP CATEGORY DROPDOWN */}
            {openLang && openLanguageData && (
              <div className="absolute inset-e-0 top-full z-50 pt-3">
                <div
                  dir={isOpenRTL ? "rtl" : "ltr"}
                  lang={openLang}
                  className={cn(
                    "w-[min(640px,calc(100vw-2rem))]",
                    PANEL,
                  )}
                >
                  <div
                    className={cn(
                      "max-h-[75vh] overflow-y-auto p-4",
                      HIDE_SCROLLBAR,
                    )}
                  >
                    <EditionHeader
                      language={openLanguageData}
                      onNavigate={() => setOpenLang(null)}
                    />

                    {openCategories.length === 0 ? (
                      <p className="mt-5 pb-1 text-sm leading-relaxed text-muted-foreground rtl:text-[15px] rtl:leading-loose">
                        {getCopy(openLanguageData).empty}
                      </p>
                    ) : (
                      <div className="mt-3 grid grid-cols-2 items-start gap-x-2 gap-y-1">
                        {openCategories.map((category) => (
                          <CategoryCard
                            key={category.id}
                            category={category}
                            onNavigate={() => setOpenLang(null)}
                          />
                        ))}
                      </div>
                    )}

                    <Link
                      href={`/${openLanguageData.code}`}
                      onClick={() => setOpenLang(null)}
                      className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-[13px] font-bold text-primary-foreground no-underline shadow-sm transition-opacity hover:opacity-90 rtl:text-[15px] rtl:leading-loose"
                    >
                      {getCopy(openLanguageData).open}
                      <ArrowRight
                        className="size-4 rtl:rotate-180"
                        strokeWidth={2}
                      />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ---------- MOBILE / TABLET (<xl): LANGUAGE SELECTOR ---------- */}
          {currentLanguage && (
            <div
              ref={langSheetRef}
              className="relative xl:hidden"
            >
              <button
                type="button"
                aria-haspopup="dialog"
                aria-expanded={langSheetOpen}
                aria-label="Select language"
                onClick={() => setLangSheetOpen((v) => !v)}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-full px-2 transition-colors hover:bg-muted sm:h-10 sm:px-3",
                  langSheetOpen && "bg-muted",
                )}
              >
                <Flag code={currentLanguage.code} size={24} />
                <span className="hidden text-[13px] font-bold uppercase text-foreground/80 sm:inline">
                  {currentLanguage.code}
                </span>
                <ChevronDown
                  className={cn(
                    "size-3.5 text-muted-foreground transition-transform duration-200",
                    langSheetOpen && "rotate-180",
                  )}
                  strokeWidth={2}
                />
              </button>

              {langSheetOpen && (
                <>
                  {/* phone backdrop */}
                  <button
                    type="button"
                    aria-label="Close language selector"
                    onClick={() => setLangSheetOpen(false)}
                    className="fixed inset-0 z-60 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200 sm:hidden"
                  />

                  <div
                    role="dialog"
                    aria-label="Select language"
                    className={cn(
                      "fixed inset-x-0 bottom-0 z-70 max-h-[80vh] overflow-y-auto rounded-t-3xl border-t border-border bg-popover pb-[env(safe-area-inset-bottom)] text-popover-foreground shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-200",
                      "sm:absolute sm:inset-x-auto sm:bottom-auto sm:inset-e-0 sm:top-full sm:z-50 sm:mt-2 sm:w-72 sm:rounded-2xl sm:border sm:pb-0 sm:shadow-xl sm:slide-in-from-top-2",
                      HIDE_SCROLLBAR,
                    )}
                  >
                    <div className="flex items-center justify-between border-b border-border px-4 py-3">
                      <p className="text-sm font-bold">Select Language</p>
                      <button
                        type="button"
                        aria-label="Close"
                        onClick={() => setLangSheetOpen(false)}
                        className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <X className="size-4" strokeWidth={1.75} />
                      </button>
                    </div>

                    <ul className="p-2">
                      {activeLanguages.map((lang) => {
                        const isCurrent = lang.code === currentLanguage.code;
                        return (
                          <li key={lang.id}>
                            <Link
                              href={`/${lang.code}`}
                              onClick={() => setLangSheetOpen(false)}
                              aria-current={isCurrent ? "page" : undefined}
                              className={cn(
                                "flex items-center gap-3 rounded-xl px-3 py-3 no-underline transition-colors hover:bg-muted",
                                isCurrent && "bg-primary/5",
                              )}
                            >
                              <Flag code={lang.code} size={28} />

                              <span className="min-w-0 flex-1">
                                <span
                                  lang={lang.code}
                                  dir={
                                    lang.direction === "RTL" ? "rtl" : "ltr"
                                  }
                                  className={cn(
                                    "block text-[15px] font-semibold leading-tight text-foreground",
                                    lang.direction === "RTL" &&
                                      "text-base leading-loose",
                                  )}
                                >
                                  {lang.nativeName}
                                </span>
                                {lang.nativeName !== lang.name && (
                                  <span className="block text-[11px] text-muted-foreground">
                                    {lang.name}
                                  </span>
                                )}
                              </span>

                              {isCurrent && (
                                <span className="inline-flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                  <Check
                                    className="size-3.5"
                                    strokeWidth={3}
                                  />
                                </span>
                              )}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </>
              )}
            </div>
          )}

          {/* SEARCH (tablet and up; phones get it in the drawer) */}
          <Link
            href={searchHref}
            aria-label="Search"
            className={cn(
              ICON_BTN,
              "hidden text-foreground/70 sm:inline-flex",
            )}
          >
            <Search className="size-4.5" strokeWidth={1.75} />
          </Link>

          {/* SAVED ARTICLES (tablet and up) */}
          <Show when="signed-in">
            <Link
              href="/saved"
              aria-label="Saved articles"
              className={cn(
                ICON_BTN,
                "hidden sm:inline-flex",
                isSavedRoute
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/70",
              )}
            >
              <Bookmark
                className="size-4.5"
                strokeWidth={1.75}
                fill={isSavedRoute ? "currentColor" : "none"}
              />
            </Link>
          </Show>

          {/* THEME TOGGLE */}
          <ModeToggle />

          <span
            aria-hidden="true"
            className="mx-1 hidden h-8 w-px bg-border sm:block"
          />

          {/* SIGN IN */}
          <Show when="signed-out">
            <SignInButton
              mode="modal"
              forceRedirectUrl="/"
              signUpForceRedirectUrl="/"
            >
              <button
                type="button"
                className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-4 text-[13px] font-bold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 sm:h-10 sm:px-6 sm:text-sm"
              >
                Login
              </button>
            </SignInButton>
          </Show>

          {/* USER MENU */}
          <Show when="signed-in">
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                aria-label="Open user menu"
                aria-expanded={userMenuOpen}
                onClick={() => setUserMenuOpen((value) => !value)}
                className="inline-flex items-center gap-1 rounded-full p-0.5 transition-colors hover:bg-muted"
              >
                <span className="inline-flex size-9 items-center justify-center overflow-hidden rounded-full border border-border sm:size-10">
                  {user?.imageUrl ? (
                    <Image
                      src={user.imageUrl}
                      alt="User"
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-primary text-xs font-bold text-primary-foreground">
                      {user?.firstName?.[0]?.toUpperCase() ?? "U"}
                    </span>
                  )}
                </span>

                <ChevronDown
                  className={cn(
                    "me-1 hidden size-3.5 text-muted-foreground transition-transform duration-200 sm:block",
                    userMenuOpen && "rotate-180",
                  )}
                  strokeWidth={2}
                />
              </button>

              {userMenuOpen && (
                <div
                  className={cn(
                    "absolute inset-e-0 top-full z-50 mt-3 w-[min(280px,calc(100vw-1.5rem))] overflow-hidden",
                    USER_PANEL,
                  )}
                >
                  <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
                    <span className="relative inline-flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border">
                      {user?.imageUrl ? (
                        <Image
                          src={user.imageUrl}
                          alt=""
                          width={44}
                          height={44}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center bg-primary text-sm font-bold text-primary-foreground">
                          {user?.firstName?.[0]?.toUpperCase() ?? "U"}
                        </span>
                      )}
                    </span>

                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-bold text-foreground">
                        {user?.fullName ?? "Reader"}
                      </p>
                      <p className="truncate text-[12px] text-muted-foreground">
                        {user?.username
                          ? `@${user.username}`
                          : user?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </div>

                  <ul className="p-1.5">
                    <li>
                      <Link
                        href="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className={MENU_ITEM}
                      >
                        <UserIcon className="size-4" />
                        Profile
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/saved"
                        onClick={() => setUserMenuOpen(false)}
                        className={MENU_ITEM}
                      >
                        <Bookmark className="size-4" />
                        Saved
                      </Link>
                    </li>

                    {isAdmin && (
                      <>
                        <li className="mx-3 my-1 h-px bg-border" />
                        <li>
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className={cn(
                              MENU_ITEM,
                              "font-medium text-primary hover:bg-primary/10",
                            )}
                          >
                            <ShieldIcon className="size-4" />
                            Admin
                          </Link>
                        </li>
                      </>
                    )}
                  </ul>

                  <div className="border-t border-border p-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        signOut({ redirectUrl: "/" });
                      }}
                      className={cn(MENU_ITEM, "hover:text-destructive")}
                    >
                      <LogOut className="size-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Show>
        </div>
      </div>

      {/* ======================================================
          MOBILE DRAWER (<xl): search, saved, categories
      ====================================================== */}
      {mobileOpen && (
        <div className="fixed inset-0 z-60 xl:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200"
          />

          <nav
            aria-label="Main menu"
            dir={currentLanguage?.direction === "RTL" ? "rtl" : "ltr"}
            className={cn(
              "absolute inset-y-0 inset-s-0 flex w-[min(340px,88vw)] flex-col bg-popover text-popover-foreground shadow-2xl animate-in duration-300",
              "ltr:slide-in-from-left rtl:slide-in-from-right",
            )}
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
              <span className="text-sm font-bold text-primary">
                {currentLanguage ? getCopy(currentLanguage).title : "Menu"}
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-5" strokeWidth={1.75} />
              </button>
            </div>

            <div
              className={cn(
                "flex-1 overflow-y-auto px-3 py-3 pb-[max(1rem,env(safe-area-inset-bottom))]",
                HIDE_SCROLLBAR,
              )}
            >
              <div className="space-y-1">
                <Link
                  href={searchHref}
                  onClick={() => setMobileOpen(false)}
                  className={MENU_ITEM}
                >
                  <Search className="size-4" />
                  Search
                </Link>

                <Show when="signed-in">
                  <Link
                    href="/saved"
                    onClick={() => setMobileOpen(false)}
                    className={MENU_ITEM}
                  >
                    <Bookmark className="size-4" />
                    Saved
                  </Link>
                </Show>
              </div>

              <div className="my-3 h-px bg-border" />

              {currentLanguage && (
                <Link
                  href={`/${currentLanguage.code}`}
                  onClick={() => setMobileOpen(false)}
                  className="mb-1 flex items-center gap-3 rounded-xl px-3.5 py-2.5 no-underline transition-colors hover:bg-muted"
                >
                  <Flag code={currentLanguage.code} size={24} />
                  <span
                    lang={currentLanguage.code}
                    className="flex-1 text-[14px] font-bold text-primary rtl:text-[16px]"
                  >
                    {getCopy(currentLanguage).open}
                  </span>
                  <ArrowRight
                    className="size-4 text-primary rtl:rotate-180"
                    strokeWidth={2}
                  />
                </Link>
              )}

              <ul className="space-y-1">
                {mobileCategories.map((category) => {
                  const href = `/${category.language.code}/${category.slug}`;
                  return (
                    <li
                      key={category.id}
                      className="rounded-xl px-1 py-1"
                    >
                      <Link
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-2.5 py-2 no-underline transition-colors hover:bg-muted"
                      >
                        <span className="relative size-10 shrink-0 overflow-hidden rounded-lg ring-1 ring-border/60">
                          {category.coverImage ? (
                            <Image
                              src={category.coverImage}
                              alt=""
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                              <Globe className="size-4" strokeWidth={1.5} />
                            </span>
                          )}
                        </span>
                        <span className="min-w-0 flex-1 wrap-break-word text-[14px] font-bold leading-snug text-foreground rtl:text-[16px] rtl:leading-loose">
                          {category.name}
                        </span>
                      </Link>

                      {category.subcategories.length > 0 && (
                        <ul className="ms-13 mt-0.5 flex flex-wrap gap-1.5 pb-1">
                          {category.subcategories.map((sub) => (
                            <li key={sub.id}>
                              <Link
                                href={`${href}/${sub.slug}`}
                                onClick={() => setMobileOpen(false)}
                                className="inline-flex rounded-full bg-muted/70 px-2.5 py-1 text-[12px] text-muted-foreground no-underline transition-colors hover:bg-primary/10 hover:text-primary rtl:text-[13px]"
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>

              {mobileCategories.length === 0 && currentLanguage && (
                <p className="px-3.5 py-2 text-sm text-muted-foreground">
                  {getCopy(currentLanguage).empty}
                </p>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}