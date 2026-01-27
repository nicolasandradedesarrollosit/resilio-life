"use client";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { ClipboardList, Users, Gift } from "lucide-react";
import { useRouter } from "next/navigation";

import { useIsMobile } from "@/hooks/useIsMobile";

export default function SecondSection() {
  const IconWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="w-[200px] h-[200px] flex items-center justify-center">
      {children}
    </div>
  );

  const router = useRouter();

  const isMobile = useIsMobile();

  const svg1 = (
    <IconWrapper>
      <ClipboardList className="text-current" size={isMobile ? 25 : 40} />
    </IconWrapper>
  );

  const svg2 = (
    <IconWrapper>
      <Users className="text-current" size={isMobile ? 25 : 40} />
    </IconWrapper>
  );

  const svg3 = (
    <IconWrapper>
      <Gift className="text-current" size={isMobile ? 25 : 40} />
    </IconWrapper>
  );
  const steps = [
    {
      title: "Registrate",
      description:
        "Creá tu cuenta en pocos pasos y accedé a los planes de nuestra red de beneficios exclusivos.",
      svg: svg1,
    },
    {
      title: "Elegí tu partner",
      description:
        "Explorá las marcas asociadas, activá tus beneficios y empezá a ahorrar.",
      svg: svg2,
    },
    {
      title: "Disfrutá tus beneficios",
      description:
        "Acumulá puntos, recibí descuentos y accedé a promociones especiales.",
      svg: svg3,
    },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 w-full bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-4 sm:mb-5 md:mb-6 tracking-tight">
            ¿Cómo funciona?
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-magenta-fuchsia-500 to-transparent mx-auto mb-4 sm:mb-5 md:mb-6" />
          <p className="text-base sm:text-lg md:text-xl text-gray-600 font-light max-w-2xl mx-auto px-4">
            Comenzá a disfrutar de tus beneficios en 3 simples pasos
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="h-full bg-white border-[3px] border-magenta-fuchsia-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col items-center text-center shadow-sm hover:scale-105 transition-all duration-500 group "
            >
              <div className="absolute inset-0 bg-gradient-to-br from-magenta-fuchsia-50/0 to-magenta-fuchsia-50/0 group-hover:from-magenta-fuchsia-50/30 group-hover:to-transparent transition-all duration-500 rounded-2xl sm:rounded-3xl" />

              <CardHeader className="relative z-10">
                <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-full p-4 sm:p-5 mb-6 sm:mb-8 inline-flex items-center justify-center">
                  <span className="inline-flex items-center text-magenta-fuchsia-600 justify-center h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 text-gray-700">
                    {step.svg}
                  </span>
                </div>
              </CardHeader>

              <CardBody className="flex-1 relative z-10">
                <h3 className="font-medium text-xl sm:text-xl md:text-2xl mb-4 sm:mb-5 text-gray-900 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed font-light">
                  {step.description}
                </p>
              </CardBody>

              <div className="mt-6 sm:mt-8 relative z-10">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 text-magenta-fuchsia-600 flex items-center justify-center text-sm font-medium text-gray-400">
                  {index + 1}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div
          className="flex justify-center mt-12 sm:mt-16 md:mt-20 lg:mt-24"
          onClick={() => {
            router.push("/register");
          }}
        >
          <button className="px-8 cursor-pointer sm:px-10 py-3 sm:py-4 bg-magenta-fuchsia-600 text-white font-light text-base sm:text-lg rounded-full shadow-lg hover:shadow-xl hover:bg-magenta-fuchsia-700 transition-all duration-300 border border-magenta-fuchsia-600">
            Comenzar ahora
          </button>
        </div>
      </div>
    </section>
  );
}
