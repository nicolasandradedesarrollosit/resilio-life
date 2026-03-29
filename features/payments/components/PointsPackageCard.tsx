"use client";

import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Zap, Star, Crown, TrendingUp } from "lucide-react";

import type { PointsPackageData } from "@/features/payments/types/payments.types";

interface Props {
  pkg: PointsPackageData;
  onBuy: (packageId: string) => void;
  loading: boolean;
  isBestValue?: boolean;
}

const TIER_CONFIG = {
  bronze: { icon: Zap, label: "Bronce" },
  silver: { icon: Star, label: "Plata" },
  gold: { icon: Crown, label: "Oro" },
};

export function PointsPackageCard({ pkg, onBuy, loading, isBestValue = false }: Props) {
  const config = TIER_CONFIG[pkg.tier];
  const Icon = config.icon;
  const ptsPerUsd = Math.round(pkg.points / pkg.priceUSD);

  return (
    <div
      className={`relative bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow ${
        isBestValue ? "border-magenta-fuchsia-300 ring-1 ring-magenta-fuchsia-200" : "border-gray-100"
      }`}
    >
      {isBestValue && (
        <div className="absolute top-2 right-2 md:top-3 md:right-3 z-10">
          <Chip
            color="secondary"
            size="sm"
            startContent={<TrendingUp className="h-3 w-3" />}
            variant="solid"
          >
            Mejor valor
          </Chip>
        </div>
      )}

      <div className="p-4 md:p-5 flex flex-col items-center gap-3">
        <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-magenta-fuchsia-50 flex items-center justify-center text-magenta-fuchsia-600">
          <Icon className="h-5 w-5 md:h-6 md:w-6" />
        </div>

        <div className="text-center">
          <h3 className="font-semibold text-gray-900 text-sm md:text-base">{pkg.name}</h3>
          <p className="text-[11px] md:text-xs text-gray-400">{config.label}</p>
        </div>

        <p className="text-2xl md:text-3xl font-bold text-magenta-fuchsia-700">
          {pkg.points.toLocaleString("es-AR")}
        </p>
        <p className="text-xs text-gray-500 -mt-2">puntos</p>

        <Chip size="sm" variant="flat" color="secondary">
          {ptsPerUsd} pts/USD
        </Chip>

        <div className="w-full border-t border-gray-100 pt-3 flex flex-col items-center gap-0.5">
          <p className="text-base md:text-lg font-bold text-gray-800">
            USD {pkg.priceUSD}
          </p>
          <p className="text-[11px] md:text-xs text-gray-400">
            ≈ ARS {pkg.priceARS.toLocaleString("es-AR")}
          </p>
        </div>
      </div>

      <div className="px-4 pb-4 md:px-5 md:pb-5">
        <Button
          className="w-full font-semibold text-sm bg-gradient-to-r from-magenta-fuchsia-600 to-magenta-fuchsia-500 text-white"
          isLoading={loading}
          size="sm"
          onPress={() => onBuy(pkg.id)}
        >
          Comprar
        </Button>
      </div>
    </div>
  );
}
