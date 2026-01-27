import ProtectedRouteUser from "@/hooks/ProtectedRouteUser";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRouteUser>{children}</ProtectedRouteUser>;
}
