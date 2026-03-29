"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@heroui/spinner";
import { CheckCircle, XCircle, Clock, X } from "lucide-react";

import { usePackages } from "@/features/payments/hooks/usePackages";
import { paymentsService } from "@/features/payments/services/paymentsService";
import { PointsPackageCard } from "./PointsPackageCard";

const ALERT_CONFIG = {
  success: {
    icon: CheckCircle,
    text: "¡Pago exitoso! Tus puntos serán acreditados en breve.",
    bg: "bg-green-50 border-green-200",
    iconColor: "text-green-600",
    textColor: "text-green-800",
  },
  failure: {
    icon: XCircle,
    text: "El pago no pudo procesarse. Intentá de nuevo.",
    bg: "bg-red-50 border-red-200",
    iconColor: "text-red-600",
    textColor: "text-red-800",
  },
  pending: {
    icon: Clock,
    text: "Pago pendiente. Te avisaremos cuando se confirme.",
    bg: "bg-yellow-50 border-yellow-200",
    iconColor: "text-yellow-600",
    textColor: "text-yellow-800",
  },
};

export function PointsMarket() {
  const { packages, loading } = usePackages();
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get("payment") as "success" | "failure" | "pending" | null;

  const bestValueId = useMemo(() => {
    if (packages.length === 0) return null;
    const best = packages.reduce((prev, curr) =>
      curr.points / curr.priceUSD > prev.points / prev.priceUSD ? curr : prev
    );
    return best.id;
  }, [packages]);

  const handleBuy = async (packageId: string) => {
    try {
      setBuyingId(packageId);
      const response = await paymentsService.createPreference(packageId);
      const { sandboxInitPoint, initPoint } = response.data;

      const url = process.env.NODE_ENV === "production" ? initPoint : sandboxInitPoint;
      window.location.href = url;
    } catch (err) {
      console.error("createPreference error:", err);
      setBuyingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" color="secondary" />
      </div>
    );
  }

  const alertConfig = paymentStatus ? ALERT_CONFIG[paymentStatus] : null;

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {alertConfig && !dismissed && (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${alertConfig.bg}`}>
          <alertConfig.icon className={`h-5 w-5 flex-shrink-0 ${alertConfig.iconColor}`} />
          <p className={`flex-1 text-xs md:text-sm font-medium ${alertConfig.textColor}`}>
            {alertConfig.text}
          </p>
          <button
            className={`p-1 rounded-lg hover:bg-black/5 transition-colors ${alertConfig.textColor}`}
            onClick={() => setDismissed(true)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {packages.map((pkg) => (
          <PointsPackageCard
            key={pkg.id}
            isBestValue={pkg.id === bestValueId}
            loading={buyingId === pkg.id}
            pkg={pkg}
            onBuy={handleBuy}
          />
        ))}
      </div>
    </div>
  );
}
