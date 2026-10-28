"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

const BLUR = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="9" viewBox="0 0 16 9"><rect width="16" height="9" fill="#d4d4d8"/></svg>`,
)}`;

export function BannerImage({ src, alt }: { src?: string | null; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted lg:aspect-21/9">
      {src && !failed ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority
          fetchPriority="high"
          quality={75}
          sizes="(min-width: 1152px) 1152px, 100vw"
          placeholder="blur"
          blurDataURL={BLUR}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            "object-cover transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-muted to-primary/10" />
      )}
    </div>
  );
}