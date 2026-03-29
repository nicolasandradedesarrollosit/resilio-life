"use client";

import { useState } from "react";
import { useSelector } from "react-redux";

import { selectUserDataOnly } from "@/features/auth/authSlice";

export default function UnverifiedEmailBanner() {
  const user = useSelector(selectUserDataOnly);
  const [dismissed, setDismissed] = useState(false);
  const [resendStatus, setResendStatus] = useState<
    "idle" | "loading" | "sent" | "error"
  >("idle");

  if (!user || user.email_verified || dismissed) return null;

  const handleResend = async () => {
    setResendStatus("loading");
    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001";
      const res = await fetch(
        `${API_BASE_URL}/api/auth/resend-verification`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      setResendStatus(res.ok ? "sent" : "error");
    } catch {
      setResendStatus("error");
    }
  };

  return (
    <div className="w-full bg-amber-950 border-b border-amber-700 text-amber-200 px-4 py-2.5 flex items-center justify-between gap-4 text-sm">
      <span>
        {resendStatus === "sent"
          ? "Verification email sent! Check your inbox."
          : resendStatus === "error"
            ? "Failed to resend. Please try again."
            : "Please verify your email address to access all features."}
      </span>

      <div className="flex items-center gap-3 shrink-0">
        {resendStatus !== "sent" && (
          <button
            disabled={resendStatus === "loading"}
            onClick={handleResend}
            className="underline underline-offset-2 font-semibold hover:text-amber-100 disabled:opacity-50 transition-colors"
          >
            {resendStatus === "loading"
              ? "Sending..."
              : "Resend verification email"}
          </button>
        )}
        <button
          aria-label="Dismiss"
          onClick={() => setDismissed(true)}
          className="text-amber-400 hover:text-amber-200 transition-colors text-lg leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}
