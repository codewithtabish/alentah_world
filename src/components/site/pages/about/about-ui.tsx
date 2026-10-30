import { MAROON_BORDER, MAROON_TEXT, RULE } from "@/data/about-data";
import { headingFont } from "@/data/about-fonts";
import type { ReactNode } from "react";

export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${
        className || MAROON_TEXT
      }`}
    >
      {children}
    </p>
  );
}

export function H2({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      id={id}
      className={`${headingFont.className} text-3xl leading-[1.15] sm:text-[2.1rem] ${
        className || MAROON_TEXT
      }`}
    >
      {children}
    </h2>
  );
}

export function Dash({ className = "w-6" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 border-t ${MAROON_BORDER} ${className}`}
    />
  );
}

// Thin vertical line used between columns (desktop only).
export function VDivider({ className = RULE }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`hidden self-stretch border-l lg:block ${className}`}
    />
  );
}