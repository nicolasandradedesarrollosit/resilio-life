"use client";
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useUserData } from "@/features/auth";
import { Loader } from "@/shared/components/ui";
import { getRedirectPath } from "@/shared/utils";

export const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { userDataState, isLoading, isLoaded } = useUserData();
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (isLoading || !isLoaded || hasRedirected.current) return;

    if (!userDataState.data) {
      hasRedirected.current = true;
      router.push("/login");

      return;
    }

    const target = getRedirectPath(userDataState.data);

    if (!pathname.startsWith(target)) {
      hasRedirected.current = true;
      router.push(target);
    }
  }, [isLoading, isLoaded, userDataState.data, router, pathname]);

  if (isLoading || !isLoaded) {
    return <Loader fallback="Autenticando..." />;
  }

  if (!userDataState.data) return null;

  const target = getRedirectPath(userDataState.data);

  if (!pathname.startsWith(target)) return null;

  return <>{children}</>;
};
