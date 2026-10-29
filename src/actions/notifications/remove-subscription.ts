// src/actions/notifications/remove-subscription.ts
"use server";

import { after } from "next/server";
import prisma from "@/lib/clients/prisma-client";

export async function removePushSubscription(endpoint: string) {
  try {
    if (!endpoint) return { success: false };

    // 👇 Delete in the background so the UI is instantly responsive
    after(async () => {
      try {
        await prisma.pushSubscription.deleteMany({ where: { endpoint } });
        console.log("[removePushSubscription] Deleted in background.");
      } catch (error) {
        console.error("[removePushSubscription] Background DB Error:", error);
      }
    });

    return { success: true };
  } catch (error) {
    console.error("[removePushSubscriptions] Error:", error);
    return { success: false };
  }
}