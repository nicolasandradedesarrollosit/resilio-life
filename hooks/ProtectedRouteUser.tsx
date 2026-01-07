'use client';
import Loader from "@/common/Loader";
import { useUserData } from "@/hooks/userHook";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRouteUser({ children }: { children: React.ReactNode }) {
    const { userDataState } = useUserData();
    const router = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        if (userDataState.loading || !userDataState.loaded) return;
        
        // <-- redirections -->
        if (!userDataState.data) {
            setIsRedirecting(true);
            router.replace('/login');
        } else if (userDataState.data.isAdmin) {
            setIsRedirecting(true);
            router.replace('/admin');
        }
    }, [userDataState.loading, userDataState.loaded, userDataState.data, router]);

    if (userDataState.loading || !userDataState.loaded) {
        return <Loader fallback={"Verificando sesión..."} />;
    }

    if (isRedirecting || !userDataState.data || userDataState.data.isAdmin) {
        return <Loader fallback={"Redirigiendo..."} />;
    }
    
    // <-- authorized user -->
    return <>{children}</>;
}
