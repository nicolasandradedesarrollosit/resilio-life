"use client";

import { DashboardLayout, USER_NAV_ITEMS } from "@/shared/components/layout";

export default function HomeUserPage() {
  return (
    <DashboardLayout
      currentPageName="Inicio"
      items={USER_NAV_ITEMS}
      roleLabel="Usuario"
    />
  );
}
