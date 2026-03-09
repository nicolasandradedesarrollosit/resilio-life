"use client";

import TableBenefits from "./_components/TableBenefits";

import {
  DashboardLayout,
  BUSINESS_NAV_ITEMS,
} from "@/shared/components/layout";

export default function BeneficiosPage() {
  return (
    <DashboardLayout
      currentPageName="Beneficios"
      items={BUSINESS_NAV_ITEMS}
      roleLabel="Negocio"
    >
      <TableBenefits />
    </DashboardLayout>
  );
}
