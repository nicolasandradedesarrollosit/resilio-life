'use client';
import Loader from "@/common/Loader";
import { useUserData } from "@/hooks/userHook";
import { useEffect, useRef } from "react";

export default function ProtectedRouteUser({ children }: { children: React.ReactNode }) {
    const { userDataState, isLoading, isLoaded } = useUserData();
    const hasRedirected = useRef(false);

    useEffect(() => {
        // Si sigue cargando o no ha terminado, esperar
        if (isLoading || !isLoaded) return;
        
        // Evitar loops de redirección
        if (hasRedirected.current) return;

        // <-- redirections -->
        if (!userDataState.data) {
            hasRedirected.current = true;
            window.location.href = '/login';
        } else if (userDataState.data.isAdmin) {
            hasRedirected.current = true;
            window.location.href = '/admin';
        }
    }, [isLoading, isLoaded, userDataState.data]);

    if (isLoading || !isLoaded) {
        return <Loader fallback={"Verificando sesión..."} />;
    }

    if (!userDataState.data || userDataState.data.isAdmin) {
        return <Loader fallback={"Redirigiendo..."} />;
    }
    
    // <-- authorized user -->
    return <>{children}</>;
}
