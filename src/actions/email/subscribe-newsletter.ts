// src/actions/email/subscribe-newsletter.ts
"use server";

import { Resend } from "resend";
import prisma from "@/lib/clients/prisma-client";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function subscribeNewsletter(email: string) {
  try {
    if (!email || !email.includes("@")) {
      return { success: false, error: "Please enter a valid email address." };
    }

    // 1. Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.status === "SUBSCRIBED") {
        return { success: false, error: "You are already subscribed!" };
      }
      // If they were unsubscribed, re-activate them
      await prisma.newsletterSubscriber.update({
        where: { email },
        data: {
          status: "SUBSCRIBED",
          subscribedAt: new Date(),
          unsubscribedAt: null,
        },
      });
    } else {
      // 2. Create new subscriber
      await prisma.newsletterSubscriber.create({
        data: {
          email,
          status: "SUBSCRIBED",
          subscribedAt: new Date(),
        },
      });
    }

    // 3. Send Welcome Email
    const userEmailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #171515;">
        <h2 style="color: #5E1428; text-align: center;">Welcome to The ENEENA Briefing</h2>
        <p>Hello,</p>
        <p>Thank you for subscribing to The ENEENA Briefing. You are now part of a community that values thoughtful journalism and important perspectives.</p>
        <p>Expect a considered selection of stories, delivered directly to your inbox. No unnecessary noise.</p>
        <p style="margin-top: 30px; font-size: 12px; color: #77716A; text-align: center;">
          This is an automated message from ENEENA. Please do not reply directly to this email.
        </p>
      </div>
    `;

    await resend.emails.send({
      from: "The ENEENA Briefing <hello@eneena.com>",
      to: [email],
      subject: "Welcome to The ENEENA Briefing",
      html: userEmailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error("Newsletter subscription failed:", error);
    return { success: false, error: "Failed to subscribe. Please try again later." };
  }
}