'use client';
import { useUserData } from "@/hooks/useUserHook";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/common/Loader";

export default function ProtectedRouteAdmin({ children }: { children: React.ReactNode }) {
    const { userDataState } = useUserData();
    const router = useRouter();
    
    useEffect(() => {
        if (userDataState.loading || !userDataState.loaded) return;

        if (!userDataState.data) {
            router.push('/login');
        } else if (!userDataState.data.isAdmin) {
            router.push('/user');
        }
    }, [userDataState.loading, userDataState.loaded, userDataState.data, router]);

    if (userDataState.loading || !userDataState.loaded) {
        return <Loader fallback="Autenticando..."/>;
    }

    if (!userDataState.data || !userDataState.data.isAdmin) {
        return null;
    }

    return <>{children}</>;
}
