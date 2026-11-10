"use client";

import { useState } from "react";
import { LoaderCircle, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { sendContactEmail } from "@/actions/email/send-contact-email";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      topic: formData.get("topic") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await sendContactEmail(data);
      if (res.success) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
        setErrorMessage(res.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("A network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label htmlFor="name" className="mb-1.5 block text-[13px] font-medium text-foreground">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          required
          placeholder="Your name"
          className="h-11 w-full rounded-md border border-border bg-background px-3 text-[13px] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium text-foreground">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="h-11 w-full rounded-md border border-border bg-background px-3 text-[13px] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Topic */}
      <div>
        <label htmlFor="topic" className="mb-1.5 block text-[13px] font-medium text-foreground">
          What is this regarding?
        </label>
        <select
          id="topic"
          name="topic"
          required
          className="h-11 w-full rounded-md border border-border bg-background px-3 text-[13px] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="">Select a topic</option>
          <option value="General Enquiry">General Enquiry</option>
          <option value="Editorial & Stories">Editorial & Stories</option>
          <option value="Advertising & Partnerships">Advertising & Partnerships</option>
          <option value="Technical Support">Technical Support</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="mb-1.5 block text-[13px] font-medium text-foreground">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder="How can we help you?"
          className="w-full resize-y rounded-md border border-border bg-background px-3 py-2.5 text-[13px] leading-relaxed outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
      >
        {isSubmitting ? (
          <><LoaderCircle size={16} className="animate-spin" /> Sending...</>
        ) : (
          <><Send size={16} /> Send Message</>
        )}
      </button>

      {/* Success / Error Alerts */}
      {status === "success" && (
        <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-3 text-[13px] text-green-800 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-300">
          <CheckCircle2 size={16} className="shrink-0" />
          <p>Your message has been sent successfully!</p>
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-[13px] text-destructive">
          <AlertCircle size={16} className="shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}
    </form>
  );
}