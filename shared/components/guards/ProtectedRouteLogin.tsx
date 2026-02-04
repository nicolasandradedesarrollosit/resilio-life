"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Loader } from "@/shared/components/ui";
import { useUserData } from "@/features/auth";
import { getRedirectPath } from "@/shared/utils";

export const ProtectedRouteLogin = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { userDataState } = useUserData();
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (userDataState.loggedIn && userDataState.data) {
      router.push(getRedirectPath(userDataState.data));

      return;
    }

    if (userDataState.loaded && !userDataState.loggedIn) {
      setShowContent(true);
    }

    const timeout = setTimeout(() => {
      if (!userDataState.loaded) {
        setShowContent(true);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [
    userDataState.loggedIn,
    userDataState.loaded,
    userDataState.data,
    router,
  ]);

  if (userDataState.loggedIn && userDataState.data) {
    return <Loader fallback="Redirigiendo..." />;
  }

  if (!showContent && !userDataState.loaded) {
    return <Loader fallback="Verificando sesión..." />;
  }

  return <>{children}</>;
};
