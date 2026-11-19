"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// ======================================================
// 1. ENEENA AD CONFIGURATION
// ======================================================

export const ADS_CONFIG = {
  // Set NEXT_PUBLIC_ADS_ENABLED=true to enable advertising.
  // It is inlined at BUILD time: rebuild / redeploy after changing it.
  enabled: process.env.NEXT_PUBLIC_ADS_ENABLED === "true",

  // Per-format switches
  adsense: false,
  adsterraNative: true,
  adsterraBanner: true, // 300x250
  adsterraBanner728: true, // 728x90
  adsterraBanner160: true, // 160x600
  adsterraSmartlink: false,
  adsterraSocialBar: false,
  adsterraPopunder: false,

  // Google AdSense
  adsenseClient: "ca-pub-7966396390181709",

  // Adsterra Native Banner
  nativeBannerKey: "75c056adbb2b8b4afd19d556347037c7",
  nativeBannerSrc: "https://bauval.org/21/75c056adbb2b8b4afd19d556347037c7",
  // "iframe" = each mount gets a fresh document (most reliable).
  // "inline" = old method (script added straight into the page).
  nativeBannerMode: "iframe" as "iframe" | "inline",

  // Adsterra Banner 300x250
  banner300x250Key: "75e3902782cea0e1982bc5e43d3e7cfb",
  // Same host pattern as your other banner units (bauval.org/22/<key>).
  // If Adsterra's GET CODE shows a different URL, paste it here.
  banner300x250Src: "https://bauval.org/22/75e3902782cea0e1982bc5e43d3e7cfb",

  // Adsterra Banner 728x90
  banner728x90Key: "d5a070a99f8b65a7ea77e97bdbceb33b",
  banner728x90Src: "https://bauval.org/22/d5a070a99f8b65a7ea77e97bdbceb33b",

  // Adsterra Banner 160x600 (tall side banner, article page)
  banner160x600Key: "ead30f9dacdca2f6f92272b2810e6679",
  banner160x600Src: "https://bauval.org/22/ead30f9dacdca2f6f92272b2810e6679",

  // Other formats (disabled above)
  smartlinkUrl: "https://araplhn.org/4/ac919a2f8bfdd8ea13c35d7f61d50d3c",
  socialBarSrc: "https://bauval.org/14/54394b71616ccf7df4a9086760b9e271",
  popunderSrc: "https://abscloud.org/1/f617c206a30a49a3a5a685a3735a06a2",
};

// ======================================================
// 2. HELPERS
// ======================================================

function normalizeScriptSrc(raw: string): string {
  const value = raw.trim();
  if (!value) return "";

  // Accept either a plain URL or a full <script src="..."> snippet.
  const match = value.match(/src\s*=\s*["']([^"']+)["']/i);
  let url = (match ? match[1] : value).trim();

  if (url.startsWith("//")) url = `https:${url}`;

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return "";
    return parsed.href;
  } catch {
    return "";
  }
}

// Explicit URL wins; otherwise fall back to the host your other banner
// units use (bauval.org/22/<key>).
function resolveBannerSrc(rawSrc: string, key: string): string {
  const explicit = normalizeScriptSrc(rawSrc);
  if (explicit) return explicit;
  if (!key.trim()) return "";
  return `https://bauval.org/22/${key.trim()}`;
}

function makeScript(src: string, async = true) {
  const script = document.createElement("script");
  script.src = src;
  script.async = async;
  script.setAttribute("data-cfasync", "false");
  return script;
}

// Each ad gets its own tiny document, so it runs fresh on every mount
// (React remounts, client-side navigation, back/forward) and its
// document.write() calls work. <base target="_blank"> makes every ad link
// open in a new tab instead of inside the iframe.
//
// color-scheme: browsers paint an opaque white background behind an
// iframe whose color scheme differs from the page's (this is what made
// the native banner white in dark mode). The meta tag below is the
// starting point; AdUnit then copies the page's exact scheme, text color
// and font into the frame (see syncTheme) and keeps it updated.
function buildSrcDoc(body: string) {
  return (
    `<!doctype html><html><head><meta charset="utf-8">` +
    `<meta name="color-scheme" content="light dark">` +
    `<base target="_blank">` +
    `<style>html,body{margin:0;padding:0;background:transparent;overflow:hidden}</style>` +
    `</head><body>${body}</body></html>`
  );
}

// null until the component has mounted in the browser, so server and
// client agree on the first render and no ad loads for the wrong size.
function useMinWidth(px: number) {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const query = window.matchMedia(`(min-width: ${px}px)`);
    const update = () => setMatches(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [px]);

  return matches;
}

// ======================================================
// 3. SHARED AD UNIT (label + iframe)
//
// Space is taken ONLY when a real ad has loaded:
//
//   loading -> the unit is rendered off-flow (position: fixed, opacity 0)
//              so the ad script runs normally and can be measured, but it
//              takes NO space on the page and adds NO gap to the layout.
//              (It is NOT visibility:hidden / display:none: ad networks
//              often refuse to serve into hidden frames.)
//   ready   -> the unit moves into the normal layout and covers exactly
//              the area the ad needs.
//   empty   -> no ad arrived (after 1 retry): the component renders
//              nothing at all. No label, no blank box.
//
// The ready unit carries data-ad-ready="true" so wrappers can react to it
// (see AdRow below).
// ======================================================

type AdStatus = "loading" | "ready" | "empty";

const NATIVE_PROBE_HEIGHT = 250; // height the loading native frame measures at
const MIN_FILLED_HEIGHT = 30;
const EMPTY_AFTER_MS = 15000;
const MAX_RETRIES = 1;
const THEME_STYLE_ID = "eneena-ad-theme";

const LABEL_CLASS =
  "text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground";

// Off-flow but still "visible" to the browser and the ad script.
const LOADING_CLASS =
  "pointer-events-none fixed left-0 top-0 -z-10 opacity-0";

function AdUnit({
  srcDoc,
  fixedWidth,
  fixedHeight,
  className,
}: {
  srcDoc: string;
  fixedWidth?: number;
  fixedHeight?: number;
  className?: string;
}) {
  const isFixed = fixedHeight !== undefined;
  const frameRef = useRef<HTMLIFrameElement>(null);

  const [attempt, setAttempt] = useState(0);
  const [height, setHeight] = useState(fixedHeight ?? NATIVE_PROBE_HEIGHT);
  const [status, setStatus] = useState<AdStatus>("loading");

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const startedAt = Date.now();
    let finished = false;
    let timer = 0;

    const stop = () => {
      finished = true;
      window.clearInterval(timer);
    };

    // Copies the page's current color scheme, text color and font into the
    // ad document, and removes any background color the ad puts on its own
    // tiles. Reads the values at runtime, so it follows the site theme.
    const syncTheme = (doc: Document) => {
      const host = frame.parentElement;
      if (!host || !doc.head) return;

      const computed = window.getComputedStyle(host);
      const scheme =
        computed.colorScheme && computed.colorScheme !== "normal"
          ? computed.colorScheme
          : "light";

      const css =
        `html,body{background:transparent !important;color-scheme:${scheme} !important}` +
        `body{color:${computed.color};font-family:${computed.fontFamily}}` +
        `[id^="container-"],[id^="container-"] *{` +
        `background-color:transparent !important;` +
        `color:inherit !important;` +
        `font-family:inherit !important}`;

      let style = doc.getElementById(THEME_STYLE_ID) as HTMLStyleElement | null;
      if (!style) {
        style = doc.createElement("style");
        style.id = THEME_STYLE_ID;
        doc.head.appendChild(style);
      }
      if (style.textContent !== css) style.textContent = css;
    };

    const measure = () => {
      if (finished) return;

      let filled = false;
      let content = 0;

      try {
        const doc = frame.contentDocument;
        const body = doc?.body;
        if (doc && body) {
          syncTheme(doc);

          if (isFixed) {
            // Adsterra writes its own iframe / image into the body.
            filled = Boolean(
              body.querySelector("iframe, img, a, ins, embed, video, object"),
            );
          } else {
            // Native: judge the ad container itself, NOT body.scrollHeight
            // (the body always reports at least the iframe's own height,
            // which made empty ads look "filled").
            const container = body.querySelector<HTMLElement>(
              '[id^="container-"]',
            );

            if (container) {
              const items = Array.from(
                container.querySelectorAll<HTMLElement>(
                  "a, img, iframe, ins, video",
                ),
              );

              const hasVisibleItem = items.some((el) => {
                const rect = el.getBoundingClientRect();
                if (rect.width <= 0 || rect.height <= 0) return false;
                // Images must really be loaded.
                if (el instanceof HTMLImageElement) {
                  return el.complete && el.naturalWidth > 0;
                }
                return true;
              });

              content = Math.ceil(container.getBoundingClientRect().height);
              filled = hasVisibleItem && content >= MIN_FILLED_HEIGHT;
            }
          }
        }
      } catch {
        return;
      }

      if (filled) {
        if (!isFixed) setHeight(content);
        setStatus("ready");
        return;
      }

      if (Date.now() - startedAt > EMPTY_AFTER_MS) {
        stop();
        if (attempt < MAX_RETRIES) {
          setAttempt((current) => current + 1);
        } else {
          console.debug("[ENEENA ads] no ad received (no fill or blocked).");
          setStatus((current) => (current === "ready" ? current : "empty"));
        }
      }
    };

    measure();
    timer = window.setInterval(measure, 500);
    window.addEventListener("resize", measure);

    return () => {
      stop();
      window.removeEventListener("resize", measure);
    };
  }, [isFixed, attempt]);

  // No ad: render nothing at all.
  if (status === "empty") return null;

  const ready = status === "ready";

  return (
    <aside
      aria-label="Advertisement"
      data-ad-ready={ready ? "true" : undefined}
      className={`flex min-w-0 flex-col items-center gap-2 text-foreground ${
        ready ? "" : LOADING_CLASS
      } ${className ?? ""}`}
    >
      <span className={LABEL_CLASS}>Advertisement</span>
      <iframe
        key={attempt}
        ref={frameRef}
        title="Advertisement"
        srcDoc={srcDoc}
        scrolling="no"
        width={fixedWidth}
        height={height}
        style={{
          display: "block",
          border: 0,
          width: fixedWidth ?? "100%",
          maxWidth: "100%",
          height,
        }}
      />
    </aside>
  );
}

function FixedBanner({
  width,
  height,
  adKey,
  src,
  className,
}: {
  width: number;
  height: number;
  adKey: string;
  src: string;
  className?: string;
}) {
  const options = JSON.stringify({
    key: adKey,
    format: "iframe",
    height,
    width,
    params: {},
  });

  const srcDoc = buildSrcDoc(
    `<script>var atOptions = ${options};</script>` +
      `<script data-cfasync="false" src="${src}"></script>`,
  );

  return (
    <AdUnit
      srcDoc={srcDoc}
      fixedWidth={width}
      fixedHeight={height}
      className={className}
    />
  );
}

// ======================================================
// 3b. AD ROW (wrapper for rows that hold one or more ads)
//
// Use this instead of a "hidden has-[aside]:flex" wrapper. A wrapper with
// display:none would stop the ads inside it from ever loading (nothing can
// be laid out or measured in a display:none box), so the row could never
// open.
//
//   no ad ready yet -> the row is off-flow (position: fixed, opacity 0):
//                      it takes NO space, adds NO gap and NO margin, but
//                      the ads inside it still load normally.
//   an ad is ready  -> the row moves into the normal layout (static) and
//                      shows, using whatever classes you pass in
//                      className (flex, margins, gap, ...).
//
// Pass the layout classes yourself, for example:
//   <AdRow dir="ltr" className="mt-16 flex w-full flex-col gap-8 lg:flex-row">
// ======================================================

export function AdRow({
  children,
  className,
  dir,
}: {
  children: ReactNode;
  className?: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div
      dir={dir}
      className={`pointer-events-none fixed left-0 top-0 w-full opacity-0 has-[aside[data-ad-ready]]:pointer-events-auto has-[aside[data-ad-ready]]:static has-[aside[data-ad-ready]]:opacity-100 ${
        className ?? ""
      }`}
    >
      {children}
    </div>
  );
}

// ======================================================
// 4. GOOGLE ADSENSE
// ======================================================

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdSenseUnit({
  slot,
  format = "auto",
  className,
}: {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}) {
  const pushed = useRef(false);

  const active =
    ADS_CONFIG.enabled && ADS_CONFIG.adsense && Boolean(slot.trim());

  useEffect(() => {
    if (!active || pushed.current) return;
    pushed.current = true;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error("ENEENA AdSense error:", error);
    }
  }, [active]);

  if (!active) return null;

  return (
    <div className={className ?? "my-8"}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADS_CONFIG.adsenseClient}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

// ======================================================
// 5. ADSTERRA NATIVE BANNER (4 tiles)
//
// Default: runs inside its own iframe, so it shows reliably every time
// and can safely appear more than once on a page.
// Fallback (nativeBannerMode: "inline"): script added into the page.
// ======================================================

function NativeInline({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const container = document.createElement("div");
    container.id = `container-${ADS_CONFIG.nativeBannerKey}`;

    const script = makeScript(src);

    // Adsterra expects the container before its script.
    host.append(container, script);

    // Show the label/space only once the ad has put real content in.
    const check = () => {
      const has = Boolean(container.querySelector("a, img, iframe, ins, video"));
      const height = container.getBoundingClientRect().height;
      setReady(has && height >= MIN_FILLED_HEIGHT);
    };
    check();
    const timer = window.setInterval(check, 500);

    return () => {
      window.clearInterval(timer);
      script.remove();
      container.remove();
    };
  }, [src]);

  return (
    <aside
      aria-label="Advertisement"
      data-ad-ready={ready ? "true" : undefined}
      className={`flex min-w-0 flex-col items-center gap-2 ${
        ready ? "" : LOADING_CLASS
      } ${className ?? ""}`}
    >
      <span className={LABEL_CLASS}>Advertisement</span>
      <div ref={hostRef} className="w-full" />
    </aside>
  );
}

export function AdsterraNativeBanner({ className }: { className?: string }) {
  const active = ADS_CONFIG.enabled && ADS_CONFIG.adsterraNative;
  const src = normalizeScriptSrc(ADS_CONFIG.nativeBannerSrc);

  if (!active || !src) return null;

  if (ADS_CONFIG.nativeBannerMode === "inline") {
    return <NativeInline src={src} className={className} />;
  }

  const srcDoc = buildSrcDoc(
    `<div id="container-${ADS_CONFIG.nativeBannerKey}"></div>` +
      `<script async data-cfasync="false" src="${src}"></script>`,
  );

  return <AdUnit srcDoc={srcDoc} className={className} />;
}

// ======================================================
// 6. ADSTERRA BANNER 300x250
//
// minWidth (optional): only render on screens at least this wide, e.g.
//   <AdsterraBanner300x250 minWidth={1024} />
// ======================================================

export function AdsterraBanner300x250({
  className,
  minWidth,
}: {
  className?: string;
  minWidth?: number;
}) {
  const fits = useMinWidth(minWidth ?? 0);

  const src = resolveBannerSrc(
    ADS_CONFIG.banner300x250Src,
    ADS_CONFIG.banner300x250Key,
  );

  if (!(ADS_CONFIG.enabled && ADS_CONFIG.adsterraBanner) || !src) return null;
  if (minWidth !== undefined && !fits) return null;

  return (
    <FixedBanner
      width={300}
      height={250}
      adKey={ADS_CONFIG.banner300x250Key}
      src={src}
      className={className}
    />
  );
}

// ======================================================
// 7. ADSTERRA BANNER 728x90 (wide leaderboard)
//
// Only rendered on screens 768px and wider, because 728px does not fit
// on phones.
// ======================================================

export function AdsterraBanner728x90({ className }: { className?: string }) {
  const wideEnough = useMinWidth(768);

  const src = resolveBannerSrc(
    ADS_CONFIG.banner728x90Src,
    ADS_CONFIG.banner728x90Key,
  );

  if (
    !(ADS_CONFIG.enabled && ADS_CONFIG.adsterraBanner728) ||
    !src ||
    !wideEnough
  ) {
    return null;
  }

  return (
    <FixedBanner
      width={728}
      height={90}
      adKey={ADS_CONFIG.banner728x90Key}
      src={src}
      className={className}
    />
  );
}

// ======================================================
// 8. RESPONSIVE BANNER (728x90 on tablet/desktop, 300x250 on phones)
//
// Use this wherever a full-width banner fits the page: it always picks
// the one size that fits the screen and never loads both.
// ======================================================

export function AdsterraBannerAuto({ className }: { className?: string }) {
  const wide = useMinWidth(768);

  const src728 = resolveBannerSrc(
    ADS_CONFIG.banner728x90Src,
    ADS_CONFIG.banner728x90Key,
  );
  const src300 = resolveBannerSrc(
    ADS_CONFIG.banner300x250Src,
    ADS_CONFIG.banner300x250Key,
  );

  // Wait until the screen size is known (avoids loading the wrong size).
  if (!ADS_CONFIG.enabled || wide === null) return null;

  if (wide) {
    if (!ADS_CONFIG.adsterraBanner728 || !src728) return null;
    return (
      <FixedBanner
        key="wide"
        width={728}
        height={90}
        adKey={ADS_CONFIG.banner728x90Key}
        src={src728}
        className={className}
      />
    );
  }

  if (!ADS_CONFIG.adsterraBanner || !src300) return null;
  return (
    <FixedBanner
      key="narrow"
      width={300}
      height={250}
      adKey={ADS_CONFIG.banner300x250Key}
      src={src300}
      className={className}
    />
  );
}

// ======================================================
// 9. ADSTERRA BANNER 160x600 (tall side banner)
//
// For the article page side column.
// minWidth (optional, default 1024): only render on screens at least this
// wide. The article page passes 1280 because the side rail needs that
// much room next to the article text.
// ======================================================

export function AdsterraBanner160x600({
  className,
  minWidth = 1024,
}: {
  className?: string;
  minWidth?: number;
}) {
  const wideEnough = useMinWidth(minWidth);

  const src = resolveBannerSrc(
    ADS_CONFIG.banner160x600Src,
    ADS_CONFIG.banner160x600Key,
  );

  if (
    !(ADS_CONFIG.enabled && ADS_CONFIG.adsterraBanner160) ||
    !src ||
    !wideEnough
  ) {
    return null;
  }

  return (
    <FixedBanner
      width={160}
      height={600}
      adKey={ADS_CONFIG.banner160x600Key}
      src={src}
      className={className}
    />
  );
}

// ======================================================
// 10. ADSTERRA SMARTLINK
// ======================================================

export function AdsterraSmartlink({
  children = "Sponsored",
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  if (!ADS_CONFIG.enabled || !ADS_CONFIG.adsterraSmartlink) return null;

  return (
    <a
      href={ADS_CONFIG.smartlinkUrl}
      target="_blank"
      rel="sponsored noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}

// ======================================================
// 11. SITE-WIDE SCRIPT HELPER
// ======================================================

function useBodyAdScript(active: boolean, rawSrc: string) {
  useEffect(() => {
    if (!active) return;

    const src = normalizeScriptSrc(rawSrc);

    if (!src) {
      console.error("ENEENA: Invalid site-wide ad script URL.");
      return;
    }

    const script = makeScript(src, false);
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [active, rawSrc]);
}

// ======================================================
// 12. ADSTERRA SOCIAL BAR
//
// Keep disabled. If enabled later, mount ONCE in root layout.
// ======================================================

export function AdsterraSocialBar() {
  const active = ADS_CONFIG.enabled && ADS_CONFIG.adsterraSocialBar;
  useBodyAdScript(active, ADS_CONFIG.socialBarSrc);
  return null;
}

// ======================================================
// 13. ADSTERRA POPUNDER
//
// Keep disabled. If enabled later, mount ONCE in root layout.
// ======================================================

export function AdsterraPopunder() {
  const active = ADS_CONFIG.enabled && ADS_CONFIG.adsterraPopunder;
  useBodyAdScript(active, ADS_CONFIG.popunderSrc);
  return null;
}