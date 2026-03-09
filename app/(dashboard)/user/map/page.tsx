"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { DashboardLayout, USER_NAV_ITEMS } from "@/shared/components/layout";

const BusinessMap = dynamic(() => import("./_components/BusinessMap"), {
  ssr: false,
});

function MapContent() {
  const searchParams = useSearchParams();
  const focusBusinessId = searchParams.get("business") ?? undefined;

  return <BusinessMap focusBusinessId={focusBusinessId} />;
}

export default function MapPage() {
  return (
    <DashboardLayout
      currentPageName="Mapa"
      items={USER_NAV_ITEMS}
      roleLabel="Usuario"
    >
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-magenta-fuchsia-600" />
          </div>
        }
      >
        <MapContent />
      </Suspense>
    </DashboardLayout>
  );
}
