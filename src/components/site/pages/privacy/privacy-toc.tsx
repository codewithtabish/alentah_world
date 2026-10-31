// src/components/site/pages/privacy/privacy-toc.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type TocItem = { id: string; title: string };

type PrivacyTocProps = {
  items: TocItem[];
  noteTitle?: string;
  noteText?: string;
};

export function PrivacyToc({
  items,
  noteTitle = "Your trust is important to us.",
  noteText = "We are committed to being transparent about how we handle your information.",
}: PrivacyTocProps) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  const list = (
    <ol className="flex flex-col">
      {items.map((item, index) => {
        const isActive = active === item.id;

        return (
          <li key={item.id}>
            <Link
              href={`#${item.id}`}
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "flex gap-2 border-s-2 py-1.5 ps-4 text-[13.5px] leading-snug transition-colors duration-200",
                isActive
                  ? "border-primary font-semibold text-primary"
                  : "border-transparent text-foreground/75 hover:text-primary",
              )}
            >
              <span className="tabular-nums">{index + 1}.</span>
              <span>{item.title}</span>
            </Link>
          </li>
        );
      })}
    </ol>
  );

  return (
    <>
      {/* Mobile / tablet: collapsible */}
      <details className="group rounded-lg border border-border lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/70 marker:content-none [&::-webkit-details-marker]:hidden">
          Table of contents
          <ChevronDown
            className="size-4 transition-transform duration-300 group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <nav aria-label="Table of contents" className="border-t border-border px-5 py-4">
          {list}
        </nav>
      </details>

      {/* Desktop: sticky sidebar */}
      <div className="hidden rounded-lg border border-border p-6 lg:sticky lg:top-24 lg:block">
        <p className="mb-4 border-b border-border pb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/70">
          Table of contents
        </p>

        <nav
          aria-label="Table of contents"
          className="max-h-[calc(100vh-20rem)] overflow-y-auto"
        >
          {list}
        </nav>

        <div className="mt-5 flex items-start gap-3 border-t border-border pt-5">
          <ShieldCheck className="mt-0.5 size-8 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <p className="font-serif text-[15px] font-semibold leading-snug text-foreground">
              {noteTitle}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {noteText}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}