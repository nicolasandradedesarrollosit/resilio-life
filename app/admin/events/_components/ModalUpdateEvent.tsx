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
import { Textarea } from "@heroui/input";
import { DatePicker } from "@heroui/date-picker";
import { ImageIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { parseDate } from "@internationalized/date";

import { useApi } from "@/hooks/useApi";
import { updateEvent, selectAllEvents } from "@/features/events/eventsSlice";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useModal } from "@/hooks/useModal";
import { EventData } from "@/types/EventData.type";

interface StateValidations {
  title: string | null;
  description: string | null;
  date: string | null;
  location: string | null;
  image: string | null;
  url_provider: string | null;
}

export default function ModalUpdateEvent({ id }: { id: string }) {
  const { isOpen, onOpenChange } = useModal("updateEventModal");
  const dispatch = useDispatch();
  const events = useSelector(selectAllEvents);
  const eventToUpdate = events.find((e: EventData) => e._id === id);

  const [stateValidations, setStateValidations] = useState<StateValidations>({
    title: null,
    description: null,
    date: null,
    location: null,
    image: null,
    url_provider: null,
  });

  const [formData, setFormData] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    loading: isLoading,
    error,
    data,
  } = useApi({
    endpoint: `/events/${id}`,
    method: "PATCH",
    includeCredentials: true,
    body: formData,
    enabled: formData !== null,
  });

  useEffect(() => {
    if (isOpen && eventToUpdate) {
      // Pre-fill data
      setSelectedDate(
        parseDate(new Date(eventToUpdate.date).toISOString().split("T")[0]),
      );
      setImagePreview(eventToUpdate.url_image);

      // Reset validations
      setStateValidations({
        title: null,
        description: null,
        date: null,
        location: null,
        image: null,
        url_provider: null,
      });
    }
  }, [isOpen, eventToUpdate]);

  useEffect(() => {
    if (data && data.data) {
      dispatch(updateEvent(data.data));
      setFormData(null);
      setImageFile(null);
      onOpenChange();
    }
  }, [data, dispatch]);

  const validationRegex = {
    title: /^.{3,100}$/,
    description: /^.{10,500}$/,
    location: /^.{3,100}$/,
    url_provider: /^https?:\/\/.+/,
  };

  const isMobile = useIsMobile();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (!value || value.trim() === "") {
      setStateValidations((prev) => ({
        ...prev,
        [name]: "Este campo es requerido",
      }));

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
        case "location":
          errorMessage = "La ubicación debe tener entre 3 y 100 caracteres";
          break;
        case "url_provider":
          errorMessage = "Debe ser una URL válida (http:// o https://)";
          break;
      }
    }

    setStateValidations((prev) => ({ ...prev, [name]: errorMessage }));
  };

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
    setStateValidations((prev) => ({
      ...prev,
      date: !date ? "La fecha es requerida" : null,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      // If no file, we keep the existing one, so no error unless they want to change it
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setStateValidations((prev) => ({
        ...prev,
        image: "La imagen no debe superar los 5MB",
      }));
      setImagePreview(eventToUpdate?.url_image || null);
      setImageFile(null);

      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

    if (!validTypes.includes(file.type)) {
      setStateValidations((prev) => ({
        ...prev,
        image: "Solo se permiten imágenes (JPG, PNG, WEBP)",
      }));
      setImagePreview(eventToUpdate?.url_image || null);
      setImageFile(null);

      return;
    }

    setImageFile(file);
    setStateValidations((prev) => ({ ...prev, image: null }));

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      // Filter out null validations (valid)
      const hasErrors = Object.values(stateValidations).some(
        (error) => error !== null,
      );

      if (hasErrors) return;

      if (!selectedDate) {
        setStateValidations((prev) => ({
          ...prev,
          date: "La fecha es requerida",
        }));

        return;
      }

      const form = e.currentTarget;
      const formDataObj = new FormData(form);

      const dateStr = selectedDate.toString().split("T")[0];

      formDataObj.set("date", dateStr);

      if (imageFile) {
        formDataObj.set("image", imageFile);
      } else {
        formDataObj.delete("image"); // Don't send empty image field if not changing
      }

      setFormData(formDataObj);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (!eventToUpdate) return null;

  return (
    <Modal
      backdrop="blur"
      classNames={{
        body: "py-6 sm:py-8 px-6 sm:px-8 flex flex-col justify-start gap-0 w-screen max-w-[calc(100vw-3rem)] sm:max-w-full",
        base: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white max-h-[95vh] rounded-lg shadow-2xl border border-slate-700/50 w-full",
        header:
          "text-center pt-6 sm:pt-8 pb-3 sm:pb-4 px-6 sm:px-8 border-b border-slate-700/30",
        footer:
          "border-t border-slate-700/30 py-4 sm:py-5 px-6 sm:px-8 bg-slate-900/50",
        closeButton:
          "hover:bg-white/10 active:bg-white/20 top-2 right-2 sm:top-3 sm:right-3",
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
              <Image
                alt="Logo Icon"
                height={40}
                src="/logo-icon.png"
                width={40}
              />
              <div>
                <h2 className="text-white font-semibold text-lg sm:text-xl">
                  Modificar Evento
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">
                  Actualiza los detalles del evento
                </p>
              </div>
            </ModalHeader>
            <ModalBody className="flex flex-col items-center">
              <Form
                className="w-full space-y-5 flex flex-col items-center"
                onSubmit={handleSubmit}
              >
                <div className="w-4/5 space-y-2 relative">
                  <Input
                    classNames={{
                      label: "text-slate-300 font-medium",
                      inputWrapper:
                        "border-slate-600 hover:border-slate-500 group-data-[focus=true]:border-magenta-fuchsia-500 group-data-[focus=true]:bg-slate-700/50",
                      input: "text-white placeholder:text-slate-500",
                    }}
                    defaultValue={eventToUpdate.title}
                    label="Título"
                    name="title"
                    placeholder="Ej: Festival de Música 2024"
                    variant="bordered"
                    onChange={handleChange}
                  />
                  <span
                    aria-live="polite"
                    className={`text-xs absolute left-0 ${stateValidations.title ? "visible text-red-400" : "invisible"}`}
                    role="alert"
                  >
                    {stateValidations.title}
                  </span>
                </div>

                <div className="w-4/5 space-y-2 relative">
                  <Textarea
                    classNames={{
                      label: "text-slate-300 font-medium",
                      inputWrapper:
                        "border-slate-600 hover:border-slate-500 group-data-[focus=true]:border-magenta-fuchsia-500 group-data-[focus=true]:bg-slate-700/50",
                      input: "text-white placeholder:text-slate-500",
                    }}
                    defaultValue={eventToUpdate.description}
                    label="Descripción"
                    minRows={3}
                    name="description"
                    placeholder="Describe brevemente el evento..."
                    variant="bordered"
                    onChange={handleChange}
                  />
                  <span
                    aria-live="polite"
                    className={`text-xs absolute left-0 ${stateValidations.description ? "visible text-red-400" : "invisible"}`}
                    role="alert"
                  >
                    {stateValidations.description}
                  </span>
                </div>

                <div className="w-4/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 relative">
                    <DatePicker
                      classNames={{
                        label: "text-slate-300 font-medium",
                        inputWrapper:
                          "border-slate-600 hover:border-slate-500 group-data-[focus=true]:border-magenta-fuchsia-500",
                        input: "text-white",
                      }}
                      label="Fecha del evento"
                      value={selectedDate}
                      variant="bordered"
                      onChange={handleDateChange}
                    />
                    <span
                      aria-live="polite"
                      className={`text-xs absolute left-0 ${stateValidations.date ? "visible text-red-400" : "invisible"}`}
                      role="alert"
                    >
                      {stateValidations.date}
                    </span>
                  </div>
                  <div className="space-y-2 relative">
                    <Input
                      classNames={{
                        label: "text-slate-300 font-medium",
                        inputWrapper:
                          "border-slate-600 hover:border-slate-500 group-data-[focus=true]:border-magenta-fuchsia-500 group-data-[focus=true]:bg-slate-700/50",
                        input: "text-white placeholder:text-slate-500",
                      }}
                      defaultValue={eventToUpdate.location}
                      label="Ubicación"
                      name="location"
                      placeholder="Ej: Buenos Aires, Argentina"
                      variant="bordered"
                      onChange={handleChange}
                    />
                    <span
                      aria-live="polite"
                      className={`text-xs absolute left-0 ${stateValidations.location ? "visible text-red-400" : "invisible"}`}
                      role="alert"
                    >
                      {stateValidations.location}
                    </span>
                  </div>
                </div>

                <div className="w-4/5 space-y-3">
                  <label className="text-slate-300 font-medium text-sm block">
                    Imagen del evento
                  </label>
                  <div className="relative">
                    <Input
                      accept="image/*"
                      classNames={{
                        inputWrapper:
                          "border-slate-600 hover:border-slate-500 group-data-[focus=true]:border-magenta-fuchsia-500 group-data-[focus=true]:bg-slate-700/50",
                        input:
                          "text-white placeholder:text-slate-500 file:text-white file:bg-slate-700 file:border-0 file:rounded file:px-3 file:py-1 file:cursor-pointer hover:file:bg-slate-600",
                      }}
                      placeholder="Selecciona una imagen"
                      type="file"
                      variant="bordered"
                      onChange={handleImageChange}
                    />
                  </div>

                  <span
                    aria-live="polite"
                    className={`text-xs block ${stateValidations.image ? "visible text-red-400" : "invisible"}`}
                    role="alert"
                  >
                    {stateValidations.image}
                  </span>

                  {imagePreview ? (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-slate-600 bg-slate-800">
                      <img
                        alt="Vista previa"
                        className="w-full h-full object-cover"
                        src={imagePreview}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-32 rounded-lg border-2 border-dashed border-slate-600 flex flex-col items-center justify-center bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                      <ImageIcon className="text-slate-500 mb-2" size={32} />
                      <p className="text-slate-400 text-sm">
                        Sube una imagen para ver la vista previa
                      </p>
                    </div>
                  )}
                </div>

                <div className="w-4/5 space-y-2 relative">
                  <Input
                    classNames={{
                      label: "text-slate-300 font-medium",
                      inputWrapper:
                        "border-slate-600 hover:border-slate-500 group-data-[focus=true]:border-magenta-fuchsia-500 group-data-[focus=true]:bg-slate-700/50",
                      input: "text-white placeholder:text-slate-500",
                    }}
                    defaultValue={eventToUpdate.url_provider}
                    label="Enlace de compra"
                    name="url_provider"
                    placeholder="Ej: https://passline.com/evento"
                    variant="bordered"
                    onChange={handleChange}
                  />
                  <span
                    aria-live="polite"
                    className={`text-xs absolute left-0 ${stateValidations.url_provider ? "visible text-red-400" : "invisible"}`}
                    role="alert"
                  >
                    {stateValidations.url_provider}
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

                    if (form) {
                      form.requestSubmit();
                    }
                  }}
                >
                  Actualizar Evento
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
