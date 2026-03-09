"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useApi } from "@/shared/hooks";
import { Loader } from "@/shared/components/ui";

export const ProtectedRouteUnilink = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const pathSegments = pathname.split("/").filter(Boolean);
  const token = pathSegments[pathSegments.length - 1];
  const hasToken =
    pathSegments.length >= 2 && pathSegments[0] === "register-business";

  const { loading, data, error } = useApi({
    body: {
      token: token,
    },
    method: "POST",
    endpoint: "/check-unilink",
    enabled: hasToken,
  });

  const available = data?.data?.available;

  useEffect(() => {
    if (!loading && hasToken && (error || (data && !available))) {
      router.push("/");
    }
  }, [loading, available, data, error, hasToken, router]);

  if (!hasToken) {
    return null;
  }

  if (loading || !data) {
    return <Loader fallback="Autenticando token..." />;
  }

  if (error || !available) {
    return null;
  }

  return children;
};
