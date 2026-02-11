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
import { Textarea } from "@heroui/input";
import { DatePicker } from "@heroui/date-picker";
import { ImageIcon } from "lucide-react";

import { useIsMobile, useModal } from "@/shared/hooks";
import { useUpdateEvent } from "@/features/events/hooks/useUpdateEvent";

export default function ModalUpdateEvent({ id }: { id: string }) {
  const { isOpen, onOpenChange } = useModal("updateEventModal");
  const isMobile = useIsMobile();

  const {
    eventToUpdate,
    validations,
    isLoading,
    selectedDate,
    imageFile,
    imagePreview,
    handleChange,
    handleDateChange,
    handleImageChange,
    handleSubmit,
  } = useUpdateEvent(id, isOpen as boolean, onOpenChange);

  if (!eventToUpdate) return null;

  return (
    <Modal
      backdrop="blur"
      classNames={{
        body: "py-6 sm:py-8 px-6 sm:px-8",
        base: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white max-h-[95vh] rounded-lg shadow-2xl border border-slate-700/50",
        header:
          "text-center pt-6 sm:pt-8 pb-3 sm:pb-4 px-6 sm:px-8 border-b border-slate-700/30",
        footer:
          "border-t border-slate-700/30 py-4 sm:py-5 px-6 sm:px-8 bg-slate-900/50",
        closeButton:
          "hover:bg-white/10 active:bg-white/20 top-2 right-2 sm:top-3 sm:right-3",
      }}
      isOpen={isOpen as any}
      radius="lg"
      scrollBehavior="inside"
      size={isMobile ? "full" : "3xl"}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col items-center gap-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Editar evento
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-normal">
            Modificá los detalles del evento
          </p>
        </ModalHeader>

        <ModalBody>
          <Form
            className="flex flex-col gap-4 sm:gap-5"
            validationErrors={validations}
            onSubmit={handleSubmit}
          >
            <Input
              required
              classNames={{
                label: "text-sm sm:text-base font-medium",
                input:
                  "bg-slate-800/50 border-slate-700/50 text-base sm:text-lg",
                errorMessage: "text-xs sm:text-sm",
              }}
              defaultValue={eventToUpdate.title}
              errorMessage={validations.title}
              isInvalid={!!validations.title}
              label="Título"
              name="title"
              placeholder="Ingresá el título del evento"
              size={isMobile ? "md" : "lg"}
              variant="bordered"
              onChange={handleChange}
            />

            <Textarea
              required
              classNames={{
                label: "text-sm sm:text-base font-medium",
                input:
                  "bg-slate-800/50 border-slate-700/50 text-base sm:text-lg min-h-[100px] sm:min-h-[120px]",
                errorMessage: "text-xs sm:text-sm",
              }}
              defaultValue={eventToUpdate.description}
              errorMessage={validations.description}
              isInvalid={!!validations.description}
              label="Descripción"
              name="description"
              placeholder="Ingresá una descripción del evento"
              size={isMobile ? "md" : "lg"}
              variant="bordered"
              onChange={handleChange}
            />

            <DatePicker
              required
              classNames={{
                label: "text-sm sm:text-base font-medium",
                inputWrapper: "bg-slate-800/50 border-slate-700/50",
                errorMessage: "text-xs sm:text-sm",
              }}
              errorMessage={validations.date}
              isInvalid={!!validations.date}
              label="Fecha del evento"
              size={isMobile ? "md" : "lg"}
              value={selectedDate}
              variant="bordered"
              onChange={handleDateChange}
            />

            <Input
              required
              classNames={{
                label: "text-sm sm:text-base font-medium",
                input:
                  "bg-slate-800/50 border-slate-700/50 text-base sm:text-lg",
                errorMessage: "text-xs sm:text-sm",
              }}
              defaultValue={eventToUpdate.location}
              errorMessage={validations.location}
              isInvalid={!!validations.location}
              label="Ubicación"
              name="location"
              placeholder="Ingresá la ubicación del evento"
              size={isMobile ? "md" : "lg"}
              variant="bordered"
              onChange={handleChange}
            />

            <Input
              required
              classNames={{
                label: "text-sm sm:text-base font-medium",
                input:
                  "bg-slate-800/50 border-slate-700/50 text-base sm:text-lg",
                errorMessage: "text-xs sm:text-sm",
              }}
              defaultValue={eventToUpdate.url_provider}
              errorMessage={validations.url_provider}
              isInvalid={!!validations.url_provider}
              label="URL del proveedor"
              name="url_provider"
              placeholder="https://ejemplo.com"
              size={isMobile ? "md" : "lg"}
              type="url"
              variant="bordered"
              onChange={handleChange}
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm sm:text-base font-medium">
                Imagen del evento
              </label>
              <div className="relative">
                <input
                  accept="image/*"
                  className="hidden"
                  id="imageUpload"
                  type="file"
                  onChange={handleImageChange}
                />
                <label
                  className="flex items-center justify-center gap-3 p-4 sm:p-5 border-2 border-dashed border-slate-700/50 rounded-lg cursor-pointer hover:border-slate-600 hover:bg-slate-800/30 transition-all"
                  htmlFor="imageUpload"
                >
                  <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
                  <span className="text-sm sm:text-base text-slate-400">
                    {imageFile ? "Cambiar imagen" : "Seleccionar nueva imagen"}
                  </span>
                </label>
              </div>
              {validations.image && (
                <p className="text-xs sm:text-sm text-danger-400">
                  {validations.image}
                </p>
              )}
              {imagePreview && (
                <div className="relative w-full h-48 sm:h-64 mt-3 rounded-lg overflow-hidden border border-slate-700/50">
                  <Image
                    fill
                    alt="Preview"
                    className="object-cover"
                    src={imagePreview}
                  />
                </div>
              )}
            </div>

            <ModalFooter className="px-0 pt-4">
              <Button
                className="font-medium text-base sm:text-lg"
                color="danger"
                size={isMobile ? "md" : "lg"}
                variant="flat"
                onPress={onOpenChange}
              >
                Cancelar
              </Button>
              <Button
                className="font-medium text-base sm:text-lg"
                color="primary"
                isLoading={isLoading}
                size={isMobile ? "md" : "lg"}
                type="submit"
                variant="shadow"
              >
                Guardar cambios
              </Button>
            </ModalFooter>
          </Form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
