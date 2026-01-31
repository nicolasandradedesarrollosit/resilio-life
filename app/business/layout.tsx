import ProtectedRouteBusiness from "@/hooks/ProtectedRouteBusiness";

export default function BusinessLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <ProtectedRouteBusiness>{children}</ProtectedRouteBusiness>;
}
