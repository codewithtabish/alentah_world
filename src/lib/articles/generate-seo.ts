import "server-only";

import OpenAI from "openai";

export type SEOLanguage = "en" | "ur" | "ar";

export interface SEOResult {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  excerpt: string;
}

const HIVE_MODEL =
  process.env.HIVE_MODEL?.trim() ||
  "deepseek-ai/deepseek-v4.1-flash-1017";

// Urdu/Arabic output is token-heavy, so give the model room.
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

// If the provider rejects response_format, we switch it off for later calls.
let jsonModeEnabled = true;

const LANGUAGE_NAMES: Record<SEOLanguage, string> = {
  en: "English",
  ur: "Urdu",
  ar: "Modern Standard Arabic",
};

const ARABIC_SCRIPT_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g;

function getLanguageInstructions(language: SEOLanguage): string {
  switch (language) {
    case "ur":
      return `
LANGUAGE: Natural Pakistani Urdu.
SCRIPT: Native Urdu/Arabic script only for Urdu text.
- Write the title, description, every keyword, and excerpt in Urdu.
- Never write Roman Urdu.
- Use natural Pakistani Urdu grammar, spelling, and punctuation.
- Do not invent facts or translate names unnecessarily.
- Base every field on the supplied article.
- Do not output English SEO filler.
- Do not add the site name or any English words to the title.
`;

    case "ar":
      return `
LANGUAGE: Natural Modern Standard Arabic.
SCRIPT: Native Arabic script.
- Write the title, description, every keyword, and excerpt in Arabic.
- Never transliterate Arabic into Latin letters.
- Use correct Arabic grammar, spelling, and punctuation.
- Do not invent facts.
- Base every field on the supplied article.
- Do not add the site name or any English words to the title.
`;

    default:
      return `
LANGUAGE: Natural English.
SCRIPT: Standard English.
- Write the title, description, every keyword, and excerpt in English.
- Use correct spelling and grammar.
- Do not invent facts or use keyword stuffing.
- Base every field on the supplied article.
`;
  }
}

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function limitAtWordBoundary(value: string, maxLength: number): string {
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

/**
 * Checks that text is mostly written in the expected script.
 * `minRatio` is the share of letters that must be in that script.
 */
function hasExpectedScript(
  value: string,
  language: SEOLanguage,
  minRatio = 0.55,
): boolean {
  if (language === "en") {
    return /[A-Za-z]/.test(value);
  }

  const letters = value.match(/\p{L}/gu) ?? [];

  if (letters.length === 0) {
    return false;
  }

  const expectedLetters = value.match(ARABIC_SCRIPT_REGEX) ?? [];

  return expectedLetters.length / letters.length >= minRatio;
}

/**
 * Lenient validation: names, numbers and a few foreign words are allowed.
 * - Title, description and excerpt must each be mostly in the right script.
 * - Keywords that are in the wrong script are dropped instead of failing everything.
 * - The output as a whole must be predominantly in the right script.
 */
function validateAndFilter(
  result: SEOResult,
  language: SEOLanguage,
): SEOResult {
  if (language === "en") {
    return result;
  }

  const name = LANGUAGE_NAMES[language];

  for (const [label, field] of [
    ["metaTitle", result.metaTitle],
    ["metaDescription", result.metaDescription],
    ["excerpt", result.excerpt],
  ] as const) {
    if (!hasExpectedScript(field, language, 0.4)) {
      throw new Error(
        `Field "${label}" is not written in ${name} script: ${field.slice(0, 80)}`,
      );
    }
  }

  const keywords = result.keywords.filter((keyword) =>
    hasExpectedScript(keyword, language, 0.5),
  );

  if (keywords.length < 3) {
    throw new Error(
      `Fewer than 3 keywords were written in ${name} script (got ${keywords.length}).`,
    );
  }

  const combined = [
    result.metaTitle,
    result.metaDescription,
    result.excerpt,
    ...keywords,
  ].join(" ");

  if (!hasExpectedScript(combined, language, 0.55)) {
    throw new Error(`Output is not predominantly ${name} script.`);
  }

  return { ...result, keywords };
}

function parseSEOResponse(raw: string, language: SEOLanguage): SEOResult {
  const cleaned = raw
    // Remove reasoning blocks some models emit before the answer.
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

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Hive returned an invalid response structure.");
  }

  const value = parsed as Record<string, unknown>;

  const metaTitle = cleanString(value.metaTitle);
  const metaDescription = cleanString(value.metaDescription);
  const excerpt = cleanString(value.excerpt);

  const keywords = Array.isArray(value.keywords)
    ? value.keywords
        .filter((keyword): keyword is string => typeof keyword === "string")
        .map((keyword) => keyword.trim())
        .filter(Boolean)
        .slice(0, 8)
    : [];

  if (!metaTitle || !metaDescription || !excerpt || keywords.length < 3) {
    throw new Error("Hive omitted required SEO fields.");
  }

  const result: SEOResult = {
    metaTitle: limitAtWordBoundary(metaTitle, MAX_TITLE_LENGTH),
    metaDescription: limitAtWordBoundary(
      metaDescription,
      MAX_DESCRIPTION_LENGTH,
    ),
    keywords,
    excerpt: limitAtWordBoundary(excerpt, MAX_EXCERPT_LENGTH),
  };

  return validateAndFilter(result, language);
}

function extractKeywords(
  title: string,
  content: string,
  language: SEOLanguage,
): string[] {
  const stopWords: Record<SEOLanguage, Set<string>> = {
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
  };

  const combined = `${title} ${content}`.slice(0, 12_000);
  const tokens = combined.match(/[\p{L}\p{M}]{3,}/gu) ?? [];
  const seen = new Set<string>();
  const keywords: string[] = [];

  for (const token of tokens) {
    const normalized = token.toLocaleLowerCase();

    if (
      stopWords[language].has(normalized) ||
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

function makeFallbackDescription(
  content: string,
  title: string,
  language: SEOLanguage,
): string {
  let body = cleanArticleText(content);

  if (body && title && body.startsWith(title)) {
    body = body.slice(title.length).trim();
  }

  // Do not use an excerpt in the wrong writing system.
  if (body && hasExpectedScript(body, language)) {
    const firstSentence =
      body.match(/^.{40,}?[.!؟۔](?:\s|$)/u)?.[0]?.trim() ?? body;

    const description = limitAtWordBoundary(
      firstSentence,
      MAX_DESCRIPTION_LENGTH,
    );

    if (description.length >= 40) {
      return description;
    }
  }

  switch (language) {
    case "ur":
      return limitAtWordBoundary(
        `اس مضمون میں ${title || "اس موضوع"} سے متعلق اہم معلومات اور تفصیلات پیش کی گئی ہیں۔ مکمل مضمون پڑھیں۔`,
        MAX_DESCRIPTION_LENGTH,
      );

    case "ar":
      return limitAtWordBoundary(
        `يتناول هذا المقال ${title || "الموضوع"} ويعرض أهم المعلومات والتفاصيل المرتبطة به.`,
        MAX_DESCRIPTION_LENGTH,
      );

    default:
      return limitAtWordBoundary(
        `${title || "This article"}: explore the main ideas, useful details, and key information covered in this article.`,
        MAX_DESCRIPTION_LENGTH,
      );
  }
}

/**
 * Creates valid metadata without relying on Hive being available.
 *
 * The fallback is article-specific: it uses the supplied title,
 * article text, and relevant words instead of always returning
 * the same generic keywords.
 */
export function createFallbackSEO(
  title: string,
  language: SEOLanguage | boolean = "en",
  contentText = "",
): SEOResult {
  const resolvedLanguage: SEOLanguage =
    typeof language === "boolean" ? "en" : language;

  const safeTitle = limitAtWordBoundary(
    title.trim() ||
      (resolvedLanguage === "ur"
        ? "اہم مضمون"
        : resolvedLanguage === "ar"
          ? "مقال مهم"
          : "Latest Article"),
    MAX_TITLE_LENGTH,
  );

  const content = cleanArticleText(contentText);
  const excerptSource =
    content && hasExpectedScript(content, resolvedLanguage)
      ? content
      : makeFallbackDescription(content, safeTitle, resolvedLanguage);

  const excerpt = limitAtWordBoundary(
    excerptSource || safeTitle,
    MAX_EXCERPT_LENGTH,
  );

  const metaDescription = makeFallbackDescription(
    content,
    safeTitle,
    resolvedLanguage,
  );

  let keywords = extractKeywords(safeTitle, content, resolvedLanguage);

  if (keywords.length < 3) {
    const defaults: Record<SEOLanguage, string[]> = {
      en: ["news and analysis", "editorial insights", "latest stories"],
      ur: ["اردو ادب", "اہم معلومات", "ادبی مضامین"],
      ar: ["مقالات", "ثقافة ومعرفة", "تحليلات"],
    };

    keywords = [
      ...keywords,
      ...defaults[resolvedLanguage].filter(
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

function getErrorStatus(error: unknown): number | undefined {
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = (error as { status?: unknown }).status;
    return typeof status === "number" ? status : undefined;
  }
  return undefined;
}

function isRetryableError(error: unknown): boolean {
  const status = getErrorStatus(error);

  if (typeof status === "number") {
    // These errors generally will not be fixed by retrying.
    if ([400, 401, 403, 404, 422].includes(status)) {
      return false;
    }

    return (
      status === 408 || status === 409 || status === 429 || status >= 500
    );
  }

  // Timeouts, connection errors, bad JSON and failed validation
  // have no HTTP status; the model may do better on another try.
  return true;
}

/**
 * Returns a useful, secret-free description of the error.
 * The OpenAI SDK never puts the API key in error.message.
 */
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
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export async function generateSEO(
  title: string,
  contentText: string,
  language: SEOLanguage = "en",
): Promise<SEOResult> {
  const normalizedTitle = cleanString(title);
  const content = cleanArticleText(contentText).slice(0, MAX_CONTENT_CHARS);

  if (!normalizedTitle) {
    throw new Error(
      "Cannot generate SEO metadata: the article title is empty.",
    );
  }

  if (!hive) {
    console.warn(
      "[SEO] HIVE_API_KEY is missing. Creating article-specific fallback metadata.",
    );

    return createFallbackSEO(normalizedTitle, language, content);
  }

  const prompt = `
You are the senior SEO editor for a multilingual editorial publication.

Create accurate, useful, article-specific SEO metadata.

${getLanguageInstructions(language)}

Return exactly one valid JSON object with these fields:
{
  "metaTitle": "string",
  "metaDescription": "string",
  "keywords": ["string", "string", "string", "string", "string"],
  "excerpt": "string"
}

Requirements:
- metaTitle: ideally 50-60 characters; maximum 70.
- metaDescription: ideally 140-160 characters; maximum 170.
- keywords: 5-8 relevant phrases, not repetitive.
- excerpt: a useful summary of approximately 1-2 sentences.
- Do not invent facts or make claims absent from the article.
- Do not return Markdown or code fences.
- Follow the required language and writing system in every field.
- Base the metadata on the actual article, not just its title.

ARTICLE TITLE:
${normalizedTitle}

ARTICLE CONTENT:
${content || normalizedTitle}
`;

  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      console.info(
        `[SEO] Hive attempt ${attempt}/${MAX_ATTEMPTS}; model=${HIVE_MODEL}; language=${language}; jsonMode=${jsonModeEnabled}.`,
      );

      const response = await hive.chat.completions.create({
        model: HIVE_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are a professional multilingual SEO editor. Follow the requested language and writing system exactly. Return valid JSON only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
        max_tokens: MAX_OUTPUT_TOKENS,
        ...(jsonModeEnabled
          ? { response_format: { type: "json_object" as const } }
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
        // Show what the model actually returned so the problem is visible.
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

      // If the provider doesn't support response_format, retry without it.
      if (
        jsonModeEnabled &&
        getErrorStatus(error) === 400 &&
        /response_format|json_object|json mode/i.test(
          error instanceof Error ? error.message : "",
        )
      ) {
        jsonModeEnabled = false;
        console.warn("[SEO] response_format not supported; disabling JSON mode.");

        if (attempt < MAX_ATTEMPTS) {
          continue;
        }
      }

      if (attempt >= MAX_ATTEMPTS || !isRetryableError(error)) {
        break;
      }

      // Short backoff reduces repeated requests during brief service issues.
      await wait(attempt * 700);
    }
  }

  console.warn(
    `[SEO] Hive did not return valid metadata after ${MAX_ATTEMPTS} attempt(s). Using article-specific fallback metadata. Reason: ${getSafeErrorMessage(lastError)}`,
  );

  return createFallbackSEO(normalizedTitle, language, content);
}