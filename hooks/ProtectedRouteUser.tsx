'use client';
import Loader from "@/common/Loader";
import { useUserData } from "@/hooks/useAuthHook";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRouteUser({ children }: { children: React.ReactNode }) {
    const { userDataState, isLoading, isLoaded } = useUserData();
    const router = useRouter();
    const hasRedirected = useRef(false);

    useEffect(() => {
        // Si sigue cargando o no ha terminado, esperar
        if (isLoading || !isLoaded) return;
        
        // Evitar loops de redirección
        if (hasRedirected.current) return;

        // <-- redirections -->
        if (!userDataState.data) {
            hasRedirected.current = true;
            router.push('/login');
        } else if (userDataState.data.isAdmin) {
            hasRedirected.current = true;
            router.push('/admin');
        }
    }, [isLoading, isLoaded, userDataState.data, router]);

    if (isLoading || !isLoaded) {
        return <Loader fallback={"Verificando sesión..."} />;
    }

    if (!userDataState.data || userDataState.data.isAdmin) {
        return null;
    }
    
    // <-- authorized user -->
    return <>{children}</>;
}
