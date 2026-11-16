// src/components/site/pages/article/save-button.tsx
"use client";

import { useState, useTransition } from "react";
import { Bookmark, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useUser, useClerk } from "@clerk/nextjs";
import { toggleSavedAction } from "@/actions/articles/toggle-saved";

export function SaveButton({ 
  blogId, 
  blogSlug, 
  initialIsSaved 
}: { 
  blogId: string; 
  blogSlug: string; 
  initialIsSaved: boolean;
}) {
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    // 1. If not signed in, prompt them to log in
    if (!isSignedIn) {
      openSignIn({
        forceRedirectUrl: `/${window.location.pathname}`,
      });
      return;
    }

    // 2. Instant UI update (Optimistic)
    setIsSaved((prev) => !prev);

    // 3. Run the server action in the background
    startTransition(async () => {
      const res = await toggleSavedAction(blogId, blogSlug);
      
      if (res.success) {
        toast.success(res.isSaved ? "Saved to your collection" : "Removed from saved");
      } else {
        // Revert if it failed
        setIsSaved(initialIsSaved);
        toast.error(res.error || "Failed to save");
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50",
        isSaved && "bg-primary/5 text-primary border-primary/20"
      )}
      aria-label={isSaved ? "Remove from saved" : "Save article"}
    >
      {isPending ? (
        <LoaderCircle className="size-4 animate-spin" />
      ) : (
        <Bookmark
          className="size-4"
          fill={isSaved ? "currentColor" : "none"}
        />
      )}
      {isSaved ? "Saved" : "Save"}
    </button>
  );
}