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
import { redirect } from "next/navigation";

export default function ModalLogOut() {
    const { logOut } = useUserData();
    const userData = useSelector(selectUserDataOnly)
    const { isOpen, onOpenChange } = useModal('logOutModal');
    const isMobile = useIsMobile();
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
            window.location.href = '/';
        }
    }, [shouldLogOut, isLoading, logOut, hasLoggedOut]);

    const handleLogOut = async () => {
        setShouldLogOut(true);
    };
    return (
        <Modal
            isOpen={isOpen as any}
            onOpenChange={onOpenChange}
            size={isMobile ? "3xl" : "xl"}
            backdrop="blur"
            scrollBehavior="inside"
            classNames={{
                body: "py-6 sm:py-8 px-4 sm:px-6 flex flex-col items-center justify-start",
                base: "bg-black text-white max-h-[95vh] rounded-lg shadow-xl",
                header: "text-center pt-6 sm:pt-8 pb-3 sm:pb-4 px-4 sm:px-6",
                footer: "border-t-[1px] border-[#292f46] py-4 sm:py-5 px-4 sm:px-6",
                closeButton: "hover:bg-white/5 active:bg-white/10 top-2 right-2 sm:top-3 sm:right-3",
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 items-center">
                            <div className="flex flex-row items-center gap-3">
                                <Avatar className="w-10 h-10" />
                                <div className="text-left">
                                    <h1 className="tracking-wider text-white/90 text-lg sm:text-xl md:text-2xl font-bold">
                                        {userData?.name} {userData?.lastName}
                                    </h1>
                                    <p className="text-white/60 text-sm">Cerrar sesión</p>
                                </div>
                            </div>
                        </ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col items-center gap-4 py-4">
                                <p className='text-white/80 text-sm sm:text-base md:text-lg text-center px-2'>
                                    ¿Estás seguro que deseas cerrar sesión?
                                </p>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <div className="flex flex-col sm:flex-row justify-end gap-3 w-full">
                                <Button
                                    variant="solid"
                                    onPress={onClose}
                                    className="w-full sm:w-auto bg-white text-black data-[hover=true]:bg-gray-200 transition-all duration-200 text-sm sm:text-base"
                                    size={isMobile ? "md" : "lg"}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    color="danger"
                                    variant="solid"
                                    onPress={async () => {
                                        onClose();
                                        await handleLogOut();
                                    }}
                                    isLoading={isLoading}
                                    className="w-full sm:w-auto text-sm sm:text-base"
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