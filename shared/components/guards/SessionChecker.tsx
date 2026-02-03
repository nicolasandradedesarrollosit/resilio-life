"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { useUserData } from "@/hooks/useUserHook";
import { Loader } from "@/shared/components/ui";

const PUBLIC_ROUTES = [
  "/",
  "/contact",
  "/login",
  "/register",
  "/register-business/:token",
];

const isPublicRoute = (pathname: string) => {
  return PUBLIC_ROUTES.some((route) => {
    const pattern = route.replace(/:[^/]+/g, "[^/]+");
    const regex = new RegExp(`^${pattern}$`);

    return regex.test(pathname);
  });
};

export const SessionChecker = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();

  if (isPublicRoute(pathname)) {
    return <>{children}</>;
  }

  return <SessionCheckerAuth>{children}</SessionCheckerAuth>;
};

function SessionCheckerAuth({ children }: { children: React.ReactNode }) {
  const { userDataState } = useUserData();
  const router = useRouter();
  const pathname = usePathname();
  const isRedirecting = useRef(false);
  const hasLoadedOnce = useRef(false);

  if (userDataState.loaded) {
    hasLoadedOnce.current = true;
  }

  useEffect(() => {
    if (
      !userDataState.loading &&
      userDataState.loaded &&
      !isRedirecting.current
    ) {
      if (!userDataState.data) {
        if (pathname !== "/login") {
          isRedirecting.current = true;
          router.push("/login");
        }
      } else if (userDataState.data.role === 'Business') {
        if (!pathname.startsWith("/business")) {
          isRedirecting.current = true;
          router.push("/business");
        }
      } else if (userDataState.data.isAdmin) {
        if (!pathname.startsWith("/admin")) {
          isRedirecting.current = true;
          router.push("/admin");
        }
      } else {
        if (!pathname.startsWith("/user")) {
          isRedirecting.current = true;
          router.push("/user");
        }
      }
    }
  }, [
    userDataState.loading,
    userDataState.loaded,
    userDataState.data,
    router,
    pathname,
  ]);

  useEffect(() => {
    isRedirecting.current = false;
  }, [pathname]);

  if (!hasLoadedOnce.current) {
    if (userDataState.loading && !userDataState.loaded) {
      return <Loader fallback={"Cargando autenticación en el sistema..."} />;
    }

    if (!userDataState.loaded) {
      return <Loader fallback={"Verificando sesión..."} />;
    }
  }

  const isInCorrectRoute =
    (!userDataState.data && pathname === "/login") ||
    (userDataState.data?.role === 'Business' && pathname.startsWith("/business")) ||
    (userDataState.data?.isAdmin && pathname.startsWith("/admin")) ||
    (userDataState.data &&
      !userDataState.data.isAdmin &&
      userDataState.data.role !== 'Business' &&
      pathname.startsWith("/user"));

  if (!isInCorrectRoute) {
    return null;
  }

  return <>{children}</>;
}
