// src/lib/admin-emails.ts

// Emails in this list are automatically made ADMIN on first sign-up.
// Keep entries lowercase — comparisons are case-insensitive via .toLowerCase().
export const ADMIN_EMAILS: string[] = [
  // 👇 ENEENA Branded Admin Accounts
    "kashisultan099@gmail.com",
  "hello@eneena.com",
  "admin@eneena.com",
  "editor@eneena.com",
  "support@eneena.com",
].map((e) => e.toLowerCase());