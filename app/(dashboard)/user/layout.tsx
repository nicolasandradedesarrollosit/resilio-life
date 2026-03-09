"use client";

import { ProtectedRoute } from "@/shared/components/guards";
import { useBenefitCatalog } from "@/features/benefitCatalog";
import { useRedeemedBenefits } from "@/features/redeemedBenefits";
import { useMapLocations } from "@/features/mapLocations";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useBenefitCatalog();
  useRedeemedBenefits();
  useMapLocations();

  return <ProtectedRoute>{children}</ProtectedRoute>;
}
