import { AuthChrome } from "@/shared/components/layout";
import { ProtectedRouteUnilink } from "@/shared/components/guards";

export default function RegisterBusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthChrome backUrl="/login">
      <ProtectedRouteUnilink>{children}</ProtectedRouteUnilink>
    </AuthChrome>
  );
}
