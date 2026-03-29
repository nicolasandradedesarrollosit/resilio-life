"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { CheckCircle, XCircle, Clock } from "lucide-react";

import { usePackages } from "@/features/payments/hooks/usePackages";
import { paymentsService } from "@/features/payments/services/paymentsService";
import { PointsPackageCard } from "./PointsPackageCard";

export function PointsMarket() {
  const { packages, loading } = usePackages();
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get("payment") as "success" | "failure" | "pending" | null;

  const handleBuy = async (packageId: string) => {
    try {
      setBuyingId(packageId);
      const response = await paymentsService.createPreference(packageId);
      const { sandboxInitPoint, initPoint } = response.data;

      // Use sandbox in development, initPoint in production
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

  return (
    <div className="flex flex-col gap-6">
      {paymentStatus && (
        <div className="flex justify-center">
          {paymentStatus === "success" && (
            <Chip
              color="success"
              size="lg"
              startContent={<CheckCircle className="h-4 w-4" />}
              variant="flat"
            >
              ¡Pago exitoso! Tus puntos serán acreditados en breve.
            </Chip>
          )}
          {paymentStatus === "failure" && (
            <Chip
              color="danger"
              size="lg"
              startContent={<XCircle className="h-4 w-4" />}
              variant="flat"
            >
              El pago no pudo procesarse. Intentá de nuevo.
            </Chip>
          )}
          {paymentStatus === "pending" && (
            <Chip
              color="warning"
              size="lg"
              startContent={<Clock className="h-4 w-4" />}
              variant="flat"
            >
              Pago pendiente. Te avisaremos cuando se confirme.
            </Chip>
          )}
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-6">
        {packages.map((pkg) => (
          <PointsPackageCard
            key={pkg.id}
            loading={buyingId === pkg.id}
            pkg={pkg}
            onBuy={handleBuy}
          />
        ))}
      </div>
    </div>
  );
}
