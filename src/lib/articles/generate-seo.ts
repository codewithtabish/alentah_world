
import "server-only";

import OpenAI from "openai";

// ============================================================
// SUPPORTED SEO LANGUAGES
// ============================================================

export type SEOLanguage =
  | "en"
  | "ur"
  | "ar"
  | "de"
  | "hi"
  | "zh"
  | "es"
  | "fr"
  | "pt-BR"
  | "ja"
  | "bn"
  | "id";

export interface SEOResult {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  excerpt: string;
}

// ============================================================
// CONFIGURATION
// ============================================================

const HIVE_MODEL =
  process.env.HIVE_MODEL?.trim() ||
  "deepseek-ai/deepseek-v4.1-flash-1017";

const REQUEST_TIMEOUT_MS = 30_000;
const MAX_ATTEMPTS = 2;
const MAX_OUTPUT_TOKENS = 3000;
const MAX_CONTENT_CHARS = 8_000;

const MAX_TITLE_LENGTH = 70;
const MAX_DESCRIPTION_LENGTH = 170;
const MAX_EXCERPT_LENGTH = 500;

const apiKey = process.env.HIVE_API_KEY?.trim();

const hive = apiKey
  ? new OpenAI({
      apiKey,
      baseURL: "https://api-cdn.thehive.ai/api/v3",
      timeout: REQUEST_TIMEOUT_MS,
      maxRetries: 0,
    })
  : null;

let jsonModeEnabled = true;

// ============================================================
// LANGUAGE NAMES
// ============================================================

const LANGUAGE_NAMES: Record<SEOLanguage, string> = {
  en: "English",
  ur: "Urdu",
  ar: "Modern Standard Arabic",
  de: "German",
  hi: "Hindi",
  zh: "Simplified Chinese",
  es: "Spanish",
  fr: "French",
  "pt-BR": "Brazilian Portuguese",
  ja: "Japanese",
  bn: "Bengali",
  id: "Indonesian",
};

// ============================================================
// SCRIPT VALIDATION
//
// Each language is validated against its expected writing
// system. Latin-script languages share the Latin script;
// language accuracy is additionally guided by the prompt.
// ============================================================

const SCRIPT_REGEX: Record<SEOLanguage, RegExp> = {
  en: /\p{Script=Latin}/gu,
  ur: /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/gu,
  ar: /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/gu,
  de: /\p{Script=Latin}/gu,
  hi: /\p{Script=Devanagari}/gu,
  zh: /\p{Script=Han}/gu,
  es: /\p{Script=Latin}/gu,
  fr: /\p{Script=Latin}/gu,
  "pt-BR": /\p{Script=Latin}/gu,
  ja: /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu,
  bn: /\p{Script=Bengali}/gu,
  id: /\p{Script=Latin}/gu,
};

// ============================================================
// LANGUAGE-SPECIFIC WRITING INSTRUCTIONS
// ============================================================

function getLanguageInstructions(language: SEOLanguage): string {
  switch (language) {
    case "en":
      return `
LANGUAGE: Natural, professional English.
SCRIPT: Standard English Latin script.
- Write every SEO field in English.
- Use natural grammar, spelling, and punctuation.
- Use clear, compelling editorial language.
- Do not invent facts or use keyword stuffing.
- Do not unnecessarily translate proper names.
- Do not add the site name to the title.
`;

    case "ur":
      return `
LANGUAGE: Natural Pakistani Urdu.
SCRIPT: Native Urdu script.
- Write the title, description, every keyword, and excerpt in Urdu.
- Never write Roman Urdu.
- Use natural Pakistani Urdu grammar, spelling, and punctuation.
- Use familiar vocabulary understood by Pakistani readers.
- Do not invent facts or translate names unnecessarily.
- Base every field on the supplied article.
- Do not output English SEO filler.
- Do not add the site name or English words to the title.
`;

    case "ar":
      return `
LANGUAGE: Natural Modern Standard Arabic.
SCRIPT: Native Arabic script.
- Write the title, description, every keyword, and excerpt in Arabic.
- Never transliterate Arabic into Latin letters.
- Use correct Arabic grammar, spelling, and punctuation.
- Use natural, professional Arabic suitable for international readers.
- Do not invent facts.
- Base every field on the supplied article.
- Do not add the site name or English words to the title.
`;

    case "de":
      return `
LANGUAGE: Natural standard German (Hochdeutsch).
SCRIPT: Standard German Latin script.
- Write every SEO field in German.
- Use correct German grammar, spelling, capitalization, and punctuation.
- Use natural vocabulary suitable for native German readers.
- Avoid awkward literal translations.
- Preserve proper names.
- Do not invent facts.
- Do not add the site name to the title.
`;

    case "hi":
      return `
LANGUAGE: Natural standard Hindi.
SCRIPT: Native Devanagari script.
- Write the title, description, every keyword, and excerpt in Hindi.
- Never write Roman Hindi.
- Use natural, grammatically correct Hindi.
- Prefer clear vocabulary understood by Hindi-speaking readers.
- Do not unnecessarily replace proper names.
- Do not invent facts.
- Do not add English SEO filler.
- Do not add the site name to the title.
`;

    case "zh":
      return `
LANGUAGE: Natural Simplified Chinese (简体中文).
SCRIPT: Simplified Chinese characters.
- Write every SEO field in Simplified Chinese.
- Do not write Traditional Chinese.
- Do not use Pinyin as a replacement for Chinese characters.
- Use natural modern Chinese grammar and punctuation.
- Write concise, readable metadata for native Chinese readers.
- Preserve proper names appropriately.
- Do not invent facts.
- Do not add the site name to the title.
`;

    case "es":
      return `
LANGUAGE: Natural international Spanish.
SCRIPT: Standard Spanish Latin script.
- Write every SEO field in Spanish.
- Use correct Spanish grammar, accents, spelling, and punctuation.
- Use natural vocabulary suitable for Spanish-speaking readers.
- Avoid awkward literal translations.
- Preserve proper names.
- Do not invent facts.
- Do not add the site name to the title.
`;

    case "fr":
      return `
LANGUAGE: Natural standard French.
SCRIPT: Standard French Latin script.
- Write every SEO field in French.
- Use correct French grammar, accents, spelling, and punctuation.
- Use natural vocabulary suitable for native French readers.
- Avoid awkward literal translations.
- Preserve proper names.
- Do not invent facts.
- Do not add the site name to the title.
`;

    case "pt-BR":
      return `
LANGUAGE: Natural Brazilian Portuguese.
SCRIPT: Brazilian Portuguese Latin script.
- Write every SEO field in Brazilian Portuguese, not European Portuguese.
- Use Brazilian grammar, vocabulary, spelling, and punctuation.
- Prefer expressions naturally used by readers in Brazil.
- Avoid awkward literal translations.
- Preserve proper names.
- Do not invent facts.
- Do not add the site name to the title.
`;

    case "ja":
      return `
LANGUAGE: Natural modern Japanese.
SCRIPT: Native Japanese writing using Kanji, Hiragana, and Katakana.
- Write every SEO field in Japanese.
- Use natural Japanese grammar and punctuation.
- Do not use Romaji as a replacement for Japanese writing.
- Use appropriate Kanji, Hiragana, and Katakana.
- Write concise, natural metadata for Japanese readers.
- Preserve proper names appropriately.
- Do not invent facts.
- Do not add the site name to the title.
`;

    case "bn":
      return `
LANGUAGE: Natural standard Bengali (বাংলা).
SCRIPT: Native Bengali script.
- Write the title, description, every keyword, and excerpt in Bengali.
- Never write Romanized Bengali.
- Use natural Bengali grammar, spelling, and punctuation.
- Prefer vocabulary understood by Bengali-speaking readers.
- Preserve proper names appropriately.
- Do not invent facts.
- Do not add English SEO filler.
- Do not add the site name to the title.
`;

    case "id":
      return `
LANGUAGE: Natural standard Indonesian (Bahasa Indonesia).
SCRIPT: Standard Indonesian Latin script.
- Write every SEO field in Indonesian.
- Use correct Indonesian grammar, spelling, and punctuation.
- Prefer natural vocabulary used by Indonesian readers.
- Avoid awkward literal translations.
- Preserve proper names.
- Do not invent facts.
- Do not add the site name to the title.
`;
  }
}

// ============================================================
// STRING UTILITIES
// ============================================================

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function limitAtWordBoundary(
  value: string,
  maxLength: number,
): string {
  const text = value.trim();

  if (text.length <= maxLength) {
    return text;
  }

  const shortened = text.slice(0, maxLength + 1);
  const lastSpace = shortened.lastIndexOf(" ");

  if (lastSpace >= Math.floor(maxLength * 0.6)) {
    return shortened.slice(0, lastSpace).trim();
  }

  return text.slice(0, maxLength).trim();
}

// ============================================================
// ARTICLE CONTENT CLEANING
// ============================================================

function cleanArticleText(value: string): string {
  return (value || "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

// ============================================================
// EXPECTED SCRIPT VALIDATION
// ============================================================

function hasExpectedScript(
  value: string,
  language: SEOLanguage,
  minRatio = 0.55,
): boolean {
  const letters = value.match(/\p{L}/gu) ?? [];

  if (letters.length === 0) {
    return false;
  }

  const expectedLetters = value.match(
    SCRIPT_REGEX[language],
  ) ?? [];

  return expectedLetters.length / letters.length >= minRatio;
}

// ============================================================
// SEO RESULT VALIDATION
// ============================================================

function validateAndFilter(
  result: SEOResult,
  language: SEOLanguage,
): SEOResult {
  const name = LANGUAGE_NAMES[language];

  for (const [label, field] of [
    ["metaTitle", result.metaTitle],
    ["metaDescription", result.metaDescription],
    ["excerpt", result.excerpt],
  ] as const) {
    if (!hasExpectedScript(field, language, 0.4)) {
      throw new Error(
        `Field "${label}" is not written in the expected ${name} writing system: ${field.slice(0, 80)}`,
      );
    }
  }

  const keywords = result.keywords.filter((keyword) =>
    hasExpectedScript(keyword, language, 0.5),
  );

  if (keywords.length < 3) {
    throw new Error(
      `Fewer than 3 keywords were written in the expected ${name} writing system (got ${keywords.length}).`,
    );
  }

  const combined = [
    result.metaTitle,
    result.metaDescription,
    result.excerpt,
    ...keywords,
  ].join(" ");

  if (!hasExpectedScript(combined, language, 0.55)) {
    throw new Error(
      `Output is not predominantly written in the expected ${name} writing system.`,
    );
  }

  return {
    ...result,
    keywords,
  };
}

// ============================================================
// JSON RESPONSE PARSING
// ============================================================

function parseSEOResponse(
  raw: string,
  language: SEOLanguage,
): SEOResult {
  const cleaned = raw
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/<thinking>[\s\S]*?<\/thinking>/gi, "")
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start < 0 || end <= start) {
    throw new Error("Hive returned no JSON object.");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    throw new Error("Hive returned malformed JSON.");
  }

  if (
    !parsed ||
    typeof parsed !== "object" ||
    Array.isArray(parsed)
  ) {
    throw new Error("Hive returned an invalid response structure.");
  }

  const value = parsed as Record<string, unknown>;

  const metaTitle = cleanString(value.metaTitle);
  const metaDescription = cleanString(value.metaDescription);
  const excerpt = cleanString(value.excerpt);

  const keywords = Array.isArray(value.keywords)
    ? value.keywords
        .filter((keyword): keyword is string =>
          typeof keyword === "string",
        )
        .map((keyword) => keyword.trim())
        .filter(Boolean)
        .slice(0, 8)
    : [];

  if (
    !metaTitle ||
    !metaDescription ||
    !excerpt ||
    keywords.length < 3
  ) {
    throw new Error("Hive omitted required SEO fields.");
  }

  const result: SEOResult = {
    metaTitle: limitAtWordBoundary(
      metaTitle,
      MAX_TITLE_LENGTH,
    ),
    metaDescription: limitAtWordBoundary(
      metaDescription,
      MAX_DESCRIPTION_LENGTH,
    ),
    keywords,
    excerpt: limitAtWordBoundary(
      excerpt,
      MAX_EXCERPT_LENGTH,
    ),
  };

  return validateAndFilter(result, language);
}

// ============================================================
// LANGUAGE-SPECIFIC STOP WORDS
// ============================================================

const STOP_WORDS: Record<SEOLanguage, Set<string>> = {
  en: new Set([
    "the", "and", "for", "with", "from", "that", "this",
    "are", "was", "were", "you", "your", "have", "has",
    "had", "but", "not", "about", "into", "their", "they",
    "them", "then", "than", "what", "when", "where",
    "which", "will", "would", "could", "should", "article",
  ]),

  ur: new Set([
    "اور", "کے", "کی", "کا", "میں", "ہے", "ہیں", "کو",
    "سے", "پر", "یہ", "وہ", "ایک", "بھی", "نہیں", "تو",
    "ہی", "جو", "اس", "اسے", "تھا", "تھی", "تھے",
  ]),

  ar: new Set([
    "من", "في", "على", "إلى", "عن", "هذا", "هذه",
    "ذلك", "التي", "الذي", "هو", "هي", "كان", "كانت",
    "مع", "ما", "لا", "لم", "لن", "أن", "إن", "و", "أو",
  ]),

  de: new Set([
    "der", "die", "das", "und", "ist", "sind", "ein",
    "eine", "einer", "eines", "mit", "von", "für", "auf",
    "den", "dem", "des", "nicht", "auch", "als", "bei",
    "nach", "über", "unter", "wird", "werden",
  ]),

  hi: new Set([
    "और", "का", "की", "के", "में", "है", "हैं", "को",
    "से", "पर", "यह", "वह", "एक", "भी", "नहीं", "तो",
    "ही", "जो", "इस", "उस", "था", "थी", "थे",
  ]),

  zh: new Set([
    "的", "了", "和", "是", "在", "与", "及", "对",
    "这", "那", "有", "为", "也", "都", "而", "被",
    "从", "到", "一个", "我们", "他们",
  ]),

  es: new Set([
    "el", "la", "los", "las", "de", "del", "y", "o",
    "en", "un", "una", "unos", "unas", "es", "son",
    "por", "para", "con", "que", "como", "pero", "sus",
    "este", "esta", "esto", "sobre",
  ]),

  fr: new Set([
    "le", "la", "les", "de", "du", "des", "et", "ou",
    "en", "un", "une", "est", "sont", "pour", "par",
    "avec", "que", "qui", "dans", "sur", "mais", "ce",
    "cette", "ces",
  ]),

  "pt-BR": new Set([
    "o", "a", "os", "as", "de", "do", "da", "dos",
    "das", "e", "ou", "em", "um", "uma", "para", "por",
    "com", "que", "como", "mais", "não", "uma", "seu",
    "sua", "esse", "essa",
  ]),

  ja: new Set([
    "これ", "それ", "あれ", "この", "その", "あの",
    "こと", "もの", "ため", "から", "まで", "そして",
    "しかし", "です", "ます", "いる", "ある",
  ]),

  bn: new Set([
    "এবং", "এই", "সেই", "একটি", "এক", "করে", "হয়",
    "হয়েছে", "ছিল", "থেকে", "জন্য", "তার", "তাদের",
    "কিন্তু", "যে", "না", "ও", "এর", "কে",
  ]),

  id: new Set([
    "dan", "yang", "di", "ke", "dari", "ini", "itu",
    "untuk", "dengan", "pada", "adalah", "atau", "juga",
    "dalam", "oleh", "akan", "tidak", "ada", "sebagai",
    "dapat", "telah",
  ]),
};

// ============================================================
// LANGUAGE-SPECIFIC FALLBACK KEYWORDS
// ============================================================

const DEFAULT_KEYWORDS: Record<SEOLanguage, string[]> = {
  en: [
    "news and analysis",
    "editorial insights",
    "latest stories",
  ],

  ur: [
    "اردو ادب",
    "اہم معلومات",
    "ادبی مضامین",
  ],

  ar: [
    "مقالات",
    "ثقافة ومعرفة",
    "تحليلات",
  ],

  de: [
    "aktuelle Themen",
    "Wissen und Einblicke",
    "Hintergrundberichte",
  ],

  hi: [
    "जीवन की कहानियाँ",
    "महत्वपूर्ण जानकारी",
    "विचार और विश्लेषण",
  ],

  zh: [
    "新闻与观点",
    "深度阅读",
    "文化与知识",
  ],

  es: [
    "historias y actualidad",
    "análisis y opiniones",
    "información relevante",
  ],

  fr: [
    "actualités et analyses",
    "histoires et perspectives",
    "informations essentielles",
  ],

  "pt-BR": [
    "notícias e análises",
    "histórias e perspectivas",
    "informações importantes",
  ],

  ja: [
    "最新情報",
    "記事と分析",
    "文化と知識",
  ],

  bn: [
    "গুরুত্বপূর্ণ তথ্য",
    "জীবনের গল্প",
    "বিশ্লেষণ ও মতামত",
  ],

  id: [
    "berita dan analisis",
    "wawasan dan informasi",
    "kisah dan cerita",
  ],
};

// ============================================================
// KEYWORD EXTRACTION
// ============================================================

function extractKeywords(
  title: string,
  content: string,
  language: SEOLanguage,
): string[] {
  const combined = `${title} ${content}`.slice(0, 12_000);

  const tokens = combined.match(/[\p{L}\p{M}]{2,}/gu) ?? [];

  const seen = new Set<string>();
  const keywords: string[] = [];

  for (const token of tokens) {
    const normalized = token.toLocaleLowerCase();

    if (
      STOP_WORDS[language].has(normalized) ||
      seen.has(normalized) ||
      !hasExpectedScript(token, language)
    ) {
      continue;
    }

    seen.add(normalized);
    keywords.push(token);

    if (keywords.length === 8) {
      break;
    }
  }

  return keywords;
}

// ============================================================
// LANGUAGE-SPECIFIC FALLBACK DESCRIPTIONS
// ============================================================

function makeFallbackDescription(
  content: string,
  title: string,
  language: SEOLanguage,
): string {
  let body = cleanArticleText(content);

  if (body && title && body.startsWith(title)) {
    body = body.slice(title.length).trim();
  }

  if (body && hasExpectedScript(body, language)) {
    const firstSentence =
      body.match(/^.{40,}?[.!?؟۔。]\s*/u)?.[0]?.trim() ??
      body;

    const description = limitAtWordBoundary(
      firstSentence,
      MAX_DESCRIPTION_LENGTH,
    );

    if (description.length >= 40) {
      return description;
    }
  }

  const safeTitle = title || LANGUAGE_NAMES[language];

  switch (language) {
    case "en":
      return limitAtWordBoundary(
        `${safeTitle}: explore the main ideas, useful details, and key information covered in this article.`,
        MAX_DESCRIPTION_LENGTH,
      );

    case "ur":
      return limitAtWordBoundary(
        `اس مضمون میں ${safeTitle} سے متعلق اہم معلومات اور تفصیلات پیش کی گئی ہیں۔ مکمل مضمون پڑھیں۔`,
        MAX_DESCRIPTION_LENGTH,
      );

    case "ar":
      return limitAtWordBoundary(
        `يتناول هذا المقال ${safeTitle} ويعرض أهم المعلومات والتفاصيل المرتبطة به.`,
        MAX_DESCRIPTION_LENGTH,
      );

    case "de":
      return limitAtWordBoundary(
        `Entdecken Sie wichtige Informationen, Hintergründe und Einblicke zum Thema ${safeTitle}.`,
        MAX_DESCRIPTION_LENGTH,
      );

    case "hi":
      return limitAtWordBoundary(
        `${safeTitle} से जुड़ी महत्वपूर्ण जानकारी, प्रमुख बातें और उपयोगी विवरण इस लेख में पढ़ें।`,
        MAX_DESCRIPTION_LENGTH,
      );

    case "zh":
      return limitAtWordBoundary(
        `了解${safeTitle}的相关信息、重要内容和深入见解，阅读本文获取更多详情。`,
        MAX_DESCRIPTION_LENGTH,
      );

    case "es":
      return limitAtWordBoundary(
        `Descubre información importante, detalles y perspectivas sobre ${safeTitle} en este artículo.`,
        MAX_DESCRIPTION_LENGTH,
      );

    case "fr":
      return limitAtWordBoundary(
        `Découvrez les informations essentielles et les points clés sur ${safeTitle} dans cet article.`,
        MAX_DESCRIPTION_LENGTH,
      );

    case "pt-BR":
      return limitAtWordBoundary(
        `Descubra informações importantes, detalhes e perspectivas sobre ${safeTitle} neste artigo.`,
        MAX_DESCRIPTION_LENGTH,
      );

    case "ja":
      return limitAtWordBoundary(
        `${safeTitle}に関する重要な情報や詳しい内容をこの記事で紹介します。`,
        MAX_DESCRIPTION_LENGTH,
      );

    case "bn":
      return limitAtWordBoundary(
        `${safeTitle} সম্পর্কে গুরুত্বপূর্ণ তথ্য, বিস্তারিত বিষয় এবং প্রয়োজনীয় দিকগুলো এই নিবন্ধে পড়ুন।`,
        MAX_DESCRIPTION_LENGTH,
      );

    case "id":
      return limitAtWordBoundary(
        `Temukan informasi penting, penjelasan, dan wawasan mengenai ${safeTitle} dalam artikel ini.`,
        MAX_DESCRIPTION_LENGTH,
      );
  }
}

// ============================================================
// FALLBACK SEO GENERATION
// ============================================================

export function createFallbackSEO(
  title: string,
  language: SEOLanguage | boolean = "en",
  contentText = "",
): SEOResult {
  const resolvedLanguage: SEOLanguage =
    typeof language === "boolean" ? "en" : language;

  const safeTitle = limitAtWordBoundary(
    title.trim() ||
      (
        {
          en: "Latest Article",
          ur: "اہم مضمون",
          ar: "مقال مهم",
          de: "Aktueller Artikel",
          hi: "महत्वपूर्ण लेख",
          zh: "最新文章",
          es: "Artículo destacado",
          fr: "Article important",
          "pt-BR": "Artigo em destaque",
          ja: "注目の記事",
          bn: "গুরুত্বপূর্ণ নিবন্ধ",
          id: "Artikel terbaru",
        } satisfies Record<SEOLanguage, string>
      )[resolvedLanguage],
    MAX_TITLE_LENGTH,
  );

  const content = cleanArticleText(contentText);

  const excerptSource =
    content && hasExpectedScript(content, resolvedLanguage)
      ? content
      : makeFallbackDescription(
          content,
          safeTitle,
          resolvedLanguage,
        );

  const excerpt = limitAtWordBoundary(
    excerptSource || safeTitle,
    MAX_EXCERPT_LENGTH,
  );

  const metaDescription = makeFallbackDescription(
    content,
    safeTitle,
    resolvedLanguage,
  );

  let keywords = extractKeywords(
    safeTitle,
    content,
    resolvedLanguage,
  );

  if (keywords.length < 3) {
    const defaults = DEFAULT_KEYWORDS[resolvedLanguage];

    keywords = [
      ...keywords,
      ...defaults.filter(
        (keyword) => !keywords.includes(keyword),
      ),
    ].slice(0, 8);
  }

  return {
    metaTitle: safeTitle,
    metaDescription,
    keywords,
    excerpt,
  };
}

// ============================================================
// ERROR HANDLING
// ============================================================

function getErrorStatus(
  error: unknown,
): number | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error
  ) {
    const status = (error as { status?: unknown }).status;

    return typeof status === "number"
      ? status
      : undefined;
  }

  return undefined;
}

function isRetryableError(error: unknown): boolean {
  const status = getErrorStatus(error);

  if (typeof status === "number") {
    if ([400, 401, 403, 404, 422].includes(status)) {
      return false;
    }

    return (
      status === 408 ||
      status === 409 ||
      status === 429 ||
      status >= 500
    );
  }

  return true;
}

function getSafeErrorMessage(error: unknown): string {
  if (error instanceof OpenAI.APIError) {
    return `APIError status=${error.status} code=${error.code ?? "n/a"} type=${error.type ?? "n/a"} message=${error.message}`;
  }

  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }

  return "Unknown Hive error";
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) =>
    setTimeout(resolve, milliseconds),
  );
}

// ============================================================
// MAIN SEO GENERATION
// ============================================================

export async function generateSEO(
  title: string,
  contentText: string,
  language: SEOLanguage = "en",
): Promise<SEOResult> {
  const normalizedTitle = cleanString(title);

  const content = cleanArticleText(contentText).slice(
    0,
    MAX_CONTENT_CHARS,
  );

  if (!normalizedTitle) {
    throw new Error(
      "Cannot generate SEO metadata: the article title is empty.",
    );
  }

  if (!hive) {
    console.warn(
      "[SEO] HIVE_API_KEY is missing. Creating article-specific fallback metadata.",
    );

    return createFallbackSEO(
      normalizedTitle,
      language,
      content,
    );
  }

  const prompt = `
You are the senior SEO editor for ENEENA, a premium multilingual international editorial publication.

Your task is to create accurate, useful, natural, article-specific SEO metadata.

TARGET LANGUAGE:
${LANGUAGE_NAMES[language]}

${getLanguageInstructions(language)}

RETURN EXACTLY ONE VALID JSON OBJECT:

{
  "metaTitle": "string",
  "metaDescription": "string",
  "keywords": ["string", "string", "string", "string", "string"],
  "excerpt": "string"
}

STRICT SEO REQUIREMENTS:

1. metaTitle:
   - Ideally 50-60 characters.
   - Maximum 70 characters.
   - Natural and compelling.
   - Accurately represents the article.
   - No unnecessary keyword repetition.

2. metaDescription:
   - Ideally 140-160 characters.
   - Maximum 170 characters.
   - Clearly describes the article.
   - Encourages relevant readers to open the article.
   - Must be written entirely in the requested language.

3. keywords:
   - Provide 5-8 relevant SEO keyword phrases.
   - Use natural search phrases.
   - Avoid repetition and keyword stuffing.
   - Every keyword must use the requested language and writing system.
   - Include important subject-specific terms from the article.

4. excerpt:
   - Provide a useful summary of approximately 1-2 sentences.
   - Maximum 500 characters.
   - Accurately summarize the actual article.
   - Must be written entirely in the requested language.

5. GENERAL RULES:
   - Do not invent facts.
   - Do not make claims absent from the article.
   - Do not create misleading headlines.
   - Do not use generic SEO filler.
   - Do not return Markdown or code fences.
   - Do not include explanations outside the JSON object.
   - Follow the requested language and writing system in every field.
   - Preserve names, locations, and important terminology appropriately.
   - Base all metadata on the actual article, not just its title.

ARTICLE TITLE:
${normalizedTitle}

ARTICLE CONTENT:
${content || normalizedTitle}
`;

  let lastError: unknown;

  for (
    let attempt = 1;
    attempt <= MAX_ATTEMPTS;
    attempt += 1
  ) {
    try {
      console.info(
        `[SEO] Hive attempt ${attempt}/${MAX_ATTEMPTS}; model=${HIVE_MODEL}; language=${language}; languageName=${LANGUAGE_NAMES[language]}; jsonMode=${jsonModeEnabled}.`,
      );

      const response = await hive.chat.completions.create({
        model: HIVE_MODEL,

        messages: [
          {
            role: "system",
            content:
              "You are a professional multilingual SEO editor for an international publication. Follow the requested language, regional variant, and writing system exactly. Never substitute English for another requested language. Return valid JSON only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.2,

        max_tokens: MAX_OUTPUT_TOKENS,

        ...(jsonModeEnabled
          ? {
              response_format: {
                type: "json_object" as const,
              },
            }
          : {}),
      });

      const choice = response.choices[0];

      const raw = choice?.message?.content;
      const finishReason = choice?.finish_reason;

      if (typeof raw !== "string" || !raw.trim()) {
        throw new Error(
          `Hive returned an empty response (finish_reason=${finishReason}).`,
        );
      }

      try {
        const result = parseSEOResponse(raw, language);

        console.info(
          `[SEO] Hive generated valid metadata; language=${language}; attempt=${attempt}.`,
        );

        return result;
      } catch (parseError) {
        console.error(
          `[SEO] Rejected model output (finish_reason=${finishReason}): ${raw.slice(0, 700)}`,
        );

        throw parseError;
      }
    } catch (error) {
      lastError = error;

      console.error(
        `[SEO] Hive attempt ${attempt}/${MAX_ATTEMPTS} failed: ${getSafeErrorMessage(error)}`,
      );

      if (
        jsonModeEnabled &&
        getErrorStatus(error) === 400 &&
        /response_format|json_object|json mode/i.test(
          error instanceof Error ? error.message : "",
        )
      ) {
        jsonModeEnabled = false;

        console.warn(
          "[SEO] response_format not supported; disabling JSON mode.",
        );

        if (attempt < MAX_ATTEMPTS) {
          continue;
        }
      }

      if (
        attempt >= MAX_ATTEMPTS ||
        !isRetryableError(error)
      ) {
        break;
      }

      await wait(attempt * 700);
    }
  }

  console.warn(
    `[SEO] Hive did not return valid metadata after ${MAX_ATTEMPTS} attempt(s). Using article-specific fallback metadata. Reason: ${getSafeErrorMessage(lastError)}`,
  );

  return createFallbackSEO(
    normalizedTitle,
    language,
    content,
  );
}
