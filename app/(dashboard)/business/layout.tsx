"use client";

import { ProtectedRoute } from "@/shared/components/guards";
import { useBenefits } from "@/features/benefits";
import { useSedes } from "@/features/headquarters";
import { useTransactions } from "@/features/transactions";

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useSedes();
  useBenefits();
  useTransactions();

  return <ProtectedRoute>{children}</ProtectedRoute>;
}
