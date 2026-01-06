'use client';
import Loader from "@/common/Loader";
import { useUserData } from "@/hooks/userHook";

export default function ProtectedRouteRole({ children }: { children: React.ReactNode }) {
    const { userDataState } = useUserData();

    // Mostrar loader mientras carga (mínimo 1 segundo está garantizado en el hook)
    if (userDataState.loading) {
        return <Loader fallback={"Cargando autenticación en el sistema..."} />;
    }

    // Si no hay datos o no es admin, no renderizar
    if (!userDataState.data || !userDataState.data.isAdmin) {
        return null;
    }

    return children;
}
