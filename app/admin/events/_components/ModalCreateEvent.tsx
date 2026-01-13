import {Modal, 
    ModalContent,
    ModalBody,
    ModalFooter,
    ModalHeader
} from "@heroui/modal";
import {useModal} from "@/hooks/useModal";
import {useState} from "react";
import { Button } from "@heroui/button";
import { useIsMobile } from "@/hooks/useIsMobile";
import Image from "next/image";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { DatePicker } from "@heroui/date-picker";
import { ImageIcon } from "lucide-react";

export default function ModalCreateEvent() {
    const {isOpen, onOpenChange} = useModal('createEventModal');
    
    const isMobile = useIsMobile();
    const [isLoading, setIsLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Modal
        isOpen={isOpen as boolean}
        onOpenChange={onOpenChange}
        size={isMobile ? "3xl" : "2xl"}
        backdrop="blur"
        scrollBehavior="inside"
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
                            <Form className="w-full space-y-5 flex flex-col items-center">
                                <div className="w-4/5 space-y-2">
                                    <Input
                                        label="Título"
                                        placeholder="Ej: Festival de Música 2024"
                                        variant="bordered"
                                        classNames={{
                                            label: "text-slate-300 font-medium",
                                            inputWrapper: "border-slate-600 hover:border-slate-500 group-data-[focus=true]:border-magenta-fuchsia-500 group-data-[focus=true]:bg-slate-700/50",
                                            input: "text-white placeholder:text-slate-500"
                                        }}
                                    />
                                </div>

                                <div className="w-4/5 space-y-2">
                                    <Textarea
                                        label="Descripción"
                                        placeholder="Describe brevemente el evento..."
                                        minRows={3}
                                        variant="bordered"
                                        classNames={{
                                            label: "text-slate-300 font-medium",
                                            inputWrapper: "border-slate-600 hover:border-slate-500 group-data-[focus=true]:border-magenta-fuchsia-500 group-data-[focus=true]:bg-slate-700/50",
                                            input: "text-white placeholder:text-slate-500"
                                        }}
                                    />
                                </div>

                                <div className="w-4/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <DatePicker
                                            label="Fecha del evento"
                                            variant="bordered"
                                            classNames={{
                                                label: "text-slate-300 font-medium",
                                                inputWrapper: "border-slate-600 hover:border-slate-500 group-data-[focus=true]:border-magenta-fuchsia-500",
                                                input: "text-white"
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Input
                                            label="Ubicación"
                                            placeholder="Ej: Buenos Aires, Argentina"
                                            variant="bordered"
                                            classNames={{
                                                label: "text-slate-300 font-medium",
                                                inputWrapper: "border-slate-600 hover:border-slate-500 group-data-[focus=true]:border-magenta-fuchsia-500 group-data-[focus=true]:bg-slate-700/50",
                                                input: "text-white placeholder:text-slate-500"
                                            }}
                                        />
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

                                <div className="w-4/5 space-y-2">
                                    <Input 
                                        label="Enlace de compra"
                                        placeholder="Ej: https://passline.com/evento"
                                        variant="bordered"
                                        classNames={{
                                            label: "text-slate-300 font-medium",
                                            inputWrapper: "border-slate-600 hover:border-slate-500 group-data-[focus=true]:border-magenta-fuchsia-500 group-data-[focus=true]:bg-slate-700/50",
                                            input: "text-white placeholder:text-slate-500"
                                        }}
                                    />
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
                                    className="w-full sm:w-auto bg-gradient-to-r from-magenta-fuchsia-600 to-magenta-fuchsia-500 hover:from-magenta-fuchsia-700 hover:to-magenta-fuchsia-600 text-white text-sm sm:text-base font-semibold shadow-lg transition-all duration-200"
                                    size={isMobile ? "md" : "lg"}
                                    onPress={async () => {
                                        onClose();
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