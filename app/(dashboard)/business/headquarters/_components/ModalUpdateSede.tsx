"use client";

import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import Image from "next/image";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { MapPin } from "lucide-react";
import { useState } from "react";

import { useIsMobile, useModal } from "@/shared/hooks";
import { useUpdateSede } from "@/features/headquarters/hooks/useUpdateSede";
import LocationPickerWrapper from "@/app/(auth)/register-business/_components/LocationPickerWrapper";

export default function ModalUpdateSede({ id }: { id: string }) {
  const { isOpen, onOpenChange } = useModal("updateSedeModal");
  const isMobile = useIsMobile();
  const [showMap, setShowMap] = useState(false);

  const {
    sedeToUpdate,
    validations,
    isLoading,
    latitude,
    longitude,
    handleNameChange,
    handleCoordChange,
    handleSubmit,
  } = useUpdateSede(id, isOpen as boolean, onOpenChange);

  if (!sedeToUpdate) return null;

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
                  Modificar Sede
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">
                  Actualiza los datos de la ubicación
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
                    defaultValue={sedeToUpdate.name}
                    label="Nombre de la sede"
                    name="name"
                    placeholder="Ej: Sede Central Buenos Aires"
                    variant="bordered"
                    onChange={handleNameChange}
                  />
                  <span
                    aria-live="polite"
                    className={`text-xs absolute left-0 ${validations.name ? "visible text-red-400" : "invisible"}`}
                    role="alert"
                  >
                    {validations.name}
                  </span>
                </div>

                <div className="w-4/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 relative">
                    <Input
                      classNames={{
                        label: "text-slate-300 font-medium",
                        inputWrapper: "border-slate-600 hover:border-slate-500 group-data-[focus=true]:border-magenta-fuchsia-500 group-data-[focus=true]:bg-slate-700/50",
                        input: "text-white placeholder:text-slate-500",
                      }}
                      label="Latitud"
                      value={latitude}
                      variant="bordered"
                      onChange={(e) => handleCoordChange("latitude", (e.target as HTMLInputElement).value)}
                    />
                    <span
                      aria-live="polite"
                      className={`text-xs absolute left-0 ${validations.latitude ? "visible text-red-400" : "invisible"}`}
                      role="alert"
                    >
                      {validations.latitude}
                    </span>
                  </div>
                  <div className="space-y-2 relative">
                    <Input
                      classNames={{
                        label: "text-slate-300 font-medium",
                        inputWrapper: "border-slate-600 hover:border-slate-500 group-data-[focus=true]:border-magenta-fuchsia-500 group-data-[focus=true]:bg-slate-700/50",
                        input: "text-white placeholder:text-slate-500",
                      }}
                      label="Longitud"
                      value={longitude}
                      variant="bordered"
                      onChange={(e) => handleCoordChange("longitude", (e.target as HTMLInputElement).value)}
                    />
                    <span
                      aria-live="polite"
                      className={`text-xs absolute left-0 ${validations.longitude ? "visible text-red-400" : "invisible"}`}
                      role="alert"
                    >
                      {validations.longitude}
                    </span>
                  </div>
                </div>

                <div className="w-4/5 space-y-3">
                  <Button
                    className="w-full border-slate-600 text-slate-200 hover:border-slate-500 hover:bg-slate-700/50"
                    startContent={<MapPin size={16} />}
                    type="button"
                    variant="bordered"
                    onPress={() => setShowMap((prev) => !prev)}
                  >
                    {showMap ? "Ocultar mapa" : "Seleccionar ubicación en mapa"}
                  </Button>

                  {showMap && (
                    <LocationPickerWrapper
                      initialLat={latitude ? Number(latitude) : undefined}
                      initialLng={longitude ? Number(longitude) : undefined}
                      onLocationSelect={(lat, lng) => {
                        handleCoordChange("latitude", String(lat));
                        handleCoordChange("longitude", String(lng));
                      }}
                    />
                  )}
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
                  Actualizar Sede
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
