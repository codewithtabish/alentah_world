// src/components/site/home/home-client.tsx
// No "use client": this component has no state or effects, so it renders on
// the server and ships no JavaScript for itself to the browser.

import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, ArrowUpRight, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { HomeBlogItem } from "@/actions/articles/get-home-blogs";

interface HomeClientProps {
  blogs: HomeBlogItem[];
}

const FALLBACK_AVATAR = "/placeholder-avatar.jpg";

// Tiny inline placeholder: shows instantly while the real image loads.
const BLUR = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="9" viewBox="0 0 16 9"><rect width="16" height="9" fill="#888" fill-opacity="0.35"/></svg>`,
)}`;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function articleHref(blog: HomeBlogItem) {
  return `/${blog.language.code}/${blog.category.slug}/${blog.subcategory.slug}/${blog.slug}`;
}

function isRtlBlog(blog: HomeBlogItem) {
  return blog.language.direction === "RTL";
}

// Serif for English, dedicated display fonts for Urdu / Arabic
function getTitleFont(blog: HomeBlogItem) {
  if (blog.language.code === "ur") return "font-urdu-display";
  if (blog.language.code === "ar") return "font-arabic-display";
  return "font-serif";
}

function getAuthorName(blog: HomeBlogItem) {
  const full = [blog.author.firstName, blog.author.lastName]
    .filter(Boolean)
    .join(" ");
  return blog.writtenBy || full || "The Insider";
}

function getAuthorImage(blog: HomeBlogItem) {
  return blog.writerImageUrl || blog.author.imageUrl || FALLBACK_AVATAR;
}

function getLanguageLabel(blog: HomeBlogItem) {
  if (blog.language.code === "ur") return "اردو";
  if (blog.language.code === "ar") return "العربية";
  return blog.language.name;
}

function getReadingLabel(blog: HomeBlogItem, long = false) {
  if (!blog.readingTime) return null;
  if (blog.language.code === "ur") return `${blog.readingTime} منٹ`;
  if (blog.language.code === "ar") return `${blog.readingTime} دقائق`;
  return long ? `${blog.readingTime} min read` : `${blog.readingTime} min`;
}

// UTC + latin digits => identical output on server and client
function formatDate(value: Date | string | null, code: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const locale =
    code === "ur"
      ? "ur-PK-u-nu-latn"
      : code === "ar"
        ? "ar-u-nu-latn"
        : "en-US";

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

const pad = (n: number) => String(n).padStart(2, "0");

// Animated underline (Latin only: Nastaliq/Arabic have tall line boxes)
const UNDERLINE =
  "bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1.5px] bg-left-bottom bg-no-repeat box-decoration-clone transition-[background-size] duration-500 ease-out [@media(hover:hover)]:group-hover:bg-[length:100%_1.5px]";

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

function LanguageBadge({
  blog,
  small = false,
}: {
  blog: HomeBlogItem;
  small?: boolean;
}) {
  const rtl = isRtlBlog(blog);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[3px] bg-primary font-bold text-primary-foreground shadow-md shadow-black/20",
        // Latin only: uppercase + tracking breaks Arabic-script letter joining
        rtl ? "leading-normal" : "uppercase leading-none tracking-[0.14em]",
        small
          ? "px-1.5 py-1 text-[9px] sm:px-2 sm:text-[10px]"
          : "px-2.5 py-1.5 text-[10px]",
      )}
    >
      {getLanguageLabel(blog)}
    </span>
  );
}

// Round arrow chip that slides up on hover (desktop pointers only)
function ArrowChip({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute bottom-3 inset-e-3 z-10 hidden size-10 items-center justify-center rounded-full bg-white text-primary shadow-lg shadow-black/25",
        "translate-y-2 opacity-0 transition-all duration-500 ease-out",
        "[@media(hover:hover)]:flex [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100",
        className,
      )}
    >
      <ArrowUpRight className="size-4.5 rtl:-scale-x-100" />
    </span>
  );
}

function CategoryLabel({
  blog,
  className,
}: {
  blog: HomeBlogItem;
  className?: string;
}) {
  const rtl = isRtlBlog(blog);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-[11px] font-bold text-primary",
        rtl ? "leading-[1.9]" : "uppercase tracking-[0.18em]",
        className,
      )}
    >
      <span aria-hidden="true" className="size-1 rounded-full bg-primary" />
      {blog.category.name}
    </span>
  );
}

function StoryMeta({
  blog,
  tone = "plain",
}: {
  blog: HomeBlogItem;
  tone?: "plain" | "overlay";
}) {
  const rtl = isRtlBlog(blog);
  const reading = getReadingLabel(blog, tone === "overlay");
  const date = formatDate(blog.publishedAt, blog.language.code);
  const name = getAuthorName(blog);

  const avatar = (
    <span
      className={cn(
        "relative block shrink-0 overflow-hidden rounded-full bg-muted",
        tone === "overlay"
          ? "size-9 ring-2 ring-white/40"
          : "size-7 ring-1 ring-border",
      )}
    >
      <Image
        src={getAuthorImage(blog)}
        alt=""
        fill
        sizes="36px"
        quality={60}
        className="object-cover"
      />
    </span>
  );

  if (tone === "overlay") {
    return (
      <div
        className={cn(
          "flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/90",
          rtl && "leading-[1.9]",
        )}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          {avatar}
          {/* py-1 + relaxed leading: truncate clips overflow, so give glyphs room */}
          <span className="truncate py-1 font-semibold leading-[1.9]">
            By {name}
          </span>
        </span>
        {reading && (
          <span className="inline-flex items-center gap-1.5 text-white/75">
            <Clock className="size-3.5" aria-hidden="true" />
            {reading}
          </span>
        )}
        {date && (
          <span className="inline-flex items-center gap-1.5 text-white/75">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            {date}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 text-xs text-muted-foreground",
        rtl && "leading-[1.9]",
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        {avatar}
        <span
          className={cn(
            "truncate py-1 font-semibold text-foreground/80",
            rtl ? "leading-[1.9]" : "leading-normal",
          )}
        >
          {name}
        </span>
      </span>

      <span className="flex shrink-0 items-center gap-3">
        {reading && (
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" aria-hidden="true" />
            {reading}
          </span>
        )}
        {date && (
          <span className="hidden items-center gap-1 sm:inline-flex">
            <CalendarDays className="size-3" aria-hidden="true" />
            {date}
          </span>
        )}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Story (no card chrome: image + typography only)                     */
/*  variant="grid" -> image on top, text below                         */
/*  variant="side" -> mobile: image + title; desktop: full text        */
/*  variant="wide" -> lead story: big image beside big headline        */
/* ------------------------------------------------------------------ */

function StoryCard({
  blog,
  variant = "grid",
  index,
}: {
  blog: HomeBlogItem;
  variant?: "grid" | "side" | "wide";
  index?: number;
}) {
  const rtl = isRtlBlog(blog);
  const href = articleHref(blog);
  const isSide = variant === "side";
  const isWide = variant === "wide";
  const titleFont = getTitleFont(blog);

  const titleClass = cn(
    titleFont,
    "text-balance font-bold text-foreground transition-colors duration-300 group-hover:text-primary",
    isSide &&
      cn(
        "line-clamp-2 text-[13px] sm:text-base lg:line-clamp-none",
        rtl
          ? "leading-loose lg:text-2xl lg:leading-loose"
          : "leading-snug lg:text-[1.35rem]",
      ),
    isWide &&
      (rtl
        ? "text-2xl leading-loose sm:text-3xl sm:leading-loose lg:text-4xl lg:leading-loose"
        : "text-2xl leading-[1.12] tracking-tight sm:text-3xl lg:text-[2.5rem]"),
    !isSide &&
      !isWide &&
      (rtl
        ? "text-xl leading-loose sm:text-2xl sm:leading-loose"
        : "text-xl leading-[1.2] sm:text-[1.45rem]"),
  );

  return (
    <article
      dir={rtl ? "rtl" : "ltr"}
      lang={blog.language.code}
      className={cn(
        "group relative min-w-0",
        isWide
          ? "grid gap-6 lg:grid-cols-12 lg:items-center lg:gap-12"
          : "flex h-full flex-col",
      )}
    >
      {/* Image: lazy by default, so it never competes with the hero */}
      <div
        className={cn(
          "relative isolate w-full shrink-0 overflow-hidden rounded-lg bg-muted shadow-none ring-1 ring-black/5",
          isWide && "aspect-3/2 lg:col-span-7 lg:aspect-16/10",
          isSide && "aspect-4/3 sm:aspect-video lg:aspect-16/8",
          !isSide && !isWide && "aspect-3/2",
        )}
      >
        <Image
          src={blog.bannerImage}
          alt={blog.title}
          fill
          quality={isWide ? 70 : 60}
          placeholder="blur"
          blurDataURL={BLUR}
          sizes={
            isWide
              ? "(min-width: 1024px) 640px, 100vw"
              : isSide
                ? "(min-width: 1024px) 400px, 50vw"
                : "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          }
          className="object-cover transition-transform duration-900 ease-out [@media(hover:hover)]:group-hover:scale-[1.045]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 [@media(hover:hover)]:group-hover:opacity-100" />
        <div className="absolute inset-s-2 top-2 sm:inset-s-3 sm:top-3">
          <LanguageBadge blog={blog} small={isSide} />
        </div>
        <ArrowChip className={isSide ? "lg:flex" : undefined} />
      </div>

      {/* Text */}
      <div
        className={cn(
          "flex flex-1 flex-col",
          isWide ? "gap-4 lg:col-span-5" : "gap-2.5",
          isSide && "pt-2.5 sm:pt-3 lg:pt-4",
          !isSide && !isWide && "pt-5",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3",
            isSide && "hidden lg:flex",
          )}
        >
          {typeof index === "number" && (
            <span className="font-serif text-lg font-bold italic leading-none text-foreground/25">
              {pad(index)}
            </span>
          )}
          <CategoryLabel blog={blog} />
        </div>

        <h3 className={titleClass}>
          {/* Stretched link: the whole story is clickable */}
          <Link href={href} className="after:absolute after:inset-0">
            <span className={cn(!rtl && UNDERLINE)}>{blog.title}</span>
          </Link>
        </h3>

        {blog.shortDescription && (
          <div
            className={cn(
              "text-start text-muted-foreground",
              isWide ? "line-clamp-3 text-base" : "line-clamp-2 text-sm",
              rtl
                ? isWide
                  ? "leading-[2.3]"
                  : "leading-[2.2]"
                : isWide
                  ? "leading-7"
                  : "leading-6",
              isSide && "hidden lg:block",
            )}
          >
            {blog.shortDescription}
          </div>
        )}

        <div
          className={cn(
            "mt-auto border-t border-border/70 pt-3",
            isWide && "mt-2",
            isSide && "hidden lg:block",
          )}
        >
          <StoryMeta blog={blog} />
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

export function HomeClient({ blogs }: HomeClientProps) {
  if (!blogs.length) {
    return (
      <div className="mx-auto max-w-md py-28 text-center">
        <span className="mb-4 block text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
          Alentah World
        </span>
        <h2 className="mb-3 font-serif text-3xl font-bold text-foreground sm:text-4xl">
          Stories are on the way.
        </h2>
        <p className="text-sm text-muted-foreground">
          No stories published yet. Check back soon.
        </p>
      </div>
    );
  }

  // ---- Pick hero + side stories, then everything else is "Latest" ----
  const used = new Set<string>();

  const englishBlogs = blogs.filter((b) => b.language.code === "en");
  const urduBlogs = blogs.filter((b) => b.language.code === "ur");
  const arabicBlogs = blogs.filter((b) => b.language.code === "ar");

  const hero = englishBlogs[0] ?? blogs[0];
  used.add(hero.id);

  const sideBlogs: HomeBlogItem[] = [];
  const pickFrom = (list: HomeBlogItem[]) => {
    const found = list.find((b) => !used.has(b.id));
    if (found) {
      used.add(found.id);
      sideBlogs.push(found);
    }
  };
  pickFrom(urduBlogs);
  pickFrom(arabicBlogs);

  // If one language is missing, fill from whatever is left
  for (const b of blogs) {
    if (sideBlogs.length >= 2) break;
    if (!used.has(b.id)) {
      used.add(b.id);
      sideBlogs.push(b);
    }
  }

  const latestBlogs = blogs.filter((b) => !used.has(b.id)).slice(0, 9);
  const leadBlog = latestBlogs[0];
  const restBlogs = latestBlogs.slice(1);

  const heroHref = articleHref(hero);
  const heroRtl = isRtlBlog(hero);
  const heroTitleFont = getTitleFont(hero);

  return (
    <div className="flex min-w-0 flex-col gap-16 overflow-x-clip pb-16 pt-5 sm:gap-24 sm:pb-24 sm:pt-8">
      {/* ============================================================ */}
      {/* 1. HERO + SIDE STORIES                                       */}
      {/* ============================================================ */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch lg:gap-10">
        {/* Hero: the main (LCP) image, so it loads first */}
        <article
          dir={heroRtl ? "rtl" : "ltr"}
          lang={hero.language.code}
          className="group relative isolate min-h-112 overflow-hidden rounded-[6px] bg-muted shadow-2xl shadow-black/15 ring-1 ring-black/5 sm:min-h-136 lg:col-span-8 lg:min-h-164"
        >
          <Image
            src={hero.bannerImage}
            alt={hero.title}
            fill
            priority
            fetchPriority="high"
            loading="eager"
            quality={70}
            placeholder="blur"
            blurDataURL={BLUR}
            sizes="(min-width: 1280px) 860px, (min-width: 1024px) 66vw, 100vw"
            className="object-cover transition-transform duration-1400 ease-out [@media(hover:hover)]:group-hover:scale-[1.035]"
          />

          {/* Cinematic overlay: deep fade + warm burgundy glow + top vignette */}
          <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/45 to-black/10" />
          <div className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-[#6b1d2e]/45 to-transparent mix-blend-multiply" />
          <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-black/35 to-transparent" />

          {/* Fine inner frame for a printed, premium feel */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[6px] ring-1 ring-inset ring-white/10"
          />

          {/* Whole hero is clickable */}
          <Link
            href={heroHref}
            aria-label={hero.title}
            className="absolute inset-0 z-20"
          />

          {/* Top row */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between p-5 sm:p-8 lg:p-10">
            <div className="flex items-center gap-3">
              <LanguageBadge blog={hero} />
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase leading-none tracking-[0.18em] text-white backdrop-blur-md">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-white"
                />
                Featured
              </span>
            </div>
          </div>

          {/* Bottom content */}
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end p-6 sm:p-9 lg:p-12">
            <div className="mb-4 flex items-center gap-4 sm:mb-5">
              <span aria-hidden="true" className="h-px w-10 bg-white/70" />
              <span
                className={cn(
                  "text-xs font-bold text-white/90",
                  heroRtl
                    ? "py-1 leading-[1.9]"
                    : "uppercase tracking-[0.22em]",
                )}
              >
                {hero.category.name}
              </span>
            </div>

            <h1
              className={cn(
                heroTitleFont,
                "mb-4 max-w-3xl text-balance text-3xl font-bold text-white sm:text-5xl xl:text-[3.5rem]",
                heroRtl
                  ? // Nastaliq / Arabic script: tall glyphs need a roomy line box,
                    // and negative tracking breaks letter joining.
                    "py-1 leading-[1.9] tracking-normal sm:leading-[1.9]"
                  : "leading-[1.06] tracking-tight",
              )}
            >
              {hero.title}
            </h1>

            {hero.shortDescription && (
              <div
                className={cn(
                  "mb-7 line-clamp-2 max-w-2xl text-start text-sm text-white/80 sm:text-[17px]",
                  heroRtl
                    ? // line-clamp hides overflow, so the line box must be tall
                      // enough to contain the full height of every glyph.
                      "leading-[2.2] sm:leading-[2.3]"
                    : "leading-6 sm:leading-7",
                )}
              >
                {hero.shortDescription}
              </div>
            )}

            <div className="flex items-end justify-between gap-4 border-t border-white/20 pt-5">
              <StoryMeta blog={hero} tone="overlay" />

              <span className="hidden shrink-0 items-center gap-2 rounded-full bg-white px-5 py-3 text-[13px] font-bold text-primary shadow-lg shadow-black/30 transition-transform duration-500 group-hover:translate-x-0.5 sm:inline-flex">
                Read story
                <ArrowRight
                  className="size-4 rtl:rotate-180"
                  aria-hidden="true"
                />
              </span>
            </div>
          </div>
        </article>

        {/* Side stories */}
        {sideBlogs.length > 0 && (
          <div className="flex min-w-0 flex-col gap-4 lg:col-span-4 lg:gap-5">
            <div className="hidden items-center gap-4 lg:flex">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">
                More to Read
              </span>
              <span aria-hidden="true" className="h-px flex-1 bg-border" />
            </div>

            <div className="grid min-w-0 flex-1 grid-cols-2 gap-3 sm:gap-5 lg:auto-rows-fr lg:grid-cols-1 lg:gap-6 lg:[&>*+*]:border-t lg:[&>*+*]:border-border/70 lg:[&>*+*]:pt-6">
              {sideBlogs.map((blog, i) => (
                <StoryCard
                  key={blog.id}
                  blog={blog}
                  variant="side"
                  index={i + 2}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ============================================================ */}
      {/* 2. LATEST STORIES                                            */}
      {/* ============================================================ */}
      {latestBlogs.length > 0 && (
        <section className="flex flex-col gap-10 sm:gap-14">
          {/* Header: no rules, just type */}
          <header className="flex flex-col gap-3">
            <span className="inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
              <span
                aria-hidden="true"
                className="size-1.5 rotate-45 bg-primary"
              />
              Fresh from the newsroom
            </span>
            <h2 className="font-serif text-4xl font-bold leading-none tracking-tight text-foreground sm:text-6xl">
              Latest Stories
              <sup className="ms-2 align-super font-sans text-xs font-bold tracking-widest text-foreground/35">
                {pad(latestBlogs.length)}
              </sup>
            </h2>
          </header>

          {/* Lead story */}
          {leadBlog && <StoryCard blog={leadBlog} variant="wide" />}

          {/* Rest of the stories */}
          {restBlogs.length > 0 && (
            <>
              <div
                aria-hidden="true"
                className="flex items-center gap-4 text-foreground/30"
              >
                <span className="h-px flex-1 bg-border" />
                <span className="size-1.5 rotate-45 bg-primary" />
                <span className="h-px flex-1 bg-border" />
              </div>

              <div className="grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {restBlogs.map((blog) => (
                  <StoryCard key={blog.id} blog={blog} variant="grid" />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* ============================================================ */}
      {/* 3. CLOSING BANNER (lighter wine-rose)                        */}
      {/* ============================================================ */}
      <section
        dir="ltr"
        className="relative isolate overflow-hidden rounded-[8px] bg-linear-to-br from-[#a33a55] via-[#8f2f49] to-[#7a2540] px-6 py-14 text-[#fffaf5] shadow-2xl shadow-[#8f2f49]/20 ring-1 ring-inset ring-white/15 sm:px-14 sm:py-20"
      >
        {/* Light only: soft glows, no black shadows */}
        <div
          aria-hidden="true"
          className="absolute -inset-e-24 -top-28 -z-10 size-104 rounded-full bg-white/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-32 -inset-s-16 -z-10 size-96 rounded-full bg-[#e0788f]/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-linear-to-b from-white/8 via-transparent to-transparent"
        />

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            {/* Language chips (each one is its own element so scripts never mix) */}
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/35 bg-white/10 px-3.5 py-1.5 font-serif text-sm font-semibold leading-none text-white">
                English
              </span>
              <span className="rounded-full border border-white/35 bg-white/10 px-3.5 py-1 font-urdu-display text-base leading-[1.9] text-white">
                اردو
              </span>
              <span className="rounded-full border border-white/35 bg-white/10 px-3.5 py-1 font-arabic-display text-base leading-[1.9] text-white">
                العربية
              </span>
            </div>

            <h2 className="font-serif text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              Your Curiosity Deserves Better Stories.
            </h2>
          </div>

          <div className="flex flex-col gap-8 lg:col-span-5 lg:items-end">
            <p
              style={{ textAlign: "left" }}
              className="max-w-md font-sans text-[15px] leading-7 text-white/90 [hyphens:none]"
            >
              Thoughtful work, meaningful perspectives, and stories worth your
              time, in three languages.
            </p>

            <Link
              href="/en"
              className="group/cta inline-flex items-center gap-3 rounded-full bg-[#fffaf5] py-2 pe-2 ps-8 text-sm font-bold text-[#8f2f49] shadow-xl shadow-[#5c1a2c]/20 transition-all duration-300 hover:bg-white hover:shadow-2xl"
            >
              Explore Our Stories
              <span className="flex size-10 items-center justify-center rounded-full bg-[#8f2f49] text-[#fffaf5] transition-transform duration-300 group-hover/cta:translate-x-0.5">
                <ArrowRight className="size-4" aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}