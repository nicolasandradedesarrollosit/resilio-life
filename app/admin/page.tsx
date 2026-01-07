import ProtectedRouteAdmin from "@/hooks/ProtectedRouteAdmin"

export default function HomeAdminPage() {
    return (
        <ProtectedRouteAdmin>
            <section className="min-h-screen w-full flex flex-col justify-center items-center">
                <h1>Admin Home Page</h1>
                <span>Esta es la página de administración</span>
            </section>
        </ProtectedRouteAdmin>
    )
}