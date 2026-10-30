// src/actions/contact/submit-contact.ts
"use server";

import { ContactState, ContactValues, validateContact } from "@/schemas/contact-schema";


const SUCCESS_MESSAGE =
  "Thank you. Your message has been sent and the right team will be in touch.";

/**
 * TODO: wire up real delivery before going live. Pick one:
 *  - Email provider (Resend, Postmark, Nodemailer/SMTP) to your inbox
 *  - Save to your database with Prisma (e.g. a ContactMessage model)
 * Right now this only logs a non-personal summary so nothing is silently lost
 * during development. Throw an error here if delivery fails and the form will
 * show a friendly error.
 */
async function deliverContactMessage(data: ContactValues) {
  console.info("[contact] new message received", {
    enquiryType: data.enquiryType,
    subjectLength: data.subject.length,
    messageLength: data.message.length,
  });
}

export async function submitContact(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot: real people never fill this hidden field. Pretend it worked.
  const trap = formData.get("company_website");
  if (typeof trap === "string" && trap.trim() !== "") {
    return { status: "success", message: SUCCESS_MESSAGE };
  }

  const result = validateContact(formData);

  if (!result.ok) {
    return {
      status: "error",
      message: "Please check the highlighted fields and try again.",
      fieldErrors: result.fieldErrors,
      values: result.values,
    };
  }

  try {
    await deliverContactMessage(result.data);
  } catch (error) {
    console.error("[contact] delivery failed", error);
    return {
      status: "error",
      message:
        "Something went wrong while sending your message. Please try again in a moment.",
      values: result.data,
    };
  }

  return { status: "success", message: SUCCESS_MESSAGE };
}