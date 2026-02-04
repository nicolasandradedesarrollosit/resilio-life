"use client";

import TableUsers from "./_components/TableUsers";

import { DashboardLayout, ADMIN_NAV_ITEMS } from "@/shared/components/layout";

export default function HomeAdminPage() {
  return (
    <DashboardLayout
      currentPageName="Usuarios"
      items={ADMIN_NAV_ITEMS}
      roleLabel="Administrador"
    >
      <TableUsers />
    </DashboardLayout>
  );
}
