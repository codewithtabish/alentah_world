"use client";

// ============================================================
// Navbar — ALENTAH WORLD (Client)
// ============================================================

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bookmark,
  ChevronDown,
  ChevronRight,
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
import { 
  getCategoryHref, 
  getLanguageFromPathname, 
  getSubcategoryHref, 
  LanguageCode, 
  NavCategory, 
  NavLanguage, 
  navLanguageList, 
  navLanguages 
} from "@/data/navbar-categories-data";

const HIDE_SCROLLBAR = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

// ============================================================
// LOGO — wordmark only (Icon removed)
// ============================================================

function Logo() {
  return (
    <Link
      href="/"
      aria-label="ALENTAH WORLD — Home"
      className="group flex shrink-0 items-center"
    >
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-serif text-[22px] font-extrabold uppercase text-foreground",
            "tracking-[0.1em] min-[400px]:text-[25px] sm:text-[28px] md:text-[32px]",
            "transition-colors duration-300 group-hover:text-primary",
          )}
        >
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
    <svg
      xmlns="http://www.w3.org/2000/svg"
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
// CATEGORY CARD
// ============================================================

function CategoryCard({
  language,
  category,
  onNavigate,
}: {
  language: NavLanguage;
  category: NavCategory;
  onNavigate: () => void;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-muted/30 p-3.5",
        "transition-colors duration-200 hover:border-primary/40 hover:bg-muted/50",
      )}
    >
      <Link
        href={getCategoryHref(language, category.slug)}
        onClick={onNavigate}
        className="flex items-center gap-2 py-1 text-sm font-bold text-primary transition-opacity hover:opacity-80 rtl:text-base"
      >
        <span
          aria-hidden="true"
          className="block size-1.5 shrink-0 rounded-full bg-primary"
        />
        <span>{category.name}</span>
      </Link>

      {category.subcategories.length > 0 && (
        <ul className="mt-2 space-y-1">
          {category.subcategories.map((sub) => (
            <li key={sub.slug}>
              <Link
                href={getSubcategoryHref(language, category.slug, sub.slug)}
                onClick={onNavigate}
                className={cn(
                  "group flex items-center justify-between gap-2 rounded-lg px-2 py-1.5",
                  "text-[13px] text-muted-foreground rtl:text-[15px]",
                  "transition-colors duration-150 hover:bg-background hover:text-foreground",
                )}
              >
                <span>{sub.name}</span>
                <ChevronRight
                  className="size-3.5 shrink-0 opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
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
// EDITION HEADER
// ============================================================

function EditionHeader({ language }: { language: NavLanguage }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Globe className="size-[18px]" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <p className="text-base font-bold text-primary rtl:text-lg">
            {language.editionTitle}
          </p>
          <p className="text-xs text-muted-foreground rtl:text-sm">
            {language.editionTagline}
          </p>
        </div>
      </div>
      <div className="relative mt-4 h-px w-full bg-border">
        <span className="absolute inset-s-0 top-0 h-px w-16 bg-primary" />
      </div>
    </div>
  );
}

// ============================================================
// EDITION PANEL
// ============================================================

function EditionPanel({
  language,
  onNavigate,
}: {
  language: NavLanguage;
  onNavigate: () => void;
}) {
  return (
    <div className="absolute right-0 top-full z-50 pt-3">
      <div
        dir={language.dir}
        lang={language.code}
        role="region"
        aria-label={language.editionTitle}
        className={cn(
          "w-[min(640px,calc(100vw-2rem))] rounded-3xl",
          "border border-border bg-popover text-popover-foreground",
          "animate-in fade-in slide-in-from-top-2 duration-150",
        )}
      >
        <div className={cn("max-h-[calc(100vh-7rem)] overflow-y-auto p-5", HIDE_SCROLLBAR)}>
          <EditionHeader language={language} />
          {language.categories.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No categories yet.</p>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-3">
              {language.categories.map((category) => (
                <CategoryCard
                  key={category.slug}
                  language={language}
                  category={category}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function NavbarClient() {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();

  const currentLang = getLanguageFromPathname(pathname);

  const [openLang, setOpenLang] = React.useState<LanguageCode | null>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [mobileLang, setMobileLang] = React.useState<LanguageCode>(currentLang);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  const [prevPathname, setPrevPathname] = React.useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpenLang(null);
    setMobileOpen(false);
    setUserMenuOpen(false);
  }

  const langGroupRef = React.useRef<HTMLDivElement>(null);
  const mobileRef = React.useRef<HTMLDivElement>(null);
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  const role = (user?.publicMetadata as { role?: string } | undefined)?.role;
  const isAdmin = role === "ADMIN";
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isSavedRoute = pathname === "/saved";

  React.useEffect(() => {
    if (!openLang && !mobileOpen && !userMenuOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (langGroupRef.current && !langGroupRef.current.contains(target)) setOpenLang(null);
      if (mobileRef.current && !mobileRef.current.contains(target)) setMobileOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(target)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [openLang, mobileOpen, userMenuOpen]);

  React.useEffect(() => {
    if (!openLang && !mobileOpen && !userMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenLang(null);
        setMobileOpen(false);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openLang, mobileOpen, userMenuOpen]);

  if (isAdminRoute) return null;

  const closeLangMenu = () => setOpenLang(null);
  const closeMobile = () => setMobileOpen(false);
  const mobileLanguage = navLanguages[mobileLang];

  return (
    <header className="relative z-50 w-full border-b border-border">
      <div className="flex h-[72px] items-center justify-between gap-2 sm:gap-3">
        
        {/* LOGO (Icon removed) */}
        <Logo />

        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
          
          {/* LANGUAGE EDITIONS (desktop) */}
          <div
            ref={langGroupRef}
            className="relative hidden items-center gap-0.5 rounded-full border border-border bg-muted/40 p-1 lg:flex"
          >
            {navLanguageList.map((lang) => {
              const isOpen = openLang === lang.code;
              const isCurrent = currentLang === lang.code;

              return (
                <button
                  key={lang.code}
                  type="button"
                  lang={lang.code}
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                  onClick={() => setOpenLang(isOpen ? null : lang.code)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-4",
                    "text-sm font-bold text-foreground/80",
                    "transition-colors duration-200 hover:bg-background hover:text-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    (isCurrent || isOpen) && "bg-background text-foreground",
                    isOpen && "text-primary",
                  )}
                >
                  {isCurrent && (
                    <Globe className="size-3.5 text-primary" strokeWidth={1.75} />
                  )}
                  <span>{lang.label}</span>
                  <ChevronDown
                    className={cn(
                      "size-3.5 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180 text-primary",
                    )}
                    strokeWidth={1.75}
                  />
                </button>
              );
            })}

            {openLang && (
              <EditionPanel
                key={openLang}
                language={navLanguages[openLang]}
                onNavigate={closeLangMenu}
              />
            )}
          </div>

          <Link
            href="/search"
            aria-label="Search"
            title="Search"
            className={cn(
              "hidden size-9 items-center justify-center rounded-full sm:inline-flex",
              "text-foreground/70 transition-colors duration-200",
              "hover:bg-muted hover:text-primary",
            )}
          >
            <Search className="size-[18px]" strokeWidth={1.75} />
          </Link>

          <Show when="signed-in">
            <Link
              href="/saved"
              aria-label="Saved articles"
              title="Saved articles"
              className={cn(
                "inline-flex size-9 items-center justify-center rounded-full",
                "transition-colors duration-200",
                isSavedRoute ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-muted hover:text-primary",
              )}
            >
              <Bookmark className="size-[18px]" strokeWidth={1.75} fill={isSavedRoute ? "currentColor" : "none"} />
            </Link>
          </Show>

          <ModeToggle />

          <Show when="signed-out">
            <SignInButton mode="modal" forceRedirectUrl="/" signUpForceRedirectUrl="/">
              <button
                type="button"
                className={cn(
                  "inline-flex h-9 items-center justify-center rounded-full px-4 sm:h-10 sm:px-6",
                  "bg-primary text-primary-foreground",
                  "text-[13px] font-bold sm:text-sm",
                  "transition-opacity duration-200 hover:opacity-90",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                )}
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
                onClick={() => setUserMenuOpen((v) => !v)}
                className={cn(
                  "inline-flex size-9 items-center justify-center rounded-full",
                  "overflow-hidden border border-border",
                  "transition-colors duration-200 hover:border-primary",
                  userMenuOpen && "border-primary",
                )}
              >
                {user?.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.imageUrl} alt={user.fullName ?? "User avatar"} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary text-xs font-bold text-primary-foreground">
                    {user?.firstName?.[0]?.toUpperCase() ?? user?.primaryEmailAddress?.emailAddress?.[0]?.toUpperCase() ?? "U"}
                  </div>
                )}
              </button>

              {userMenuOpen && (
                <div className={cn(
                    "absolute right-0 top-full z-50 mt-3 w-[min(260px,calc(100vw-1.5rem))] overflow-hidden rounded-3xl",
                    "border border-border bg-popover text-popover-foreground",
                    "animate-in fade-in slide-in-from-top-2 duration-150",
                  )}
                >
                  <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
                    <span className="inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
                      {user?.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.imageUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <UserIcon className="size-4" strokeWidth={1.75} />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-bold text-popover-foreground">{user?.fullName ?? "Reader"}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
                    </div>
                  </div>

                  <ul className="p-1.5">
                    <li>
                      <Link href="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-[13px] text-popover-foreground/85 transition-colors hover:bg-accent hover:text-foreground">
                        <UserIcon className="size-4" strokeWidth={1.75} /> Profile
                      </Link>
                    </li>
                    <li>
                      <Link href="/saved" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-[13px] text-popover-foreground/85 transition-colors hover:bg-accent hover:text-foreground">
                        <Bookmark className="size-4" strokeWidth={1.75} /> Saved
                      </Link>
                    </li>
                    {isAdmin && (
                      <>
                        <li className="mx-3 my-1 h-px bg-border" />
                        <li>
                          <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-[13px] font-medium text-primary transition-colors hover:bg-primary/10">
                            <ShieldIcon className="size-4" /> Admin
                            <span className="ml-auto rounded-full px-2 py-0.5 bg-primary/15 text-[9px] uppercase tracking-[0.15em] text-primary">CMS</span>
                          </Link>
                        </li>
                      </>
                    )}
                  </ul>

                  <div className="border-t border-border p-1.5">
                    <button
                      type="button"
                      onClick={() => { setUserMenuOpen(false); signOut({ redirectUrl: "/" }); }}
                      className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-[13px] text-popover-foreground/85 transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <LogOut className="size-4" strokeWidth={1.75} /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Show>

          {/* MOBILE MENU */}
          <div ref={mobileRef} className="relative lg:hidden">
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className={cn(
                "inline-flex size-9 items-center justify-center rounded-full",
                "border border-border text-foreground/80 transition-colors duration-200",
                "hover:bg-muted hover:text-primary",
                mobileOpen && "bg-muted text-primary",
              )}
            >
              {mobileOpen ? <X className="size-[18px]" strokeWidth={1.75} /> : <Menu className="size-[18px]" strokeWidth={1.75} />}
            </button>

            {mobileOpen && (
              <div className={cn(
                  "absolute right-0 top-full z-50 mt-3",
                  "w-[min(420px,calc(100vw-1.5rem))] overflow-hidden rounded-3xl",
                  "border border-border bg-popover text-popover-foreground",
                  "animate-in fade-in slide-in-from-top-2 duration-150",
                )}
              >
                <div className="border-b border-border p-2 sm:hidden">
                  <Link href="/search" onClick={closeMobile} className="flex items-center gap-3 rounded-full bg-muted/50 px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <Search className="size-4" strokeWidth={1.75} /> Search
                  </Link>
                </div>

                <div className="p-2">
                  <div className="flex items-center gap-1 rounded-full border border-border bg-muted/40 p-1">
                    {navLanguageList.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        lang={lang.code}
                        onClick={() => setMobileLang(lang.code)}
                        className={cn(
                          "flex flex-1 items-center justify-center rounded-full text-sm font-bold transition-colors",
                          mobileLang === lang.code
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground/80 hover:bg-background",
                        )}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div dir={mobileLanguage.dir} lang={mobileLanguage.code} className={cn("max-h-[calc(100vh-11rem)] overflow-y-auto px-4 pb-4 pt-2", HIDE_SCROLLBAR)}>
                  <EditionHeader language={mobileLanguage} />
                  {mobileLanguage.categories.length === 0 ? (
                    <p className="mt-4 text-sm text-muted-foreground">No categories yet.</p>
                  ) : (
                    <div className="mt-4 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                      {mobileLanguage.categories.map((category) => (
                        <CategoryCard key={category.slug} language={mobileLanguage} category={category} onNavigate={closeMobile} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}