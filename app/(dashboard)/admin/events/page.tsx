"use client";
import { useSelector } from "react-redux";

import TableEvents from "./_components/TableEvents";

import { NavbarAdmin } from "@/shared/components/layout";
import { selectIsNavOpen } from "@/features/navbar/navbarSlice";

export default function EventsPage() {
  const isNavOpen = useSelector(selectIsNavOpen);

  return (
    <section className="min-h-[110vh] sm:min-h-screen w-full flex flex-row bg-gray-50">
      <NavbarAdmin currentPageName="Eventos" />
      <main
        className={`flex-1 min-h-screen transition-all duration-300 pb-32 md:pb-0 ${
          isNavOpen ? "md:ml-72" : "md:ml-0"
        }`}
      >
        <TableEvents />
      </main>
    </section>
  );
}
