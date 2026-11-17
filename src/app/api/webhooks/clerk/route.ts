
import { ADMIN_EMAILS } from "@/lib/admin-emails";
import { CACHE_TAGS } from "@/lib/cache-keys";
import prisma from "@/lib/clients/prisma-client";
import { clerkClient, type WebhookEvent } from "@clerk/nextjs/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { Webhook } from "svix";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("[Clerk Webhook] Missing CLERK_WEBHOOK_SIGNING_SECRET");

    return new Response("Missing CLERK_WEBHOOK_SIGNING_SECRET", {
      status: 500,
    });
  }

  const headerPayload = await headers();

  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing Svix headers", { status: 400 });
  }

  // Read the raw body before signature verification.
  const payload = await req.text();

  const wh = new Webhook(WEBHOOK_SECRET);

  // ============================================================
  // 1. VERIFY CLERK WEBHOOK SIGNATURE
  // ============================================================

  try {
    wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch (error) {
    console.error("[Clerk Webhook] Verification failed:", error);

    return new Response("Invalid webhook signature", {
      status: 400,
    });
  }

  // ============================================================
  // 2. PARSE VERIFIED PAYLOAD
  // ============================================================

  let evt: WebhookEvent;

  try {
    evt = JSON.parse(payload) as WebhookEvent;
  } catch (error) {
    console.error("[Clerk Webhook] JSON parsing failed:", error);

    return new Response("Invalid JSON", { status: 400 });
  }

  const eventType = evt.type;

  try {
    switch (eventType) {
      // ========================================================
      // USER CREATED
      // ========================================================

      case "user.created": {
        const data = evt.data;

        const email =
          data.email_addresses?.find(
            (item) => item.id === data.primary_email_address_id,
          )?.email_address ??
          data.email_addresses?.[0]?.email_address ??
          null;

        if (!email) {
          console.warn(
            "[Clerk Webhook] User created without an email:",
            data.id,
          );

          break;
        }

        const normalizedEmail = email.toLowerCase();

        const role: "USER" | "ADMIN" = ADMIN_EMAILS.includes(
          normalizedEmail,
        )
          ? "ADMIN"
          : "USER";

        // 1. Create or synchronize the database user.
        const user = await prisma.user.upsert({
          where: {
            clerkId: data.id,
          },
          update: {
            firstName: data.first_name ?? null,
            lastName: data.last_name ?? null,
            email,
            imageUrl: data.image_url ?? null,
            role,
          },
          create: {
            clerkId: data.id,
            firstName: data.first_name ?? null,
            lastName: data.last_name ?? null,
            email,
            imageUrl: data.image_url ?? null,
            role,
          },
        });

        // 2. Automatically create or synchronize an Editor profile.
        if (role === "ADMIN") {
          const fullName =
            `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() ||
            email;

          await prisma.editor.upsert({
            where: {
              email,
            },
            update: {
              userId: user.id,
              name: fullName,
              imageUrl: data.image_url ?? null,
              isActive: true,
            },
            create: {
              userId: user.id,
              email,
              name: fullName,
              imageUrl: data.image_url ?? null,
              isActive: true,
            },
          });

          revalidateTag(CACHE_TAGS.editors, "max");
        }

        // 3. Invalidate user-related caches.
        revalidateTag(CACHE_TAGS.users, "max");
        revalidateTag(CACHE_TAGS.home, "max");

        // 4. Synchronize role into Clerk public metadata.
        try {
          const client = await clerkClient();

          await client.users.updateUserMetadata(data.id, {
            publicMetadata: {
              role,
            },
          });
        } catch (metaError) {
          console.error(
            "[Clerk Webhook] Failed to synchronize Clerk metadata:",
            data.id,
            metaError,
          );
        }

        console.log(
          "[Clerk Webhook] User created:",
          data.id,
          "Role:",
          role,
        );

        break;
      }

      // ========================================================
      // USER UPDATED
      // ========================================================

      case "user.updated": {
        const data = evt.data;

        const email =
          data.email_addresses?.find(
            (item) => item.id === data.primary_email_address_id,
          )?.email_address ??
          data.email_addresses?.[0]?.email_address ??
          null;

        await prisma.user.updateMany({
          where: {
            clerkId: data.id,
          },
          data: {
            firstName: data.first_name ?? null,
            lastName: data.last_name ?? null,
            ...(email ? { email } : {}),
            imageUrl: data.image_url ?? null,
          },
        });

        // Keep the linked Editor profile synchronized.
        if (email) {
          const fullName =
            `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() ||
            email;

          const updatedEditor = await prisma.editor.updateMany({
            where: {
              email,
            },
            data: {
              name: fullName,
              imageUrl: data.image_url ?? null,
            },
          });

          if (updatedEditor.count > 0) {
            revalidateTag(CACHE_TAGS.editors, "max");
          }
        }

        revalidateTag(CACHE_TAGS.users, "max");
        revalidatePath("/dashboard/users");

        console.log("[Clerk Webhook] User updated:", data.id);

        break;
      }

      // ========================================================
      // SESSION CREATED — LOGIN TRACKING
      // ========================================================

      case "session.created": {
        const data = evt.data;

        if (data.user_id) {
          const now = new Date();

          await prisma.user.updateMany({
            where: {
              clerkId: data.user_id,
            },
            data: {
              lastLoginAt: now,
              lastSeenAt: now,
            },
          });

          revalidateTag(CACHE_TAGS.users, "max");
          revalidatePath("/dashboard/users");

          console.log(
            "[Clerk Webhook] Login tracked:",
            data.user_id,
          );
        }

        break;
      }

      // ========================================================
      // USER DELETED — DELETE FROM DATABASE
      // ========================================================

      case "user.deleted": {
        const data = evt.data;

        if (!data.id) {
          console.warn(
            "[Clerk Webhook] User deleted event has no user ID.",
          );

          break;
        }

        // Find the corresponding database user.
        const existingUser = await prisma.user.findUnique({
          where: {
            clerkId: data.id,
          },
          select: {
            id: true,
            clerkId: true,
            email: true,
          },
        });

        // The webhook may be delivered more than once.
        // If the user is already deleted, treat it as successful.
        if (!existingUser) {
          console.log(
            "[Clerk Webhook] User already absent from database:",
            data.id,
          );

          break;
        }

        // Perform both database operations atomically.
        await prisma.$transaction(async (tx) => {
          // 1. Unlink and deactivate the Editor profile.
          // This preserves the Editor record and its articles.
          await tx.editor.updateMany({
            where: {
              userId: existingUser.id,
            },
            data: {
              userId: null,
              isActive: false,
            },
          });

          // 2. PERMANENTLY DELETE THE USER FROM THE DATABASE.
          await tx.user.delete({
            where: {
              id: existingUser.id,
            },
          });
        });

        // 3. Invalidate all relevant caches.
        revalidateTag(CACHE_TAGS.users, "max");
        revalidateTag(CACHE_TAGS.editors, "max");
        revalidateTag(CACHE_TAGS.home, "max");

        revalidatePath("/dashboard/users");
        revalidatePath("/dashboard/editors");

        console.log(
          "[Clerk Webhook] User permanently deleted from database:",
          data.id,
          existingUser.email,
        );

        break;
      }

      // ========================================================
      // IGNORE UNSUPPORTED EVENTS
      // ========================================================

      default: {
        console.log(
          "[Clerk Webhook] Ignored event:",
          eventType,
        );

        break;
      }
    }

    return Response.json({
      success: true,
      event: eventType,
    });
  } catch (error) {
    console.error(
      "[Clerk Webhook] Processing failed:",
      eventType,
      error,
    );

    return new Response("Webhook processing failed", {
      status: 500,
    });
  }
}
