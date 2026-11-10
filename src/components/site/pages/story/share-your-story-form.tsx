"use client";

import Image from "next/image";
import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useUser, useClerk } from "@clerk/nextjs";

import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Globe2,
  LoaderCircle,
  Send,
  UploadCloud,
  X,
  User,
  Mail,
  Link as LinkIcon,
} from "lucide-react";

import type { LanguageListItem } from "@/actions/language/get-languages";
import { uploadFellowDocumentAction } from "@/actions/images/upload-documenet-action";
import { uploadProfileImageAction } from "@/actions/images/upload-profile-image-action";
import { sendStorySubmissionEmail } from "@/actions/email/send-story-submission-email";

// ============================================================
// TYPES
// ============================================================

type UploadedDocument = {
  storageKey: string;
  originalFileName: string;
  mimeType: string;
  fileSize: number;
};

type Props = {
  languages: LanguageListItem[];
  languageError?: string | null;
};

// ============================================================
// CONSTANTS
// ============================================================

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const EDITORIAL_GUIDELINES = [
  "Send original work.",
  "Include a clear and informative story introduction.",
  "Select the language in which the story is written.",
  "Ensure you have the right to submit the manuscript and profile image.",
  "Our editorial team reviews submissions independently.",
  "Submission does not guarantee acceptance or publication.",
  "ENEENA may contact you using your email address when necessary.",
];

// ============================================================
// HELPERS
// ============================================================

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// ============================================================
// COMPONENT
// ============================================================

export default function ShareYourStoryForm({
  languages,
  languageError,
}: Props) {
  const { isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileImageRef = useRef<HTMLInputElement>(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [language, setLanguage] = useState("");
  const [authorName, setAuthorName] = useState(user?.fullName || "");
  const [authorEmail, setAuthorEmail] = useState(user?.primaryEmailAddress?.emailAddress || "");
  const [authorSocial, setAuthorSocial] = useState("");

  // Profile Image State
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);

  // Manuscript
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedDocument, setUploadedDocument] = useState<UploadedDocument | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // UI
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailIntegrationNotice, setEmailIntegrationNotice] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [declaration, setDeclaration] = useState(false);

  const selectedLanguage = languages.find((item) => item.code === language);
  const isRTL = selectedLanguage?.direction === "RTL";

  // ==========================================================
  // RESET FORM
  // ==========================================================
  const resetForm = () => {
    setTitle("");
    setIntroduction("");
    setLanguage("");
    setAuthorName(user?.fullName || "");
    setAuthorEmail(user?.primaryEmailAddress?.emailAddress || "");
    setAuthorSocial("");
    setProfileImageUrl("");
    setSelectedFile(null);
    setUploadedDocument(null);
    setDeclaration(false);
    setFormError("");
    setUploadError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (profileImageRef.current) profileImageRef.current.value = "";
  };

  // ==========================================================
  // AUTH CHECK
  // ==========================================================
  const handleAuthCheck = () => {
    if (!isSignedIn) {
      openSignIn({
        forceRedirectUrl: "/share-your-story",
        signUpForceRedirectUrl: "/share-your-story",
      });
      return true;
    }
    return false;
  };

  // ==========================================================
  // PROFILE IMAGE UPLOAD
  // ==========================================================
  async function handleProfileUpload(event: ChangeEvent<HTMLInputElement>) {
    if (handleAuthCheck()) return;

    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Please upload a valid image file.");
      return;
    }

    setIsUploadingProfile(true);
    setFormError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadProfileImageAction(formData);
      
      if (res.success && res.url) {
        setProfileImageUrl(res.url);
      } else {
        setFormError(res.error || "Failed to upload profile image.");
      }
    } catch (error) {
      console.error("Profile upload error:", error);
      setFormError("An error occurred while uploading the profile image.");
    } finally {
      setIsUploadingProfile(false);
      if (profileImageRef.current) profileImageRef.current.value = "";
    }
  }

  // ==========================================================
  // DOCUMENT UPLOAD
  // ==========================================================
  async function uploadDocument(file: File) {
    if (handleAuthCheck()) return;

    setUploadError("");
    setUploadedDocument(null);
    setEmailIntegrationNotice(false);
    setFormError("");

    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError("Only PDF, DOC and DOCX documents are supported.");
      return;
    }
    if (file.size === 0) {
      setUploadError("The selected document is empty.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setUploadError("Your document must be smaller than 5 MB.");
      return;
    }

    setSelectedFile(file);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadFellowDocumentAction(formData);

      if (!result.success) {
        setUploadError(result.error);
        setSelectedFile(null);
        return;
      }

      setUploadedDocument({
        storageKey: result.data.storageKey,
        originalFileName: result.data.originalFileName,
        mimeType: result.data.mimeType,
        fileSize: result.data.fileSize,
      });
    } catch (error) {
      console.error("Document upload error:", error);
      setUploadError("Unable to upload your document. Please try again.");
      setSelectedFile(null);
    } finally {
      setIsUploading(false);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) void uploadDocument(file);
  }

  function removeDocument() {
    setSelectedFile(null);
    setUploadedDocument(null);
    setUploadError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    if (handleAuthCheck()) return;
    const file = event.dataTransfer.files?.[0];
    if (file) void uploadDocument(file);
  }

  // ==========================================================
  // SUBMIT
  // ==========================================================
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (handleAuthCheck()) return;

    setFormError("");
    setEmailIntegrationNotice(false);

    if (!title.trim()) return setFormError("Please enter your story title.");
    if (!introduction.trim()) return setFormError("Please introduce your story.");
    if (!language) return setFormError("Please select your publication language.");
    if (!profileImageUrl) return setFormError("Please upload your profile image.");
    if (!uploadedDocument) return setFormError("Please upload your manuscript first.");
    if (!authorName.trim()) return setFormError("Please provide your name.");
    if (!authorEmail.trim()) return setFormError("Please provide your email.");
    if (!declaration) return setFormError("Please accept the submission declaration.");

    setIsSubmitting(true);

    try {
      const res = await sendStorySubmissionEmail({
        title,
        introduction,
        language,
        profileImageUrl,
        author: {
          name: authorName,
          email: authorEmail,
          social: authorSocial || null,
        },
        manuscript: uploadedDocument,
      });

      if (res.success) {
        // 👇 Show success message
        setEmailIntegrationNotice(true);
        // 👇 Clear all the fields
        resetForm();
      } else {
        setFormError(res.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setFormError("A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // ==========================================================
  // RENDER
  // ==========================================================
  return (
    <div className="w-full min-w-0 text-foreground">
      {/* HERO */}
      <section className="relative isolate min-h-85 overflow-hidden border-b border-border sm:min-h-97.5 lg:min-h-107.5">
        <div className="absolute inset-y-0 right-0 -z-10 w-full lg:w-[65%]">
          <Image
            src="/images/story/eneena-share-your-story-hero-1600x900.webp"
            alt="A literary still life representing international storytelling"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 65vw"
            className="object-cover object-right"
          />
          <div className="absolute inset-0 bg-linear-to-r from-background via-background/90 to-transparent" />
        </div>

        <div className="relative mx-auto flex min-h-85 max-w-[1600px] items-center py-12 sm:min-h-97.5 lg:min-h-107.5">
          <div className="max-w-180">
            <div className="mb-5 flex items-center gap-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.17em] text-primary sm:text-sm">
                Open Editorial Invitation
              </span>
              <span className="h-px w-10 bg-primary" />
            </div>
            <h1 className="text-[43px] leading-[1.04] tracking-[-0.045em] text-foreground sm:text-[60px] lg:text-[76px]">
              Every Story <br /> Deserves a Voice.
            </h1>
            <p className="mt-6 max-w-137.5 text-[15px] leading-7 text-muted-foreground sm:text-[17px] sm:leading-8">
              Have a perspective, an experience or an idea worth sharing? ENEENA welcomes original stories from voices around the world. Send your proposal directly to our editorial team.
            </p>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-8 py-8 lg:grid-cols-[0.72fr_1.48fr] lg:gap-7 lg:py-7">
        {/* SIDEBAR */}
        <aside className="min-w-0">
          <div className="overflow-hidden rounded-2xl border border-border">
            <div className="relative aspect-4/3 w-full">
              <Image
                src="/images/story/eneena-world-map-sidebar-1200x900.webp"
                alt="Vintage burgundy world map representing stories from around the world"
                fill
                sizes="(max-width: 1024px) 100vw, 35vw"
                className="object-cover"
              />
            </div>
            <div className="py-5 text-center">
              <p className="text-[19px] italic leading-7 text-foreground">
                Real Stories. <br /> A More Connected World.
              </p>
              <div className="mt-5 flex items-center justify-center gap-1">
                <span className="h-px w-12 bg-primary" />
                <span className="h-1.5 w-1.5 rotate-45 bg-primary" />
                <span className="h-px w-12 bg-primary" />
              </div>
            </div>
          </div>

          <div className="mt-7 sm:mt-9">
            <h2 className="mb-5 text-[25px] font-semibold text-foreground sm:text-[29px]">
              Before You Submit
            </h2>
            <ul className="space-y-4">
              {EDITORIAL_GUIDELINES.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={19} strokeWidth={2} className="mt-0.5 shrink-0 text-primary" />
                  <span className="text-[14px] leading-[1.65] text-muted-foreground sm:text-[15px]">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 border-l-2 border-primary pl-4">
            <p className="text-[17px] italic leading-7 text-foreground">
              Every perspective adds something valuable to the global conversation.
            </p>
          </div>
        </aside>

        {/* FORM */}
        <div className="min-w-0 rounded-2xl border border-border bg-background p-6 shadow-sm sm:p-8">
          <div className="mb-7 flex items-center justify-center gap-4">
            <span className="hidden h-px flex-1 bg-border sm:block" />
            <h2 className="whitespace-nowrap text-[29px] text-foreground sm:text-[36px]">
              Share Your Story
            </h2>
            <span className="hidden h-px flex-1 bg-border sm:block" />
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* 01 TITLE */}
            <div>
              <label className="mb-2 flex items-center gap-3 text-[16px] font-semibold text-foreground">
                <span className="text-primary">01.</span> Story Title <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={180}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your story a compelling title."
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-[14px] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>

            {/* 02 INTRODUCTION */}
            <div>
              <label className="mb-2 flex items-center gap-3 text-[16px] font-semibold text-foreground">
                <span className="text-primary">02.</span> About Your Story <span className="text-destructive">*</span>
              </label>
              <textarea
                required
                rows={4}
                dir={isRTL ? "rtl" : "auto"}
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
                placeholder="Briefly introduce your story."
                className="w-full resize-y rounded-xl border border-border bg-background px-3 py-3 text-[14px] leading-6 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>

            {/* 03 LANGUAGE */}
            <div>
              <label className="mb-2 flex items-center gap-3 text-[16px] font-semibold text-foreground">
                <span className="text-primary">03.</span> Publication Language <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Globe2 size={19} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                <select
                  required
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="h-11 w-full appearance-none rounded-xl border border-border bg-background pl-10 pr-10 text-[14px] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                >
                  <option value="">Select Language</option>
                  {languages.map((item) => (
                    <option key={item.id} value={item.code}>{item.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 04 AUTHOR DETAILS */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <User size={16} className="text-primary" /> Your Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-[14px] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </div>
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Mail size={16} className="text-primary" /> Email <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-[14px] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                <LinkIcon size={16} className="text-primary" /> Social Link (Optional)
              </label>
              <input
                type="url"
                value={authorSocial}
                onChange={(e) => setAuthorSocial(e.target.value)}
                placeholder="https://twitter.com/yourhandle"
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-[14px] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>

            {/* 05 PROFILE IMAGE UPLOAD */}
            <div>
              <label className="mb-2 flex items-center gap-3 text-[16px] font-semibold text-foreground">
                <span className="text-primary">04.</span> Profile Image <span className="text-destructive">*</span>
              </label>
              
              <input
                ref={profileImageRef}
                type="file"
                accept="image/*"
                onChange={handleProfileUpload}
                className="hidden"
              />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_170px]">
                <div className="flex flex-col justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (handleAuthCheck()) return;
                      profileImageRef.current?.click();
                    }}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
                  >
                    {isUploadingProfile ? (
                      <><LoaderCircle size={16} className="animate-spin" /> Uploading...</>
                    ) : (
                      <><UploadCloud size={16} /> {profileImageUrl ? "Change Image" : "Upload Image"}</>
                    )}
                  </button>
                  
                  <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
                    Your profile image will be shown on the article site.
                  </p>
                </div>

                <div className="relative aspect-square overflow-hidden rounded-full border border-border bg-muted sm:size-22">
                  {profileImageUrl ? (
                    <img src={profileImageUrl} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                      <User size={23} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 06 MANUSCRIPT UPLOAD */}
            <div>
              <label className="mb-2 flex items-center gap-3 text-[16px] font-semibold text-foreground">
                <span className="text-primary">05.</span> Upload Your Manuscript <span className="text-destructive">*</span>
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="sr-only"
              />

              {!uploadedDocument && (
                <div
                  onClick={() => {
                    if (handleAuthCheck()) return;
                    fileInputRef.current?.click();
                  }}
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  className={`flex min-h-31.25 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-5 text-center transition ${
                    isDragging ? "border-primary bg-primary/5" : "border-border bg-muted/30 hover:border-primary/40 hover:bg-muted/50"
                  }`}
                >
                  {isUploading ? <LoaderCircle size={33} className="mb-2 animate-spin text-primary" /> : <UploadCloud size={36} className="mb-2 text-muted-foreground" />}
                  <p className="text-[14px] font-medium text-foreground">{isUploading ? "Uploading..." : "Drag and drop your file here"}</p>
                  <p className="mt-0.5 text-[13px] text-muted-foreground">or click to browse</p>
                  <p className="mt-2 text-[10px] text-muted-foreground">PDF, DOC, DOCX • Maximum size: 5 MB</p>
                </div>
              )}

              {selectedFile && (
                <div className="mt-2 flex items-center justify-between rounded-xl border border-border bg-background px-3 py-3">
                  <div className="flex items-center gap-3">
                    <FileText size={21} className="text-primary" />
                    <div>
                      <p className="truncate text-[13px] font-medium">{selectedFile.name}</p>
                      <p className="text-[11px] text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                  <button type="button" onClick={removeDocument} className="text-destructive"><X size={15} /></button>
                </div>
              )}
            </div>

            {/* 07 DECLARATION */}
            <div>
              <label className="mb-3 flex items-center gap-3 text-[16px] font-semibold text-foreground">
                <span className="text-primary">06.</span> Declaration <span className="text-destructive">*</span>
              </label>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  required
                  checked={declaration}
                  onChange={(e) => setDeclaration(e.target.checked)}
                  className="mt-1 size-4.25 shrink-0 accent-primary"
                />
                <span className="text-[12px] leading-[1.7] text-muted-foreground">
                  I confirm that this is my original work and I understand that submission does not guarantee publication.
                </span>
              </label>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting || isUploading || !uploadedDocument || isUploadingProfile || !profileImageUrl}
              className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-primary px-5 py-3 text-[16px] font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-55"
            >
              {isSubmitting ? (
                <><LoaderCircle size={17} className="animate-spin" /> Sending...</>
              ) : (
                <><Send size={17} /> Send Your Story to ENEENA</>
              )}
            </button>

            {/* SUCCESS MESSAGE */}
            {emailIntegrationNotice && (
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center dark:border-green-900/50 dark:bg-green-900/20">
                <CheckCircle2 className="mx-auto mb-2 size-6 text-green-600 dark:text-green-400" />
                <p className="font-semibold text-green-800 dark:text-green-300">
                  Your story has been received!
                </p>
                <p className="mt-1 text-sm text-green-700 dark:text-green-400">
                  We have sent a confirmation to your email. Our editorial team will review your submission.
                </p>
              </div>
            )}

            {/* FORM ERROR */}
            {formError && (
              <div className="flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle size={17} className="mt-0.5 shrink-0" />
                <p>{formError}</p>
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}