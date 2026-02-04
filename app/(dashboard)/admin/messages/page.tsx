"use client";

import TableMessages from "./_components/TableMessages";

import { DashboardLayout, ADMIN_NAV_ITEMS } from "@/shared/components/layout";

export default function MessagesPage() {
  return (
    <DashboardLayout
      currentPageName="Mensajes"
      items={ADMIN_NAV_ITEMS}
      roleLabel="Administrador"
    >
      <TableMessages />
    </DashboardLayout>
  );
}
