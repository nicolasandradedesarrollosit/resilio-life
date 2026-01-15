import {
    Modal,
    ModalContent,
    ModalBody,
    ModalFooter,
    ModalHeader
} from "@heroui/modal";
import { useModal } from "@/hooks/useModal";
import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { useIsMobile } from "@/hooks/useIsMobile";
import Image from "next/image";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { DatePicker } from "@heroui/date-picker";
import { ImageIcon } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { useDispatch } from "react-redux";
import { addEvent } from "@/redux/eventsSlice";

interface StateValidations {
    title: string | null;
    description: string | null;
    date: string | null;
    location: string | null;
    image: string | null;
    url_provider: string | null;
}

export default function ModalCreateEvent() {
    const { isOpen, onOpenChange } = useModal('createEventModal');
    const dispatch = useDispatch();
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

    const { loading: isLoading, error, data } = useApi({
        endpoint: '/events',
        method: 'POST',
        includeCredentials: true,
        body: formData,
        enabled: formData !== null,
    });

    useEffect(() => {
        if (data && data.data) {
            dispatch(addEvent(data.data));
            setFormData(null);
            setImageFile(null);
            setImagePreview(null);
            setSelectedDate(null);
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
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (!value || value.trim() === '') {
            setStateValidations(prev => ({ ...prev, [name]: 'Este campo es requerido' }));
            return;
        }

        const regex = validationRegex[name as keyof typeof validationRegex];
        const isValid = regex ? regex.test(value) : true;

        let errorMessage = null;
        if (!isValid) {
            switch (name) {
                case 'title':
                    errorMessage = 'El título debe tener entre 3 y 100 caracteres';
                    break;
                case 'description':
                    errorMessage = 'La descripción debe tener entre 10 y 500 caracteres';
                    break;
                case 'location':
                    errorMessage = 'La ubicación debe tener entre 3 y 100 caracteres';
                    break;
                case 'url_provider':
                    errorMessage = 'Debe ser una URL válida (http:// o https://)';
                    break;
            }
        }

        setStateValidations(prev => ({ ...prev, [name]: errorMessage }));
    };

    const handleDateChange = (date: any) => {
        setSelectedDate(date);
        setStateValidations(prev => ({
            ...prev,
            date: !date ? 'La fecha es requerida' : null,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            setStateValidations(prev => ({ ...prev, image: 'La imagen es requerida' }));
            setImagePreview(null);
            setImageFile(null);
            return;
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            setStateValidations(prev => ({ ...prev, image: 'La imagen no debe superar los 5MB' }));
            setImagePreview(null);
            setImageFile(null);
            return;
        }

        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            setStateValidations(prev => ({ ...prev, image: 'Solo se permiten imágenes (JPG, PNG, WEBP)' }));
            setImagePreview(null);
            setImageFile(null);
            return;
        }

        setImageFile(file);
        setStateValidations(prev => ({ ...prev, image: null }));

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();

            const hasErrors = Object.values(stateValidations).some(error => error !== null);
            if (hasErrors) return;

            if (!selectedDate) {
                setStateValidations(prev => ({ ...prev, date: 'La fecha es requerida' }));
                return;
            }

            if (!imageFile) {
                return;
            }

            const formDataObj = new FormData(e.currentTarget);

            const dateStr = selectedDate.toString().split('T')[0];
            formDataObj.append('date', dateStr);

            formDataObj.append('image', imageFile);

            setFormData(formDataObj);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <Modal
            isOpen={isOpen as boolean}
            onOpenChange={onOpenChange}
            size={isMobile ? "3xl" : "2xl"}
            backdrop="blur"
            scrollBehavior="inside"
            isDismissable={false}
            classNames={{
                body: "py-6 sm:py-8 px-6 sm:px-8 flex flex-col justify-start gap-0 w-screen max-w-[calc(100vw-3rem)] sm:max-w-full",
                base: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white max-h-[95vh] rounded-lg shadow-2xl border border-slate-700/50 w-full",
                header: "text-center pt-6 sm:pt-8 pb-3 sm:pb-4 px-6 sm:px-8 border-b border-slate-700/30",
                footer: "border-t border-slate-700/30 py-4 sm:py-5 px-6 sm:px-8 bg-slate-900/50",
                closeButton: "hover:bg-white/10 active:bg-white/20 top-2 right-2 sm:top-3 sm:right-3",
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col w-full items-center gap-4 sm:gap-5">
                            <Image
                                src="/logo-icon.png"
                                alt="Logo Icon"
                                width={40}
                                height={40}
                            />
                            <div>
                                <h2 className='text-white font-semibold text-lg sm:text-xl'>Crear nuevo evento</h2>
                                <p className='text-slate-400 text-xs sm:text-sm mt-1'>Completa los detalles del evento</p>
                            </div>
                        </ModalHeader>
                        <ModalBody className="flex flex-col items-center">
                            <Form onSubmit={handleSubmit} className="w-full space-y-5 flex flex-col items-center">
                                <div className="w-4/5 space-y-2 relative">
                                    <Input
                                        name="title"
                                        label="Título"
                                        placeholder="Ej: Festival de Música 2024"
                                        variant="bordered"
                                        onChange={handleChange}
                                        classNames={{
                                            label: "text-slate-300 font-medium",
                                            inputWrapper: "border-slate-600 hover:border-slate-500 group-data-[focus=true]:border-magenta-fuchsia-500 group-data-[focus=true]:bg-slate-700/50",
                                            input: "text-white placeholder:text-slate-500"
                                        }}
                                    />
                                    <span
                                        role="alert"
                                        aria-live="polite"
                                        className={`text-xs absolute left-0 ${stateValidations.title ? "visible text-red-400" : "invisible"}`}
                                    >
                                        {stateValidations.title}
                                    </span>
                                </div>

                                <div className="w-4/5 space-y-2 relative">
                                    <Textarea
                                        name="description"
                                        label="Descripción"
                                        placeholder="Describe brevemente el evento..."
                                        minRows={3}
                                        variant="bordered"
                                        onChange={handleChange}
                                        classNames={{
                                            label: "text-slate-300 font-medium",
                                            inputWrapper: "border-slate-600 hover:border-slate-500 group-data-[focus=true]:border-magenta-fuchsia-500 group-data-[focus=true]:bg-slate-700/50",
                                            input: "text-white placeholder:text-slate-500"
                                        }}
                                    />
                                    <span
                                        role="alert"
                                        aria-live="polite"
                                        className={`text-xs absolute left-0 ${stateValidations.description ? "visible text-red-400" : "invisible"}`}
                                    >
                                        {stateValidations.description}
                                    </span>
                                </div>

                                <div className="w-4/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2 relative">
                                        <DatePicker
                                            label="Fecha del evento"
                                            variant="bordered"
                                            onChange={handleDateChange}
                                            classNames={{
                                                label: "text-slate-300 font-medium",
                                                inputWrapper: "border-slate-600 hover:border-slate-500 group-data-[focus=true]:border-magenta-fuchsia-500",
                                                input: "text-white"
                                            }}
                                        />
                                        <span
                                            role="alert"
                                            aria-live="polite"
                                            className={`text-xs absolute left-0 ${stateValidations.date ? "visible text-red-400" : "invisible"}`}
                                        >
                                            {stateValidations.date}
                                        </span>
                                    </div>
                                    <div className="space-y-2 relative">
                                        <Input
                                            name="location"
                                            label="Ubicación"
                                            placeholder="Ej: Buenos Aires, Argentina"
                                            variant="bordered"
                                            onChange={handleChange}
                                            classNames={{
                                                label: "text-slate-300 font-medium",
                                                inputWrapper: "border-slate-600 hover:border-slate-500 group-data-[focus=true]:border-magenta-fuchsia-500 group-data-[focus=true]:bg-slate-700/50",
                                                input: "text-white placeholder:text-slate-500"
                                            }}
                                        />
                                        <span
                                            role="alert"
                                            aria-live="polite"
                                            className={`text-xs absolute left-0 ${stateValidations.location ? "visible text-red-400" : "invisible"}`}
                                        >
                                            {stateValidations.location}
                                        </span>
                                    </div>
                                </div>

                                <div className="w-4/5 space-y-3">
                                    <label className="text-slate-300 font-medium text-sm block">Imagen del evento</label>
                                    <div className="relative">
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            variant="bordered"
                                            placeholder="Selecciona una imagen"
                                            classNames={{
                                                inputWrapper: "border-slate-600 hover:border-slate-500 group-data-[focus=true]:border-magenta-fuchsia-500 group-data-[focus=true]:bg-slate-700/50",
                                                input: "text-white placeholder:text-slate-500 file:text-white file:bg-slate-700 file:border-0 file:rounded file:px-3 file:py-1 file:cursor-pointer hover:file:bg-slate-600"
                                            }}
                                        />
                                    </div>

                                    <span
                                        role="alert"
                                        aria-live="polite"
                                        className={`text-xs block ${stateValidations.image ? "visible text-red-400" : "invisible"}`}
                                    >
                                        {stateValidations.image}
                                    </span>

                                    {imagePreview ? (
                                        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-slate-600 bg-slate-800">
                                            <img
                                                src={imagePreview}
                                                alt="Vista previa"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setImagePreview(null)}
                                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
                                                aria-label="Eliminar imagen"
                                            >
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="w-full h-32 rounded-lg border-2 border-dashed border-slate-600 flex flex-col items-center justify-center bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                                            <ImageIcon size={32} className="text-slate-500 mb-2" />
                                            <p className="text-slate-400 text-sm">Sube una imagen para ver la vista previa</p>
                                        </div>
                                    )}
                                </div>

                                <div className="w-4/5 space-y-2 relative">
                                    <Input
                                        name="url_provider"
                                        label="Enlace de compra"
                                        placeholder="Ej: https://passline.com/evento"
                                        variant="bordered"
                                        onChange={handleChange}
                                        classNames={{
                                            label: "text-slate-300 font-medium",
                                            inputWrapper: "border-slate-600 hover:border-slate-500 group-data-[focus=true]:border-magenta-fuchsia-500 group-data-[focus=true]:bg-slate-700/50",
                                            input: "text-white placeholder:text-slate-500"
                                        }}
                                    />
                                    <span
                                        role="alert"
                                        aria-live="polite"
                                        className={`text-xs absolute left-0 ${stateValidations.url_provider ? "visible text-red-400" : "invisible"}`}
                                    >
                                        {stateValidations.url_provider}
                                    </span>
                                </div>
                            </Form>
                        </ModalBody>
                        <ModalFooter>
                            <div className="flex flex-col sm:flex-row justify-end gap-3 w-full">
                                <Button
                                    variant="bordered"
                                    onPress={onClose}
                                    className="w-full sm:w-auto border-slate-600 text-slate-200 hover:border-slate-500 hover:bg-slate-700/50 transition-all duration-200 text-sm sm:text-base font-medium"
                                    size={isMobile ? "md" : "lg"}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    className="w-full sm:w-auto bg-gradient-to-r from-magenta-fuchsia-600 to-magenta-fuchsia-500 hover:from-magenta-fuchsia-700 hover:to-magenta-fuchsia-600 text-white text-sm sm:text-base font-semibold shadow-lg transition-all duration-200"
                                    size={isMobile ? "md" : "lg"}
                                    onPress={async () => {
                                        const form = document.querySelector('form');
                                        if (form) {
                                            form.requestSubmit();
                                        }
                                    }}
                                    isLoading={isLoading}
                                >
                                    Crear Evento
                                </Button>
                            </div>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}