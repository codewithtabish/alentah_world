import "dotenv/config";
import prisma from "@/lib/clients/prisma-client";

const languages = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    direction: "LTR" as const,
    isActive: true,
    isDefault: true,
    sortOrder: 1,
  },
  {
    code: "ur",
    name: "Urdu",
    nativeName: "اردو",
    direction: "RTL" as const,
    isActive: true,
    isDefault: false,
    sortOrder: 2,
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    direction: "RTL" as const,
    isActive: true,
    isDefault: false,
    sortOrder: 3,
  },
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    direction: "LTR" as const,
    isActive: true,
    isDefault: false,
    sortOrder: 4,
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    direction: "LTR" as const,
    isActive: true,
    isDefault: false,
    sortOrder: 5,
  },
  {
    code: "zh",
    name: "Chinese",
    nativeName: "中文",
    direction: "LTR" as const,
    isActive: true,
    isDefault: false,
    sortOrder: 6,
  },
];

async function main() {
  console.log(
    "DATABASE_URL loaded:",
    Boolean(process.env.DATABASE_URL),
  );

  if (process.env.DATABASE_URL) {
    try {
      console.log(
        "Database host:",
        new URL(process.env.DATABASE_URL).hostname,
      );
    } catch {
      throw new Error("DATABASE_URL is not a valid URL.");
    }
  } else {
    throw new Error(
      "DATABASE_URL is missing. Check your .env file.",
    );
  }

  for (const language of languages) {
    await prisma.language.upsert({
      where: {
        code: language.code,
      },
      update: {
        name: language.name,
        nativeName: language.nativeName,
        direction: language.direction,
        isActive: language.isActive,
        isDefault: language.isDefault,
        sortOrder: language.sortOrder,
      },
      create: language,
    });

    console.log(`Seeded language: ${language.name}`);
  }

  console.log("All six ENEENA languages seeded successfully.");
}

main()
  .catch((error) => {
    console.error("Language seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });