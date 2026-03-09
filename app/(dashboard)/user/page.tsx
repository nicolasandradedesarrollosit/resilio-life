"use client";
import { useSelector } from "react-redux";
import { Gift, MapPin, Receipt } from "lucide-react";
import NextLink from "next/link";
import { Button } from "@heroui/button";
import { DashboardLayout, USER_NAV_ITEMS } from "@/shared/components/layout";
import { selectUserDataOnly } from "@/features/auth/authSlice";

export default function HomeUserPage() {
  const userData = useSelector(selectUserDataOnly);

  return (
    <DashboardLayout currentPageName="Inicio" items={USER_NAV_ITEMS} roleLabel="Usuario">
      <div className="p-4 md:p-8">
        <div className="mb-5 md:mb-8">
          <h1 className="text-lg md:text-2xl font-bold text-gray-900">
            Hola, {userData?.name ?? "Usuario"} 👋
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Bienvenido a tu panel de Resilio</p>
        </div>

        <div className="bg-gradient-to-r from-magenta-fuchsia-600 to-magenta-fuchsia-500 rounded-2xl p-4 md:p-6 mb-5 md:mb-8 text-white">
          <p className="text-white/80 text-xs md:text-sm mb-1">Tus puntos disponibles</p>
          <p className="text-3xl md:text-4xl font-bold">{userData?.points ?? 0}</p>
          <p className="text-white/70 text-xs md:text-sm mt-1">puntos</p>
        </div>

        <div className="grid grid-cols-3 gap-3 md:gap-4">
          <Button
            as={NextLink}
            href="/user/benefits"
            className="h-auto p-3 md:p-5 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl flex flex-col items-start gap-2 md:gap-3"
            variant="light"
          >
            <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-magenta-fuchsia-50 flex items-center justify-center text-magenta-fuchsia-600">
              <Gift className="h-4 w-4 md:h-5 md:w-5" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 text-xs md:text-sm">Beneficios</p>
              <p className="text-[10px] md:text-xs text-gray-400 hidden sm:block">Ver catálogo</p>
            </div>
          </Button>

          <Button
            as={NextLink}
            href="/user/redeemed"
            className="h-auto p-3 md:p-5 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl flex flex-col items-start gap-2 md:gap-3"
            variant="light"
          >
            <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-magenta-fuchsia-50 flex items-center justify-center text-magenta-fuchsia-600">
              <Receipt className="h-4 w-4 md:h-5 md:w-5" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 text-xs md:text-sm">Canjeados</p>
              <p className="text-[10px] md:text-xs text-gray-400 hidden sm:block">Historial</p>
            </div>
          </Button>

          <Button
            as={NextLink}
            href="/user/map"
            className="h-auto p-3 md:p-5 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl flex flex-col items-start gap-2 md:gap-3"
            variant="light"
          >
            <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-magenta-fuchsia-50 flex items-center justify-center text-magenta-fuchsia-600">
              <MapPin className="h-4 w-4 md:h-5 md:w-5" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 text-xs md:text-sm">Mapa</p>
              <p className="text-[10px] md:text-xs text-gray-400 hidden sm:block">Negocios</p>
            </div>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
