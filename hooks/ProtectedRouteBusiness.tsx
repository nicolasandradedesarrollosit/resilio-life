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
    } else if (!userDataState.data.is_business) {
      hasRedirected.current = true;
      router.push("/user");
    }
  }, [isLoading, isLoaded, userDataState.data, router]);

  if (isLoading || !isLoaded) {
    return <Loader fallback="Autenticando..." />;
  }

  if (!userDataState.data || !userDataState.data.is_business) {
    return null;
  }

  return <>{children}</>;
}
