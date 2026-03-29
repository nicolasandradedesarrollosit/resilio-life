"use client";

import { Suspense } from "react";
import { Spinner } from "@heroui/spinner";

import { DashboardLayout, USER_NAV_ITEMS } from "@/shared/components/layout";
import { PointsMarket } from "@/features/payments";

export default function PuntosPage() {
  return (
    <DashboardLayout currentPageName="Puntos" items={USER_NAV_ITEMS} roleLabel="Usuario">
      <div className="p-4 md:p-8 pb-8 md:pb-12">
        <div className="mb-5 md:mb-8">
          <h1 className="text-lg md:text-2xl font-bold text-gray-900">Mercado de Puntos</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Adquirí puntos para canjear beneficios exclusivos.</p>
        </div>
        <Suspense fallback={<Spinner size="lg" color="secondary" />}>
          <PointsMarket />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}
