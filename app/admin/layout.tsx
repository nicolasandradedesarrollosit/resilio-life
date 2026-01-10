import ProtectedRouteAdmin from "@/hooks/ProtectedRouteAdmin";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRouteAdmin>{children}</ProtectedRouteAdmin>;
}
