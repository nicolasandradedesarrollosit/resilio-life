"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { useUserData } from "@/hooks/useUserHook";
import Loader from "@/common/Loader";

export default function ProtectedRouteBusiness({
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
    } else if (userDataState.data.role !== "Business") {
      hasRedirected.current = true;
      if (userDataState.data.isAdmin) {
        router.push("/admin");
      } else {
        router.push("/user");
      }
    }
  }, [isLoading, isLoaded, userDataState.data, router]);

  if (isLoading || !isLoaded) {
    return <Loader fallback="Autenticando..." />;
  }

  if (!userDataState.data || userDataState.data.role !== "Business") {
    return null;
  }

  return <>{children}</>;
}
