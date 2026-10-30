// src/actions/contact/contact-schema.ts
// Shared by the server action and the client form (no "use server" here, so
// constants and types can be imported from both sides).

export const ENQUIRY_TYPES = [
  "General Enquiry",
  "Editorial & Story Submission",
  "Advertising & Partnership",
  "Technical Support",
  "Other",
] as const;

export type ContactField =
  | "name"
  | "email"
  | "subject"
  | "enquiryType"
  | "message";

export type ContactValues = Record<ContactField, string>;

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<ContactField, string>>;
  values?: Partial<ContactValues>;
};

export const INITIAL_CONTACT_STATE: ContactState = { status: "idle" };

type ValidationResult =
  | { ok: true; data: ContactValues }
  | {
      ok: false;
      fieldErrors: Partial<Record<ContactField, string>>;
      values: ContactValues;
    };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function read(formData: FormData, key: ContactField) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function validateContact(formData: FormData): ValidationResult {
  const values: ContactValues = {
    name: read(formData, "name"),
    email: read(formData, "email"),
    subject: read(formData, "subject"),
    enquiryType: read(formData, "enquiryType"),
    message: read(formData, "message"),
  };

  const fieldErrors: Partial<Record<ContactField, string>> = {};

  if (values.name.length < 2) fieldErrors.name = "Please enter your full name.";
  else if (values.name.length > 100) fieldErrors.name = "Name is too long.";

  if (!EMAIL_RE.test(values.email) || values.email.length > 254)
    fieldErrors.email = "Please enter a valid email address.";

  if (values.subject.length < 3) fieldErrors.subject = "Please add a short subject.";
  else if (values.subject.length > 150) fieldErrors.subject = "Subject is too long.";

  if (!(ENQUIRY_TYPES as readonly string[]).includes(values.enquiryType))
    fieldErrors.enquiryType = "Please select an enquiry type.";

  if (values.message.length < 10)
    fieldErrors.message = "Please write at least a few words (10+ characters).";
  else if (values.message.length > 5000)
    fieldErrors.message = "Message is too long (5,000 characters max).";

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors, values };
  }

  return { ok: true, data: values };
}