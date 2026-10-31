// src/components/site/general/navbars/navbar-client.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Bookmark,
  ChevronDown,
  ChevronRight,
  Globe,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { SignInButton, useUser, useClerk, Show } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/site/general/theme/mode-toggle";
import { LanguageListItem } from "@/actions/language/get-languages";
import { CategoryListItem } from "@/actions/categories/get-categories";

const HIDE_SCROLLBAR = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

// Compact floating panel: soft ring + diffused shadow, no heavy borders
const PANEL =
  "rounded-2xl bg-popover/95 text-popover-foreground ring-1 ring-border/60 backdrop-blur-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 origin-top";

// Menu panel for the user dropdown (kept compact)
const USER_PANEL =
  "rounded-2xl border border-border bg-popover text-popover-foreground shadow-xl animate-in fade-in slide-in-from-top-2 duration-200";

// ============================================================
// HELPERS
// ============================================================
function getLanguageFromPathname(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  return parts[0] || "en";
}

// ============================================================
// LOGO — ALENTAH WORLD
// SMALL DEVICES (< 640px) -> square brand icon (1024×1024)
//   /public/images/logos/icon-maroon-1024.png -> light mode
//   /public/images/logos/icon-white-1024.png  -> dark mode
// LARGE DEVICES (>= 640px) -> full logo (3000×1000, 3:1)
//   /public/images/logos/light.png -> light mode
//   /public/images/logos/dark.png  -> dark mode
// - Fixed height, auto width -> keeps the ratio, never stretches
// - Negative start margin cancels the transparent padding inside the PNGs
// ============================================================
function Logo() {
  return (
    <Link
      href="/"
      aria-label="Alentah World — Home"
      className="group -ms-1 flex shrink-0 items-center no-underline transition-opacity duration-200 hover:opacity-85 sm:-ms-4"
    >
      {/* SMALL DEVICES: brand icon */}
      <span className="flex items-center sm:hidden">
        {/* Light mode icon (maroon) */}
        <Image
          src="/images/logos/icon-maroon-1024.png"
          alt="Alentah World"
          width={1024}
          height={1024}
          sizes="56px"
          className="block size-14 select-none object-contain transition-transform duration-300 group-hover:scale-[1.04] dark:hidden"
        />
        {/* Dark mode icon (white) */}
        <Image
          src="/images/logos/icon-white-1024.png"
          alt="Alentah World"
          width={1024}
          height={1024}
          sizes="56px"
          className="hidden size-14 select-none object-contain transition-transform duration-300 group-hover:scale-[1.04] dark:block"
        />
      </span>

      {/* LARGE DEVICES: full logo */}
      <span className="hidden items-center sm:flex">
        {/* Light mode logo (maroon) */}
        <Image
          src="/images/logos/light.png"
          alt="Alentah World"
          width={3000}
          height={1000}
          sizes="240px"
          className="block h-20 w-auto select-none object-contain transition-transform duration-300 group-hover:scale-[1.02] dark:hidden"
        />
        {/* Dark mode logo (white) */}
        <Image
          src="/images/logos/dark.png"
          alt="Alentah World"
          width={3000}
          height={1000}
          sizes="240px"
          className="hidden h-20 w-auto select-none object-contain transition-transform duration-300 group-hover:scale-[1.02] dark:block"
        />
      </span>
    </Link>
  );
}

// ============================================================
// CUSTOM SVG — Shield
// ============================================================
function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 2 4 5v6c0 5.25 3.4 9.74 8 11 4.6-1.26 8-5.75 8-11V5l-8-3Z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

// ============================================================
// CATEGORY CARD (Inside mega-menu) — compact
// NOTE: no `truncate` / line-clamp on RTL text — it clips tall
// Urdu/Arabic glyphs. RTL gets a roomy line-height instead.
// ============================================================
function CategoryCard({
  category,
  onNavigate,
}: {
  category: CategoryListItem;
  onNavigate: () => void;
}) {
  return (
    <div className="group/card rounded-xl bg-muted/40 p-3 ring-1 ring-border/50 transition-all duration-200 hover:bg-muted/70 hover:ring-primary/30">
      <Link
        href={`/${category.language.code}/${category.slug}`}
        onClick={onNavigate}
        className="flex items-center gap-2.5 no-underline"
      >
        {category.coverImage ? (
          <div className="relative size-9 shrink-0 overflow-hidden rounded-lg ring-1 ring-border/60">
            <Image
              src={category.coverImage}
              alt=""
              fill
              sizes="36px"
              className="object-cover transition-transform duration-500 group-hover/card:scale-110"
            />
          </div>
        ) : (
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground ring-1 ring-border/60">
            <Globe className="size-3.5" strokeWidth={1.75} />
          </div>
        )}

        <span className="min-w-0 flex-1 wrap-break-word py-0.5 text-[13px] font-bold leading-snug text-primary transition-opacity group-hover/card:opacity-80 ltr:line-clamp-2 rtl:text-[15px] rtl:leading-loose">
          {category.name}
        </span>
      </Link>

      {category.subcategories.length > 0 && (
        <ul className="mt-2 space-y-0.5 border-t border-border/50 pt-2">
          {category.subcategories.map((sub) => (
            <li key={sub.id}>
              <Link
                href={`/${category.language.code}/${category.slug}/${sub.slug}`}
                onClick={onNavigate}
                className="group/sub flex items-center justify-between gap-2 rounded-md px-2 py-0.5 text-[12px] leading-snug text-muted-foreground no-underline transition-colors hover:bg-background hover:text-foreground rtl:text-[14px] rtl:leading-loose"
              >
                <span className="flex min-w-0 flex-1 items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="size-1 shrink-0 rounded-full bg-primary/40 transition-colors group-hover/sub:bg-primary"
                  />
                  <span className="min-w-0 flex-1 wrap-break-word">{sub.name}</span>
                </span>
                <ChevronRight
                  className="size-3 shrink-0 opacity-40 transition-all group-hover/sub:translate-x-0.5 group-hover/sub:opacity-100 rtl:rotate-180 rtl:group-hover/sub:-translate-x-0.5"
                  strokeWidth={1.75}
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ============================================================
// EDITION HEADER (title is a link to the edition home)
// ============================================================
function EditionHeader({
  language,
  onNavigate,
}: {
  language: LanguageListItem;
  onNavigate: () => void;
}) {
  const editionTitle =
    language.code === "ur" ? "اردو ایڈیشن" : `${language.name} Edition`;
  const editionTagline =
    language.code === "ur"
      ? "آزاد اردو نیوز روم"
      : `Independent ${language.name} newsroom`;

  return (
    <div>
      <Link
        href={`/${language.code}`}
        onClick={onNavigate}
        className="group/ed flex items-center gap-3 no-underline"
      >
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
          <Globe className="size-4" strokeWidth={1.75} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-base font-bold leading-tight text-primary transition-opacity group-hover/ed:opacity-80 rtl:text-xl rtl:leading-loose">
            {editionTitle}
          </p>
          <p className="text-[11px] leading-snug text-muted-foreground rtl:text-[13px] rtl:leading-loose">
            {editionTagline}
          </p>
        </div>
      </Link>

      <div className="relative mt-3 h-px w-full bg-border/70">
        <span className="absolute inset-s-0 top-0 h-px w-16 bg-primary" />
      </div>
    </div>
  );
}

// ============================================================
// MENU ITEM
// ============================================================
const MENU_ITEM =
  "flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] text-popover-foreground/85 no-underline transition-colors hover:bg-accent hover:text-foreground";

// ============================================================
// MAIN COMPONENT
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

  const [openLang, setOpenLang] = React.useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  // Close menus on route change
  const [prevPathname, setPrevPathname] = React.useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpenLang(null);
    setUserMenuOpen(false);
  }

  const langGroupRef = React.useRef<HTMLDivElement>(null);
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  const role = (user?.publicMetadata as { role?: string } | undefined)?.role;
  const isAdmin = role === "ADMIN";
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isSavedRoute = pathname === "/saved";

  // Outside click
  React.useEffect(() => {
    if (!openLang && !userMenuOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (langGroupRef.current && !langGroupRef.current.contains(target)) setOpenLang(null);
      if (userMenuRef.current && !userMenuRef.current.contains(target)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [openLang, userMenuOpen]);

  // Escape key
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenLang(null);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  if (isAdminRoute) return null;

  // Filter out Arabic, keeping only English and Urdu
  const activeLanguages = languages.filter((l) => l.code === "en" || l.code === "ur");

  const openLanguageData = activeLanguages.find((l) => l.code === openLang);
  const openCategories = categories.filter((c) => c.language.code === openLang);
  const isOpenRTL = openLanguageData?.direction === "RTL";

  const ICON_BTN =
    "inline-flex size-9 items-center justify-center rounded-full no-underline transition-colors hover:bg-muted hover:text-primary";

  return (
    <header className="relative z-50 w-full">
      <div className="flex h-20 items-center justify-between gap-2 sm:h-22 sm:gap-4">
        {/* LEFT: Logo */}
        <Logo />

        {/* RIGHT: Languages, Actions */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {/* LANGUAGE EDITIONS (Desktop) */}
          <div ref={langGroupRef} className="relative hidden items-center gap-1 lg:flex">
            {activeLanguages.map((lang) => {
              const isOpen = openLang === lang.code;
              const isCurrent = currentLangCode === lang.code;

              return (
                // Split button: name = link to the edition, arrow = open categories
                <div
                  key={lang.id}
                  className={cn(
                    "inline-flex h-9 items-center rounded-full transition-colors hover:bg-muted",
                    isOpen && "bg-muted",
                  )}
                >
                  <Link
                    href={`/${lang.code}`}
                    onClick={() => setOpenLang(null)}
                    aria-current={isCurrent ? "page" : undefined}
                    className={cn(
                      "inline-flex h-9 items-center rounded-full ps-3.5 pe-1 text-sm font-bold no-underline transition-colors",
                      isCurrent || isOpen
                        ? "text-primary"
                        : "text-foreground/80 hover:text-foreground",
                    )}
                  >
                    {lang.name}
                  </Link>

                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    aria-label={`Browse ${lang.name} categories`}
                    onClick={() => setOpenLang(isOpen ? null : lang.code)}
                    className="inline-flex h-9 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-primary"
                  >
                    <ChevronDown
                      className={cn(
                        "size-3.5 transition-transform duration-200",
                        isOpen && "rotate-180 text-primary",
                      )}
                      strokeWidth={1.75}
                    />
                  </button>
                </div>
              );
            })}

            {openLang && openLanguageData && (
              <div className="absolute right-0 top-full z-50 pt-2">
                <div
                  dir={isOpenRTL ? "rtl" : "ltr"}
                  lang={openLang}
                  className={cn("w-[min(560px,calc(100vw-2rem))]", PANEL)}
                >
                  <div
                    className={cn(
                      "max-h-[70vh] overflow-y-auto p-4",
                      HIDE_SCROLLBAR,
                    )}
                  >
                    <EditionHeader
                      language={openLanguageData}
                      onNavigate={() => setOpenLang(null)}
                    />

                    {openCategories.length === 0 ? (
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground rtl:text-[15px] rtl:leading-loose">
                        {isOpenRTL ? "ابھی کوئی زمرہ نہیں ہے۔" : "No categories yet."}
                      </p>
                    ) : (
                      <div className="mt-4 grid grid-cols-2 items-start gap-2.5">
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
                      className="mt-4 flex items-center justify-center gap-1.5 rounded-lg border border-border/70 py-1.5 text-[12px] font-semibold text-foreground no-underline transition-colors hover:bg-muted hover:text-primary rtl:text-[14px] rtl:leading-loose"
                    >
                      {isOpenRTL ? "اردو ایڈیشن کھولیں" : `Open ${openLanguageData.name} edition`}
                      <ArrowRight className="size-3.5 rtl:rotate-180" strokeWidth={1.75} />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SAVED */}
          <Show when="signed-in">
            <Link
              href="/saved"
              aria-label="Saved articles"
              className={cn(
                ICON_BTN,
                isSavedRoute ? "bg-primary/10 text-primary" : "text-foreground/70",
              )}
            >
              <Bookmark
                className="size-4.5"
                strokeWidth={1.75}
                fill={isSavedRoute ? "currentColor" : "none"}
              />
            </Link>
          </Show>

          <ModeToggle />

          {/* LOGIN */}
          <Show when="signed-out">
            <SignInButton mode="modal" forceRedirectUrl="/" signUpForceRedirectUrl="/">
              <button
                type="button"
                className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-4 text-[13px] font-bold text-primary-foreground hover:opacity-90 sm:h-10 sm:px-6 sm:text-sm"
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
                onClick={() => setUserMenuOpen((v) => !v)}
                className="inline-flex size-9 items-center justify-center overflow-hidden rounded-full border border-border"
              >
                {user?.imageUrl ? (
                  <Image
                    src={user.imageUrl}
                    alt="User"
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary text-xs font-bold text-primary-foreground">
                    {user?.firstName?.[0]?.toUpperCase() ?? "U"}
                  </div>
                )}
              </button>

              {userMenuOpen && (
                <div
                  className={cn(
                    "absolute right-0 top-full z-50 mt-3 w-[min(272px,calc(100vw-1.5rem))] overflow-hidden",
                    USER_PANEL,
                  )}
                >
                  <div className="border-b border-border px-4 py-3.5">
                    <p className="truncate text-[13px] font-bold text-foreground">
                      {user?.fullName ?? "Reader"}
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                  <ul className="p-1.5">
                    <li>
                      <Link href="/profile" onClick={() => setUserMenuOpen(false)} className={MENU_ITEM}>
                        <UserIcon className="size-4" /> Profile
                      </Link>
                    </li>
                    <li>
                      <Link href="/saved" onClick={() => setUserMenuOpen(false)} className={MENU_ITEM}>
                        <Bookmark className="size-4" /> Saved
                      </Link>
                    </li>
                    {isAdmin && (
                      <>
                        <li className="mx-3 my-1 h-px bg-border" />
                        <li>
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className={cn(MENU_ITEM, "font-medium text-primary hover:bg-primary/10")}
                          >
                            <ShieldIcon className="size-4" /> Admin
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
                      <LogOut className="size-4" /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Show>
        </div>
      </div>
    </header>
  );
}