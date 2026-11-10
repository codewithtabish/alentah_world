// src/actions/email/send-story-submission-email.ts
"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type SubmissionData = {
  title: string;
  introduction: string;
  language: string;
  profileImageUrl: string;
  author: {
    name: string;
    email: string;
    social: string | null;
  };
  manuscript: {
    storageKey: string;
    originalFileName: string;
    mimeType: string;
    fileSize: number;
  };
};

export async function sendStorySubmissionEmail(data: SubmissionData) {
  try {
    // 1. The Manuscript URL (Assuming your S3 bucket is public or via CloudFront)
    const manuscriptUrl = `${process.env.AWS_CLOUDFRONT_URL}/${data.manuscript.storageKey}`;

    // 2. Email to YOU (The Editorial Team)
    const adminEmailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #171515;">
        <h2 style="color: #5E1428; border-bottom: 2px solid #5E1428; padding-bottom: 10px;">New Story Submission</h2>
        <p><strong>Title:</strong> ${data.title}</p>
        <p><strong>Language:</strong> ${data.language.toUpperCase()}</p>
        <p><strong>Author:</strong> ${data.author.name} (${data.author.email})</p>
        ${data.author.social ? `<p><strong>Social:</strong> <a href="${data.author.social}">${data.author.social}</a></p>` : ""}
        
        <div style="background: #FAF8F5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Introduction:</strong></p>
          <p style="margin-top: 5px; font-style: italic;">"${data.introduction}"</p>
        </div>

        <p><strong>Profile Image:</strong> <a href="${data.profileImageUrl}">View Image</a></p>
        <p><strong>Manuscript File:</strong> <a href="${manuscriptUrl}">${data.manuscript.originalFileName}</a></p>
      </div>
    `;

    await resend.emails.send({
      from: "ENEENA Submissions <hello@eneena.com>",
      to: ["hello@eneena.com"], // Your receiving email
      subject: `New Submission: ${data.title} by ${data.author.name}`,
      html: adminEmailHtml,
    });

    // 3. Email to the USER (Confirmation)
    const userEmailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #171515;">
        <h2 style="color: #5E1428; text-align: center;">Story Received</h2>
        <p>Dear ${data.author.name},</p>
        <p>Thank you for sharing your story, <strong>"${data.title}"</strong>, with ENEENA.</p>
        <p>Our editorial team is currently reviewing your submission. We will be in touch if we decide to move forward with publication.</p>
        <p>You can view your submission details below:</p>
        <ul>
          <li><strong>Title:</strong> ${data.title}</li>
          <li><strong>File:</strong> ${data.manuscript.originalFileName}</li>
        </ul>
        <p style="margin-top: 30px; font-size: 12px; color: #77716A; text-align: center;">
          This is an automated message from ENEENA. Please do not reply directly to this email.
        </p>
      </div>
    `;

    await resend.emails.send({
      from: "ENEENA Editorial <hello@eneena.com>",
      to: [data.author.email], // The user's email
      subject: `We received your story: ${data.title}`,
      html: userEmailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error: "Failed to send email." };
  }
}