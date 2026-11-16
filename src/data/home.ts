
 // src/data/home.ts

// -----------------------------------------------------------------------------
// ENEENA — Multilingual Homepage SEO
// -----------------------------------------------------------------------------
// Static SEO configuration for all 12 language editions.
// Used by src/app/[lang]/page.tsx.
// -----------------------------------------------------------------------------

export type HomeSEOEntry = {
  language: string;
  hreflang: string;
  locale: string;
  direction: "ltr" | "rtl";
  title: string;
  description: string;
};

export const HOME_SEO = {
  en: {
    language: "en",
    hreflang: "en",
    locale: "en_US",
    direction: "ltr",

    title: "ENEENA | Independent Journalism, Global Perspectives",

    description:
      "Discover independent journalism, international news, insightful analysis, personal stories and diverse perspectives from around the world. Explore ENEENA in your language.",
  },

  ur: {
    language: "ur",
    hreflang: "ur",
    locale: "ur_PK",
    direction: "rtl",

    title: "ENEENA | آزاد صحافت، عالمی نقطۂ نظر",

    description:
      "دنیا بھر کی آزاد صحافت، بین الاقوامی خبریں، گہرا تجزیہ، حقیقی کہانیاں اور متنوع نقطۂ نظر اپنی زبان میں پڑھیں۔ ENEENA کے ساتھ دنیا کو ایک نئے زاویے سے جانیں۔",
  },

  ar: {
    language: "ar",
    hreflang: "ar",
    locale: "ar",
    direction: "rtl",

    title: "ENEENA | صحافة مستقلة ورؤى عالمية",

    description:
      "اكتشف الصحافة المستقلة والأخبار الدولية والتحليلات المتعمقة والقصص الإنسانية ووجهات النظر المتنوعة من جميع أنحاء العالم، واقرأ محتوى ENEENA بلغتك.",
  },

  de: {
    language: "de",
    hreflang: "de",
    locale: "de_DE",
    direction: "ltr",

    title: "ENEENA | Unabhängiger Journalismus, globale Perspektiven",

    description:
      "Entdecken Sie unabhängigen Journalismus, internationale Nachrichten, fundierte Analysen, persönliche Geschichten und vielfältige Perspektiven aus aller Welt auf ENEENA.",
  },

  hi: {
    language: "hi",
    hreflang: "hi",
    locale: "hi_IN",
    direction: "ltr",

    title: "ENEENA | स्वतंत्र पत्रकारिता, वैश्विक दृष्टिकोण",

    description:
      "दुनिया भर की स्वतंत्र पत्रकारिता, अंतरराष्ट्रीय समाचार, गहन विश्लेषण, वास्तविक जीवन की कहानियाँ और विविध विचार पढ़ें। ENEENA पर अपनी भाषा में दुनिया को जानें।",
  },

  zh: {
    language: "zh",
    hreflang: "zh-CN",
    locale: "zh_CN",
    direction: "ltr",

    title: "ENEENA | 独立新闻，全球视角",

    description:
      "探索来自世界各地的独立新闻、国际资讯、深度分析、真实故事和多元观点。通过 ENEENA，以自己的语言了解世界。",
  },

  es: {
    language: "es",
    hreflang: "es",
    locale: "es_ES",
    direction: "ltr",

    title: "ENEENA | Periodismo independiente, perspectivas globales",

    description:
      "Descubre periodismo independiente, noticias internacionales, análisis en profundidad, historias personales y perspectivas diversas de todo el mundo en ENEENA.",
  },

  fr: {
    language: "fr",
    hreflang: "fr",
    locale: "fr_FR",
    direction: "ltr",

    title: "ENEENA | Journalisme indépendant, perspectives mondiales",

    description:
      "Découvrez le journalisme indépendant, l'actualité internationale, des analyses approfondies, des récits personnels et des perspectives variées du monde entier sur ENEENA.",
  },

  "pt-BR": {
    language: "pt-BR",
    hreflang: "pt-BR",
    locale: "pt_BR",
    direction: "ltr",

    title: "ENEENA | Jornalismo independente, perspectivas globais",

    description:
      "Descubra jornalismo independente, notícias internacionais, análises aprofundadas, histórias pessoais e diferentes perspectivas de todo o mundo na ENEENA.",
  },

  ja: {
    language: "ja",
    hreflang: "ja",
    locale: "ja_JP",
    direction: "ltr",

    title: "ENEENA | 独立したジャーナリズム、世界の視点",

    description:
      "世界各地の独立したジャーナリズム、国際ニュース、深い分析、実体験に基づく物語、多様な視点をお届けします。ENEENAで世界を新しい視点から発見してください。",
  },

  bn: {
    language: "bn",
    hreflang: "bn",
    locale: "bn_BD",
    direction: "ltr",

    title: "ENEENA | স্বাধীন সাংবাদিকতা, বৈশ্বিক দৃষ্টিভঙ্গি",

    description:
      "বিশ্বজুড়ে স্বাধীন সাংবাদিকতা, আন্তর্জাতিক সংবাদ, গভীর বিশ্লেষণ, বাস্তব জীবনের গল্প এবং নানা দৃষ্টিভঙ্গি আবিষ্কার করুন। ENEENA-তে নিজের ভাষায় বিশ্বকে জানুন।",
  },

  id: {
    language: "id",
    hreflang: "id",
    locale: "id_ID",
    direction: "ltr",

    title: "ENEENA | Jurnalisme Independen, Perspektif Global",

    description:
      "Temukan jurnalisme independen, berita internasional, analisis mendalam, kisah nyata, dan beragam perspektif dari seluruh dunia melalui ENEENA.",
  },
} as const satisfies Record<string, HomeSEOEntry>;

// -----------------------------------------------------------------------------
// Shared homepage SEO configuration
// -----------------------------------------------------------------------------

export const HOME_SHARED_SEO = {
  siteName: "ENEENA",

  siteUrl: "https://www.eneena.com",

  // One consistent social-sharing image for all language editions.
  ogImage: "https://www.eneena.com/images/og-image.jpg",

  ogImageAlt: "ENEENA — Independent Journalism, Global Perspectives",

  ogImageWidth: 1200,

  ogImageHeight: 630,

  twitterCard: "summary_large_image" as const,
};

// -----------------------------------------------------------------------------
// Supported language type
// -----------------------------------------------------------------------------

export type HomeLanguage = keyof typeof HOME_SEO;

// -----------------------------------------------------------------------------
// Retrieve SEO configuration for one language
// -----------------------------------------------------------------------------

export function getHomeSEO(language: string): HomeSEOEntry | null {
  if (!Object.prototype.hasOwnProperty.call(HOME_SEO, language)) {
    return null;
  }

  return HOME_SEO[language as HomeLanguage];
}

// -----------------------------------------------------------------------------
// Retrieve all configured language editions
// -----------------------------------------------------------------------------

export function getAllHomeSEO(): HomeSEOEntry[] {
  return Object.values(HOME_SEO);
}

// -----------------------------------------------------------------------------
// Build reciprocal hreflang URLs for the homepage
// -----------------------------------------------------------------------------

export function getHomeLanguageAlternates(): Record<string, string> {
  const alternates: Record<string, string> = {};

  for (const [code, config] of Object.entries(HOME_SEO)) {
    alternates[config.hreflang] =
      `${HOME_SHARED_SEO.siteUrl}/${code}`;
  }

  alternates["x-default"] = `${HOME_SHARED_SEO.siteUrl}/en`;

  return alternates;
}
