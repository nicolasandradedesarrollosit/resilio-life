"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useApi } from "./useApi";

import Loader from "@/common/Loader";

export default function ProtectedRouteUnilink({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const token = pathname.split("/").pop();

  const { loading, data, error } = useApi({
    body: {
      token: token,
    },
    method: "POST",
    endpoint: "/check-unilink",
    enabled: true,
  });

  const available = data?.available;

  useEffect(() => {
    if (!loading && data && !available) {
      router.push("/");
    }
  }, [loading, available, data, router]);

  if (loading || !data) {
    return <Loader fallback="Autenticando token..." />;
  }

  if (error || !available) {
    return null;
  }

  return children;
}
