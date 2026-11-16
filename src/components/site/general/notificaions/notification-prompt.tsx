// src/components/notifications/notification-prompt.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, BellOff, Check, Loader2, X } from "lucide-react";
import { savePushSubscription } from "@/actions/notifications/save-subscription";
import { isPushSupported, subscribeAndSave } from "@/lib/clients/client";

type Status = "hidden" | "prompt" | "loading" | "success" | "blocked" | "error";

/* ----------------------------- Timing rules ----------------------------- */

// Time the tab must be actually visible before we ever show anything
const MIN_DWELL_SECONDS = 20;
// If the user never scrolls, show after this much visible time
const MAX_DWELL_SECONDS = 45;
// Scroll progress that counts as "engaged"
const ENGAGEMENT_SCROLL = 0.25;
// Gap that counts as a new visit
const SESSION_GAP_MS = 30 * 60 * 1000;

// After "Not now": visits + days required before asking again
const REPROMPT_RULES = [
  { visits: 3, days: 2 },
  { visits: 5, days: 7 },
];
const MAX_DISMISSALS = REPROMPT_RULES.length + 1;

// After the browser permission is DENIED: show our help modal again
const DENIED_RULES = [
  { visits: 3, days: 3 },
  { visits: 6, days: 14 },
];
const MAX_DENIED_PROMPTS = DENIED_RULES.length;

const STORAGE_KEY = "alentah-push-prompt-v3";
const DAY_MS = 24 * 60 * 60 * 1000;

/* ------------------------------- Storage -------------------------------- */

type PromptState = {
  // "Not now" tracking
  dismissCount: number;
  visitsSinceDismiss: number;
  lastDismissAt: number;
  // Browser-denied tracking
  deniedAt: number;
  deniedShownCount: number;
  visitsSinceDeniedShown: number;
  lastDeniedShownAt: number;
  // Visit tracking
  lastVisitAt: number;
};

const EMPTY_STATE: PromptState = {
  dismissCount: 0,
  visitsSinceDismiss: 0,
  lastDismissAt: 0,
  deniedAt: 0,
  deniedShownCount: 0,
  visitsSinceDeniedShown: 0,
  lastDeniedShownAt: 0,
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

/* ------------------------------ Component ------------------------------- */

export default function NotificationPrompt() {
  const [status, setStatus] = useState<Status>("hidden");
  const [visible, setVisible] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const show = useCallback((next: Status) => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setStatus(next);
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }, []);

  const hide = useCallback(() => {
    setVisible(false);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setStatus("hidden"), 350);
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  /* ----------------------- Decide if / when to show ----------------------- */

  useEffect(() => {
    if (!isPushSupported()) return;

    // Already granted: make sure the subscription is saved, silently
    if (Notification.permission === "granted") {
      subscribeAndSave().catch(() => {});
      return;
    }

    const permission = Notification.permission; // "default" | "denied"
    const state = readState();
    const now = Date.now();
    const isNewVisit = now - state.lastVisitAt > SESSION_GAP_MS;

    if (permission === "denied" && !state.deniedAt) {
      state.deniedAt = now;
      state.lastDeniedShownAt = now; // start the cooldown from first detection
    }

    if (isNewVisit) {
      if (permission === "default" && state.dismissCount > 0) {
        state.visitsSinceDismiss += 1;
      }
      if (permission === "denied") {
        state.visitsSinceDeniedShown += 1;
      }
    }
    state.lastVisitAt = now;
    writeState(state);

    let mode: "prompt" | "blocked" | null = null;

    if (permission === "default") {
      if (state.dismissCount >= MAX_DISMISSALS) return;
      if (state.dismissCount > 0) {
        const rule = REPROMPT_RULES[state.dismissCount - 1];
        const daysPassed = (now - state.lastDismissAt) / DAY_MS;
        if (state.visitsSinceDismiss < rule.visits || daysPassed < rule.days) {
          return;
        }
      }
      mode = "prompt";
    } else {
      if (state.deniedShownCount >= MAX_DENIED_PROMPTS) return;
      const rule = DENIED_RULES[state.deniedShownCount];
      const daysPassed = (now - state.lastDeniedShownAt) / DAY_MS;
      if (state.visitsSinceDeniedShown < rule.visits || daysPassed < rule.days) {
        return;
      }
      mode = "blocked";
    }

    // Engagement: count only time the tab is actually visible
    let triggered = false;
    let seconds = 0;
    let scrolled = false;

    const check = () => {
      if (triggered) return;
      if (seconds < MIN_DWELL_SECONDS) return;
      if (scrolled || seconds >= MAX_DWELL_SECONDS) trigger();
    };

    const interval = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      seconds += 1;
      check();
    }, 1000);

    const onScroll = () => {
      const doc = document.documentElement;
      const progress = (window.scrollY + window.innerHeight) / doc.scrollHeight;
      if (window.scrollY > 200 && progress >= ENGAGEMENT_SCROLL) {
        scrolled = true;
        check();
      }
    };

    const cleanup = () => {
      clearInterval(interval);
      window.removeEventListener("scroll", onScroll);
    };

    const trigger = () => {
      if (triggered) return;
      triggered = true;
      cleanup();

      if (mode === "blocked") {
        const s = readState();
        writeState({
          ...s,
          deniedShownCount: s.deniedShownCount + 1,
          visitsSinceDeniedShown: 0,
          lastDeniedShownAt: Date.now(),
        });
      }
      show(mode as Status);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return cleanup;
  }, [show]);

  /* ------------------------------- Actions -------------------------------- */

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

  const handleEnable = async () => {
    setStatus("loading");
    try {
      const registration = await navigator.serviceWorker.register("/notification-sw.js");
      const permission =
        Notification.permission === "granted"
          ? "granted"
          : await Notification.requestPermission();

      if (permission === "granted") {
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        });

        // Instantly show success, save in the background
        setStatus("success");
        setTimeout(hide, 2500);

        savePushSubscription(subscription.toJSON()).catch((err) => {
          console.error("Background save error:", err);
        });
      } else if (permission === "denied") {
        const s = readState();
        const now = Date.now();
        writeState({
          ...s,
          deniedAt: now,
          lastDeniedShownAt: now,
          visitsSinceDeniedShown: 0,
        });
        setStatus("blocked");
      } else {
        dismiss();
      }
    } catch (e) {
      console.error("[NotificationPrompt]", e);
      setStatus("error");
    }
  };

  // "I've enabled it" from the blocked modal
  const handleRecheck = async () => {
    if (Notification.permission === "granted") {
      await handleEnable();
    } else {
      setStatus("blocked");
      setVisible(false);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    }
  };

  const closeCurrent = useCallback(() => {
    if (status === "prompt" || status === "error") dismiss();
    else hide();
  }, [status, dismiss, hide]);

  useEffect(() => {
    if (status === "hidden" || status === "loading") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCurrent();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [status, closeCurrent]);

  if (status === "hidden") return null;

  /* -------------------------------- Copy ---------------------------------- */

  const isBlocked = status === "blocked";
  const isSuccess = status === "success";
  const isError = status === "error";
  const isAsking = status === "prompt" || status === "loading" || isError;

  const title = isSuccess
    ? "You're all set"
    : isBlocked
      ? "Notifications are turned off"
      : isError
        ? "Something went wrong"
        : "Stay ahead of the story";

  const description = isSuccess
    ? "We'll alert you the moment a new article is published."
    : isBlocked
      ? "You blocked notifications earlier. You can switch them back on in a few seconds."
      : isError
        ? "We couldn't turn on notifications. Please try again."
        : "Get a quick alert when we publish something important. Nothing else, and you can turn it off anytime.";

  const benefits = ["Breaking stories, first", "Only new articles, never spam", "Turn off anytime"];

  const blockedSteps = [
    "Tap the lock or settings icon beside the address bar",
    "Open Site settings and find Notifications",
    "Choose Allow, then come back and tap below",
  ];

  /* -------------------------------- Render -------------------------------- */

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-live="polite"
      aria-label="Notification settings"
      className="fixed inset-0 z-100 flex items-end justify-center sm:items-center"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={closeCurrent}
        disabled={status === "loading"}
        className={`absolute inset-0 cursor-default bg-foreground/40 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Sheet / Card */}
      <div
        className={`relative w-full overflow-hidden rounded-t-3xl border border-border bg-card text-card-foreground shadow-2xl transition-all duration-300 ease-out motion-reduce:transition-none sm:max-w-md sm:rounded-3xl ${
          visible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-8 scale-95 opacity-0"
        }`}
      >
        <div className="h-1 w-full bg-primary" />

        <button
          type="button"
          onClick={closeCurrent}
          disabled={status === "loading"}
          aria-label="Close"
          className="absolute right-3 top-4 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline focus-visible:outline-ring disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center sm:p-8">
          {/* Icon */}
          <div className="relative mb-5">
            <span
              aria-hidden
              className={`absolute inset-0 rounded-full ${
                isAsking && !isError ? "animate-ping bg-primary/20" : ""
              } motion-reduce:animate-none`}
            />
            <div
              className={`relative flex h-16 w-16 items-center justify-center rounded-full ${
                isError
                  ? "bg-destructive/10 text-destructive"
                  : isSuccess || isBlocked
                    ? "bg-primary/10 text-primary"
                    : "bg-primary text-primary-foreground"
              }`}
            >
              {isSuccess ? (
                <Check className="h-7 w-7" strokeWidth={2.5} />
              ) : isBlocked ? (
                <BellOff className="h-7 w-7" />
              ) : (
                <Bell className="h-7 w-7" />
              )}
            </div>
          </div>

          <h2 className="text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
            {title}
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>

          {/* Benefits */}
          {status === "prompt" && (
            <ul className="mt-5 flex w-full flex-col gap-2 text-left">
              {benefits.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Blocked steps */}
          {isBlocked && (
            <ol className="mt-5 flex w-full flex-col gap-2 text-left">
              {blockedSteps.map((step, i) => (
                <li key={step} className="flex items-start gap-3 text-sm">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  <span className="text-foreground">{step}</span>
                </li>
              ))}
            </ol>
          )}

          {/* Actions */}
          {isAsking && (
            <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleEnable}
                disabled={status === "loading"}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-70"
              >
                {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
                {isError ? "Try again" : "Turn on notifications"}
              </button>
              <button
                type="button"
                onClick={dismiss}
                disabled={status === "loading"}
                className="inline-flex h-12 flex-1 items-center justify-center rounded-xl px-5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50"
              >
                Not now
              </button>
            </div>
          )}

          {isBlocked && (
            <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleRecheck}
                className="inline-flex h-12 flex-1 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                I've enabled it
              </button>
              <button
                type="button"
                onClick={hide}
                className="inline-flex h-12 flex-1 items-center justify-center rounded-xl px-5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Maybe later
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}