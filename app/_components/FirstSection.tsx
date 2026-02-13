"use client";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { CreditCard, Star, Zap, Smartphone } from "lucide-react";

import { useIsMobile } from "@/shared/hooks";

export default function FirstSection() {
  const IconWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="w-[200px] h-[200px] flex items-center justify-center">
      {children}
    </div>
  );

  const isMobile = useIsMobile();

  const svg1 = (
    <IconWrapper>
      <CreditCard className="text-current" size={isMobile ? 25 : 40} />
    </IconWrapper>
  );
  const svg2 = (
    <IconWrapper>
      <Star className="text-current" size={isMobile ? 25 : 40} />
    </IconWrapper>
  );
  const svg3 = (
    <IconWrapper>
      <Zap className="text-current" size={isMobile ? 25 : 40} />
    </IconWrapper>
  );
  const svg4 = (
    <IconWrapper>
      <Smartphone className="text-current" size={isMobile ? 25 : 40} />
    </IconWrapper>
  );

  const features = [
    {
      title: "Descuentos exclusivos",
      description: "Accedé a precios preferenciales en marcas asociadas.",
      svg: svg1,
    },
    {
      title: "Acumulación de puntos",
      description: "Sumá puntos con cada compra y canjealos por beneficios.",
      svg: svg2,
    },
    {
      title: "Acceso prioritario",
      description: "Entrá primero a promociones y lanzamientos limitados.",
      svg: svg3,
    },
    {
      title: "Gestión simple",
      description: "Todo desde una app centralizada, fácil y rápida.",
      svg: svg4,
    },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 w-full bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-stretch">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="h-full bg-white border border-gray-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:border-magenta-fuchsia-200 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-magenta-fuchsia-50/0 to-magenta-fuchsia-50/0 group-hover:from-magenta-fuchsia-50/30 group-hover:to-transparent transition-all duration-500 rounded-2xl sm:rounded-3xl" />

              <CardHeader className="relative z-10">
                <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-full p-4 sm:p-5 mb-6 sm:mb-8 inline-flex items-center justify-center group-hover:from-magenta-fuchsia-100 group-hover:to-magenta-fuchsia-50 transition-all duration-500">
                  <span className="inline-flex items-center text-magenta-fuchsia-600 justify-center h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 text-gray-700">
                    {feature.svg}
                  </span>
                </div>
              </CardHeader>

              <CardBody className="flex-1 relative z-10">
                <h3 className="font-medium text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 text-gray-900 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed font-light">
                  {feature.description}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
