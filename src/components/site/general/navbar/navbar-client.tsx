"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import {
  Check,
  ChevronDown,
  Globe,
  LogOut,
  User as UserIcon,
  X,
} from "lucide-react";

import { SignInButton, useUser, useClerk, Show } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/site/general/theme/mode-toggle";

// 👇 Imported your custom icons here


import type { LanguageListItem } from "@/actions/language/get-languages";
import type { CategoryListItem } from "@/actions/categories/get-categories";
import { BookmarkFillIcon, BookmarkOutlineIcon, ShieldIcon } from "../theme/social-icons";

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
// HELPERS
// ============================================================

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
  "pt-BR",
  "br",
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

  // Map "br" and "pt-BR" to the existing "pt" image
  let imageCode = code;
  if (code === "br" || code === "pt-BR") {
    imageCode = "pt";
  }

  return (
    <Image
      src={`${FLAG_BASE}/flag-${imageCode}-64.webp`}
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
  categories?: CategoryListItem[];
  languages: LanguageListItem[];
}

export function NavbarClient({ languages }: NavbarClientProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();

  const currentLangCode = getLanguageFromPathname(pathname);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const [prevPathname, setPrevPathname] = React.useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setUserMenuOpen(false);
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
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [userMenuOpen]);

  if (isAdminRoute) return null;

  const activeLanguages = languages.filter((language) => language.isActive);
  const currentLanguage =
    activeLanguages.find((language) => language.code === currentLangCode) ??
    activeLanguages.find((language) => language.isDefault) ??
    activeLanguages[0];

  return (
    <header className="relative z-50 w-full">
      <div className="flex items-center justify-between">
        {/* LEFT: LOGO */}
        <div className="flex min-w-0 items-center gap-1 sm:gap-2 xl:gap-4">
          <Logo />
          <span aria-hidden="true" className="hidden h-9 w-px bg-border xl:block" />
        </div>

        {/* RIGHT: LANGUAGE DROPDOWN + ACTIONS */}
        <div className="flex min-w-0 shrink-0 items-center gap-0.5 sm:gap-1.5 xl:flex-1 xl:justify-end">
          <DesktopLanguageDropdown languages={activeLanguages} currentLangCode={currentLangCode} />
          <MobileLanguageSelector languages={activeLanguages} currentLanguage={currentLanguage} />

          <Show when="signed-in">
            <Link
              href="/saved"
              aria-label="Saved articles"
              className={cn(ICON_BTN, isSavedRoute ? "bg-primary/10 text-primary" : "text-foreground/70")}
            >
              {/* 👇 Used your custom icon here */}
              {isSavedRoute ? (
                <BookmarkFillIcon className="size-4.5" />
              ) : (
                <BookmarkOutlineIcon className="size-4.5" />
              )}
            </Link>
          </Show>

          <ModeToggle />
          <span aria-hidden="true" className="mx-1 hidden h-8 w-px bg-border sm:block" />

          <Show when="signed-out">
            <SignInButton mode="modal" forceRedirectUrl="/" signUpForceRedirectUrl="/">
              <button
                type="button"
                className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-4 text-[13px] font-bold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 sm:h-10 sm:px-6 sm:text-sm"
              >
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
                    <span className="flex h-full w-full items-center justify-center bg-primary text-xs font-bold text-primary-foreground">
                      {user?.firstName?.[0]?.toUpperCase() ?? "U"}
                    </span>
                  )}
                </span>
                <ChevronDown
                  className={cn("me-1 hidden size-3.5 text-muted-foreground transition-transform duration-200 sm:block", userMenuOpen && "rotate-180")}
                />
              </button>

              {userMenuOpen && (
                <div className={cn("absolute inset-e-0 top-full z-50 mt-3 w-[min(280px,calc(100vw-1.5rem))] overflow-hidden", USER_PANEL)}>
                  <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
                    <span className="relative inline-flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border">
                      {user?.imageUrl ? (
                        <Image src={user.imageUrl} alt="" width={44} height={44} className="h-full w-full object-cover" />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center bg-primary text-sm font-bold text-primary-foreground">
                          {user?.firstName?.[0]?.toUpperCase() ?? "U"}
                        </span>
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-bold text-foreground">{user?.fullName ?? "Reader"}</p>
                      <p className="truncate text-[12px] text-muted-foreground">
                        {user?.username ? `@${user.username}` : user?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </div>

                  <ul className="p-1.5">
                    <li>
                      <Link href="/profile" onClick={() => setUserMenuOpen(false)} className={MENU_ITEM}>
                        <UserIcon className="size-4" /> Profile
                      </Link>
                    </li>
                    <li>
                      <Link href="/saved" onClick={() => setUserMenuOpen(false)} className={MENU_ITEM}>
                        {/* 👇 Used your custom icon here too */}
                        <BookmarkOutlineIcon className="size-4" /> Saved
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
                            {/* 👇 Using your custom ShieldIcon */}
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

export default NavbarClient;