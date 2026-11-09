
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
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    direction: "LTR" as const,
    isActive: true,
    isDefault: false,
    sortOrder: 7,
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    direction: "LTR" as const,
    isActive: true,
    isDefault: false,
    sortOrder: 8,
  },
  {
    code: "pt-BR",
    name: "Portuguese (Brazil)",
    nativeName: "Português (Brasil)",
    direction: "LTR" as const,
    isActive: true,
    isDefault: false,
    sortOrder: 9,
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    direction: "LTR" as const,
    isActive: true,
    isDefault: false,
    sortOrder: 10,
  },
  {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    direction: "LTR" as const,
    isActive: true,
    isDefault: false,
    sortOrder: 11,
  },
  {
    code: "id",
    name: "Indonesian",
    nativeName: "Bahasa Indonesia",
    direction: "LTR" as const,
    isActive: true,
    isDefault: false,
    sortOrder: 12,
  },
];

async function main() {
  console.log("DATABASE_URL loaded:", Boolean(process.env.DATABASE_URL));

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
    throw new Error("DATABASE_URL is missing. Check your .env file.");
  }

  // Ensure English remains the only default language.
  await prisma.language.updateMany({
    where: {
      isDefault: true,
      code: {
        not: "en",
      },
    },
    data: {
      isDefault: false,
    },
  });

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

    console.log(`Seeded language: ${language.name} (${language.code})`);
  }

  console.log("All 12 ENEENA languages seeded successfully.");
}

main()
  .catch((error) => {
    console.error("Language seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
