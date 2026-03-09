"use client";
import UserProfile from "./_components/UserProfile";
import { DashboardLayout, USER_NAV_ITEMS } from "@/shared/components/layout";

export default function ProfilePage() {
  return (
    <DashboardLayout currentPageName="Perfil" items={USER_NAV_ITEMS} roleLabel="Usuario">
      <UserProfile />
    </DashboardLayout>
  );
}
