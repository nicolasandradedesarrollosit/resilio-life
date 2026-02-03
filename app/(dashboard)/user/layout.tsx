import { ProtectedRouteUser } from "@/shared/components/guards";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRouteUser>{children}</ProtectedRouteUser>;
}
