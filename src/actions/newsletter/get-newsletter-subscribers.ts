// src/actions/newsletter/get-newsletter-subscribers.ts
"use server";

import { cacheTag, cacheLife } from "next/cache";
import prisma from "@/lib/clients/prisma-client";
import { CACHE_TAGS } from "@/lib/cache-keys";

type GetSubscribersParams = {
  search?: string;
  status?: "ALL" | "SUBSCRIBED" | "UNSUBSCRIBED" | "PENDING";
  page?: number;
  limit?: number;
};

// 👇 ADD THIS STRICT RETURN TYPE
export type NewsletterSubscribersResult =
  | {
      success: true;
      subscribers: any[]; // You can import the Prisma NewsletterSubscriber type here if you want
      totalCount: number;
      totalPages: number;
    }
  | {
      success: false;
      error: string;
    };

export async function getNewsletterSubscribers({
  search = "",
  status = "ALL",
  page = 1,
  limit = 20,
}: GetSubscribersParams = {}): Promise<NewsletterSubscribersResult> { // 👈 APPLIED HERE
  try {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.email = { contains: search, mode: "insensitive" };
    }
    if (status !== "ALL") {
      where.status = status;
    }

    const fetchData = async () => {
      "use cache";
      cacheLife("max");
      cacheTag(CACHE_TAGS.newsletterSubscribers);

      const [subscribers, totalCount] = await Promise.all([
        prisma.newsletterSubscriber.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.newsletterSubscriber.count({ where }),
      ]);

      return {
        subscribers,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      };
    };

    const data = await fetchData();

    return {
      success: true,
      ...data,
    };
  } catch (error) {
    console.error("[getNewsletterSubscribers]", error);
    return { success: false, error: "Failed to load subscribers." };
  }
}