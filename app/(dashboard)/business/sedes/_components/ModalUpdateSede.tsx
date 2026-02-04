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
import { updateHeadquarters, selectAllHeadquarters } from "@/features/headquarters/headquartersSlice";
import type { HeadquartersData } from "@/shared/types";

interface StateValidations {
  name: string | null;
  latitude: string | null;
  longitude: string | null;
}

export default function ModalUpdateSede({ id }: { id: string }) {
  const { isOpen, onOpenChange } = useModal("updateSedeModal");
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const items = useSelector(selectAllHeadquarters);
  const sedeToUpdate = items.find((h: HeadquartersData) => h._id === id);

  const [stateValidations, setStateValidations] = useState<StateValidations>({
    name: null,
    latitude: null,
    longitude: null,
  });

  const [formData, setFormData] = useState<any>(null);
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");

  const { loading: isLoading, data } = useApi({
    endpoint: `/headquarters/${id}`,
    method: "PATCH",
    includeCredentials: true,
    body: formData,
    enabled: formData !== null,
  });

  useEffect(() => {
    if (isOpen && sedeToUpdate) {
      setLatitude(String(sedeToUpdate.coordinates?.[0] ?? ""));
      setLongitude(String(sedeToUpdate.coordinates?.[1] ?? ""));
      setStateValidations({ name: null, latitude: null, longitude: null });
    }
  }, [isOpen, sedeToUpdate]);

  useEffect(() => {
    if (data && data.data) {
      dispatch(updateHeadquarters(data.data));
      setFormData(null);
      onOpenChange();
    }
  }, [data, dispatch]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (!value || value.trim() === "") {
      setStateValidations((prev) => ({ ...prev, name: "Este campo es requerido" }));
      return;
    }
    setStateValidations((prev) => ({
      ...prev,
      name: value.length < 2 || value.length > 100 ? "El nombre debe tener entre 2 y 100 caracteres" : null,
    }));
  };

  const handleCoordChange = (field: "latitude" | "longitude", value: string) => {
    if (field === "latitude") setLatitude(value);
    else setLongitude(value);

    if (!value || value.trim() === "") {
      setStateValidations((prev) => ({ ...prev, [field]: "Este campo es requerido" }));
      return;
    }

    const num = parseFloat(value);
    if (isNaN(num)) {
      setStateValidations((prev) => ({ ...prev, [field]: "Debe ser un número válido" }));
      return;
    }

    if (field === "latitude" && (num < -90 || num > 90)) {
      setStateValidations((prev) => ({ ...prev, [field]: "Entre -90 y 90" }));
      return;
    }
    if (field === "longitude" && (num < -180 || num > 180)) {
      setStateValidations((prev) => ({ ...prev, [field]: "Entre -180 y 180" }));
      return;
    }

    setStateValidations((prev) => ({ ...prev, [field]: null }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formEl = e.currentTarget;
    const name = (formEl.elements.namedItem("name") as HTMLInputElement)?.value;

    if (Object.values(stateValidations).some((e) => e !== null)) return;
    if (!latitude?.trim() || !longitude?.trim()) return;

    setFormData({
      name: name?.trim(),
      coordinates: [parseFloat(latitude), parseFloat(longitude)],
    });
  };

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
                    className={`text-xs absolute left-0 ${stateValidations.name ? "visible text-red-400" : "invisible"}`}
                    role="alert"
                  >
                    {stateValidations.name}
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
                      className={`text-xs absolute left-0 ${stateValidations.latitude ? "visible text-red-400" : "invisible"}`}
                      role="alert"
                    >
                      {stateValidations.latitude}
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
                      className={`text-xs absolute left-0 ${stateValidations.longitude ? "visible text-red-400" : "invisible"}`}
                      role="alert"
                    >
                      {stateValidations.longitude}
                    </span>
                  </div>
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
