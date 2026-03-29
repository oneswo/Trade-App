"use client";

import { useState } from "react";
import {
  DEFAULT_LOCALE,
  isSupportedLocale,
  type SupportedLocale,
} from "@/lib/i18n/locales";

export type SubmitState = "idle" | "loading" | "success" | "error";

interface UseInquirySubmitOptions {
  source: string;
}

const SUBMIT_MESSAGES: Record<
  SupportedLocale,
  {
    rateLimit: string;
    failed: string;
    success: string;
    network: string;
  }
> = {
  zh: {
    rateLimit: "提交频繁，请稍后再试。",
    failed: "提交失败，请检查信息后重试。",
    success: "提交成功，我们会尽快联系您。",
    network: "网络异常，请稍后重试。",
  },
  en: {
    rateLimit: "Too many submissions. Please try again later.",
    failed: "Submission failed. Please check your information and retry.",
    success: "Inquiry sent successfully. We will contact you soon.",
    network: "Network error. Please try again later.",
  },
};

function detectLocaleFromPath(pathname: string): SupportedLocale {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  if (firstSegment && isSupportedLocale(firstSegment)) {
    return firstSegment;
  }
  return DEFAULT_LOCALE;
}

export function useInquirySubmit({ source }: UseInquirySubmitOptions) {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState("loading");
    setSubmitMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const contact = String(formData.get("contact") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const website = String(formData.get("website") ?? "").trim();

    const locale = detectLocaleFromPath(window.location.pathname);
    const messages = SUBMIT_MESSAGES[locale];

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          contact,
          message,
          website,
          locale,
          source,
          pagePath: window.location.pathname,
        }),
      });

      const result = (await response.json()) as {
        ok: boolean;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        setSubmitState("error");
        if (response.status === 429) {
          setSubmitMessage(messages.rateLimit);
          return;
        }
        if (result.error === "validation_failed") {
          setSubmitMessage(messages.failed + " (测试时请多输几个字)");
          return;
        }
        setSubmitMessage(messages.failed);
        return;
      }

      form.reset();
      setSubmitState("success");
      setSubmitMessage(messages.success);
    } catch {
      setSubmitState("error");
      setSubmitMessage(messages.network);
    }
  };

  return {
    submitState,
    submitMessage,
    handleSubmit,
  };
}
