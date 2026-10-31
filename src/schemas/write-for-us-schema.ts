// src/schemas/write-for-us-schema.ts
// Shared by the client form and the server action. No "use server" here.

export const SUBMISSION_LANGUAGES = ["English", "Urdu", "Arabic"] as const;
export const ALLOWED_EXTENSIONS: readonly string[] = ["pdf", "doc", "docx"];
export const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
export const OTHER_CATEGORY_ID = "other";

export type CategoryOption = {
  id: string;
  name: string;
  languageName: string;
};

export type SubmissionField =
  | "name"
  | "email"
  | "title"
  | "categoryId"
  | "language"
  | "summary"
  | "portfolio"
  | "file"
  | "confirm";

export type SubmissionValues = {
  name: string;
  email: string;
  title: string;
  categoryId: string;
  language: string;
  summary: string;
  portfolio: string;
  confirm: boolean;
};

export type SubmissionFieldErrors = Partial<Record<SubmissionField, string>>;

export type SubmissionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: SubmissionFieldErrors;
  values?: Partial<SubmissionValues>;
};

export const INITIAL_SUBMISSION_STATE: SubmissionState = { status: "idle" };

export type ValidatedSubmission = SubmissionValues & {
  fileName: string;
  fileSize: number;
};

export type SubmissionValidation =
  | { ok: true; data: ValidatedSubmission }
  | { ok: false; fieldErrors: SubmissionFieldErrors; values: SubmissionValues };

function text(formData: FormData, key: string, max: number): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSubmission(formData: FormData): SubmissionValidation {
  const values: SubmissionValues = {
    name: text(formData, "name", 100),
    email: text(formData, "email", 254),
    title: text(formData, "title", 150),
    categoryId: text(formData, "categoryId", 100),
    language: text(formData, "language", 20),
    summary: text(formData, "summary", 500),
    portfolio: text(formData, "portfolio", 300),
    confirm: formData.get("confirm") === "on",
  };

  const errors: SubmissionFieldErrors = {};

  if (values.name.length < 2) errors.name = "Please enter your full name.";

  if (!EMAIL_PATTERN.test(values.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (values.title.length < 5) {
    errors.title = "Please enter an article title (at least 5 characters).";
  }

  if (!values.categoryId) errors.categoryId = "Please choose a category.";

  if (!(SUBMISSION_LANGUAGES as readonly string[]).includes(values.language)) {
    errors.language = "Please choose a language.";
  }

  if (values.summary.length < 20) {
    errors.summary = "Please add a brief summary (at least 20 characters).";
  }

  if (values.portfolio) {
    const withProtocol = /^https?:\/\//i.test(values.portfolio)
      ? values.portfolio
      : `https://${values.portfolio}`;
    try {
      const url = new URL(withProtocol);
      if (!url.hostname.includes(".")) throw new Error("Invalid host");
    } catch {
      errors.portfolio = "Please enter a valid website address.";
    }
  }

  const file = formData.get("file");
  let fileName = "";
  let fileSize = 0;

  if (!(file instanceof File) || file.size === 0) {
    errors.file = "Please attach your article (PDF, DOC or DOCX).";
  } else {
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    fileName = file.name;
    fileSize = file.size;

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      errors.file = "Only PDF, DOC and DOCX files are accepted.";
    } else if (file.size > MAX_FILE_BYTES) {
      errors.file = "The file is larger than 10 MB.";
    }
  }

  if (!values.confirm) {
    errors.confirm = "Please confirm that this is your original work.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, fieldErrors: errors, values };
  }

  return { ok: true, data: { ...values, fileName, fileSize } };
}