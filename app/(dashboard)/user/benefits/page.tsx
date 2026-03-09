"use client";
import BenefitsCatalog from "./_components/BenefitsCatalog";
import { DashboardLayout, USER_NAV_ITEMS } from "@/shared/components/layout";

export default function BenefitsUserPage() {
  return (
    <DashboardLayout currentPageName="Beneficios" items={USER_NAV_ITEMS} roleLabel="Usuario">
      <BenefitsCatalog />
    </DashboardLayout>
  );
}
