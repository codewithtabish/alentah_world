"use client";

import Image from "next/image";
import { useState } from "react";

// Tiny inline placeholder: shows instantly while the real image loads.
const BLUR = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="9" viewBox="0 0 16 9"><rect width="16" height="9" fill="#888" fill-opacity="0.35"/></svg>`,
)}`;

type BannerImageProps = {
  src?: string | null;
  alt: string;
  /** Set to false if this banner is not at the top of the page. */
  priority?: boolean;
};

export function BannerImage({ src, alt, priority = true }: BannerImageProps) {
  // Remember WHICH src failed, so a new src gets a fresh try (no reset code needed).
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = !src || failedSrc === src;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted lg:aspect-21/9">
      {!failed ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          quality={75}
          sizes="(min-width: 1280px) 1152px, 100vw"
          placeholder="blur"
          blurDataURL={BLUR}
          onError={() => setFailedSrc(src)}
          className="object-cover"
        />
      ) : (
        // Fallback when there is no image or it failed to load
        <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-muted to-primary/10" />
      )}
    </div>
  );
}