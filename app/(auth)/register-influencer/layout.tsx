import { AuthChrome } from "@/shared/components/layout";
import { ProtectedRouteUnilinkInfluencer } from "@/shared/components/guards";

export default function RegisterInfluencerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthChrome backUrl="/login">
      <ProtectedRouteUnilinkInfluencer>{children}</ProtectedRouteUnilinkInfluencer>
    </AuthChrome>
  );
}
