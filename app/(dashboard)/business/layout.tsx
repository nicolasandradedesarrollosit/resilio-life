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
  // Fetch all business data
  useBenefits();
  useSedes();
  useTransactions();

  return <ProtectedRoute>{children}</ProtectedRoute>;
}
