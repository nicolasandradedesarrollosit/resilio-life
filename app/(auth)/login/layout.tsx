import { AuthChrome } from "@/shared/components/layout";
import { ProtectedRouteLogin } from "@/shared/components/guards";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRouteLogin>
      <AuthChrome backUrl="/">{children}</AuthChrome>
    </ProtectedRouteLogin>
  );
}
