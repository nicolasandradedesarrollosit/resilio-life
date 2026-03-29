"use client";

import { Card, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Zap, Star, Crown } from "lucide-react";

import type { PointsPackageData } from "@/features/payments/types/payments.types";

interface Props {
  pkg: PointsPackageData;
  onBuy: (packageId: string) => void;
  loading: boolean;
}

const TIER_CONFIG = {
  bronze: {
    gradient: "from-amber-700 via-amber-600 to-amber-500",
    chipColor: "warning" as const,
    icon: Zap,
    label: "Bronce",
  },
  silver: {
    gradient: "from-gray-500 via-gray-400 to-gray-300",
    chipColor: "default" as const,
    icon: Star,
    label: "Plata",
  },
  gold: {
    gradient: "from-yellow-600 via-yellow-500 to-yellow-400",
    chipColor: "warning" as const,
    icon: Crown,
    label: "Oro",
  },
};

export function PointsPackageCard({ pkg, onBuy, loading }: Props) {
  const config = TIER_CONFIG[pkg.tier];
  const Icon = config.icon;

  return (
    <Card className="w-full max-w-xs shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className={`bg-gradient-to-br ${config.gradient} p-6 rounded-t-xl flex flex-col items-center gap-2`}>
        <Icon className="h-10 w-10 text-white drop-shadow" />
        <h3 className="text-2xl font-bold text-white">{pkg.name}</h3>
        <Chip color={config.chipColor} size="sm" variant="solid">
          {config.label}
        </Chip>
      </div>

      <CardBody className="flex flex-col items-center gap-3 pt-4 pb-2">
        <p className="text-3xl font-extrabold text-magenta-fuchsia-700">
          {pkg.points.toLocaleString("es-AR")}
        </p>
        <p className="text-sm text-gray-500 font-medium">puntos</p>

        <div className="w-full border-t border-gray-100 pt-3 flex flex-col items-center gap-1">
          <p className="text-xl font-bold text-gray-800">
            USD {pkg.priceUSD}
          </p>
          <p className="text-sm text-gray-500">
            ≈ ARS {pkg.priceARS.toLocaleString("es-AR")}
          </p>
        </div>
      </CardBody>

      <CardFooter className="pt-1 pb-4">
        <Button
          className="w-full bg-magenta-fuchsia-600 text-white hover:bg-magenta-fuchsia-700 font-semibold"
          isLoading={loading}
          size="lg"
          onPress={() => onBuy(pkg.id)}
        >
          Comprar
        </Button>
      </CardFooter>
    </Card>
  );
}
