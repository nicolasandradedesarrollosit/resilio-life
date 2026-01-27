"use client";
import ProtectedRouteAdmin from "@/hooks/ProtectedRouteAdmin";
import { useUsers } from "@/hooks/useUsers";
import { useEvents } from "@/hooks/useEvents";
import { useMessages } from "@/hooks/useMessages";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useUsers();
  useEvents();
  useMessages();

  return <ProtectedRouteAdmin>{children}</ProtectedRouteAdmin>;
}
