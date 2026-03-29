"use client";

import { Suspense } from "react";
import { Spinner } from "@heroui/spinner";

import { DashboardLayout, USER_NAV_ITEMS } from "@/shared/components/layout";
import { PointsMarket } from "@/features/payments";

export default function PuntosPage() {
  return (
    <DashboardLayout currentPageName="Puntos" items={USER_NAV_ITEMS} roleLabel="Usuario">
      <div className="p-6 md:p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Mercado de Puntos</h1>
          <p className="text-gray-500 mt-1">Adquirí puntos para canjear beneficios exclusivos.</p>
        </div>
        <Suspense fallback={<Spinner size="lg" color="secondary" />}>
          <PointsMarket />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}
