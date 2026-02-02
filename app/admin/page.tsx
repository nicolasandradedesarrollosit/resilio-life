"use client";
import { useSelector } from "react-redux";

import TableUsers from "./_components/TableUsers";

import NavbarAdmin from "@/common/NavbarAdmin";
import { selectIsNavOpen } from "@/features/navbar/navbarSlice";

export default function HomeAdminPage() {
  const isNavOpen = useSelector(selectIsNavOpen);

  return (
    <section className="min-h-[110vh] sm:min-h-screen w-full flex flex-row bg-gray-50">
      <NavbarAdmin currentPageName="Usuarios" />
      <main
        className={`flex-1 min-h-screen transition-all duration-300 pb-32 md:pb-0 ${
          isNavOpen ? "md:ml-72" : "md:ml-0"
        }`}
      >
        <TableUsers />
      </main>
    </section>
  );
}
