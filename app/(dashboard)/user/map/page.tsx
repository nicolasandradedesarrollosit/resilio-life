"use client";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { DashboardLayout, USER_NAV_ITEMS } from "@/shared/components/layout";

const BusinessMap = dynamic(() => import("./_components/BusinessMap"), { ssr: false });

export default function MapPage() {
  const searchParams = useSearchParams();
  const focusBusinessId = searchParams.get("business") ?? undefined;

  return (
    <DashboardLayout currentPageName="Mapa" items={USER_NAV_ITEMS} roleLabel="Usuario">
      <BusinessMap focusBusinessId={focusBusinessId} />
    </DashboardLayout>
  );
}
