// src/lib/push/client.ts
import { removePushSubscription } from "@/actions/notifications/remove-subscription";
import { savePushSubscription } from "@/actions/notifications/save-subscription";

const SW_PATH = "/notification-sw.js";
const ENDPOINT_KEY = "alentah-push-endpoint";

export function isPushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

async function getRegistration() {
  await navigator.serviceWorker.register(SW_PATH, { scope: "/" });
  return navigator.serviceWorker.ready;
}

/** Subscribes this browser (permission must already be granted) and saves it. */
export async function subscribeAndSave(): Promise<boolean> {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!publicKey) throw new Error("Missing NEXT_PUBLIC_VAPID_PUBLIC_KEY");

  const registration = await getRegistration();

  const subscription =
    (await registration.pushManager.getSubscription()) ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
    }));

  const result = await savePushSubscription(subscription.toJSON());

  if (result.success) {
    try {
      // Remember the endpoint: after a block, the browser may no longer
      // give it back, but we still need it to delete the row from the DB.
      localStorage.setItem(ENDPOINT_KEY, subscription.endpoint);
    } catch {}
  }

  return result.success;
}

/** Asks for permission, then subscribes. Returns the final permission state. */
export async function enableNotifications(): Promise<NotificationPermission> {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    const ok = await subscribeAndSave();
    if (!ok) throw new Error("Could not save subscription");
  }
  return permission;
}

/** Permission is no longer granted: remove the subscription from the DB. */
export async function cleanupStaleSubscription(): Promise<void> {
  let endpoint: string | null = null;

  try {
    endpoint = localStorage.getItem(ENDPOINT_KEY);
  } catch {}

  const registration = await navigator.serviceWorker.getRegistration();
  const subscription = await registration?.pushManager.getSubscription();

  endpoint = subscription?.endpoint ?? endpoint;
  if (!endpoint) return; // nothing was ever saved from this browser

  await removePushSubscription(endpoint);
  await subscription?.unsubscribe().catch(() => {});

  try {
    localStorage.removeItem(ENDPOINT_KEY);
  } catch {}
}

/**
 * Listens while the site is open. If the user turns notifications off
 * (or back on) from the browser's site settings, the DB is updated right away.
 * Returns a function that stops listening.
 */
export function watchPermissionChanges(): () => void {
  let status: PermissionStatus | null = null;
  let cancelled = false;

  const onChange = () => {
    if (!status) return;
    if (status.state === "granted") {
      subscribeAndSave().catch(() => {}); // turned back on
    } else {
      cleanupStaleSubscription().catch(() => {}); // blocked or reset
    }
  };

  navigator.permissions
    ?.query({ name: "notifications" as PermissionName })
    .then((s) => {
      if (cancelled) return;
      status = s;
      s.addEventListener("change", onChange);
    })
    .catch(() => {});

  return () => {
    cancelled = true;
    status?.removeEventListener("change", onChange);
  };
}