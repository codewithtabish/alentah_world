"use client";

/**
 * ======================================================
 * ENEENA — ALL ADS IN ONE FILE
 * Place at: components/ads/ads.tsx
 *
 * Import what you need:
 *   import { AdsterraNativeBanner } from "@/components/ads/ads";
 *
 * Contents
 *   1. ADS_CONFIG ............ master switches
 *   2. AdSenseUnit ........... Google display ad (needs slot ID)
 *   3. AdsterraNativeBanner .. 4-tile native ads (in content)
 *   4. AdsterraBanner300x250 . fixed banner (sidebar / content)
 *   5. AdsterraSmartlink ..... "Sponsored" link
 *   6. AdsterraSocialBar ..... site-wide, put in layout
 *   7. AdsterraPopunder ...... site-wide, OFF by default
 *
 * Every component renders nothing when its switch is off,
 * so you can leave them placed and just flip the config.
 * ======================================================
 */

import { useEffect, useRef, type ReactNode } from "react";

// ======================================================
// 1. MASTER CONFIG
// ======================================================

export const ADS_CONFIG = {
  // Master switch. In .env.local / your host's env set:
  //   NEXT_PUBLIC_ADS_ENABLED=true
  // Inlined at BUILD time: rebuild/redeploy after changing it.
  enabled: process.env.NEXT_PUBLIC_ADS_ENABLED === "true",

  // Per-network switches
  adsense: true,
  adsterraNative: true,
  adsterraBanner: true,
  adsterraSmartlink: true,
  adsterraSocialBar: false, // intrusive: enable only after AdSense approval
  adsterraPopunder: false, // violates AdSense policy: keep OFF

  // ---- AdSense ----
  adsenseClient: "ca-pub-7966396390181709",

  // ---- Adsterra ----
  nativeBannerKey: "75c056adbb2b8b4afd19d556347037c7",
  nativeBannerSrc: "https://bauval.org/21/75c056adbb2b8b4afd19d556347037c7",

  banner300x250Key: "75e3902782cea0e1982bc5e43d3e7cfb",
  // OPTIONAL. Leave "" to use Adsterra's default banner address:
  //   https://www.highperformanceformat.com/<key>/invoke.js
  // If the banner stays blank, paste the exact link from
  // Adsterra > Banner 300x250 > code box (last line, the invoke.js one).
  // Either form works:
  //   "https://SOMEDOMAIN/75e3902782cea0e1982bc5e43d3e7cfb/invoke.js"
  //   '<script src="https://SOMEDOMAIN/75e3.../invoke.js"></script>'
  banner300x250Src: "" as string,

  smartlinkUrl: "https://araplhn.org/4/ac919a2f8bfdd8ea13c35d7f61d50d3c",

  socialBarSrc: "https://bauval.org/14/54394b71616ccf7df4a9086760b9e271",

  popunderSrc: "https://abscloud.org/1/f617c206a30a49a3a5a685a3735a06a2",
};

// ======================================================
// SHARED HELPERS
// ======================================================

function useAdScript(
  build: (host: HTMLElement) => void,
  parent: "self" | "body",
  deps: unknown[] = [],
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = parent === "self" ? ref.current : document.body;
    if (!host) return;

    const before = new Set<ChildNode>(Array.from(host.childNodes));
    build(host);

    return () => {
      if (parent === "self") {
        host.replaceChildren();
      } else {
        // Only remove nodes this component added to <body>
        Array.from(host.childNodes).forEach((node) => {
          if (!before.has(node)) host.removeChild(node);
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

function makeScript(src: string, async = true): HTMLScriptElement {
  const s = document.createElement("script");
  s.src = src;
  s.async = async;
  s.setAttribute("data-cfasync", "false");
  return s;
}

/**
 * Accepts a plain URL, a protocol-relative URL, or a whole
 * <script src="..."> line, and returns a clean https URL (or "").
 */
function normalizeScriptSrc(raw: string): string {
  const value = raw.trim();
  if (!value) return "";

  const match = value.match(/src\s*=\s*["']([^"']+)["']/i);
  let url = (match ? match[1] : value).trim();

  if (url.startsWith("//")) url = `https:${url}`;
  if (!/^https:\/\/[^\s"'<>]+$/i.test(url)) return "";
  return url;
}

// ======================================================
// 2. GOOGLE ADSENSE DISPLAY UNIT
//
// The main AdSense <script> is already in app/layout.tsx.
// This renders an actual ad slot. You get the slot ID in
// AdSense > Ads > By ad unit, AFTER your site is approved.
//
//   <AdSenseUnit slot="1234567890" />
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
  const active = ADS_CONFIG.enabled && ADS_CONFIG.adsense;

  useEffect(() => {
    if (!active || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error("AdSense error:", error);
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
// 3. ADSTERRA NATIVE BANNER (the 4-tile one)
//
//   <AdsterraNativeBanner />
// ======================================================

export function AdsterraNativeBanner({ className }: { className?: string }) {
  const active = ADS_CONFIG.enabled && ADS_CONFIG.adsterraNative;

  const ref = useAdScript(
    (host) => {
      if (!active) return;
      // Container first, then the script, so the script always finds it.
      const container = document.createElement("div");
      container.id = `container-${ADS_CONFIG.nativeBannerKey}`;
      host.append(container, makeScript(ADS_CONFIG.nativeBannerSrc));
    },
    "self",
    [active],
  );

  if (!active) return null;
  return <div ref={ref} className={className ?? "my-8"} />;
}

// ======================================================
// 4. ADSTERRA BANNER 300x250
//
// Rendered inside its own <iframe srcDoc>. Adsterra's invoke.js
// writes its markup with document.write(), which only works while
// a document is being parsed, so it gets its own tiny document.
//
// If banner300x250Src is empty, Adsterra's default banner address
// is built from the key, so the ad shows without extra setup.
//
//   <AdsterraBanner300x250 />
// ======================================================

export function AdsterraBanner300x250({ className }: { className?: string }) {
  const src =
    normalizeScriptSrc(ADS_CONFIG.banner300x250Src) ||
    `https://www.highperformanceformat.com/${ADS_CONFIG.banner300x250Key}/invoke.js`;

  const active = ADS_CONFIG.enabled && ADS_CONFIG.adsterraBanner;

  if (!active) return null;

  const options = JSON.stringify({
    key: ADS_CONFIG.banner300x250Key,
    format: "iframe",
    height: 250,
    width: 300,
    params: {},
  });

  const srcDoc =
    `<!doctype html><html><head><meta charset="utf-8">` +
    `<style>html,body{margin:0;padding:0;width:300px;height:250px;overflow:hidden;background:transparent}</style>` +
    `</head><body>` +
    `<script>var atOptions = ${options};</script>` +
    `<script data-cfasync="false" src="${src}"></script>` +
    `</body></html>`;

  return (
    <div className={className ?? "flex w-full justify-center"}>
      <iframe
        title="Advertisement"
        srcDoc={srcDoc}
        width={300}
        height={250}
        scrolling="no"
        style={{
          display: "block",
          border: 0,
          width: 300,
          height: 250,
          maxWidth: "100%",
        }}
      />
    </div>
  );
}

// ======================================================
// 5. ADSTERRA SMARTLINK
//
//   <AdsterraSmartlink>Sponsored</AdsterraSmartlink>
// ======================================================

export function AdsterraSmartlink({
  children = "Sponsored",
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  if (!(ADS_CONFIG.enabled && ADS_CONFIG.adsterraSmartlink)) return null;

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
// 6. ADSTERRA SOCIAL BAR
//
// Site-wide. Render ONCE in app/layout.tsx, inside <body>:
//   <AdsterraSocialBar />
// ======================================================

export function AdsterraSocialBar() {
  const active = ADS_CONFIG.enabled && ADS_CONFIG.adsterraSocialBar;

  useAdScript(
    (body) => {
      if (!active) return;
      body.appendChild(makeScript(ADS_CONFIG.socialBarSrc, false));
    },
    "body",
    [active],
  );

  return null;
}

// ======================================================
// 7. ADSTERRA POPUNDER
//
// Site-wide. Render ONCE in app/layout.tsx.
// OFF by default: popunders break AdSense policy.
//   <AdsterraPopunder />
// ======================================================

export function AdsterraPopunder() {
  const active = ADS_CONFIG.enabled && ADS_CONFIG.adsterraPopunder;

  useAdScript(
    (body) => {
      if (!active) return;
      body.appendChild(makeScript(ADS_CONFIG.popunderSrc, false));
    },
    "body",
    [active],
  );

  return null;
}

/**
 * ======================================================
 * WHERE TO PLACE WHAT (suggested)
 *
 * HOME PAGE
 *   - <AdsterraNativeBanner />     once, well below the fold
 *
 * ARTICLE PAGE
 *   - <AdSenseUnit slot="..." />   after ~2nd paragraph
 *   - <AdsterraNativeBanner />     after the article ends
 *
 * SIDEBAR / DESKTOP RAIL
 *   - <AdsterraBanner300x250 />
 *
 * FOOTER
 *   - <AdsterraSmartlink>Sponsored</AdsterraSmartlink>
 *
 * app/layout.tsx (inside <body>, once)
 *   - <AdsterraSocialBar />        only after AdSense approval
 *
 * NEVER place ads on: home page hero, About, Contact,
 * Privacy, Terms, sign-in / sign-up (Clerk) pages.
 * Never put AdSense and Adsterra directly next to each other.
 * ======================================================
 */