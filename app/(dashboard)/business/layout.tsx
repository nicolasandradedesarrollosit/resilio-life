import { ProtectedRouteBusiness } from "@/shared/components/guards";

export default function BusinessLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <ProtectedRouteBusiness>{children}</ProtectedRouteBusiness>;
}
