"use client";
import { useSelector } from "react-redux";
import { User, Mail, Star, Calendar, LogOut } from "lucide-react";
import { Button } from "@heroui/button";
import { selectUserDataOnly } from "@/features/auth/authSlice";
import { useModal } from "@/shared/hooks";
import { ModalLogOut } from "@/shared/components/ui";

export default function UserProfile() {
  const userData = useSelector(selectUserDataOnly);
  const { onOpen: onOpenLogOut } = useModal("logOutModal");

  if (!userData) return null;

  const fields = [
    { icon: User, label: "Nombre", value: `${userData.name} ${userData.lastName}` },
    { icon: Mail, label: "Email", value: userData.email },
    { icon: Star, label: userData.isInfluencer ? "Tipo de cuenta" : "Puntos", value: userData.isInfluencer ? "Influencer" : `${userData.points ?? 0} puntos` },
    {
      icon: Calendar,
      label: "Miembro desde",
      value: userData.createdAt
        ? new Date(userData.createdAt).toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
        : "—",
    },
  ];

  return (
    <div className="p-4 md:p-8">
      <div className="mb-5 md:mb-8">
        <h1 className="text-lg md:text-2xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-xs md:text-sm text-gray-500 mt-1">Tu información personal</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full max-w-lg">
        <div className="bg-gradient-to-r from-magenta-fuchsia-600 to-magenta-fuchsia-500 p-4 md:p-6 flex items-center gap-3 md:gap-4">
          <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-white/20 flex items-center justify-center text-white text-xl md:text-2xl font-bold shrink-0">
            {userData.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-base md:text-lg truncate">
              {userData.name} {userData.lastName}
            </p>
            <p className="text-white/80 text-xs md:text-sm truncate">{userData.email}</p>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {fields.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 md:gap-4 p-4 md:p-5">
              <div className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-magenta-fuchsia-50 flex items-center justify-center text-magenta-fuchsia-600 shrink-0">
                <Icon className="h-4 w-4 md:h-5 md:w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] md:text-xs text-gray-400">{label}</p>
                <p className="text-gray-900 font-medium text-sm md:text-base truncate">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        className="md:hidden mt-6 w-full max-w-lg bg-red-500/10 text-red-600 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-200"
        startContent={<LogOut className="h-4 w-4" />}
        onPress={onOpenLogOut}
      >
        Cerrar Sesión
      </Button>

      <ModalLogOut />
    </div>
  );
}
