"use client";
import { ProtectedRouteAdmin } from "@/shared/components/guards";
import { useUsers } from "@/features/allUsers";
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
