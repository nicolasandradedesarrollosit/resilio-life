"use client"
import { Button } from "@heroui/button"
import NextLink from "next/link"
import { Avatar } from "@heroui/avatar"
import { useDispatch, useSelector } from "react-redux"
import { selectUserDataOnly } from "@/redux/userSlice"
import { Users, LogOut, Calendar, Gift, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image"
import { selectIsNavOpen, toggleNav } from "@/redux/navbarSlice"
import ModalLogOut from "./ModalLogOut"
import { useModal } from "@/hooks/useModal"
import { useRouter } from "next/navigation"

export interface NavbarAdminProps {
    currentPageName: string;
}

export default function NavbarAdmin({ currentPageName }: NavbarAdminProps) {
    const dispatch = useDispatch();
    const isNavOpen = useSelector(selectIsNavOpen);
    const userData = useSelector(selectUserDataOnly);
    const { onOpen: onOpenLogOut } = useModal('logOutModal');
    const router = useRouter();

    const buttons = [
        {
            name: "Usuarios",
            svg: <Users className="h-5 w-5" />,
            link: "/admin"
        },
        {
            name: "Eventos",
            svg: <Calendar className="h-5 w-5" />,
            link: "/admin/events"
        },
        {
            name: "Beneficios",
            svg: <Gift className="h-5 w-5" />,
            link: "/admin/orders"
        }
    ]
    
    return (
        <>
            <Button
                isIconOnly
                className="hidden md:flex fixed top-8 left-4 z-50 bg-magenta-fuchsia-600 text-white hover:bg-magenta-fuchsia-700 transition-all duration-300 shadow-lg"
                onPress={() => dispatch(toggleNav())}
                size="sm"
            >
                {isNavOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>

            <nav className={`hidden md:flex flex-col items-center justify-start h-screen fixed top-0 left-0 transition-all duration-300 ease-out overflow-hidden ${
                isNavOpen 
                    ? "w-72 bg-gradient-to-b from-magenta-fuchsia-950 via-magenta-fuchsia-900 to-magenta-fuchsia-950 shadow-2xl px-6 py-8 opacity-100 pointer-events-auto" 
                    : "w-1 bg-magenta-fuchsia-500 shadow-lg shadow-magenta-fuchsia-500/50 opacity-0 pointer-events-none px-0 py-0"
            }`}>
                <div className="my-12 relative group">
                    <Image src="/logo-icon.png" alt="Logo" width={60} height={40} className="object-contain" />
                </div>

                <div className="flex flex-col items-center w-full gap-4 flex-1">
                    {buttons.map((item, index) => (
                        <Button
                            isDisabled={currentPageName === item.name}
                            className={`w-full transition-all duration-300 ${
                                currentPageName === item.name 
                                    ? "bg-white text-magenta-fuchsia-950 shadow-lg shadow-white/20 scale-105" 
                                    : "bg-white/5 text-white/90 hover:bg-white/10 hover:scale-102 border border-white/10"
                            }`}
                            startContent={
                                <span className={currentPageName === item.name ? "text-magenta-fuchsia-600" : ""}>
                                    {item.svg}
                                </span>
                            }
                            key={index}
                            variant="solid"
                            size="lg"
                            onPress={() => {
                                router.push(item.link);
                            }}
                        >
                            <span className="font-semibold text-base">{item.name}</span>
                        </Button>
                    ))}
                </div>

                <div className="mt-auto w-full">
                    <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-5 space-y-4">
                        <div className="flex flex-row items-center gap-3">
                            <Avatar 
                                className="bg-gradient-to-br from-magenta-fuchsia-400 to-magenta-fuchsia-600 text-white font-semibold ring-2 ring-white/20" 
                                name={userData?.name?.[0] || "U"}
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate">
                                    {userData?.name} {userData?.lastName}
                                </p>
                                <p className="text-xs text-white/60">Administrador</p>
                            </div>
                        </div>
                        
                        <Button
                            className="w-full bg-red-500/10 text-red-300 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-200"
                            startContent={<LogOut className="h-4 w-4" />}
                            size="md"
                            onPress={onOpenLogOut}
                        >
                            Cerrar Sesión
                        </Button>
                    </div>
                </div>
            </nav>

            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe">
                <div className="mx-4 mb-4 rounded-2xl shadow-2xl overflow-hidden bg-white/95 backdrop-blur-lg border border-gray-100">
                    <div className="flex flex-row justify-around items-center px-2 py-1">
                        {buttons.map((item, index) => (
                            <Button
                                aria-current={currentPageName === item.name ? 'page' : undefined}
                                className={`flex-1 flex flex-col items-center justify-center gap-1.5 px-2 py-3 min-h-[64px] rounded-xl transition-all duration-200 ${
                                    currentPageName === item.name 
                                        ? "bg-magenta-fuchsia-50" 
                                        : "bg-transparent hover:bg-gray-50"
                                }`}
                                key={index}
                                size="md"
                                variant="light"
                                as={NextLink}
                                href={item.link}
                                aria-label={item.name}
                            >
                                <span className={`flex items-center justify-center h-6 w-6 transition-colors ${
                                    currentPageName === item.name 
                                        ? "text-magenta-fuchsia-600" 
                                        : "text-gray-600"
                                }`}>
                                    {item.svg}
                                </span>
                                <span className={`text-[11px] font-medium transition-colors ${
                                    currentPageName === item.name 
                                        ? "text-magenta-fuchsia-700" 
                                        : "text-gray-700"
                                }`}>
                                    {item.name}
                                </span>
                                {currentPageName === item.name && (
                                    <span className="block h-1 w-8 bg-magenta-fuchsia-600 rounded-full shadow-sm" aria-hidden />
                                )}
                            </Button>
                        ))}
                        <Button
                            aria-label="Salir"
                            className="flex-1 flex flex-col items-center justify-center gap-1.5 px-2 py-3 min-h-[64px] rounded-xl bg-transparent hover:bg-red-50 transition-all duration-200"
                            size="md"
                            variant="light"
                            onPress={onOpenLogOut}
                        >
                            <span className="flex items-center justify-center h-6 w-6 text-red-500">
                                <LogOut className="h-5 w-5" />
                            </span>
                            <span className="text-[11px] font-medium text-red-600">Salir</span>
                        </Button>
                    </div>
                </div>
            </div>
            <ModalLogOut />
        </>
    )
}