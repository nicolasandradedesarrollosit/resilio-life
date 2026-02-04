"use client";

import { DashboardLayout, BUSINESS_NAV_ITEMS } from "@/shared/components/layout";

export default function BusinessPage() {
  return (
    <DashboardLayout
      currentPageName="Inicio"
      items={BUSINESS_NAV_ITEMS}
      roleLabel="Negocio"
    />
  );
}
