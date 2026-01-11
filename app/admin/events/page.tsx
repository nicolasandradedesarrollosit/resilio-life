"use client"
import NavbarAdmin from "@/common/NavbarAdmin"
import TableEvents from "./_components/TableEvents"
import { useSelector } from "react-redux"
import { selectIsNavOpen } from "@/redux/navbarSlice"

export default function HomeAdminPage() {
    const isNavOpen = useSelector(selectIsNavOpen);

    return (
        <section className="min-h-screen w-full flex flex-row bg-gray-50">
            <NavbarAdmin currentPageName="Eventos" />
            <main className={`flex-1 min-h-screen transition-all duration-300 ${
                isNavOpen ? "md:ml-72" : "md:ml-0"
            }`}>
                <TableEvents />
            </main>
        </section>
    )
}