// src/actions/notifications/save-subscription.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { after } from "next/server"; // 👈 Imported here
import prisma from "@/lib/clients/prisma-client";

export type SaveSubscriptionResult =
  | { success: true; message: string }
  | { success: false; error: string };

type BrowserSubscription = {
  endpoint?: string;
  keys?: { p256dh?: string; auth?: string };
};

export async function savePushSubscription(
  subscription: BrowserSubscription
): Promise<SaveSubscriptionResult> {
  try {
    // 1. Validate first
    const endpoint = subscription?.endpoint;
    const p256dh = subscription?.keys?.p256dh;
    const authKey = subscription?.keys?.auth;

    if (!endpoint || !p256dh || !authKey) {
      return { success: false, error: "Invalid subscription data provided by the browser." };
    }

    // 2. Return success IMMEDIATELY to the client so UI is lightning fast
    // and do the database work in the background.
    after(async () => {
      try {
        const { userId: clerkId } = await auth();
        let dbUserId: string | null = null;

        if (clerkId) {
          const user = await prisma.user.findUnique({
            where: { clerkId },
            select: { id: true },
          });
          dbUserId = user?.id ?? null;
        }

        await prisma.pushSubscription.upsert({
          where: { endpoint },
          create: {
            userId: dbUserId,
            endpoint,
            p256dh,
            auth: authKey,
            isAnonymous: !dbUserId,
          },
          update: {
            p256dh,
            auth: authKey,
            ...(dbUserId ? { userId: dbUserId, isAnonymous: false } : {}),
          },
        });
        console.log("[savePushSubscription] Background save successful.");
      } catch (dbError) {
        console.error("[savePushSubscription] Background DB Error:", dbError);
      }
    });

    return { success: true, message: "Subscription processing in background." };
  } catch (error) {
    console.error("[savePushSubscription] Error:", error);
    return { success: false, error: "Failed to process subscription." };
  }
}