import { AuthChrome } from "@/shared/components/layout";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthChrome backUrl="/login">{children}</AuthChrome>;
}
