// src/components/site/general/navbars/navbar-client.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
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

const PANEL =
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
// ============================================================
function Logo() {
  return (
    <Link
      href="/"
      aria-label="ALENTAH WORLD — Home"
      className="group flex shrink-0 items-center no-underline"
    >
      <span className="flex flex-col leading-none">
        <span className="font-serif text-[22px] font-extrabold uppercase tracking-[0.1em] text-foreground transition-colors duration-300 group-hover:text-primary min-[400px]:text-[25px] sm:text-[28px] md:text-[32px]">
          Alentah
        </span>
        <span className="mt-1 flex items-center gap-2 sm:mt-1.5">
          <span
            aria-hidden="true"
            className="h-px flex-1 bg-primary/50 transition-colors duration-300 group-hover:bg-primary"
          />
          <span className="me-[-0.4em] text-[8px] font-semibold uppercase tracking-[0.45em] text-primary min-[400px]:text-[9px] sm:text-[10px]">
            World
          </span>
          <span
            aria-hidden="true"
            className="h-px flex-1 bg-primary/50 transition-colors duration-300 group-hover:bg-primary"
          />
        </span>
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
// CATEGORY CARD (Inside mega-menu)
// ============================================================
function CategoryCard({ category, onNavigate }: { category: CategoryListItem; onNavigate: () => void; }) {
  return (
    <div className="rounded-xl border border-border/50 bg-muted/30 p-3 transition-colors hover:border-primary/40 hover:bg-muted/50">
      <Link
        href={`/${category.language.code}/${category.slug}`}
        onClick={onNavigate}
        className="flex items-center gap-3 text-sm font-bold text-primary no-underline transition-opacity hover:opacity-80 rtl:text-base"
      >
        {category.coverImage ? (
          <div className="relative size-10 shrink-0 overflow-hidden rounded-md border border-border/50">
            <Image src={category.coverImage} alt={category.name} fill sizes="40px" className="object-cover" />
          </div>
        ) : (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border/50 bg-muted text-muted-foreground">
            <Globe className="size-4" strokeWidth={1.75} />
          </div>
        )}
        <div className="flex min-h-10 min-w-0 flex-1 flex-col justify-center">
          <span className="truncate">{category.name}</span>
        </div>
      </Link>

      {category.subcategories.length > 0 && (
        <ul className="mt-2 space-y-0.5 border-t border-border/50 pt-2">
          {category.subcategories.map((sub) => (
            <li key={sub.id}>
              <Link
                href={`/${category.language.code}/${category.slug}/${sub.slug}`}
                onClick={onNavigate}
                className="group flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-[13px] text-muted-foreground no-underline transition-colors hover:bg-background hover:text-foreground rtl:text-[15px]"
              >
                <span>{sub.name}</span>
                <ChevronRight className="size-3.5 shrink-0 opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" strokeWidth={1.75} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ============================================================
// EDITION HEADER
// ============================================================
function EditionHeader({ language }: { language: LanguageListItem }) {
  const editionTitle = language.code === "ur" ? "اردو ایڈیشن" : `${language.name} Edition`;
  const editionTagline = language.code === "ur" ? "آزاد اردو نیوز روم" : `Independent ${language.name} newsroom`;

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Globe className="size-4" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-primary rtl:text-lg">{editionTitle}</p>
          <p className="truncate text-xs text-muted-foreground rtl:text-sm">{editionTagline}</p>
        </div>
      </div>
      <div className="relative mt-4 h-px w-full bg-border">
        <span className="absolute inset-s-0 top-0 h-px w-16 bg-primary" />
      </div>
    </div>
  );
}

// ============================================================
// MENU ITEM
// ============================================================
const MENU_ITEM = "flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] text-popover-foreground/85 no-underline transition-colors hover:bg-accent hover:text-foreground";

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

  const ICON_BTN = "inline-flex size-9 items-center justify-center rounded-full no-underline transition-colors hover:bg-muted hover:text-primary";

  return (
    <header className="relative z-50 w-full">
      <div className="flex h-18 items-center justify-between gap-2 sm:gap-4">
        
        {/* LEFT: Brand Name */}
        <Logo />

        {/* RIGHT: Languages, Actions */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          
          {/* LANGUAGE EDITIONS (Desktop) */}
          <div ref={langGroupRef} className="relative hidden items-center gap-1 lg:flex">
            {activeLanguages.map((lang) => {
              const isOpen = openLang === lang.code;
              const isCurrent = currentLangCode === lang.code;

              return (
                <button
                  key={lang.id}
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                  onClick={() => setOpenLang(isOpen ? null : lang.code)}
                  className={cn(
                    "inline-flex h-9 items-center gap-1.5 rounded-full px-3 no-underline",
                    "text-sm font-bold text-foreground/80 transition-colors hover:bg-muted hover:text-foreground",
                    isCurrent && "text-primary",
                    isOpen && "bg-muted text-primary",
                  )}
                >
                  <span>{lang.name}</span>
                  <ChevronDown className={cn("size-3.5 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180 text-primary")} strokeWidth={1.75} />
                </button>
              );
            })}

            {openLang && openLanguageData && (
              <div className="absolute right-0 top-full z-50 pt-3">
                <div dir={openLanguageData.direction === "RTL" ? "rtl" : "ltr"} lang={openLang} className={cn("w-[min(680px,calc(100vw-2rem))]", PANEL)}>
                  <div className={cn("max-h-[calc(100vh-7rem)] overflow-y-auto p-5", HIDE_SCROLLBAR)}>
                    <EditionHeader language={openLanguageData} />
                    {openCategories.length === 0 ? (
                      <p className="mt-4 text-sm text-muted-foreground">No categories yet.</p>
                    ) : (
                      <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-3">
                        {openCategories.map((category) => (
                          <CategoryCard key={category.id} category={category} onNavigate={() => setOpenLang(null)} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SAVED */}
          <Show when="signed-in">
            <Link href="/saved" aria-label="Saved articles" className={cn(ICON_BTN, isSavedRoute ? "bg-primary/10 text-primary" : "text-foreground/70")}>
              <Bookmark className="size-4.5" strokeWidth={1.75} fill={isSavedRoute ? "currentColor" : "none"} />
            </Link>
          </Show>

          <ModeToggle />

          {/* LOGIN */}
          <Show when="signed-out">
            <SignInButton mode="modal" forceRedirectUrl="/" signUpForceRedirectUrl="/">
              <button type="button" className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-4 text-[13px] font-bold text-primary-foreground hover:opacity-90 sm:h-10 sm:px-6 sm:text-sm">
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
                  <Image src={user.imageUrl} alt="User" width={36} height={36} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary text-xs font-bold text-primary-foreground">
                    {user?.firstName?.[0]?.toUpperCase() ?? "U"}
                  </div>
                )}
              </button>

              {userMenuOpen && (
                <div className={cn("absolute right-0 top-full z-50 mt-3 w-[min(272px,calc(100vw-1.5rem))] overflow-hidden", PANEL)}>
                  <div className="border-b border-border px-4 py-3.5">
                    <p className="truncate text-[13px] font-bold text-foreground">{user?.fullName ?? "Reader"}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
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
                    <button type="button" onClick={() => { setUserMenuOpen(false); signOut({ redirectUrl: "/" }); }} className={cn(MENU_ITEM, "hover:text-destructive")}><LogOut className="size-4" /> Sign out</button>
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