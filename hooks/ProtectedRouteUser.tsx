"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import Loader from "@/common/Loader";
import { useUserData } from "@/hooks/useUserHook";

export default function ProtectedRouteUser({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userDataState, isLoading, isLoaded } = useUserData();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (isLoading || !isLoaded) return;

    if (hasRedirected.current) return;

    if (!userDataState.data) {
      hasRedirected.current = true;
      router.push("/login");
    } else if (userDataState.data.role === "Business") {
      hasRedirected.current = true;
      router.push("/business");
    } else if (userDataState.data.isAdmin) {
      hasRedirected.current = true;
      router.push("/admin");
    }
  }, [isLoading, isLoaded, userDataState.data, router]);

  if (isLoading || !isLoaded) {
    return <Loader fallback="Autenticando..." />;
  }

  if (!userDataState.data || userDataState.data.isAdmin) {
    return null;
  }

  return <>{children}</>;
}
