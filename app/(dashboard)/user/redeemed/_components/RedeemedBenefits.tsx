"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import { Receipt, Star, MapPin, QrCode, Copy, Check } from "lucide-react";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { useRouter } from "next/navigation";

import {
  selectAllRedeemedBenefits,
  selectRedeemedBenefitsData,
} from "@/features/redeemedBenefits/redeemedBenefitsSlice";
import { selectUserDataOnly } from "@/features/auth/authSlice";

export default function RedeemedBenefits() {
  const benefits = useSelector(selectAllRedeemedBenefits);
  const { loading } = useSelector(selectRedeemedBenefitsData);
  const userData = useSelector(selectUserDataOnly);
  const router = useRouter();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState<{
    code: string;
    title: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const openCodeModal = (code: string, title: string) => {
    setSelectedItem({ code, title });
    setCopied(false);
    onOpen();
  };

  const handleCopy = () => {
    if (!selectedItem) return;
    navigator.clipboard.writeText(selectedItem.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-magenta-fuchsia-600" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-5 md:mb-8">
        <h1 className="text-lg md:text-2xl font-bold text-gray-900">
          Mis Canjes
        </h1>
        <p className="text-xs md:text-sm text-gray-500 mt-1">
          Hola {userData?.name}, tenés {userData?.points ?? 0} puntos
        </p>
      </div>

      {/* Points info */}
      <div className="mb-5 md:mb-8 bg-gradient-to-br from-fuchsia-900 to-fuchsia-800 rounded-2xl p-4 md:p-6 border border-fuchsia-700/50">
        <div className="flex items-center gap-3 mb-3">
          <Star className="h-4 w-4 md:h-5 md:w-5 text-yellow-400" />
          <h2 className="text-white font-semibold text-sm md:text-base">
            Tus Puntos
          </h2>
        </div>
        <p className="text-fuchsia-200 text-xs md:text-sm">
          Gana puntos canjeando beneficios de tus negocios favoritos y usá tus puntos para acceder a más beneficios exclusivos.
        </p>
      </div>

      {/* Redeemed list */}
      <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
        Historial de canjes
      </h2>

      {benefits.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
          <Receipt className="h-10 w-10 md:h-12 md:w-12 mb-3 opacity-40" />
          <p className="text-sm md:text-base">
            Todavía no canjeaste ningún beneficio
          </p>
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {benefits.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 md:p-5 flex items-center gap-3 md:gap-4 hover:shadow-md transition-shadow"
            >
              <div className="relative h-12 w-12 md:h-16 md:w-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                <Image
                  fill
                  alt={item.benefit?.title ?? "Beneficio"}
                  className="object-cover"
                  src={item.benefit?.url_image ?? "/logo-icon.png"}
                  unoptimized
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate text-sm md:text-base">
                  {item.benefit?.title}
                </p>
                <p className="text-gray-500 text-xs md:text-sm">
                  {item.business?.businessName}
                </p>
                <p className="text-gray-400 text-[10px] md:text-xs mt-0.5">
                  {new Date(item.redeemedAt).toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1.5 md:gap-2 shrink-0">
                <Chip color="secondary" size="sm" variant="flat">
                  -{item.pointsSpent} pts
                </Chip>
                <Button
                  className="text-magenta-fuchsia-600 px-1.5 md:px-2 h-6 md:h-7 min-w-0 text-[10px] md:text-xs"
                  size="sm"
                  startContent={<MapPin className="h-2.5 w-2.5 md:h-3 md:w-3" />}
                  variant="light"
                  onPress={() =>
                    router.push(`/user/map?business=${item.business._id}`)
                  }
                >
                  Ver en mapa
                </Button>
                {item.code && (
                  <Button
                    className="text-emerald-600 px-1.5 md:px-2 h-6 md:h-7 min-w-0 text-[10px] md:text-xs"
                    size="sm"
                    startContent={
                      <QrCode className="h-2.5 w-2.5 md:h-3 md:w-3" />
                    }
                    variant="light"
                    onPress={() =>
                      openCodeModal(item.code, item.benefit?.title ?? "Beneficio")
                    }
                  >
                    Ver código
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Code modal */}
      <Modal
        isOpen={isOpen}
        placement="center"
        size="sm"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <span className="text-base font-bold text-gray-900">
                  Código de canje
                </span>
                <span className="text-xs font-normal text-gray-500">
                  {selectedItem?.title}
                </span>
              </ModalHeader>
              <ModalBody className="pb-2">
                <div className="flex flex-col items-center gap-4 py-4">
                  <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl px-8 py-6 w-full text-center">
                    <p className="font-mono text-3xl font-bold tracking-widest text-gray-900 select-all">
                      {selectedItem?.code}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 text-center">
                    Mostrá este código al comercio para validar tu beneficio
                  </p>
                </div>
              </ModalBody>
              <ModalFooter className="gap-2">
                <Button
                  className="flex-1"
                  color={copied ? "success" : "default"}
                  startContent={
                    copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )
                  }
                  variant="flat"
                  onPress={handleCopy}
                >
                  {copied ? "¡Copiado!" : "Copiar"}
                </Button>
                <Button
                  className="flex-1 bg-magenta-fuchsia-900 text-white"
                  onPress={onClose}
                >
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
