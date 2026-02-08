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
import { Input, Textarea } from "@heroui/input";
import { ImageIcon } from "lucide-react";
import { useDispatch } from "react-redux";

import { useApi, useIsMobile, useModal } from "@/shared/hooks";
import { addBenefit } from "@/features/benefits/benefitsSlice";

interface StateValidations {
  title: string | null;
  description: string | null;
  pointsCost: string | null;
  image: string | null;
}

export default function ModalCreateBenefit() {
  const { isOpen, onOpenChange } = useModal("createBenefitModal");
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const [stateValidations, setStateValidations] = useState<StateValidations>({
    title: null,
    description: null,
    pointsCost: null,
    image: null,
  });

  const [formData, setFormData] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);

  const { loading: isLoading, data } = useApi({
    endpoint: "/benefits",
    method: "POST",
    includeCredentials: true,
    body: formData,
    enabled: formData !== null,
  });

  useEffect(() => {
    if (data && data.data) {
      dispatch(addBenefit(data.data));
      setFormData(null);
      setImageFile(null);
      setImagePreview(null);
      setIsActive(true);
      onOpenChange();
    }
  }, [data, dispatch]);

  const validationRegex = {
    title: /^.{3,100}$/,
    description: /^.{10,500}$/,
    pointsCost: /^[1-9]\d*$/,
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (!value || value.trim() === "") {
      setStateValidations((prev) => ({ ...prev, [name]: "Este campo es requerido" }));
      return;
    }

    const regex = validationRegex[name as keyof typeof validationRegex];
    const isValid = regex ? regex.test(value) : true;
    let errorMessage = null;

    if (!isValid) {
      switch (name) {
        case "title":
          errorMessage = "El título debe tener entre 3 y 100 caracteres";
          break;
        case "description":
          errorMessage = "La descripción debe tener entre 10 y 500 caracteres";
          break;
        case "pointsCost":
          errorMessage = "El costo debe ser un número positivo";
          break;
      }
    }
    setStateValidations((prev) => ({ ...prev, [name]: errorMessage }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setStateValidations((prev) => ({ ...prev, image: "La imagen es requerida" }));
      setImagePreview(null);
      setImageFile(null);
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setStateValidations((prev) => ({ ...prev, image: "La imagen no debe superar los 5MB" }));
      setImagePreview(null);
      setImageFile(null);
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setStateValidations((prev) => ({ ...prev, image: "Solo se permiten imágenes (JPG, PNG, WEBP)" }));
      setImagePreview(null);
      setImageFile(null);
      return;
    }

    setImageFile(file);
    setStateValidations((prev) => ({ ...prev, image: null }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const hasErrors = Object.values(stateValidations).some((error) => error !== null);
    if (hasErrors) return;

    if (!imageFile) {
      setStateValidations((prev) => ({ ...prev, image: "La imagen es requerida" }));
      return;
    }

    const formDataObj = new FormData(e.currentTarget);
    formDataObj.set("isActive", String(isActive));
    formDataObj.append("image", imageFile);

    setFormData(formDataObj);
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
                  Crear nuevo beneficio
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">
                  Completa los detalles del beneficio
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
                    label="Título"
                    name="title"
                    placeholder="Ej: Descuento en café"
                    variant="bordered"
                    onChange={handleChange}
                  />
                  <span aria-live="polite" className={`text-xs absolute left-0 ${stateValidations.title ? "visible text-red-400" : "invisible"}`} role="alert">
                    {stateValidations.title}
                  </span>
                </div>

                <div className="w-4/5 space-y-2 relative">
                  <Textarea
                    classNames={{
                      label: "text-slate-300 font-medium",
                      inputWrapper: "border-slate-600 hover:border-slate-500 group-data-[focus=true]:border-magenta-fuchsia-500 group-data-[focus=true]:bg-slate-700/50",
                      input: "text-white placeholder:text-slate-500",
                    }}
                    label="Descripción"
                    minRows={3}
                    name="description"
                    placeholder="Describe el beneficio que ofreces..."
                    variant="bordered"
                    onChange={handleChange}
                  />
                  <span aria-live="polite" className={`text-xs absolute left-0 ${stateValidations.description ? "visible text-red-400" : "invisible"}`} role="alert">
                    {stateValidations.description}
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
                      label="Costo en puntos"
                      name="pointsCost"
                      placeholder="Ej: 500"
                      type="number"
                      variant="bordered"
                      onChange={handleChange}
                    />
                    <span aria-live="polite" className={`text-xs absolute left-0 ${stateValidations.pointsCost ? "visible text-red-400" : "invisible"}`} role="alert">
                      {stateValidations.pointsCost}
                    </span>
                  </div>
                  <div className="flex flex-col justify-end pb-1">
                    <div className="flex items-center justify-between bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3">
                      <span className="text-slate-300 font-medium text-sm">Beneficio activo</span>
                      <button
                        type="button"
                        onClick={() => setIsActive(!isActive)}
                        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${isActive ? "bg-magenta-fuchsia-500" : "bg-slate-600"}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${isActive ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="w-4/5 space-y-3">
                  <label className="text-slate-300 font-medium text-sm block">
                    Imagen del beneficio
                  </label>
                  <div className="relative">
                    <Input
                      accept="image/*"
                      classNames={{
                        inputWrapper: "border-slate-600 hover:border-slate-500 group-data-[focus=true]:border-magenta-fuchsia-500 group-data-[focus=true]:bg-slate-700/50",
                        input: "text-white placeholder:text-slate-500 file:text-white file:bg-slate-700 file:border-0 file:rounded file:px-3 file:py-1 file:cursor-pointer hover:file:bg-slate-600",
                      }}
                      placeholder="Selecciona una imagen"
                      type="file"
                      variant="bordered"
                      onChange={handleImageChange}
                    />
                  </div>
                  <span aria-live="polite" className={`text-xs block ${stateValidations.image ? "visible text-red-400" : "invisible"}`} role="alert">
                    {stateValidations.image}
                  </span>

                  {imagePreview ? (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-slate-600 bg-slate-800">
                      <img alt="Vista previa" className="w-full h-full object-cover" src={imagePreview} />
                      <button
                        aria-label="Eliminar imagen"
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
                        type="button"
                        onClick={() => { setImagePreview(null); setImageFile(null); }}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path clipRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" fillRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-32 rounded-lg border-2 border-dashed border-slate-600 flex flex-col items-center justify-center bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                      <ImageIcon className="text-slate-500 mb-2" size={32} />
                      <p className="text-slate-400 text-sm">Sube una imagen para ver la vista previa</p>
                    </div>
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
                  Crear Beneficio
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
