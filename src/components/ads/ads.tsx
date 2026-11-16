
"use client";

import { useEffect, useRef, type ReactNode } from "react";

// ======================================================
// 1. ENEENA AD CONFIGURATION
// ======================================================

export const ADS_CONFIG = {
  // Set NEXT_PUBLIC_ADS_ENABLED=true to enable advertising.
  enabled: process.env.NEXT_PUBLIC_ADS_ENABLED === "true",

  // Keep only the verified native placement enabled initially.
  adsense: false,
  adsterraNative: true,
  adsterraBanner: false,
  adsterraSmartlink: false,
  adsterraSocialBar: false,
  adsterraPopunder: false,

  // Google AdSense
  adsenseClient: "ca-pub-7966396390181709",

  // Adsterra Native Banner
  nativeBannerKey: "75c056adbb2b8b4afd19d556347037c7",
  nativeBannerSrc:
    "https://bauval.org/21/75c056adbb2b8b4afd19d556347037c7",

  // Adsterra Banner 300x250
  banner300x250Key: "75e3902782cea0e1982bc5e43d3e7cfb",

  // Keep empty until you copy the exact invoke.js URL
  // from the Adsterra 300x250 ad-unit code.
  banner300x250Src: "",

  // Other formats remain disabled.
  smartlinkUrl:
    "https://araplhn.org/4/ac919a2f8bfdd8ea13c35d7f61d50d3c",

  socialBarSrc:
    "https://bauval.org/14/54394b71616ccf7df4a9086760b9e271",

  popunderSrc:
    "https://abscloud.org/1/f617c206a30a49a3a5a685a3735a06a2",
};

// ======================================================
// 2. HELPERS
// ======================================================

function normalizeScriptSrc(raw: string): string {
  const value = raw.trim();

  if (!value) return "";

  // Accept either a plain URL or an actual script element.
  const match = value.match(/src\s*=\s*["']([^"']+)["']/i);
  let url = (match ? match[1] : value).trim();

  if (url.startsWith("//")) {
    url = `https:${url}`;
  }

  try {
    const parsed = new URL(url);

    if (parsed.protocol !== "https:") return "";

    return parsed.href;
  } catch {
    return "";
  }
}

function makeScript(src: string, async = true) {
  const script = document.createElement("script");

  script.src = src;
  script.async = async;
  script.setAttribute("data-cfasync", "false");

  return script;
}

// ======================================================
// 3. GOOGLE ADSENSE
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
    ADS_CONFIG.enabled &&
    ADS_CONFIG.adsense &&
    Boolean(slot.trim());

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
// 4. ADSTERRA NATIVE BANNER
//
// Keep only ONE native banner instance per page.
// The container ID must match Adsterra's supplied code.
// ======================================================

export function AdsterraNativeBanner({
  className,
}: {
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  const active =
    ADS_CONFIG.enabled &&
    ADS_CONFIG.adsterraNative;

  useEffect(() => {
    if (!active) return;

    const host = hostRef.current;

    if (!host) return;

    const scriptUrl = normalizeScriptSrc(
      ADS_CONFIG.nativeBannerSrc
    );

    if (!scriptUrl) {
      console.error("ENEENA: Invalid native ad script URL.");
      return;
    }

    const container = document.createElement("div");

    container.id = `container-${ADS_CONFIG.nativeBannerKey}`;

    const script = makeScript(scriptUrl);

    // Adsterra expects the container before its script.
    host.appendChild(container);
    host.appendChild(script);

    return () => {
      script.remove();
      container.remove();
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={hostRef}
      className={className ?? "my-8 w-full"}
    />
  );
}

// ======================================================
// 5. ADSTERRA BANNER 300x250
//
// Disabled until the exact Adsterra script URL is supplied.
// ======================================================

export function AdsterraBanner300x250({
  className,
}: {
  className?: string;
}) {
  const active =
    ADS_CONFIG.enabled &&
    ADS_CONFIG.adsterraBanner;

  const scriptUrl = normalizeScriptSrc(
    ADS_CONFIG.banner300x250Src
  );

  if (!active || !scriptUrl) return null;

  const options = JSON.stringify({
    key: ADS_CONFIG.banner300x250Key,
    format: "iframe",
    height: 250,
    width: 300,
    params: {},
  });

  const srcDoc = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          html, body {
            margin: 0;
            padding: 0;
            width: 300px;
            height: 250px;
            overflow: hidden;
            background: transparent;
          }
        </style>
      </head>
      <body>
        <script>
          var atOptions = ${options};
        </script>
        <script
          data-cfasync="false"
          src="${scriptUrl}">
        </script>
      </body>
    </html>
  `;

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
// 6. ADSTERRA SMARTLINK
// ======================================================

export function AdsterraSmartlink({
  children = "Sponsored",
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  if (
    !ADS_CONFIG.enabled ||
    !ADS_CONFIG.adsterraSmartlink
  ) {
    return null;
  }

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
// 7. SITE-WIDE SCRIPT HELPER
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
// 8. ADSTERRA SOCIAL BAR
//
// Keep disabled. If enabled later, mount ONCE in root layout.
// ======================================================

export function AdsterraSocialBar() {
  const active =
    ADS_CONFIG.enabled &&
    ADS_CONFIG.adsterraSocialBar;

  useBodyAdScript(active, ADS_CONFIG.socialBarSrc);

  return null;
}

// ======================================================
// 9. ADSTERRA POPUNDER
//
// Keep disabled. If enabled later, mount ONCE in root layout.
// ======================================================

export function AdsterraPopunder() {
  const active =
    ADS_CONFIG.enabled &&
    ADS_CONFIG.adsterraPopunder;

  useBodyAdScript(active, ADS_CONFIG.popunderSrc);

  return null;
}
