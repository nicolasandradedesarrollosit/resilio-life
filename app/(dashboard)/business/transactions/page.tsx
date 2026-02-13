"use client";

import TableTransactions from "./_components/TableTransactions";

import {
  DashboardLayout,
  BUSINESS_NAV_ITEMS,
} from "@/shared/components/layout";

export default function TransaccionesPage() {
  return (
    <DashboardLayout
      currentPageName="Transacciones"
      items={BUSINESS_NAV_ITEMS}
      roleLabel="Negocio"
    >
      <TableTransactions />
    </DashboardLayout>
  );
}
