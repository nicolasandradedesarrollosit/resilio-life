import ProtectedRouteUnilink from "@/hooks/ProtectedRouteUnilink";

export default function RegisterBusinessLayout({ children }: { children: React.ReactNode }) {
    return <ProtectedRouteUnilink>{children}</ProtectedRouteUnilink>;
}
