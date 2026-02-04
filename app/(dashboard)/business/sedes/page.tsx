"use client";

import TableSedes from "./_components/TableSedes";

import { DashboardLayout, BUSINESS_NAV_ITEMS } from "@/shared/components/layout";

export default function SedesPage() {
  return (
    <DashboardLayout
      currentPageName="Sedes"
      items={BUSINESS_NAV_ITEMS}
      roleLabel="Negocio"
    >
      <TableSedes />
    </DashboardLayout>
  );
}
