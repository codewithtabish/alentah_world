// src/proxy.ts
// ============================================================
// Clerk Middleware — ALENTAH WORLD
// Protects /admin/* and /dashboard/*
// ============================================================

import { clerkClient, clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// ============================================================
// HELPER — extract role from sessionClaims (handles string or object)
// ============================================================

function extractRole(sessionClaims: unknown): string | undefined {
  if (!sessionClaims || typeof sessionClaims !== "object") return undefined;

  const meta = (sessionClaims as { metadata?: unknown }).metadata;

  // Case 1: metadata is already an object
  if (meta && typeof meta === "object" && "role" in meta) {
    return (meta as { role?: string }).role;
  }

  // Case 2: metadata is a JSON string (common with custom claims)
  if (typeof meta === "string") {
    try {
      const parsed = JSON.parse(meta) as { role?: string };
      return parsed.role;
    } catch {
      return undefined;
    }
  }

  return undefined;
}

// ============================================================
// MIDDLEWARE
// ============================================================

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  const isProtectedRoute =
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/");

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Use auth() to get the user session
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  // Not signed in → Redirect to Clerk's sign-in flow
  // If you have a custom sign-in page at `/sign-in`, change this to:
  // return NextResponse.redirect(new URL("/sign-in", req.url));
  if (!userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // ─── Try fast path: role from session claims ───
  let role = extractRole(sessionClaims);

  // ─── Fallback: fetch from Clerk API ───
  if (!role) {
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      role = (user.publicMetadata as { role?: string } | undefined)?.role;
    } catch (err) {
      console.error("[proxy] Clerk API failed:", err);
    }
  }

  // Not admin → redirect home
  if (role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

// ============================================================
// MATCHER
// ============================================================

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};