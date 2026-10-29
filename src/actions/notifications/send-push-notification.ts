// src/actions/notifications/send-push-notification.ts
"use server";

import webpush from "web-push";
import prisma from "@/lib/clients/prisma-client";

const BATCH_SIZE = 50;

function configureWebPush() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) {
    throw new Error("VAPID keys are missing from environment variables.");
  }
  webpush.setVapidDetails("mailto:contact@alentah.com", publicKey, privateKey);
}

export async function sendPushNotificationToAll({
  title,
  body,
  url,
}: {
  title: string;
  body: string;
  url: string;
}) {
  try {
    configureWebPush();

    const subscriptions = await prisma.pushSubscription.findMany();
    if (subscriptions.length === 0) {
      return { success: true, count: 0, failed: 0 };
    }

    const payload = JSON.stringify({ title, body, url });
    const expiredIds: string[] = [];
    let successCount = 0;
    let failCount = 0;

    // Send in parallel batches instead of one-by-one
    for (let i = 0; i < subscriptions.length; i += BATCH_SIZE) {
      const batch = subscriptions.slice(i, i + BATCH_SIZE);

      const results = await Promise.allSettled(
        batch.map((sub) =>
          webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            payload,
            { TTL: 60 * 60 * 24, urgency: "normal" }
          )
        )
      );

      results.forEach((result, idx) => {
        if (result.status === "fulfilled") {
          successCount++;
        } else {
          failCount++;
          const code = (result.reason as { statusCode?: number })?.statusCode;
          if (code === 404 || code === 410) expiredIds.push(batch[idx].id);
        }
      });
    }

    // Clean up dead subscriptions in one query
    if (expiredIds.length > 0) {
      await prisma.pushSubscription.deleteMany({ where: { id: { in: expiredIds } } });
    }

    return { success: true, count: successCount, failed: failCount };
  } catch (error) {
    console.error("[sendPushNotificationToAll] Error:", error);
    return { success: false, error: "Failed to send notifications." };
  }
}