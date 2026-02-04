"use client";

import TableEvents from "./_components/TableEvents";

import { DashboardLayout, ADMIN_NAV_ITEMS } from "@/shared/components/layout";

export default function EventsPage() {
  return (
    <DashboardLayout
      currentPageName="Eventos"
      items={ADMIN_NAV_ITEMS}
      roleLabel="Administrador"
    >
      <TableEvents />
    </DashboardLayout>
  );
}
