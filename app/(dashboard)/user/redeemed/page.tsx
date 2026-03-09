"use client";
import RedeemedBenefits from "./_components/RedeemedBenefits";
import { DashboardLayout, USER_NAV_ITEMS } from "@/shared/components/layout";

export default function RedeemedPage() {
  return (
    <DashboardLayout currentPageName="Canjeados" items={USER_NAV_ITEMS} roleLabel="Usuario">
      <RedeemedBenefits />
    </DashboardLayout>
  );
}
