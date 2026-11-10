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

import type { LanguageListItem } from "@/actions/language/get-languages";
import type { CategoryListItem } from "@/actions/categories/get-categories";

// ============================================================
// STYLES
// ============================================================

const HIDE_SCROLLBAR =
  "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

const PANEL =
  "rounded-2xl border border-border/70 bg-popover text-popover-foreground shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18)] animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 origin-top";

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
  bn: {
    title: "বাংলা সংস্করণ",
    tagline: "স্বাধীন বাংলা নিউজরুম",
    open: "বাংলা সংস্করণ খুলুন",
    empty: "এখনও কোনো বিভাগ নেই।",
  },
  id: {
    title: "Edisi Indonesia",
    tagline: "Ruang berita Indonesia yang independen",
    open: "Buka edisi Indonesia",
    empty: "Belum ada kategori.",
  },
  es: {
    title: "Edición en español",
    tagline: "Redacción independiente en español",
    open: "Abrir edición en español",
    empty: "Aún no hay categorías.",
  },
  fr: {
    title: "Édition française",
    tagline: "Rédaction française indépendante",
    open: "Ouvrir l'édition française",
    empty: "Aucune catégorie pour le moment.",
  },
  pt: {
    title: "Edição em português",
    tagline: "Redação independente em português",
    open: "Abrir edição em português",
    empty: "Ainda não há categorias.",
  },
  ja: {
    title: "日本語版",
    tagline: "独立系の日本語ニュースルーム",
    open: "日本語版を開く",
    empty: "カテゴリはまだありません。",
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
  return pathname.split("/").filter(Boolean)[0] || "en";
}

// ============================================================
// LANGUAGE FLAGS
// ============================================================

const FLAG_BASE = "/images/navbar";

const FLAG_CODES = new Set([
  "en",
  "ur",
  "ar",
  "de",
  "hi",
  "zh",
  "bn",
  "id",
  "es",
  "fr",
  "pt",
  "ja",
]);

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
          className
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
// LOGO
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
// SHIELD ICON
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
// DESKTOP LANGUAGE DROPDOWN
// ============================================================

function DesktopLanguageDropdown({
  languages,
  currentLangCode,
}: {
  languages: LanguageListItem[];
  currentLangCode: string;
}) {
  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const currentLanguage =
    languages.find((language) => language.code === currentLangCode) ??
    languages.find((language) => language.isDefault) ??
    languages[0];

  React.useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  if (!currentLanguage) return null;

  return (
    <div ref={dropdownRef} className="relative hidden xl:block">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "inline-flex h-10 items-center gap-2.5 rounded-full border px-3.5 transition-all duration-200",
          open
            ? "border-primary/30 bg-primary/5 text-primary"
            : "border-border/70 bg-background text-foreground hover:border-primary/30 hover:bg-muted/60"
        )}
      >
        <Flag code={currentLanguage.code} size={23} />
        <span
          lang={currentLanguage.code}
          dir={currentLanguage.direction === "RTL" ? "rtl" : "ltr"}
          className="max-w-32.5 truncate text-[13px] font-semibold"
        >
          {currentLanguage.nativeName}
        </span>
        <ChevronDown
          className={cn("size-4 text-muted-foreground transition-transform duration-200", open && "rotate-180")}
          strokeWidth={1.8}
        />
      </button>

      {open && (
        <div className={cn("absolute inset-e-0 top-full z-50 mt-3 w-[320px] overflow-hidden", PANEL)}>
          <div className="border-b border-border px-4 py-4">
            <p className="font-serif text-lg font-semibold text-foreground">Language Editions</p>
            <p className="mt-1 text-xs text-muted-foreground">Explore ENEENA in your preferred language.</p>
          </div>

          <div role="listbox" aria-label="Available language editions" className={cn("max-h-[min(440px,65vh)] overflow-y-auto p-2", HIDE_SCROLLBAR)}>
            {languages.map((language) => {
              const isCurrent = language.code === currentLangCode;
              return (
                <Link
                  key={language.id}
                  href={`/${language.code}`}
                  lang={language.code}
                  dir={language.direction === "RTL" ? "rtl" : "ltr"}
                  aria-current={isCurrent ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn("flex items-center gap-3 rounded-xl px-3 py-3 no-underline transition-colors", isCurrent ? "bg-primary/8 text-primary" : "text-foreground hover:bg-muted")}
                >
                  <Flag code={language.code} size={29} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-semibold">{language.nativeName}</span>
                    {language.nativeName !== language.name && (
                      <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">{language.name}</span>
                    )}
                  </span>
                  {isCurrent && (
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-3.5" strokeWidth={2.5} />
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
          <div className="border-t border-border px-4 py-3">
            <p className="text-center text-[10px] tracking-wide text-muted-foreground">ENEENA — STORIES WITHOUT BORDERS</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MOBILE LANGUAGE SELECTOR
// ============================================================

function MobileLanguageSelector({
  languages,
  currentLanguage,
}: {
  languages: LanguageListItem[];
  currentLanguage?: LanguageListItem;
}) {
  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (!currentLanguage) return null;

  return (
    <div ref={dropdownRef} className="relative xl:hidden">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Select language"
        onClick={() => setOpen((value) => !value)}
        className={cn("inline-flex h-9 items-center gap-1.5 rounded-full px-2 transition-colors hover:bg-muted sm:h-10 sm:px-3", open && "bg-muted")}
      >
        <Flag code={currentLanguage.code} size={24} />
        <span className="hidden text-[13px] font-bold uppercase text-foreground/80 sm:inline">{currentLanguage.code}</span>
        <ChevronDown className={cn("size-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <>
          <button type="button" aria-label="Close language selector" onClick={() => setOpen(false)} className="fixed inset-0 z-60 bg-black/40 sm:hidden" />
          <div
            role="dialog"
            aria-label="Select language"
            className={cn(
              "fixed inset-x-0 bottom-0 z-70 max-h-[80vh] overflow-y-auto rounded-t-3xl border-t border-border bg-popover pb-[env(safe-area-inset-bottom)] text-popover-foreground shadow-2xl",
              "sm:absolute sm:inset-x-auto sm:bottom-auto sm:inset-e-0 sm:top-full sm:z-50 sm:mt-2 sm:w-72 sm:rounded-2xl sm:border sm:pb-0",
              HIDE_SCROLLBAR
            )}
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <p className="text-sm font-bold">Select Language</p>
              <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted">
                <X className="size-4" />
              </button>
            </div>
            <ul className="p-2">
              {languages.map((language) => {
                const isCurrent = language.code === currentLanguage.code;
                return (
                  <li key={language.id}>
                    <Link
                      href={`/${language.code}`}
                      onClick={() => setOpen(false)}
                      aria-current={isCurrent ? "page" : undefined}
                      lang={language.code}
                      dir={language.direction === "RTL" ? "rtl" : "ltr"}
                      className={cn("flex items-center gap-3 rounded-xl px-3 py-3 no-underline transition-colors hover:bg-muted", isCurrent && "bg-primary/5")}
                    >
                      <Flag code={language.code} size={28} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-semibold text-foreground">{language.nativeName}</span>
                        {language.nativeName !== language.name && (
                          <span className="block text-[11px] text-muted-foreground">{language.name}</span>
                        )}
                      </span>
                      {isCurrent && (
                        <span className="inline-flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="size-3.5" strokeWidth={3} />
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
  );
}

// ============================================================
// MAIN NAVBAR
// ============================================================

interface NavbarClientProps {
  categories: CategoryListItem[];
  languages: LanguageListItem[];
}

export function NavbarClient({ categories, languages }: NavbarClientProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();

  const currentLangCode = getLanguageFromPathname(pathname);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [prevPathname, setPrevPathname] = React.useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setUserMenuOpen(false);
    setMobileOpen(false);
  }

  const userMenuRef = React.useRef<HTMLDivElement>(null);
  const role = (user?.publicMetadata as { role?: string } | undefined)?.role;
  const isAdmin = role === "ADMIN";
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isSavedRoute = pathname === "/saved";

  React.useEffect(() => {
    if (!userMenuOpen) return;
    const onMouseDown = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [userMenuOpen]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setUserMenuOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  React.useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [mobileOpen]);

  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const onChange = () => { if (mq.matches) setMobileOpen(false); };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (isAdminRoute) return null;

  const activeLanguages = languages.filter((language) => language.isActive);
  const currentLanguage = activeLanguages.find((language) => language.code === currentLangCode) ?? activeLanguages.find((language) => language.isDefault) ?? activeLanguages[0];
  const mobileCategories = categories.filter((category) => category.language.code === currentLanguage?.code);
  const searchHref = "/search";

  return (
    <header className="relative z-50 w-full">
      {/* 👇 REMOVED PADDING FROM THE TOP LEVEL DIV */}
      <div className="flex  items-center justify-between ">
        
        {/* LEFT: LOGO */}
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

          <span aria-hidden="true" className="hidden h-9 w-px bg-border xl:block" />
        </div>

        {/* RIGHT: LANGUAGE DROPDOWN + ACTIONS */}
        <div className="flex min-w-0 shrink-0 items-center gap-0.5 sm:gap-1.5 xl:flex-1 xl:justify-end">
          <DesktopLanguageDropdown languages={activeLanguages} currentLangCode={currentLangCode} />
          <MobileLanguageSelector languages={activeLanguages} currentLanguage={currentLanguage} />

          <Link href={searchHref} aria-label="Search" className={cn(ICON_BTN, "hidden text-foreground/70 sm:inline-flex")}>
            <Search className="size-4.5" strokeWidth={1.75} />
          </Link>

          <Show when="signed-in">
            <Link href="/saved" aria-label="Saved articles" className={cn(ICON_BTN, "hidden sm:inline-flex", isSavedRoute ? "bg-primary/10 text-primary" : "text-foreground/70")}>
              <Bookmark className="size-4.5" strokeWidth={1.75} fill={isSavedRoute ? "currentColor" : "none"} />
            </Link>
          </Show>

          <ModeToggle />
          <span aria-hidden="true" className="mx-1 hidden h-8 w-px bg-border sm:block" />

          <Show when="signed-out">
            <SignInButton mode="modal" forceRedirectUrl="/" signUpForceRedirectUrl="/">
              <button type="button" className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-4 text-[13px] font-bold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 sm:h-10 sm:px-6 sm:text-sm">
                Login
              </button>
            </SignInButton>
          </Show>

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
                    <Image src={user.imageUrl} alt="User" width={40} height={40} className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-primary text-xs font-bold text-primary-foreground">{user?.firstName?.[0]?.toUpperCase() ?? "U"}</span>
                  )}
                </span>
                <ChevronDown className={cn("me-1 hidden size-3.5 text-muted-foreground transition-transform duration-200 sm:block", userMenuOpen && "rotate-180")} />
              </button>

              {userMenuOpen && (
                <div className={cn("absolute inset-e-0 top-full z-50 mt-3 w-[min(280px,calc(100vw-1.5rem))] overflow-hidden", USER_PANEL)}>
                  <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
                    <span className="relative inline-flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border">
                      {user?.imageUrl ? (
                        <Image src={user.imageUrl} alt="" width={44} height={44} className="h-full w-full object-cover" />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center bg-primary text-sm font-bold text-primary-foreground">{user?.firstName?.[0]?.toUpperCase() ?? "U"}</span>
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-bold text-foreground">{user?.fullName ?? "Reader"}</p>
                      <p className="truncate text-[12px] text-muted-foreground">{user?.username ? `@${user.username}` : user?.primaryEmailAddress?.emailAddress}</p>
                    </div>
                  </div>
                  <ul className="p-1.5">
                    <li><Link href="/profile" onClick={() => setUserMenuOpen(false)} className={MENU_ITEM}><UserIcon className="size-4" /> Profile</Link></li>
                    <li><Link href="/saved" onClick={() => setUserMenuOpen(false)} className={MENU_ITEM}><Bookmark className="size-4" /> Saved</Link></li>
                    {isAdmin && (
                      <>
                        <li className="mx-3 my-1 h-px bg-border" />
                        <li><Link href="/admin" onClick={() => setUserMenuOpen(false)} className={cn(MENU_ITEM, "font-medium text-primary hover:bg-primary/10")}><ShieldIcon className="size-4" /> Admin</Link></li>
                      </>
                    )}
                  </ul>
                  <div className="border-t border-border p-1.5">
                    <button type="button" onClick={() => { setUserMenuOpen(false); signOut({ redirectUrl: "/" }); }} className={cn(MENU_ITEM, "hover:text-destructive")}>
                      <LogOut className="size-4" /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Show>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="fixed inset-0 z-60 xl:hidden">
          <button type="button" aria-label="Close menu" onClick={() => setMobileOpen(false)} className="absolute inset-0 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200" />
          <nav aria-label="Main menu" dir={currentLanguage?.direction === "RTL" ? "rtl" : "ltr"} className={cn("absolute inset-y-0 inset-s-0 flex w-[min(340px,88vw)] flex-col bg-popover text-popover-foreground shadow-2xl animate-in duration-300", "ltr:slide-in-from-left rtl:slide-in-from-right")}>
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
              <span className="text-sm font-bold text-primary">{currentLanguage ? getCopy(currentLanguage).title : "Menu"}</span>
              <button type="button" aria-label="Close menu" onClick={() => setMobileOpen(false)} className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <X className="size-5" strokeWidth={1.75} />
              </button>
            </div>
            <div className={cn("flex-1 overflow-y-auto px-3 py-3 pb-[max(1rem,env(safe-area-inset-bottom))]", HIDE_SCROLLBAR)}>
              <div className="space-y-1">
                <Link href={searchHref} onClick={() => setMobileOpen(false)} className={MENU_ITEM}><Search className="size-4" /> Search</Link>
                <Show when="signed-in">
                  <Link href="/saved" onClick={() => setMobileOpen(false)} className={MENU_ITEM}><Bookmark className="size-4" /> Saved</Link>
                </Show>
              </div>
              <div className="my-3 h-px bg-border" />
              {currentLanguage && (
                <Link href={`/${currentLanguage.code}`} onClick={() => setMobileOpen(false)} className="mb-1 flex items-center gap-3 rounded-xl px-3.5 py-2.5 no-underline transition-colors hover:bg-muted">
                  <Flag code={currentLanguage.code} size={24} />
                  <span className="flex-1 text-[14px] font-bold text-primary rtl:text-[16px]">{getCopy(currentLanguage).open}</span>
                  <ArrowRight className="size-4 text-primary rtl:rotate-180" strokeWidth={2} />
                </Link>
              )}
              <ul className="space-y-1">
                {mobileCategories.map((category) => {
                  const href = `/${category.language.code}/${category.slug}`;
                  return (
                    <li key={category.id} className="rounded-xl px-1 py-1">
                      <Link href={href} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-2.5 py-2 no-underline transition-colors hover:bg-muted">
                        <span className="relative size-10 shrink-0 overflow-hidden rounded-lg ring-1 ring-border/60">
                          {category.coverImage ? (
                            <Image src={category.coverImage} alt="" fill sizes="40px" className="object-cover" />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground"><Globe className="size-4" /></span>
                          )}
                        </span>
                        <span className="min-w-0 flex-1 wrap-break-word text-[14px] font-bold leading-snug text-foreground rtl:text-[16px] rtl:leading-loose">{category.name}</span>
                      </Link>
                      {category.subcategories.length > 0 && (
                        <ul className="ms-13 mt-0.5 flex flex-wrap gap-1.5 pb-1">
                          {category.subcategories.map((sub) => (
                            <li key={sub.id}>
                              <Link href={`${href}/${sub.slug}`} onClick={() => setMobileOpen(false)} className="inline-flex rounded-full bg-muted/70 px-2.5 py-1 text-[12px] text-muted-foreground no-underline transition-colors hover:bg-primary/10 hover:text-primary rtl:text-[13px]">{sub.name}</Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
              {mobileCategories.length === 0 && currentLanguage && (
                <p className="px-3.5 py-2 text-sm text-muted-foreground">{getCopy(currentLanguage).empty}</p>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default NavbarClient;