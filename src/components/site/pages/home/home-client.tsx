// No "use client": no state or effects, so this renders on the server and
// ships no JavaScript for itself.

import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, ArrowUpRight, CalendarDays, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HomeBlogItem } from "@/actions/articles/get-home-blogs";

interface HomeClientProps {
  blogs: HomeBlogItem[];
}

const FALLBACK_AVATAR = "/placeholder-avatar.jpg";
const FALLBACK_AUTHOR = "ENEENA Editorial Team";
const SHARE_STORY_HREF = "/share-your-story";

const BLUR = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="9" viewBox="0 0 16 9"><rect width="16" height="9" fill="#888" fill-opacity="0.35"/></svg>`,
)}`;

/* ------------------------------------------------------------------ */
/* Editions (the 12 publishing languages — keep in sync with the seed) */
/*                                                                     */
/* display = headline font, text = body font.                          */
/* The CSS variables come from the root layout (next/font).            */
/* ------------------------------------------------------------------ */

type Edition = {
  code: string;
  name: string;
  native: string;
  dir: "ltr" | "rtl";
  flag: string; // file code in /images/navbar/flag-{flag}-64.webp
  latin: boolean;
  display: string;
  text: string;
};

const EDITIONS: readonly Edition[] = [
  { code: "en", name: "English", native: "English", dir: "ltr", flag: "en", latin: true, display: "font-serif", text: "font-sans" },
  { code: "ur", name: "Urdu", native: "اردو", dir: "rtl", flag: "ur", latin: false, display: "font-urdu-display", text: "font-(family-name:--font-nastaliq)" },
  { code: "ar", name: "Arabic", native: "العربية", dir: "rtl", flag: "ar", latin: false, display: "font-arabic-display", text: "font-(family-name:--font-naskh)" },
  { code: "de", name: "German", native: "Deutsch", dir: "ltr", flag: "de", latin: true, display: "font-serif", text: "font-sans" },
  { code: "hi", name: "Hindi", native: "हिन्दी", dir: "ltr", flag: "hi", latin: false, display: "font-hindi-display", text: "font-(family-name:--font-devanagari-sans)" },
  { code: "zh", name: "Chinese", native: "中文", dir: "ltr", flag: "zh", latin: false, display: "font-chinese-display", text: "font-(family-name:--font-sc-sans)" },
  { code: "es", name: "Spanish", native: "Español", dir: "ltr", flag: "es", latin: true, display: "font-serif", text: "font-sans" },
  { code: "fr", name: "French", native: "Français", dir: "ltr", flag: "fr", latin: true, display: "font-serif", text: "font-sans" },
  { code: "pt-BR", name: "Portuguese", native: "Português", dir: "ltr", flag: "pt", latin: true, display: "font-serif", text: "font-sans" },
  { code: "ja", name: "Japanese", native: "日本語", dir: "ltr", flag: "ja", latin: false, display: "font-(family-name:--font-jp-serif)", text: "font-(family-name:--font-jp-sans)" },
  { code: "bn", name: "Bengali", native: "বাংলা", dir: "ltr", flag: "bn", latin: false, display: "font-(family-name:--font-bengali-serif)", text: "font-(family-name:--font-bengali-sans)" },
  { code: "id", name: "Indonesian", native: "Bahasa Indonesia", dir: "ltr", flag: "id", latin: true, display: "font-serif", text: "font-sans" },
];

const EDITION_BY_CODE = new Map(EDITIONS.map((e) => [e.code, e]));

// Order used to give the "Top Stories" list language variety.
const SIDE_LANGUAGE_ORDER = ["ur", "ar", "hi", "zh", "de", "es", "fr", "pt-BR", "ja", "bn", "id", "en"];
const SIDE_COUNT = 4;
const LATEST_COUNT = 10; // 1 lead + 9 grid cards (3 x 3)

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export function articleHref(blog: HomeBlogItem) {
  return `/${blog.language.code}/${blog.category.slug}/${blog.subcategory.slug}/${blog.slug}`;
}

function isRtlBlog(blog: HomeBlogItem) {
  return blog.language.direction === "RTL";
}

function isLatinBlog(blog: HomeBlogItem) {
  return EDITION_BY_CODE.get(blog.language.code)?.latin ?? true;
}

function getTitleFont(blog: HomeBlogItem) {
  return EDITION_BY_CODE.get(blog.language.code)?.display ?? "font-serif";
}

function getTextFont(blog: HomeBlogItem) {
  return EDITION_BY_CODE.get(blog.language.code)?.text ?? "font-sans";
}

function getAuthorName(blog: HomeBlogItem) {
  const full = [blog.author.firstName, blog.author.lastName].filter(Boolean).join(" ");
  return blog.writtenBy || full || FALLBACK_AUTHOR;
}

function getAuthorImage(blog: HomeBlogItem) {
  return blog.writerImageUrl || blog.author.imageUrl || FALLBACK_AVATAR;
}

function getLanguageLabel(blog: HomeBlogItem) {
  return EDITION_BY_CODE.get(blog.language.code)?.native ?? blog.language.name;
}

function getReadingLabel(blog: HomeBlogItem, long = false) {
  if (!blog.readingTime) return null;
  const n = blog.readingTime;
  switch (blog.language.code) {
    case "ur": return `${n} منٹ`;
    case "ar": return `${n} دقائق`;
    case "de": return long ? `${n} Min. Lesezeit` : `${n} Min.`;
    case "hi": return `${n} मिनट`;
    case "zh": return `${n} 分钟`;
    case "es": return long ? `${n} min de lectura` : `${n} min`;
    case "fr": return long ? `${n} min de lecture` : `${n} min`;
    case "pt-BR": return long ? `${n} min de leitura` : `${n} min`;
    case "ja": return long ? `読了 ${n} 分` : `${n} 分`;
    case "bn": return `${n} মিনিট`;
    case "id": return long ? `${n} menit baca` : `${n} mnt`;
    default: return long ? `${n} min read` : `${n} min`;
  }
}

function formatDate(value: Date | string | null, code: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const locales: Record<string, string> = {
    ur: "ur-PK-u-nu-latn",
    ar: "ar-u-nu-latn",
    de: "de-DE",
    hi: "hi-IN-u-nu-latn",
    zh: "zh-CN",
    es: "es-ES",
    fr: "fr-FR",
    "pt-BR": "pt-BR",
    ja: "ja-JP",
    bn: "bn-BD-u-nu-latn",
    id: "id-ID",
  };
  return new Intl.DateTimeFormat(locales[code] ?? "en-US", {
    year: "numeric", month: "short", day: "numeric", timeZone: "UTC",
  }).format(date);
}

function toIso(value: Date | string | null) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

const pad = (n: number) => String(n).padStart(2, "0");

const UNDERLINE =
  "bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1.5px] bg-left-bottom bg-no-repeat box-decoration-clone transition-[background-size] duration-500 ease-out [@media(hover:hover)]:group-hover:bg-[length:100%_1.5px]";

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

function Flag({ code, className }: { code: string; className?: string }) {
  const edition = EDITION_BY_CODE.get(code);
  if (!edition) return null;
  return (
    <Image
      src={`/images/navbar/flag-${edition.flag}-64.webp`}
      alt=""
      width={64}
      height={64}
      sizes="40px"
      className={cn("shrink-0 rounded-full", className)}
    />
  );
}

function LanguageBadge({ blog }: { blog: HomeBlogItem }) {
  const latin = isLatinBlog(blog);
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-[3px] bg-primary px-2.5 py-1.5 text-xs font-bold text-primary-foreground shadow-md shadow-foreground/20", latin ? "uppercase leading-none tracking-[0.14em]" : "leading-normal")}>
      <Flag code={blog.language.code} className="size-4 ring-1 ring-primary-foreground/30" />
      {getLanguageLabel(blog)}
    </span>
  );
}

function ArrowChip({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn("pointer-events-none absolute bottom-3 inset-e-3 z-10 hidden size-10 items-center justify-center rounded-full bg-card text-primary shadow-lg shadow-foreground/25", "translate-y-2 opacity-0 transition-all duration-500 ease-out", "[@media(hover:hover)]:flex [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100", className)}>
      <ArrowUpRight className="size-4.5 rtl:-scale-x-100" />
    </span>
  );
}

function CategoryLabel({ blog, className }: { blog: HomeBlogItem; className?: string }) {
  const latin = isLatinBlog(blog);
  return (
    <span className={cn("inline-flex items-center gap-2 text-xs font-bold text-primary", latin ? "uppercase tracking-[0.18em]" : cn("leading-[1.9]", getTextFont(blog)), className)}>
      <span aria-hidden="true" className="size-1 shrink-0 rounded-full bg-primary" />
      <span className="truncate">{blog.category.name}</span>
    </span>
  );
}

function SectionHeader({
  id,
  eyebrow,
  title,
  titleClassName = "text-3xl sm:text-5xl",
  count,
  live = false,
}: {
  id: string;
  eyebrow: string;
  title: string;
  titleClassName?: string;
  count?: number;
  live?: boolean;
}) {
  return (
    <header className="flex flex-col gap-3">
      <span className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.22em] text-primary">
        {live ? (
          <span aria-hidden="true" className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
        ) : (
          <span aria-hidden="true" className="size-1.5 rotate-45 bg-primary" />
        )}
        {eyebrow}
      </span>
      <h2 id={id} className={cn("font-serif font-bold leading-[1.05] tracking-tight text-foreground", titleClassName)}>
        {title}
        {typeof count === "number" && (
          <sup className="ms-2 align-super font-sans text-xs font-bold tracking-widest text-foreground/35">{pad(count)}</sup>
        )}
      </h2>
    </header>
  );
}

function StoryMeta({ blog, tone = "plain" }: { blog: HomeBlogItem; tone?: "plain" | "overlay" }) {
  const latin = isLatinBlog(blog);
  const reading = getReadingLabel(blog, tone === "overlay");
  const date = formatDate(blog.publishedAt, blog.language.code);
  const iso = toIso(blog.publishedAt);
  const name = getAuthorName(blog);
  const textFont = getTextFont(blog);

  const avatar = (
    <span className={cn("relative block shrink-0 overflow-hidden rounded-full bg-muted", tone === "overlay" ? "size-9 ring-2 ring-background/40" : "size-7 ring-1 ring-border")}>
      <Image src={getAuthorImage(blog)} alt="" fill sizes="36px" quality={60} className="object-cover" />
    </span>
  );

  if (tone === "overlay") {
    return (
      <div className={cn("flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-background/90", textFont, !latin && "leading-[1.9]")}>
        <span className="flex min-w-0 items-center gap-2.5">
          {avatar}
          <span className="truncate py-1 font-semibold leading-[1.9]">{name}</span>
        </span>
        {reading && <span className="inline-flex items-center gap-1.5 text-background/75"><Clock className="size-3.5" aria-hidden="true" /> {reading}</span>}
        {date && <span className="inline-flex items-center gap-1.5 text-background/75"><CalendarDays className="size-3.5" aria-hidden="true" /><time dateTime={iso}>{date}</time></span>}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-between gap-3 text-xs text-muted-foreground", textFont, !latin && "leading-[1.9]")}>
      <span className="flex min-w-0 items-center gap-2">
        {avatar}
        <span className={cn("truncate py-1 font-semibold text-foreground/80", latin ? "leading-normal" : "leading-[1.9]")}>{name}</span>
      </span>
      <span className="flex shrink-0 items-center gap-3">
        {reading && <span className="inline-flex items-center gap-1"><Clock className="size-3" aria-hidden="true" /> {reading}</span>}
        {date && <span className="hidden items-center gap-1 sm:inline-flex"><CalendarDays className="size-3" aria-hidden="true" /><time dateTime={iso}>{date}</time></span>}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Ranked list item ("Top Stories")                                    */
/* ------------------------------------------------------------------ */

function RankedItem({ blog, rank }: { blog: HomeBlogItem; rank: number }) {
  const latin = isLatinBlog(blog);
  const reading = getReadingLabel(blog);

  return (
    <li
      dir={isRtlBlog(blog) ? "rtl" : "ltr"}
      lang={blog.language.code}
      className="group relative flex flex-1 items-center gap-4 py-4 first:pt-0 last:pb-0"
    >
      <span
        aria-hidden="true"
        className="w-9 shrink-0 text-center font-serif text-3xl font-bold italic leading-none text-foreground/20 transition-colors duration-300 group-hover:text-primary"
      >
        {pad(rank)}
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <CategoryLabel blog={blog} className="min-w-0" />
        <h3 className={cn(getTitleFont(blog), "line-clamp-3 text-balance text-base font-bold text-foreground transition-colors duration-300 group-hover:text-primary sm:text-lg", latin ? "leading-snug" : "leading-loose")}>
          <Link href={articleHref(blog)} className="after:absolute after:inset-0">
            <span className={cn(latin && UNDERLINE)}>{blog.title}</span>
          </Link>
        </h3>
        <div className={cn("flex items-center gap-3 text-xs text-muted-foreground", getTextFont(blog), !latin && "leading-[1.9]")}>
          <span className="inline-flex items-center gap-1.5 font-semibold">
            <Flag code={blog.language.code} className="size-4" />
            {getLanguageLabel(blog)}
          </span>
          {reading && (
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3" aria-hidden="true" /> {reading}
            </span>
          )}
        </div>
      </div>

      <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-muted ring-1 ring-foreground/5 sm:size-24">
        <Image
          src={blog.bannerImage}
          alt=""
          fill
          sizes="96px"
          quality={55}
          className="object-cover transition-transform duration-700 ease-out [@media(hover:hover)]:group-hover:scale-110"
        />
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Story card                                                          */
/* ------------------------------------------------------------------ */

function StoryCard({ blog, variant = "grid" }: { blog: HomeBlogItem; variant?: "grid" | "wide" }) {
  const rtl = isRtlBlog(blog);
  const latin = isLatinBlog(blog);
  const href = articleHref(blog);
  const isWide = variant === "wide";
  const titleFont = getTitleFont(blog);

  const titleClass = cn(
    titleFont,
    "text-balance font-bold text-foreground transition-colors duration-300 group-hover:text-primary",
    isWide
      ? !latin
        ? "text-2xl leading-loose sm:text-3xl sm:leading-loose lg:text-4xl lg:leading-loose"
        : "text-2xl leading-[1.12] tracking-tight sm:text-3xl lg:text-[2.5rem]"
      : !latin
        ? "text-xl leading-loose sm:text-2xl sm:leading-loose"
        : "text-xl leading-[1.2] sm:text-[1.45rem]",
  );

  return (
    <article
      dir={rtl ? "rtl" : "ltr"}
      lang={blog.language.code}
      className={cn("group relative min-w-0", isWide ? "grid gap-6 lg:grid-cols-12 lg:items-center lg:gap-12" : "flex h-full flex-col")}
    >
      <div className={cn("relative isolate w-full shrink-0 overflow-hidden rounded-lg bg-muted ring-1 ring-foreground/5", isWide ? "aspect-3/2 lg:col-span-7 lg:aspect-16/10" : "aspect-3/2")}>
        <Image
          src={blog.bannerImage}
          alt={blog.title}
          fill
          quality={isWide ? 70 : 60}
          placeholder="blur"
          blurDataURL={BLUR}
          sizes={isWide ? "(min-width: 1024px) 640px, 100vw" : "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"}
          className="object-cover transition-transform duration-900 ease-out [@media(hover:hover)]:group-hover:scale-[1.045]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-foreground/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 [@media(hover:hover)]:group-hover:opacity-100" />
        <div className="absolute inset-s-2 top-2 sm:inset-s-3 sm:top-3"><LanguageBadge blog={blog} /></div>
        <ArrowChip />
      </div>

      <div className={cn("flex flex-1 flex-col", isWide ? "gap-4 lg:col-span-5" : "gap-2.5 pt-5")}>
        <CategoryLabel blog={blog} />

        <h3 className={titleClass}>
          <Link href={href} className="after:absolute after:inset-0">
            <span className={cn(latin && UNDERLINE)}>{blog.title}</span>
          </Link>
        </h3>

        {blog.shortDescription && (
          <div className={cn("text-start text-muted-foreground", getTextFont(blog), isWide ? "line-clamp-3 text-base sm:text-lg" : "line-clamp-2 text-sm sm:text-base", !latin ? (isWide ? "leading-[2.3]" : "leading-[2.2]") : (isWide ? "leading-7" : "leading-6"))}>
            {blog.shortDescription}
          </div>
        )}

        <div className={cn("mt-auto border-t border-border/70 pt-3", isWide && "mt-2")}><StoryMeta blog={blog} /></div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Language tile                                                       */
/* ------------------------------------------------------------------ */

function LanguageTile({ edition }: { edition: Edition }) {
  return (
    <Link
      href={`/${edition.code}`}
      hrefLang={edition.code}
      title={`ENEENA in ${edition.name}`}
      className="group relative flex h-full min-h-36 flex-col justify-between gap-6 overflow-hidden rounded-lg border border-border bg-card p-4 text-card-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/20 sm:p-5"
    >
      <Flag code={edition.code} className="size-10 ring-1 ring-border transition-transform duration-300 group-hover:scale-105" />
      <span className="flex flex-col gap-1">
        <span
          lang={edition.code}
          dir={edition.dir}
          className={cn("self-start text-balance text-xl font-bold leading-[1.7] sm:text-2xl", edition.display)}
        >
          {edition.native}
        </span>
        <span className="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-[0.14em] opacity-70 transition-opacity group-hover:opacity-100">
          <span>{edition.name}</span>
          <ArrowUpRight className="size-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </span>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

export function HomeClient({ blogs }: HomeClientProps) {
  if (!blogs.length) {
    return (
      <div className="mx-auto max-w-md py-28 text-center">
        <h1 className="sr-only">ENEENA — Independent Journalism, Global Perspectives</h1>
        <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary">ENEENA</span>
        <h2 className="mb-3 font-serif text-3xl font-bold text-foreground sm:text-4xl">Stories are on the way.</h2>
        <p className="text-sm text-muted-foreground">No stories published yet. Check back soon.</p>
      </div>
    );
  }

  /* ---------- Pick which story goes where (no duplicates) ---------- */
  const used = new Set<string>();
  const byLang = (code: string) => blogs.filter((b) => b.language.code === code);

  const hero = byLang("en")[0] ?? blogs[0];
  used.add(hero.id);

  // "Top Stories" list: one story per language first, for variety.
  const sideBlogs: HomeBlogItem[] = [];
  const take = (b: HomeBlogItem) => {
    used.add(b.id);
    sideBlogs.push(b);
  };
  for (const code of SIDE_LANGUAGE_ORDER) {
    if (sideBlogs.length >= SIDE_COUNT) break;
    const found = byLang(code).find((b) => !used.has(b.id));
    if (found) take(found);
  }
  for (const b of blogs) {
    if (sideBlogs.length >= SIDE_COUNT) break;
    if (!used.has(b.id)) take(b);
  }

  const latestBlogs = blogs.filter((b) => !used.has(b.id)).slice(0, LATEST_COUNT);
  const leadBlog = latestBlogs[0];
  const restBlogs = latestBlogs.slice(1);

  // Topic chips derived from the stories on the page (unique language + category).
  const topics = Array.from(
    new Map(blogs.map((b) => [`${b.language.code}/${b.category.slug}`, b])).values(),
  ).slice(0, 16);

  const heroHref = articleHref(hero);
  const heroRtl = isRtlBlog(hero);
  const heroLatin = isLatinBlog(hero);
  const heroTitleFont = getTitleFont(hero);
  const heroTextFont = getTextFont(hero);

  return (
    // No horizontal padding on this top-level wrapper (the layout controls side spacing).
    // max-w + mx-auto only stops the layout stretching on very wide monitors.
    <div className="mx-auto flex w-full min-w-0 max-w-[1600px] flex-col gap-16 overflow-x-clip pb-16 pt-5 sm:gap-24 sm:pb-24">
      <h1 className="sr-only">ENEENA — Independent Journalism, Global Perspectives</h1>

      {/* 1. HERO + TOP STORIES */}
      <section aria-label="Top stories" className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-10">
        <article
          dir={heroRtl ? "rtl" : "ltr"}
          lang={hero.language.code}
          className="group relative isolate min-h-112 overflow-hidden rounded-lg bg-muted shadow-xl shadow-foreground/10 ring-1 ring-foreground/5 sm:min-h-136 lg:col-span-8 lg:min-h-164"
        >
          <Image
            src={hero.bannerImage}
            alt={hero.title}
            fill
            priority
            quality={75}
            placeholder="blur"
            blurDataURL={BLUR}
            sizes="(min-width: 1280px) 960px, (min-width: 1024px) 66vw, 100vw"
            className="object-cover transition-transform duration-1400 ease-out [@media(hover:hover)]:group-hover:scale-[1.035]"
          />

          {/* Overlays use theme tokens only (foreground = dark scrim, primary = brand tint) */}
          <div className="absolute inset-0 bg-linear-to-t from-foreground/90 via-foreground/30 to-foreground/5" />
          <div className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-primary/30 to-transparent mix-blend-multiply" />
          <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-foreground/30 to-transparent" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-background/10" />

          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between p-5 text-background sm:p-8 lg:p-10">
            <div className="flex items-center gap-3">
              <LanguageBadge blog={hero} />
              <span className="inline-flex items-center gap-2 rounded-full border border-background/30 bg-foreground/25 px-3 py-1.5 text-xs font-bold uppercase leading-none tracking-[0.18em] backdrop-blur-md">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-current" /> Featured
              </span>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end p-5 text-background sm:p-8 lg:p-10">
            <div className="mb-4 flex items-center gap-4 sm:mb-5">
              <span aria-hidden="true" className="h-px w-10 bg-current opacity-70" />
              <span className={cn("text-xs font-bold opacity-90", heroLatin ? "uppercase tracking-[0.22em]" : cn("py-1 leading-[1.9]", heroTextFont))}>{hero.category.name}</span>
            </div>

            <h2
              className={cn(
                heroTitleFont,
                "mb-4 max-w-3xl text-balance text-4xl font-bold [text-shadow:0_2px_24px_var(--foreground)] sm:text-5xl xl:text-6xl",
                heroLatin ? "leading-[1.08] tracking-tight" : "py-1 leading-[1.9] tracking-normal sm:leading-[1.9]",
              )}
            >
              <Link href={heroHref} className="pointer-events-auto after:absolute after:inset-0 after:z-20">{hero.title}</Link>
            </h2>

            {hero.shortDescription && (
              <div className={cn("mb-6 line-clamp-2 max-w-2xl text-start text-base opacity-85 sm:text-lg", heroTextFont, heroLatin ? "leading-6 sm:leading-7" : "leading-[2.2] sm:leading-[2.3]")}>
                {hero.shortDescription}
              </div>
            )}

            <div className="flex items-end justify-between gap-4 border-t border-background/20 pt-5">
              <StoryMeta blog={hero} tone="overlay" />
              <span aria-hidden="true" className="hidden shrink-0 items-center gap-2 rounded-full bg-card px-5 py-3 text-sm font-bold text-primary shadow-lg shadow-foreground/30 transition-transform duration-500 group-hover:translate-x-0.5 sm:inline-flex">
                Read story <ArrowRight className="size-4 rtl:rotate-180" />
              </span>
            </div>
          </div>
        </article>

        {sideBlogs.length > 0 && (
          <aside aria-labelledby="top-stories-heading" className="flex min-w-0 flex-col gap-5 lg:col-span-4">
            <div className="flex items-center gap-4">
              <h2 id="top-stories-heading" className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">
                Top Stories
              </h2>
              <span aria-hidden="true" className="h-px flex-1 bg-border" />
            </div>
            <ol className="flex flex-1 flex-col divide-y divide-border/70">
              {sideBlogs.map((blog, i) => (
                <RankedItem key={blog.id} blog={blog} rank={i + 2} />
              ))}
            </ol>
          </aside>
        )}
      </section>

      {/* 2. READ IN YOUR LANGUAGE */}
      <section aria-labelledby="languages-heading" className="flex flex-col gap-8">
        <SectionHeader id="languages-heading" eyebrow="12 editions" title="Read ENEENA in Your Language" />
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {EDITIONS.map((edition) => (
            <li key={edition.code}>
              <LanguageTile edition={edition} />
            </li>
          ))}
        </ul>
      </section>

      {/* 3. LATEST STORIES */}
      {latestBlogs.length > 0 && (
        <section aria-labelledby="latest-stories-heading" className="flex flex-col gap-10 sm:gap-14">
          <SectionHeader
            id="latest-stories-heading"
            eyebrow="Fresh from the newsroom"
            title="Latest Stories"
            titleClassName="text-4xl leading-none sm:text-6xl"
            count={latestBlogs.length}
            live
          />
          {leadBlog && <StoryCard blog={leadBlog} variant="wide" />}
          {restBlogs.length > 0 && (
            <>
              <div aria-hidden="true" className="flex items-center gap-4 text-foreground/30">
                <span className="h-px flex-1 bg-border" /><span className="size-1.5 rotate-45 bg-primary" /><span className="h-px flex-1 bg-border" />
              </div>
              <div className="grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {restBlogs.map((blog) => <StoryCard key={blog.id} blog={blog} variant="grid" />)}
              </div>
            </>
          )}
        </section>
      )}

      {/* 4. BROWSE BY TOPIC */}
      {topics.length > 0 && (
        <section aria-labelledby="topics-heading" className="flex flex-col gap-6">
          <SectionHeader id="topics-heading" eyebrow="Explore" title="Browse by Topic" titleClassName="text-3xl sm:text-4xl" />
          <ul className="flex flex-wrap gap-2.5">
            {topics.map((b) => {
              const latin = isLatinBlog(b);
              return (
                <li key={`${b.language.code}/${b.category.slug}`}>
                  <Link
                    href={`/${b.language.code}/${b.category.slug}`}
                    lang={b.language.code}
                    dir={isRtlBlog(b) ? "rtl" : "ltr"}
                    className="group inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-semibold text-card-foreground transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Flag code={b.language.code} className="size-4" />
                    <span className={cn(getTitleFont(b), !latin && "leading-[1.9]")}>{b.category.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* 5. SHARE YOUR STORY (closing call to action) */}
      <section
        dir="ltr"
        aria-labelledby="share-story-heading"
        className="relative isolate overflow-hidden rounded-lg bg-primary px-6 py-14 text-primary-foreground shadow-2xl shadow-primary/20 ring-1 ring-inset ring-primary-foreground/15 sm:px-14 sm:py-20"
      >
        <div aria-hidden="true" className="absolute -inset-e-24 -top-28 -z-10 size-104 rounded-full bg-primary-foreground/15 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-32 -inset-s-16 -z-10 size-96 rounded-full bg-primary-foreground/10 blur-3xl" />
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <span className="mb-5 inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.22em] opacity-80">
              <PenLine className="size-4" aria-hidden="true" /> Your voice, your language
            </span>
            <h2 id="share-story-heading" className="font-serif text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Have a Story Worth Telling?
            </h2>
          </div>
          <div className="flex flex-col gap-8 lg:col-span-5 lg:items-end">
            <p className="max-w-md text-start font-sans text-base leading-7 opacity-90 [hyphens:none] sm:text-lg sm:leading-8">
              Share your story with ENEENA in any of our 12 languages. Real voices and real experiences, in the language you think in.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={SHARE_STORY_HREF}
                className="group/cta inline-flex items-center gap-3 rounded-full bg-card py-2 pe-2 ps-8 text-sm font-bold text-primary shadow-xl shadow-foreground/20 transition-all duration-300 hover:shadow-2xl"
              >
                Share Your Story
                <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 group-hover/cta:translate-x-0.5">
                  <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </Link>
              <Link
                href="/en"
                hrefLang="en"
                className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/40 px-6 py-3 text-sm font-bold transition-colors duration-300 hover:border-primary-foreground hover:bg-primary-foreground/10"
              >
                Explore Our Stories
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}