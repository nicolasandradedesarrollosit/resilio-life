"use client";
import { ProtectedRouteAdmin } from "@/shared/components/guards";
import { useUsers } from "@/features/allUsers";
import { useEvents } from "@/features/events";
import { useMessages } from "@/features/messages";

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
