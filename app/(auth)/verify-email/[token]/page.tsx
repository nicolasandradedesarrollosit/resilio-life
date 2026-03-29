import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";

import ResendButton from "./_components/ResendButton";

interface Props {
  params: Promise<{ token: string }>;
}

async function verifyToken(token: string): Promise<boolean> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001";
    const res = await fetch(`${apiUrl}/api/auth/verify-email/${token}`, {
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export default async function VerifyEmailPage({ params }: Props) {
  const { token } = await params;
  const success = await verifyToken(token);

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#1a1a2e] rounded-xl overflow-hidden">
        {/* Gradient accent bar */}
        <div
          className="h-1 w-full"
          style={{
            background: "linear-gradient(90deg, #9659f9, #c084fc)",
          }}
        />

        <div className="p-10 flex flex-col items-center text-center gap-6">
          {success ? (
            <>
              <CheckCircle className="text-[#9659f9]" size={56} />
              <div>
                <h1 className="text-2xl font-bold text-[#e2e8f0] mb-2">
                  Email Verified!
                </h1>
                <p className="text-[#94a3b8] text-sm leading-relaxed">
                  Your email has been verified successfully. You can now access
                  all features of Resilio Life.
                </p>
              </div>
              <Link
                href="/"
                className="px-8 py-3 rounded-lg bg-[#9659f9] text-white font-semibold hover:bg-[#7c3aed] transition-colors"
              >
                Go to Dashboard
              </Link>
            </>
          ) : (
            <>
              <XCircle className="text-red-500" size={56} />
              <div>
                <h1 className="text-2xl font-bold text-[#e2e8f0] mb-2">
                  Link Expired or Already Used
                </h1>
                <p className="text-[#94a3b8] text-sm leading-relaxed">
                  This verification link is invalid, has expired, or has already
                  been used. Request a new one below.
                </p>
              </div>
              <ResendButton />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
