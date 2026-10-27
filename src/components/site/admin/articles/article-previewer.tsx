// src/components/site/admin/article/article-previewer.tsx
"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import CodeBlockSwitcher from "./code-article-switcher";
import { z } from "zod";
import { tableOfContentsSchema } from "@/schemas/artcile";

type TableOfContentsItem = z.infer<typeof tableOfContentsSchema>;

type PreviewerProps = {
  content: any;
  language?: "en" | "ur" | "ar";
  tableOfContents?: TableOfContentsItem[];
  stickyOffset?: number;
  showToc?: boolean;
};

type SidebarProps = {
  content: any;
  language?: "en" | "ur" | "ar";
  tableOfContents?: TableOfContentsItem[];
  stickyOffset?: number;
};

const TOC_TYPES = new Set([
  "toc",
  "tableofcontents",
  "table-of-contents",
  "table_of_contents",
]);

// Height of the sticky TOC bar (approx) + breathing room
const TOC_BAR_SPACE = 80;

const renderHTML = (html: string | undefined | null) => {
  if (!html || html.trim() === "") return undefined;
  return { __html: html };
};

const stripHtml = (html: string) =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const ImageBlock: React.FC<{ file?: any; caption?: string }> = ({
  file,
  caption,
}) => {
  if (!file?.url) return null;

  return (
    <figure className="not-prose my-10 flex flex-col items-center">
      <div className="w-full overflow-hidden rounded-2xl border border-border bg-muted/20 shadow-sm">
        <Image
          src={file.url}
          alt={caption || "Article image"}
          width={1200}
          height={675}
          sizes="(min-width: 1024px) 760px, 100vw"
          className="h-auto max-h-162.5 w-full object-contain"
        />
      </div>

      {caption && (
        <figcaption className="mt-3 max-w-2xl text-center text-sm leading-6 text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

const CodeBlock: React.FC<{
  code?: string;
  language?: string;
  title?: string;
}> = ({ code, language = "javascript", title = "Code" }) => {
  const [copied, setCopied] = useState(false);

  if (!code?.trim()) return null;

  const normalizedLanguage = language.toLowerCase();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  return (
    <div
      data-code-switcher
      className="not-prose my-8 w-full overflow-hidden rounded-2xl border border-border bg-muted/20 shadow-sm"
      dir="ltr"
    >
      <div className="flex min-h-14.5 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-sm sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-sm font-medium text-foreground">
              {title}
            </span>
            <span className="hidden rounded-md border border-border bg-muted px-2 py-0.5 font-mono text-[11px] font-medium text-muted-foreground sm:inline-flex">
              {normalizedLanguage.toUpperCase()}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-muted-foreground shadow-sm transition-all hover:bg-muted hover:text-foreground active:scale-[0.98]"
        >
          {copied ? <span>Copied</span> : <span>Copy</span>}
        </button>
      </div>

      <div className="overflow-x-auto">
        <pre className="m-0 min-w-full bg-transparent px-5 py-6 text-[13px] leading-7 sm:px-6 sm:py-7 sm:text-sm">
          <code className="font-mono text-foreground">{code}</code>
        </pre>
      </div>
    </div>
  );
};

function slugifyHeader(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getHeadingIds(blocks: any[]): Record<number, string> {
  const used: Record<string, number> = {};
  const result: Record<number, string> = {};

  blocks.forEach((block, index) => {
    if (block?.type?.toLowerCase() !== "header") return;
    const raw = block.data?.text;
    if (typeof raw !== "string" || !raw.trim()) return;

    const base = slugifyHeader(stripHtml(raw)) || `section-${index}`;
    const count = used[base] ?? 0;
    used[base] = count + 1;
    result[index] = count === 0 ? base : `${base}-${count}`;
  });

  return result;
}

type TocItem = { id: string; title: string; level: number };

function buildToc(
  blocks: any[],
  headingIds: Record<number, string>,
  fallback: TableOfContentsItem[],
): TocItem[] {
  const all: TocItem[] = [];

  blocks.forEach((block, index) => {
    const id = headingIds[index];
    if (!id) return;
    all.push({
      id,
      title: stripHtml(String(block.data.text)),
      level: Math.min(Math.max(block.data.level || 2, 1), 6),
    });
  });

  const main = all.filter((item) => item.level >= 2 && item.level <= 3);
  if (main.length) return main;
  if (all.length) return all;

  return fallback
    .map((item) => ({
      id: item.id || slugifyHeader(item.title),
      title: item.title,
      level: item.level || 2,
    }))
    .filter((item) => item.id && item.title);
}

function getReadingMinutes(blocks: any[]) {
  let words = 0;
  blocks.forEach((b: any) => {
    const d = b?.data ?? {};
    const texts: string[] = [];
    if (typeof d.text === "string") texts.push(d.text);
    if (typeof d.itemsContent === "string") texts.push(d.itemsContent);
    if (typeof d.message === "string") texts.push(d.message);
    if (Array.isArray(d.items)) {
      d.items.forEach((it: any) =>
        texts.push(typeof it === "string" ? it : it?.content || it?.text || ""),
      );
    }
    texts.forEach((t) => {
      const clean = stripHtml(t);
      if (clean) words += clean.split(/\s+/).length;
    });
  });
  return Math.max(1, Math.round(words / 220));
}

/**
 * `activeOffset` = distance from the top of the viewport at which a heading
 * counts as "current". Must be slightly larger than the scroll landing offset.
 */
function useArticleScroll(toc: TocItem[], activeOffset: number) {
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const headings = toc
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));
    let ticking = false;

    const update = () => {
      ticking = false;
      const article = document.querySelector<HTMLElement>("[data-blog-article]");
      if (article) {
        const rect = article.getBoundingClientRect();
        const total = Math.max(rect.height - window.innerHeight * 0.6, 1);
        setProgress(Math.min(Math.max(-rect.top / total, 0), 1));
      }
      if (headings.length) {
        let current = headings[0].id;
        for (const heading of headings) {
          if (heading.getBoundingClientRect().top <= activeOffset) {
            current = heading.id;
          } else break;
        }
        setActiveId(current);
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [toc, activeOffset]);

  return { progress, activeId, setActiveId };
}

/**
 * Scrolls so the heading sits `offset` px below the top of the viewport.
 * Falls back to matching by title if the id is not in the DOM.
 */
function scrollToId(id: string, offset: number, title?: string) {
  let target: HTMLElement | null = document.getElementById(id);

  if (!target && title) {
    const wanted = title.trim().toLowerCase();
    const candidates = document.querySelectorAll<HTMLElement>(
      "[data-blog-article] h1, [data-blog-article] h2, [data-blog-article] h3, [data-blog-article] h4, [data-blog-article] h5, [data-blog-article] h6",
    );
    for (const el of Array.from(candidates)) {
      const text = (el.textContent || "").replace(/#\s*$/, "").trim().toLowerCase();
      if (text === wanted || text.startsWith(wanted)) {
        target = el;
        break;
      }
    }
  }

  if (!target) return;

  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
}

function TocList({
  items,
  activeId,
  onSelect,
  isRTL,
}: {
  items: TocItem[];
  activeId: string;
  onSelect: (item: TocItem) => void;
  isRTL?: boolean;
}) {
  return (
    <ul
      className={`relative m-0 list-none space-y-0.5 p-0 ${
        isRTL ? "border-r" : "border-l"
      } border-border`}
    >
      {items.map((item, index) => {
        const isActive = activeId === item.id;
        return (
          <li key={`${item.id}-${index}`} className="m-0 p-0">
            <button
              type="button"
              data-toc-id={item.id}
              onClick={() => onSelect(item)}
              aria-current={isActive ? "location" : undefined}
              style={{
                [isRTL ? "paddingRight" : "paddingLeft"]: `${
                  Math.max(item.level - 2, 0) * 14 + 14
                }px`,
              }}
              className={cn(
                `relative ${
                  isRTL ? "-mr-px border-r-2 pr-3" : "-ml-px border-l-2 pl-3"
                } block w-full transition-colors duration-200`,
                isRTL
                  ? "py-1.5 text-right font-urdu-text text-[15px] leading-[2.2]"
                  : "py-2 text-left text-[13.5px] leading-5",
                isActive
                  ? "border-primary font-semibold text-primary"
                  : "border-transparent text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground",
              )}
            >
              {item.title}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/*  Sticky dropdown table of contents (top of article)                 */
/*  The panel is an OVERLAY (absolute) so it never shifts the layout.  */
/* ------------------------------------------------------------------ */
function StickyTocDropdown({
  items,
  activeId,
  progress,
  readingMinutes,
  stickyOffset,
  isRTL,
  onSelect,
}: {
  items: TocItem[];
  activeId: string;
  progress: number;
  readingMinutes: number;
  stickyOffset: number;
  isRTL: boolean;
  onSelect: (item: TocItem) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const percent = Math.round(progress * 100);
  const minutesLeft = Math.max(0, Math.ceil(readingMinutes * (1 - progress)));
  const activeItem = items.find((i) => i.id === activeId) ?? items[0];

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;

    const onDown = (e: MouseEvent | TouchEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown, { passive: true });
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Keep active item visible inside the open dropdown
  useEffect(() => {
    if (!open || !activeId) return;
    const box = listRef.current;
    if (!box) return;
    const el = box.querySelector<HTMLElement>(
      `[data-toc-id="${CSS.escape(activeId)}"]`,
    );
    if (!el) return;
    const top =
      el.getBoundingClientRect().top -
      box.getBoundingClientRect().top +
      box.scrollTop -
      box.clientHeight / 2 +
      el.clientHeight / 2;
    box.scrollTo({ top, behavior: "auto" });
  }, [open, activeId]);

  if (!items.length) return null;

  return (
    <div
      ref={wrapRef}
      className="not-prose sticky z-40 mb-8"
      style={{ top: stickyOffset }}
    >
      {/* the bar */}
      <div className="overflow-hidden rounded-2xl border border-border bg-background/90 shadow-sm backdrop-blur-md">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="article-toc-panel"
          className={cn(
            "flex w-full items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40 sm:px-5",
            isRTL ? "flex-row-reverse text-right" : "text-left",
          )}
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-4">
              <path
                d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <span className="flex min-w-0 flex-1 flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              In this article
            </span>
            {/*
              FIX: Nastaliq glyphs extend above/below the normal line box.
              `truncate` = overflow:hidden, which clipped them. Padding sits
              INSIDE the overflow box, so tall line-height + vertical padding
              keeps the full glyphs visible while still truncating long titles.
            */}
            <span
              className={cn(
                "block overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-foreground",
                isRTL
                  ? "py-2 font-urdu-text text-[15px] leading-[2.4] sm:text-base"
                  : "text-sm",
              )}
            >
              {activeItem?.title}
            </span>
          </span>

          <span
            dir="ltr"
            className="hidden shrink-0 text-xs tabular-nums text-muted-foreground sm:block"
          >
            {progress >= 0.98
              ? `${readingMinutes} min read`
              : `${minutesLeft} min left`}
          </span>

          <span
            dir="ltr"
            className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-xs font-semibold tabular-nums text-foreground"
          >
            {percent}%
          </span>

          <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
              open ? "rotate-180" : "rotate-0",
            )}
          >
            <path
              d="m6 9 6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="h-0.5 w-full bg-muted">
          <div
            className={cn(
              "h-full bg-primary transition-[width] duration-150",
              isRTL && "ml-auto",
            )}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* dropdown panel: overlay, does NOT affect page layout */}
      <div
        id="article-toc-panel"
        aria-hidden={!open}
        className={cn(
          "absolute inset-x-0 top-full z-50 mt-2 origin-top rounded-2xl border border-border bg-background shadow-xl transition-all duration-200 ease-out",
          open
            ? "visible translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-2 opacity-0",
        )}
      >
        <div
          ref={listRef}
          className="max-h-[55vh] overflow-y-auto px-4 py-4 sm:px-5"
        >
          <TocList
            items={items}
            activeId={activeId}
            isRTL={isRTL}
            onSelect={(item) => {
              setOpen(false);
              onSelect(item);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export const ArticleSidebar: React.FC<SidebarProps> = ({
  content,
  language = "en",
  tableOfContents = [],
  stickyOffset = 88,
}) => {
  const isRTL = language === "ur" || language === "ar";
  const blocks = useMemo(
    () => (Array.isArray(content?.blocks) ? content.blocks : []),
    [content],
  );
  const headingIds = useMemo(() => getHeadingIds(blocks), [blocks]);
  const toc = useMemo(
    () => buildToc(blocks, headingIds, tableOfContents),
    [blocks, headingIds, tableOfContents],
  );
  const readingMinutes = useMemo(() => getReadingMinutes(blocks), [blocks]);
  const { progress, activeId } = useArticleScroll(toc, stickyOffset + 24);
  const tocBoxRef = useRef<HTMLDivElement>(null);

  const percent = Math.round(progress * 100);
  const minutesLeft = Math.max(0, Math.ceil(readingMinutes * (1 - progress)));

  useEffect(() => {
    const box = tocBoxRef.current;
    if (!box || !activeId) return;
    const el = box.querySelector<HTMLElement>(
      `[data-toc-id="${CSS.escape(activeId)}"]`,
    );
    if (!el) return;
    const top =
      el.getBoundingClientRect().top -
      box.getBoundingClientRect().top +
      box.scrollTop -
      box.clientHeight / 2 +
      el.clientHeight / 2;
    box.scrollTo({ top, behavior: "smooth" });
  }, [activeId]);

  if (!blocks.length) return null;

  return (
    <aside
      aria-label="Article sidebar"
      className="hidden min-w-0 lg:block"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        className="sticky flex flex-col gap-4 overflow-y-auto pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden"
        style={{
          top: stickyOffset,
          maxHeight: `calc(100vh - ${stickyOffset + 16}px)`,
        }}
      >
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="px-5 py-4">
            <div className="mb-2.5 flex items-baseline justify-between">
              <span className="text-sm font-semibold text-foreground">
                {progress >= 0.98 ? "You finished reading" : "Reading progress"}
              </span>
              <span dir="ltr" className="text-sm tabular-nums text-muted-foreground">
                {percent}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full bg-primary transition-[width] duration-150 ${
                  isRTL ? "ml-auto" : ""
                }`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <p dir="ltr" className={cn("mt-2.5 text-xs text-muted-foreground", isRTL && "text-right")}>
              {progress >= 0.98
                ? `${readingMinutes} min read`
                : `${minutesLeft} min left of ${readingMinutes} min`}
            </p>
          </div>

          {toc.length > 0 && (
            <div className="border-t border-border px-5 py-4">
              <p className="mb-3 text-sm font-semibold text-foreground">
                In this article
              </p>
              <div
                ref={tocBoxRef}
                className="relative max-h-[38vh] overflow-y-auto pr-1 scrollbar-thin"
              >
                <TocList
                  items={toc}
                  activeId={activeId}
                  onSelect={(item) =>
                    scrollToId(item.id, stickyOffset + 16, item.title)
                  }
                  isRTL={isRTL}
                />
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          Back to top
        </button>
      </div>
    </aside>
  );
};

export const ArticlePreviewer: React.FC<PreviewerProps> = ({
  content,
  language = "en",
  tableOfContents = [],
  stickyOffset = 88,
  showToc = true,
}) => {
  const [openToggles, setOpenToggles] = useState<Record<string, boolean>>({});
  const isRTL = language === "ur" || language === "ar";

  // where a heading lands after clicking a TOC item
  const landingOffset = stickyOffset + (showToc ? TOC_BAR_SPACE : 16);

  const blocks = useMemo(
    () => (Array.isArray(content?.blocks) ? content.blocks : []),
    [content],
  );
  const headingIds = useMemo(() => getHeadingIds(blocks), [blocks]);
  const toc = useMemo(
    () => buildToc(blocks, headingIds, tableOfContents),
    [blocks, headingIds, tableOfContents],
  );
  const readingMinutes = useMemo(() => getReadingMinutes(blocks), [blocks]);
  const { progress, activeId, setActiveId } = useArticleScroll(
    toc,
    landingOffset + 12,
  );

  useEffect(() => {
    const html = document.documentElement;
    const previous = html.style.scrollBehavior;
    html.style.scrollBehavior = "smooth";
    return () => {
      html.style.scrollBehavior = previous;
    };
  }, []);

  const handleToggleClick = (id: string) =>
    setOpenToggles((prev) => ({ ...prev, [id]: !prev[id] }));

  if (!content || !content.blocks?.length) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Start writing to see the preview...
      </div>
    );
  }

  // Removed text-align-last: right to prevent clipping in Nastaliq
  const readableText: React.CSSProperties = {
    textAlign: isRTL ? "right" : "left",
    hyphens: "none",
    WebkitHyphens: "none",
    overflowWrap: "break-word",
    wordBreak: "break-word",
  };

  const renderBlock = (block: any, index: number): React.ReactNode => {
    const type = block.type?.toLowerCase();
    if (TOC_TYPES.has(type)) return null;

    switch (type) {
      case "toggle": {
        const toggleId = String(block.id ?? `toggle-${index}`);
        const isOpen = openToggles[toggleId] ?? block.data.status === "open";
        if (!block.data.text && !block.data.itemsContent) return null;

        return (
          <div
            key={index}
            className="not-prose mb-5 overflow-hidden rounded-xl border border-border bg-card shadow-sm"
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => handleToggleClick(toggleId)}
              className={cn(
                "flex w-full items-center justify-between gap-4 bg-muted/40 px-4 py-3.5 font-semibold text-foreground transition-colors hover:bg-muted/60",
                isRTL ? "text-right" : "text-left",
              )}
            >
              <span>{block.data.text}</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className={cn(
                  "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                  isOpen ? "rotate-180" : "rotate-0",
                )}
              >
                <path
                  d="m6 9 6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {isOpen && block.data.itemsContent && (
              <div
                className="px-4 py-4 text-foreground"
                style={readableText}
                dangerouslySetInnerHTML={renderHTML(block.data.itemsContent)}
              />
            )}
          </div>
        );
      }

      case "alert":
      case "warning": {
        if (!block.data) return null;
        const alertTitle = block.data.title?.trim() || "Warning";
        const alertMessage = block.data.message?.trim();
        if (!alertMessage) return null;
        return (
          <div
            key={index}
            className="not-prose mb-6 rounded-xl border border-border bg-muted p-4 text-foreground sm:p-5"
            style={readableText}
          >
            <strong className="mb-1 block font-semibold">{alertTitle}</strong>
            <span>{alertMessage}</span>
          </div>
        );
      }

      case "paragraph":
      case "aitext": {
        const text = block.data.text?.trim();
        if (!text) return null;

        return (
          <p
            key={index}
            style={readableText}
            className={cn(
              "mb-6 text-foreground/90",
              isRTL
                ? "text-[1.25rem] leading-[2.4] sm:text-[1.375rem] sm:leading-[2.5] tracking-normal font-urdu-text"
                : "text-[1.0625rem] leading-[1.85] tracking-[-0.005em] sm:text-lg sm:leading-8",
            )}
            dangerouslySetInnerHTML={renderHTML(text)}
          />
        );
      }

      case "linktool": {
        const link = block.data.link;
        const meta = block.data.meta;
        if (!link) return null;
        return (
          <a
            key={index}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="not-prose group my-6 flex items-start gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {meta?.image?.url && (
              <Image
                src={meta.image.url}
                alt={meta.title || "Link preview"}
                width={100}
                height={100}
                className="h-20 w-20 shrink-0 rounded-lg object-cover"
              />
            )}
            <div className="min-w-0 flex-1" style={readableText}>
              <span className="block font-semibold text-primary group-hover:underline">
                {meta?.title || link}
              </span>
              {meta?.description && (
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {meta.description}
                </p>
              )}
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {link}
              </p>
            </div>
          </a>
        );
      }

      case "image":
        return (
          <ImageBlock
            key={index}
            file={block.data.file}
            caption={block.data.caption}
          />
        );

      case "code":
        return (
          <CodeBlock
            key={index}
            code={block.data.code}
            language={block.data.language || block.data.lang || "javascript"}
            title={block.data.title || "Code"}
          />
        );

      case "header": {
        if (!block.data.text) return null;
        const level = Math.min(Math.max(block.data.level || 2, 1), 6);
        const id = headingIds[index] || slugifyHeader(block.data.text);

        const classes = isRTL
          ? level === 1
            ? "mb-5 mt-14 text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-urdu-display leading-[1.6]"
            : level === 2
              ? "mb-4 mt-12 text-[1.75rem] font-bold leading-[1.6] tracking-tight text-foreground sm:text-4xl font-urdu-display"
              : level === 3
                ? "mb-3 mt-9 text-2xl font-bold leading-[1.6] tracking-tight text-foreground sm:text-3xl font-urdu-display"
                : "mb-3 mt-8 text-xl font-semibold tracking-tight text-foreground sm:text-2xl font-urdu-display leading-[1.6]"
          : level === 1
            ? "mb-5 mt-14 text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
            : level === 2
              ? "mb-4 mt-12 text-[1.75rem] font-bold leading-tight tracking-tight text-foreground sm:text-4xl"
              : level === 3
                ? "mb-3 mt-9 text-2xl font-bold leading-snug tracking-tight text-foreground sm:text-3xl"
                : "mb-3 mt-8 text-xl font-semibold tracking-tight text-foreground sm:text-2xl";

        const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;

        return (
          <Tag
            key={index}
            id={id}
            style={{
              // used by the "#" hash links; TOC clicks use landingOffset directly
              scrollMarginTop: landingOffset,
              ...readableText,
            }}
            className={`group relative ${classes}`}
          >
            {block.data.text}
            <a
              href={`#${id}`}
              aria-label="Link to this section"
              className={cn(
                "ml-2 hidden text-muted-foreground/40 no-underline opacity-0 transition-opacity hover:text-primary group-hover:opacity-100 lg:inline",
                isRTL && "mr-2 ml-0",
              )}
            >
              #
            </a>
          </Tag>
        );
      }

      case "list": {
        if (!block.data.items?.length) return null;
        const ListTag = block.data.style === "ordered" ? "ol" : "ul";
        const listClass = isRTL
          ? block.data.style === "ordered"
            ? "mb-6 list-outside list-decimal space-y-2.5 pr-6 pl-0 text-[1.25rem] leading-[2.4] marker:font-semibold marker:text-primary font-urdu-text"
            : "mb-6 list-outside list-disc space-y-2.5 pr-6 pl-0 text-[1.25rem] leading-[2.4] marker:text-primary font-urdu-text"
          : block.data.style === "ordered"
            ? "mb-6 list-outside list-decimal space-y-2.5 pl-6 text-[1.0625rem] leading-8 marker:font-semibold marker:text-primary sm:text-lg"
            : "mb-6 list-outside list-disc space-y-2.5 pl-6 text-[1.0625rem] leading-8 marker:text-primary sm:text-lg";

        return (
          <ListTag key={index} className={listClass} style={readableText}>
            {block.data.items.map((item: any, i: number) => (
              <li
                key={i}
                className={cn("pl-1", isRTL && "pr-1 pl-0")}
                dangerouslySetInnerHTML={renderHTML(
                  typeof item === "string" ? item : item.content || "",
                )}
              />
            ))}
          </ListTag>
        );
      }

      case "quote":
        if (!block.data.text) return null;
        return (
          <blockquote
            key={index}
            style={readableText}
            className={cn(
              "not-prose relative my-10 overflow-hidden rounded-2xl border border-border bg-muted/30 py-6 text-lg italic leading-8 text-foreground/80 sm:text-xl",
              isRTL ? "pr-7 pl-6 font-urdu-text leading-[2.5]" : "pl-7 pr-6",
            )}
          >
            <span
              aria-hidden="true"
              className={`absolute inset-y-0 ${
                isRTL ? "right-0" : "left-0"
              } w-1.5 bg-primary`}
            />
            {block.data.text}
            {block.data.caption && (
              <footer className="mt-4 text-sm font-medium not-italic text-muted-foreground">
                — {block.data.caption}
              </footer>
            )}
          </blockquote>
        );

      case "table": {
        if (!block.data?.content) return null;
        return (
          <div
            key={index}
            className="not-prose my-8 overflow-x-auto rounded-xl border border-border shadow-sm"
          >
            <table
              className="w-full min-w-120 border-collapse text-left"
              dir={isRTL ? "rtl" : "ltr"}
            >
              <tbody>
                {block.data.content.map((row: string[], rowIdx: number) => (
                  <tr
                    key={rowIdx}
                    className={cn(
                      "border-b border-border last:border-b-0",
                      rowIdx === 0 && block.data.withHeadings
                        ? "bg-muted/50 font-semibold"
                        : rowIdx % 2 === 1
                          ? "bg-muted/20"
                          : "",
                    )}
                  >
                    {row.map((cell, cellIdx) => (
                      <td
                        key={cellIdx}
                        style={readableText}
                        className="border-r border-border px-4 py-3 text-sm leading-6 text-foreground last:border-r-0"
                        dangerouslySetInnerHTML={renderHTML(cell)}
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      // RAW HTML KEPT EXACTLY AS IT WAS
      case "raw":
        if (!block.data.html) return null;
        return (
          <div
            key={index}
            className="my-8 max-w-full overflow-x-auto"
            dangerouslySetInnerHTML={renderHTML(block.data.html)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-w-0" dir={isRTL ? "rtl" : "ltr"}>
      {/* top reading progress bar */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-60 h-0.75"
      >
        <div
          className={`h-full bg-primary transition-transform duration-100 ${
            isRTL ? "origin-right" : "origin-left"
          }`}
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      {/* sticky dropdown table of contents */}
      {showToc && toc.length > 0 && (
        <StickyTocDropdown
          items={toc}
          activeId={activeId}
          progress={progress}
          readingMinutes={readingMinutes}
          stickyOffset={stickyOffset}
          isRTL={isRTL}
          onSelect={(item) => {
            setActiveId(item.id);
            scrollToId(item.id, landingOffset, item.title);
          }}
        />
      )}

      <CodeBlockSwitcher />

      <article
        data-blog-article
        className={cn(
          "prose min-w-0 max-w-none dark:prose-invert",
          isRTL && "font-urdu-text",
        )}
        lang={isRTL ? language : "en"}
      >
        {content.blocks.map((block: any, index: number) => (
          <React.Fragment key={index}>{renderBlock(block, index)}</React.Fragment>
        ))}
      </article>
    </div>
  );
};