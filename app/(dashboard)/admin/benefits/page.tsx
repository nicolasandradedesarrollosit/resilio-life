"use client";

import TableBenefits from "./_components/TableBenefits";

import { DashboardLayout, ADMIN_NAV_ITEMS } from "@/shared/components/layout";

export default function AdminBenefitsPage() {
  return (
    <DashboardLayout
      currentPageName="Beneficios"
      items={ADMIN_NAV_ITEMS}
      roleLabel="Administrador"
    >
      <TableBenefits />
    </DashboardLayout>
  );
}
