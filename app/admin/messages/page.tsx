"use client"
import NavbarAdmin from "@/common/NavbarAdmin"
import TableMessages from "./_components/TableMessages"
import { useSelector } from "react-redux"
import { selectIsNavOpen } from "@/redux/navbarSlice"

export default function MessagesPage() {
    const isNavOpen = useSelector(selectIsNavOpen);

    return (
        <section className="min-h-[110vh] sm:min-h-screen w-full flex flex-row bg-gray-50">
            <NavbarAdmin currentPageName="Mensajes" />
            <main className={`flex-1 min-h-screen transition-all duration-300 pb-32 md:pb-0 ${isNavOpen ? "md:ml-72" : "md:ml-0"
                }`}>
                <TableMessages />
            </main>
        </section>
    )
}