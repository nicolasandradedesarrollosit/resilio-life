'use client';
import Loader from "@/common/Loader";
import { useUserData } from "@/hooks/userHook";
import { useEffect } from "react";

export default function ProtectedRouteAdmin({ children }: { children: React.ReactNode }) {
    const { userDataState } = useUserData();
    
    useEffect(() => {
        if (userDataState.loading || !userDataState.loaded) return;

        if (!userDataState.data) {
            window.location.href = '/login';
        } else if (!userDataState.data.isAdmin) {
            window.location.href = '/user';
        }
    }, [userDataState.loading, userDataState.loaded, userDataState.data]);

    if (userDataState.loading || !userDataState.loaded) {
        return <Loader fallback={"Verificando permisos de administrador..."} />;
    }

    if (!userDataState.data || !userDataState.data.isAdmin) {
        return <Loader fallback={"Redirigiendo..."} />;
    }

    return <>{children}</>;
}
