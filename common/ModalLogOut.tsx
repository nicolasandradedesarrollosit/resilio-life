import {
    Modal,
    ModalContent,
    ModalBody,
    ModalFooter,
    ModalHeader
} from "@heroui/modal"
import { useUserData } from "@/hooks/useUserHook";
import { useApi } from "@/hooks/useApi";
import { Avatar } from "@heroui/avatar";
import { useModal } from "@/hooks/useModal";
import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useSelector } from "react-redux";
import { selectUserDataOnly } from "@/redux/userSlice";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function ModalLogOut() {
    const { logOut } = useUserData();
    const userData = useSelector(selectUserDataOnly)
    const { isOpen, onOpenChange } = useModal('logOutModal');
    const isMobile = useIsMobile();
    const router = useRouter();
    const [shouldLogOut, setShouldLogOut] = useState(false);
    const [hasLoggedOut, setHasLoggedOut] = useState(false);

    const { loading: isLoading } = useApi({
        endpoint: '/logout',
        method: 'GET',
        enabled: shouldLogOut,
        includeCredentials: true,
    });

    useEffect(() => {
        if (shouldLogOut && !isLoading && !hasLoggedOut) {
            setHasLoggedOut(true);
            logOut();
            router.push('/');
        }
    }, [shouldLogOut, isLoading, logOut, hasLoggedOut, router]);

    const handleLogOut = async () => {
        setShouldLogOut(true);
    };
    return (
        <Modal
            radius="lg"
            isOpen={isOpen as any}
            onOpenChange={onOpenChange}
            size={isMobile ? "3xl" : "xl"}
            backdrop="blur"
            scrollBehavior="inside"
            classNames={{
                body: "py-6 sm:py-8 px-6 sm:px-8 flex flex-col items-center justify-start",
                base: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white max-h-[95vh] rounded-lg shadow-2xl border border-slate-700/50",
                header: "text-center pt-6 sm:pt-8 pb-3 sm:pb-4 px-6 sm:px-8 border-b border-slate-700/30",
                footer: "border-t border-slate-700/30 py-4 sm:py-5 px-6 sm:px-8 bg-slate-900/50",
                closeButton: "hover:bg-white/10 active:bg-white/20 top-2 right-2 sm:top-3 sm:right-3",
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-3 items-center">
                            <div className="flex flex-row items-center gap-4">
                                <Avatar
                                    className="w-12 h-12 sm:w-14 sm:h-14 ring-2 ring-slate-700/50"
                                    classNames={{
                                        base: "bg-gradient-to-br from-magenta-fuchsia-400/20 to-magenta-fuchsia-500/20"
                                    }}
                                />
                                <div className="text-left">
                                    <h1 className="tracking-wide text-white text-lg sm:text-xl font-semibold">
                                        {userData?.name} {userData?.lastName}
                                    </h1>
                                    <p className="text-slate-400 text-xs sm:text-sm mt-0.5">Cerrar sesión</p>
                                </div>
                            </div>
                        </ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col items-center gap-6 py-6">
                                <div className="relative flex h-24 w-24 items-center justify-center mb-6 bg-magenta-fuchsia-700/20 rounded-full">
                                    <LogOut className="w-8 h-8 text-red-400" />
                                    <div className="absolute inset-0 rounded-full border-2 border-magenta-fuchsia-500/30 scale-125"></div>
                                </div>
                                <p className='text-slate-300 text-sm sm:text-base text-center px-4 max-w-sm leading-relaxed'>
                                    ¿Estás seguro que deseas cerrar sesión?
                                </p>
                            </div>
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
                                    onPress={async () => {
                                        onClose();
                                        await handleLogOut();
                                    }}
                                    isLoading={isLoading}
                                    className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white text-sm sm:text-base font-semibold shadow-lg transition-all duration-200"
                                    size={isMobile ? "md" : "lg"}
                                >
                                    Cerrar sesión
                                </Button>
                            </div>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}