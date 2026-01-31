"use client";
import { useSelector } from "react-redux";

import NavbarUser from "@/common/NavbarUser";
import { selectIsNavOpen } from "@/redux/navbarSlice";

export default function BusinessPage() {
  const isNavOpen = useSelector(selectIsNavOpen);

  return (
    <section className="min-h-[110vh] sm:min-h-screen w-full flex flex-row bg-gray-50">
      <NavbarUser currentPageName="Inicio" />
      <main
        className={`flex-1 min-h-screen transition-all duration-300 pb-32 md:pb-0 ${isNavOpen ? "md:ml-72" : "md:ml-0"
          }`}
      />
    </section>
  );
}
