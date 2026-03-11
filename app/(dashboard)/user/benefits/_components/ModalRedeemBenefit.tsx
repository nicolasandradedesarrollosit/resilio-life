"use client";
import { useState, useEffect } from "react";
import { Modal, ModalContent, ModalBody, ModalFooter, ModalHeader } from "@heroui/modal";
import { Button } from "@heroui/button";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { useApi, useModal } from "@/shared/hooks";
import { addRedeemedBenefit } from "@/features/redeemedBenefits/redeemedBenefitsSlice";
import { setUserData, selectUserData } from "@/features/auth/authSlice";
import type { CatalogBenefitData, RedeemedBenefitData } from "@/shared/types";

interface Props {
  benefit: CatalogBenefitData | null;
}

export default function ModalRedeemBenefit({ benefit }: Props) {
  const { isOpen, onOpenChange } = useModal("redeemBenefitModal");
  const dispatch = useDispatch();
  const userState = useSelector(selectUserData);
  const [shouldRedeem, setShouldRedeem] = useState(false);
  const [hasRedeemed, setHasRedeemed] = useState(false);

  const { loading, data, error } = useApi<{
    data: { record: RedeemedBenefitData; updatedPoints: number };
  }>({
    endpoint: "/user/benefits/redeem",
    method: "POST",
    includeCredentials: true,
    body: benefit ? { benefitId: benefit._id } : null,
    enabled: shouldRedeem && benefit !== null,
  });

  useEffect(() => {
    if (shouldRedeem && !loading && data && !hasRedeemed && benefit) {
      setHasRedeemed(true);

      // Build the populated record locally — backend returns unpopulated refs
      dispatch(addRedeemedBenefit({
        _id: data.data.record._id,
        user: data.data.record.user,
        benefit: {
          _id: benefit._id,
          title: benefit.title,
          description: benefit.description,
          url_image: benefit.url_image,
          pointsCost: benefit.pointsCost,
        },
        business: {
          _id: benefit.business._id,
          businessName: benefit.business.businessName,
        },
        pointsSpent: userState.data?.isInfluencer ? 0 : benefit.pointsCost,
        redeemedAt: data.data.record.redeemedAt,
        code: data.data.record.code,
      }));

      if (userState.data) {
        dispatch(
          setUserData({
            data: { ...userState.data, points: data.data.updatedPoints },
            loading: false,
            loaded: true,
            loggedIn: true,
          })
        );
      }
      setShouldRedeem(false);
      onOpenChange();
    }
  }, [shouldRedeem, loading, data, hasRedeemed, benefit, dispatch, userState.data, onOpenChange]);

  useEffect(() => {
    if (!isOpen) {
      setShouldRedeem(false);
      setHasRedeemed(false);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    setShouldRedeem(true);
  };

  if (!benefit) return null;

  return (
    <Modal
      backdrop="blur"
      classNames={{
        body: "py-6 px-6 flex flex-col items-center gap-4",
        base: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-lg shadow-2xl border border-slate-700/50",
        header: "text-center pt-6 pb-3 px-6 border-b border-slate-700/30",
        footer: "border-t border-slate-700/30 py-4 px-6 bg-slate-900/50",
        closeButton: "hover:bg-white/10 active:bg-white/20",
      }}
      isDismissable={!loading}
      isOpen={isOpen as boolean}
      size="sm"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col items-center gap-3">
              <Image alt="Logo" height={36} src="/logo-icon.png" width={36} />
              <h2 className="text-white font-semibold text-lg">Canjear Beneficio</h2>
            </ModalHeader>
            <ModalBody>
              <div className="text-center">
                <p className="text-slate-300 text-sm mb-1">Estás por canjear:</p>
                <p className="text-white font-bold text-base mb-3">{benefit.title}</p>
                <div className="bg-slate-800/50 border border-slate-600 rounded-xl p-4 mb-4">
                  <p className="text-slate-400 text-xs mb-1">Costo</p>
                  <p className="text-magenta-fuchsia-400 font-bold text-2xl">
                    {userState.data?.isInfluencer ? "Gratis" : `${benefit.pointsCost} puntos`}
                  </p>
                </div>
                <p className="text-slate-400 text-xs">¿Confirmás el canje?</p>
                {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
              </div>
            </ModalBody>
            <ModalFooter>
              <div className="flex gap-3 w-full">
                <Button
                  className="flex-1 border-slate-600 text-slate-200 hover:bg-slate-700/50"
                  isDisabled={loading}
                  size="md"
                  variant="bordered"
                  onPress={onClose}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-magenta-fuchsia-600 to-magenta-fuchsia-500 text-white font-semibold"
                  isLoading={loading}
                  size="md"
                  onPress={handleConfirm}
                >
                  Confirmar
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
