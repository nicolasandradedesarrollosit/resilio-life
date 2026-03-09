"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import { Gift } from "lucide-react";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { selectAllCatalogBenefits, selectBenefitCatalogData } from "@/features/benefitCatalog/benefitCatalogSlice";
import { selectAllRedeemedBenefits } from "@/features/redeemedBenefits/redeemedBenefitsSlice";
import { selectUserDataOnly } from "@/features/auth/authSlice";
import { useModal } from "@/shared/hooks";
import type { CatalogBenefitData } from "@/shared/types";
import ModalRedeemBenefit from "./ModalRedeemBenefit";

export default function BenefitsCatalog() {
  const benefits = useSelector(selectAllCatalogBenefits);
  const { loading } = useSelector(selectBenefitCatalogData);
  const redeemedBenefits = useSelector(selectAllRedeemedBenefits);
  const userData = useSelector(selectUserDataOnly);
  const [selectedBenefit, setSelectedBenefit] = useState<CatalogBenefitData | null>(null);
  const { onOpen } = useModal("redeemBenefitModal");

  const isRedeemed = (benefitId: string) =>
    redeemedBenefits.some((r) => r.benefit._id === benefitId);

  const handleRedeemClick = (benefit: CatalogBenefitData) => {
    setSelectedBenefit(benefit);
    onOpen();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-magenta-fuchsia-600" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 pb-8 md:pb-12">
      <div className="mb-5 md:mb-8">
        <h1 className="text-lg md:text-2xl font-bold text-gray-900">Catálogo de Beneficios</h1>
        <p className="text-xs md:text-sm text-gray-500 mt-1">
          Tenés {userData?.points ?? 0} puntos disponibles
        </p>
      </div>

      {benefits.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <Gift className="h-12 w-12 md:h-16 md:w-16 mb-4 opacity-40" />
          <p className="text-sm md:text-lg">No hay beneficios disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {benefits.map((benefit) => {
            const redeemed = isRedeemed(benefit._id);
            const canAfford = (userData?.points ?? 0) >= benefit.pointsCost;

            return (
              <div
                key={benefit._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-40 md:h-48 bg-gray-100">
                  <Image
                    src={benefit.url_image}
                    alt={benefit.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {redeemed && (
                    <div className="absolute top-2 right-2 md:top-3 md:right-3">
                      <Chip color="success" size="sm" variant="solid">
                        Ya canjeado
                      </Chip>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-tight">{benefit.title}</h3>
                    <Chip
                      className="shrink-0"
                      color="secondary"
                      size="sm"
                      variant="flat"
                    >
                      {benefit.pointsCost} pts
                    </Chip>
                  </div>
                  <p className="text-gray-500 text-xs md:text-sm mb-2 line-clamp-2">{benefit.description}</p>
                  <p className="text-[11px] md:text-xs text-gray-400 mb-3">
                    {benefit.business?.businessName}
                  </p>
                  <Button
                    className={`w-full font-semibold text-sm ${
                      redeemed
                        ? "bg-gray-100 text-gray-400 cursor-default"
                        : canAfford
                        ? "bg-gradient-to-r from-magenta-fuchsia-600 to-magenta-fuchsia-500 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                    isDisabled={redeemed || !canAfford}
                    size="sm"
                    onPress={() => !redeemed && canAfford && handleRedeemClick(benefit)}
                  >
                    {redeemed ? "Ya canjeado" : canAfford ? "Canjear" : "Puntos insuficientes"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ModalRedeemBenefit benefit={selectedBenefit} />
    </div>
  );
}
