import UnverifiedEmailBanner from "@/features/auth/components/UnverifiedEmailBanner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <UnverifiedEmailBanner />
      {children}
    </>
  );
}
