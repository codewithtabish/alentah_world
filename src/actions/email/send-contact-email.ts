// src/actions/email/send-contact-email.ts
"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type ContactData = {
  name: string;
  email: string;
  topic: string;
  message: string;
};

export async function sendContactEmail(data: ContactData) {
  try {
    if (!data.name || !data.email || !data.message) {
      return { success: false, error: "Missing required fields." };
    }

    // Email to YOU (ENEENA)
    const adminEmailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #171515;">
        <h2 style="color: #5E1428; border-bottom: 2px solid #5E1428; padding-bottom: 10px;">New Contact Message</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Topic:</strong> ${data.topic}</p>
        
        <div style="background: #FAF8F5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Message:</strong></p>
          <p style="margin-top: 5px;">${data.message}</p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: "ENEENA Contact <hello@eneena.com>",
      to: ["hello@eneena.com"],
      subject: `Contact: ${data.topic} from ${data.name}`,
      html: adminEmailHtml,
    });

    // Email to the USER (Confirmation)
    const userEmailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #171515;">
        <h2 style="color: #5E1428; text-align: center;">Message Received</h2>
        <p>Dear ${data.name},</p>
        <p>Thank you for reaching out to ENEENA. We have received your message regarding <strong>${data.topic}</strong>.</p>
        <p>Our team will review your message and get back to you as soon as possible.</p>
        <p style="margin-top: 30px; font-size: 12px; color: #77716A; text-align: center;">
          This is an automated message from ENEENA. Please do not reply directly to this email.
        </p>
      </div>
    `;

    await resend.emails.send({
      from: "ENEENA Editorial <hello@eneena.com>",
      to: [data.email],
      subject: `We received your message - ENEENA`,
      html: userEmailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error("Contact email sending failed:", error);
    return { success: false, error: "Failed to send message." };
  }
}