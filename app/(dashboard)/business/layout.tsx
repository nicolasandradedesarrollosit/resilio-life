import { ProtectedRoute } from "@/shared/components/guards";

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
