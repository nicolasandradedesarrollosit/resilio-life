"use client";

import { useState } from "react";

export default function ResendButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle",
  );

  const handleResend = async () => {
    setStatus("loading");
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
      if (res.ok) {
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <p className="text-sm text-green-400">
        Verification email sent! Check your inbox.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        disabled={status === "loading"}
        onClick={handleResend}
        className="px-6 py-2 rounded-lg bg-[#9659f9] text-white text-sm font-semibold hover:bg-[#7c3aed] disabled:opacity-50 transition-colors"
      >
        {status === "loading" ? "Sending..." : "Resend verification email"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-400">
          Failed to resend. Please try again.
        </p>
      )}
    </div>
  );
}
