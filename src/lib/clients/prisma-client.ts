// src/lib/clients/prisma-client.ts
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function getConnectionString() {
  const raw = process.env.DATABASE_URL;
  if (!raw) throw new Error("DATABASE_URL is missing. Check your .env file.");

  // Remove sslmode so it doesn't override the explicit ssl option below.
  // (The Prisma CLI for migrations still reads it from .env.)
  const url = new URL(raw);
  url.searchParams.delete("sslmode");
  return url.toString();
}

const adapter = new PrismaPg({
  connectionString: getConnectionString(),
  ssl: { rejectUnauthorized: false }, // encrypted, certificate not verified
  max: 5,
});

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;