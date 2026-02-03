import { ProtectedRouteUnilink } from "@/shared/components/guards";

export default function RegisterBusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRouteUnilink>{children}</ProtectedRouteUnilink>;
}
