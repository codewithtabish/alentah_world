// src/components/site/pages/home/newsletter-form.tsx
"use client";

import { useState } from "react";
import { Mail, ArrowRight, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { subscribeNewsletter } from "@/actions/email/subscribe-newsletter";
import { cn } from "@/lib/utils";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsPending(true);
    const res = await subscribeNewsletter(email);
    setIsPending(false);

    if (res.success) {
      toast.success("Successfully subscribed to the briefing!");
      setEmail("");
    } else {
      toast.error(res.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg">
      <label htmlFor="email" className="mb-3 block text-xs font-bold uppercase tracking-widest text-foreground/80">
        Your Email Address
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Mail className="absolute inset-s-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
            required
            className="w-full rounded-md border border-border bg-background py-3.5 ps-11 pe-4 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-12.5 shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-70"
        >
          {isPending ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <>
              Subscribe <ArrowRight className="size-4" />
            </>
          )}
        </button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        A considered selection of stories. No unnecessary noise.
      </p>
    </form>
  );
}