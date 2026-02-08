"use client";

import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import Image from "next/image";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { useDispatch, useSelector } from "react-redux";

import { useApi, useIsMobile, useModal } from "@/shared/hooks";
import { addTransaction } from "@/features/transactions/transactionsSlice";
import { selectAllBenefits } from "@/features/benefits/benefitsSlice";
import type { BenefitData } from "@/shared/types";
import { REQUIRED_FIELD_ERROR_MESSAGE } from "@/shared/utils/validation";

interface StateValidations {
  userId: string | null;
  benefitId: string | null;
}

export default function ModalCreateTransaction() {
  const { isOpen, onOpenChange } = useModal("createTransactionModal");
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const benefits = (useSelector(selectAllBenefits) as BenefitData[]) || [];
  const activeBenefits = benefits.filter((b) => b.isActive);

  const [stateValidations, setStateValidations] = useState<StateValidations>({
    userId: null,
    benefitId: null,
  });
  const [selectedBenefitId, setSelectedBenefitId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);

  const { loading: isLoading, data } = useApi({
    endpoint: "/transactions",
    method: "POST",
    includeCredentials: true,
    body: formData,
    enabled: formData !== null,
  });

  useEffect(() => {
    if (isOpen) {
      setSelectedBenefitId(null);
      setStateValidations({ userId: null, benefitId: null });
    }
  }, [isOpen]);

  useEffect(() => {
    if (data && data.data) {
      dispatch(addTransaction(data.data));
      setFormData(null);
      setSelectedBenefitId(null);
      onOpenChange();
    }
  }, [data, dispatch]);

  const validationRegex = {
    userId: /^[a-fA-F0-9]{24}$/,
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!value || value.trim() === "") {
      setStateValidations((prev) => ({ ...prev, [name]: REQUIRED_FIELD_ERROR_MESSAGE }));
      return;
    }

    if (name === "userId") {
      const isValid = validationRegex.userId.test(value);
      setStateValidations((prev) => ({
        ...prev,
        userId: isValid ? null : "Debe ser un ID válido (24 caracteres hexadecimales)",
      }));
    }
  };

  const handleBenefitSelect = (benefitId: string) => {
    setSelectedBenefitId(benefitId);
    setStateValidations((prev) => ({ ...prev, benefitId: null }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const hasErrors = Object.values(stateValidations).some((error) => error !== null);
    if (hasErrors) return;

    if (!selectedBenefitId) {
      setStateValidations((prev) => ({ ...prev, benefitId: "Debe seleccionar un beneficio" }));
      return;
    }

    const formDataObj = new FormData(e.currentTarget);
    const body = {
      userId: formDataObj.get("userId") as string,
      benefitId: selectedBenefitId,
    };

    setFormData(body);
  };

  return (
    <Modal
      backdrop="blur"
      classNames={{
        body: "py-6 sm:py-8 px-6 sm:px-8 flex flex-col justify-start gap-0 w-screen max-w-[calc(100vw-3rem)] sm:max-w-full",
        base: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white max-h-[95vh] rounded-lg shadow-2xl border border-slate-700/50 w-full",
        header: "text-center pt-6 sm:pt-8 pb-3 sm:pb-4 px-6 sm:px-8 border-b border-slate-700/30",
        footer: "border-t border-slate-700/30 py-4 sm:py-5 px-6 sm:px-8 bg-slate-900/50",
        closeButton: "hover:bg-white/10 active:bg-white/20 top-2 right-2 sm:top-3 sm:right-3",
      }}
      isDismissable={false}
      isOpen={isOpen as boolean}
      scrollBehavior="inside"
      size={isMobile ? "3xl" : "2xl"}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col w-full items-center gap-4 sm:gap-5">
              <Image alt="Logo Icon" height={40} src="/logo-icon.png" width={40} />
              <div>
                <h2 className="text-white font-semibold text-lg sm:text-xl">
                  Nueva Transacción
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">
                  Registra el canje de un beneficio
                </p>
              </div>
            </ModalHeader>
            <ModalBody className="flex flex-col items-center">
              <Form className="w-full space-y-5 flex flex-col items-center" onSubmit={handleSubmit}>
                <div className="w-4/5 space-y-2 relative">
                  <Input
                    classNames={{
                      label: "text-slate-300 font-medium",
                      inputWrapper: "border-slate-600 hover:border-slate-500 group-data-[focus=true]:border-magenta-fuchsia-500 group-data-[focus=true]:bg-slate-700/50",
                      input: "text-white placeholder:text-slate-500",
                    }}
                    label="ID del Usuario"
                    name="userId"
                    placeholder="Ej: 507f1f77bcf86cd799439011"
                    variant="bordered"
                    onChange={handleChange}
                  />
                  <span aria-live="polite" className={`text-xs absolute left-0 ${stateValidations.userId ? "visible text-red-400" : "invisible"}`} role="alert">
                    {stateValidations.userId}
                  </span>
                </div>

                <div className="w-4/5 space-y-2">
                  <label className="text-slate-300 font-medium text-sm block">
                    Seleccionar Beneficio
                  </label>
                  <div className="rounded-lg border border-slate-600 overflow-hidden max-h-48 overflow-y-auto">
                    {activeBenefits.length === 0 ? (
                      <div className="px-4 py-6 text-center text-slate-500 text-sm">
                        No hay beneficios activos disponibles
                      </div>
                    ) : (
                      activeBenefits.map((benefit) => (
                        <button
                          key={benefit._id}
                          type="button"
                          onClick={() => handleBenefitSelect(benefit._id)}
                          className={`w-full flex items-center justify-between px-4 py-3 border-b border-slate-700/50 last:border-b-0 transition-colors duration-150 ${
                            selectedBenefitId === benefit._id
                              ? "bg-magenta-fuchsia-600/30 border-l-2 border-l-magenta-fuchsia-500"
                              : "hover:bg-slate-700/30"
                          }`}
                        >
                          <span className="text-slate-200 text-sm font-medium">{benefit.title}</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-magenta-fuchsia-700/30 text-magenta-fuchsia-300">
                            {benefit.pointsCost} pts
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                  <span aria-live="polite" className={`text-xs block ${stateValidations.benefitId ? "visible text-red-400" : "invisible"}`} role="alert">
                    {stateValidations.benefitId}
                  </span>
                </div>
              </Form>
            </ModalBody>
            <ModalFooter>
              <div className="flex flex-col sm:flex-row justify-end gap-3 w-full">
                <Button
                  className="w-full sm:w-auto border-slate-600 text-slate-200 hover:border-slate-500 hover:bg-slate-700/50 transition-all duration-200 text-sm sm:text-base font-medium"
                  size={isMobile ? "md" : "lg"}
                  variant="bordered"
                  onPress={onClose}
                >
                  Cancelar
                </Button>
                <Button
                  className="w-full sm:w-auto bg-gradient-to-r from-magenta-fuchsia-600 to-magenta-fuchsia-500 hover:from-magenta-fuchsia-700 hover:to-magenta-fuchsia-600 text-white text-sm sm:text-base font-semibold shadow-lg transition-all duration-200"
                  isLoading={isLoading}
                  size={isMobile ? "md" : "lg"}
                  type="submit"
                  onPress={async () => {
                    const form = document.querySelector("form");
                    if (form) form.requestSubmit();
                  }}
                >
                  Crear Transacción
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
