// src/components/site/pages/article/article-actions.tsx
"use client";

import * as React from "react";
import { Share2, Link as LinkIcon, Check } from "lucide-react";

export function ArticleActions({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title, url });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button onClick={handleShare} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
        <Share2 className="size-4" /> Share
      </button>
      <button onClick={handleCopy} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
        {copied ? <Check className="size-4 text-green-600" /> : <LinkIcon className="size-4" />}
        {copied ? "Copied" : "Copy Link"}
      </button>
    </div>
  );
}