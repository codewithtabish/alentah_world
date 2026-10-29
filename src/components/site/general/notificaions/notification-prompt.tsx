// src/components/notifications/notification-prompt.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { Bell, Check, Loader2, X } from "lucide-react";
// 👇 Import your server actions
import { savePushSubscription } from "@/actions/notifications/save-subscription";
import { isPushSupported, subscribeAndSave } from "@/lib/clients/client";

type Status = "hidden" | "prompt" | "loading" | "success" | "blocked" | "error";

const ENGAGEMENT_DELAY_MS = 8000;
const ENGAGEMENT_SCROLL = 0.35;
const SESSION_GAP_MS = 30 * 60 * 1000;

const REPROMPT_RULES = [
  { visits: 3, days: 2 },
  { visits: 5, days: 7 },
];
const MAX_DISMISSALS = REPROMPT_RULES.length + 1;

const STORAGE_KEY = "alentah-push-prompt-v2";
const DAY_MS = 24 * 60 * 60 * 1000;

type PromptState = {
  dismissCount: number;
  visitsSinceDismiss: number;
  lastDismissAt: number;
  lastVisitAt: number;
};

const EMPTY_STATE: PromptState = {
  dismissCount: 0,
  visitsSinceDismiss: 0,
  lastDismissAt: 0,
  lastVisitAt: 0,
};

function readState(): PromptState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...EMPTY_STATE, ...JSON.parse(raw) };
  } catch {}
  return { ...EMPTY_STATE };
}

function writeState(state: PromptState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export default function NotificationPrompt() {
  const [status, setStatus] = useState<Status>("hidden");
  const [visible, setVisible] = useState(false);

  const show = useCallback((next: Status) => {
    setStatus(next);
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const hide = useCallback(() => {
    setVisible(false);
    setTimeout(() => setStatus("hidden"), 300);
  }, []);

  useEffect(() => {
    if (!isPushSupported()) return;

    // If already granted, ensure it's saved in the background
    if (Notification.permission === "granted") {
      subscribeAndSave().catch(() => {});
      return;
    }

    if (Notification.permission === "denied") return;

    const state = readState();
    const now = Date.now();
    const isNewVisit = now - state.lastVisitAt > SESSION_GAP_MS;

    if (isNewVisit && state.dismissCount > 0) {
      state.visitsSinceDismiss += 1;
    }
    state.lastVisitAt = now;
    writeState(state);

    if (state.dismissCount >= MAX_DISMISSALS) return;

    if (state.dismissCount > 0) {
      const rule = REPROMPT_RULES[state.dismissCount - 1];
      const daysPassed = (now - state.lastDismissAt) / DAY_MS;
      if (state.visitsSinceDismiss < rule.visits || daysPassed < rule.days) {
        return;
      }
    }

    let triggered = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const onScroll = () => {
      if (window.scrollY < 200) return;
      const doc = document.documentElement;
      const progress = (window.scrollY + window.innerHeight) / doc.scrollHeight;
      if (progress >= ENGAGEMENT_SCROLL) trigger();
    };

    const cleanup = () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };

    const trigger = () => {
      if (triggered) return;
      triggered = true;
      cleanup();
      show("prompt");
    };

    timer = setTimeout(trigger, ENGAGEMENT_DELAY_MS);
    window.addEventListener("scroll", onScroll, { passive: true });

    return cleanup;
  }, [show]);

  const dismiss = useCallback(() => {
    const state = readState();
    writeState({
      ...state,
      dismissCount: state.dismissCount + 1,
      visitsSinceDismiss: 0,
      lastDismissAt: Date.now(),
    });
    hide();
  }, [hide]);

  // 👇 THE FAST ENABLE LOGIC
  const handleEnable = async () => {
    setStatus("loading");
    try {
      const registration = await navigator.serviceWorker.register("/notification-sw.js");
      const permission = await Notification.requestPermission();
      
      if (permission === "granted") {
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        });
        
        // 1. Instantly show success to user
        setStatus("success");
        setTimeout(hide, 2500);

        // 2. Save to DB in the background (UI is already done)
        savePushSubscription(subscription.toJSON()).catch((err) => {
          console.error("Background save error:", err);
        });

      } else if (permission === "denied") {
        setStatus("blocked");
      } else {
        dismiss();
      }
    } catch (e) {
      console.error("[NotificationPrompt]", e);
      setStatus("error");
    }
  };

  useEffect(() => {
    if (status !== "prompt" && status !== "error") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [status, dismiss]);

  if (status === "hidden") return null;

  const isAsking = status === "prompt" || status === "loading" || status === "error";

  const title =
    status === "success"
      ? "You're all set!"
      : status === "blocked"
        ? "Notifications are blocked"
        : status === "error"
          ? "Something went wrong"
          : "Never miss a new article";

  const description =
    status === "success"
      ? "We'll let you know as soon as a new article is published."
      : status === "blocked"
        ? "Allow notifications for this site in your browser settings, then try again."
        : status === "error"
          ? "We couldn't turn on notifications. Please try again."
          : "Get a quick alert when we publish something new. You can turn it off anytime in your browser settings.";

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Notification settings"
      className={`pointer-events-none fixed inset-x-0 top-[max(0.75rem,env(safe-area-inset-top))] z-100 flex justify-center px-3 transition-all duration-300 ease-out motion-reduce:transition-none ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"
      }`}
    >
      <div className="pointer-events-auto relative w-full max-w-136 overflow-hidden rounded-2xl border border-[#6b1d2e]/15 bg-[#faf7f2] shadow-[0_16px_48px_-16px_rgba(107,29,46,0.4)]">
        <div className="h-1 w-full bg-[#6b1d2e]" />

        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                status === "success"
                  ? "bg-emerald-100 text-emerald-600"
                  : status === "blocked" || status === "error"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-[#6b1d2e] text-white"
              }`}
            >
              {status === "success" ? (
                <Check className="h-5 w-5" strokeWidth={2.5} />
              ) : (
                <Bell className="h-5 w-5" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold leading-snug text-[#2a1218]">
                {title}
              </p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-[#2a1218]/70">
                {description}
              </p>
            </div>

            {!isAsking && (
              <button
                type="button"
                onClick={hide}
                aria-label="Close"
                className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#2a1218]/50 transition hover:bg-[#6b1d2e]/10 hover:text-[#2a1218] focus-visible:outline focus-visible:outline-[#6b1d2e]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {isAsking && (
            <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0 sm:items-center">
              <button
                type="button"
                onClick={dismiss}
                disabled={status === "loading"}
                className="inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium text-[#2a1218]/75 transition hover:bg-[#6b1d2e]/10 hover:text-[#2a1218] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#6b1d2e] disabled:opacity-50"
              >
                Not now
              </button>
              <button
                type="button"
                onClick={handleEnable}
                disabled={status === "loading"}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#6b1d2e] px-5 text-sm font-semibold text-white transition hover:bg-[#561624] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#6b1d2e] disabled:opacity-70"
              >
                {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
                {status === "error" ? "Try again" : "Turn on"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}